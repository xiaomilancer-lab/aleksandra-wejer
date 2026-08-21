import "server-only";

import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requirePsychologist } from "@/app/panel/server/requirePsychologist";

const COOKIE_NAME = "psycholka-patient-vault";
const SESSION_SECONDS = 10 * 60;
const LOCK_SECONDS = 15 * 60;
const MAX_FAILED_ATTEMPTS = 5;

type VaultMetadata = Record<string, unknown> & {
  patient_vault_pin_hash?: string;
  patient_vault_pin_salt?: string;
  patient_vault_failed_attempts?: number;
  patient_vault_last_failed_at?: string;
  patient_vault_locked_until?: string | null;
  patient_vault_pin_set_at?: string;
};

export type PatientVaultState = {
  configured: boolean;
  unlocked: boolean;
  lockedUntil: string | null;
};

function signingKey() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("Patient vault signing key is unavailable.");
  return createHash("sha256").update(`psycholka-patient-vault:${serviceKey}`).digest();
}

function sign(value: string) {
  return createHmac("sha256", signingKey()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionToken(userId: string, expiresAt: number) {
  const value = `${userId}.${expiresAt}`;
  return `${value}.${sign(value)}`;
}

function validSessionToken(token: string | undefined, userId: string) {
  if (!token) return false;
  const [tokenUserId, expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!tokenUserId || !signature || tokenUserId !== userId || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  return safeEqual(signature, sign(`${tokenUserId}.${expiresAt}`));
}

function pinHash(pin: string, salt: string) {
  return scryptSync(pin, salt, 32, { N: 16_384, r: 8, p: 1 }).toString("hex");
}

async function getUserMetadata(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data.user) throw new Error("Nie udało się odczytać zabezpieczenia konta.");
  return { user: data.user, metadata: data.user.app_metadata as VaultMetadata };
}

async function updateMetadata(userId: string, metadata: VaultMetadata) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { app_metadata: metadata });
  if (error) throw new Error("Nie udało się zapisać zabezpieczenia konta.");
}

export async function getPatientVaultState(userId: string): Promise<PatientVaultState> {
  const { metadata } = await getUserMetadata(userId);
  const cookieStore = await cookies();
  const lockedUntil = typeof metadata.patient_vault_locked_until === "string" && new Date(metadata.patient_vault_locked_until).getTime() > Date.now()
    ? metadata.patient_vault_locked_until
    : null;
  return {
    configured: Boolean(metadata.patient_vault_pin_hash && metadata.patient_vault_pin_salt),
    // Older deployments used a narrower /panel/patients cookie. A browser can
    // temporarily send both cookie variants with the same name, so accepting
    // only the first one can create an unlock loop even when the new token is
    // valid. Check every matching cookie and accept any valid signed session.
    unlocked: cookieStore.getAll(COOKIE_NAME).some((cookie) => validSessionToken(cookie.value, userId)),
    lockedUntil,
  };
}

export async function requirePatientVaultAccess() {
  const identity = await requirePsychologist();
  const state = await getPatientVaultState(identity.userId);
  if (!state.configured || !state.unlocked) {
    throw new Error("Sejf danych pacjentów jest zablokowany. Odblokuj go kodem PIN.");
  }
  return identity;
}

export async function verifyAccountPassword(email: string | null, password: string) {
  if (!email || !password) return false;
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (data.session) await client.auth.signOut();
  return !error && Boolean(data.user);
}

export async function configurePatientVault(userId: string, pin: string) {
  const { metadata } = await getUserMetadata(userId);
  if (metadata.patient_vault_pin_hash) throw new Error("PIN jest już ustawiony.");
  const salt = randomBytes(16).toString("hex");
  await updateMetadata(userId, {
    ...metadata,
    patient_vault_pin_hash: pinHash(pin, salt),
    patient_vault_pin_salt: salt,
    patient_vault_pin_set_at: new Date().toISOString(),
    patient_vault_failed_attempts: 0,
    patient_vault_last_failed_at: undefined,
    patient_vault_locked_until: null,
  });
  await openPatientVaultSession(userId);
}

export async function replacePatientVaultPin(userId: string, pin: string) {
  const { metadata } = await getUserMetadata(userId);
  const salt = randomBytes(16).toString("hex");
  await updateMetadata(userId, {
    ...metadata,
    patient_vault_pin_hash: pinHash(pin, salt),
    patient_vault_pin_salt: salt,
    patient_vault_pin_set_at: new Date().toISOString(),
    patient_vault_failed_attempts: 0,
    patient_vault_last_failed_at: undefined,
    patient_vault_locked_until: null,
  });
  await openPatientVaultSession(userId);
}

export async function verifyPatientVaultPin(userId: string, pin: string) {
  const { metadata } = await getUserMetadata(userId);
  const storedHash = metadata.patient_vault_pin_hash;
  const salt = metadata.patient_vault_pin_salt;
  if (!storedHash || !salt) return { ok: false, lockedUntil: null };

  const lockedUntilMs = typeof metadata.patient_vault_locked_until === "string" ? new Date(metadata.patient_vault_locked_until).getTime() : 0;
  if (lockedUntilMs > Date.now()) return { ok: false, lockedUntil: metadata.patient_vault_locked_until ?? null };

  const candidate = pinHash(pin, salt);
  if (safeEqual(candidate, storedHash)) {
    await updateMetadata(userId, { ...metadata, patient_vault_failed_attempts: 0, patient_vault_last_failed_at: undefined, patient_vault_locked_until: null });
    await openPatientVaultSession(userId);
    return { ok: true, lockedUntil: null };
  }

  const lastFailedAt = typeof metadata.patient_vault_last_failed_at === "string" ? new Date(metadata.patient_vault_last_failed_at).getTime() : 0;
  const previousAttempts = Date.now() - lastFailedAt <= LOCK_SECONDS * 1000 && typeof metadata.patient_vault_failed_attempts === "number"
    ? metadata.patient_vault_failed_attempts
    : 0;
  const failedAttempts = previousAttempts + 1;
  const lockedUntil = failedAttempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCK_SECONDS * 1000).toISOString() : null;
  await updateMetadata(userId, {
    ...metadata,
    patient_vault_failed_attempts: failedAttempts >= MAX_FAILED_ATTEMPTS ? 0 : failedAttempts,
    patient_vault_last_failed_at: new Date().toISOString(),
    patient_vault_locked_until: lockedUntil,
  });
  return { ok: false, lockedUntil };
}

async function openPatientVaultSession(userId: string) {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(userId, expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/panel",
    maxAge: SESSION_SECONDS,
    priority: "high",
  });
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/panel/patients",
    maxAge: 0,
  });
}

export async function closePatientVaultSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/panel",
    maxAge: 0,
  });
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/panel/patients",
    maxAge: 0,
  });
}

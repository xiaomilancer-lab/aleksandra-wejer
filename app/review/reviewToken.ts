import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const REVIEW_TOKEN_PURPOSE = "review";
const REVIEW_TOKEN_VERSION = 1;
const DEFAULT_TTL_SECONDS = 14 * 24 * 60 * 60;

type ReviewTokenPayload = {
  version: typeof REVIEW_TOKEN_VERSION;
  purpose: typeof REVIEW_TOKEN_PURPOSE;
  patientId: string;
  expiresAt: number;
};

function getSecret() {
  const secret = process.env.REVIEW_LINK_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function sign(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function isPatientId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function createReviewToken(patientId: string, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const secret = getSecret();
  if (!secret) throw new Error("REVIEW_LINK_SECRET must contain at least 32 characters.");
  if (!isPatientId(patientId)) throw new Error("Invalid patient identifier.");

  const payload: ReviewTokenPayload = {
    version: REVIEW_TOKEN_VERSION,
    purpose: REVIEW_TOKEN_PURPOSE,
    patientId,
    expiresAt: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyReviewToken(token: string): ReviewTokenPayload | null {
  const secret = getSecret();
  const [encodedPayload, suppliedSignature, extraPart] = token.split(".");
  if (!secret || !encodedPayload || !suppliedSignature || extraPart) return null;

  const expectedSignature = sign(encodedPayload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<ReviewTokenPayload>;
    if (
      payload.version !== REVIEW_TOKEN_VERSION ||
      payload.purpose !== REVIEW_TOKEN_PURPOSE ||
      !isPatientId(payload.patientId) ||
      typeof payload.expiresAt !== "number" ||
      !Number.isInteger(payload.expiresAt) ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) return null;

    return payload as ReviewTokenPayload;
  } catch {
    return null;
  }
}

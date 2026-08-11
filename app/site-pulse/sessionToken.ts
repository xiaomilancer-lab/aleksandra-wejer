import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const TOKEN_PURPOSE = "site-pulse";
const TOKEN_VERSION = 1;
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

type SitePulseSessionPayload = {
  version: typeof TOKEN_VERSION;
  purpose: typeof TOKEN_PURPOSE;
  journeyId: string;
  expiresAt: number;
};

function getSecret() {
  const secret = process.env.SITE_PULSE_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSitePulseSessionToken() {
  const secret = getSecret();
  if (!secret) throw new Error("SITE_PULSE_SESSION_SECRET must contain at least 32 characters.");
  const payload: SitePulseSessionPayload = {
    version: TOKEN_VERSION,
    purpose: TOKEN_PURPOSE,
    journeyId: randomUUID(),
    expiresAt: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return { token: `${encoded}.${sign(encoded, secret)}`, expiresAt: payload.expiresAt };
}

export function verifySitePulseSessionToken(token: string): SitePulseSessionPayload | null {
  const secret = getSecret();
  const [encoded, suppliedSignature, extra] = token.split(".");
  if (!secret || !encoded || !suppliedSignature || extra) return null;
  const expectedSignature = sign(encoded, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<SitePulseSessionPayload>;
    if (payload.version !== TOKEN_VERSION || payload.purpose !== TOKEN_PURPOSE || typeof payload.journeyId !== "string" || !isUuid(payload.journeyId) || !Number.isInteger(payload.expiresAt) || payload.expiresAt! <= Math.floor(Date.now() / 1000)) return null;
    return payload as SitePulseSessionPayload;
  } catch {
    return null;
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

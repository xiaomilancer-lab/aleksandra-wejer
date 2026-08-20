const JSON_CONTENT_TYPES = ["application/json", "application/ld+json"];

export const PUBLIC_INPUT_LIMITS = {
  name: 120,
  phone: 40,
  email: 254,
  category: 80,
  message: 2000,
  bodyBytes: 12_000,
} as const;

export function acceptsPublicJson(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (!contentType || !JSON_CONTENT_TYPES.includes(contentType)) return false;

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(contentLength) && contentLength >= 0 && contentLength <= PUBLIC_INPUT_LIMITS.bodyBytes;
}

export function cleanRequiredText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\u0000/g, "");
  return cleaned.length > 0 && cleaned.length <= maxLength ? cleaned : null;
}

export function cleanOptionalText(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return "";
  return cleanRequiredText(value, maxLength);
}

export function isValidEmail(value: string) {
  return value === "" || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= PUBLIC_INPUT_LIMITS.email);
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isClockTime(value: unknown): value is string {
  return typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value);
}

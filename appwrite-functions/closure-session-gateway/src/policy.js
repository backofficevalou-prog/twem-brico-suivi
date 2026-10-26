import crypto from "node:crypto";

export const ALLOWED_ACTORS = Object.freeze({
  "backoffice@twem.be": { name: "Valou", role: "supadmin_twem" },
  "emir@twem.be": { name: "Emir", role: "admin_twem" }
});

export function actorPolicy(email = "") {
  return ALLOWED_ACTORS[String(email).trim().toLowerCase()] || null;
}

export function profileFromPeopleDocument(entry = {}) {
  let payload = {};
  try { payload = JSON.parse(entry.payload_json || "{}"); } catch {}
  return {
    id: String(entry.$id || payload.id || ""),
    name: String(entry.name || payload.name || "").trim(),
    email: String(entry.email || payload.email || "").trim().toLowerCase(),
    role: String(entry.role || payload.role || ""),
    pin: String(entry.pin || payload.pin || "").replace(/\D/g, ""),
    pinStatus: String(entry.pinStatus || payload.pinStatus || "active"),
    pinExpiresAt: String(entry.pinExpiresAt || payload.pinExpiresAt || ""),
    pinCreatedAt: String(entry.pinCreatedAt || payload.pinCreatedAt || "")
  };
}

export function validPinProfile(profile = {}, submittedPin = "") {
  const expected = actorPolicy(profile.email);
  const pin = String(submittedPin || "").replace(/\D/g, "");
  if (!expected || expected.name !== profile.name || expected.role !== profile.role || profile.pinStatus !== "active" || !pin || pin !== profile.pin) return false;
  if (profile.pinExpiresAt && Date.now() > new Date(`${profile.pinExpiresAt}T23:59:59`).getTime()) return false;
  return true;
}

function tokenSignature(encoded, secret) {
  return crypto.createHmac("sha256", String(secret || "")).update(encoded).digest("base64url");
}

export function issueAccessToken(actor = {}, secret = "", now = Date.now()) {
  if (!secret) throw new Error("TOKEN_SECRET_MISSING");
  const encoded = Buffer.from(JSON.stringify({ sub: actor.userId || actor.id || "", name: actor.name, email: actor.email, role: actor.role, sessionVersion: actor.sessionVersion || "", iat: now, exp: now + 2 * 60 * 60 * 1000 }), "utf8").toString("base64url");
  return `${encoded}.${tokenSignature(encoded, secret)}`;
}

export function verifyAccessToken(token = "", secret = "", now = Date.now()) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature || !secret) return null;
  const expected = tokenSignature(encoded, secret);
  const left = Buffer.from(signature); const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < now || !actorPolicy(payload.email)) return null;
    return { userId: payload.sub, name: payload.name, email: payload.email, role: payload.role, sessionVersion: payload.sessionVersion || "", expiresAt: payload.exp };
  } catch { return null; }
}

export function isAllowedRecordType(value) {
  return ["dstny", "brico", "brico_general"].includes(String(value || ""));
}

export function sanitizedDocumentData(input = {}, actor = {}, current = null) {
  const recordType = String(input.record_type || current?.record_type || "");
  if (!isAllowedRecordType(recordType)) throw new Error("TYPE_INVALIDE");
  const payloadText = String(input.payload_json ?? current?.payload_json ?? "{}");
  if (Buffer.byteLength(payloadText, "utf8") > 900_000) throw new Error("PAYLOAD_TROP_GRAND");
  let payload;
  try { payload = JSON.parse(payloadText); } catch { throw new Error("PAYLOAD_JSON_INVALIDE"); }
  const now = new Date().toISOString();
  payload.auditTrail = [...(Array.isArray(payload.auditTrail) ? payload.auditTrail : []), {
    at: now,
    userId: String(actor.userId || ""),
    email: String(actor.email || ""),
    name: String(actor.name || ""),
    action: current ? "update" : "create"
  }].slice(-200);
  return {
    record_type: recordType,
    store_code: String(input.store_code ?? current?.store_code ?? "").slice(0, 32),
    title: String(input.title ?? current?.title ?? "").trim().slice(0, 255),
    ticket: String(input.ticket ?? current?.ticket ?? "").trim().slice(0, 64),
    status: String(input.status ?? current?.status ?? "En attente").slice(0, 64),
    payload_json: JSON.stringify(payload),
    updated_at: now,
    updated_by: String(actor.email || actor.name || "").slice(0, 128),
    version: Number(current?.version || 0) + 1
  };
}

export const ALLOWED_ACTORS = Object.freeze({
  "backoffice@twem.be": { name: "Valou", role: "supadmin_twem" },
  "emir@twem.be": { name: "Emir", role: "admin_twem" }
});

export function actorPolicy(email = "") {
  return ALLOWED_ACTORS[String(email).trim().toLowerCase()] || null;
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

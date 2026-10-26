import crypto from "node:crypto";
import { Client, Databases, Query } from "node-appwrite";
import { profileFromPeopleDocument, sanitizedDocumentData, verifyAccessToken } from "./policy.js";

const DATABASE = process.env.APPWRITE_DATABASE_ID || "twem_brico";
const COLLECTION = process.env.APPWRITE_CLOSURE_COLLECTION_ID || "closure_rollout_tool";
const PEOPLE = process.env.APPWRITE_PEOPLE_COLLECTION_ID || "people";
const STORES = process.env.APPWRITE_STORES_COLLECTION_ID || "stores";

function services() {
  const client = new Client()
    .setEndpoint(process.env.TWEM_APPWRITE_ENDPOINT || process.env.APPWRITE_FUNCTION_API_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
    .setProject(process.env.TWEM_APPWRITE_PROJECT_ID || process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.TWEM_APPWRITE_API_KEY || process.env.APPWRITE_FUNCTION_API_KEY);
  return { databases: new Databases(client) };
}

function body(req) {
  if (req.bodyJson && typeof req.bodyJson === "object") return req.bodyJson;
  try { return JSON.parse(req.bodyText || "{}"); } catch { return {}; }
}

function failure(res, status, code, message) {
  return res.json({ ok: false, code, message }, status);
}

function tokenSecret() {
  return process.env.CLOSURE_HANDOFF_SECRET || process.env.TWEM_APPWRITE_API_KEY || process.env.APPWRITE_FUNCTION_API_KEY || "";
}

async function requireActor(req, res, databases, input = {}) {
  const tokenActor = verifyAccessToken(input.accessToken, tokenSecret());
  if (!tokenActor) return { response: failure(res, 401, "SIGNED_SESSION_REQUIRED", "Session TWEM Brico sécurisée requise.") };
  const people = await databases.listDocuments(DATABASE, PEOPLE, [Query.limit(500)]);
  const profile = people.documents.map(profileFromPeopleDocument).find((entry) => entry.id === tokenActor.userId && entry.email === tokenActor.email && entry.name === tokenActor.name && entry.role === tokenActor.role);
  if (!profile || profile.pinStatus !== "active" || String(profile.pinCreatedAt || "") !== String(tokenActor.sessionVersion || "")) return { response: failure(res, 403, "SESSION_REVOKED", "Cette session TWEM Brico a été révoquée.") };
  return tokenActor;
}

export default async ({ req, res, error }) => {
  try {
    const { databases } = services();
    const input = body(req);
    const action = String(input.action || "list");
    const actor = await requireActor(req, res, databases, input);
    if (actor.response) return actor.response;
    if (action === "ping") return res.json({ ok: true, actor: { name: actor.name, email: actor.email, role: actor.role } });
    if (action === "list") {
      const [result, stores] = await Promise.all([
        databases.listDocuments(DATABASE, COLLECTION, [Query.limit(500)]),
        databases.listDocuments(DATABASE, STORES, [Query.limit(500)])
      ]);
      const storesByCode = new Map(stores.documents.map((row) => { let payload={};try{payload=JSON.parse(row.payload_json||"{}")}catch{}return [String(payload.code||row.code||""),payload] }));
      const documents = result.documents.map((document) => {
        if (document.record_type !== "brico") return document;
        let payload={};try{payload=JSON.parse(document.payload_json||"{}")}catch{}
        const source=storesByCode.get(document.store_code),workflow=source?.workflow||{};
        const remarks=(workflow.closureReportRemarks||[]).map((item) => ({ id:item.id||"", label:item.label||"", category:item.category||item.label||"Rapport de clôture", text:item.comment||item.text||item.label||"", response:item.response||"", decision:item.decision||"", owner:item.owner||"Valou / Emir", nextAction:item.nextAction||"", dueDate:item.dueDate||"", status:item.status||(!item.response&&!item.decision?"Réponse requise":"Répondu"), responseAt:item.responseAt||item.updatedAt||"", responseBy:item.responseBy||item.updatedBy||"" }));
        const secureDocument=(item,kind) => { const value=typeof item==="string"?{name:item}:item||{};return { ...value, kind, source:value.externalUrl?.includes("drive.google.com")?"Google Drive":value.fileId?"Appwrite sécurisé":"TWEM Brico", documentDate:value.receivedAt||value.createdAt||value.updatedAt||"", matchMethod:"Numéro magasin", matchStatus:"Validé", validated:true } };
        const installationDocuments=(workflow.installationDocuments||[]).filter((item) => item.installationKind === "installation_zip" || /\.zip$/i.test(item.name||"")).map((item) => secureDocument(item,"installationZip"));
        const installationReports=[...(workflow.installationReports||[]),...(workflow.installationDocuments||[]).filter((item) => item.installationKind === "installation_report")].map((item) => secureDocument(item,"installationReport"));
        const fnpDocuments=(workflow.signedFnpDocuments||[]).map((item) => secureDocument(item,"fnp"));
        const signedReports=(workflow.signedClosureDocuments||[]).map((item) => secureDocument(item,"signedClosure"));
        const callflows=(workflow.callflowDocuments||[]).map((item) => secureDocument(item,"callflow"));
        if (workflow.regionalManager) payload.regionalManager=workflow.regionalManager;
        if (typeof workflow.algoConnected === "boolean") payload.algoConnected=workflow.algoConnected;
        payload.liveDocuments={ installationZip:installationDocuments, installationReport:installationReports, fnp:fnpDocuments, signedClosure:signedReports, callflow:callflows, refreshedAt:new Date().toISOString(), matchingRule:"Numéro magasin exact" };
        payload.liveClosure={ source:"stores.workflow", sourceStoreCode:document.store_code, signedReports, remarks, closureSignedDate:workflow.closureSignedDate||workflow.closureReportSignedDate||"", closureReviewStatus:workflow.closureReviewStatus||"", closureConclusion:workflow.closureConclusion||"", closureSummaryNote:workflow.closureSummaryNote||"" };
        return { ...document, payload_json:JSON.stringify(payload) };
      });
      return res.json({ ok: true, documents, actor: { name: actor.name, email: actor.email, role: actor.role } });
    }
    if (action === "update") {
      const documentId = String(input.documentId || "");
      if (!documentId) return failure(res, 400, "DOCUMENT_REQUIRED", "Identifiant obligatoire.");
      const current = await databases.getDocument(DATABASE, COLLECTION, documentId);
      if (Number(input.expectedVersion || 0) !== Number(current.version || 0)) return failure(res, 409, "VERSION_CONFLICT", "Le dossier a été modifié. Recharge avant d’enregistrer.");
      const data = sanitizedDocumentData(input.data || {}, actor, current);
      const updated = await databases.updateDocument(DATABASE, COLLECTION, documentId, data, []);
      return res.json({ ok: true, document: updated, actor: { name: actor.name, email: actor.email } });
    }
    if (action === "create") {
      if (String(input.data?.record_type || "") !== "dstny") return failure(res, 400, "CREATE_DSTNY_ONLY", "Seuls les points DSTNY peuvent être créés ici.");
      const data = sanitizedDocumentData(input.data || {}, actor, null);
      const documentId = `dstny-${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
      const created = await databases.createDocument(DATABASE, COLLECTION, documentId, data, []);
      return res.json({ ok: true, document: created, actor: { name: actor.name, email: actor.email } });
    }
    return failure(res, 400, "ACTION_UNKNOWN", "Action inconnue.");
  } catch (cause) {
    error(cause?.stack || String(cause));
    return failure(res, 500, "GATEWAY_ERROR", "L’action n’a pas pu être exécutée.");
  }
};

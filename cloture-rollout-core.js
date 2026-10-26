(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClosureRolloutCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DSTNY_ORDER = ["À demander", "En attente", "Répondu", "Résolu"];
  const BRICO_ORDER = ["Incomplet", "À contrôler", "Prêt pour clôture", "Clôturé"];
  const REQUIRED_DOCS = ["fnp", "installationReport", "callflow", "simStatement", "signedClosure"];
  const ALGO_CONNECTED_RESPONSE = "L’Algo Audio Alerter est préparé et configuré par Dstny. Son raccordement physique au système de sonorisation du magasin a été réalisé et est confirmé comme opérationnel.";
  const ALGO_PENDING_RESPONSE = "L’Algo Audio Alerter est préparé et configuré par Dstny. Son raccordement physique au système de sonorisation du magasin doit être réalisé par le partenaire externe de Brico. Dans de nombreux magasins, l’arrière de l’amplificateur est inaccessible ou l’équipement existant est trop ancien pour être directement compatible avec la technologie de l’Algo.";

  function safeParse(value, fallback = {}) {
    try { return JSON.parse(value || ""); } catch { return fallback; }
  }
  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(String(value || "").trim());
  }
  function normalizedIdentity(value = "") {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLowerCase();
  }
  function algoConnectionState(payload = {}, storeCode = "") {
    const managerMatchesRule = normalizedIdentity(payload.regionalManager) === "cedric desaive";
    const kraainemMatchesRule = String(storeCode || payload.storeCode || "").trim().toUpperCase() === "BRI-3669";
    const ruleConnected = managerMatchesRule || kraainemMatchesRule;
    const explicit = typeof payload.algoConnected === "boolean" ? payload.algoConnected : null;
    return {
      connected: explicit === true || ruleConnected,
      ruleConnected,
      explicit,
      contradiction: ruleConnected && explicit === false,
      source: kraainemMatchesRule ? "Exception Kraainem" : managerMatchesRule ? "Responsable régional Cédric Desaive" : explicit === true ? "Confirmation individuelle" : "Non confirmé"
    };
  }
  function algoSuggestedResponse(payload = {}, storeCode = "") {
    return algoConnectionState(payload, storeCode).connected ? ALGO_CONNECTED_RESPONSE : ALGO_PENDING_RESPONSE;
  }
  function hasOpenRemarks(payload = {}) {
    const remarks = payload.liveClosure?.remarks || payload.remarks || [];
    return remarks.some((item) => hasValue(item.text || item.comment || item.label) && !hasValue(item.response) && !hasValue(item.decision));
  }
  function remarkProgress(payload = {}) {
    const remarks = payload.liveClosure?.remarks || payload.remarks || [];
    const total = remarks.length;
    const answered = remarks.filter((item) => hasValue(item.response) || hasValue(item.decision)).length;
    if (!total) return { total, answered, status:"none", label:"Aucune remarque" };
    if (!answered) return { total, answered, status:"required", label:"Réponse requise" };
    if (answered < total) return { total, answered, status:"partial", label:"Réponses incomplètes" };
    return { total, answered, status:"done", label:"Remarques traitées" };
  }
  function hasRequiredDocument(payload = {}, key) {
    if (hasValue(payload.liveDocuments?.[key])) return true;
    if (key === "signedClosure" && hasValue(payload.liveClosure?.signedReports)) return true;
    return hasValue(payload.documents?.[key]);
  }
  function derivedBricoStatus(payload = {}, linkedPoints = []) {
    if (payload.closure?.confirmedAt && !hasOpenRemarks(payload) && !linkedPoints.some((point) => point.status !== "Résolu")) return "Clôturé";
    if (REQUIRED_DOCS.some((key) => !hasRequiredDocument(payload, key))) return "Incomplet";
    if (linkedPoints.some((point) => point.status !== "Résolu")) return "À contrôler";
    if (hasOpenRemarks(payload) || payload.reviewConfirmed !== true) return "À contrôler";
    return "Prêt pour clôture";
  }
  function sortRecords(records = [], type) {
    const order = type === "dstny" ? DSTNY_ORDER : BRICO_ORDER;
    return [...records].sort((a, b) => {
      const ai = Math.max(0, order.indexOf(a.status));
      const bi = Math.max(0, order.indexOf(b.status));
      if (ai !== bi) return ai - bi;
      return String(a.store_code || a.title || "").localeCompare(String(b.store_code || b.title || ""), "fr");
    });
  }
  function canConfirmClosure(payload = {}, signatureData = {}, linkedPoints = []) {
    return derivedBricoStatus(payload, linkedPoints) === "Prêt pour clôture"
      && hasValue(signatureData.name)
      && hasValue(signatureData.date)
      && hasValue(signatureData.signatureDataUrl);
  }
  function buildHistoryEntry(signatureData = {}, now = new Date().toISOString()) {
    return { type: "go_closure", at: now, signerName: signatureData.name.trim(), signerRole: String(signatureData.role || "").trim(), signedDate: signatureData.date };
  }
  function routingForPoint(point = {}, rolloutCodes = []) {
    if (point.scope === "general") return ["dstny", "brico_general"];
    if (point.scope === "rollout_store" && rolloutCodes.includes(point.storeCode)) return ["dstny", `brico:${point.storeCode}`];
    return ["dstny"];
  }
  return { DSTNY_ORDER, BRICO_ORDER, REQUIRED_DOCS, ALGO_CONNECTED_RESPONSE, ALGO_PENDING_RESPONSE, safeParse, hasValue, normalizedIdentity, algoConnectionState, algoSuggestedResponse, hasOpenRemarks, remarkProgress, hasRequiredDocument, derivedBricoStatus, sortRecords, canConfirmClosure, buildHistoryEntry, routingForPoint };
});

const DEFAULT_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const FORCED_DIGEST_RECIPIENTS = [
  { label: "Emir", aliases: ["Emir"] },
  { label: "Valou", aliases: ["Valou"], email: "backoffice@twem.be", exclude: ["Georgette", "Larix", "valou@twem.be"] },
  { label: "Anton", aliases: ["Anton"] },
  { label: "Nicolas Bertholet", aliases: ["Nicolas Bertholet", "Bertholet"], exclude: ["Crohain"] },
  { label: "Diana", aliases: ["Diana"] },
  { label: "Charles Roels", aliases: ["Charles Roels", "Roels"], exclude: ["Conrad"] },
  { label: "Fabien", aliases: ["Fabien"] },
  { label: "Jean-Yves", aliases: ["Jean-Yves", "Jean Yves"] },
  { label: "Medhi", aliases: ["Medhi", "Mehdi"] },
  { label: "Rob", aliases: ["Rob"] },
  { label: "Ronald", aliases: ["Ronald"] }
];

function env(name, fallback = "") {
  return process.env[name] || fallback;
}

function requiredEnv(name) {
  const value = env(name);
  if (!value) {
    throw new Error(`Missing required env ${name}`);
  }
  return value;
}

function normalizeDateOnly(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, "0"),
    String(parsed.getDate()).padStart(2, "0")
  ].join("-");
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function formatFrDate(date) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function appwriteFetch(path, options = {}) {
  const endpoint = env("APPWRITE_ENDPOINT", DEFAULT_ENDPOINT);
  const projectId = requiredEnv("APPWRITE_PROJECT_ID");
  const apiKey = requiredEnv("APPWRITE_API_KEY");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(env("FETCH_TIMEOUT_MS", "15000")));
  const response = await fetch(`${endpoint}${path}`, {
    ...options,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
      ...(options.headers || {})
    }
  }).finally(() => clearTimeout(timeout));
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Appwrite ${response.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function listRows(tableId) {
  const databaseId = requiredEnv("APPWRITE_DATABASE_ID");
  const limit = Number(env("APPWRITE_PAGE_SIZE", "100"));
  const rows = [];
  let offset = 0;

  while (true) {
    const params = new URLSearchParams();
    params.append("queries[]", JSON.stringify({ method: "limit", values: [limit] }));
    params.append("queries[]", JSON.stringify({ method: "offset", values: [offset] }));
    const page = await appwriteFetch(`/tablesdb/${databaseId}/tables/${tableId}/rows?${params.toString()}`);
    const batch = page.rows || [];
    rows.push(...batch);
    if (batch.length < limit || (page.total && rows.length >= page.total)) {
      if (page.total) {
        console.log(`${rows.length}/${page.total} rows loaded for ${tableId}.`);
      }
      break;
    }
    offset += batch.length;
  }

  return rows;
}

async function updateRow(tableId, rowId, data) {
  const databaseId = requiredEnv("APPWRITE_DATABASE_ID");
  return appwriteFetch(`/tablesdb/${databaseId}/tables/${tableId}/rows/${rowId}`, {
    method: "PATCH",
    body: JSON.stringify({ data })
  });
}

function normalizeStore(document) {
  const payload = parseJsonField(document.payload_json, null);
  if (payload && typeof payload === "object") {
    return { ...payload, id: payload.id || document.$id };
  }
  return {
    id: document.$id,
    code: document.code || "",
    name: document.name || "",
    city: document.city || "",
    manager: document.manager_name || "",
    status: document.status || "planned",
    health: document.health || "",
    appointments: [],
    workflow: {}
  };
}

function normalizeTicket(document) {
  const payload = parseJsonField(document.payload_json, null);
  if (payload && typeof payload === "object") {
    return { ...payload, id: payload.id || document.$id };
  }
  return {
    id: document.$id,
    storeCode: document.store_code || "",
    storeName: document.store_name || "",
    targetService: document.target_service || "",
    concern: document.concern || "",
    status: document.status || "open"
  };
}

function normalizeActivity(document) {
  const payload = parseJsonField(document.payload_json, null);
  if (payload && typeof payload === "object") {
    return { ...payload, id: payload.id || document.$id };
  }
  return {
    id: document.$id,
    storeCode: document.store_code || "",
    storeName: document.store_name || "",
    result: document.result || "ok",
    comment: document.comment || "",
    confirmedBy: document.confirmed_by || "",
    createdAt: document.created_at || ""
  };
}

function normalizePerson(document) {
  const payload = parseJsonField(document.payload_json, null);
  if (payload && typeof payload === "object") {
    return { ...payload, id: payload.id || document.$id, rowId: document.$id };
  }
  return {
    id: document.$id,
    rowId: document.$id,
    name: document.name || "",
    role: document.role || "",
    email: document.email || "",
    phone: document.phone || "",
    storeCode: document.store_code || "",
    language: document.language || "fr",
    loginHistory: []
  };
}

function personHasFirstAppLogin(person = {}) {
  return Array.isArray(person.loginHistory)
    && person.loginHistory.some((entry) => String(entry?.at || entry?.loginAt || "").trim());
}

function peopleByEmail(people = []) {
  return new Map(
    people
      .filter((person) => String(person.email || "").trim())
      .map((person) => [String(person.email).trim().toLowerCase(), person])
  );
}

function digestNameKey(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function digestPersonHaystack(person = {}) {
  return digestNameKey([person.name, person.email, person.role].filter(Boolean).join(" "));
}

function personMatchesDigestRecipient(person = {}, recipient = {}) {
  const haystack = digestPersonHaystack(person);
  const excluded = (recipient.exclude || []).some((value) => haystack.includes(digestNameKey(value)));
  if (!haystack || excluded) {
    return false;
  }
  if (recipient.email && String(person.email || "").trim().toLowerCase() === recipient.email.toLowerCase()) {
    return true;
  }
  return (recipient.aliases || [recipient.label]).some((alias) => haystack.includes(digestNameKey(alias)));
}

function forcedDigestRecipientsFromPeople(people = []) {
  const recipients = FORCED_DIGEST_RECIPIENTS
    .map((recipient) => {
      const person = people.find((entry) => personMatchesDigestRecipient(entry, recipient));
      return String(person?.email || recipient.email || "").trim();
    })
    .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  return uniqueEmailList(recipients);
}

function uniqueEmailList(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const email = String(item || "").trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function storeLabel(store) {
  return [store.code, store.name, store.city].filter(Boolean).join(" - ");
}

function lineList(items, emptyText) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${emptyText}`;
}

function buildDigestBody(stores, tickets, targetDate) {
  const target = dateKey(targetDate);
  const installations = stores.flatMap((store) => {
    const workflow = store.workflow || {};
    const rows = [];
    if (normalizeDateOnly(workflow.destinyInstallDate) === target) {
      rows.push(`${storeLabel(store)} | Destiny: ${workflow.destinyInstallDate}${workflow.destinyPmName ? ` | PM ${workflow.destinyPmName}` : ""}`);
    }
    (store.appointments || []).forEach((appointment) => {
      if (normalizeDateOnly(appointment.datetime) === target) {
        rows.push(`${storeLabel(store)} | RDV ${appointment.datetime} | ${appointment.status || "-"} | ${appointment.note || "-"}`);
      }
    });
    return [...new Set(rows)];
  });

  const blockedStores = stores
    .filter((store) => store.status === "blocked" || String(store.health || "").trim())
    .map((store) => `${storeLabel(store)} | ${store.status || "-"} | ${store.health || "Point a verifier"}`);

  const openTickets = tickets
    .filter((ticket) => ticket.status === "open")
    .map((ticket) => `${ticket.id || "-"} | ${ticket.storeCode || ""} ${ticket.storeName || ""} | ${ticket.concern || "-"} | ${ticket.targetService || "-"}`.trim());

  const inProgressTickets = tickets
    .filter((ticket) => ticket.status === "in_progress")
    .map((ticket) => `${ticket.id || "-"} | ${ticket.storeCode || ""} ${ticket.storeName || ""} | ${ticket.concern || "-"} | ${ticket.targetService || "-"}`.trim());

  return [
    "Bonjour Emir, bonjour Valou,",
    "",
    `Voici le digest automatique du matin pour preparer ${formatFrDate(targetDate)}.`,
    "",
    "Installations prevues demain",
    lineList(installations, "Aucune installation trouvee pour demain dans l'application."),
    "",
    "Blocages magasin",
    lineList(blockedStores, "Aucun magasin bloque ou avec point de sante renseigne."),
    "",
    "SAV ouverts",
    lineList(openTickets, "Aucun SAV ouvert."),
    "",
    "SAV en cours",
    lineList(inProgressTickets, "Aucun SAV en cours."),
    "",
    "Objectif: verifier que les installations de demain sont bien dans le planning et que les points bloquants sont suivis."
  ].join("\n");
}

const PENDING_INSTALLATION_CANCELLATIONS = [
  { codes: ["BRI-3597", "3597"], label: "3597 Brico Fleron" },
  { codes: ["BRI-5430", "5430"], label: "5430 Briko Depot Fontaine-l'Eveque" },
  { codes: ["BRI-3621", "3621"], label: "3621 Brico Middelkerke" }
];

function digestStoreCode(store = {}) {
  return String(store.shopNumber || store.shop_number || store.code || store.name || "-").replace(/^BRI-?/i, "");
}

function digestStoreLine(store = {}, detail = "") {
  const base = [digestStoreCode(store), store.name].filter(Boolean).join(" ");
  return detail ? `${base} : ${detail}` : base;
}

function digestStoreCompactLine(store = {}, detail = "") {
  const base = digestStoreCode(store);
  return detail ? `${base} : ${detail}` : base;
}

function uniqueDigestList(items = []) {
  return Array.from(new Set(items.map((item) => String(item || "").trim()).filter(Boolean)));
}

function digestStoreKeySet(store = {}) {
  return new Set([
    String(store.code || "").trim().toUpperCase(),
    String(store.shopNumber || store.shop_number || "").trim().toUpperCase(),
    String(store.name || "").trim().toUpperCase()
  ].filter(Boolean));
}

function pendingInstallationCancellationForStore(store = {}) {
  const keys = digestStoreKeySet(store);
  return PENDING_INSTALLATION_CANCELLATIONS.find((entry) =>
    entry.codes.some((code) => keys.has(String(code || "").trim().toUpperCase()))
  );
}

function isPendingInstallationCancellation(store = {}) {
  return Boolean(pendingInstallationCancellationForStore(store));
}

function pendingInstallationCancellationLines(stores = []) {
  const storeLines = stores
    .filter(isPendingInstallationCancellation)
    .map((store) => `${digestStoreCode(store)} ${store.name || ""}`.trim());
  const knownStoreCodes = new Set(stores.filter(isPendingInstallationCancellation).map((store) => digestStoreCode(store)));
  const fallbackLines = PENDING_INSTALLATION_CANCELLATIONS
    .filter((entry) => !entry.codes.some((code) => knownStoreCodes.has(String(code || "").replace(/^BRI-?/i, "").trim())))
    .map((entry) => entry.label);
  return uniqueDigestList([...storeLines, ...fallbackLines].map((line) => `${line} : date a transmettre ulterieurement`));
}

function upcomingInstallationLines(stores = [], now = new Date(), days = 5) {
  const startKey = dateKey(now);
  const endKey = dateKey(addDays(now, Math.max(days - 1, 0)));
  const byDate = new Map();
  stores.forEach((store) => {
    if (isPendingInstallationCancellation(store)) return;
    const installKey = normalizeDateOnly(workflowOf(store).destinyInstallDate);
    if (!installKey || installKey < startKey || installKey > endKey) return;
    const rows = byDate.get(installKey) || [];
    rows.push(`${digestStoreCode(store)} ${store.name || ""}`.trim());
    byDate.set(installKey, rows);
  });
  return Array.from(byDate.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, rows]) => `${date} : ${uniqueDigestList(rows).join(" / ")}`);
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function sameDateKey(value, targetKey) {
  return normalizeDateOnly(value) === targetKey;
}

function reportDayFromNow(now = new Date()) {
  const day = addDays(now, -1);
  return { date: day, key: dateKey(day) };
}

function workflowOf(store = {}) {
  return store.workflow || {};
}

function isVlanOk(workflow = {}) {
  return ["oui", "ok"].includes(normalizeKey(workflow.vlan22Activated)) || Boolean(String(workflow.vlan22Date || "").trim());
}

function isNetworkConfigOk(store = {}) {
  const workflow = workflowOf(store);
  if (workflow.networkConfigConfirmed === true) return true;
  const rows = Array.isArray(workflow.networkRows) ? workflow.networkRows : [];
  return Boolean(rows.length) && rows.every((row) => String(row.extensionLabel || "").trim());
}

function networkConfigSummary(store = {}) {
  const rows = Array.isArray(workflowOf(store).networkRows) ? workflowOf(store).networkRows : [];
  return {
    configured: rows.filter((row) => String(row.extensionLabel || "").trim()).length,
    total: rows.length
  };
}

function isBlockedStatus(value) {
  return ["bloque", "bloquee", "probleme"].includes(normalizeKey(value));
}

function ticketTargetLabel(ticket = {}) {
  if (Array.isArray(ticket.targetPeople) && ticket.targetPeople.length) return ticket.targetPeople.join(", ");
  return ticket.targetService || "TWEM";
}

function digestTicketLine(ticket = {}) {
  return `${ticket.storeCode || "-"} | ${ticket.id || "-"} | ${ticket.concern || ticket.requestKind || "SAV"}`;
}

function activityDayItems(activities = [], dayKey) {
  return activities.filter((activity) => sameDateKey(activity.createdAt, dayKey));
}

function changedStoresForDay(stores = [], activities = [], dayKey) {
  const activityKeys = new Set(activityDayItems(activities, dayKey).flatMap((activity) => [
    String(activity.storeCode || "").trim(),
    String(activity.storeName || "").trim()
  ].filter(Boolean)));
  return stores.filter((store) =>
    sameDateKey(store.updatedAt || store.updated_at, dayKey)
    || sameDateKey(workflowOf(store).planPdfUpdatedAt, dayKey)
    || activityKeys.has(String(store.code || "").trim())
    || activityKeys.has(String(store.name || "").trim())
  );
}

function buildActivityDigestBody(stores, tickets, activities, now = new Date()) {
  const { date: reportDate, key: reportKey } = reportDayFromNow(now);
  const todayKey = dateKey(now);
  const tomorrowKey = dateKey(addDays(now, 1));
  const dayActivities = activityDayItems(activities, reportKey);
  const changedStores = changedStoresForDay(stores, activities, reportKey);
  const activityForStore = (store, matcher) => dayActivities.some((activity) => {
    const storeKey = `${activity.storeCode || ""} ${activity.storeName || ""}`;
    return (storeKey.includes(store.code || "") || storeKey.includes(store.name || ""))
      && matcher(String(activity.comment || "").toLowerCase());
  });

  const preparationStores = changedStores.filter((store) => {
    const workflow = workflowOf(store);
    return workflow.vlan22Activated || workflow.vlan22Date || workflow.cablingStatus || workflow.cablingDate
      || workflow.ltSwitchStatus || workflow.ltSwitchDate || workflow.mobileCoverage
      || activityForStore(store, (comment) => /(vlan|cabl|switch|pre.?visite|preparation|reseau|couverture)/i.test(comment));
  });
  const vlanOk = uniqueDigestList(preparationStores.filter((store) => isVlanOk(workflowOf(store))).map(digestStoreCode));
  const vlanBlocked = uniqueDigestList(preparationStores.filter((store) => isBlockedStatus(workflowOf(store).vlan22Activated) || isBlockedStatus(workflowOf(store).vlan22Status)).map((store) => digestStoreCompactLine(store, workflowOf(store).vlan22Status || workflowOf(store).vlan22Activated)));
  const cablingOk = uniqueDigestList(preparationStores.filter((store) => normalizeKey(workflowOf(store).cablingStatus) === "ok").map(digestStoreCode));
  const cablingBlocked = uniqueDigestList(preparationStores.filter((store) => isBlockedStatus(workflowOf(store).cablingStatus)).map((store) => digestStoreCompactLine(store, workflowOf(store).cablingStatus)));
  const switchOk = uniqueDigestList(preparationStores.filter((store) => ["ok", "basculee"].includes(normalizeKey(workflowOf(store).ltSwitchStatus))).map(digestStoreCode));
  const switchBlocked = uniqueDigestList(preparationStores.filter((store) => isBlockedStatus(workflowOf(store).ltSwitchStatus)).map((store) => digestStoreCompactLine(store, workflowOf(store).ltSwitchStatus)));
  const mobileCoverage = preparationStores.filter((store) => {
    const value = normalizeKey(workflowOf(store).mobileCoverage);
    return value && value !== "a_verifier";
  }).map((store) => digestStoreCompactLine(store, workflowOf(store).mobileCoverage));
  const mobileBlocked = uniqueDigestList(preparationStores.filter((store) => isBlockedStatus(workflowOf(store).mobileCoverage)).map((store) => digestStoreCompactLine(store, workflowOf(store).mobileCoverage)));

  const installToday = stores
    .filter((store) => sameDateKey(workflowOf(store).destinyInstallDate, todayKey))
    .filter((store) => !isPendingInstallationCancellation(store))
    .map((store) => digestStoreLine(store, workflowOf(store).destinyInstallDate));
  const installTomorrow = stores
    .filter((store) => sameDateKey(workflowOf(store).destinyInstallDate, tomorrowKey))
    .filter((store) => !isPendingInstallationCancellation(store))
    .map((store) => digestStoreLine(store, workflowOf(store).destinyInstallDate));
  const installUpcoming = upcomingInstallationLines(stores, addDays(now, 1), 5);
  const installCancelled = uniqueDigestList([
    ...pendingInstallationCancellationLines(stores),
    ...dayActivities
      .filter((activity) => /annul|cancel|reporte|deplace|deplac/i.test(String(activity.comment || "")))
      .map((activity) => `${activity.storeCode || activity.storeName || "-"} : ${activity.comment}`)
  ]);

  const configComplete = uniqueDigestList(changedStores.filter(isNetworkConfigOk).map((store) => {
    const summary = networkConfigSummary(store);
    return digestStoreCompactLine(store, `${summary.configured}/${summary.total || 0}`);
  }));
  const configPartial = uniqueDigestList(changedStores.filter((store) => {
    const summary = networkConfigSummary(store);
    return summary.configured > 0 && !isNetworkConfigOk(store);
  }).map((store) => {
    const summary = networkConfigSummary(store);
    return digestStoreCompactLine(store, `${summary.configured}/${summary.total || 0}`);
  }));

  const savNew = tickets.filter((ticket) => sameDateKey(ticket.createdAt, reportKey)).map(digestTicketLine);
  const savClosed = tickets.filter((ticket) =>
    ticket.status === "closed"
    && (sameDateKey(ticket.updatedAt, reportKey) || (ticket.updates || []).some((update) => sameDateKey(update.createdAt, reportKey) && /clot|closed/i.test(update.note || "")))
  ).map(digestTicketLine);
  const savInProgress = tickets.filter((ticket) =>
    ["open", "in_progress", "assigned", "dispatch"].includes(ticket.status)
    && (sameDateKey(ticket.updatedAt, reportKey) || (ticket.updates || []).some((update) => sameDateKey(update.createdAt, reportKey)))
  ).map(digestTicketLine);

  const addedPlans = stores
    .filter((store) => sameDateKey(workflowOf(store).planPdfUpdatedAt, reportKey))
    .map((store) => digestStoreLine(store, workflowOf(store).planPdfName || "document ajoute"));
  return [
    "Digest du jour :",
    "",
    `Rapport activite de la journee d'hier : ${formatFrDate(reportDate)}`,
    "",
    "Preparation chantier",
    `VLAN22 OK : ${vlanOk.join(" - ") || "-"}`,
    `Blocage VLAN22 : ${vlanBlocked.join(" / ") || "-"}`,
    `Cablage OK : ${cablingOk.join(" - ") || "-"}`,
    `Blocage cablage : ${cablingBlocked.join(" / ") || "-"}`,
    `Switch OK : ${switchOk.join(" - ") || "-"}`,
    `Blocage switch : ${switchBlocked.join(" / ") || "-"}`,
    `Couverture mobile : ${uniqueDigestList(mobileCoverage).join(" / ") || "-"}`,
    `Blocage couverture mobile : ${mobileBlocked.join(" / ") || "-"}`,
    "",
    "Installations",
    `Prevues aujourd'hui : ${installToday.join(" / ") || "-"}`,
    `Prevues demain : ${installTomorrow.join(" / ") || "-"}`,
    "Prevues dans les 5 prochains jours :",
    lineList(installUpcoming, "Aucune installation prevue dans les 5 prochains jours."),
    `Annulees / a replanifier : ${installCancelled.join(" / ") || "-"}`,
    "",
    "Configuration reseau",
    `Complete : ${configComplete.join(" / ") || "-"}`,
    `Partielle : ${configPartial.join(" / ") || "-"}`,
    "",
    "SAV",
    "Nouveaux :",
    lineList(savNew, "Aucun nouveau SAV hier."),
    "En cours / mis a jour :",
    lineList(savInProgress, "Aucun SAV en cours mis a jour hier."),
    "Clotures :",
    lineList(savClosed, "Aucun SAV cloture hier."),
    "",
    "Plans / documents ajoutes",
    lineList(addedPlans, "Aucun plan ou document ajoute hier.")
  ].join("\n");
}

function htmlFromText(text) {
  return `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.45">${text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")}</pre>`;
}

function brusselsParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    dateKey: `${value.year}-${value.month}-${value.day}`,
    hour: Number(value.hour || 0),
    minute: Number(value.minute || 0)
  };
}

function splitRecipients(value = "") {
  return String(value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item));
}

function requestParam(req = {}, name) {
  if (req.query && typeof req.query === "object" && req.query[name] !== undefined) {
    return String(req.query[name] || "");
  }
  if (req.queryString) {
    const params = new URLSearchParams(String(req.queryString).replace(/^\?/, ""));
    return params.get(name) || "";
  }
  if (req.url) {
    try {
      const url = new URL(req.url, "https://function.local");
      return url.searchParams.get(name) || "";
    } catch {
      return "";
    }
  }
  return "";
}

function jsonResponse(res, data, status = 200) {
  return res.json(data, status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
}

function automationById(automations = []) {
  return new Map((automations || []).map((automation) => [automation.id, automation]));
}

function shouldSendQueuedEmail(email, automationsById, now = new Date()) {
  const automation = automationsById.get(email.automationId);
  if (!automation?.active) return false;
  if (email.automationId === "daily_operations_digest") return false;
  if (email.automationId === "new_person_welcome" && !automation.active) return false;
  if (email.status !== "ready") return false;
  if (email.plannedAt) {
    const planned = new Date(email.plannedAt);
    if (!Number.isNaN(planned.getTime()) && planned > now) return false;
  }
  return splitRecipients(email.recipient).length > 0;
}

function firstLoginAllowedRecipients(email, peopleMap) {
  const recipients = splitRecipients(email.recipient);
  if (email.automationId === "daily_operations_digest" || email.automationId === "new_person_welcome") {
    return recipients;
  }
  return recipients.filter((recipient) => {
    const person = peopleMap.get(recipient.toLowerCase());
    return person && personHasFirstAppLogin(person);
  });
}

const automationEmailsSettingsItemId = "__automation_emails__";
const mailerStateSettingsItemId = "__mailer_state__";

function automationToolItems(row = {}) {
  return parseJsonField(row.tool_items_json, []);
}

function settingsToolItem(items = [], id, kind) {
  return items.find((item) => item?.id === id || item?.kind === kind) || null;
}

function nextToolItemsWithMailerState(items = [], automationEmails = [], mailerState = {}) {
  const cleanItems = items.filter((item) =>
    item?.id !== automationEmailsSettingsItemId
    && item?.kind !== "automation_emails"
    && item?.id !== mailerStateSettingsItemId
    && item?.kind !== "mailer_state"
  );
  return [
    ...cleanItems,
    {
      id: automationEmailsSettingsItemId,
      kind: "automation_emails",
      emails: automationEmails
    },
    {
      id: mailerStateSettingsItemId,
      kind: "mailer_state",
      state: mailerState
    }
  ];
}

async function getGlobalSettings(settingsCollection) {
  const settingsRows = await listRows(settingsCollection);
  const row = settingsRows.find((item) => item.$id === "global-state") || settingsRows[0] || null;
  if (!row) {
    return { row: null, automations: [], automationEmails: [], mailerState: {}, toolItems: [] };
  }
  const toolItems = automationToolItems(row);
  const automationEmailsItem = settingsToolItem(toolItems, automationEmailsSettingsItemId, "automation_emails");
  const mailerStateItem = settingsToolItem(toolItems, mailerStateSettingsItemId, "mailer_state");
  return {
    row,
    automations: parseJsonField(row.automations_json, []),
    automationEmails: Array.isArray(automationEmailsItem?.emails)
      ? automationEmailsItem.emails
      : parseJsonField(row.automation_emails_json, []),
    mailerState: mailerStateItem?.state && typeof mailerStateItem.state === "object"
      ? mailerStateItem.state
      : parseJsonField(row.mailer_state_json, {}),
    toolItems
  };
}

function shouldSendDigestToday(mailerState, now = new Date()) {
  if (env("FORCE_DIGEST", "").toLowerCase() === "true") return true;
  const { dateKey: todayKey, hour } = brusselsParts(now);
  const digestHour = Number(env("DIGEST_HOUR_BRUSSELS", "9"));
  return hour >= digestHour && mailerState.lastDigestDate !== todayKey;
}

function automationActive(automations = [], id) {
  const automation = automations.find((item) => item.id === id);
  return Boolean(automation?.active);
}

function appAccessLink() {
  return env("APP_PUBLIC_URL", "https://twem-brico-suivi.appwrite.network/");
}

function welcomeSubject(person = {}) {
  const isNl = String(person.language || "").toLowerCase().startsWith("nl");
  return isNl
    ? "Toegang opvolgingsapp TWEM Brico + PIN"
    : "Acces application TWEM Brico + code PIN";
}

function welcomeBody(person = {}) {
  const isNl = String(person.language || "").toLowerCase().startsWith("nl");
  if (isNl) {
    return [
      `Hallo ${person.name || ""},`,
      "",
      "Uw toegang tot de TWEM Brico opvolgingsapplicatie is aangemaakt.",
      "",
      `Link naar de applicatie: ${appAccessLink()}`,
      `Uw persoonlijke PIN-code: ${person.pin || ""}`,
      "",
      "Met deze toegang kunt u de beschikbare informatie voor uw winkel raadplegen.",
      "",
      "Met vriendelijke groeten,"
    ].join("\n");
  }
  return [
    `Bonjour ${person.name || ""},`,
    "",
    "Votre acces a l'application de suivi TWEM Brico a ete cree.",
    "",
    `Lien vers l'application: ${appAccessLink()}`,
    `Votre code PIN personnel: ${person.pin || ""}`,
    "",
    "Cet acces vous permet de consulter les informations disponibles pour votre magasin.",
    "",
    "Bien a vous,"
  ].join("\n");
}

function pendingWelcomeEmailPeople(people = []) {
  const legacyCutoff = new Date(env("WELCOME_LEGACY_CUTOFF_AT", "2026-06-04T00:00:00+02:00"));
  return people.filter((person) => {
    const pinCreatedAt = new Date(person.pinCreatedAt || person.createdAt || person.updatedAt || "2026-05-06T00:00:00Z");
    const isLegacyAccess = Number.isNaN(pinCreatedAt.getTime()) || pinCreatedAt < legacyCutoff;
    return String(person.email || "").trim()
      && String(person.pin || "").replace(/\D/g, "").length === 6
      && person.welcomeEmailQueuedAt
      && !person.welcomeEmailSentAt
      && !isLegacyAccess
      && !["disabled", "expired"].includes(String(person.pinStatus || "").toLowerCase());
  });
}

function openAccessFallbackWelcomePeople(people = []) {
  return people.filter((person) => {
    const role = String(person.role || "").toLowerCase();
    const status = String(person.pinStatus || "").toLowerCase();
    return String(person.email || "").trim()
      && String(person.pin || "").replace(/\D/g, "").length === 6
      && !person.welcomeEmailSentAt
      && !personHasFirstAppLogin(person)
      && status === "active"
      && !["supadmin_twem", "admin_twem"].includes(role);
  });
}

function welcomeEmailDraftsFromPeople(people = [], options = {}) {
  const queuedPeople = pendingWelcomeEmailPeople(people);
  const allowFallback = env("WELCOME_OPEN_ACCESS_FALLBACK", "false").toLowerCase() === "true";
  const fallbackPeople = allowFallback && !queuedPeople.length
    ? openAccessFallbackWelcomePeople(people).slice(0, Number(env("WELCOME_FALLBACK_LIMIT", "20")))
    : [];
  const selectedPeople = queuedPeople.length ? queuedPeople : fallbackPeople;
  options.diagnostics.queuedWelcomePeople = queuedPeople.length;
  options.diagnostics.openAccessFallbackPeople = fallbackPeople.length;
  options.diagnostics.openAccessFallbackUsed = Boolean(fallbackPeople.length);
  return selectedPeople.map((person) => ({
    id: `mail-new_person_welcome-${person.id || person.rowId || person.email}`,
    automationId: "new_person_welcome",
    automationTitle: `Creation personne -> envoi lien app + PIN - ${person.name || person.email}`,
    recipient: person.email,
    subject: welcomeSubject(person),
    body: welcomeBody(person),
    status: "ready",
    plannedAt: "",
    personRowId: person.rowId,
    personId: person.id,
    createdAt: person.welcomeEmailQueuedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

async function markWelcomePersonSent(person, sentAt) {
  if (!person?.rowId) {
    return;
  }
  const nextPerson = {
    ...person,
    welcomeEmailSentAt: sentAt,
    welcomeEmailQueuedAt: ""
  };
  await updateRow(env("APPWRITE_PEOPLE_COLLECTION_ID", "people"), person.rowId, {
    name: nextPerson.name || "",
    role: nextPerson.role || "manager",
    phone: nextPerson.phone || "",
    email: nextPerson.email || "",
    store_code: nextPerson.storeCode || "",
    language: nextPerson.language || "fr",
    payload_json: JSON.stringify(nextPerson)
  });
}

async function sendManualWelcomeEmail(req) {
  const peopleCollection = env("APPWRITE_PEOPLE_COLLECTION_ID", "people");
  const personId = requestParam(req, "personId");
  const emailParam = requestParam(req, "email").toLowerCase();
  if (!personId && !emailParam) {
    throw new Error("Missing personId or email.");
  }
  const people = await listRows(peopleCollection).then((rows) => rows.map(normalizePerson));
  const person = people.find((entry) =>
    String(entry.id || "") === personId
    || String(entry.rowId || "") === personId
    || String(entry.$id || "") === personId
    || (emailParam && String(entry.email || "").trim().toLowerCase() === emailParam)
  );
  if (!person) {
    throw new Error("Person not found.");
  }
  const email = String(person.email || "").trim();
  const pin = String(person.pin || "").replace(/\D/g, "");
  if (!email || pin.length !== 6) {
    throw new Error("Person must have an email and a 6 digit PIN.");
  }
  const subject = welcomeSubject(person);
  const body = welcomeBody(person);
  const dryRun = env("DRY_RUN", "true").toLowerCase() !== "false";
  let mailResult = { dryRun: true };
  if (!dryRun) {
    mailResult = await sendOutlookMail({
      subject,
      body,
      recipients: [email]
    });
  }
  const sentAt = new Date().toISOString();
  if (!dryRun) {
    await markWelcomePersonSent(person, sentAt);
  }
  return {
    ok: true,
    action: "send-welcome",
    dryRun,
    personId: person.id || person.rowId || "",
    recipient: email,
    subject,
    sentAt: dryRun ? "" : sentAt,
    mailResult
  };
}

async function getGraphToken() {
  const tenantId = requiredEnv("GRAPH_TENANT_ID");
  const clientId = requiredEnv("GRAPH_CLIENT_ID");
  const clientSecret = requiredEnv("GRAPH_CLIENT_SECRET");
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  });
  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Graph token error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function sendOutlookMail({ subject, body, recipients }) {
  const token = await getGraphToken();
  const sender = requiredEnv("OUTLOOK_SENDER");
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: htmlFromText(body)
        },
        toRecipients: recipients.map((address) => ({
          emailAddress: { address }
        }))
      },
      saveToSentItems: true
    })
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Graph sendMail ${response.status}: ${text}`);
  }
  return {
    status: response.status,
    statusText: response.statusText || ""
  };
}

async function main() {
  const storesCollection = env("APPWRITE_STORES_COLLECTION_ID", "stores");
  const ticketsCollection = env("APPWRITE_TICKETS_COLLECTION_ID", "tickets");
  const peopleCollection = env("APPWRITE_PEOPLE_COLLECTION_ID", "people");
  const activitiesCollection = env("APPWRITE_ACTIVITIES_COLLECTION_ID", "activities");
  const settingsCollection = env("APPWRITE_SETTINGS_COLLECTION_ID", "settings");
  const configuredRecipients = splitRecipients(env("DIGEST_RECIPIENTS", "emir.massart@brico.be,emir@twem.be,backoffice@twem.be"));
  const testRecipients = env("TEST_RECIPIENTS", "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const settings = await getGlobalSettings(settingsCollection);
  const automationsById = automationById(settings.automations);
  const [stores, tickets, people, activities] = await Promise.all([
    listRows(storesCollection).then((rows) => rows.map(normalizeStore)),
    listRows(ticketsCollection).then((rows) => rows.map(normalizeTicket)),
    listRows(peopleCollection).then((rows) => rows.map(normalizePerson)),
    listRows(activitiesCollection).then((rows) => rows.map(normalizeActivity))
  ]);
  const forcedDigestRecipients = forcedDigestRecipientsFromPeople(people);
  const recipients = testRecipients.length
    ? uniqueEmailList(testRecipients)
    : uniqueEmailList([...configuredRecipients, ...forcedDigestRecipients]);
  if (!recipients.length) {
    throw new Error("No digest recipients configured.");
  }
  const connectedPeopleByEmail = peopleByEmail(people);
  const dryRun = env("DRY_RUN", "true").toLowerCase() !== "false";
  const sentQueue = [];
  const skippedQueue = [];
  const now = new Date();
  const queueLimit = Number(env("MAIL_QUEUE_LIMIT", "20"));
  const existingEmailIds = new Set((settings.automationEmails || []).map((email) => email.id));
  const diagnostics = {
    people: people.length,
    activities: activities.length,
    activePinPeople: openAccessFallbackWelcomePeople(people).length,
    welcomeAutomationActive: automationActive(settings.automations, "new_person_welcome"),
    queuedWelcomePeople: 0,
    openAccessFallbackPeople: 0,
    openAccessFallbackUsed: false
  };
  const welcomeMailsEnabled = env("WELCOME_MAILS_ENABLED", "true").toLowerCase() !== "false";
  const generatedWelcomeEmails = welcomeMailsEnabled
    ? welcomeEmailDraftsFromPeople(people, { diagnostics }).filter((email) => !existingEmailIds.has(email.id))
    : [];
  const peopleById = new Map(people.map((person) => [String(person.id || person.rowId || ""), person]));
  const updatedEmails = [...(settings.automationEmails || []), ...generatedWelcomeEmails];
  let queueChanged = false;

  for (const email of updatedEmails) {
    if (sentQueue.length >= queueLimit) break;
    if (!shouldSendQueuedEmail(email, automationsById, now)) {
      skippedQueue.push(email.id || email.automationId || "email");
      continue;
    }
    try {
      const emailRecipients = firstLoginAllowedRecipients(email, connectedPeopleByEmail);
      if (!emailRecipients.length) {
        email.status = "blocked";
        email.error = "Premiere connexion requise avant les autres mails automatiques.";
        email.updatedAt = new Date().toISOString();
        queueChanged = true;
        skippedQueue.push(email.id || email.automationId || "email");
        continue;
      }
      let result = { dryRun: true };
      if (!dryRun) {
        result = await sendOutlookMail({
          subject: email.subject || "Mail automatique TWEM Brico",
          body: email.body || "",
          recipients: emailRecipients
        });
      }
      email.status = dryRun ? "ready" : "sent";
      email.sentAt = dryRun ? "" : new Date().toISOString();
      email.error = "";
      email.mailResult = result;
      email.updatedAt = new Date().toISOString();
      if (!dryRun && email.automationId === "new_person_welcome") {
        const person = peopleById.get(String(email.personId || ""));
        await markWelcomePersonSent(person, email.sentAt);
      }
      queueChanged = true;
      sentQueue.push({ id: email.id, automationId: email.automationId, recipients: emailRecipients, result });
    } catch (error) {
      email.status = "error";
      email.error = error.message;
      email.updatedAt = new Date().toISOString();
      queueChanged = true;
      sentQueue.push({ id: email.id, automationId: email.automationId, error: error.message });
    }
  }

  const digestShouldSend = shouldSendDigestToday(settings.mailerState, now);
  let digest = null;
  if (digestShouldSend) {
    const subjectPrefix = testRecipients.length ? "[TEST] " : "";
    const reportDate = addDays(now, -1);
    const subject = `${subjectPrefix}Rapport activite TWEM Brico - ${formatFrDate(reportDate)}`;
    const body = buildActivityDigestBody(stores, tickets, activities, now);
    let mailResult = null;
    if (!dryRun) {
      mailResult = await sendOutlookMail({ subject, body, recipients });
    }
    settings.mailerState.lastDigestDate = brusselsParts(now).dateKey;
    settings.mailerState.lastDigestSentAt = new Date().toISOString();
    digest = {
      sent: !dryRun,
      dryRun,
      testMode: Boolean(testRecipients.length),
      recipients,
      configuredRecipients,
      forcedDigestRecipients,
      subject,
      mailResult,
      preview: body
    };
  }

  if (settings.row && (queueChanged || digestShouldSend)) {
    await updateRow(settingsCollection, settings.row.$id, {
      tool_items_json: JSON.stringify(nextToolItemsWithMailerState(settings.toolItems, updatedEmails, settings.mailerState))
    });
  }

  return {
    ok: true,
    dryRun,
    digest,
    queuedSent: sentQueue,
    queuedSkippedCount: skippedQueue.length,
    queueSize: updatedEmails.length,
    diagnostics
  };
}

export default async ({ req, res, log, error }) => {
  try {
    if (String(req?.method || "").toUpperCase() === "OPTIONS") {
      return jsonResponse(res, { ok: true });
    }
    if (requestParam(req, "action") === "send-welcome") {
      const result = await sendManualWelcomeEmail(req);
      log(JSON.stringify(result, null, 2));
      return jsonResponse(res, result);
    }
    const result = await main();
    log(JSON.stringify(result, null, 2));
    return jsonResponse(res, result);
  } catch (err) {
    error(err.stack || err.message);
    return jsonResponse(res, { ok: false, error: err.message }, 500);
  }
};

if (process.env.NODE_ENV === "local") {
  main()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

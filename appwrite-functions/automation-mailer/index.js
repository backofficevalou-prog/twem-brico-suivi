const DEFAULT_ENDPOINT = "https://fra.cloud.appwrite.io/v1";

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

async function getGlobalSettings(settingsCollection) {
  const settingsRows = await listRows(settingsCollection);
  const row = settingsRows.find((item) => item.$id === "global-state") || settingsRows[0] || null;
  if (!row) {
    return { row: null, automations: [], automationEmails: [], mailerState: {} };
  }
  return {
    row,
    automations: parseJsonField(row.automations_json, []),
    automationEmails: parseJsonField(row.automation_emails_json, []),
    mailerState: parseJsonField(row.mailer_state_json, {})
  };
}

function shouldSendDigestToday(mailerState, now = new Date()) {
  if (env("FORCE_DIGEST", "").toLowerCase() === "true") return true;
  const { dateKey: todayKey, hour } = brusselsParts(now);
  const digestHour = Number(env("DIGEST_HOUR_BRUSSELS", "9"));
  return hour >= digestHour && mailerState.lastDigestDate !== todayKey;
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
  const settingsCollection = env("APPWRITE_SETTINGS_COLLECTION_ID", "settings");
  const configuredRecipients = env("DIGEST_RECIPIENTS", "emir@twem.be,valou@twem.be")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const testRecipients = env("TEST_RECIPIENTS", "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const recipients = testRecipients.length ? testRecipients : configuredRecipients;
  if (!recipients.length) {
    throw new Error("No digest recipients configured.");
  }
  const settings = await getGlobalSettings(settingsCollection);
  const automationsById = automationById(settings.automations);
  const targetDate = addDays(new Date(), 1);
  const [stores, tickets] = await Promise.all([
    listRows(storesCollection).then((rows) => rows.map(normalizeStore)),
    listRows(ticketsCollection).then((rows) => rows.map(normalizeTicket))
  ]);
  const dryRun = env("DRY_RUN", "true").toLowerCase() !== "false";
  const sentQueue = [];
  const skippedQueue = [];
  const now = new Date();
  const queueLimit = Number(env("MAIL_QUEUE_LIMIT", "20"));
  const updatedEmails = [...(settings.automationEmails || [])];

  for (const email of updatedEmails) {
    if (sentQueue.length >= queueLimit) break;
    if (!shouldSendQueuedEmail(email, automationsById, now)) {
      skippedQueue.push(email.id || email.automationId || "email");
      continue;
    }
    try {
      const emailRecipients = splitRecipients(email.recipient);
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
      sentQueue.push({ id: email.id, automationId: email.automationId, recipients: emailRecipients, result });
    } catch (error) {
      email.status = "error";
      email.error = error.message;
      email.updatedAt = new Date().toISOString();
      sentQueue.push({ id: email.id, automationId: email.automationId, error: error.message });
    }
  }

  const digestShouldSend = shouldSendDigestToday(settings.mailerState, now);
  let digest = null;
  if (digestShouldSend) {
    const subjectPrefix = testRecipients.length ? "[TEST] " : "";
    const subject = `${subjectPrefix}Digest quotidien TWEM Brico - ${formatFrDate(targetDate)}`;
    const body = buildDigestBody(stores, tickets, targetDate);
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
      subject,
      mailResult,
      preview: body
    };
  }

  if (settings.row && (sentQueue.length || digestShouldSend)) {
    await updateRow(settingsCollection, settings.row.$id, {
      automation_emails_json: JSON.stringify(updatedEmails),
      mailer_state_json: JSON.stringify(settings.mailerState)
    });
  }

  return {
    ok: true,
    dryRun,
    digest,
    queuedSent: sentQueue,
    queuedSkippedCount: skippedQueue.length,
    queueSize: updatedEmails.length
  };
}

export default async ({ res, log, error }) => {
  try {
    const result = await main();
    log(JSON.stringify(result, null, 2));
    return res.json(result);
  } catch (err) {
    error(err.stack || err.message);
    return res.json({ ok: false, error: err.message }, 500);
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

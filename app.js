const twemOptions = ["Emir", "Valou"];
const interventionOptions = [
  { value: "planned", label: "A commencer" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Termine" }
];
const globalStatusOptions = [
  { value: "planned", label: "A commencer" },
  { value: "in_progress", label: "Planifie / En cours" },
  { value: "blocked", label: "Bloque" },
  { value: "done", label: "Termine" }
];
const appointmentStatusOptions = ["Propose", "Confirme"];
const defaultRoleOptions = ["twem", "magasin", "telephonie", "electricien"];
const translations = {
  fr: {
    pageTitle: "Suivi chantier magasin par magasin",
    pageIntro: "Une ligne par magasin, puis un detail depliant pour gerer les intervenants, les rendez-vous et les blocages.",
    mode: "Mode",
    connection: "Connexion",
    search: "Recherche",
    status: "Statut",
    owner: "Responsable Twem",
    userView: "Vue utilisateur",
    language: "Langue",
    importFile: "Import fichier",
    printReport: "Creation / impression rapport",
    planning: "Planning chantier",
    syncMessage: "Clique sur `+` pour ouvrir la fiche du magasin.",
    detail: "Detail",
    store: "Magasin",
    twem: "Twem",
    telephony: "Telephonie",
    electrician: "Electricien",
    appointment: "Rendez-vous",
    problem: "Probleme",
    access: "Acces",
    accessIntro: "Zone Twem pour envoyer un lien magique de connexion.",
    userEmail: "Email destinataire",
    magicLink: "Envoyer le lien de connexion",
    logout: "Reinitialiser la session locale",
    recentUpdates: "Remontees du jour",
    recentUpdatesIntro: "Affichage du jour uniquement. Le tableau repart a zero chaque nuit, mais les rapports magasin gardent l historique complet.",
    storeReports: "Rapports par magasin",
    storeReportsIntro: "Historique complet des remontees, replie par magasin pour garder la page lisible.",
    admin: "Administration Twem",
    adminIntro: "Ajouter des personnes, magasins et affectations.",
    name: "Nom",
    phone: "Telephone",
    email: "Mail",
    role: "Role",
    linkedStore: "Magasin lie",
    contactSearch: "Recherche contact",
    contactDirectory: "Liste des contacts",
    contactDirectoryIntro: "Recherche rapide et modification directe.",
    rolesTitle: "Roles",
    rolesIntro: "Ajouter un role si besoin pour les listes deroulantes.",
    addRole: "Ajouter le role",
    addPerson: "Ajouter une personne",
    people: "Personnes",
    storeName: "Nom magasin",
    city: "Ville",
    code: "Code",
    storeContact: "Contact magasin",
    addStore: "Ajouter un magasin",
    all: "Tous",
    planned: "A commencer",
    in_progress: "En cours",
    blocked: "Bloque",
    done: "Termine",
    issue: "Probleme",
    noAppointment: "Sans rendez-vous",
    summaryStores: "Magasins",
    summaryDone: "Termines",
    summaryBlocked: "Bloques",
    summaryNoAppointment: "Sans rendez-vous",
    summaryStoresNote: "Base de suivi globale",
    summaryDoneNote: "Chantiers clotures",
    summaryBlockedNote: "Points a traiter",
    summaryNoAppointmentNote: "Planification a lancer",
    reportTitle: "Rapport chantier Twem / Brico",
    generatedOn: "Genere le",
    activeUser: "utilisateur",
    progressDone: "termine",
    lastAppointment: "Dernier rendez-vous",
    recentActivity: "Activite recente",
    reportWindowError: "Impossible d ouvrir la fenetre de rapport.",
    importDone: "Import JSON termine.",
    csvPending: "Le support CSV n est pas encore branche. Utilise un fichier JSON pour l instant.",
    importError: "Import impossible",
    demoMode: "Demo locale",
    local: "Local",
    authState: "Utilisateur actif"
  },
  nl: {
    pageTitle: "Werfopvolging winkel per winkel",
    pageIntro: "Een lijn per winkel, daarna een uitklapbaar detail om betrokkenen, afspraken en blokkeringen te beheren.",
    mode: "Modus",
    connection: "Verbinding",
    search: "Zoeken",
    status: "Status",
    owner: "Twem verantwoordelijke",
    userView: "Gebruikersweergave",
    language: "Taal",
    importFile: "Bestand importeren",
    printReport: "Rapport maken / afdrukken",
    planning: "Werfplanning",
    syncMessage: "Klik op `+` om de winkelfiche te openen.",
    detail: "Detail",
    store: "Winkel",
    twem: "Twem",
    telephony: "Telefonie",
    electrician: "Elektricien",
    appointment: "Afspraak",
    problem: "Probleem",
    access: "Toegang",
    accessIntro: "Twem-zone om een magische loginlink te versturen.",
    userEmail: "E-mail ontvanger",
    magicLink: "Loginlink versturen",
    logout: "Lokale sessie resetten",
    recentUpdates: "Updates van vandaag",
    recentUpdatesIntro: "Alleen de updates van vandaag blijven hier zichtbaar. Elke nacht wordt dit blok leeggemaakt, terwijl de winkelrapporten de volledige historiek bewaren.",
    storeReports: "Rapporten per winkel",
    storeReportsIntro: "Volledige historiek van de updates, per winkel opvouwbaar om de pagina compact te houden.",
    admin: "Twem administratie",
    adminIntro: "Personen, winkels en toewijzingen toevoegen.",
    name: "Naam",
    phone: "Telefoon",
    email: "Mail",
    role: "Rol",
    linkedStore: "Gekoppelde winkel",
    contactSearch: "Contact zoeken",
    contactDirectory: "Contactenlijst",
    contactDirectoryIntro: "Snel zoeken en meteen aanpassen.",
    rolesTitle: "Rollen",
    rolesIntro: "Voeg indien nodig een rol toe voor de keuzelijsten.",
    addRole: "Rol toevoegen",
    addPerson: "Persoon toevoegen",
    people: "Personen",
    storeName: "Winkelnaam",
    city: "Stad",
    code: "Code",
    storeContact: "Winkelcontact",
    addStore: "Winkel toevoegen",
    all: "Alle",
    planned: "Te starten",
    in_progress: "Bezig",
    blocked: "Geblokkeerd",
    done: "Voltooid",
    issue: "Probleem",
    noAppointment: "Zonder afspraak",
    summaryStores: "Winkels",
    summaryDone: "Voltooid",
    summaryBlocked: "Geblokkeerd",
    summaryNoAppointment: "Zonder afspraak",
    summaryStoresNote: "Globale opvolgbasis",
    summaryDoneNote: "Afgesloten werven",
    summaryBlockedNote: "Punten te behandelen",
    summaryNoAppointmentNote: "Planning op te starten",
    reportTitle: "Twem / Brico werfrapport",
    generatedOn: "Gegenereerd op",
    activeUser: "gebruiker",
    progressDone: "voltooid",
    lastAppointment: "Laatste afspraak",
    recentActivity: "Recente activiteit",
    reportWindowError: "Onmogelijk om het rapportvenster te openen.",
    importDone: "JSON-import voltooid.",
    csvPending: "CSV wordt nog niet ondersteund. Gebruik voorlopig een JSON-bestand.",
    importError: "Import mislukt",
    demoMode: "Lokale demo",
    local: "Lokaal",
    authState: "Actieve gebruiker"
  }
};

const initialPeople = [
  { id: "p1", name: "Emir", role: "twem", phone: "0470 00 00 01", email: "emir@twem.be", storeCode: "", language: "fr" },
  { id: "p2", name: "Valou", role: "twem", phone: "0470 00 00 02", email: "valou@twem.be", storeCode: "", language: "fr" },
  { id: "p3", name: "M. Dupont", role: "magasin", phone: "0470 00 00 03", email: "anderlecht@brico.be", storeCode: "BRI-001", language: "fr" },
  { id: "p4", name: "Mme Martin", role: "magasin", phone: "0470 00 00 04", email: "wavre@brico.be", storeCode: "BRI-002", language: "fr" },
  { id: "p5", name: "M. Lambert", role: "magasin", phone: "0470 00 00 05", email: "liege@brico.be", storeCode: "BRI-003", language: "fr" },
  { id: "p6", name: "Mme Simon", role: "magasin", phone: "0470 00 00 06", email: "namur@brico.be", storeCode: "BRI-004", language: "fr" },
  { id: "p7", name: "Equipe Telephonie A", role: "telephonie", phone: "0470 00 00 07", email: "telephonie.a@partenaire.be", storeCode: "", language: "fr" },
  { id: "p8", name: "Equipe Telephonie B", role: "telephonie", phone: "0470 00 00 08", email: "telephonie.b@partenaire.be", storeCode: "", language: "nl" },
  { id: "p9", name: "Electricien Nord", role: "electricien", phone: "0470 00 00 09", email: "elec.nord@partenaire.be", storeCode: "", language: "fr" },
  { id: "p10", name: "Electricien Sud", role: "electricien", phone: "0470 00 00 10", email: "elec.sud@partenaire.be", storeCode: "", language: "fr" }
];

const demoStores = [
  {
    id: 1,
    code: "BRI-001",
    shopNumber: "5430",
    name: "Brico Anderlecht",
    city: "Bruxelles",
    address: "Chaussée de Charleroi, 131 - 6140 Fontaine-l'Evêque",
    shopType: "DOS",
    shopSize: "GSB",
    poLicences: "5900132733",
    poHpDesk: "5900130941",
    poPm: "5900132729",
    poRentingHw: "Neant",
    owner: "Valou",
    manager: "M. Dupont",
    status: "in_progress",
    health: "",
    updatedAt: "2026-04-22T08:20:00Z",
    steps: [
      { actorType: "store_manager", label: "Magasin", status: "done", note: "Magasin pret" },
      { actorType: "installer", label: "Telephonie", status: "in_progress", note: "Mise a jour terrain" },
      { actorType: "electrician", label: "Electricien", status: "done", note: "Le cable a ete installe" }
    ],
    appointments: [
      { id: "a1", datetime: "2026-04-24T09:00", status: "Propose", people: ["M. Dupont", "Electricien Nord"], note: "Premier passage" },
      { id: "a2", datetime: "2026-04-25T14:00", status: "Confirme", people: ["M. Dupont", "Equipe Telephonie A"], note: "Installation finale" }
    ]
  },
  {
    id: 2,
    code: "BRI-002",
    shopNumber: "3597",
    name: "Brico Wavre",
    city: "Wavre",
    address: "Rue de la Clef 34 - 4620 Fleron",
    shopType: "DOS",
    shopSize: "MSB",
    poLicences: "5900110120",
    poHpDesk: "5900110104",
    poPm: "5900127637",
    poRentingHw: "5900132731",
    owner: "Emir",
    manager: "Mme Martin",
    status: "planned",
    health: "",
    updatedAt: "2026-04-21T17:40:00Z",
    steps: [
      { actorType: "store_manager", label: "Magasin", status: "planned", note: "Pas encore sollicite" },
      { actorType: "installer", label: "Telephonie", status: "planned", note: "Intervention prevue a 09:00" },
      { actorType: "electrician", label: "Electricien", status: "planned", note: "Presence confirmee" }
    ],
    appointments: []
  },
  {
    id: 3,
    code: "BRI-003",
    shopNumber: "3311",
    name: "Brico Liege Rocourt",
    city: "Liege",
    address: "Kapelsestraat 168 - 2950 Kapellen",
    shopType: "DOS",
    shopSize: "MSB",
    poLicences: "5900110120",
    poHpDesk: "5900110104",
    poPm: "5900127637",
    poRentingHw: "5900132731",
    owner: "Valou",
    manager: "M. Lambert",
    status: "blocked",
    health: "Un poste caisse ne prend pas les appels entrants",
    updatedAt: "2026-04-22T07:55:00Z",
    steps: [
      { actorType: "store_manager", label: "Magasin", status: "in_progress", note: "Test caisse KO" },
      { actorType: "installer", label: "Telephonie", status: "done", note: "Installation terminee" },
      { actorType: "electrician", label: "Electricien", status: "in_progress", note: "Doute sur un raccordement local" }
    ],
    appointments: [
      { id: "a3", datetime: "2026-05-03T08:30", status: "Confirme", people: ["M. Lambert", "Electricien Nord", "Equipe Telephonie B"], note: "Jour chantier" }
    ]
  },
  {
    id: 4,
    code: "BRI-004",
    shopNumber: "3591",
    name: "Brico Namur",
    city: "Namur",
    address: "Britsierslaan 38 - 1030 Schaerbeek",
    shopType: "DOS",
    shopSize: "PSB",
    poLicences: "5900110120",
    poHpDesk: "5900110104",
    poPm: "5900127637",
    poRentingHw: "5900132731",
    owner: "Emir",
    manager: "Mme Simon",
    status: "done",
    health: "",
    updatedAt: "2026-04-21T15:10:00Z",
    steps: [
      { actorType: "store_manager", label: "Magasin", status: "done", note: "Tests valides" },
      { actorType: "installer", label: "Telephonie", status: "done", note: "Remplacement termine" },
      { actorType: "electrician", label: "Electricien", status: "done", note: "Cablage controle" }
    ],
    appointments: [
      { id: "a4", datetime: "2026-05-12T09:00", status: "Confirme", people: ["Mme Simon", "Electricien Sud", "Equipe Telephonie A", "Emir"], note: "Intervention realisee" }
    ]
  }
];

const demoActivities = [
  { id: "act-1", storeName: "Brico Liege Rocourt", result: "issue", comment: "Blocage remonte sur un poste caisse", confirmedBy: "manager.liege@brico.be", createdAt: "2026-04-22T07:56:00Z" },
  { id: "act-2", storeName: "Brico Anderlecht", result: "ok", comment: "Rendez-vous confirme et intervention en cours", confirmedBy: "terrain@twem.be", createdAt: "2026-04-22T08:21:00Z" }
];

const statusLabels = {
  planned: "A commencer",
  in_progress: "En cours",
  blocked: "Bloque",
  done: "Termine",
  issue: "Probleme"
};

const storageKey = "twem-brico-dashboard-v6";
const appConfig = window.APP_CONFIG || { mode: "demo", supabaseUrl: "", supabaseAnonKey: "", appwriteEndpoint: "", appwriteProjectId: "" };
const appMode = appConfig.mode || "demo";
const isSupabaseMode = appMode === "supabase";
const isAppwriteMode = appMode === "appwrite";
const supabaseClient = isSupabaseMode && window.supabase?.createClient && appConfig.supabaseUrl && appConfig.supabaseAnonKey
  ? window.supabase.createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey)
  : null;
const appwriteClient = isAppwriteMode && window.Appwrite?.Client && appConfig.appwriteEndpoint && appConfig.appwriteProjectId
  ? new window.Appwrite.Client().setEndpoint(appConfig.appwriteEndpoint).setProject(appConfig.appwriteProjectId)
  : null;
const appwriteAccount = appwriteClient && window.Appwrite?.Account
  ? new window.Appwrite.Account(appwriteClient)
  : null;
const appwriteIdFactory = window.Appwrite?.ID || null;
let realtimeChannel = null;

const state = {
  mode: "demo",
  connectionState: "offline",
  language: "fr",
  activeAdminTab: "planning",
  stores: [],
  activities: [],
  people: [],
  activeUserName: "Emir",
  toolItems: [],
  accessOverrides: [],
  roleOptions: [...defaultRoleOptions],
  contactSearch: "",
  filters: {
    search: "",
    status: "all",
    owner: "all"
  },
  expandedStoreIds: new Set()
};

const summaryGrid = document.querySelector("#summaryGrid");
const projectTableBody = document.querySelector("#projectTableBody");
const activityList = document.querySelector("#activityList");
const ownerFilter = document.querySelector("#ownerFilter");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const importButton = document.querySelector("#importButton");
const importInput = document.querySelector("#importInput");
const reportButton = document.querySelector("#reportButton");
const modeBadge = document.querySelector("#modeBadge");
const connectionBadge = document.querySelector("#connectionBadge");
const syncMessage = document.querySelector("#syncMessage");
const authState = document.querySelector("#authState");
const authForm = document.querySelector("#authForm");
const activeUserSelect = document.querySelector("#activeUserSelect");
const emailInput = document.querySelector("#emailInput");
const logoutButton = document.querySelector("#logoutButton");
const reportArchiveList = document.querySelector("#reportArchiveList");
const twemWorkspace = document.querySelector("#twemWorkspace");
const workspaceSidebar = document.querySelector("#workspaceSidebar");
const workspaceShell = document.querySelector(".workspace-shell");
const peopleList = document.querySelector("#peopleList");
const personForm = document.querySelector("#personForm");
const personNameInput = document.querySelector("#personNameInput");
const personPhoneInput = document.querySelector("#personPhoneInput");
const personEmailInput = document.querySelector("#personEmailInput");
const personRoleSelect = document.querySelector("#personRoleSelect");
const personLanguageSelect = document.querySelector("#personLanguageSelect");
const personStoreCodeInput = document.querySelector("#personStoreCodeInput");
const peopleSearchInput = document.querySelector("#peopleSearchInput");
const roleForm = document.querySelector("#roleForm");
const roleInput = document.querySelector("#roleInput");
const roleList = document.querySelector("#roleList");
const storeForm = document.querySelector("#storeForm");
const storeNameInput = document.querySelector("#storeNameInput");
const storeCityInput = document.querySelector("#storeCityInput");
const storeCodeInput = document.querySelector("#storeCodeInput");
const storeOwnerSelect = document.querySelector("#storeOwnerSelect");
const storeManagerInput = document.querySelector("#storeManagerInput");
const languageSelect = document.querySelector("#languageSelect");
const adminTabs = document.querySelector("#adminTabs");
const toolForm = document.querySelector("#toolForm");
const toolInput = document.querySelector("#toolInput");
const toolList = document.querySelector("#toolList");
const visibilityOverrideForm = document.querySelector("#visibilityOverrideForm");
const overrideStoreSelect = document.querySelector("#overrideStoreSelect");
const overridePersonSelect = document.querySelector("#overridePersonSelect");
const overrideZoneSelect = document.querySelector("#overrideZoneSelect");
const overrideLevelSelect = document.querySelector("#overrideLevelSelect");
const overrideStartInput = document.querySelector("#overrideStartInput");
const overrideEndInput = document.querySelector("#overrideEndInput");
const overrideReasonInput = document.querySelector("#overrideReasonInput");
const visibilityOverrideList = document.querySelector("#visibilityOverrideList");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function localUiState() {
  return {
    stores: state.stores,
    activities: state.activities,
    people: state.people,
    activeUserName: state.activeUserName,
    language: state.language,
    activeAdminTab: state.activeAdminTab,
    toolItems: state.toolItems,
    accessOverrides: state.accessOverrides,
    roleOptions: state.roleOptions,
    contactSearch: state.contactSearch
  };
}

function loadState() {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return {
      stores: clone(demoStores),
      activities: clone(demoActivities),
      people: clone(initialPeople),
      activeUserName: "Emir",
      language: "fr",
      activeAdminTab: "planning",
      toolItems: [],
      accessOverrides: [],
      roleOptions: [...defaultRoleOptions],
      contactSearch: ""
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      stores: parsed.stores || clone(demoStores),
      activities: parsed.activities || clone(demoActivities),
      people: (parsed.people || clone(initialPeople)).map((person) => ({
        language: "fr",
        storeCode: "",
        ...person
      })),
      activeUserName: parsed.activeUserName || "Emir",
      language: parsed.language || "fr",
      activeAdminTab: parsed.activeAdminTab || "planning",
      toolItems: parsed.toolItems || [],
      accessOverrides: parsed.accessOverrides || [],
      roleOptions: parsed.roleOptions || [...defaultRoleOptions],
      contactSearch: parsed.contactSearch || ""
    };
  } catch {
    return {
      stores: clone(demoStores),
      activities: clone(demoActivities),
      people: clone(initialPeople),
      activeUserName: "Emir",
      language: "fr",
      activeAdminTab: "planning",
      toolItems: [],
      accessOverrides: [],
      roleOptions: [...defaultRoleOptions],
      contactSearch: ""
    };
  }
}

function saveState() {
  window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
}

function t(key) {
  return translations[state.language]?.[key] || translations.fr[key] || key;
}

function statusLabel(key) {
  return t(key);
}

function currentUser() {
  return state.people.find((person) => person.name === state.activeUserName) || null;
}

function isTwemUser() {
  return currentUser()?.role === "twem";
}

function editableZonesForRole(role) {
  const map = {
    twem: ["all"],
    magasin: ["appointments", "project_prep", "network_config", "brico_feedback", "problem_notes"],
    telephonie: ["appointments", "order_articles", "destiny_coordination", "external_prep", "destiny_closure", "problem_notes", "status_admin"],
    electricien: ["appointments", "store_posts", "problem_notes"],
    it: ["appointments", "external_prep", "network_config", "store_posts"],
    herbots: ["appointments", "external_prep"],
    default: ["appointments"]
  };
  return map[String(role || "").toLowerCase()] || map.default;
}

function isOverrideActive(override) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = override.startDate ? new Date(`${override.startDate}T00:00:00`) : null;
  const end = override.endDate ? new Date(`${override.endDate}T23:59:59`) : null;
  if (start && today < start) {
    return false;
  }
  if (end && today > end) {
    return false;
  }
  return true;
}

function canEditZone(store, zone) {
  const user = currentUser();
  if (!user || !zone) {
    return false;
  }
  const allowedZones = editableZonesForRole(user.role);
  if (allowedZones.includes("all") || allowedZones.includes(zone)) {
    return true;
  }
  return state.accessOverrides.some((override) =>
    String(override.storeId) === String(store.id)
    && override.personId === user.id
    && override.zone === zone
    && override.level === "edit"
    && isOverrideActive(override)
  );
}

function isNetworkConfigLockedForUser(store) {
  const user = currentUser();
  const workflow = ensureStoreWorkflowData(store);
  return Boolean(user && user.role === "magasin" && workflow.networkConfigConfirmed);
}

function getRoleScopedStores() {
  const user = currentUser();
  if (!user) {
    return state.stores;
  }

  if (user.role === "magasin") {
    return state.stores.filter((store) => store.code === user.storeCode);
  }

  return state.stores;
}

function stepFor(store, actorType) {
  return store.steps.find((step) => step.actorType === actorType);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTime(dateString) {
  if (!dateString) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateString));
}

function formatDateTimeLocal(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isSameLocalDay(dateA, dateB) {
  return dateA.getFullYear() === dateB.getFullYear()
    && dateA.getMonth() === dateB.getMonth()
    && dateA.getDate() === dateB.getDate();
}

function peopleLabel(people = []) {
  return Array.isArray(people) ? people.join(", ") : String(people || "");
}

function roleLabel(role) {
  if (role === "twem") {
    return "Twem";
  }
  if (role === "magasin") {
    return t("store");
  }
  if (role === "telephonie") {
    return t("telephony");
  }
  if (role === "electricien") {
    return t("electrician");
  }
  return role;
}

function renderOptions(options, selectedValue) {
  return options.map((option) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    const selected = value === selectedValue ? "selected" : "";
    return `<option value="${escapeHtml(value)}" ${selected}>${escapeHtml(label)}</option>`;
  }).join("");
}

function renderRoleOptions(selectedValue) {
  return renderOptions(
    state.roleOptions.map((role) => ({ value: role, label: roleLabel(role) })),
    selectedValue
  );
}

function renderStoreCodeOptions(selectedValue = "") {
  const storeOptions = [
    { value: "", label: "-" },
    ...state.stores.map((store) => ({
      value: store.code,
      label: `${store.name} (${store.code})`
    }))
  ];

  return renderOptions(storeOptions, selectedValue);
}

function renderStorePeopleOptions(store, selectedValues = []) {
  const candidates = state.people.filter((person) => {
    if (person.role === "magasin") {
      return person.storeCode === store.code;
    }
    return person.role === "twem" || person.role === "telephonie" || person.role === "electricien";
  });

  return candidates.map((person) => {
    const selected = selectedValues.includes(person.name) ? "selected" : "";
    return `<option value="${escapeHtml(person.name)}" ${selected}>${escapeHtml(person.name)} - ${escapeHtml(person.role)}</option>`;
  }).join("");
}

function normalizeRemotePerson(person) {
  return {
    id: String(person.id),
    name: person.name || "",
    role: person.role || "magasin",
    phone: person.phone || "",
    email: person.email || "",
    storeCode: person.store_code || "",
    language: person.language || "fr"
  };
}

function mapStoreRowToState(storeRow, stepRows = [], appointmentRows = []) {
  const stepsByActor = Object.fromEntries(stepRows.map((step) => [step.actor_type, step]));
  const buildStep = (actorType, fallbackLabel) => ({
    actorType,
    label: fallbackLabel,
    status: stepsByActor[actorType]?.status === "issue" ? "blocked" : (stepsByActor[actorType]?.status || "planned"),
    note: stepsByActor[actorType]?.note || ""
  });

  return {
    id: Number(storeRow.id),
    code: storeRow.code,
    name: storeRow.name,
    city: storeRow.city,
    owner: storeRow.owner_name || "",
    manager: storeRow.manager_name || "",
    status: storeRow.status || "planned",
    health: storeRow.health || "",
    updatedAt: storeRow.updated_at || storeRow.last_update_at || new Date().toISOString(),
    steps: [
      buildStep("store_manager", "Magasin"),
      buildStep("installer", "Telephonie"),
      buildStep("electrician", "Electricien")
    ],
    appointments: appointmentRows.map((appointment) => ({
      id: String(appointment.id),
      datetime: appointment.scheduled_at,
      status: appointment.status || "Propose",
      people: appointment.people ? JSON.parse(appointment.people) : [],
      note: appointment.note || ""
    }))
  };
}

function roleValueFromSession(session) {
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return null;
  }
  return state.people.find((person) => person.email.toLowerCase() === email) || null;
}

function badgeClass(status) {
  if (status === "done" || status === "ok" || status === "Confirme") {
    return "badge badge-done";
  }

  if (status === "in_progress" || status === "Propose") {
    return "badge badge-in_progress";
  }

  if (status === "blocked" || status === "issue") {
    return "badge badge-blocked";
  }

  return "badge badge-planned";
}

function sortedAppointments(store) {
  return [...store.appointments].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

function computeProgress(store) {
  const map = { planned: 0, in_progress: 50, done: 100 };
  const values = store.steps.map((step) => map[step.status] ?? 0);
  const average = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  return store.status === "done" ? 100 : average;
}

function renderProgressCircle(store) {
  const progress = computeProgress(store);
  return `
    <div class="progress-wrap">
      <div class="progress-circle" style="--progress:${progress}%">
        <span>${progress}%</span>
      </div>
    </div>
  `;
}

function buildTimeline(store) {
  const appointments = sortedAppointments(store);
  if (!appointments.length) {
    return '<div class="empty-state">Aucun rendez-vous programme.</div>';
  }

  const dates = appointments.map((appointment) => new Date(appointment.datetime));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const start = new Date(minDate);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(maxDate);
  end.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7)));
  const weekCount = Math.max(1, Math.round((end - start) / (7 * 24 * 60 * 60 * 1000)) + 1);
  const weeks = Array.from({ length: weekCount }, (_, index) => {
    const weekDate = new Date(start);
    weekDate.setDate(start.getDate() + index * 7);
    return weekDate;
  });
  const gridStyle = `grid-template-columns: 1.3fr repeat(${weekCount}, minmax(56px, 1fr));`;

  return `
    <div class="gantt-shell">
      <div class="gantt-header" style="${gridStyle}">
        <div class="gantt-label">Planning</div>
        ${weeks.map((weekDate, index) => `<div class="gantt-week">S${index + 1}<br>${weekDate.toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit" })}</div>`).join("")}
      </div>
      ${appointments.map((appointment) => {
        const appointmentDate = new Date(appointment.datetime);
        const weekIndex = Math.max(0, Math.floor((appointmentDate - start) / (7 * 24 * 60 * 60 * 1000)));
        return `
          <div class="gantt-row" style="${gridStyle}">
            <div class="gantt-label">${escapeHtml(appointment.status)}<br>${escapeHtml(peopleLabel(appointment.people))}</div>
            <div class="gantt-track" style="grid-column: 2 / span ${weekCount}; --weeks:${weekCount};">
              <div class="gantt-bar ${appointment.status === "Propose" ? "proposed" : ""}" style="grid-column:${weekIndex + 1}">
                ${escapeHtml(formatDateTime(appointment.datetime))}
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function getFilteredStores() {
  return getRoleScopedStores().filter((store) => {
    const haystack = `${store.name} ${store.city} ${store.code}`.toLowerCase();
    const matchesSearch = haystack.includes(state.filters.search);
    const matchesStatus = state.filters.status === "all" || store.status === state.filters.status;
    const matchesOwner = state.filters.owner === "all" || store.owner === state.filters.owner;
    return matchesSearch && matchesStatus && matchesOwner;
  });
}

function renderSummary() {
  const visibleStores = getRoleScopedStores();
  const total = visibleStores.length || 1;
  const doneCount = visibleStores.filter((store) => store.status === "done").length;
  const blockedCount = visibleStores.filter((store) => store.status === "blocked").length;
  const noRdvCount = visibleStores.filter((store) => store.appointments.length === 0).length;
  const cards = [
    { label: t("summaryStores"), value: visibleStores.length, note: t("summaryStoresNote"), portion: 100 },
    { label: t("summaryDone"), value: doneCount, note: t("summaryDoneNote"), portion: Math.round((doneCount / total) * 100) },
    { label: t("summaryBlocked"), value: blockedCount, note: t("summaryBlockedNote"), portion: Math.round((blockedCount / total) * 100) },
    { label: t("summaryNoAppointment"), value: noRdvCount, note: t("summaryNoAppointmentNote"), portion: Math.round((noRdvCount / total) * 100) }
  ];

  summaryGrid.innerHTML = "";
  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "panel summary-card";
    article.innerHTML = `
      <div class="summary-card-layout">
        <div class="summary-copy">
          <span class="mini-label">${card.label}</span>
          <strong>${card.value}</strong>
          <span class="summary-note">${card.note}</span>
        </div>
        <div class="mini-donut" style="--portion:${card.portion}%">
          <span>${card.portion}%</span>
        </div>
      </div>
    `;
    summaryGrid.append(article);
  });
}

function syncSelectors() {
  languageSelect.value = state.language;
  const owners = [...new Set(getRoleScopedStores().map((store) => store.owner))].sort();
  ownerFilter.innerHTML = `<option value="all">${t("all")}</option>`;
  owners.forEach((owner) => {
    const option = document.createElement("option");
    option.value = owner;
    option.textContent = owner;
    ownerFilter.append(option);
  });

  activeUserSelect.innerHTML = state.people.map((person) => {
    const selected = person.name === state.activeUserName ? "selected" : "";
    return `<option value="${escapeHtml(person.name)}" ${selected}>${escapeHtml(person.name)} - ${escapeHtml(person.role)}</option>`;
  }).join("");

  storeOwnerSelect.innerHTML = state.people
    .filter((person) => person.role === "twem")
    .map((person) => `<option value="${escapeHtml(person.name)}">${escapeHtml(person.name)}</option>`)
    .join("");

  personRoleSelect.innerHTML = renderRoleOptions(personRoleSelect.value || "twem");
  personLanguageSelect.value = personLanguageSelect.value || "fr";
  personStoreCodeInput.innerHTML = renderStoreCodeOptions(personStoreCodeInput.value || "");
  peopleSearchInput.value = state.contactSearch;
}

function buildAppointmentsEditor(store) {
  const rows = store.appointments.length
    ? store.appointments.map((appointment, index) => `
        <div class="appointment-item">
          <label>
            <span>Date et heure</span>
            <input type="datetime-local" name="appointment_datetime_${index}" value="${formatDateTimeLocal(appointment.datetime)}">
          </label>
          <label>
            <span>Statut</span>
            <select name="appointment_status_${index}">
              ${renderOptions(appointmentStatusOptions, appointment.status)}
            </select>
          </label>
          <label>
            <span>Personnes concernees</span>
            <select name="appointment_people_${index}" class="multi-select" multiple>
              ${renderStorePeopleOptions(store, appointment.people)}
            </select>
          </label>
          <button type="button" class="mini-button" data-remove-appointment="${store.id}" data-index="${index}">Supprimer</button>
        </div>
      `).join("")
    : '<div class="empty-state">Aucun rendez-vous pour ce magasin.</div>';

  return `
    <article class="appointments-card" data-access-zone="appointments">
      <h3>Rendez-vous</h3>
      <p>Plusieurs rendez-vous possibles par magasin.</p>
      <div class="appointments-list">${rows}</div>
      <div class="two-col">
        <label>
          <span>Nouveau rendez-vous</span>
          <input type="datetime-local" name="new_appointment_datetime">
        </label>
        <label>
          <span>Statut</span>
          <select name="new_appointment_status">
            ${renderOptions(appointmentStatusOptions, "Propose")}
          </select>
        </label>
      </div>
      <div class="two-col">
        <label>
          <span>Personnes concernees</span>
          <select name="new_appointment_people" class="multi-select" multiple>
            ${renderStorePeopleOptions(store, [])}
          </select>
        </label>
        <label>
          <span>Note rendez-vous</span>
          <input type="text" name="new_appointment_note" placeholder="Ex: acces reserve prevu">
        </label>
      </div>
    </article>
  `;
}

function getStoreQuantityPlan(store) {
  const codeNumber = Number.parseInt(String(store.code).replace(/\D/g, ""), 10) || 0;
  const licenseCount = 8 + (codeNumber % 6);
  const fixCount = Math.max(2, Math.round(licenseCount * 0.6));
  const mobileCount = Math.max(1, Math.round(licenseCount * 0.3));
  const callButtonCount = Math.max(1, Math.round(licenseCount * 0.15));
  const panicCount = Math.max(0, Math.round(licenseCount * 0.08));

  return { licenseCount, fixCount, mobileCount, callButtonCount, panicCount };
}

function buildStorePilotSkeleton(store) {
  const { licenseCount, fixCount, mobileCount, callButtonCount, panicCount } = getStoreQuantityPlan(store);

  return `
    <article class="editor-card">
      <h3>Quantites magasin</h3>
      <p>Vue de pilotage rapide des besoins reseau et materiel du magasin.</p>
      <div class="quantity-grid">
        <div class="quantity-card"><span class="mini-label">Licences</span><strong>${licenseCount}</strong></div>
        <div class="quantity-card"><span class="mini-label">Postes fixes</span><strong>${fixCount}</strong></div>
        <div class="quantity-card"><span class="mini-label">Mobiles</span><strong>${mobileCount}</strong></div>
        <div class="quantity-card"><span class="mini-label">Call buttons</span><strong>${callButtonCount}</strong></div>
        <div class="quantity-card"><span class="mini-label">Panic buttons</span><strong>${panicCount}</strong></div>
      </div>
    </article>
  `;
}

function buildNetworkConfigSkeleton(store) {
  const { fixCount, mobileCount, callButtonCount, panicCount } = getStoreQuantityPlan(store);
  const workflow = ensureStoreWorkflowData(store);
  const extensionOptions = [
    "250 - compta",
    "300 - jardin",
    "320 - accueil",
    "340 - caisse",
    "350 - carrelage",
    "380 - drive-in",
    "900 - zaagmachine",
    "901 - tuin",
    "902 - verf",
    "903 - keukens",
    "904 - tegels",
    "922 - front end evacuation",
    "923 - safe room",
    "924 - drive in till zone"
  ];

  const buildSelect = () => `
    <select>
      <option value="">Choisir une extension / un lieu</option>
      ${extensionOptions.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
    </select>
  `;

  const buildRows = (label, count) => {
    if (!count) {
      return "";
    }

    return `
      <article class="network-category">
        <div class="network-category-head">
          <h4>${label}</h4>
          <span>${count} ligne(s)</span>
        </div>
        <div class="network-rows">
          ${Array.from({ length: count }, (_, index) => `
            <div class="network-row">
              <div class="network-slot">${label} ${index + 1}</div>
              <label>
                <span>Extension + lieu</span>
                ${buildSelect()}
              </label>
              <label>
                <span>Note</span>
                <input type="text" placeholder="Ex: personnaliser la touche / commentaire">
              </label>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  };

  return `
    <details class="network-skeleton" open data-access-zone="network_config">
      <summary>
        <span>Configuration du reseau</span>
        <span>Lignes generees automatiquement par quantite magasin</span>
      </summary>
      <div class="network-skeleton-body">
        <p class="posts-skeleton-intro">Le responsable magasin remplit cette partie pour permettre a l IT de programmer les appareils avant installation.</p>
        <input type="hidden" name="network_config_confirmed" value="${workflow.networkConfigConfirmed ? "1" : "0"}">
        <div class="network-confirm-bar">
          <span class="cell-note">${workflow.networkConfigConfirmed ? "Choix magasin confirmes. Modifications ensuite via Probleme / notes." : "Le magasin peut remplir puis confirmer ses choix."}</span>
          <button type="button" class="mini-button" data-network-confirm="${store.id}">${workflow.networkConfigConfirmed ? "Choix confirmes" : "Confirmer vos choix"}</button>
        </div>
        ${buildRows("Poste fixe", fixCount)}
        ${buildRows("Mobile", mobileCount)}
        ${buildRows("Call button", callButtonCount)}
        ${buildRows("Panic button", panicCount)}
      </div>
    </details>
  `;
}

function buildStorePostsSkeleton(store) {
  const base = String(store.code).replace(/\D/g, "").slice(-2) || "01";
  const rows = [
    { extension: `${base}01`, type: "Poste fixe", model: "Yealink T54W", department: "Accueil", language: "FR", status: "OK", note: "Poste principal installe et teste" },
    { extension: `${base}02`, type: "Poste fixe", model: "Yealink T54W", department: "Caisse", language: "FR", status: "En cours", note: "Configuration en attente" },
    { extension: `${base}03`, type: "Call button", model: "Helios IP Verso", department: "Drive-in", language: "NL", status: "Bloque", note: "Raccordement reseau a verifier" }
  ];

  return `
    <details class="posts-skeleton" open data-access-zone="store_posts">
      <summary>
        <span>Postes magasin</span>
        <span>${rows.length} ligne(s) de demonstration</span>
      </summary>
      <div class="posts-skeleton-body">
        <p class="posts-skeleton-intro">Squelette visuel: import automatique des lignes puis possibilite d ajouter, modifier ou supprimer une ligne manuellement.</p>
        <div class="posts-table-wrap">
          <table class="posts-table">
            <thead>
              <tr>
                <th>Extension</th>
                <th>Type</th>
                <th>Modele</th>
                <th>Departement</th>
                <th>Langue</th>
                <th>Statut</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  <td>${escapeHtml(row.extension)}</td>
                  <td>${escapeHtml(row.type)}</td>
                  <td>${escapeHtml(row.model)}</td>
                  <td>${escapeHtml(row.department)}</td>
                  <td>${escapeHtml(row.language)}</td>
                  <td><span class="${badgeClass(row.status === "OK" ? "ok" : row.status === "En cours" ? "in_progress" : "issue")}">${escapeHtml(row.status)}</span></td>
                  <td>${escapeHtml(row.note)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="posts-skeleton-actions">
          <button type="button" class="mini-button">Importer le fichier magasin</button>
          <button type="button" class="mini-button">Ajouter une ligne poste</button>
        </div>
      </div>
    </details>
  `;
}

function buildStoreHeaderCards() {
  return `
    <div class="editor-grid">
      <article class="editor-card" data-access-zone="project_prep">
        <h3>Configuration</h3>
        <p>Suivi de la demande de configuration magasin.</p>
        <div class="two-col">
          <label>
            <span>Demande configuration</span>
            <select name="config_status">
              ${renderOptions(["Pas envoye", "Envoye", "Recue"], "Envoye")}
            </select>
          </label>
          <label>
            <span>Date telephonie actuelle</span>
            <input type="date" name="current_phone_date" value="2026-04-30">
          </label>
        </div>
      </article>

      <article class="editor-card" data-access-zone="order_articles">
        <h3>Commande articles</h3>
        <p>Suivi de la commande et de la reception magasin.</p>
        <div class="two-col">
          <label>
            <span>Commande</span>
            <select name="order_status">
              ${renderOptions(["Non transmise", "Transmise fournisseur", "Recue magasin"], "Transmise fournisseur")}
            </select>
          </label>
          <label>
            <span>Commentaire logistique</span>
            <input type="text" name="order_note" value="Livraison partielle prevue cette semaine">
          </label>
        </div>
      </article>
    </div>
  `;
}

function buildExtraActorsBoard() {
  const groups = [
    [
      { title: "Intervenant", statusName: "it_status", noteName: "it_note", noteValue: "IT - Preparation technique en attente" },
      { title: "Intervenant", statusName: "herbots_status", noteName: "herbots_note", noteValue: "Herbots - Intervention a planifier" },
      { title: "Intervenant", statusName: "other_actor_status_1", noteName: "other_actor_1", noteValue: "Nom de l intervenant + note" },
      { title: "Intervenant", statusName: "other_actor_status_2", noteName: "other_actor_2", noteValue: "Nom de l intervenant + note" }
    ],
    [
      { title: "Intervenant", statusName: "other_actor_status_3", noteName: "other_actor_3", noteValue: "Nom de l intervenant + note" },
      { title: "Intervenant", statusName: "other_actor_status_4", noteName: "other_actor_4", noteValue: "Nom de l intervenant + note" },
      { title: "Intervenant", statusName: "other_actor_status_5", noteName: "other_actor_5", noteValue: "Nom de l intervenant + note" },
      { title: "Intervenant", statusName: "other_actor_status_6", noteName: "other_actor_6", noteValue: "Nom de l intervenant + note" }
    ]
  ];

  return `
    <div class="actor-board-stack">
      ${groups.map((group) => `
        <div class="actor-board yellow-line-clone">
          <div class="actor-board-head">
            ${group.map((item) => `<div class="actor-board-title">${item.title}</div>`).join("")}
          </div>
          <div class="actor-board-body">
            ${group.map((item) => `
              <div class="actor-board-cell">
                <div class="cell-stack">
                  <span class="${badgeClass("planned")}">${statusLabel("planned")}</span>
                  <input type="text" name="${item.noteName}" value="${escapeHtml(item.noteValue)}" placeholder="Nom / note">
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function buildPrimaryIntervenantsBoard(store, manager, installer, electrician) {
  return `
    <div class="actor-board yellow-line-clone">
      <div class="actor-board-head">
        <div class="actor-board-title">Twem</div>
        <div class="actor-board-title">Magasin</div>
        <div class="actor-board-title">Telephonie</div>
        <div class="actor-board-title">Electricien</div>
      </div>
      <div class="actor-board-body">
        <div class="actor-board-cell">
          <div class="cell-stack">
            <strong>${escapeHtml(store.owner)}</strong>
            <span class="cell-note">Derniere maj ${formatDateTime(store.updatedAt)}</span>
          </div>
        </div>
        <div class="actor-board-cell">
          <div class="cell-stack">
            <span class="${badgeClass(manager.status)}">${statusLabel(manager.status)}</span>
            <span class="cell-note">${escapeHtml(manager.note || "-")}</span>
          </div>
        </div>
        <div class="actor-board-cell">
          <div class="cell-stack">
            <span class="${badgeClass(installer.status)}">${statusLabel(installer.status)}</span>
            <span class="cell-note">${escapeHtml(installer.note || "-")}</span>
          </div>
        </div>
        <div class="actor-board-cell">
          <div class="cell-stack">
            <span class="${badgeClass(electrician.status)}">${statusLabel(electrician.status)}</span>
            <span class="cell-note">${escapeHtml(electrician.note || "-")}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ensureStoreWorkflowData(store) {
  const { mobileCount } = getStoreQuantityPlan(store);
  if (!store.workflow) {
    store.workflow = {};
  }

  const defaults = {
    destinyInstallDate: "",
    destinyPmName: "",
    destinyPmEmail: "",
    destinyTicketRef: "",
    destinyCaseRef: "",
    destinyDistribution: "Emir; Valou; Charles Roux",
    networkSurveyStatus: "A planifier",
    mobileCoverage: "A verifier",
    firstVisitRemark: "",
    extensionRequestStatus: "A envoyer",
    extensionConfigStatus: "En attente",
    ivrNotes: "",
    greetingNotes: "",
    alarmHandledByIt: "A confirmer",
    vlan22Status: "A relancer",
    vlan22Activated: "Non",
    charlesRouxStatus: "A verifier",
    cablingStatus: "A verifier",
    mobileChargersSent: "Non",
    mobileChargerCount: String(Math.max(1, Math.ceil(mobileCount / 10))),
    destinyInstallDone: "Non",
    destinyInstallRemark: "",
    bricoFinalMailStatus: "A envoyer",
    bricoFinalRemark: "",
    ltSwitchStatus: "En attente",
    networkConfigConfirmed: false
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!store.workflow[key]) {
      store.workflow[key] = value;
    }
  });

  return store.workflow;
}

function buildDestinyWorkflowCards(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid">
      <article class="editor-card" data-access-zone="destiny_coordination">
        <h3>Coordination Destiny</h3>
        <p>Suivi du dossier installation, PM et communication avec Destiny.</p>
        <div class="contacts-form-grid">
          <label>
            <span>Date installation Destiny</span>
            <input type="date" name="destiny_install_date" value="${escapeHtml(workflow.destinyInstallDate)}">
          </label>
          <label>
            <span>Reference ticket Destiny</span>
            <input type="text" name="destiny_ticket_ref" value="${escapeHtml(workflow.destinyTicketRef)}" placeholder="Ex: DST-2026-0412">
          </label>
          <label>
            <span>Numero de dossier Destiny</span>
            <input type="text" name="destiny_case_ref" value="${escapeHtml(workflow.destinyCaseRef)}" placeholder="Ex: dossier installation">
          </label>
          <label>
            <span>PM installateur Destiny</span>
            <input type="text" name="destiny_pm_name" value="${escapeHtml(workflow.destinyPmName)}" placeholder="Nom du PM">
          </label>
          <label>
            <span>Mail PM installateur</span>
            <input type="email" name="destiny_pm_email" value="${escapeHtml(workflow.destinyPmEmail)}" placeholder="pm@destiny.be">
          </label>
          <label>
            <span>Liste diffusion minimale</span>
            <input type="text" name="destiny_distribution" value="${escapeHtml(workflow.destinyDistribution)}" placeholder="3 personnes minimum">
          </label>
        </div>
      </article>

      <article class="editor-card" data-access-zone="destiny_coordination">
        <h3>Pre-visite Destiny</h3>
        <p>Controle reseau et remarques du premier passage technique sur site.</p>
        <div class="two-col">
          <label>
            <span>Verification reseau sur site</span>
            <select name="network_survey_status">
              ${renderOptions(["A planifier", "En cours", "Termine", "Probleme"], workflow.networkSurveyStatus)}
            </select>
          </label>
          <label>
            <span>Couverture mobile</span>
            <select name="mobile_coverage">
              ${renderOptions(["A verifier", "Tous reseaux OK", "Certains reseaux manquants", "Aucun reseau mobile"], workflow.mobileCoverage)}
            </select>
          </label>
        </div>
        <label>
          <span>Remarque premiere visite</span>
          <textarea name="first_visit_remark" rows="4" placeholder="Probleme releve, action a mettre en place, adaptation necessaire">${escapeHtml(workflow.firstVisitRemark)}</textarea>
        </label>
      </article>
    </div>
  `;
}

function buildBricoRequestCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid">
      <article class="editor-card full-span-card" data-access-zone="configuration_request">
        <h3>Configuration demandee au magasin</h3>
        <p>Le manager Brico transmet la configuration extensions, message d accueil et routage IVR.</p>
        <div class="contacts-form-grid">
          <label>
            <span>Mail configuration envoye</span>
            <select name="extension_request_status">
              ${renderOptions(["A envoyer", "Envoye", "Relancee"], workflow.extensionRequestStatus)}
            </select>
          </label>
          <label>
            <span>Configuration extensions recue</span>
            <select name="extension_config_status">
              ${renderOptions(["En attente", "Partielle", "Recue"], workflow.extensionConfigStatus)}
            </select>
          </label>
        </div>
        <div class="two-col">
          <label>
            <span>Message d accueil / IVR / remarques manager</span>
            <textarea name="ivr_notes" rows="5" placeholder="Appuyez sur 1, appuyez sur 2, consignes, routage, remarques libres">${escapeHtml(workflow.ivrNotes)}</textarea>
          </label>
          <label>
            <span>Autres consignes Brico</span>
            <textarea name="greeting_notes" rows="5" placeholder="Texte libre sur les souhaits du magasin">${escapeHtml(workflow.greetingNotes)}</textarea>
          </label>
        </div>
      </article>
    </div>
  `;
}

function buildExternalPreparationCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid">
      <article class="editor-card full-span-card" data-access-zone="external_prep">
        <h3>Preparation externe</h3>
        <p>Elements prepares en amont par IT, Charles Roux et les intervenants externes avant installation.</p>
        <div class="external-prep-grid external-prep-grid-wide">
          <label>
            <span>Verification mobile</span>
            <select name="mobile_check_status">
              ${renderOptions(["A verifier", "OK Telenet", "OK Proximus", "Bloque"], "A verifier")}
            </select>
          </label>
          <label>
            <span>Choix operateur mobile</span>
            <select name="mobile_operator">
              ${renderOptions(["Telenet", "Proximus"], "Telenet")}
            </select>
          </label>
          <label>
            <span>Configuration VLAN22</span>
            <select name="vlan22_status">
              ${renderOptions(["Pas demande", "Demandee", "Recue", "Bloquee"], workflow.vlan22Status)}
            </select>
          </label>
          <label>
            <span>Note preparation externe</span>
            <input type="text" name="external_prep_note" value="Coordination en cours avec les equipes externes">
          </label>
          <label>
            <span>Alarme geree par IT</span>
            <select name="alarm_handled_by_it">
              ${renderOptions(["A confirmer", "Oui", "Non"], workflow.alarmHandledByIt)}
            </select>
          </label>
          <label>
            <span>VLAN22 active</span>
            <select name="vlan22_activated">
              ${renderOptions(["Non", "Oui", "Bloque"], workflow.vlan22Activated)}
            </select>
          </label>
          <label>
            <span>Charles Roux - cablage</span>
            <select name="charles_roux_status">
              ${renderOptions(["A verifier", "OK", "Probleme"], workflow.charlesRouxStatus)}
            </select>
          </label>
          <label>
            <span>Cablage sur site</span>
            <select name="cabling_status">
              ${renderOptions(["A verifier", "OK", "Probleme"], workflow.cablingStatus)}
            </select>
          </label>
          <label>
            <span>Chargeurs mobiles envoyes</span>
            <select name="mobile_chargers_sent">
              ${renderOptions(["Non", "Partiel", "Oui"], workflow.mobileChargersSent)}
            </select>
          </label>
          <label>
            <span>Nombre de chargeurs requis</span>
            <input type="number" min="0" name="mobile_charger_count" value="${escapeHtml(workflow.mobileChargerCount)}">
          </label>
        </div>
      </article>
    </div>
  `;
}

function buildClosureWorkflowCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid">
      <article class="editor-card" data-access-zone="destiny_closure">
        <h3>Cloture installation Destiny</h3>
        <p>Validation de fin d intervention et remarques de chantier apres installation.</p>
        <div class="two-col">
          <label>
            <span>Installation Destiny terminee</span>
            <select name="destiny_install_done">
              ${renderOptions(["Non", "Oui", "Avec reserve"], workflow.destinyInstallDone)}
            </select>
          </label>
          <label>
            <span>Mail de fin equipe Brico</span>
            <select name="brico_final_mail_status">
              ${renderOptions(["A envoyer", "Envoye", "Retour recu"], workflow.bricoFinalMailStatus)}
            </select>
          </label>
        </div>
        <label>
          <span>Remarque installation Destiny</span>
          <textarea name="destiny_install_remark" rows="4" placeholder="Probleme constate, element a corriger, reserve de fin">${escapeHtml(workflow.destinyInstallRemark)}</textarea>
        </label>
      </article>

      <article class="editor-card" data-access-zone="brico_feedback">
        <h3>Retour Brico / bascule suite</h3>
        <p>Remarques finales du magasin et eventuelle bascule vers la plateforme suivante.</p>
        <label>
          <span>Remarques finales Brico</span>
          <textarea name="brico_final_remark" rows="4" placeholder="Element qui pourrait encore ne pas fonctionner, remarque post-installation">${escapeHtml(workflow.bricoFinalRemark)}</textarea>
        </label>
        <label>
          <span>Switch plateforme LT</span>
          <select name="lt_switch_status">
            ${renderOptions(["En attente", "A decider", "Basculee"], workflow.ltSwitchStatus)}
          </select>
        </label>
      </article>
    </div>
  `;
}

function buildStoreIdentityMeta(store) {
  return `
    <div class="store-meta-grid">
      <div class="store-meta-card">
        <span class="mini-label">Magasin</span>
        <strong>${escapeHtml(store.shopNumber || store.code)}</strong>
        <span class="cell-note">${escapeHtml(store.shopType || "-")} - ${escapeHtml(store.shopSize || "-")}</span>
      </div>
      <div class="store-meta-card">
        <span class="mini-label">Adresse</span>
        <strong>${escapeHtml(store.address || `${store.city} - ${store.code}`)}</strong>
      </div>
      <div class="store-meta-card">
        <span class="mini-label">PO / Commandes</span>
        <strong>PO Licence ${escapeHtml(store.poLicences || "-")}</strong>
        <span class="cell-note">PO HpDesk ${escapeHtml(store.poHpDesk || "-")}</span>
        <span class="cell-note">PO PM ${escapeHtml(store.poPm || "-")}</span>
        <span class="cell-note">PO Renting ${escapeHtml(store.poRentingHw || "-")}</span>
      </div>
    </div>
  `;
}

function buildStoreSideSummary(store) {
  const appointments = sortedAppointments(store);
  const appointmentSummary = appointments.length
    ? appointments.map((appointment) => `
        <div class="cell-stack">
          <strong>${formatDateTime(appointment.datetime)}</strong>
          <span class="${badgeClass(appointment.status)}">${appointment.status}</span>
          <span class="cell-note">${escapeHtml(peopleLabel(appointment.people))}</span>
        </div>
      `).join("")
    : '<div class="cell-stack"><strong>-</strong><span class="badge badge-planned">A fixer</span><span class="cell-note">-</span></div>';

  return `
    <div class="store-side-panel yellow-line-clone">
      <div class="store-side-panel-head">
        <div class="actor-board-title">Rendez-vous</div>
        <div class="actor-board-title">Statut</div>
        <div class="actor-board-title">Probleme</div>
      </div>
      <div class="store-side-panel-body">
        <div class="store-side-block">
        ${appointmentSummary}
        </div>
        <div class="store-side-block">
        <div class="cell-stack">
          ${renderProgressCircle(store)}
          <span class="${badgeClass(store.status)}">${statusLabel(store.status)}</span>
        </div>
        </div>
        <div class="store-side-block">
          <span class="cell-note">${escapeHtml(store.health || "-")}</span>
        </div>
      </div>
    </div>
  `;
}

function buildStoreHero(store, manager, installer, electrician, isExpanded) {
  return `
    <div class="store-focus-layout expanded-store-hero">
      <article class="editor-card store-info-column">
        <div class="store-info-head">
          <button type="button" class="toggle-button" data-store-toggle="${store.id}">${isExpanded ? "-" : "+"}</button>
          <div class="store-info-title">
            <h3>${escapeHtml(store.name)}</h3>
          </div>
        </div>
        ${buildStoreIdentityMeta(store)}
      </article>
      <article class="editor-card intervenants-focus">
        ${buildPrimaryIntervenantsBoard(store, manager, installer, electrician)}
        ${buildExtraActorsBoard()}
        <p class="intervenants-help">Ajout et modification des intervenants dans l onglet Contacts.</p>
      </article>
      <article class="editor-card store-side-shell">
        ${buildStoreSideSummary(store)}
      </article>
    </div>
  `;
}

function renderStores() {
  const stores = getFilteredStores();
  projectTableBody.innerHTML = "";

  if (!stores.length) {
    projectTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">Aucun magasin ne correspond aux filtres.</td></tr>';
    return;
  }

  stores.forEach((store, index) => {
    const manager = stepFor(store, "store_manager");
    const installer = stepFor(store, "installer");
    const electrician = stepFor(store, "electrician");
    const appointments = sortedAppointments(store);
    const appointmentSummary = appointments.length
      ? appointments.map((appointment) => `
          <div class="cell-stack">
            <strong>${formatDateTime(appointment.datetime)}</strong>
            <span class="${badgeClass(appointment.status)}">${appointment.status}</span>
            <span class="cell-note">${escapeHtml(peopleLabel(appointment.people))}</span>
          </div>
        `).join("")
      : '<div class="cell-stack"><strong>-</strong><span class="badge badge-planned">A fixer</span><span class="cell-note">-</span></div>';
    const isExpanded = state.expandedStoreIds.has(store.id);

    const heroRow = document.createElement("tr");
    heroRow.className = "expanded-hero-row";
    heroRow.innerHTML = `
      <td colspan="9">
        <div class="details-panel hero-panel">
          ${buildStoreHero(store, manager, installer, electrician, isExpanded)}
        </div>
      </td>
    `;
    projectTableBody.append(heroRow);

    if (isExpanded) {
      const detailRow = document.createElement("tr");
      detailRow.className = "details-row";
      detailRow.innerHTML = `
        <td colspan="9">
          <div class="details-panel">
            <form class="store-editor" data-store-editor="${store.id}">
              ${buildStoreHeaderCards()}

              ${buildDestinyWorkflowCards(store)}

              ${buildBricoRequestCard(store)}

              ${buildExternalPreparationCard(store)}

              ${buildStorePilotSkeleton(store)}

              ${buildNetworkConfigSkeleton(store)}

              ${buildStorePostsSkeleton(store)}

              ${buildClosureWorkflowCard(store)}

              <div class="editor-grid">
                <article class="editor-card full-span-card">
                  <h3>Ligne du temps</h3>
                  <p>Chronologie des rendez-vous programmes pour ce magasin.</p>
                  ${buildTimeline(store)}
                </article>
              </div>

              <div class="editor-grid">
                ${buildAppointmentsEditor(store)}
              </div>

              <div class="editor-grid">
                <article class="editor-card" data-access-zone="status_admin">
                  <h3>Statut global</h3>
                  <div class="two-col">
                    <label>
                      <span>Statut</span>
                      <select name="global_status">${renderOptions(globalStatusOptions, store.status)}</select>
                    </label>
                    <label>
                      <span>Responsable magasin</span>
                      <input type="text" name="manager" value="${escapeHtml(store.manager || "")}">
                    </label>
                  </div>
                </article>
                <article class="editor-card" data-access-zone="problem_notes">
                  <h3>Probleme / notes</h3>
                  <label>
                    <span>Obligatoire si statut bloque</span>
                    <textarea name="health" rows="4" placeholder="Decris le probleme a traiter">${escapeHtml(store.health || "")}</textarea>
                  </label>
                </article>
              </div>

              <div class="editor-actions">
                <span class="validation-text" data-validation="${store.id}"></span>
                <button type="submit" data-store-submit>Enregistrer ce magasin</button>
              </div>
            </form>
          </div>
        </td>
      `;
      projectTableBody.append(detailRow);
    }
  });

  projectTableBody.querySelectorAll("[data-store-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const storeId = Number(button.getAttribute("data-store-toggle"));
      if (state.expandedStoreIds.has(storeId)) {
        state.expandedStoreIds.delete(storeId);
      } else {
        state.expandedStoreIds.add(storeId);
      }
      renderStores();
    });
  });

  projectTableBody.querySelectorAll("[data-remove-appointment]").forEach((button) => {
    button.addEventListener("click", handleRemoveAppointment);
  });

  projectTableBody.querySelectorAll("[data-store-editor]").forEach((form) => {
    form.addEventListener("submit", handleStoreEditorSubmit);
  });
}

function renderActivities() {
  activityList.innerHTML = "";
  reportArchiveList.innerHTML = "";
  const now = new Date();
  const items = [...state.activities]
    .filter((activity) => isSameLocalDay(new Date(activity.createdAt), now))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (!items.length) {
    activityList.innerHTML = '<div class="empty-state">Aucune remontee aujourd hui.</div>';
  } else {
    items.forEach((activity) => {
      const card = document.createElement("article");
      card.className = "activity-card";
      card.innerHTML = `
        <h3>${escapeHtml(activity.storeName)}</h3>
        <p>${escapeHtml(activity.comment)}</p>
        <div class="activity-meta">
          <span class="${badgeClass(activity.result)}">${activity.result === "issue" ? "Probleme" : "OK"}</span>
          <span>${escapeHtml(activity.confirmedBy)} - ${formatDateTime(activity.createdAt)}</span>
        </div>
      `;
      activityList.append(card);
    });
  }

  const groupedByStore = state.stores.map((store) => ({
    storeName: store.name,
    entries: state.activities
      .filter((activity) => activity.storeName === store.name)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })).filter((group) => group.entries.length);

  if (!groupedByStore.length) {
    reportArchiveList.innerHTML = '<div class="empty-state">Aucun rapport magasin disponible pour le moment.</div>';
    return;
  }

  groupedByStore.forEach((group) => {
    const details = document.createElement("details");
    details.className = "report-store";
    details.innerHTML = `
      <summary>
        <span>${escapeHtml(group.storeName)}</span>
        <span>${group.entries.length} remontee(s)</span>
      </summary>
      <div class="report-store-body">
        ${group.entries.map((entry) => `
          <article class="report-entry">
            <div class="report-entry-meta">
              <span class="${badgeClass(entry.result)}">${entry.result === "issue" ? "Probleme" : "OK"}</span>
              <span>${escapeHtml(formatDateTime(entry.createdAt))}</span>
            </div>
            <strong>${escapeHtml(entry.confirmedBy)}</strong>
            <p>${escapeHtml(entry.comment)}</p>
          </article>
        `).join("")}
      </div>
    `;
    reportArchiveList.append(details);
  });
}

function renderPeopleList() {
  peopleList.innerHTML = "";

  const visiblePeople = state.people.filter((person) => {
    if (!state.contactSearch) {
      return true;
    }
    return person.name.toLowerCase().includes(state.contactSearch);
  });

  if (!visiblePeople.length) {
    peopleList.innerHTML = '<div class="empty-state">Aucun contact trouve.</div>';
    return;
  }

  visiblePeople.forEach((person) => {
    const item = document.createElement("div");
    item.className = "simple-item";
    item.innerHTML = `
      <form class="person-editor" data-person-id="${escapeHtml(person.id)}">
        <div class="person-row">
          <label>
            <span>Nom</span>
            <input type="text" name="name" value="${escapeHtml(person.name)}">
          </label>
          <label>
            <span>Role</span>
            <select name="role">${renderRoleOptions(person.role)}</select>
          </label>
          <label>
            <span>Telephone</span>
            <input type="text" name="phone" value="${escapeHtml(person.phone || "")}">
          </label>
          <label>
            <span>Mail</span>
            <input type="email" name="email" value="${escapeHtml(person.email || "")}">
          </label>
          <label>
            <span>Langue</span>
            <select name="language">
              <option value="fr" ${person.language === "fr" ? "selected" : ""}>FR</option>
              <option value="nl" ${person.language === "nl" ? "selected" : ""}>NL</option>
            </select>
          </label>
          <label>
            <span>Code magasin lie</span>
            <input type="text" name="storeCode" value="${escapeHtml(person.storeCode || "")}" placeholder="Ex: BRI-001">
          </label>
          <div class="person-row-actions">
            <button type="submit" class="mini-button">Enregistrer</button>
            <button type="button" class="mini-button" data-person-remove="${escapeHtml(person.id)}">Supprimer</button>
          </div>
        </div>
      </form>
    `;
    peopleList.append(item);
  });

  peopleList.querySelectorAll(".person-editor").forEach((form) => {
    form.addEventListener("submit", handlePersonEditSubmit);
  });

  peopleList.querySelectorAll("[data-person-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      const personId = button.getAttribute("data-person-remove");
      const target = state.people.find((person) => person.id === personId);
      if (!target) {
        return;
      }

      const remainingTwem = state.people.filter((person) => person.role === "twem");
      if (target.role === "twem" && remainingTwem.length <= 1) {
        return;
      }

      state.people = state.people.filter((person) => person.id !== personId);
      state.stores.forEach((store) => {
        if (store.owner === target.name) {
          store.owner = twemOptions[0];
        }
        if (store.manager === target.name) {
          store.manager = "";
        }
        store.appointments.forEach((appointment) => {
          appointment.people = appointment.people.filter((name) => name !== target.name);
        });
      });

      if (state.activeUserName === target.name) {
        state.activeUserName = state.people[0]?.name || "";
      }

      if (isSupabaseMode) {
        await deletePersonFromRemote(personId);
        await loadRemoteState();
      }
      saveState();
      render();
    });
  });
}

function renderRoleList() {
  roleList.innerHTML = "";

  state.roleOptions.forEach((role) => {
    const isLocked = defaultRoleOptions.includes(role);
    const row = document.createElement("div");
    row.className = `simple-item role-row${isLocked ? " locked-role" : ""}`;
    row.innerHTML = isLocked
      ? `
        <div>
          <div class="role-name">${escapeHtml(roleLabel(role))}</div>
          <div class="role-note">Role systeme</div>
        </div>
      `
      : `
        <form class="role-editor" data-role-value="${escapeHtml(role)}">
          <div class="role-row">
            <label>
              <span>Role</span>
              <input type="text" name="role" value="${escapeHtml(role)}">
            </label>
            <div class="person-row-actions">
              <button type="submit" class="mini-button">Enregistrer</button>
              <button type="button" class="mini-button" data-role-remove="${escapeHtml(role)}">Supprimer</button>
            </div>
          </div>
        </form>
      `;
    roleList.append(row);
  });

  roleList.querySelectorAll(".role-editor").forEach((form) => {
    form.addEventListener("submit", handleRoleEditSubmit);
  });

  roleList.querySelectorAll("[data-role-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      const role = button.getAttribute("data-role-remove");
      if (!role) {
        return;
      }
      if (state.people.some((person) => person.role === role)) {
        window.alert("Ce role est encore utilise dans des contacts.");
        return;
      }
      state.roleOptions = state.roleOptions.filter((entry) => entry !== role);
      if (isSupabaseMode) {
        await syncRoleOptionsToRemote();
        await loadRemoteState();
      }
      saveState();
      render();
    });
  });
}

function renderConnectionStatus() {
  modeBadge.textContent = isSupabaseMode ? "Supabase" : isAppwriteMode ? "Appwrite" : t("demoMode");
  connectionBadge.textContent = isSupabaseMode
    ? (supabaseClient ? "Connecte" : "Configuration requise")
    : isAppwriteMode
      ? (state.connectionState === "fallback"
          ? "Lecture locale"
          : state.connectionState === "ready"
            ? "Pret a se connecter"
          : appwriteAccount
            ? "Auth configuree"
            : "Configuration requise")
      : t("local");
  syncMessage.textContent = isTwemUser()
    ? "Suivi partage en direct entre planning chantier, rendez-vous, remontees et rapports."
    : "Vue limitee au magasin lie a cet utilisateur.";
}

function renderAuthState() {
  const user = currentUser();
  authState.textContent = user
    ? `${t("authState")}: ${user.name} (${user.role})`
    : "Aucun utilisateur actif.";

  const canAuth = isSupabaseMode || isAppwriteMode;
  emailInput.disabled = !canAuth;
  authForm.querySelector("button").disabled = !canAuth;
  logoutButton.disabled = !canAuth;

  const visibleForTwem = isTwemUser();
  workspaceSidebar.classList.toggle("hidden-panel", !visibleForTwem);
  workspaceShell?.classList.toggle("without-sidebar", !visibleForTwem);
  if (!visibleForTwem) {
    state.activeAdminTab = "planning";
  }
  twemWorkspace.classList.toggle("hidden-panel", !visibleForTwem || state.activeAdminTab === "planning");
}

function renderAdminTabs() {
  adminTabs.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-admin-tab") === state.activeAdminTab);
  });

  document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.getAttribute("data-admin-panel") === state.activeAdminTab);
  });

  document.querySelectorAll(".workspace-view").forEach((panel) => {
    panel.classList.toggle("is-active", panel.getAttribute("data-admin-panel") === state.activeAdminTab);
  });
}

function renderToolList() {
  toolList.innerHTML = "";

  if (!state.toolItems.length) {
    toolList.innerHTML = '<div class="empty-state">Aucune note pour le moment.</div>';
    return;
  }

  state.toolItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "simple-item";
    row.innerHTML = `
      <label>
        <input type="checkbox" data-tool-toggle="${item.id}" ${item.done ? "checked" : ""}>
        <span>${escapeHtml(item.text)}</span>
      </label>
    `;
    toolList.append(row);
  });

  toolList.querySelectorAll("[data-tool-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.getAttribute("data-tool-toggle");
      const item = state.toolItems.find((entry) => entry.id === id);
      if (!item) {
        return;
      }
      item.done = checkbox.checked;
      saveState();
    });
  });
}

function zoneLabel(value) {
  const labels = {
    appointments: "Rendez-vous",
    project_prep: "Preparation projet",
    order_articles: "Commande articles",
    configuration_request: "Configuration magasin",
    destiny_coordination: "Coordination Destiny",
    external_prep: "Preparation externe / IT",
    network_config: "Configuration reseau",
    store_posts: "Postes magasin",
    destiny_closure: "Cloture installation Destiny",
    brico_feedback: "Retour Brico / bascule",
    problem_notes: "Probleme / notes",
    status_admin: "Statut global"
  };
  return labels[value] || value;
}

function renderVisibilityOverrides() {
  if (!overrideStoreSelect || !overridePersonSelect || !visibilityOverrideList) {
    return;
  }

  overrideStoreSelect.innerHTML = state.stores
    .map((store) => `<option value="${escapeHtml(store.id)}">${escapeHtml(store.name)}</option>`)
    .join("");

  overridePersonSelect.innerHTML = state.people
    .map((person) => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name)} - ${escapeHtml(roleLabel(person.role))}</option>`)
    .join("");

  visibilityOverrideList.innerHTML = "";

  if (!state.accessOverrides.length) {
    visibilityOverrideList.innerHTML = '<div class="empty-state">Aucune derogation chantier pour le moment.</div>';
    return;
  }

  state.accessOverrides.forEach((override) => {
    const store = state.stores.find((item) => String(item.id) === String(override.storeId));
    const person = state.people.find((item) => item.id === override.personId);
    const row = document.createElement("div");
    row.className = "simple-item override-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(store?.name || "Magasin inconnu")}</strong>
        <div class="override-meta">${escapeHtml(person?.name || "Intervenant inconnu")}</div>
      </div>
      <div>
        <strong>${escapeHtml(zoneLabel(override.zone))}</strong>
        <div class="override-meta">Zone</div>
      </div>
      <div>
        <strong>${override.level === "edit" ? "Modifier" : "Voir"}</strong>
        <div class="override-meta">Droit</div>
      </div>
      <div>
        <strong>${escapeHtml(override.startDate || "-")} → ${escapeHtml(override.endDate || "-")}</strong>
        <div class="override-meta">Periode</div>
      </div>
      <div>
        <strong>${escapeHtml(override.reason || "-")}</strong>
        <div class="override-meta">Raison</div>
      </div>
      <div class="person-row-actions">
        <button type="button" class="mini-button" data-override-remove="${escapeHtml(override.id)}">Supprimer</button>
      </div>
    `;
    visibilityOverrideList.append(row);
  });

  visibilityOverrideList.querySelectorAll("[data-override-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-override-remove");
      state.accessOverrides = state.accessOverrides.filter((entry) => entry.id !== id);
      saveState();
      renderVisibilityOverrides();
    });
  });
}

function applyReadOnlyRules() {
  projectTableBody.querySelectorAll("[data-store-editor]").forEach((form) => {
    const storeId = Number(form.getAttribute("data-store-editor"));
    const store = state.stores.find((item) => item.id === storeId);
    if (!store) {
      return;
    }

    let hasEditableZone = false;
    form.querySelectorAll("[data-access-zone]").forEach((section) => {
      const zone = section.getAttribute("data-access-zone");
      let editable = canEditZone(store, zone);
      if (zone === "network_config" && isNetworkConfigLockedForUser(store)) {
        editable = false;
      }
      if (editable) {
        hasEditableZone = true;
      }
      section.classList.toggle("readonly-zone", !editable);
      section.querySelectorAll("input, select, textarea, button").forEach((field) => {
        if (field.type === "hidden") {
          return;
        }
        if (field.tagName === "BUTTON") {
          field.disabled = !editable;
        } else {
          field.disabled = !editable;
          field.readOnly = !editable && (field.tagName === "INPUT" || field.tagName === "TEXTAREA");
        }
      });
    });

    const submitButton = form.querySelector("[data-store-submit]");
    if (submitButton) {
      submitButton.disabled = !hasEditableZone;
      submitButton.textContent = hasEditableZone ? "Enregistrer ce magasin" : "Lecture seule";
    }
  });
}

function handleNetworkConfirm(event) {
  const button = event.target.closest("[data-network-confirm]");
  if (!button) {
    return;
  }
  const form = button.closest("[data-store-editor]");
  if (!form) {
    return;
  }
  const storeId = Number(form.getAttribute("data-store-editor"));
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }
  const workflow = ensureStoreWorkflowData(store);
  workflow.networkConfigConfirmed = true;
  const hiddenField = form.querySelector('[name="network_config_confirmed"]');
  if (hiddenField) {
    hiddenField.value = "1";
  }
  saveState();
  render();
}

async function loadRemoteState() {
  if (!supabaseClient) {
    return;
  }

  const [
    storesResult,
    stepsResult,
    appointmentsResult,
    activitiesResult,
    contactsResult,
    rolesResult
  ] = await Promise.all([
    supabaseClient.from("stores").select("*").order("code"),
    supabaseClient.from("store_steps").select("*"),
    supabaseClient.from("appointments").select("*").order("scheduled_at"),
    supabaseClient.from("confirmations").select("*").order("created_at", { ascending: false }),
    supabaseClient.from("contacts").select("*").order("name"),
    supabaseClient.from("roles").select("*").order("name")
  ]);

  if (storesResult.error) throw storesResult.error;
  if (stepsResult.error) throw stepsResult.error;
  if (appointmentsResult.error) throw appointmentsResult.error;
  if (activitiesResult.error) throw activitiesResult.error;
  if (contactsResult.error) throw contactsResult.error;
  if (rolesResult.error) throw rolesResult.error;

  const stepsByStore = new Map();
  stepsResult.data.forEach((step) => {
    const list = stepsByStore.get(step.store_id) || [];
    list.push(step);
    stepsByStore.set(step.store_id, list);
  });

  const appointmentsByStore = new Map();
  appointmentsResult.data.forEach((appointment) => {
    const list = appointmentsByStore.get(appointment.store_id) || [];
    list.push(appointment);
    appointmentsByStore.set(appointment.store_id, list);
  });

  state.stores = storesResult.data.map((storeRow) => mapStoreRowToState(
    storeRow,
    stepsByStore.get(storeRow.id) || [],
    appointmentsByStore.get(storeRow.id) || []
  ));

  state.activities = activitiesResult.data.map((activity) => ({
    id: String(activity.id),
    storeName: activity.store_name,
    result: activity.result,
    comment: activity.comment || "",
    confirmedBy: activity.confirmed_by || "",
    createdAt: activity.created_at
  }));

  state.people = contactsResult.data.map(normalizeRemotePerson);
  state.roleOptions = [
    ...new Set([...defaultRoleOptions, ...rolesResult.data.map((role) => role.name)])
  ];

  const { data: authData } = await supabaseClient.auth.getSession();
  const sessionPerson = roleValueFromSession(authData.session);
  if (sessionPerson) {
    state.activeUserName = sessionPerson.name;
  } else if (!state.people.some((person) => person.name === state.activeUserName)) {
    state.activeUserName = state.people.find((person) => person.role === "twem")?.name || state.people[0]?.name || "";
  }

  saveState();
}

async function syncStoreToRemote(store, activityComment) {
  if (!supabaseClient) {
    return;
  }

  const storePayload = {
    code: store.code,
    name: store.name,
    city: store.city,
    owner_name: store.owner,
    manager_name: store.manager,
    status: store.status,
    health: store.health,
    last_update_at: store.updatedAt,
    updated_at: store.updatedAt
  };

  const { data: upsertedStore, error: storeError } = await supabaseClient
    .from("stores")
    .upsert(storePayload, { onConflict: "code" })
    .select()
    .single();

  if (storeError) throw storeError;

  const stepPayload = store.steps.map((step) => ({
    store_id: upsertedStore.id,
    actor_type: step.actorType,
    label: step.label,
    status: step.status === "blocked" ? "issue" : step.status,
    note: step.note
  }));

  const { error: stepError } = await supabaseClient
    .from("store_steps")
    .upsert(stepPayload, { onConflict: "store_id,actor_type" });

  if (stepError) throw stepError;

  const { error: deleteAppointmentError } = await supabaseClient
    .from("appointments")
    .delete()
    .eq("store_id", upsertedStore.id);

  if (deleteAppointmentError) throw deleteAppointmentError;

  if (store.appointments.length) {
    const appointmentPayload = store.appointments.map((appointment) => ({
      store_id: upsertedStore.id,
      scheduled_at: appointment.datetime,
      status: appointment.status,
      people: JSON.stringify(appointment.people || []),
      note: appointment.note || ""
    }));

    const { error: appointmentError } = await supabaseClient
      .from("appointments")
      .insert(appointmentPayload);

    if (appointmentError) throw appointmentError;
  }

  if (activityComment) {
    const { error: confirmationError } = await supabaseClient
      .from("confirmations")
      .insert({
        store_id: upsertedStore.id,
        store_name: store.name,
        actor_type: "store_manager",
        result: store.status === "blocked" ? "issue" : "ok",
        comment: activityComment,
        confirmed_by: state.activeUserName
      });

    if (confirmationError) throw confirmationError;
  }
}

async function syncPersonToRemote(person) {
  if (!supabaseClient) {
    return;
  }

  const payload = {
    id: Number.isNaN(Number(person.id)) ? undefined : Number(person.id),
    name: person.name,
    role: person.role,
    phone: person.phone,
    email: person.email,
    store_code: person.storeCode,
    language: person.language
  };

  const { error } = await supabaseClient.from("contacts").upsert(payload);
  if (error) throw error;
}

async function deletePersonFromRemote(personId) {
  if (!supabaseClient) {
    return;
  }
  const numericId = Number(personId);
  if (Number.isNaN(numericId)) {
    return;
  }
  const { error } = await supabaseClient.from("contacts").delete().eq("id", numericId);
  if (error) throw error;
}

async function syncRoleOptionsToRemote() {
  if (!supabaseClient) {
    return;
  }

  const customRoles = state.roleOptions.filter((role) => !defaultRoleOptions.includes(role));
  const { error: deleteError } = await supabaseClient
    .from("roles")
    .delete()
    .eq("built_in", false);
  if (deleteError) throw deleteError;

  if (customRoles.length) {
    const { error: insertError } = await supabaseClient
      .from("roles")
      .insert(customRoles.map((role) => ({ name: role, built_in: false })));
    if (insertError) throw insertError;
  }
}

async function sendMagicLink(email) {
  if (isAppwriteMode) {
    if (!appwriteAccount || !appwriteIdFactory) {
      window.alert("Configure Appwrite pour envoyer un lien magique.");
      return;
    }

    const redirectTo = window.location.href.split("?")[0];
    await appwriteAccount.createMagicURLToken(
      appwriteIdFactory.unique(),
      email,
      redirectTo
    );
    return;
  }

  if (!supabaseClient) {
    window.alert("Configure Supabase pour envoyer un lien magique.");
    return;
  }

  const redirectTo = window.location.href;
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo }
  });
  if (error) throw error;
}

async function completeAppwriteMagicSession() {
  if (!appwriteAccount) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const secret = params.get("secret");
  if (!userId || !secret) {
    return;
  }

  await appwriteAccount.createSession(userId, secret);
  params.delete("userId");
  params.delete("secret");
  const cleaned = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, document.title, cleaned);
}

async function loadAppwriteSessionUser() {
  if (!appwriteAccount) {
    return;
  }

  try {
    const accountUser = await appwriteAccount.get();
    const matchedPerson = state.people.find((person) =>
      person.email && accountUser.email && person.email.toLowerCase() === accountUser.email.toLowerCase()
    ) || state.people.find((person) => person.name === accountUser.name);

    if (matchedPerson) {
      state.activeUserName = matchedPerson.name;
    }
    state.connectionState = "connected";
  } catch (error) {
    const code = Number(error?.code || error?.response?.code || 0);
    if (code === 401) {
      state.connectionState = "ready";
      return;
    }
    throw error;
  }
}

async function setupRealtime() {
  if (!supabaseClient || realtimeChannel) {
    return;
  }

  realtimeChannel = supabaseClient
    .channel("twem-brico-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "stores" }, async () => {
      await loadRemoteState();
      render();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "store_steps" }, async () => {
      await loadRemoteState();
      render();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, async () => {
      await loadRemoteState();
      render();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "confirmations" }, async () => {
      await loadRemoteState();
      render();
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, async () => {
      await loadRemoteState();
      render();
    })
    .subscribe();
}

function render() {
  applyStaticTranslations();
  renderConnectionStatus();
  syncSelectors();
  renderAuthState();
  renderAdminTabs();
  renderSummary();
  renderStores();
  renderActivities();
  renderPeopleList();
  renderRoleList();
  renderToolList();
  renderVisibilityOverrides();
  applyReadOnlyRules();
}

function importJsonData(payload) {
  if (Array.isArray(payload.stores)) {
    state.stores = payload.stores;
  }
  if (Array.isArray(payload.activities)) {
    state.activities = payload.activities;
  }
  if (Array.isArray(payload.people)) {
    state.people = payload.people.map((person) => ({
      language: "fr",
      storeCode: "",
      ...person
    }));
  }
  if (Array.isArray(payload.accessOverrides)) {
    state.accessOverrides = payload.accessOverrides;
  }
  if (Array.isArray(payload.roleOptions)) {
    state.roleOptions = payload.roleOptions;
  }
  if (typeof payload.activeUserName === "string" && payload.activeUserName) {
    state.activeUserName = payload.activeUserName;
  }
  saveState();
  render();
}

function handleImportButtonClick() {
  importInput.click();
}

function handleImportInputChange(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        const payload = JSON.parse(String(reader.result));
        importJsonData(payload);
        window.alert(t("importDone"));
      } else {
        window.alert(t("csvPending"));
      }
    } catch (error) {
      window.alert(`${t("importError")}: ${error.message}`);
    } finally {
      importInput.value = "";
    }
  };
  reader.readAsText(file);
}

function buildReportHtml() {
  const stores = getFilteredStores();
  const generatedAt = new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>${t("reportTitle")}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
        h1, h2 { margin: 0 0 12px; }
        .meta { margin-bottom: 20px; color: #666; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .card { border: 1px solid #ddd; padding: 12px; border-radius: 10px; background: #fafafa; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #fff3ae; }
        .section { margin-top: 24px; }
      </style>
    </head>
    <body>
      <h1>${t("reportTitle")}</h1>
      <div class="meta">${t("generatedOn")} ${generatedAt} - ${t("activeUser")}: ${escapeHtml(state.activeUserName)}</div>
      <div class="summary">
        <div class="card"><strong>${t("summaryStores")}</strong><div>${stores.length}</div></div>
        <div class="card"><strong>${t("summaryDone")}</strong><div>${stores.filter((store) => store.status === "done").length}</div></div>
        <div class="card"><strong>${t("summaryBlocked")}</strong><div>${stores.filter((store) => store.status === "blocked").length}</div></div>
        <div class="card"><strong>${t("summaryNoAppointment")}</strong><div>${stores.filter((store) => store.appointments.length === 0).length}</div></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>${t("store")}</th>
            <th>${t("twem")}</th>
            <th>${t("status")}</th>
            <th>${t("progressDone")}</th>
            <th>${t("lastAppointment")}</th>
            <th>${t("problem")}</th>
          </tr>
        </thead>
        <tbody>
          ${stores.map((store) => {
            const appointments = sortedAppointments(store);
            const lastAppointment = appointments.at(-1);
            return `
              <tr>
                <td>${escapeHtml(store.name)}<br>${escapeHtml(store.city)} - ${escapeHtml(store.code)}</td>
                <td>${escapeHtml(store.owner)}</td>
                <td>${escapeHtml(statusLabel(store.status) || store.status)}</td>
                <td>${computeProgress(store)}% ${t("progressDone")}</td>
                <td>${lastAppointment ? `${escapeHtml(formatDateTime(lastAppointment.datetime))}<br>${escapeHtml(lastAppointment.status)} - ${escapeHtml(peopleLabel(lastAppointment.people))}` : "-"}</td>
                <td>${escapeHtml(store.health || "-")}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
      <div class="section">
        <h2>${t("recentActivity")}</h2>
        <ul>
          ${state.activities.slice(0, 10).map((activity) => `<li>${escapeHtml(activity.storeName)} - ${escapeHtml(activity.comment)} - ${escapeHtml(formatDateTime(activity.createdAt))}</li>`).join("")}
        </ul>
      </div>
    </body>
    </html>
  `;
}

function handleReportButtonClick() {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    window.alert(t("reportWindowError"));
    return;
  }

  reportWindow.document.open();
  reportWindow.document.write(buildReportHtml());
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

async function handleRemoveAppointment(event) {
  const storeId = Number(event.currentTarget.getAttribute("data-remove-appointment"));
  const index = Number(event.currentTarget.getAttribute("data-index"));
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }

  store.appointments.splice(index, 1);
  store.updatedAt = new Date().toISOString();
  if (isSupabaseMode) {
    await syncStoreToRemote(store);
    await loadRemoteState();
  }
  saveState();
  render();
}

function readAppointments(form, store) {
  const currentAppointments = store.appointments.map((appointment, index) => ({
    ...appointment,
    datetime: form.querySelector(`[name="appointment_datetime_${index}"]`).value,
    status: form.querySelector(`[name="appointment_status_${index}"]`).value,
    people: [...form.querySelector(`[name="appointment_people_${index}"]`).selectedOptions].map((option) => option.value)
  })).filter((appointment) => appointment.datetime);

  const newDatetime = form.querySelector('[name="new_appointment_datetime"]').value;
  const newPeople = [...form.querySelector('[name="new_appointment_people"]').selectedOptions].map((option) => option.value);
  const newStatus = form.querySelector('[name="new_appointment_status"]').value;
  const newNote = form.querySelector('[name="new_appointment_note"]').value.trim();

  if (newDatetime) {
    currentAppointments.push({
      id: `appt-${Date.now()}`,
      datetime: newDatetime,
      status: newStatus,
      people: newPeople,
      note: newNote
    });
  }

  return currentAppointments;
}

async function handleStoreEditorSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const storeId = Number(form.getAttribute("data-store-editor"));
  const validationNode = form.querySelector(`[data-validation="${storeId}"]`);
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }

  const globalStatus = form.querySelector('[name="global_status"]').value;
  const health = form.querySelector('[name="health"]').value.trim();

  if (globalStatus === "blocked" && !health) {
    validationNode.textContent = "Le champ probleme est obligatoire si le statut est bloque.";
    return;
  }

  validationNode.textContent = "";
  const workflow = ensureStoreWorkflowData(store);
  store.owner = form.querySelector('[name="owner"]').value;
  store.manager = form.querySelector('[name="manager"]').value.trim();
  store.status = globalStatus;
  store.health = health;
  store.updatedAt = new Date().toISOString();

  stepFor(store, "store_manager").status = form.querySelector('[name="store_manager_status"]').value;
  stepFor(store, "installer").status = form.querySelector('[name="installer_status"]').value;
  stepFor(store, "electrician").status = form.querySelector('[name="electrician_status"]').value;
  stepFor(store, "store_manager").note = form.querySelector('[name="store_manager_note"]').value.trim();
  stepFor(store, "installer").note = form.querySelector('[name="installer_note"]').value.trim();
  stepFor(store, "electrician").note = form.querySelector('[name="electrician_note"]').value.trim();
  store.appointments = readAppointments(form, store);

  workflow.destinyInstallDate = form.querySelector('[name="destiny_install_date"]').value;
  workflow.destinyPmName = form.querySelector('[name="destiny_pm_name"]').value.trim();
  workflow.destinyPmEmail = form.querySelector('[name="destiny_pm_email"]').value.trim();
  workflow.destinyTicketRef = form.querySelector('[name="destiny_ticket_ref"]').value.trim();
  workflow.destinyCaseRef = form.querySelector('[name="destiny_case_ref"]').value.trim();
  workflow.destinyDistribution = form.querySelector('[name="destiny_distribution"]').value.trim();
  workflow.networkSurveyStatus = form.querySelector('[name="network_survey_status"]').value;
  workflow.mobileCoverage = form.querySelector('[name="mobile_coverage"]').value;
  workflow.firstVisitRemark = form.querySelector('[name="first_visit_remark"]').value.trim();
  workflow.extensionRequestStatus = form.querySelector('[name="extension_request_status"]').value;
  workflow.extensionConfigStatus = form.querySelector('[name="extension_config_status"]').value;
  workflow.ivrNotes = form.querySelector('[name="ivr_notes"]').value.trim();
  workflow.greetingNotes = form.querySelector('[name="greeting_notes"]').value.trim();
  workflow.alarmHandledByIt = form.querySelector('[name="alarm_handled_by_it"]').value;
  workflow.vlan22Status = form.querySelector('[name="vlan22_status"]').value;
  workflow.vlan22Activated = form.querySelector('[name="vlan22_activated"]').value;
  workflow.charlesRouxStatus = form.querySelector('[name="charles_roux_status"]').value;
  workflow.cablingStatus = form.querySelector('[name="cabling_status"]').value;
  workflow.mobileChargersSent = form.querySelector('[name="mobile_chargers_sent"]').value;
  workflow.mobileChargerCount = form.querySelector('[name="mobile_charger_count"]').value;
  workflow.destinyInstallDone = form.querySelector('[name="destiny_install_done"]').value;
  workflow.destinyInstallRemark = form.querySelector('[name="destiny_install_remark"]').value.trim();
  workflow.bricoFinalMailStatus = form.querySelector('[name="brico_final_mail_status"]').value;
  workflow.bricoFinalRemark = form.querySelector('[name="brico_final_remark"]').value.trim();
  workflow.ltSwitchStatus = form.querySelector('[name="lt_switch_status"]').value;
  workflow.networkConfigConfirmed = form.querySelector('[name="network_config_confirmed"]')?.value === "1";

  state.activities.unshift({
    id: `edit-${Date.now()}`,
    storeName: store.name,
    result: store.status === "blocked" ? "issue" : "ok",
    comment: `Mise a jour magasin - statut ${statusLabel(store.status)}`,
    confirmedBy: state.activeUserName,
    createdAt: new Date().toISOString()
  });

  if (isSupabaseMode) {
    await syncStoreToRemote(store, `Mise a jour magasin - statut ${statusLabel(store.status)}`);
    await loadRemoteState();
  }
  saveState();
  state.expandedStoreIds.delete(storeId);
  render();
}

async function handlePersonEditSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const personId = form.getAttribute("data-person-id");
  const person = state.people.find((item) => item.id === personId);
  if (!person) {
    return;
  }

  const oldName = person.name;
  person.name = form.querySelector('[name="name"]').value.trim() || person.name;
  person.role = form.querySelector('[name="role"]').value;
  person.phone = form.querySelector('[name="phone"]').value.trim();
  person.email = form.querySelector('[name="email"]').value.trim();
  person.language = form.querySelector('[name="language"]').value;
  person.storeCode = form.querySelector('[name="storeCode"]').value.trim().toUpperCase();

  state.stores.forEach((store) => {
    if (store.owner === oldName) {
      store.owner = person.name;
    }
    if (store.manager === oldName) {
      store.manager = person.name;
    }
    store.appointments.forEach((appointment) => {
      appointment.people = appointment.people.map((name) => name === oldName ? person.name : name);
    });
  });

  if (state.activeUserName === oldName) {
    state.activeUserName = person.name;
  }

  if (isSupabaseMode) {
    await syncPersonToRemote(person);
    await loadRemoteState();
  }
  saveState();
  render();
}

async function handleRoleSubmit(event) {
  event.preventDefault();
  const role = roleInput.value.trim().toLowerCase();
  if (!role || state.roleOptions.includes(role)) {
    return;
  }

  state.roleOptions.push(role);
  roleInput.value = "";
  if (isSupabaseMode) {
    await syncRoleOptionsToRemote();
    await loadRemoteState();
  }
  saveState();
  render();
}

async function handleRoleEditSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const currentRole = form.getAttribute("data-role-value");
  const nextRole = form.querySelector('[name="role"]').value.trim().toLowerCase();
  if (!currentRole || !nextRole || currentRole === nextRole || state.roleOptions.includes(nextRole)) {
    return;
  }

  state.roleOptions = state.roleOptions.map((role) => role === currentRole ? nextRole : role);
  state.people.forEach((person) => {
    if (person.role === currentRole) {
      person.role = nextRole;
    }
  });
  if (isSupabaseMode) {
    for (const person of state.people.filter((entry) => entry.role === nextRole)) {
      await syncPersonToRemote(person);
    }
    await syncRoleOptionsToRemote();
    await loadRemoteState();
  }
  saveState();
  render();
}

function handleActiveUserChange(event) {
  state.activeUserName = event.target.value;
  saveState();
  render();
}

function handleLanguageChange(event) {
  state.language = event.target.value;
  document.documentElement.lang = state.language;
  saveState();
  render();
}

function handleAdminTabClick(event) {
  const button = event.target.closest("[data-admin-tab]");
  if (button) {
    state.activeAdminTab = button.getAttribute("data-admin-tab");
    saveState();
    render();
    return;
  }
}

function handleVisibilityOverrideSubmit(event) {
  event.preventDefault();
  const storeId = overrideStoreSelect?.value;
  const personId = overridePersonSelect?.value;
  const zone = overrideZoneSelect?.value;
  const level = overrideLevelSelect?.value;
  const startDate = overrideStartInput?.value || "";
  const endDate = overrideEndInput?.value || "";
  const reason = overrideReasonInput?.value.trim() || "";

  if (!storeId || !personId || !zone || !level) {
    return;
  }

  state.accessOverrides.unshift({
    id: `override-${Date.now()}`,
    storeId,
    personId,
    zone,
    level,
    startDate,
    endDate,
    reason
  });

  if (overrideReasonInput) overrideReasonInput.value = "";
  if (overrideStartInput) overrideStartInput.value = "";
  if (overrideEndInput) overrideEndInput.value = "";
  saveState();
  renderVisibilityOverrides();
}

function applyStaticTranslations() {
  const set = (id, value) => {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  };

  set("pageTitle", t("pageTitle"));
  set("pageIntro", t("pageIntro"));
  set("modeLabel", t("mode"));
  set("connectionLabel", t("connection"));
  set("searchLabel", t("search"));
  set("statusLabel", t("status"));
  set("ownerLabel", t("owner"));
  set("userViewLabel", t("userView"));
  set("languageLabel", t("language"));
  set("planningTitle", t("planning"));
  set("thDetail", t("detail"));
  set("thStore", t("store"));
  set("thTwem", t("twem"));
  set("thManager", t("store"));
  set("thPhone", t("telephony"));
  set("thElectrician", t("electrician"));
  set("thAppointment", t("appointment"));
  set("thStatus", t("status"));
  set("thIssue", t("problem"));
  set("accessTitle", t("access"));
  set("accessIntro", t("accessIntro"));
  set("emailLabel", t("userEmail"));
  set("magicLinkButton", t("magicLink"));
  set("logoutButton", t("logout"));
  set("recentUpdatesTitle", t("recentUpdates"));
  set("recentUpdatesIntro", t("recentUpdatesIntro"));
  set("storeReportsTitle", t("storeReports"));
  set("storeReportsIntro", t("storeReportsIntro"));
  set("adminTitle", t("admin"));
  set("adminIntro", t("adminIntro"));
  set("adminPlanningButton", t("planning"));
  set("personNameLabel", t("name"));
  set("personPhoneLabel", t("phone"));
  set("personEmailLabel", t("email"));
  set("personRoleLabel", t("role"));
  set("personLanguageLabel", t("language"));
  set("personStoreCodeLabel", t("linkedStore"));
  set("addPersonButton", t("addPerson"));
  set("peopleTitle", t("people"));
  set("contactListTitle", t("contactDirectory"));
  set("contactListIntro", t("contactDirectoryIntro"));
  set("peopleSearchLabel", t("contactSearch"));
  set("rolesTitle", t("rolesTitle"));
  set("rolesIntro", t("rolesIntro"));
  set("addRoleButton", t("addRole"));
  set("storeNameLabel", t("storeName"));
  set("storeCityLabel", t("city"));
  set("storeCodeLabel", t("code"));
  set("storeOwnerLabel", t("owner"));
  set("storeManagerLabel", t("storeContact"));
  set("addStoreButton", t("addStore"));
  set("importButton", t("importFile"));
  set("reportButton", t("printReport"));

  searchInput.placeholder = state.language === "nl" ? "Bv: Anderlecht" : "Ex: Anderlecht";
  emailInput.placeholder = state.language === "nl" ? "naam@twem.be" : "nom@twem.be";
  peopleSearchInput.placeholder = state.language === "nl" ? "Bv: Dupont" : "Ex: Dupont";
  roleInput.placeholder = state.language === "nl" ? "Bv: regiomanager" : "Ex: responsable secteur";

  statusFilter.innerHTML = `
    <option value="all">${t("all")}</option>
    <option value="planned">${t("planned")}</option>
    <option value="in_progress">${t("in_progress")}</option>
    <option value="blocked">${t("blocked")}</option>
    <option value="done">${t("done")}</option>
  `;
  statusFilter.value = state.filters.status;
}

async function handlePersonSubmit(event) {
  event.preventDefault();
  const name = personNameInput.value.trim();
  const role = personRoleSelect.value;
  if (!name) {
    return;
  }

  state.people.push({
    id: `person-${Date.now()}`,
    name,
    role,
    phone: personPhoneInput.value.trim(),
    email: personEmailInput.value.trim(),
    storeCode: personStoreCodeInput.value.trim().toUpperCase(),
    language: personLanguageSelect.value
  });

  if (isSupabaseMode) {
    await syncPersonToRemote(state.people.at(-1));
    await loadRemoteState();
  }
  personForm.reset();
  personLanguageSelect.value = "fr";
  saveState();
  render();
}

async function handleStoreSubmit(event) {
  event.preventDefault();
  const name = storeNameInput.value.trim();
  const city = storeCityInput.value.trim();
  const code = storeCodeInput.value.trim().toUpperCase();
  const owner = storeOwnerSelect.value;
  const manager = storeManagerInput.value.trim();

  if (!name || !city || !code || !owner) {
    return;
  }

  state.stores.push({
    id: Date.now(),
    code,
    name,
    city,
    owner,
    manager,
    status: "planned",
    health: "",
    updatedAt: new Date().toISOString(),
    steps: [
      { actorType: "store_manager", label: "Magasin", status: "planned", note: "" },
      { actorType: "installer", label: "Telephonie", status: "planned", note: "" },
      { actorType: "electrician", label: "Electricien", status: "planned", note: "" }
    ],
    appointments: []
  });

  if (isSupabaseMode) {
    await syncStoreToRemote(state.stores.at(-1));
    await loadRemoteState();
  }
  storeForm.reset();
  saveState();
  render();
}

function handleToolSubmit(event) {
  event.preventDefault();
  const text = toolInput.value.trim();
  if (!text) {
    return;
  }

  state.toolItems.unshift({
    id: `tool-${Date.now()}`,
    text,
    done: false
  });

  toolForm.reset();
  saveState();
  renderToolList();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email) {
    return;
  }
  try {
    await sendMagicLink(email);
    window.alert("Lien de connexion envoye.");
    authForm.reset();
  } catch (error) {
    window.alert(`Envoi impossible: ${error.message}`);
  }
}

async function handleLogout() {
  if (isAppwriteMode && appwriteAccount) {
    await appwriteAccount.deleteSession("current");
  }
  if (isSupabaseMode && supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  state.activeUserName = state.people.find((person) => person.role === "twem")?.name || state.people[0]?.name || "";
  state.activeAdminTab = "planning";
  saveState();
  render();
}

searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value.trim().toLowerCase();
  renderStores();
});

statusFilter.addEventListener("change", (event) => {
  state.filters.status = event.target.value;
  renderStores();
});

ownerFilter.addEventListener("change", (event) => {
  state.filters.owner = event.target.value;
  renderStores();
});

authForm.addEventListener("submit", handleAuthSubmit);
logoutButton.addEventListener("click", handleLogout);
activeUserSelect.addEventListener("change", handleActiveUserChange);
languageSelect.addEventListener("change", handleLanguageChange);
personForm.addEventListener("submit", handlePersonSubmit);
storeForm.addEventListener("submit", handleStoreSubmit);
adminTabs.addEventListener("click", handleAdminTabClick);
peopleSearchInput.addEventListener("input", (event) => {
  state.contactSearch = event.target.value.trim().toLowerCase();
  saveState();
  renderPeopleList();
});
roleForm.addEventListener("submit", handleRoleSubmit);
toolForm.addEventListener("submit", handleToolSubmit);
visibilityOverrideForm?.addEventListener("submit", handleVisibilityOverrideSubmit);
projectTableBody.addEventListener("click", handleNetworkConfirm);
importButton.addEventListener("click", handleImportButtonClick);
importInput.addEventListener("change", handleImportInputChange);
reportButton.addEventListener("click", handleReportButtonClick);

async function init() {
  const stored = loadState();
  state.stores = stored.stores;
  state.activities = stored.activities;
  state.people = stored.people;
  state.activeUserName = stored.activeUserName;
  state.language = stored.language || "fr";
  state.activeAdminTab = stored.activeAdminTab || "planning";
  state.toolItems = stored.toolItems || [];
  state.accessOverrides = stored.accessOverrides || [];
  state.roleOptions = stored.roleOptions || [...defaultRoleOptions];
  state.contactSearch = stored.contactSearch || "";
  document.documentElement.lang = state.language;

  if (isSupabaseMode && supabaseClient) {
    try {
      await loadRemoteState();
      await setupRealtime();
      supabaseClient.auth.onAuthStateChange(async (_event, session) => {
        const sessionPerson = roleValueFromSession(session);
        if (sessionPerson) {
          state.activeUserName = sessionPerson.name;
        }
        await loadRemoteState();
        render();
      });
    } catch (error) {
      connectionBadge.textContent = "Erreur";
      console.error("Supabase init error", error);
      window.alert(`Connexion Supabase incomplete: ${error.message}`);
    }
  }

  if (isAppwriteMode && appwriteAccount) {
    try {
      await completeAppwriteMagicSession();
      await loadAppwriteSessionUser();
      state.connectionState = "connected";
    } catch (error) {
      state.connectionState = "fallback";
      console.error("Appwrite init error", error);
    }
  }

  render();
}

init();

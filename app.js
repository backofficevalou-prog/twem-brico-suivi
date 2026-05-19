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
const extensionReferenceOptions = [
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
const extensionCatalogRows = [
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "900", label: "Zaagmachine", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "901", label: "tuin", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "902", label: "verf", oldNumber: "", language: "fr_BE", item: "", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "903", label: "keukens", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "904", label: "tegels", oldNumber: "", language: "fr_BE", item: "F3008", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "905", label: "decoratie maatwerk", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "906", label: "hout  buitenschrijnwerk of vloeren", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "907", label: "", oldNumber: "", language: "fr_BE", item: "", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "908", label: "", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "909", label: "", oldNumber: "", language: "fr_BE", item: "F3008", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "910", label: "", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "911", label: "", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "912", label: "", oldNumber: "", language: "fr_BE", item: "", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "913", label: "", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "914", label: "", oldNumber: "", language: "fr_BE", item: "F3008", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "915", label: "", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "916", label: "", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Appel", model: "HELIOS IP Verso1 B PoE", number: "917", label: "", oldNumber: "", language: "fr_BE", item: "", activation: "" },
  { category: "Bouton Panique", model: "HELIOS IP Verso1 B PoE", number: "922", label: "FRONT END EVACUATION", oldNumber: "", language: "fr_BE", item: "F3009", activation: "" },
  { category: "Bouton Panique", model: "HELIOS IP Verso1 B PoE", number: "923", label: "SAFE ROOM", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Bouton Panique", model: "HELIOS IP Verso1 B PoE", number: "924", label: "DRIVE IN till zone", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Bouton Panique", model: "HELIOS IP Verso1 B PoE", number: "925", label: "SAFE ROOM DRIVE IN   Front end overval", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Fixed", model: "VVX250", number: "400", label: "Refter", oldNumber: "", language: "fr_BE", item: "D1121", activation: "" },
  { category: "Fixed", model: "VVX250", number: "444", label: "Urgence/Red phone", oldNumber: "", language: "fr_BE", item: "D1101", activation: "" },
  { category: "Fixed", model: "VVX411 ou 450 + MOD", number: "200", label: "Centrale", oldNumber: "", language: "fr_BE", item: "D1105", activation: "" },
  { category: "Fixed", model: "VVX250", number: "205", label: "Koffer", oldNumber: "", language: "fr_BE", item: "D1107", activation: "" },
  { category: "Flash light", model: "ALGO 8128 SIP FLASH", number: "931", label: "SAFE ROOM(Coffre/ koffer safe room)", oldNumber: "", language: "fr_BE", item: "F3008", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "201", label: "Onthaal winkel", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "202", label: "Kassaverantwoordelijke", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "210", label: "Zelfscan", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "211", label: "Kassa 2+3", oldNumber: "", language: "fr_BE", item: "D1109", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "213", label: "Kassa 4+5", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "220", label: "Kassa bouw", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "701", label: "Winkelassistente", oldNumber: "", language: "fr_BE", item: "D1101", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "700", label: "Directeur", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "705", label: "SVB", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "710", label: "CS1 / techniek", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "720", label: "CS2 / decoratie - verf - verlichting", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "730", label: "CS3 / deco san - rangement", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "740", label: "CS4 / tuin - bouw", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "750", label: "CS5 / hout -  tegels", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "610", label: "RR gereedschappen", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "217", label: "Till 7", oldNumber: "", language: "fr_BE", item: "D1114", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "611", label: "RR elect - loodgieterij", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "620", label: "RR verf", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "621", label: "RR decoratie", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "622", label: "", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "630", label: "RR decor san - rengement", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "640", label: "RR bouw", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "641", label: "RR tuin", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "650", label: "RR hout", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "651", label: "RR tegels", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "300", label: "Verf", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "305", label: "Decoratie", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "320", label: "Gereedschappen", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "330", label: "Elect / Loodgieterij", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "335", label: "Verlichting", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "340", label: "Decor san 1", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "350", label: "Tegels", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "355", label: "Decor san 2", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "380", label: "Tuin 1", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "385", label: "Tuin 2", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "500", label: "Goederenreceptie", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "520", label: "Bouw", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "535", label: "Hout 1", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "540", label: "Hout 2", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "570", label: "Klantendienst 1", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "575", label: "Klantendienst 2", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "810", label: "BALISAGE", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "325", label: "STORAGE DECOR(Rangemant Décor/opberging)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "212", label: "Till 2", oldNumber: "", language: "fr_BE", item: "D1110", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "214", label: "Till 4", oldNumber: "", language: "fr_BE", item: "D1112", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "310", label: "DECO 1", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "345", label: "SANITARY(Sanitaire/sanitair)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "360", label: "PLUMBING(Plomberie/loodgieterij)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "370", label: "TOOLS(Outillage/gereedschap)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "501", label: "MERCHANDISE RECEPTION 2 (Réception 2)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Fixed", model: "VVX250", number: "503", label: "MERCHANDISE RECEPTION(Réception/Receptie)", oldNumber: "", language: "fr_BE", item: "D1102", activation: "" },
  { category: "Fixed", model: "VVX250", number: "505", label: "NIGHT MERCHANDISE RECEPTION[Sas du nuit/nachtsas)", oldNumber: "", language: "fr_BE", item: "D1107", activation: "" },
  { category: "Flash light", model: "ALGO 8128 SIP FLASH", number: "930", label: "BRICO SERVICE", oldNumber: "", language: "fr_BE", item: "F3007", activation: "" },
  { category: "Flash light", model: "ALGO 8128 SIP FLASH", number: "932", label: "SAFE ROOM DRIVE IN(coffre/koffer drive in )", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Flash light", model: "ALGO 8128 SIP FLASH", number: "933", label: "MERCHANDISE RECEPTION", oldNumber: "", language: "fr_BE", item: "F3008", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "203", label: "TILL ASSISTANTS(Assistantes caisses)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "215", label: "Till 5", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "216", label: "Till 6", oldNumber: "", language: "fr_BE", item: "D1113", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "221", label: "TILL TENT (Caisse Chap)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "760", label: "CS6/ chef 6", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "612", label: "RR 3 from   chef 1", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "631", label: "RR 2  from  chef 3", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "632", label: "RR 3  from  chef 3", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "642", label: "RR 3  from  chef 4", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "652", label: "RR 3  from  chef 5", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "660", label: "RR 1  from  chef 6", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "661", label: "RR 2  from  chef 6", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "662", label: "RR 3  from  chef 6", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "315", label: "DECO 2", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "375", label: "ELECTRICAL TOOLS(Outillage electrique/elektrisch gereedschap)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "390", label: "GARDEN 3", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "555", label: "INFO POINT", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "510", label: "BRICO SERVICE", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "515", label: "RENTAL SERVICE(verhuur dienst)", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "525", label: "BATI 2(Bati 2)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "530", label: "BATI 3(Bati 3)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "545", label: "WOOD 3 (Bois 3)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "560", label: "ZRM 1", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "565", label: "ZRM 2", oldNumber: "", language: "", item: "", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "580", label: "CLIENT COMPATIBILITY(Comptabilité clients)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "800", label: "PERMANENCE(Permanent)", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "not done", label: "Gardes I", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "not done", label: "Gardes II", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "not done", label: "Nettoyage", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "not done", label: "CNE", oldNumber: "", language: "fr_BE", item: "D1111", activation: "NO" },
  { category: "Mobile", model: "HAmerLT", number: "not done", label: "SETCA", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "not done", label: "Informatique", oldNumber: "", language: "fr_BE", item: "D1111", activation: "" },
  { category: "Mobile", model: "HAmerLT", number: "850", label: "PLACEMENT SERVICE(Société placement/plaatsing dienst)", oldNumber: "", language: "", item: "", activation: "" }
];
const defaultRoleOptions = [
  "supadmin_twem",
  "admin_twem",
  "supmanager",
  "manager",
  "magasin",
  "telephonie_destiny",
  "it",
  "infra",
  "intervenant"
];
const defaultAutomations = [
  {
    id: "store_update_alert",
    category: "notifications",
    title: "Alerte quand il y a du nouveau dans un magasin",
    description: "Prévenir automatiquement les personnes liées à un magasin lorsqu'une nouvelle activité, un rendez-vous, un blocage ou un ticket est ajouté.",
    active: true,
    trigger: "Nouvel élément ou mise à jour importante dans une fiche magasin",
    recipients: "Toutes les personnes liées au magasin",
    channels: "Mail avec lien direct",
    responseDelayHours: 0,
    escalationHours: 0,
    repeatHours: 0,
    linkTarget: "Lien vers l'élément concerné",
    languageMode: "Langue du contact",
    notes: "Option recommandée: ne pas renvoyer l'alerte à la personne qui vient de créer l'élément."
  },
  {
    id: "new_person_welcome",
    category: "access",
    title: "Création personne → envoi lien app + PIN",
    description: "Lorsqu'un nouveau contact est créé, lui envoyer automatiquement l'accès à l'application avec son code PIN dans la bonne langue.",
    active: true,
    trigger: "Création d'une nouvelle personne active",
    recipients: "Le nouveau contact uniquement",
    channels: "Mail d'accueil FR/NL",
    responseDelayHours: 0,
    escalationHours: 0,
    repeatHours: 0,
    linkTarget: "Lien vers l'application",
    languageMode: "FR / NL selon la fiche contact",
    notes: "Inclure le texte d'introduction chantier, le lien vers l'application et le PIN personnel."
  },
  {
    id: "no_response_escalation",
    category: "followup",
    title: "Action sans réponse → relance + escalade",
    description: "Surveiller les éléments qui attendent une réponse et relancer automatiquement jusqu'à escalade TWEM.",
    active: true,
    trigger: "Élément de fiche magasin en attente d'action ou de réponse",
    recipients: "Personne concernée puis Valou / TWEM",
    channels: "Mail + alerte TWEM",
    responseDelayHours: 24,
    escalationHours: 24,
    repeatHours: 12,
    linkTarget: "Lien vers la fiche magasin",
    languageMode: "Langue de la personne relancée",
    notes: "Après 24h: rappel. Si toujours rien: alerte Valou pour appel/SMS. Ensuite mail toutes les 12h tant qu'il n'y a pas de réaction."
  }
];
const futureAutomationIdeas = [
  {
    id: "install_reminder",
    title: "Rappel avant installation",
    description: "Envoyer automatiquement un rappel J-2 et J-1 avant une installation planifiée."
  },
  {
    id: "daily_blocked_digest",
    title: "Digest quotidien des blocages",
    description: "Envoyer chaque matin à TWEM la liste condensée des magasins bloqués ou à risque."
  },
  {
    id: "manager_validation_followup",
    title: "Relance validation magasin après installation",
    description: "Relancer le manager si l'installation n'est pas validée dans les 24h."
  }
];
const visibilityTabCatalog = [
  {
    key: "dashboard",
    label: "Dashboard",
    blocks: [
      { key: "filters", label: "Filtres dashboard", hint: "Recherche, statut, type, ville, date." },
      { key: "overview", label: "Vue globale", hint: "KPI principaux et synthese." },
      { key: "alerts", label: "Alertes critiques", hint: "Bloques, retards, urgences." }
    ]
  },
  {
    key: "timeline",
    label: "Timeline / Planning",
    blocks: [
      { key: "filters", label: "Filtres timeline", hint: "Filtrage commun timeline." },
      { key: "timeline_rows", label: "Lignes timeline", hint: "Lecture des etapes par magasin." },
      { key: "timeline_actions", label: "Actions timeline", hint: "Acces fiche / activite depuis une etape." }
    ]
  },
  {
    key: "stores",
    label: "Magasins",
    blocks: [
      { key: "store_list", label: "Liste magasins", hint: "Tableau et recherche magasins." },
      { key: "store_profile", label: "Fiche magasin", hint: "Vue complete du magasin." },
      { key: "store_edit", label: "Edition fiche", hint: "Modification des blocs dans la fiche." },
      { key: "store_sav", label: "Creation SAV", hint: "Creation demande SAV depuis la fiche." }
    ]
  },
  {
    key: "configuration",
    label: "Configuration magasin",
    blocks: [
      { key: "config_list", label: "Liste configuration", hint: "Acces aux magasins a configurer." },
      { key: "config_preparation", label: "Preparation chantier", hint: "Coordination Destiny, pre-visite et preparation externe." },
      { key: "config_choices", label: "Choix telephonie", hint: "Extensions, GSM, alarme, groupes d appel et cascades." }
    ]
  },
  {
    key: "sav",
    label: "SAV / Tickets",
    blocks: [
      { key: "sav_list", label: "Liste tickets", hint: "Vue de tous les tickets." },
      { key: "sav_followup", label: "Suivi ticket", hint: "Commentaires et historique." },
      { key: "sav_status", label: "Statut ticket", hint: "Ouvert, en cours, cloture." }
    ]
  },
  {
    key: "extensions",
    label: "Extensions",
    blocks: [
      { key: "extensions_catalog", label: "Catalogue extensions", hint: "Reference commune de numerotation." }
    ]
  },
  {
    key: "contacts",
    label: "Contacts",
    blocks: [
      { key: "contact_create", label: "Ajouter personne", hint: "Creation d un contact." },
      { key: "contact_store", label: "Ajouter magasin", hint: "Creation fiche magasin rapide." },
      { key: "contact_manage", label: "Liste contacts", hint: "Recherche et modification." }
    ]
  },
  {
    key: "reports",
    label: "Rapports",
    blocks: [
      { key: "reports_today", label: "Remontees du jour", hint: "Journal quotidien." },
      { key: "reports_store", label: "Rapports par magasin", hint: "Historique replie par magasin." },
      { key: "reports_export", label: "Export PDF", hint: "Generation d un rapport PDF." }
    ]
  },
  {
    key: "automations",
    label: "Automatisations",
    blocks: [
      { key: "automations_workflow", label: "Workflow", hint: "Relances, escalades, automatisations." }
    ]
  },
  {
    key: "tools",
    label: "Tools TWEM",
    blocks: [
      { key: "tools_notes", label: "Notes / tools", hint: "Checklist et notes internes." }
    ]
  },
  {
    key: "pin-access",
    label: "PIN / Acces",
    blocks: [
      { key: "pin_directory", label: "Gestion PIN", hint: "Creation, edition, expiration." },
      { key: "pin_magic", label: "Lien magique", hint: "Envoi du lien de connexion." }
    ]
  },
  {
    key: "import-export",
    label: "Import / Export",
    blocks: [
      { key: "import_data", label: "Import", hint: "Import magasins, extensions, donnees." },
      { key: "export_data", label: "Export", hint: "Export des donnees et listes." }
    ]
  },
  {
    key: "visibility",
    label: "Qui voit quoi",
    blocks: [
      { key: "visibility_matrix", label: "Configuration role", hint: "Cascade des droits par role." },
      { key: "visibility_overrides", label: "Derogations chantier", hint: "Exceptions par magasin et personne." }
    ]
  }
];
const translations = {
  fr: {
    navigation: "Navigation",
    pageTitle: "Suivi magasin telephonie",
    pageIntro: "Une ligne par magasin, puis un detail depliant pour gerer les intervenants, les rendez-vous et les blocages.",
    mode: "Mode",
    connection: "Connexion",
    search: "Recherche",
    status: "Statut",
    owner: "Provenance",
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
    csvPending: "Utilise XLS/XLSX ou CSV pour les magasins, et XLS/XLSX, CSV ou JSON pour les extensions.",
    importError: "Import impossible",
    demoMode: "Demo locale",
    local: "Local",
    authState: "Utilisateur actif"
  },
  nl: {
    navigation: "Navigatie",
    pageTitle: "Winkelopvolging telefonie",
    pageIntro: "Een lijn per winkel, daarna een uitklapbaar detail om betrokkenen, afspraken en blokkeringen te beheren.",
    mode: "Modus",
    connection: "Verbinding",
    search: "Zoeken",
    status: "Status",
    owner: "Herkomst",
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
    csvPending: "Gebruik XLS/XLSX of CSV voor winkels, en XLS/XLSX, CSV of JSON voor extensies.",
    importError: "Import mislukt",
    demoMode: "Lokale demo",
    local: "Lokaal",
    authState: "Actieve gebruiker"
  }
};

const initialPeople = [
  { id: "p1", name: "Emir", role: "admin_twem", phone: "0470 00 00 01", email: "emir@twem.be", storeCode: "", language: "fr" },
  { id: "p2", name: "Valou", role: "supadmin_twem", phone: "0470 00 00 02", email: "valou@twem.be", storeCode: "", language: "fr" },
  { id: "p3", name: "M. Dupont", role: "manager", phone: "0470 00 00 03", email: "anderlecht@brico.be", storeCode: "BRI-001", language: "fr" },
  { id: "p4", name: "Mme Martin", role: "manager", phone: "0470 00 00 04", email: "wavre@brico.be", storeCode: "BRI-002", language: "fr" },
  { id: "p5", name: "M. Lambert", role: "manager", phone: "0470 00 00 05", email: "liege@brico.be", storeCode: "BRI-003", language: "fr" },
  { id: "p6", name: "Mme Simon", role: "manager", phone: "0470 00 00 06", email: "namur@brico.be", storeCode: "BRI-004", language: "fr" },
  { id: "p7", name: "Equipe Telephonie A", role: "telephonie_destiny", phone: "0470 00 00 07", email: "telephonie.a@partenaire.be", storeCode: "", language: "fr" },
  { id: "p8", name: "Equipe Telephonie B", role: "telephonie_destiny", phone: "0470 00 00 08", email: "telephonie.b@partenaire.be", storeCode: "", language: "nl" },
  { id: "p9", name: "Electricien Nord", role: "infra", phone: "0470 00 00 09", email: "elec.nord@partenaire.be", storeCode: "", language: "fr" },
  { id: "p10", name: "Electricien Sud", role: "infra", phone: "0470 00 00 10", email: "elec.sud@partenaire.be", storeCode: "", language: "fr" }
];

const defaultPinProfiles = {
  p1: { pin: "111111", allowedStoreCodes: ["*"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions", "contacts", "reports", "automations", "pin-access", "import-export", "visibility"], accessibleBlocks: ["*"], pinStatus: "active" },
  p2: { pin: "222222", allowedStoreCodes: ["*"], accessibleTabs: ["*"], accessibleBlocks: ["*"], pinStatus: "active" },
  p3: { pin: "300001", allowedStoreCodes: ["BRI-001"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["configuration", "network_config", "appointments", "problem_notes", "brico_feedback"], pinStatus: "active" },
  p4: { pin: "300002", allowedStoreCodes: ["BRI-002"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["configuration", "network_config", "appointments", "problem_notes", "brico_feedback"], pinStatus: "active" },
  p5: { pin: "300003", allowedStoreCodes: ["BRI-003"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["configuration", "network_config", "appointments", "problem_notes", "brico_feedback"], pinStatus: "active" },
  p6: { pin: "300004", allowedStoreCodes: ["BRI-004"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["configuration", "network_config", "appointments", "problem_notes", "brico_feedback"], pinStatus: "active" },
  p7: { pin: "440001", allowedStoreCodes: ["*"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["destiny_coordination", "destiny_closure", "appointments", "problem_notes", "status_admin"], pinStatus: "active" },
  p8: { pin: "440002", allowedStoreCodes: ["*"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["destiny_coordination", "destiny_closure", "appointments", "problem_notes", "status_admin"], pinStatus: "active" },
  p9: { pin: "550001", allowedStoreCodes: ["*"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["infra", "external_prep", "problem_notes", "appointments"], pinStatus: "active" },
  p10: { pin: "550002", allowedStoreCodes: ["*"], accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions"], accessibleBlocks: ["infra", "external_prep", "problem_notes", "appointments"], pinStatus: "active" }
};

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

const demoTickets = [
  {
    id: "sav-1",
    storeId: 3,
    storeCode: "BRI-003",
    storeName: "Brico Liege Rocourt",
    requesterName: "M. Lambert",
    targetService: "Destiny",
    concern: "Poste caisse ne recoit pas les appels",
    initialNote: "Le magasin remonte un souci apres installation, impossible de recevoir les appels entrants sur un poste caisse.",
    status: "open",
    createdAt: "2026-04-22T08:05:00Z",
    updates: [
      {
        id: "sav-1-u1",
        authorName: "Valou",
        createdAt: "2026-04-22T08:20:00Z",
        note: "Analyse TWEM lancee, verification demandee a Destiny et Infra."
      },
      {
        id: "sav-1-u2",
        authorName: "Equipe Telephonie B",
        createdAt: "2026-04-22T09:10:00Z",
        note: "Controle en cours sur le routage et la configuration du poste."
      }
    ]
  }
];

const statusLabels = {
  planned: "A commencer",
  in_progress: "En cours",
  blocked: "Bloque",
  done: "Termine",
  issue: "Probleme"
};

const storageKey = "twem-brico-dashboard-v6";
const appConfig = window.APP_CONFIG || {
  mode: "demo",
  supabaseUrl: "",
  supabaseAnonKey: "",
  appwriteEndpoint: "",
  appwriteProjectId: "",
  appwriteDatabaseId: "twem_brico",
  appwriteStoresCollectionId: "stores",
  appwritePeopleCollectionId: "people",
  appwriteActivitiesCollectionId: "activities",
  appwriteSettingsCollectionId: "settings"
};
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
const appwriteDatabases = appwriteClient && window.Appwrite?.Databases
  ? new window.Appwrite.Databases(appwriteClient)
  : null;
const appwriteQuery = window.Appwrite?.Query || null;
const appwriteIdFactory = window.Appwrite?.ID || null;
const appwriteDatabaseId = appConfig.appwriteDatabaseId || "twem_brico";
const appwriteStoresCollectionId = appConfig.appwriteStoresCollectionId || "stores";
const appwritePeopleCollectionId = appConfig.appwritePeopleCollectionId || "people";
const appwriteActivitiesCollectionId = appConfig.appwriteActivitiesCollectionId || "activities";
const appwriteSettingsCollectionId = appConfig.appwriteSettingsCollectionId || "settings";
const appwriteTicketsCollectionId = appConfig.appwriteTicketsCollectionId || "tickets";
const hasAppwriteDataConfig = Boolean(
  appwriteDatabases
  && appwriteDatabaseId
  && appwriteStoresCollectionId
  && appwritePeopleCollectionId
  && appwriteActivitiesCollectionId
  && appwriteSettingsCollectionId
  && appwriteTicketsCollectionId
);
let realtimeChannel = null;
let appwriteRealtimeUnsubscribe = null;
let appwritePollHandle = null;

const state = {
  mode: "demo",
  connectionState: "offline",
  language: "fr",
  activeAdminTab: "dashboard",
  stores: [],
  activities: [],
  people: [],
  activeUserName: "Emir",
  pinValidated: false,
  toolItems: [],
  accessOverrides: [],
  roleOptions: [...defaultRoleOptions],
  automations: clone(defaultAutomations),
  roleVisibilityConfig: {},
  visibilityEditorRole: "supadmin_twem",
  roleViewUnlocked: false,
  contactSearch: "",
  importMode: "stores",
  importExportHistory: [],
  tickets: [],
  filters: {
    search: "",
    status: "all",
    owner: "all",
    stage: "all",
    type: "all",
    city: "all",
    date: "all"
  },
  expandedStoreIds: new Set()
};

const presentationBypassUsers = ["Valou", "Emir"];
const magicLinksEnabled = false;
const knownTestPeopleNames = [
  "M. Dupont",
  "Mme Martin",
  "M. Lambert",
  "Mme Simon",
  "Equipe Telephonie A",
  "Equipe Telephonie B",
  "Electricien Nord",
  "Electricien Sud"
];
const knownTestSavNotes = ["test", "test 2"];
const provenanceOptions = ["Nouveau", "Migration"];

const mainWorkspaceTabs = ["dashboard", "timeline", "stores", "configuration", "sav", "extensions"];

const pinGate = document.querySelector("#pinGate");
const pinForm = document.querySelector("#pinForm");
const pinInput = document.querySelector("#pinInput");
const pinFeedback = document.querySelector("#pinFeedback");
const summaryGrid = document.querySelector("#summaryGrid");
const dashboardExtra = document.querySelector("#dashboardExtra");
const projectTableBody = document.querySelector("#projectTableBody");
const activityList = document.querySelector("#activityList");
const ownerFilter = document.querySelector("#ownerFilter");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const stageFilter = document.querySelector("#stageFilter");
const typeFilter = document.querySelector("#typeFilter");
const cityFilter = document.querySelector("#cityFilter");
const dateFilter = document.querySelector("#dateFilter");
const userViewField = document.querySelector("#userViewField");
const importButton = document.querySelector("#importButton");
const importInput = document.querySelector("#importInput");
const reportButton = document.querySelector("#reportButton");
const tabImportButton = document.querySelector("#tabImportButton");
const tabImportStoresButton = document.querySelector("#tabImportStoresButton");
const tabImportTelephonyButton = document.querySelector("#tabImportTelephonyButton");
const tabImportExtensionsButton = document.querySelector("#tabImportExtensionsButton");
const tabExportButton = document.querySelector("#tabExportButton");
const tabExportStoresCheckXlsxButton = document.querySelector("#tabExportStoresCheckXlsxButton");
const tabExportStoresXlsxButton = document.querySelector("#tabExportStoresXlsxButton");
const tabExportStoresPdfButton = document.querySelector("#tabExportStoresPdfButton");
const tabExportExtensionsXlsxButton = document.querySelector("#tabExportExtensionsXlsxButton");
const tabExportExtensionsPdfButton = document.querySelector("#tabExportExtensionsPdfButton");
const importExportHistoryMeta = document.querySelector("#importExportHistoryMeta");
const importExportHistoryList = document.querySelector("#importExportHistoryList");
const modeBadge = document.querySelector("#modeBadge");
const connectionBadge = document.querySelector("#connectionBadge");
const syncMessage = document.querySelector("#syncMessage");
const authState = document.querySelector("#authState");
const authForm = document.querySelector("#authForm");
const activeUserSelect = document.querySelector("#activeUserSelect");
const quickReturnViewButton = document.querySelector("#quickReturnViewButton");
const emailInput = document.querySelector("#emailInput");
const logoutButton = document.querySelector("#logoutButton");
const reportArchiveList = document.querySelector("#reportArchiveList");
const automationOverview = document.querySelector("#automationOverview");
const automationList = document.querySelector("#automationList");
const automationFutureList = document.querySelector("#automationFutureList");
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
const intervenantForm = document.querySelector("#intervenantForm");
const intervenantPersonSelect = document.querySelector("#intervenantPersonSelect");
const intervenantRoleSelect = document.querySelector("#intervenantRoleSelect");
const roleForm = document.querySelector("#roleForm");
const roleInput = document.querySelector("#roleInput");
const roleList = document.querySelector("#roleList");
const pinAccessForm = document.querySelector("#pinAccessForm");
const pinPersonNameInput = document.querySelector("#pinPersonNameInput");
const pinPersonNameOptions = document.querySelector("#pinPersonNameOptions");
const pinRoleSelect = document.querySelector("#pinRoleSelect");
const pinCodeInput = document.querySelector("#pinCodeInput");
const pinStoreSearchInput = document.querySelector("#pinStoreSearchInput");
const pinStoreSearchOptions = document.querySelector("#pinStoreSearchOptions");
const pinStoreMultiSelect = document.querySelector("#pinStoreMultiSelect");
const pinExpiryInput = document.querySelector("#pinExpiryInput");
const pinStatusSelect = document.querySelector("#pinStatusSelect");
const pinAccessList = document.querySelector("#pinAccessList");
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
const visibilityRoleSelect = document.querySelector("#visibilityRoleSelect");
const visibilityRoleMeta = document.querySelector("#visibilityRoleMeta");
const visibilityTabsEditor = document.querySelector("#visibilityTabsEditor");
const visibilityZonesEditor = document.querySelector("#visibilityZonesEditor");
const visibilityRoleSummary = document.querySelector("#visibilityRoleSummary");
const visibilityRoleDirectory = document.querySelector("#visibilityRoleDirectory");
const resetUserViewButton = document.querySelector("#resetUserViewButton");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hydrateAccessProfile(person) {
  const normalizedPerson = normalizeCoreRole(person);
  const defaults = defaultPinProfiles[person.id] || {};
  return {
    pin: "",
    allowedStoreCodes: normalizedPerson.storeCode ? [normalizedPerson.storeCode] : ["*"],
    accessibleTabs: defaultTabsForRole(normalizedPerson.role).includes("*") ? ["*"] : defaultTabsForRole(normalizedPerson.role),
    accessibleBlocks: ["appointments", "problem_notes"],
    pinStatus: "active",
    pinCreatedAt: "2026-05-06T00:00:00Z",
    pinExpiresAt: "",
    loginHistory: [],
    ...normalizedPerson,
    ...defaults,
    allowedStoreCodes: Array.isArray(normalizedPerson.allowedStoreCodes) ? normalizedPerson.allowedStoreCodes : (defaults.allowedStoreCodes || (normalizedPerson.storeCode ? [normalizedPerson.storeCode] : ["*"])),
    accessibleTabs: Array.isArray(normalizedPerson.accessibleTabs) ? normalizedPerson.accessibleTabs : (defaults.accessibleTabs || (defaultTabsForRole(normalizedPerson.role).includes("*") ? ["*"] : defaultTabsForRole(normalizedPerson.role))),
    accessibleBlocks: Array.isArray(normalizedPerson.accessibleBlocks) ? normalizedPerson.accessibleBlocks : (defaults.accessibleBlocks || ["appointments", "problem_notes"]),
    loginHistory: Array.isArray(normalizedPerson.loginHistory) ? normalizedPerson.loginHistory : []
  };
}

function stripKnownTestPeople(people = []) {
  return (people || []).filter((person) => !knownTestPeopleNames.includes(person?.name));
}

function stripKnownTestTickets(tickets = []) {
  return (tickets || []).filter((ticket) => {
    const concern = normalizeImportCell(ticket?.concern).toLowerCase();
    const note = normalizeImportCell(ticket?.initialNote).toLowerCase();
    return !knownTestSavNotes.includes(concern) && !knownTestSavNotes.includes(note);
  });
}

function demoPinPeople() {
  return clone(initialPeople).filter((person) => !knownTestPeopleNames.includes(person.name)).map(hydrateAccessProfile);
}

function mergePeopleWithPinFallback(people = []) {
  const byKey = new Map();
  const sourcePeople = [
    ...demoPinPeople(),
    ...people.map(hydrateAccessProfile)
  ];

  sourcePeople.forEach((person) => {
    const key = (person.email || person.name || person.id || "").toLowerCase();
    if (!key) {
      return;
    }
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, hydrateAccessProfile(person));
      return;
    }

    const merged = hydrateAccessProfile({
      ...existing,
      ...person,
      pin: normalizePin(person.pin).length === 6 ? person.pin : existing.pin,
      allowedStoreCodes: Array.isArray(person.allowedStoreCodes) && person.allowedStoreCodes.length
        ? person.allowedStoreCodes
        : existing.allowedStoreCodes,
      accessibleTabs: Array.isArray(person.accessibleTabs) && person.accessibleTabs.length
        ? person.accessibleTabs
        : existing.accessibleTabs,
      accessibleBlocks: Array.isArray(person.accessibleBlocks) && person.accessibleBlocks.length
        ? person.accessibleBlocks
        : existing.accessibleBlocks,
      loginHistory: Array.isArray(person.loginHistory) && person.loginHistory.length
        ? person.loginHistory
        : existing.loginHistory,
      pinStatus: person.pinStatus || existing.pinStatus,
      pinCreatedAt: person.pinCreatedAt || existing.pinCreatedAt,
      pinExpiresAt: person.pinExpiresAt || existing.pinExpiresAt
    });

    byKey.set(key, merged);
  });

  return stripKnownTestPeople([...byKey.values()]);
}

function hasRemoteData() {
  return isSupabaseMode || hasAppwriteDataConfig;
}

function safeDocumentId(prefix, value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return `${prefix}-${normalized || "item"}`.slice(0, 36);
}

function parseJsonField(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function buildAppwriteStoreDocument(store) {
  return {
    code: store.code,
    name: store.name,
    city: store.city || "",
    owner_name: store.owner || "",
    manager_name: store.manager || "",
    status: store.status || "planned",
    health: store.health || "",
    updated_at: store.updatedAt || new Date().toISOString(),
    payload_json: JSON.stringify(store)
  };
}

function normalizeAppwriteStore(document) {
  const payload = parseJsonField(document.payload_json, null);
  if (payload && typeof payload === "object") {
    return {
      ...payload,
      id: payload.id ?? Date.now(),
      code: payload.code || document.code,
      name: payload.name || document.name,
      city: payload.city || document.city || "",
      owner: payload.owner || document.owner_name || "",
      manager: payload.manager || document.manager_name || "",
      status: payload.status || document.status || "planned",
      health: payload.health || document.health || "",
      updatedAt: payload.updatedAt || document.updated_at || new Date().toISOString()
    };
  }

  return mapStoreRowToState({
    id: document.$id,
    code: document.code,
    name: document.name,
    city: document.city,
    owner_name: document.owner_name,
    manager_name: document.manager_name,
    status: document.status,
    health: document.health,
    updated_at: document.updated_at
  });
}

function buildAppwritePersonDocument(person) {
  return {
    name: person.name || "",
    role: person.role || "manager",
    phone: person.phone || "",
    email: person.email || "",
    store_code: person.storeCode || "",
    language: person.language || "fr",
    payload_json: JSON.stringify(person)
  };
}

function normalizeAppwritePerson(document) {
  const payload = parseJsonField(document.payload_json, null);
  const base = {
    id: document.$id,
    name: document.name || "",
    role: document.role || "manager",
    phone: document.phone || "",
    email: document.email || "",
    storeCode: document.store_code || "",
    language: document.language || "fr"
  };
  return hydrateAccessProfile(
    payload && typeof payload === "object"
      ? { ...base, ...payload, id: payload.id || document.$id }
      : base
  );
}

function buildAppwriteActivityDocument(activity) {
  return {
    store_name: activity.storeName || "",
    result: activity.result || "ok",
    comment: activity.comment || "",
    confirmed_by: activity.confirmedBy || "",
    created_at: activity.createdAt || new Date().toISOString(),
    payload_json: JSON.stringify(activity)
  };
}

function normalizeAppwriteActivity(document) {
  const payload = parseJsonField(document.payload_json, null);
  const base = {
    id: document.$id,
    storeName: document.store_name || "",
    result: document.result || "ok",
    comment: document.comment || "",
    confirmedBy: document.confirmed_by || "",
    createdAt: document.created_at || new Date().toISOString()
  };
  return payload && typeof payload === "object"
    ? { ...base, ...payload, id: payload.id || document.$id }
    : base;
}

function buildAppwriteSettingsDocument() {
  return {
    role_options_json: JSON.stringify(state.roleOptions || []),
    tool_items_json: JSON.stringify(state.toolItems || []),
    access_overrides_json: JSON.stringify(state.accessOverrides || [])
  };
}

function storeProvenance(store) {
  const raw = normalizeImportCell(store?.owner);
  return provenanceOptions.includes(raw) ? raw : "Migration";
}

function normalizeShopTypeValue(value) {
  const raw = normalizeImportCell(value).toUpperCase().replace(/\s+/g, "");
  if (!raw) {
    return "";
  }
  if (raw === "FOS/DOS" || raw === "DOS/FOS" || raw === "FOSDOS") {
    return "FOSDOS";
  }
  if (raw === "DOS") {
    return "DOS";
  }
  if (raw === "FOS") {
    return "FOS";
  }
  return normalizeImportCell(value).toUpperCase();
}

function buildAppwriteTicketDocument(ticket) {
  return {
    store_id: String(ticket.storeId || ""),
    store_code: ticket.storeCode || "",
    store_name: ticket.storeName || "",
    requester_name: ticket.requesterName || "",
    target_service: ticket.targetService || "",
    concern: ticket.concern || "",
    initial_note: ticket.initialNote || "",
    status: ticket.status || "open",
    created_at: ticket.createdAt || new Date().toISOString(),
    payload_json: JSON.stringify(ticket)
  };
}

function normalizeAppwriteTicket(document) {
  const payload = parseJsonField(document.payload_json, null);
  const base = {
    id: document.$id,
    storeId: document.store_id || "",
    storeCode: document.store_code || "",
    storeName: document.store_name || "",
    requesterName: document.requester_name || "",
    targetService: document.target_service || "",
    concern: document.concern || "",
    initialNote: document.initial_note || "",
    status: document.status || "open",
    createdAt: document.created_at || new Date().toISOString(),
    updates: []
  };
  return payload && typeof payload === "object"
    ? { ...base, ...payload, id: payload.id || document.$id }
    : base;
}

function isAppwriteRateLimitError(error) {
  const code = Number(error?.code || error?.response?.code || 0);
  const type = String(error?.type || error?.response?.type || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();
  return code === 429 || type.includes("rate_limit") || message.includes("rate limit");
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function withAppwriteRetry(task, options = {}) {
  const {
    retries = 4,
    delayMs = 700
  } = options;

  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await task();
    } catch (error) {
      if (!isAppwriteRateLimitError(error) || attempt === retries) {
        throw error;
      }
      await sleep(delayMs * (attempt + 1));
      attempt += 1;
    }
  }
  return null;
}

async function paceRemoteSync(index, every = 12, delayMs = 350) {
  if (index > 0 && index % every === 0) {
    await sleep(delayMs);
  }
}

async function listAllAppwriteDocuments(collectionId, queries = []) {
  if (!appwriteDatabases) {
    return [];
  }

  const all = [];
  let offset = 0;
  while (true) {
    const queryBatch = [...queries];
    if (appwriteQuery) {
      queryBatch.push(appwriteQuery.limit(100));
      queryBatch.push(appwriteQuery.offset(offset));
    }
    const response = await withAppwriteRetry(() =>
      appwriteDatabases.listDocuments(appwriteDatabaseId, collectionId, queryBatch)
    );
    all.push(...response.documents);
    if (response.documents.length < 100) {
      break;
    }
    offset += response.documents.length;
  }
  return all;
}

async function upsertAppwriteDocument(collectionId, documentId, data) {
  if (!appwriteDatabases) {
    return null;
  }

  try {
    return await withAppwriteRetry(() =>
      appwriteDatabases.updateDocument(appwriteDatabaseId, collectionId, documentId, data)
    );
  } catch (error) {
    const code = Number(error?.code || error?.response?.code || 0);
    if (code !== 404) {
      throw error;
    }
    return withAppwriteRetry(() =>
      appwriteDatabases.createDocument(appwriteDatabaseId, collectionId, documentId, data)
    );
  }
}

function localUiState() {
  return {
    stores: state.stores,
    activities: state.activities,
    tickets: state.tickets,
    people: state.people,
    activeUserName: state.activeUserName,
    language: state.language,
    activeAdminTab: state.activeAdminTab,
    toolItems: state.toolItems,
    accessOverrides: state.accessOverrides,
    roleOptions: state.roleOptions,
    automations: state.automations,
    roleVisibilityConfig: state.roleVisibilityConfig,
    visibilityEditorRole: state.visibilityEditorRole,
    roleViewUnlocked: state.roleViewUnlocked,
    contactSearch: state.contactSearch,
    importExportHistory: state.importExportHistory
  };
}

function loadState() {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return {
      stores: clone(demoStores),
      activities: clone(demoActivities),
      tickets: clone(demoTickets),
      people: demoPinPeople(),
      activeUserName: "Emir",
      language: "fr",
      activeAdminTab: "dashboard",
        toolItems: [],
        accessOverrides: [],
        roleOptions: [...defaultRoleOptions],
        automations: clone(defaultAutomations),
        roleVisibilityConfig: {},
        visibilityEditorRole: "supadmin_twem",
        roleViewUnlocked: false,
        contactSearch: "",
        importExportHistory: []
      };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      stores: parsed.stores || clone(demoStores),
      activities: parsed.activities || clone(demoActivities),
      tickets: parsed.tickets || clone(demoTickets),
      people: mergePeopleWithPinFallback((parsed.people || []).map((person) => ({
        language: "fr",
        storeCode: "",
        ...person
      }))),
      activeUserName: parsed.activeUserName || "Emir",
      language: parsed.language || "fr",
      activeAdminTab: parsed.activeAdminTab || "dashboard",
        toolItems: parsed.toolItems || [],
        accessOverrides: parsed.accessOverrides || [],
        roleOptions: normalizedRoleOptions(parsed.roleOptions),
        automations: normalizedAutomations(parsed.automations),
        roleVisibilityConfig: parsed.roleVisibilityConfig || {},
        visibilityEditorRole: parsed.visibilityEditorRole || "supadmin_twem",
        roleViewUnlocked: Boolean(parsed.roleViewUnlocked),
        contactSearch: parsed.contactSearch || "",
        importExportHistory: parsed.importExportHistory || []
      };
  } catch {
    return {
      stores: clone(demoStores),
      activities: clone(demoActivities),
      tickets: clone(demoTickets),
      people: demoPinPeople(),
      activeUserName: "Emir",
      language: "fr",
      activeAdminTab: "dashboard",
        toolItems: [],
        accessOverrides: [],
        roleOptions: [...defaultRoleOptions],
        automations: clone(defaultAutomations),
        roleVisibilityConfig: {},
        visibilityEditorRole: "supadmin_twem",
        roleViewUnlocked: false,
        contactSearch: "",
        importExportHistory: []
      };
  }
}

function saveState() {
  window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
  scheduleRemoteStateSync();
}

const remoteSyncShadow = {
  stores: new Map(),
  people: new Map(),
  tickets: new Map(),
  activities: new Map(),
  settings: ""
};

let remoteSyncTimer = null;
let remoteSyncInFlight = false;
let remoteSyncQueued = false;
let remoteSyncSuppressed = false;

function stableSerialize(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "";
  }
}

function storeRemoteSyncKey(store) {
  return safeDocumentId("store", store.code || store.id);
}

function personRemoteSyncKey(person) {
  return safeDocumentId("person", person.id || person.email || person.name);
}

function ticketRemoteSyncKey(ticket) {
  return safeDocumentId("ticket", ticket.id || `${ticket.storeCode}-${ticket.createdAt}`);
}

function activityRemoteSyncKey(activity) {
  return safeDocumentId("activity", activity.id || `${activity.storeName}-${activity.createdAt}`);
}

function settingsRemoteSyncSnapshot() {
  return stableSerialize(buildAppwriteSettingsDocument());
}

function refreshRemoteSyncShadow() {
  remoteSyncShadow.stores = new Map((state.stores || []).map((store) => [storeRemoteSyncKey(store), stableSerialize(store)]));
  remoteSyncShadow.people = new Map((state.people || []).map((person) => [personRemoteSyncKey(person), stableSerialize(person)]));
  remoteSyncShadow.tickets = new Map((state.tickets || []).map((ticket) => [ticketRemoteSyncKey(ticket), stableSerialize(ticket)]));
  remoteSyncShadow.activities = new Map((state.activities || []).map((activity) => [activityRemoteSyncKey(activity), stableSerialize(activity)]));
  remoteSyncShadow.settings = settingsRemoteSyncSnapshot();
}

function computeRemoteSyncDiff(items, keyGetter, shadowMap) {
  const changed = [];
  const liveKeys = new Set();
  (items || []).forEach((item) => {
    const key = keyGetter(item);
    liveKeys.add(key);
    if (shadowMap.get(key) !== stableSerialize(item)) {
      changed.push(item);
    }
  });
  const removed = [...shadowMap.keys()].filter((key) => !liveKeys.has(key));
  return { changed, removed };
}

async function syncDirtyRemoteState() {
  if (!hasRemoteData() || remoteSyncSuppressed) {
    return;
  }

  if (remoteSyncInFlight) {
    remoteSyncQueued = true;
    return;
  }

  remoteSyncInFlight = true;
  try {
    if (supabaseClient) {
      await syncAllRemoteState();
      await loadRemoteState();
      refreshRemoteSyncShadow();
      return;
    }

    const peopleDiff = computeRemoteSyncDiff(state.people || [], personRemoteSyncKey, remoteSyncShadow.people);
    const storesDiff = computeRemoteSyncDiff(state.stores || [], storeRemoteSyncKey, remoteSyncShadow.stores);
    const ticketsDiff = computeRemoteSyncDiff(state.tickets || [], ticketRemoteSyncKey, remoteSyncShadow.tickets);
    const activitiesDiff = computeRemoteSyncDiff(state.activities || [], activityRemoteSyncKey, remoteSyncShadow.activities);
    const settingsChanged = remoteSyncShadow.settings !== settingsRemoteSyncSnapshot();

    for (const person of peopleDiff.changed) {
      await syncPersonToRemote(person);
    }
    for (const personKey of peopleDiff.removed) {
      const id = personKey.replace(/^person-/, "");
      await deletePersonFromRemote(id);
    }
    for (const store of storesDiff.changed) {
      await syncStoreToRemote(store);
    }
    for (const ticket of ticketsDiff.changed) {
      await upsertAppwriteDocument(
        appwriteTicketsCollectionId,
        ticketRemoteSyncKey(ticket),
        buildAppwriteTicketDocument(ticket)
      );
    }
    for (const ticketKey of ticketsDiff.removed) {
      await appwriteDatabases.deleteDocument(appwriteDatabaseId, appwriteTicketsCollectionId, ticketKey);
    }
    for (const activity of activitiesDiff.changed) {
      await upsertAppwriteDocument(
        appwriteActivitiesCollectionId,
        activityRemoteSyncKey(activity),
        buildAppwriteActivityDocument(activity)
      );
    }
    if (settingsChanged) {
      await syncSettingsToRemote();
    }

    await loadRemoteState();
    refreshRemoteSyncShadow();
  } catch (error) {
    console.error("Remote sync error", error);
  } finally {
    remoteSyncInFlight = false;
    if (remoteSyncQueued) {
      remoteSyncQueued = false;
      scheduleRemoteStateSync(1500);
    }
  }
}

function scheduleRemoteStateSync(delayMs = 1500) {
  if (!hasRemoteData() || remoteSyncSuppressed) {
    return;
  }

  if (remoteSyncTimer) {
    window.clearTimeout(remoteSyncTimer);
  }
  remoteSyncTimer = window.setTimeout(() => {
    remoteSyncTimer = null;
    void syncDirtyRemoteState();
  }, delayMs);
}

function normalizedAutomations(list) {
  return defaultAutomations.map((baseItem) => {
    const stored = Array.isArray(list) ? list.find((entry) => entry.id === baseItem.id) : null;
    return {
      ...baseItem,
      ...(stored || {})
    };
  });
}

function normalizedRoleOptions(list) {
  return [...new Set([...(Array.isArray(list) ? list : []), ...defaultRoleOptions])];
}

function recordImportExportHistory(type, label, detail = "") {
  const nextEntry = {
    id: `io-${Date.now()}`,
    type,
    label,
    detail,
    author: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString()
  };

  const baseHistory = state.importExportHistory.filter((item) => item.label !== label);

  state.importExportHistory = [nextEntry, ...baseHistory].slice(0, 20);
  saveState();
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

function preferredSupAdminViewName() {
  return state.people.find((person) => person.name === "Valou")?.name
    || state.people.find((person) => person.role === "supadmin_twem")?.name
    || state.people.find((person) => person.name === "Emir")?.name
    || state.activeUserName
    || "";
}

function canUseRoleSimulation() {
  return isSupAdmin();
}

function canShowRoleReturn() {
  return state.roleViewUnlocked || isSupAdmin();
}

function preferredUserFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const rawUser = (params.get("user") || "").trim().toLowerCase();
  if (!rawUser) {
    return null;
  }

  const aliases = {
    emir: "Emir",
    valou: "Valou"
  };

  if (aliases[rawUser]) {
    return aliases[rawUser];
  }

  return state.people.find((person) => person.name.toLowerCase() === rawUser)?.name || null;
}

function normalizeCoreRole(person) {
  if (!person || typeof person !== "object") {
    return person;
  }
  const normalized = { ...person };
  if (normalized.name === "Valou") {
    normalized.role = "supadmin_twem";
  } else if (normalized.name === "Emir" && normalized.role === "supadmin_twem") {
    normalized.role = "admin_twem";
  }
  return normalized;
}

function mergePersonRecords(records = []) {
  return records.reduce((acc, record) => {
    if (!record) {
      return acc;
    }
    Object.entries(record).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
    });
    return acc;
  }, {});
}

function cleanPeopleForImportedStores(people = [], stores = []) {
  const hydratedPeople = mergePeopleWithPinFallback(people);
  const storesByCode = new Map((stores || []).map((store) => [store.code, store]));
  const coreNames = ["Emir", "Valou"];

  const coreTwem = coreNames.map((name) => {
    const matching = hydratedPeople.filter((person) => person.name === name);
    const base = initialPeople.find((person) => person.name === name) || {};
    const merged = hydrateAccessProfile(mergePersonRecords([base, ...matching]));
    return hydrateAccessProfile({
      ...merged,
      name,
      role: name === "Valou" ? "supadmin_twem" : "admin_twem",
      allowedStoreCodes: ["*"],
      storeCode: "",
      pinStatus: "active"
    });
  });

  const managerPeople = hydratedPeople.filter((person) => {
    if (!person || coreNames.includes(person.name)) {
      return false;
    }
    if (!person.storeCode || !storesByCode.has(person.storeCode)) {
      return false;
    }
    const role = String(person.role || "").toLowerCase();
    return role === "manager" || role === "magasin";
  }).map((person) => {
    const store = storesByCode.get(person.storeCode);
    return hydrateAccessProfile({
      ...person,
      role: "magasin",
      name: person.name || store?.manager || "",
      allowedStoreCodes: [person.storeCode],
      pinStatus: person.pinStatus || "active"
    });
  });

  const byStore = new Map();
  managerPeople.forEach((person) => {
    const key = `${person.storeCode}|${normalizeImportCell(person.email).toLowerCase()}|${normalizeImportCell(person.name).toLowerCase()}`;
    if (!byStore.has(key)) {
      byStore.set(key, person);
    }
  });

  return mergePeopleWithPinFallback([
    ...coreTwem,
    ...[...byStore.values()]
  ]);
}

function hasImportedStoreSet(stores = []) {
  return Array.isArray(stores) && stores.length > 20;
}

function cleanImportHistory(history = []) {
  if (!Array.isArray(history)) {
    return [];
  }
  const filtered = history.filter((item) => {
    const label = normalizeImportCell(item?.label).toLowerCase();
    const detail = normalizeImportCell(item?.detail).toLowerCase();
    const isOldGlobalImport = label.includes("import magasins") && detail.includes("global");
    return !isOldGlobalImport;
  });
  const latestByLabel = new Map();
  filtered.forEach((item) => {
    if (!item?.label || latestByLabel.has(item.label)) {
      return;
    }
    latestByLabel.set(item.label, item);
  });
  return [...latestByLabel.values()].slice(0, 20);
}

function resetImportedStoresForKickoff(stores = []) {
  return (stores || []).map((store) => {
    const nextStore = clone(store);
    nextStore.status = "planned";
    nextStore.health = "";
    nextStore.steps = freshImportedSteps();
    nextStore.appointments = Array.isArray(nextStore.appointments) ? nextStore.appointments : [];
    const workflow = ensureStoreWorkflowData(nextStore);
    workflow.destinyInstallDate = "";
    workflow.collectDate = "";
    workflow.itValidationDate = "";
    workflow.previsitDate = "";
    workflow.transferDate = "";
    workflow.destinyInstallDone = "Non";
    workflow.extensionRequestStatus = workflow.extensionRequestStatus || "A envoyer";
    workflow.extensionConfigStatus = workflow.extensionConfigStatus || "En attente";
    workflow.networkConfigConfirmed = false;
    return nextStore;
  });
}

function isSupAdmin(user = currentUser()) {
  return Boolean(user && user.role === "supadmin_twem" && user.name === "Valou");
}

function isAdminTwem(user = currentUser()) {
  return Boolean(user && (user.role === "admin_twem" || isSupAdmin(user)));
}

function isTwemUser() {
  const user = currentUser();
  return Boolean(user && ["supadmin_twem", "admin_twem"].includes(user.role));
}

function canSeeAllStores(user = currentUser()) {
  return Boolean(user && !["manager", "supmanager", "magasin"].includes(user.role));
}

function allowedStoresForUser(user = currentUser()) {
  if (!user) {
    return [];
  }
  if (user.allowedStoreCodes?.includes("*")) {
    return ["*"];
  }
  const scopedStores = [];
  if (user.storeCode) {
    scopedStores.push(user.storeCode);
  }
  if (Array.isArray(user.allowedStoreCodes)) {
    scopedStores.push(...user.allowedStoreCodes);
  }
  return [...new Set(scopedStores.filter(Boolean))];
}

function defaultTabsForRole(role) {
  const map = {
    supadmin_twem: ["*"],
    admin_twem: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "contacts", "reports", "automations", "tools", "pin-access", "import-export"],
    supmanager: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "contacts", "reports", "automations"],
    manager: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "reports"],
    magasin: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "reports"],
    telephonie_destiny: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "reports"],
    it: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "reports"],
    infra: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "reports"],
    intervenant: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "reports"]
  };
  return map[role] || ["dashboard"];
}

function accessibleTabsForUser(user = currentUser()) {
  if (!user) {
    return ["dashboard"];
  }
  if (user.accessibleTabs?.includes("*") || isSupAdmin(user)) {
    return ["*"];
  }
  return [...new Set([...(defaultTabsForRole(user.role) || []), ...(user.accessibleTabs || [])])];
}

function canAccessTab(tab, user = currentUser()) {
  if (tab === "visibility") {
    return isSupAdmin(user);
  }
  const tabs = accessibleTabsForUser(user);
  return tabs.includes("*") || tabs.includes(tab);
}

function panelForTab(tab) {
  if (mainWorkspaceTabs.includes(tab)) {
    return "dashboard";
  }
  return tab;
}

function activeMainWorkspaceTab() {
  return mainWorkspaceTabs.includes(state.activeAdminTab) ? state.activeAdminTab : "dashboard";
}

function tabTitle(tab) {
  const isNl = state.language === "nl";
  const titles = {
    dashboard: "Dashboard",
    timeline: isNl ? "Tijdlijn / Planning" : "Timeline / Planning",
    stores: isNl ? "Winkels" : "Magasins",
    configuration: isNl ? "Configuratie winkel" : "Configuration magasin",
    sav: "SAV / Tickets",
    extensions: "Extensions",
    contacts: isNl ? "Contacten" : "Contacts",
    reports: isNl ? "Rapporten" : "Rapports",
    automations: isNl ? "Automatiseringen" : "Automatisations",
    tools: "Tools TWEM",
    "pin-access": "PIN / Acces",
    "import-export": isNl ? "Import / Export" : "Import / Export",
    visibility: isNl ? "Wie ziet wat" : "Qui voit quoi"
  };
  return titles[tab] || "Dashboard";
}

function editableZonesForRole(role) {
  const map = {
    supadmin_twem: ["all"],
    admin_twem: ["all"],
    supmanager: ["appointments", "project_prep", "problem_notes", "brico_feedback", "status_admin", "configuration_request", "sav_ticket"],
    manager: ["appointments", "project_prep", "configuration_request", "network_config", "brico_feedback", "problem_notes", "sav_ticket"],
    magasin: ["appointments", "project_prep", "configuration_request", "network_config", "brico_feedback", "problem_notes", "sav_ticket"],
    telephonie_destiny: ["appointments", "order_articles", "destiny_coordination", "external_prep", "destiny_closure", "problem_notes", "status_admin", "sav_ticket"],
    it: ["appointments", "external_prep", "network_config", "store_posts", "sav_ticket"],
    infra: ["appointments", "external_prep", "problem_notes", "sav_ticket"],
    default: ["appointments", "sav_ticket"]
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
  return Boolean(user && ["manager", "magasin"].includes(user.role) && workflow.networkConfigConfirmed);
}

function getRoleScopedStores() {
  const user = currentUser();
  if (!user) {
    return state.stores;
  }

  if (canSeeAllStores(user)) {
    return state.stores;
  }

  const storeCodes = allowedStoresForUser(user);
  return state.stores.filter((store) => storeCodes.includes(store.code));
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

function generateUniquePin() {
  const existingPins = new Set(
    state.people
      .map((person) => normalizePin(person.pin))
      .filter((pin) => pin.length === 6)
  );
  let candidate = "";
  do {
    candidate = String(Math.floor(100000 + Math.random() * 900000));
  } while (existingPins.has(candidate));
  return candidate;
}

function roleLabel(role) {
  const labels = {
    supadmin_twem: "SupAdmin TWEM",
    admin_twem: "Admin TWEM",
    supmanager: "SupManager",
    manager: "Manager magasin",
    magasin: "Magasin",
    telephonie_destiny: "Telephonie / Destiny",
    it: "IT",
    infra: "Infra",
    intervenant: "Autre intervenant"
  };
  return labels[role] || role;
}

function defaultVisibilityModesForRole(role) {
  const visibleTabs = defaultTabsForRole(role).includes("*")
    ? visibilityTabCatalog.map((tab) => tab.key)
    : defaultTabsForRole(role).filter((tab) => visibilityTabCatalog.some((entry) => entry.key === tab));
  const editableZones = editableZonesForRole(role);
  const tabs = {};
  const blocks = {};
  visibleTabs.forEach((tabKey) => {
    tabs[tabKey] = true;
    const catalog = visibilityTabCatalog.find((entry) => entry.key === tabKey);
    if (!catalog) return;
    blocks[tabKey] = {};
    catalog.blocks.forEach((block) => {
      const editable = editableZones.includes("all")
        || editableZones.includes(block.key)
        || editableZones.includes(tabKey)
        || (tabKey === "stores" && editableZones.includes("sav_ticket") && block.key === "store_sav");
      blocks[tabKey][block.key] = editable ? "edit" : "view";
    });
  });
  return { tabs, blocks };
}

function ensureRoleVisibilityConfig(role) {
  if (!role) {
    return { tabs: {}, blocks: {} };
  }
  if (!state.roleVisibilityConfig[role]) {
    state.roleVisibilityConfig[role] = defaultVisibilityModesForRole(role);
  }
  state.roleVisibilityConfig[role].tabs ||= {};
  state.roleVisibilityConfig[role].blocks ||= {};
  return state.roleVisibilityConfig[role];
}

function summarizeRoleVisibility(role) {
  const config = ensureRoleVisibilityConfig(role);
  const visibleTabs = visibilityTabCatalog.filter((tab) => config.tabs[tab.key]);
  const editableBlocks = [];
  visibleTabs.forEach((tab) => {
    tab.blocks.forEach((block) => {
      const mode = config.blocks?.[tab.key]?.[block.key];
      if (mode === "edit") {
        editableBlocks.push(`${tab.label} : ${block.label}`);
      }
    });
  });
  return { visibleTabs, editableBlocks };
}

function renderVisibilityEditor() {
  if (!visibilityRoleSelect || !visibilityTabsEditor || !visibilityZonesEditor || !visibilityRoleSummary || !visibilityRoleDirectory) {
    return;
  }

  const availableRoles = [...new Set([...(state.roleOptions || []), ...defaultRoleOptions])]
    .filter((role) => isSupAdmin() || role !== "supadmin_twem");
  if (!availableRoles.includes(state.visibilityEditorRole)) {
    state.visibilityEditorRole = availableRoles[0] || "admin_twem";
  }
  const role = state.visibilityEditorRole;
  const config = ensureRoleVisibilityConfig(role);

  visibilityRoleSelect.innerHTML = availableRoles
    .map((entry) => `<option value="${escapeHtml(entry)}" ${entry === role ? "selected" : ""}>${escapeHtml(roleLabel(entry))}</option>`)
    .join("");

  const summary = summarizeRoleVisibility(role);
  visibilityRoleMeta.innerHTML = `
    <span class="info-chip">${escapeHtml(roleLabel(role))}</span>
    <span class="info-chip">${summary.visibleTabs.length} onglet(s) visibles</span>
    <span class="info-chip">${summary.editableBlocks.length} bloc(s) modifiable(s)</span>
  `;

  visibilityTabsEditor.innerHTML = visibilityTabCatalog
    .map((tab) => `
      <label class="visibility-tab-pill">
        <input type="checkbox" data-visibility-tab="${escapeHtml(tab.key)}" ${config.tabs[tab.key] ? "checked" : ""}>
        <span>${escapeHtml(tab.label)}</span>
      </label>
    `)
    .join("");

  const visibleTabCards = visibilityTabCatalog
    .filter((tab) => config.tabs[tab.key])
      .map((tab) => {
        const blockRows = tab.blocks.map((block) => {
          const currentMode = config.blocks?.[tab.key]?.[block.key] || "view";
          return `
            <div class="visibility-zone-row">
              <div class="visibility-zone-label">
                <strong>${escapeHtml(block.label)}</strong>
                <span>${escapeHtml(block.hint)}</span>
              </div>
              <label>
                <span>Cacher</span>
                <input type="radio" name="visibility-${escapeHtml(role)}-${escapeHtml(tab.key)}-${escapeHtml(block.key)}" value="hide" data-visibility-mode="${escapeHtml(tab.key)}::${escapeHtml(block.key)}" ${currentMode === "hide" ? "checked" : ""}>
              </label>
              <label>
                <span>Voir</span>
                <input type="radio" name="visibility-${escapeHtml(role)}-${escapeHtml(tab.key)}-${escapeHtml(block.key)}" value="view" data-visibility-mode="${escapeHtml(tab.key)}::${escapeHtml(block.key)}" ${currentMode === "view" ? "checked" : ""}>
              </label>
              <label>
                <span>Modifier</span>
                <input type="radio" name="visibility-${escapeHtml(role)}-${escapeHtml(tab.key)}-${escapeHtml(block.key)}" value="edit" data-visibility-mode="${escapeHtml(tab.key)}::${escapeHtml(block.key)}" ${currentMode === "edit" ? "checked" : ""}>
              </label>
          </div>
        `;
      }).join("");
      return `
        <article class="visibility-zone-card">
          <h5>${escapeHtml(tab.label)}</h5>
          <div class="visibility-zone-list">${blockRows}</div>
        </article>
      `;
    })
    .join("");

  visibilityZonesEditor.innerHTML = visibleTabCards || '<div class="visibility-zone-empty">Aucun onglet visible pour ce role.</div>';

  const visibleTabChips = summary.visibleTabs.length
    ? summary.visibleTabs.map((tab) => `<span class="visibility-chip">${escapeHtml(tab.label)}</span>`).join("")
    : '<div class="empty-state">Aucun onglet visible.</div>';
    const editableBlockChips = summary.editableBlocks.length
      ? summary.editableBlocks.map((block) => `<span class="visibility-chip">${escapeHtml(block)}</span>`).join("")
      : '<div class="empty-state">Tout est en lecture seule.</div>';
    const hiddenBlocks = [];
    summary.visibleTabs.forEach((tab) => {
      tab.blocks.forEach((block) => {
        const mode = config.blocks?.[tab.key]?.[block.key];
        if (mode === "hide") {
          hiddenBlocks.push(`${tab.label} : ${block.label}`);
        }
      });
    });
    const hiddenBlockChips = hiddenBlocks.length
      ? hiddenBlocks.map((block) => `<span class="visibility-chip">${escapeHtml(block)}</span>`).join("")
      : '<div class="empty-state">Aucun bloc masque.</div>';

    visibilityRoleSummary.innerHTML = `
      <article class="visibility-summary-card">
        <h5>Onglets visibles</h5>
        <div class="visibility-zone-list">
        <div class="visibility-chip-list">${visibleTabChips}</div>
      </div>
    </article>
      <article class="visibility-summary-card">
        <h5>Blocs modifiables</h5>
        <div class="visibility-zone-list">
          <div class="visibility-chip-list">${editableBlockChips}</div>
        </div>
      </article>
      <article class="visibility-summary-card">
        <h5>Blocs masques</h5>
        <div class="visibility-zone-list">
          <div class="visibility-chip-list">${hiddenBlockChips}</div>
        </div>
      </article>
    `;

  visibilityRoleDirectory.innerHTML = availableRoles.map((entry) => {
    const roleSummary = summarizeRoleVisibility(entry);
    const visibleText = roleSummary.visibleTabs.map((tab) => tab.label).join(", ") || "Aucun onglet";
    const editableText = roleSummary.editableBlocks.slice(0, 3).join(" | ") || "Lecture seule";
    return `
      <article class="visibility-role-compact ${entry === role ? "is-active" : ""}">
        <div class="visibility-role-compact-head">
          <strong>${escapeHtml(roleLabel(entry))}</strong>
          <button type="button" class="mini-button" data-visibility-edit-role="${escapeHtml(entry)}">Modifier</button>
        </div>
        <p>${escapeHtml(visibleText)}</p>
        <p class="cell-note">${escapeHtml(editableText)}</p>
      </article>
    `;
  }).join("");

  visibilityTabsEditor.querySelectorAll("[data-visibility-tab]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const tabKey = checkbox.getAttribute("data-visibility-tab");
      config.tabs[tabKey] = checkbox.checked;
      const catalog = visibilityTabCatalog.find((entry) => entry.key === tabKey);
      if (checkbox.checked && catalog) {
        config.blocks[tabKey] ||= {};
        catalog.blocks.forEach((block) => {
          config.blocks[tabKey][block.key] ||= "view";
        });
      }
      saveState();
      renderVisibilityEditor();
    });
  });

  visibilityZonesEditor.querySelectorAll("[data-visibility-mode]").forEach((input) => {
    input.addEventListener("change", () => {
      const [tabKey, blockKey] = input.getAttribute("data-visibility-mode").split("::");
      config.blocks[tabKey] ||= {};
      config.blocks[tabKey][blockKey] = input.value;
      saveState();
      renderVisibilityEditor();
    });
  });

  visibilityRoleDirectory.querySelectorAll("[data-visibility-edit-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.visibilityEditorRole = button.getAttribute("data-visibility-edit-role") || state.visibilityEditorRole;
      saveState();
      renderVisibilityEditor();
    });
  });
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
    if (person.role === "manager") {
      return person.storeCode === store.code;
    }
    return ["supadmin_twem", "admin_twem", "telephonie_destiny", "it", "infra", "intervenant", "supmanager"].includes(person.role);
  });

  return candidates.map((person) => {
    const selected = selectedValues.includes(person.name) ? "selected" : "";
    return `<option value="${escapeHtml(person.name)}" ${selected}>${escapeHtml(person.name)} - ${escapeHtml(person.role)}</option>`;
  }).join("");
}

function normalizeRemotePerson(person) {
  return hydrateAccessProfile({
    id: String(person.id),
    name: person.name || "",
    role: person.role || "manager",
    phone: person.phone || "",
    email: person.email || "",
    storeCode: person.store_code || "",
    language: person.language || "fr"
  });
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

function normalizeDateOnly(dateLike) {
  if (!dateLike) {
    return null;
  }
  const parsed = new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function nextRelevantDate(store) {
  const appointments = sortedAppointments(store);
  if (appointments[0]?.datetime) {
    return normalizeDateOnly(appointments[0].datetime);
  }
  const workflow = ensureStoreWorkflowData(store);
  return normalizeDateOnly(workflow.destinyInstallDate || store.updatedAt);
}

function matchesDateScope(store) {
  if (state.filters.date === "all") {
    return true;
  }

  const date = nextRelevantDate(store);
  if (!date) {
    return state.filters.date !== "today" && state.filters.date !== "week";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / 86400000);

  if (state.filters.date === "today") {
    return diffDays === 0;
  }
  if (state.filters.date === "week") {
    return diffDays >= 0 && diffDays <= 7;
  }
  if (state.filters.date === "late") {
    return diffDays < 0;
  }
  if (state.filters.date === "future") {
    return diffDays > 7;
  }
  return true;
}

function getFilteredStores() {
  return getRoleScopedStores().filter((store) => {
    const nextAction = sortedAppointments(store)[0]?.note || store.health || "";
    const stage = currentWorkflowStage(store);
    const haystack = `${store.code} ${store.name} ${store.city} ${store.manager} ${store.shopType || ""} ${store.status} ${store.owner} ${nextAction} ${stage}`.toLowerCase();
    const matchesSearch = haystack.includes(state.filters.search);
    const matchesStatus = state.filters.status === "all" || store.status === state.filters.status;
    const matchesOwner = state.filters.owner === "all" || storeProvenance(store) === state.filters.owner;
    const matchesStage = state.filters.stage === "all" || stage === state.filters.stage;
    const matchesType = state.filters.type === "all" || (store.shopType || "") === state.filters.type;
    const matchesCity = state.filters.city === "all" || store.city === state.filters.city;
    const matchesDate = matchesDateScope(store);
    return matchesSearch && matchesStatus && matchesOwner && matchesStage && matchesType && matchesCity && matchesDate;
  });
}

function renderSummary() {
  const visibleStores = getRoleScopedStores();
  const total = visibleStores.length || 1;
  const doneCount = visibleStores.filter((store) => store.status === "done").length;
  const blockedCount = visibleStores.filter((store) => store.status === "blocked").length;
  const noRdvCount = visibleStores.filter((store) => store.appointments.length === 0).length;
  const inProgressCount = visibleStores.filter((store) => store.status === "in_progress").length;
  const runCount = visibleStores.filter((store) => ensureStoreWorkflowData(store).ltSwitchStatus === "Basculee").length;
  const dosCount = visibleStores.filter((store) => store.shopType === "DOS").length;
  const fosCount = visibleStores.filter((store) => store.shopType === "FOS").length;
  const fosdosCount = visibleStores.filter((store) => store.shopType === "FOSDOS").length;
  const validationItCount = visibleStores.filter((store) => ensureStoreWorkflowData(store).vlan22Activated !== "Oui").length;
  const validationInfraCount = visibleStores.filter((store) => ensureStoreWorkflowData(store).charlesRouxStatus !== "OK").length;
  const riskCount = visibleStores.filter((store) => store.status === "blocked" || ensureStoreWorkflowData(store).networkSurveyStatus !== "OK").length;
  const mainTab = activeMainWorkspaceTab();
  const cardsByTab = {
    dashboard: [
      { label: "Total magasins", value: visibleStores.length, note: "Vision globale parc", portion: 100, filter: null },
      { label: "DOS", value: dosCount, note: "Type magasin DOS", portion: Math.round((dosCount / total) * 100), filter: { key: "type", value: "DOS", tab: "stores" } },
      { label: "FOS", value: fosCount, note: "Type magasin FOS", portion: Math.round((fosCount / total) * 100), filter: { key: "type", value: "FOS", tab: "stores" } },
      { label: "FOSDOS", value: fosdosCount, note: "Type magasin FOSDOS", portion: Math.round((fosdosCount / total) * 100), filter: { key: "type", value: "FOSDOS", tab: "stores" } },
      { label: "En deploiement", value: inProgressCount, note: "Projets actifs", portion: Math.round((inProgressCount / total) * 100), filter: { key: "status", value: "in_progress", tab: "stores" } },
      { label: "En RUN", value: runCount, note: "Exploitation et SAV", portion: Math.round((runCount / total) * 100), filter: { key: "stage", value: "RUN", tab: "stores" } },
      { label: "Clotures", value: doneCount, note: "Projets finalises", portion: Math.round((doneCount / total) * 100), filter: { key: "status", value: "done", tab: "stores" } },
      { label: "Bloques", value: blockedCount, note: "Dossiers a debloquer", portion: Math.round((blockedCount / total) * 100), filter: { key: "status", value: "blocked", tab: "stores" } }
    ],
    timeline: [
      { label: "Interventions planifiees", value: visibleStores.filter((store) => sortedAppointments(store).length).length, note: "Chronologie magasins", portion: Math.round((visibleStores.filter((store) => sortedAppointments(store).length).length / total) * 100), filter: null },
      { label: "Validation IT", value: validationItCount, note: "VLAN / reseau a valider", portion: Math.round((validationItCount / total) * 100), filter: { key: "stage", value: "Validation IT", tab: "timeline" } },
      { label: "Validation infra", value: validationInfraCount, note: "Cablage / alarme", portion: Math.round((validationInfraCount / total) * 100), filter: { key: "stage", value: "Validation Infra", tab: "timeline" } },
      { label: "Installations a risque", value: riskCount, note: "Points sensibles a traiter", portion: Math.round((riskCount / total) * 100), filter: { key: "status", value: "blocked", tab: "timeline" } }
    ],
    sav: [
      { label: "Tickets ouverts", value: getFilteredTickets().filter((ticket) => ticket.status === "open").length, note: "Demandes a traiter", portion: Math.min(100, getFilteredTickets().filter((ticket) => ticket.status === "open").length * 20), filter: { key: "status", value: "in_progress", tab: "sav" } },
      { label: "En cours", value: getFilteredTickets().filter((ticket) => ticket.status === "in_progress").length, note: "Suivis en traitement", portion: Math.min(100, getFilteredTickets().filter((ticket) => ticket.status === "in_progress").length * 20), filter: { key: "status", value: "in_progress", tab: "sav" } },
      { label: "Clotures", value: getFilteredTickets().filter((ticket) => ticket.status === "closed").length, note: "Historique conserve", portion: Math.min(100, getFilteredTickets().filter((ticket) => ticket.status === "closed").length * 20), filter: { key: "status", value: "done", tab: "sav" } },
      { label: "A surveiller", value: getFilteredTickets().filter((ticket) => ticket.status !== "closed").length, note: "Tickets encore actifs", portion: Math.min(100, getFilteredTickets().filter((ticket) => ticket.status !== "closed").length * 20), filter: null }
    ],
    extensions: [
      { label: "Reference extensions", value: extensionCatalogRows.length, note: "Liste commune magasin / IT", portion: 100, filter: null },
      { label: "Postes fixes", value: visibleStores.reduce((sum, store) => sum + getStoreQuantityPlan(store).fixCount, 0), note: "Quota total fixe", portion: 100, filter: null },
      { label: "Mobiles", value: visibleStores.reduce((sum, store) => sum + getStoreQuantityPlan(store).mobileCount, 0), note: "Quota total mobile", portion: 100, filter: null },
      { label: "Call / Panic", value: visibleStores.reduce((sum, store) => sum + getStoreQuantityPlan(store).callButtonCount + getStoreQuantityPlan(store).panicCount, 0), note: "Lignes specifiques", portion: 100, filter: null }
    ],
    stores: [
      { label: t("summaryStores"), value: visibleStores.length, note: t("summaryStoresNote"), portion: 100 },
      { label: t("summaryDone"), value: doneCount, note: t("summaryDoneNote"), portion: Math.round((doneCount / total) * 100) },
      { label: t("summaryBlocked"), value: blockedCount, note: t("summaryBlockedNote"), portion: Math.round((blockedCount / total) * 100) },
      { label: t("summaryNoAppointment"), value: noRdvCount, note: t("summaryNoAppointmentNote"), portion: Math.round((noRdvCount / total) * 100) }
    ]
  };
  const cards = cardsByTab[mainTab] || cardsByTab.dashboard;

  summaryGrid.innerHTML = "";
  cards.forEach((card) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <button type="button" class="dashboard-kpi-button" ${card.filter ? `data-kpi-filter='${escapeHtml(JSON.stringify(card.filter))}'` : ""}>
        <div class="panel summary-card">
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
        </div>
      </button>
    `;
    summaryGrid.append(article);
  });

  summaryGrid.querySelectorAll("[data-kpi-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = JSON.parse(button.getAttribute("data-kpi-filter"));
      if (filter?.tab) {
        state.activeAdminTab = filter.tab;
      }
      if (filter?.key) {
        state.filters[filter.key] = filter.value;
      }
      saveState();
      render();
    });
  });

  renderDashboardExtra(mainTab, visibleStores);
}

function renderDashboardExtra(mainTab, visibleStores) {
  if (!dashboardExtra) {
    return;
  }

  if (mainTab === "dashboard") {
    dashboardExtra.classList.remove("hidden-panel");
    dashboardExtra.innerHTML = `
      <div class="dashboard-card-grid">
        <article class="dashboard-card">
          <h3>Statut projets</h3>
          <div class="dashboard-chip-grid">
            ${[
              { label: "A lancer", value: visibleStores.filter((store) => store.status === "planned").length, note: "Dossiers a demarrer", filter: { key: "status", value: "planned", tab: "stores" } },
              { label: "En attente infos", value: visibleStores.filter((store) => !ensureStoreWorkflowData(store).networkConfigConfirmed).length, note: "Config magasin attendue", filter: { key: "stage", value: "Validation manager config", tab: "stores" } },
              { label: "Validation IT", value: visibleStores.filter((store) => ensureStoreWorkflowData(store).vlan22Activated !== "Oui").length, note: "Reseau / VLAN", filter: { key: "stage", value: "Validation IT", tab: "timeline" } },
              { label: "Validation infra", value: visibleStores.filter((store) => ensureStoreWorkflowData(store).charlesRouxStatus !== "OK").length, note: "Cablage / alarme", filter: { key: "stage", value: "Validation Infra", tab: "timeline" } },
              { label: "En cours", value: visibleStores.filter((store) => store.status === "in_progress").length, note: "Installations actives", filter: { key: "status", value: "in_progress", tab: "stores" } },
              { label: "RUN", value: visibleStores.filter((store) => ensureStoreWorkflowData(store).ltSwitchStatus === "Basculee").length, note: "Magasins en exploitation", filter: { key: "stage", value: "RUN", tab: "stores" } },
              { label: "PO attente", value: visibleStores.filter((store) => !store.poLicences).length, note: "Commandes a relancer", filter: { key: "status", value: "blocked", tab: "stores" } },
              { label: "Tickets urgents", value: visibleStores.filter((store) => store.status === "blocked").length, note: "SAV prioritaire", filter: { key: "status", value: "blocked", tab: "sav" } }
            ].map((chip) => `
              <button type="button" class="dashboard-chip" data-kpi-filter='${escapeHtml(JSON.stringify(chip.filter))}'>
                <span class="mini-label">${chip.label}</span>
                <strong>${chip.value}</strong>
                <small>${chip.note}</small>
              </button>
            `).join("")}
          </div>
        </article>
        <article class="dashboard-card">
          <h3>Actions en attente</h3>
          <div class="dashboard-chip-grid">
            ${[
              { label: "Validation manager", value: visibleStores.filter((store) => !ensureStoreWorkflowData(store).networkConfigConfirmed).length, note: "Attente retour magasin", filter: { key: "stage", value: "Validation manager config", tab: "stores" } },
              { label: "Validation IT", value: visibleStores.filter((store) => ensureStoreWorkflowData(store).vlan22Activated !== "Oui").length, note: "A traiter par IT", filter: { key: "stage", value: "Validation IT", tab: "timeline" } },
              { label: "Validation infra", value: visibleStores.filter((store) => ensureStoreWorkflowData(store).charlesRouxStatus !== "OK").length, note: "A traiter par Infra", filter: { key: "stage", value: "Validation Infra", tab: "timeline" } },
              { label: "Actions TWEM", value: visibleStores.filter((store) => store.owner).length, note: "Pilotage central", filter: { key: "owner", value: state.filters.owner === "all" ? twemOptions[0] : state.filters.owner, tab: "stores" } }
            ].map((chip) => `
              <button type="button" class="dashboard-chip" data-kpi-filter='${escapeHtml(JSON.stringify(chip.filter))}'>
                <span class="mini-label">${chip.label}</span>
                <strong>${chip.value}</strong>
                <small>${chip.note}</small>
              </button>
            `).join("")}
          </div>
        </article>
      </div>
    `;
    dashboardExtra.querySelectorAll("[data-kpi-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = JSON.parse(button.getAttribute("data-kpi-filter"));
        if (filter?.tab) {
          state.activeAdminTab = filter.tab;
        }
        if (filter?.key) {
          state.filters[filter.key] = filter.value;
        }
        saveState();
        render();
      });
    });
    return;
  }

  dashboardExtra.classList.add("hidden-panel");
  dashboardExtra.innerHTML = "";
}

function syncSelectors() {
  languageSelect.value = state.language;
  const types = [...new Set(getRoleScopedStores().map((store) => store.shopType).filter(Boolean))].sort();
  const cities = [...new Set(getRoleScopedStores().map((store) => store.city).filter(Boolean))].sort();
  const stages = [...new Set(getRoleScopedStores().map((store) => currentWorkflowStage(store)).filter(Boolean))].sort();
  ownerFilter.innerHTML = `<option value="all">${t("all")}</option>`;
  provenanceOptions.forEach((owner) => {
    const option = document.createElement("option");
    option.value = owner;
    option.textContent = owner;
    ownerFilter.append(option);
  });
  ownerFilter.value = state.filters.owner;

  typeFilter.innerHTML = `<option value="all">${t("all")}</option>${types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}`;
  typeFilter.value = state.filters.type;

  cityFilter.innerHTML = `<option value="all">${t("all")}</option>${cities.map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`).join("")}`;
  cityFilter.value = state.filters.city;

  stageFilter.innerHTML = `<option value="all">${state.language === "nl" ? "Alle" : "Toutes"}</option>${stages.map((stage) => `<option value="${escapeHtml(stage)}">${escapeHtml(stage)}</option>`).join("")}`;
  stageFilter.value = state.filters.stage;

  dateFilter.value = state.filters.date;

  activeUserSelect.innerHTML = state.people.map((person) => {
    const selected = person.name === state.activeUserName ? "selected" : "";
    return `<option value="${escapeHtml(person.name)}" ${selected}>${escapeHtml(person.name)} - ${escapeHtml(person.role)}</option>`;
  }).join("");

  storeOwnerSelect.innerHTML = provenanceOptions
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");

  personRoleSelect.innerHTML = renderRoleOptions(personRoleSelect.value || "manager");
  personLanguageSelect.value = personLanguageSelect.value || "fr";
  personStoreCodeInput.innerHTML = renderStoreCodeOptions(personStoreCodeInput.value || "");
  peopleSearchInput.value = state.contactSearch;
  if (intervenantPersonSelect) {
    intervenantPersonSelect.innerHTML = state.people
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "fr"))
      .map((person) => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name)}</option>`)
      .join("");
  }

  if (pinRoleSelect) {
    pinRoleSelect.innerHTML = renderRoleOptions(pinRoleSelect.value || "manager");
  }
  if (pinPersonNameOptions) {
    pinPersonNameOptions.innerHTML = state.people
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "fr"))
      .map((person) => `<option value="${escapeHtml(person.name)}">${escapeHtml(roleLabel(person.role))}</option>`)
      .join("");
  }
  if (pinStoreSearchOptions) {
    pinStoreSearchOptions.innerHTML = state.stores
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "fr"))
      .map((store) => `<option value="${escapeHtml(`${store.name} (${store.code})`)}">${escapeHtml(store.city || "")}</option>`)
      .join("");
  }
  if (pinStoreMultiSelect) {
    pinStoreMultiSelect.innerHTML = state.stores
      .map((store) => `<option value="${escapeHtml(store.code)}">${escapeHtml(store.name)} (${escapeHtml(store.code)})</option>`)
      .join("");
  }
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

  const currentAppointments = sortedAppointments(store).length
    ? sortedAppointments(store).map((appointment) => `
        <div class="appointment-current-item">
          <strong>${escapeHtml(formatDateTime(appointment.datetime))}</strong>
          <span class="${badgeClass(appointment.status)}">${escapeHtml(appointment.status)}</span>
          <span class="cell-note">${escapeHtml(peopleLabel(appointment.people))}</span>
          <span class="cell-note">${escapeHtml(appointment.note || "-")}</span>
        </div>
      `).join("")
    : '<div class="empty-state">Aucun rendez-vous pour ce magasin.</div>';

  return `
    <article class="appointments-card full-span-card" data-access-zone="appointments">
      <h3>Rendez-vous</h3>
      <p>Plusieurs rendez-vous possibles par magasin.</p>
      <div class="appointments-split">
        <div>
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
          <div class="editor-actions sav-request-actions">
            <button type="submit">Confirmer / envoyer</button>
          </div>
        </div>
        <aside class="appointments-current-card">
          <h4>Rendez-vous pris</h4>
          <div class="appointments-current-list">${currentAppointments}</div>
        </aside>
      </div>
    </article>
  `;
}

function getStoreQuantityPlan(store) {
  if (
    Number.isFinite(Number(store.licenseCount))
    || Number.isFinite(Number(store.fixCount))
    || Number.isFinite(Number(store.mobileCount))
    || Number.isFinite(Number(store.callButtonCount))
    || Number.isFinite(Number(store.panicCount))
  ) {
    return {
      licenseCount: Math.max(0, Number(store.licenseCount) || 0),
      fixCount: Math.max(0, Number(store.fixCount) || 0),
      mobileCount: Math.max(0, Number(store.mobileCount) || 0),
      callButtonCount: Math.max(0, Number(store.callButtonCount) || 0),
      panicCount: Math.max(0, Number(store.panicCount) || 0)
    };
  }

  const codeNumber = Number.parseInt(String(store.code).replace(/\D/g, ""), 10) || 0;
  const licenseCount = 8 + (codeNumber % 6);
  const fixCount = Math.max(2, Math.round(licenseCount * 0.6));
  const mobileCount = Math.max(1, Math.round(licenseCount * 0.3));
  const callButtonCount = Math.max(1, Math.round(licenseCount * 0.15));
  const panicCount = Math.max(0, Math.round(licenseCount * 0.08));

  return { licenseCount, fixCount, mobileCount, callButtonCount, panicCount };
}

function defaultNetworkRowsForStore(store) {
  const { fixCount, mobileCount, callButtonCount, panicCount } = getStoreQuantityPlan(store);
  const rows = [];
  const pushRows = (category, count) => {
    for (let index = 1; index <= count; index += 1) {
      rows.push({
        id: `${category}-${index}`,
        category,
        slotLabel: `${category} ${index}`,
        extensionLabel: "",
        note: ""
      });
    }
  };
  pushRows("Poste fixe", fixCount);
  pushRows("Mobile", mobileCount);
  pushRows("Call button", callButtonCount);
  pushRows("Panic button", panicCount);
  return rows;
}

function getNetworkConfigRows(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (!Array.isArray(workflow.networkRows) || !workflow.networkRows.length) {
    workflow.networkRows = defaultNetworkRowsForStore(store);
  }
  return workflow.networkRows;
}

function defaultGsmRowsForStore(store) {
  const { mobileCount } = getStoreQuantityPlan(store);
  const count = Math.max(2, Math.min(4, mobileCount));
  return Array.from({ length: count }, (_, index) => ({
    id: `gsm-${index + 1}`,
    model: "",
    mobileNumber: "",
    mobileNetwork: "",
    iccid: "",
    puk: "",
    extensionLinked: "",
    user: "",
    callGroup: ""
  }));
}

function getGsmRows(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (!Array.isArray(workflow.gsmRows) || !workflow.gsmRows.length) {
    workflow.gsmRows = defaultGsmRowsForStore(store);
  }
  return workflow.gsmRows;
}

function gsmModelOptions() {
  return [
    "A confirmer",
    "Hammer LT",
    "Yealink W59R",
    "Gigaset R700H",
    "Autre"
  ];
}

function defaultIntervenantRows() {
  return [
    { id: "it", slotName: "IT", note: "Preparation technique" },
    { id: "herbots", slotName: "Herbots", note: "Intervention site" },
    { id: "extra1", slotName: "", note: "" },
    { id: "extra2", slotName: "", note: "" },
    { id: "extra3", slotName: "", note: "" },
    { id: "extra4", slotName: "", note: "" }
  ];
}

function getIntervenantRows(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (!Array.isArray(workflow.intervenantRows) || !workflow.intervenantRows.length) {
    workflow.intervenantRows = defaultIntervenantRows();
  }
  return workflow.intervenantRows;
}

function renderPersonSelect(selectedValue = "", includeBlank = true) {
  const options = [
    ...(includeBlank ? [{ value: "", label: "Choisir un intervenant" }] : []),
    ...state.people.map((person) => ({
      value: person.name,
      label: `${person.name} - ${roleLabel(person.role)}`
    }))
  ];
  return `<select>${renderOptions(options, selectedValue)}</select>`;
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

function buildNetworkConfigSkeleton(store, options = {}) {
  const { showConfirmBar = true } = options;
  const workflow = ensureStoreWorkflowData(store);
  const rows = getNetworkConfigRows(store);
  const groupedRows = rows.reduce((accumulator, row) => {
    accumulator[row.category] ||= [];
    accumulator[row.category].push(row);
    return accumulator;
  }, {});

  const editableContent = Object.entries(groupedRows).map(([category, categoryRows]) => `
    <article class="network-category">
      <div class="network-category-head">
        <h4>${escapeHtml(category)}</h4>
        <span>${categoryRows.length} ligne(s)</span>
      </div>
      <div class="network-rows">
        ${categoryRows.map((row, index) => `
          <div class="network-row">
            <div class="network-slot">${escapeHtml(row.slotLabel || `${category} ${index + 1}`)}</div>
            <label>
              <span>Extension + lieu</span>
              <select name="network_extension_${escapeHtml(row.id)}">
                <option value="">Choisir une extension / un lieu</option>
                ${extensionReferenceOptions.map((option) => `<option value="${escapeHtml(option)}" ${row.extensionLabel === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
            <label>
              <span>Note</span>
              <input type="text" name="network_note_${escapeHtml(row.id)}" value="${escapeHtml(row.note || "")}" placeholder="Ex: personnaliser la touche / commentaire">
            </label>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");

  const summaryRows = rows.filter((row) => row.extensionLabel || row.note);
  const summaryContent = summaryRows.length
    ? `
      <div class="compact-table-wrap">
        <table class="compact-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Slot</th>
              <th>Extension + lieu</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${summaryRows.map((row) => `
              <tr>
                <td>${escapeHtml(row.category)}</td>
                <td>${escapeHtml(row.slotLabel)}</td>
                <td>${escapeHtml(row.extensionLabel || "-")}</td>
                <td>${escapeHtml(row.note || "-")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `
    : '<div class="empty-state">Aucun choix extension confirme pour le moment.</div>';

  return `
    <details class="network-skeleton" open data-access-zone="network_config">
      <summary>
        <span>Configuration du reseau</span>
        <span>Lignes generees automatiquement par quantite magasin</span>
      </summary>
      <div class="network-skeleton-body">
        <p class="posts-skeleton-intro">Le responsable magasin remplit cette partie pour permettre a l IT de programmer les appareils avant installation.</p>
        <input type="hidden" name="network_config_confirmed" value="${workflow.networkConfigConfirmed ? "1" : "0"}">
        ${showConfirmBar
          ? (workflow.networkConfigConfirmed ? summaryContent : editableContent)
          : editableContent}
        ${showConfirmBar ? `
          <div class="network-confirm-bar">
            <span class="cell-note">${workflow.networkConfigConfirmed ? "Choix magasin confirmes. Modifications ensuite via Probleme / notes." : "Le magasin remplit ses choix puis confirme en bas du module."}</span>
            <button type="button" class="mini-button" data-network-confirm="${store.id}">${workflow.networkConfigConfirmed ? "Choix confirmes" : "Confirmer vos choix"}</button>
          </div>
        ` : ""}
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
  const store = state.stores.find((entry) => entry.id === state.activeStoreId) || state.stores[0];
  const workflow = store ? ensureStoreWorkflowData(store) : null;
  return `
    <div class="editor-grid">
      <article class="editor-card" data-access-zone="project_prep">
        <h3>Configuration</h3>
        <p>Suivi de la demande de configuration magasin.</p>
        <div class="two-col">
          <label>
            <span>Demande configuration</span>
            <select name="config_status">
              ${renderOptions(["Pas envoye", "Envoye", "Recue"], workflow?.configStatus || "Envoye")}
            </select>
          </label>
          <label>
            <span>Date telephonie actuelle</span>
            <input type="date" name="current_phone_date" value="${escapeHtml(workflow?.currentPhoneDate || "")}">
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
              ${renderOptions(["Non transmise", "Transmise fournisseur", "Recue magasin"], workflow?.orderStatus || "Transmise fournisseur")}
            </select>
          </label>
          <label>
            <span>Commentaire logistique</span>
            <input type="text" name="order_note" value="${escapeHtml(workflow?.orderNote || "")}">
          </label>
        </div>
      </article>
    </div>
  `;
}

function buildStoreSectionNav(mode = "stores") {
  const links = mode === "configuration"
    ? [
        ["overview", "Vue d ensemble"],
        ["preparation", "Preparation"],
        ["configuration", "Configuration"],
        ["equipment", "Equipements"],
        ["closing", "Cloture"]
      ]
    : [
        ["overview", "Vue d ensemble"],
        ["quantities", "Quantites"],
        ["configuration-summary", "Recap configuration"],
        ["equipment", "Equipements"],
        ["appointments", "Rendez-vous"],
        ["sav", "SAV"],
        ["documents", "Documents"],
        ["closing", "Cloture"]
      ];
  return `
    <nav class="store-editor-nav">
      ${links.map(([key, label]) => `<a href="#section-${key}" class="store-editor-nav-link">${escapeHtml(label)}</a>`).join("")}
    </nav>
  `;
}

function buildConfigurationSummaryCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  const transmittedRows = [
    ["Demande configuration", workflow.extensionRequestStatus || "A envoyer"],
    ["Commande articles", normalizeImportCell(store.poHardware || store.poHw || "-") ? "Reference recue" : "A confirmer"],
    ["Mail configuration", workflow.extensionRequestStatus || "A envoyer"],
    ["Ticket Destiny", workflow.destinyTicketRef || "A confirmer"],
    ["Date telephonie actuelle", workflow.currentPhoneDate || "A confirmer"]
  ];

  const confirmedRows = [
    ["Coordination Destiny", workflow.destinyPmName || workflow.destinyInstallDate ? "Fait" : "A faire"],
    ["Pre-visite", workflow.networkSurveyStatus === "Termine" || workflow.networkSurveyStatus === "OK" ? "Faite" : "A faire"],
    ["Preparation externe", workflow.vlan22Activated === "Oui" || workflow.charlesRouxStatus === "OK" ? "Faite" : "A faire"],
    ["Configuration magasin", workflow.extensionConfigStatus === "Recue" ? "Confirmee" : "En attente"],
    ["Choix telephonie", workflow.networkConfigConfirmed ? "Confirmes" : "A confirmer"]
  ];

  return `
    <div class="editor-grid section-anchor" id="section-configuration-summary">
      <article class="editor-card full-span-card grouped-card" data-access-zone="configuration_request">
        <div class="grouped-card-head">
          <h3>Recap configuration et preparation</h3>
          <p>Vue synthetique des demandes transmises et des elements deja confirmes.</p>
        </div>
        <div class="two-col">
          <section class="subpanel">
            <h4>Demandes transmises</h4>
            <div class="compact-table-wrap">
              <table class="compact-table">
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Etat</th>
                  </tr>
                </thead>
                <tbody>
                  ${transmittedRows.map(([label, value]) => `
                    <tr>
                      <td>${escapeHtml(label)}</td>
                      <td>${escapeHtml(value || "-")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </section>
          <section class="subpanel">
            <h4>Elements confirmes</h4>
            <div class="compact-table-wrap">
              <table class="compact-table">
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Etat</th>
                  </tr>
                </thead>
                <tbody>
                  ${confirmedRows.map(([label, value]) => `
                    <tr>
                      <td>${escapeHtml(label)}</td>
                      <td>${escapeHtml(value || "-")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <div class="posts-skeleton-actions">
          <button type="button" class="mini-button" data-open-config-store="${store.id}">Ouvrir la configuration detaillee</button>
        </div>
      </article>
    </div>
  `;
}

function buildPreparationHubCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid section-anchor" id="section-preparation">
      <article class="editor-card full-span-card grouped-card" data-access-zone="external_prep">
        <div class="grouped-card-head">
          <h3>Preparation chantier</h3>
          <p>Pre-visite, coordination Destiny et preparation externe regroupes dans un seul cadre.</p>
        </div>
        <div class="grouped-card-grid three-col-grid">
          <section class="subpanel">
            <h4>Coordination Destiny</h4>
            <div class="contacts-form-grid">
              <label>
                <span>Date installation Destiny</span>
                <input type="date" name="destiny_install_date" value="${escapeHtml(workflow.destinyInstallDate)}">
              </label>
              <label>
                <span>Reference ticket</span>
                <input type="text" name="destiny_ticket_ref" value="${escapeHtml(workflow.destinyTicketRef)}" placeholder="Ex: DST-2026-0412">
              </label>
              <label>
                <span>Numero dossier</span>
                <input type="text" name="destiny_case_ref" value="${escapeHtml(workflow.destinyCaseRef)}">
              </label>
              <label>
                <span>PM installateur</span>
                <input type="text" name="destiny_pm_name" value="${escapeHtml(workflow.destinyPmName)}">
              </label>
              <label>
                <span>Mail PM</span>
                <input type="email" name="destiny_pm_email" value="${escapeHtml(workflow.destinyPmEmail)}">
              </label>
              <label>
                <span>Diffusion</span>
                <input type="text" name="destiny_distribution" value="${escapeHtml(workflow.destinyDistribution)}">
              </label>
            </div>
          </section>
          <section class="subpanel">
            <h4>Pre-visite Destiny</h4>
            <div class="two-col">
              <label>
                <span>Verification reseau</span>
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
              <textarea name="first_visit_remark" rows="5">${escapeHtml(workflow.firstVisitRemark)}</textarea>
            </label>
          </section>
          <section class="subpanel">
            <h4>Preparation externe</h4>
            <div class="external-prep-grid compact-prep-grid">
              <label>
                <span>Alarme geree par IT</span>
                <select name="alarm_handled_by_it">
                  ${renderOptions(["A confirmer", "Oui", "Non"], workflow.alarmHandledByIt)}
                </select>
              </label>
              <label>
                <span>VLAN22 demande</span>
                <select name="vlan22_status">
                  ${renderOptions(["Pas demande", "Demandee", "Recue", "Bloquee"], workflow.vlan22Status)}
                </select>
              </label>
              <label>
                <span>VLAN22 active</span>
                <select name="vlan22_activated">
                  ${renderOptions(["Non", "Oui", "Bloque"], workflow.vlan22Activated)}
                </select>
              </label>
              <label>
                <span>Charles Roux</span>
                <select name="charles_roux_status">
                  ${renderOptions(["A verifier", "OK", "Probleme"], workflow.charlesRouxStatus)}
                </select>
              </label>
              <label>
                <span>Cablage</span>
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
                <span>Nombre chargeurs</span>
                <input type="number" min="0" name="mobile_charger_count" value="${escapeHtml(workflow.mobileChargerCount)}">
              </label>
            </div>
          </section>
        </div>
      </article>
    </div>
  `;
}

function buildConfigurationHubCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid section-anchor" id="section-configuration">
      <article class="editor-card full-span-card grouped-card" data-access-zone="configuration_request">
        <div class="grouped-card-head">
          <h3>Configuration magasin</h3>
          <p>De la demande de configuration jusqu au choix final des extensions.</p>
        </div>
        <div class="two-col">
          <label>
            <span>Demande configuration</span>
            <select name="config_status">
              ${renderOptions(["Pas envoye", "Envoye", "Recue"], workflow.configStatus || "Envoye")}
            </select>
          </label>
          <label>
            <span>Date telephonie actuelle</span>
            <input type="date" name="current_phone_date" value="${escapeHtml(workflow.currentPhoneDate || "")}">
          </label>
          <label>
            <span>Commande articles</span>
            <select name="order_status">
              ${renderOptions(["Non transmise", "Transmise fournisseur", "Recue magasin"], workflow.orderStatus || "Transmise fournisseur")}
            </select>
          </label>
          <label>
            <span>Commentaire logistique</span>
            <input type="text" name="order_note" value="${escapeHtml(workflow.orderNote || "")}">
          </label>
        </div>
        <div class="contacts-form-grid section-block">
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
        <div class="two-col section-block">
          <label>
            <span>Message d accueil / IVR / remarques manager</span>
            <textarea name="ivr_notes" rows="5">${escapeHtml(workflow.ivrNotes)}</textarea>
          </label>
          <label>
            <span>Autres consignes Brico</span>
            <textarea name="greeting_notes" rows="5">${escapeHtml(workflow.greetingNotes)}</textarea>
          </label>
        </div>
        <div class="posts-skeleton-actions">
          <button type="submit" class="mini-button">Sauvegarder cette configuration</button>
        </div>
        ${buildNetworkConfigSkeleton(store, { showConfirmBar: false })}
      </article>
    </div>
  `;
}

function buildStoreDocumentsCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  const planName = workflow.planPdfName || "";
  const updatedLabel = workflow.planPdfUpdatedAt
    ? `Derniere mise a jour ${formatDateTime(workflow.planPdfUpdatedAt)}`
    : "Ajoute ici le plan PDF du magasin.";

  return `
    <div class="editor-grid section-anchor" id="section-documents">
      <article class="editor-card full-span-card" data-access-zone="store_documents">
        <h3>Documents / Plan magasin</h3>
        <div class="two-col align-end-grid">
          <div class="cell-stack">
            <strong>${escapeHtml(planName || "Aucun plan PDF importe")}</strong>
            <span class="cell-note">${escapeHtml(updatedLabel)}</span>
          </div>
          <div class="posts-skeleton-actions">
            <input type="file" class="hidden-file-input" data-plan-file="${store.id}" accept="application/pdf">
            <button type="button" class="mini-button" data-plan-upload="${store.id}">${planName ? "Remplacer le plan PDF" : "Importer le plan PDF"}</button>
            <button type="button" class="mini-button" data-plan-open="${store.id}" ${workflow.planPdfDataUrl ? "" : "disabled"}>Ouvrir le PDF</button>
            <button type="button" class="mini-button" data-plan-delete="${store.id}" ${workflow.planPdfDataUrl ? "" : "disabled"}>Supprimer</button>
          </div>
        </div>
      </article>
    </div>
  `;
}

function buildEquipmentCards(store) {
  const workflow = ensureStoreWorkflowData(store);
  const gsmRows = getGsmRows(store);
  return `
    <div class="editor-grid section-anchor" id="section-equipment">
      <article class="editor-card full-span-card grouped-card" data-access-zone="store_posts">
        <h3>GSM / SIM</h3>
        <div class="device-stack">
          ${gsmRows.map((row, index) => `
            <article class="network-category">
              <div class="network-category-head">
                <h4>GSM ${index + 1}</h4>
                <span>${escapeHtml(row.user || row.mobileNumber || "A definir")}</span>
              </div>
              <div class="network-rows">
                <div class="network-row gsm-row">
                  <label>
                    <span>Modele appareil</span>
                    <select name="gsm_model_${escapeHtml(row.id)}">
                      ${gsmModelOptions().map((option) => `<option value="${escapeHtml(option)}" ${row.model === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
                    </select>
                  </label>
                  <label>
                    <span>Extension liee</span>
                    <select name="gsm_extension_${escapeHtml(row.id)}">
                      <option value="">Choisir une extension</option>
                      ${extensionReferenceOptions.map((option) => `<option value="${escapeHtml(option)}" ${row.extensionLinked === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
                    </select>
                  </label>
                  <label>
                    <span>Utilisateur</span>
                    <input type="text" name="gsm_user_${escapeHtml(row.id)}" value="${escapeHtml(row.user || "")}">
                  </label>
                  <label>
                    <span>Numero mobile</span>
                    <input type="text" name="gsm_number_${escapeHtml(row.id)}" value="${escapeHtml(row.mobileNumber || "")}">
                  </label>
                  <label>
                    <span>Reseau mobile</span>
                    <input type="text" name="gsm_network_${escapeHtml(row.id)}" value="${escapeHtml(row.mobileNetwork || "")}">
                  </label>
                  <label>
                    <span>ICCID</span>
                    <input type="text" name="gsm_iccid_${escapeHtml(row.id)}" value="${escapeHtml(row.iccid || "")}">
                  </label>
                  <label>
                    <span>Code PUK</span>
                    <input type="text" name="gsm_puk_${escapeHtml(row.id)}" value="${escapeHtml(row.puk || "")}">
                  </label>
                  <label>
                    <span>Groupe appel</span>
                    <input type="text" name="gsm_group_${escapeHtml(row.id)}" value="${escapeHtml(row.callGroup || "")}">
                  </label>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
        ${isSupAdmin() ? `
          <div class="posts-skeleton-actions">
            <button type="button" class="mini-button" data-gsm-add="${store.id}">Ajouter un GSM</button>
          </div>
        ` : ""}
      </article>
      <article class="editor-card">
        <h3>Alarme</h3>
        <div class="two-col">
          <label>
            <span>Type d alarme</span>
            <select name="alarm_type">
              ${renderOptions(["PSTN", "DATA", "PSTN / DATA", "A confirmer"], workflow.alarmType)}
            </select>
          </label>
          <label>
            <span>Societe</span>
            <input type="text" name="alarm_company" value="${escapeHtml(workflow.alarmCompany)}">
          </label>
          <label>
            <span>Tel centrale alarme</span>
            <input type="text" name="alarm_phone" value="${escapeHtml(workflow.alarmCentralPhone)}">
          </label>
          <label class="full-row">
            <span>Autres</span>
            <textarea name="alarm_other" rows="4">${escapeHtml(workflow.alarmOther)}</textarea>
          </label>
        </div>
      </article>
      <article class="editor-card">
        <h3>Groupes d appel</h3>
        <label>
          <span>Groupes d appel</span>
          <textarea name="call_groups_note" rows="6" placeholder="Ex: accueil > caisse > directeur">${escapeHtml(workflow.callGroupsNote)}</textarea>
        </label>
      </article>
      <article class="editor-card">
        <h3>Cascades</h3>
        <label>
          <span>Cascades</span>
          <textarea name="cascade_note" rows="6" placeholder="Ex: si non reponse, renvoi vers permanence">${escapeHtml(workflow.cascadeNote)}</textarea>
        </label>
      </article>
      <article class="editor-card full-span-card">
        <div class="network-confirm-bar">
          <span class="cell-note">${workflow.networkConfigConfirmed ? "Choix magasin confirmes. Modifications ensuite via Probleme / notes." : "Les choix telephonie sont complets ? Confirme-les ici en fin de parcours."}</span>
          <button type="button" class="mini-button" data-network-confirm="${store.id}">${workflow.networkConfigConfirmed ? "Choix confirmes" : "Confirmer vos choix"}</button>
        </div>
      </article>
    </div>
  `;
}

function buildExtraActorsBoard(store) {
  const rows = getIntervenantRows(store);
  const groups = [rows.slice(0, 4), rows.slice(4, 8)].filter((group) => group.length);

  return `
    <div class="actor-board-stack">
      ${groups.map((group) => `
        <div class="actor-board yellow-line-clone">
          <div class="actor-board-head">
            ${group.map((item) => `<div class="actor-board-title">${escapeHtml(item.slotName || "Intervenant")}</div>`).join("")}
          </div>
          <div class="actor-board-body">
            ${group.map((item) => `
              <div class="actor-board-cell">
                <div class="cell-stack">
                  <span class="${badgeClass("planned")}">${statusLabel("planned")}</span>
                  <label>
                    <span class="sr-only">Intervenant</span>
                    <select name="intervenant_name_${escapeHtml(item.id)}">
                      <option value="">Choisir un intervenant</option>
                      ${state.people.map((person) => `<option value="${escapeHtml(person.name)}" ${item.slotName === person.name ? "selected" : ""}>${escapeHtml(person.name)} - ${escapeHtml(roleLabel(person.role))}</option>`).join("")}
                    </select>
                  </label>
                  <input type="text" name="intervenant_note_${escapeHtml(item.id)}" value="${escapeHtml(item.note || "")}" placeholder="Note / suivi">
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
    currentPlatform: "Destiny",
    targetPlatform: "TELEPO",
    configStatus: "Envoye",
    currentPhoneDate: "",
    orderStatus: "Transmise fournisseur",
    orderNote: "",
    collectDate: "",
    itValidationDate: "",
    previsitDate: "",
    transferDate: "",
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
    planPdfName: "",
    planPdfDataUrl: "",
    planPdfUpdatedAt: "",
    destinyInstallDone: "Non",
    destinyInstallRemark: "",
    bricoFinalMailStatus: "A envoyer",
    bricoFinalRemark: "",
    ltSwitchStatus: "En attente",
    networkConfigConfirmed: false,
    networkRows: defaultNetworkRowsForStore(store),
    gsmRows: defaultGsmRowsForStore(store),
    intervenantRows: defaultIntervenantRows(),
    alarmType: "A confirmer",
    alarmCompany: "",
    alarmCentralPhone: "",
    alarmOther: "",
    callGroupsNote: "",
    cascadeNote: ""
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!store.workflow[key]) {
      store.workflow[key] = value;
    }
  });

  if (store.workflow.currentPhoneDate === "1970-01-01") {
    store.workflow.currentPhoneDate = "";
  }

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

function buildStoreHero(store, manager, installer, electrician, isExpanded, mode = "stores") {
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
        ${buildExtraActorsBoard(store)}
        <p class="intervenants-help">Ajout et modification des intervenants dans l onglet Contacts.</p>
      </article>
      <article class="editor-card store-side-shell">
        ${buildStoreSideSummary(store)}
      </article>
    </div>
  `;
}

function buildStoreDetailForm(store, mode = "stores") {
  const detailContent = mode === "configuration"
    ? `
        ${buildStoreSectionNav("configuration")}

        ${buildPreparationHubCard(store)}

        ${buildConfigurationHubCard(store)}

        <div class="editor-grid section-anchor" id="section-equipment">
          ${buildStorePostsSkeleton(store)}
        </div>

        ${buildEquipmentCards(store)}

        <div class="editor-grid section-anchor" id="section-closing">
          ${buildClosureWorkflowCard(store)}
        </div>
      `
    : `
        ${buildStoreSectionNav("stores")}

        <div class="editor-grid section-anchor" id="section-quantities">
          ${buildStorePilotSkeleton(store)}
        </div>

        ${buildConfigurationSummaryCard(store)}

        <div class="editor-grid section-anchor" id="section-overview">
          ${buildStorePostsSkeleton(store)}
        </div>

        <div class="editor-grid section-anchor" id="section-closing">
          ${buildClosureWorkflowCard(store)}
        </div>

        <div class="editor-grid">
          <article class="editor-card full-span-card">
            <h3>Ligne du temps</h3>
            <p>Chronologie des rendez-vous programmes pour ce magasin.</p>
            ${buildTimeline(store)}
          </article>
        </div>

        <div class="editor-grid section-anchor" id="section-appointments">
          ${buildAppointmentsEditor(store)}
        </div>

        <div class="editor-grid section-anchor" id="section-sav">
          ${buildSavCard(store)}
        </div>

        ${buildStoreDocumentsCard(store)}

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
      `;

  return `
    <div class="details-panel">
      <form class="store-editor" data-store-editor="${store.id}">
        ${detailContent}
        <div class="editor-actions">
          <span class="validation-text" data-validation="${store.id}"></span>
          <button type="button" class="mini-button" data-store-print="${store.id}">Imprimer la fiche complete</button>
          <button type="submit" data-store-submit>Enregistrer ce magasin</button>
        </div>
      </form>
    </div>
  `;
}

function attachStoreInteractiveHandlers() {
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

  projectTableBody.querySelectorAll("[data-sav-create]").forEach((button) => {
    button.addEventListener("click", handleSavCreate);
  });

  projectTableBody.querySelectorAll("[data-sav-update]").forEach((button) => {
    button.addEventListener("click", handleSavUpdate);
  });

  projectTableBody.querySelectorAll("[data-sav-toggle-close]").forEach((button) => {
    button.addEventListener("click", handleSavToggleClose);
  });

  projectTableBody.querySelectorAll("[data-gsm-add]").forEach((button) => {
    button.addEventListener("click", handleGsmAdd);
  });

  projectTableBody.querySelectorAll("[data-open-config-store]").forEach((button) => {
    button.addEventListener("click", () => {
      const storeId = Number(button.getAttribute("data-open-config-store"));
      state.activeAdminTab = "configuration";
      state.expandedStoreIds = new Set([storeId]);
      saveState();
      render();
      window.location.hash = "#section-preparation";
    });
  });

  projectTableBody.querySelectorAll("[data-plan-upload]").forEach((button) => {
    button.addEventListener("click", handleStorePlanUploadTrigger);
  });

  projectTableBody.querySelectorAll("[data-plan-open]").forEach((button) => {
    button.addEventListener("click", handleStorePlanOpen);
  });

  projectTableBody.querySelectorAll("[data-plan-delete]").forEach((button) => {
    button.addEventListener("click", handleStorePlanDelete);
  });

  projectTableBody.querySelectorAll("[data-plan-file]").forEach((input) => {
    input.addEventListener("change", handleStorePlanFileChange);
  });

  projectTableBody.querySelectorAll("[data-store-print]").forEach((button) => {
    button.addEventListener("click", handleStorePrint);
  });
}

function renderStoreCards(stores, mode = "stores") {
  stores.forEach((store) => {
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
          ${buildStoreHero(store, manager, installer, electrician, isExpanded, mode)}
        </div>
      </td>
    `;
    projectTableBody.append(heroRow);

    if (isExpanded) {
      const detailRow = document.createElement("tr");
      detailRow.className = "details-row";
        detailRow.innerHTML = `
          <td colspan="9">
            ${buildStoreDetailForm(store, mode)}
        </td>
      `;
      projectTableBody.append(detailRow);
    }
  });

  attachStoreInteractiveHandlers();
}

function renderStoreOverviewRows(stores, mode = "stores") {
  projectTableBody.innerHTML = "";
  stores.forEach((store) => {
    const isExpanded = state.expandedStoreIds.has(store.id);
    const row = document.createElement("tr");
    if (mode === "stores") {
      const addressBits = [store.address, store.city, store.country].filter(Boolean).join(" - ") || "-";
      const typeAndLicence = [
        store.shopType || "-",
        store.poLicences ? `Licence ${store.poLicences}` : null
      ].filter(Boolean).join("\n");
      const poBits = [
        store.poHpDesk ? `PO HpDesk ${store.poHpDesk}` : null,
        store.poPm ? `PO PM ${store.poPm}` : null
      ].filter(Boolean).join("\n") || "-";
      row.innerHTML = `
        <td>
          <strong>${escapeHtml(store.code)}</strong>
          <div class="cell-note">${escapeHtml(store.shopSize || store.shopType2 || "-")}</div>
        </td>
        <td>
          <strong>${escapeHtml(store.name)}</strong>
          <div class="cell-note">${escapeHtml(addressBits)}</div>
        </td>
        <td>
          ${typeAndLicence.split("\n").map((line, index) => index === 0 ? escapeHtml(line) : `<div class="cell-note">${escapeHtml(line)}</div>`).join("")}
        </td>
        <td>
          ${poBits.split("\n").map((line, index) => index === 0 ? escapeHtml(line) : `<div class="cell-note">${escapeHtml(line)}</div>`).join("")}
        </td>
        <td>
          <strong>${escapeHtml(store.manager || "-")}</strong>
          <div class="cell-note">${escapeHtml(state.people.find((person) => person.name === store.manager)?.phone || store.phone || "-")}</div>
        </td>
        <td>&nbsp;</td>
        <td><span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span></td>
        <td>${escapeHtml(nextActionForStore(store))}</td>
        <td><button type="button" class="mini-button" data-store-toggle="${store.id}">${isExpanded ? "Fermer fiche" : "Voir fiche"}</button></td>
      `;
    } else {
      row.innerHTML = `
        <td>${escapeHtml(store.code)}</td>
        <td><strong>${escapeHtml(store.name)}</strong></td>
        <td>${escapeHtml(store.city || "-")}</td>
        <td>${escapeHtml(store.shopType || "-")}</td>
        <td>${escapeHtml(store.manager || "-")}</td>
        <td>${escapeHtml(state.people.find((person) => person.name === store.manager)?.phone || store.phone || "-")}</td>
        <td><span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span></td>
        <td>${escapeHtml(nextActionForStore(store))}</td>
        <td><button type="button" class="mini-button" data-store-toggle="${store.id}">${isExpanded ? "Fermer fiche" : "Voir fiche"}</button></td>
      `;
    }
    projectTableBody.append(row);

    if (isExpanded) {
      const detailRow = document.createElement("tr");
      detailRow.className = "details-row";
      detailRow.innerHTML = `
        <td colspan="9">
          ${buildStoreDetailForm(store, mode)}
        </td>
      `;
      projectTableBody.append(detailRow);
    }
  });

  attachStoreInteractiveHandlers();
}

function setMainTableHeaders(headers) {
  const ids = ["thDetail", "thStore", "thTwem", "thManager", "thPhone", "thElectrician", "thAppointment", "thStatus", "thIssue"];
  ids.forEach((id, index) => {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = headers[index] || "";
    }
  });
}

function storeQuickActions() {
  return '<div class="cell-stack"><span class="badge badge-done">Voir</span><span class="badge badge-planned">Relancer</span><span class="badge badge-progress">Valider</span></div>';
}

function nextActionForStore(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (store.status === "blocked") return "Deblocage projet";
  if (!workflow.networkConfigConfirmed) return "Validation manager config";
  if (workflow.vlan22Activated !== "Oui") return "Validation IT / VLAN22";
  if (workflow.destinyInstallDone !== "Oui") return "Installation Destiny";
  return workflow.ltSwitchStatus === "Basculee" ? "RUN / SAV" : "Bascule plateforme";
}

function currentWorkflowStage(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (store.status === "blocked") return "Blocage chantier";
  if (!workflow.networkConfigConfirmed) return "Collecte infos";
  if (workflow.vlan22Activated !== "Oui") return "Validation IT";
  if (workflow.charlesRouxStatus !== "OK") return "Validation Infra";
  if (workflow.networkSurveyStatus !== "OK") return "Pre-visite";
  if (workflow.destinyInstallDone !== "Oui") return "Installation";
  if (workflow.ltSwitchStatus === "Basculee") return "RUN";
  return "A lancer";
}

function renderCompactStoreRows(stores, mapper) {
  projectTableBody.innerHTML = stores.map((store, index) => {
    const cells = mapper(store, index);
    return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
  }).join("");
}

function renderTimelineRows(stores) {
  setMainTableHeaders(["Code magasin", "Magasin", "Ville", "Type", "Plateforme actuelle", "Date telephonie", "Etape actuelle", "Date etape", "Statut"]);
  const rows = stores.map((store) => {
    const workflow = ensureStoreWorkflowData(store);
    const timelineSteps = [
      {
        date: workflow.currentPhoneDate || "15/03/2021",
        label: "Telephonie actuelle",
        status: workflow.currentPhoneDate ? "done" : "planned",
        note: workflow.currentPlatform || "A confirmer"
      },
      {
        date: workflow.collectDate || formatDateTime(store.updatedAt).split(" ")[0],
        label: "Collecte",
        status: store.status === "planned" ? "in_progress" : "done",
        note: "Collecte infos magasin"
      },
      {
        date: workflow.itValidationDate || formatDateTime(store.updatedAt).split(" ")[0],
        label: "IT",
        status: workflow.vlan22Activated === "Oui" ? "done" : (store.status === "blocked" ? "blocked" : "in_progress"),
        note: "Validation reseau / VLAN"
      },
      {
        date: workflow.previsitDate || "A confirmer",
        label: "Pre-visite",
        status: workflow.networkSurveyStatus === "OK" ? "done" : "planned",
        note: workflow.networkSurveyStatus || "A planifier"
      },
      {
        date: workflow.destinyInstallDate || "A confirmer",
        label: "Install",
        status: workflow.destinyInstallDone === "Oui" ? "done" : (store.status === "in_progress" ? "in_progress" : "planned"),
        note: workflow.destinyPmName || "Intervention prevue"
      },
      {
        date: workflow.transferDate || workflow.destinyInstallDate || "A confirmer",
        label: "Transfert",
        status: workflow.ltSwitchStatus === "Basculee" ? "done" : "planned",
        note: workflow.targetPlatform || "TELEPO"
      }
    ];

    return `
      <tr>
        <td colspan="9">
          <article class="timeline-store">
            <div class="timeline-store-head">
              <div>
                <h3>${escapeHtml(store.name)} - ${escapeHtml(store.code)} - ${escapeHtml(store.manager || store.owner || "-")}</h3>
                <div class="timeline-meta">
                  <span>${escapeHtml(store.city)}</span>
                  <span>${escapeHtml(store.shopType || "-")}</span>
                  <span>Actuelle: ${escapeHtml(workflow.currentPlatform || "Destiny")}</span>
                  <span>Cible: ${escapeHtml(workflow.targetPlatform || "TELEPO")}</span>
                </div>
              </div>
              <span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span>
            </div>
            <div class="timeline-strip">
              ${timelineSteps.map((step) => `
                <button type="button" class="timeline-step" data-timeline-open="${store.id}">
                  <div class="timeline-dot ${escapeHtml(step.status)}"></div>
                  <div class="timeline-step-date">${escapeHtml(step.date || "A confirmer")}</div>
                  <div class="timeline-step-name">${escapeHtml(step.label)}</div>
                  <div class="timeline-step-note">${escapeHtml(step.note || "")}</div>
                </button>
              `).join("")}
            </div>
          </article>
        </td>
      </tr>
    `;
  }).join("");

  projectTableBody.innerHTML = rows;
  projectTableBody.querySelectorAll("[data-timeline-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const storeId = Number(button.getAttribute("data-timeline-open"));
      state.activeAdminTab = "stores";
      state.expandedStoreIds = new Set([storeId]);
      render();
    });
  });
}

function renderDashboardRows(stores) {
  setMainTableHeaders(["Code", "Magasin", "Ville", "Type", "Responsable", "Telephone", "Statut", "Prochaine action", "Actions"]);
  renderCompactStoreRows(stores, (store) => [
    escapeHtml(store.code),
    `<strong>${escapeHtml(store.name)}</strong>`,
    escapeHtml(store.city),
    escapeHtml(store.shopType || "-"),
    escapeHtml(store.manager || "-"),
    escapeHtml(state.people.find((person) => person.name === store.manager)?.phone || "-"),
    `<span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span>`,
    escapeHtml(nextActionForStore(store)),
    `<button type="button" class="mini-button" data-dashboard-open="${store.id}">Voir la fiche</button>`
  ]);

  projectTableBody.querySelectorAll("[data-dashboard-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const storeId = Number(button.getAttribute("data-dashboard-open"));
      state.activeAdminTab = "stores";
      state.expandedStoreIds = new Set([storeId]);
      render();
    });
  });
}

function renderActivitiesRows(stores) {
  setMainTableHeaders(["Code", "Magasin", "Activite", "Responsable", "Priorite", "SLA", "Etat", "Historique", "Action"]);
  renderCompactStoreRows(stores, (store) => {
    const lastActivity = state.activities.find((activity) => activity.storeName === store.name);
    return [
      escapeHtml(store.code),
      `<strong>${escapeHtml(store.name)}</strong>`,
      escapeHtml(lastActivity?.comment || currentWorkflowStage(store)),
      escapeHtml(lastActivity?.confirmedBy || store.owner),
      store.status === "blocked" ? '<span class="badge badge-blocked">Urgent</span>' : '<span class="badge badge-progress">Normal</span>',
      store.status === "blocked" ? "J+1" : "J+3",
      `<span class="${badgeClass(lastActivity?.result === "issue" ? "blocked" : store.status)}">${escapeHtml(lastActivity?.result === "issue" ? "Probleme" : statusLabel(store.status))}</span>`,
      escapeHtml(formatDateTime(lastActivity?.createdAt || store.updatedAt)),
      `<span class="cell-note">${escapeHtml(nextActionForStore(store))}</span>`
    ];
  });
}

function renderDeploymentRows(stores) {
  setMainTableHeaders(["Code", "Magasin", "Phase", "Pre-visite", "Install", "Destiny", "Blocage", "GO / NO GO", "Action"]);
  renderCompactStoreRows(stores, (store) => {
    const workflow = ensureStoreWorkflowData(store);
    const goNoGo = workflow.vlan22Activated === "Oui" && workflow.charlesRouxStatus === "OK" && store.status !== "blocked";
    return [
      escapeHtml(store.code),
      `<strong>${escapeHtml(store.name)}</strong>`,
      escapeHtml(currentWorkflowStage(store)),
      escapeHtml(workflow.mobileCheckStatus || "-"),
      escapeHtml(workflow.destinyInstallDone || "Non"),
      escapeHtml(workflow.destinyTicketRef || "-"),
      `<span class="cell-note">${escapeHtml(store.health || "-")}</span>`,
      goNoGo ? '<span class="badge badge-done">GO</span>' : '<span class="badge badge-blocked">NO GO</span>',
      escapeHtml(nextActionForStore(store))
    ];
  });
}

function renderMigrationRows(stores) {
  setMainTableHeaders(["Code", "Magasin", "Actuelle", "Cible", "Date transfert", "Etape", "Statut", "Risque", "Action"]);
  renderCompactStoreRows(stores, (store) => {
    const workflow = ensureStoreWorkflowData(store);
    return [
      escapeHtml(store.code),
      `<strong>${escapeHtml(store.name)}</strong>`,
      escapeHtml(workflow.currentPlatform || "Destiny"),
      escapeHtml(workflow.targetPlatform || "TELEPO"),
      escapeHtml(workflow.destinyInstallDate || "-"),
      escapeHtml(currentWorkflowStage(store)),
      `<span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span>`,
      escapeHtml(store.status === "blocked" ? "Eleve" : store.status === "in_progress" ? "Moyen" : "Faible"),
      escapeHtml(nextActionForStore(store))
    ];
  });
}

function renderSavRows() {
  setMainTableHeaders(["Code", "Magasin", "Ticket", "Demandeur", "Service", "Ouverture", "Etat", "Dernier suivi", "Action"]);
  const filteredTickets = getFilteredTickets();

  if (!filteredTickets.length) {
    projectTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">Aucun ticket SAV ne correspond aux filtres.</td></tr>';
    return;
  }

  projectTableBody.innerHTML = filteredTickets.map((ticket) => {
    const store = state.stores.find((item) => item.id === ticket.storeId);
    const latestUpdate = [...(ticket.updates || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    return `
      <tr>
        <td>${escapeHtml(ticket.storeCode || store?.code || "-")}</td>
        <td><strong>${escapeHtml(ticket.storeName || store?.name || "-")}</strong></td>
        <td>
          <div class="cell-stack">
            <strong>${escapeHtml(ticket.id)}</strong>
            <span class="cell-note">${escapeHtml(ticket.concern || "-")}</span>
          </div>
        </td>
        <td>${escapeHtml(ticket.requesterName || "-")}</td>
        <td>${escapeHtml(ticket.targetService || "-")}</td>
        <td>${escapeHtml(formatDateTime(ticket.createdAt))}</td>
        <td><span class="${ticketBadgeClass(ticket.status)}">${escapeHtml(ticketStatusLabel(ticket.status))}</span></td>
        <td>${escapeHtml(latestUpdate ? `${formatDateTime(latestUpdate.createdAt)} - ${latestUpdate.authorName}` : "Demande initiale")}</td>
        <td>
          <div class="sav-table-actions">
            <button type="button" class="mini-button" data-sav-open-store="${ticket.storeId}">Voir fiche</button>
            <select class="sav-inline-select" data-sav-row-status="${ticket.id}">
              ${renderOptions(ticketStatusOptions, ticket.status)}
            </select>
            <button type="button" class="mini-button" data-sav-row-apply="${ticket.id}">Mettre a jour</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  projectTableBody.querySelectorAll("[data-sav-open-store]").forEach((button) => {
    button.addEventListener("click", () => {
      const storeId = Number(button.getAttribute("data-sav-open-store"));
      state.activeAdminTab = "stores";
      state.expandedStoreIds = new Set([storeId]);
      saveState();
      render();
    });
  });

  projectTableBody.querySelectorAll("[data-sav-row-apply]").forEach((button) => {
    button.addEventListener("click", handleSavRowStatusUpdate);
  });
}

function renderExtensionsRows(stores) {
  setMainTableHeaders(["Categorie", "Modele", "Numero", "Libelle", "Langue", "Item", "Activation", "Ancien", "Usage"]);
  const filteredExtensions = extensionCatalogRows.filter((row) => {
    const search = state.filters.search;
    if (!search) {
      return true;
    }
    const haystack = `${row.category} ${row.model} ${row.number} ${row.label} ${row.language} ${row.item} ${row.activation} ${row.oldNumber || ""} ${row.usage || ""}`.toLowerCase();
    return haystack.includes(search);
  });

  if (!filteredExtensions.length) {
    projectTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">Aucune extension ne correspond a la recherche.</td></tr>';
    return;
  }

  projectTableBody.innerHTML = `
    <tr>
      <td colspan="9">
        <article class="extensions-store">
          <div class="extensions-store-head">
            <h3>Reference complete des extensions disponibles</h3>
            <span class="cell-note">${filteredExtensions.length} ligne(s) du tableau ConfigVoIPExt</span>
          </div>
          <div class="extensions-store-body">
            <table class="extensions-table">
              <thead>
                <tr>
                  <th>Categorie</th>
                  <th>Modele</th>
                  <th>Numero</th>
                  <th>Libelle / lieu</th>
                  <th>Langue</th>
                  <th>Item</th>
                  <th>Activation</th>
                  <th>Ancien n°</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                ${filteredExtensions.map((row) => `
                  <tr>
                    <td>${escapeHtml(row.category || "-")}</td>
                    <td>${escapeHtml(row.model || "-")}</td>
                    <td><strong>${escapeHtml(row.number || "-")}</strong></td>
                    <td>${escapeHtml(row.label || "-")}</td>
                    <td>${escapeHtml(row.language || "-")}</td>
                    <td>${escapeHtml(row.item || "-")}</td>
                    <td>${escapeHtml(row.activation || "-")}</td>
                    <td>${escapeHtml(row.oldNumber || "-")}</td>
                    <td>${escapeHtml(row.usage || "-")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </article>
      </td>
    </tr>
  `;
}

const ticketStatusOptions = [
  { value: "open", label: "Ouvert" },
  { value: "in_progress", label: "En cours" },
  { value: "closed", label: "Cloture" }
];

function ticketStatusLabel(status) {
  const labels = {
    open: "Ouvert",
    in_progress: "En cours",
    closed: "Cloture"
  };
  return labels[status] || status;
}

function ticketBadgeClass(status) {
  const map = {
    open: "badge badge-planned",
    in_progress: "badge badge-progress",
    closed: "badge badge-done"
  };
  return map[status] || "badge badge-planned";
}

function ticketsForStore(storeId) {
  return state.tickets
    .filter((ticket) => String(ticket.storeId) === String(storeId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getFilteredTickets() {
  const visibleStoreIds = new Set(getFilteredStores().map((store) => String(store.id)));
  const search = state.filters.search;
  return state.tickets
    .filter((ticket) => visibleStoreIds.has(String(ticket.storeId)))
    .filter((ticket) => {
      if (!search) {
        return true;
      }
      const haystack = [
        ticket.storeCode,
        ticket.storeName,
        ticket.requesterName,
        ticket.targetService,
        ticket.concern,
        ticket.initialNote,
        ...(ticket.updates || []).map((update) => `${update.authorName} ${update.note}`)
      ].join(" ").toLowerCase();
      return haystack.includes(search);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function buildSavCard(store) {
  const storeTickets = ticketsForStore(store.id);
  const requesterName = currentUser()?.name || state.activeUserName || store.manager || "-";
  return `
    <article class="editor-card full-span-card sav-ticket-card" data-access-zone="sav_ticket">
      <h3>Demande SAV / ticket</h3>
      <p>Tout acteur du magasin peut creer une demande. La demande initiale reste intacte, puis le suivi se fait juste en dessous avec historique date et signe.</p>
      <div class="sav-split">
        <div>
          <div class="three-col sav-request-grid">
            <label>
              <span>N de magasin</span>
              <input type="text" value="${escapeHtml(store.code)}" readonly>
            </label>
            <label>
              <span>Nom du magasin</span>
              <input type="text" value="${escapeHtml(store.name)}" readonly>
            </label>
            <label>
              <span>Demandeur</span>
              <input type="text" value="${escapeHtml(requesterName)}" readonly>
            </label>
          </div>

          <div class="two-col">
            <label>
              <span>Service a mobiliser</span>
              <select name="new_ticket_service">
                ${renderOptions(["TWEM", "Destiny", "IT", "Infra", "Magasin", "Autre"], "Destiny")}
              </select>
            </label>
            <label>
              <span>Ce que ca concerne</span>
              <input type="text" name="new_ticket_concern" placeholder="Ex: poste caisse, GSM, transfert, VLAN, accueil">
            </label>
          </div>

          <label>
            <span>Note explicative libre</span>
            <textarea name="new_ticket_note" rows="4" placeholder="Decris le probleme, le besoin ou le contexte de la demande SAV"></textarea>
          </label>

          <div class="editor-actions sav-request-actions">
            <span class="validation-text" data-sav-feedback="${store.id}"></span>
            <button type="button" data-sav-create="${store.id}">Confirmer / envoyer</button>
          </div>
        </div>

        <aside class="sav-current-card">
          <h4>SAV du magasin</h4>
          <div class="sav-history-stack">
            ${storeTickets.length ? storeTickets.map((ticket) => buildTicketThread(store, ticket)).join("") : '<div class="empty-state sav-empty">Aucun ticket SAV pour ce magasin pour le moment.</div>'}
          </div>
        </aside>
      </div>
    </article>
  `;
}

function buildTicketThread(store, ticket) {
  const updates = [...(ticket.updates || [])].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return `
    <article class="sav-thread-card">
      <div class="sav-thread-head">
        <div>
          <strong>${escapeHtml(ticket.id)} - ${escapeHtml(ticket.concern || "Sans objet")}</strong>
          <div class="cell-note">Demande initiale par ${escapeHtml(ticket.requesterName || "-")} le ${escapeHtml(formatDateTime(ticket.createdAt))} - ${escapeHtml(ticket.targetService || "Service a definir")}</div>
        </div>
        <span class="${ticketBadgeClass(ticket.status)}">${escapeHtml(ticketStatusLabel(ticket.status))}</span>
      </div>

      <div class="sav-thread-request">
        <div class="sav-thread-label">Demande initiale</div>
        <div class="sav-thread-box">${escapeHtml(ticket.initialNote || "-")}</div>
      </div>

      <div class="sav-thread-updates">
        <div class="sav-thread-label">Historique de traitement</div>
        ${updates.length ? updates.map((update) => `
          <div class="sav-update-item">
            <div class="sav-update-meta">${escapeHtml(update.authorName || "-")} - ${escapeHtml(formatDateTime(update.createdAt))}</div>
            <div class="sav-thread-box">${escapeHtml(update.note || "-")}</div>
          </div>
        `).join("") : '<div class="empty-state sav-empty">Aucun suivi ajoute pour le moment.</div>'}
      </div>

      <div class="sav-thread-actions">
        <label class="sav-thread-note">
          <span>Nouveau suivi</span>
          <textarea name="ticket_update_note_${ticket.id}" rows="3" placeholder="Ajoute ici le suivi, la reponse, la correction ou l etat d avancement"></textarea>
        </label>
        <div class="sav-thread-control">
          <label>
            <span>Statut du ticket</span>
            <select name="ticket_status_${ticket.id}">
              ${renderOptions(ticketStatusOptions, ticket.status)}
            </select>
          </label>
          <div class="sav-thread-buttons">
            <button type="button" class="mini-button" data-sav-update="${ticket.id}" data-sav-store="${store.id}">Ajouter le suivi</button>
            <button type="button" class="mini-button" data-sav-toggle-close="${ticket.id}" data-sav-store="${store.id}">
              ${ticket.status === "closed" ? "Reouvrir" : "Cloturer"}
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderStores() {
  const stores = getFilteredStores();
  projectTableBody.innerHTML = "";
  const projectTable = document.querySelector(".project-table");

  if (!stores.length) {
    projectTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">Aucun magasin ne correspond aux filtres.</td></tr>';
    return;
  }

  switch (activeMainWorkspaceTab()) {
    case "timeline":
      projectTable?.classList.add("compact-rows-table");
      renderTimelineRows(stores);
      return;
    case "sav":
      projectTable?.classList.add("compact-rows-table");
      renderSavRows(stores);
      return;
    case "extensions":
      projectTable?.classList.add("compact-rows-table");
      renderExtensionsRows(stores);
      return;
    case "dashboard":
      projectTable?.classList.add("compact-rows-table");
      renderDashboardRows(stores);
      return;
    case "configuration":
      projectTable?.classList.add("compact-rows-table");
      setMainTableHeaders(["Code", "Magasin", "Ville", "Type", "Responsable", "Telephone", "Statut", "Prochaine action", "Actions"]);
      renderStoreOverviewRows(stores, "configuration");
      return;
      case "stores":
      default:
        projectTable?.classList.add("compact-rows-table");
        setMainTableHeaders(["Code", "Magasin", "Type / licence", "PO / PM", "Responsable / tel", "", "Statut", "Prochaine action", "Actions"]);
        renderStoreOverviewRows(stores, "stores");
    }
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
        <span class="report-store-title">${escapeHtml(group.storeName)}</span>
        <span class="report-store-meta">${group.entries.length} remontee(s)</span>
        <button type="button" class="mini-button report-export-button" data-report-export="${escapeHtml(group.storeName)}">Exporter PDF</button>
      </summary>
      <div class="report-store-body">
        ${group.entries.map((entry) => `
          <article class="report-entry">
            <div class="report-entry-meta">
              <span class="${badgeClass(entry.result)}">${entry.result === "issue" ? "Probleme" : "OK"}</span>
              <span>${escapeHtml(formatDateTime(entry.createdAt))}</span>
            </div>
            <div class="report-entry-author">${escapeHtml(entry.confirmedBy)}</div>
            <div class="report-entry-text">${escapeHtml(entry.comment)}</div>
          </article>
        `).join("")}
      </div>
    `;
    reportArchiveList.append(details);
  });

  reportArchiveList.querySelectorAll("[data-report-export]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const storeName = button.getAttribute("data-report-export");
      const group = groupedByStore.find((entry) => entry.storeName === storeName);
      if (group) {
        exportStoreReportPdf(group);
      }
    });
  });
}

function automationCategoryLabel(category) {
  const isNl = state.language === "nl";
  const labels = {
    notifications: isNl ? "Notificaties" : "Notifications",
    access: isNl ? "Toegang" : "Acces utilisateurs",
    followup: isNl ? "Herinneringen / escalaties" : "Relances / escalades"
  };
  return labels[category] || category;
}

function renderAutomations() {
  if (!automationOverview || !automationList || !automationFutureList) {
    return;
  }

  const activeCount = state.automations.filter((item) => item.active).length;
  const escalationCount = state.automations.filter((item) => Number(item.repeatHours || 0) > 0 || Number(item.escalationHours || 0) > 0).length;
  const mailCount = state.automations.filter((item) => String(item.channels || "").toLowerCase().includes("mail")).length;

  automationOverview.innerHTML = `
    <article class="automation-stat">
      <strong>${activeCount}</strong>
      <span>${state.language === "nl" ? "actief" : "actives"}</span>
    </article>
    <article class="automation-stat">
      <strong>${mailCount}</strong>
      <span>${state.language === "nl" ? "mails" : "mails"}</span>
    </article>
    <article class="automation-stat">
      <strong>${escalationCount}</strong>
      <span>${state.language === "nl" ? "escalaties" : "escalades"}</span>
    </article>
  `;

  const categories = ["notifications", "access", "followup"];
  automationList.innerHTML = categories.map((category) => {
    const items = state.automations.filter((entry) => entry.category === category);
    return `
      <section class="automation-group">
        <div class="automation-group-head">
          <div>
            <h4>${escapeHtml(automationCategoryLabel(category))}</h4>
            <p>${escapeHtml(category === "followup"
              ? "Suivi des actions attendues, rappels et escalades."
              : category === "access"
                ? "Acces utilisateur, PIN et communication de bienvenue."
                : "Mails et alertes relies a la vie d un magasin.")}</p>
          </div>
        </div>
        <div class="automation-cards">
          ${items.map((item) => `
            <article class="automation-card">
              <div class="automation-card-head">
                <div>
                  <h5>${escapeHtml(item.title)}</h5>
                  <p>${escapeHtml(item.description)}</p>
                </div>
                <label class="automation-switch">
                  <input type="checkbox" data-automation-id="${escapeHtml(item.id)}" data-automation-field="active" ${item.active ? "checked" : ""}>
                  <span>${item.active ? (state.language === "nl" ? "Actief" : "Active") : (state.language === "nl" ? "Uit" : "Inactive")}</span>
                </label>
              </div>
              <div class="automation-grid">
                <label class="automation-field automation-field-wide">
                  <span>${state.language === "nl" ? "Trigger" : "Declencheur"}</span>
                  <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="trigger" value="${escapeHtml(item.trigger)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Ontvangers" : "Destinataires"}</span>
                  <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="recipients" value="${escapeHtml(item.recipients)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Kanaal" : "Canal"}</span>
                  <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="channels" value="${escapeHtml(item.channels)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Lien cible" : "Lien cible"}</span>
                  <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="linkTarget" value="${escapeHtml(item.linkTarget)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Taal" : "Langue"}</span>
                  <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="languageMode" value="${escapeHtml(item.languageMode)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Herinnering (u)" : "Relance (h)"}</span>
                  <input type="number" min="0" step="1" data-automation-id="${escapeHtml(item.id)}" data-automation-field="responseDelayHours" value="${escapeHtml(item.responseDelayHours)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Escalatie (u)" : "Escalade (h)"}</span>
                  <input type="number" min="0" step="1" data-automation-id="${escapeHtml(item.id)}" data-automation-field="escalationHours" value="${escapeHtml(item.escalationHours)}">
                </label>
                <label class="automation-field">
                  <span>${state.language === "nl" ? "Herhaling (u)" : "Repetition (h)"}</span>
                  <input type="number" min="0" step="1" data-automation-id="${escapeHtml(item.id)}" data-automation-field="repeatHours" value="${escapeHtml(item.repeatHours)}">
                </label>
                <label class="automation-field automation-field-wide">
                  <span>${state.language === "nl" ? "Regel / note" : "Regle / note"}</span>
                  <textarea rows="3" data-automation-id="${escapeHtml(item.id)}" data-automation-field="notes">${escapeHtml(item.notes)}</textarea>
                </label>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");

  automationFutureList.innerHTML = futureAutomationIdeas.map((item) => `
    <article class="automation-future-item">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.description)}</span>
    </article>
  `).join("");
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

      const remainingTwem = state.people.filter((person) => person.role === "supadmin_twem");
      if (target.role === "supadmin_twem" && remainingTwem.length <= 1) {
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

      if (hasRemoteData()) {
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
  const roleStackSummary = document.querySelector("#roleStackSummary");
  if (roleStackSummary) {
    roleStackSummary.textContent = `Voir les roles (${state.roleOptions.length})`;
  }

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
          <div class="role-row role-row-editable">
            <input type="text" name="role" value="${escapeHtml(role)}" aria-label="Role">
            <div class="role-actions">
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
      if (hasRemoteData()) {
        await syncSettingsToRemote();
        await loadRemoteState();
      }
      saveState();
      render();
    });
  });
}

function renderImportExportHistory() {
  if (!importExportHistoryList || !importExportHistoryMeta) {
    return;
  }

  const compactHistory = cleanImportHistory(state.importExportHistory);
  const count = compactHistory.length;
  importExportHistoryMeta.textContent = count
    ? `${count} operation(s) memorisee(s)`
    : "Aucune operation pour le moment.";

  if (!count) {
    importExportHistoryList.innerHTML = '<div class="empty-state">Aucun import ou export enregistre.</div>';
    return;
  }

  importExportHistoryList.innerHTML = compactHistory.map((item) => `
    <article class="simple-item import-history-item">
      <div class="import-history-top">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(formatDateTime(item.createdAt))}</span>
      </div>
      <div class="import-history-meta">
        <span class="${item.type === "export" ? "status-pill pill-done" : "status-pill pill-progress"}">${item.type === "export" ? "Export" : "Import"}</span>
        <span>${escapeHtml(item.author)}</span>
      </div>
      <div class="cell-note">${escapeHtml(item.detail || "-")}</div>
    </article>
  `).join("");
}

function handleAutomationFieldChange(event) {
  const target = event.target;
  const automationId = target?.getAttribute?.("data-automation-id");
  const field = target?.getAttribute?.("data-automation-field");
  if (!automationId || !field) {
    return;
  }

  const item = state.automations.find((entry) => entry.id === automationId);
  if (!item) {
    return;
  }

  if (target.type === "checkbox") {
    item[field] = target.checked;
  } else if (target.type === "number") {
    item[field] = Number(target.value || 0);
  } else {
    item[field] = target.value;
  }

  saveState();
  if (field === "active") {
    renderAutomations();
  }
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
          : state.connectionState === "connected"
            ? "Connecte"
          : appwriteAccount
            ? "Auth configuree"
            : "Configuration requise")
      : t("local");
  const user = currentUser();
  syncMessage.textContent = user?.role === "manager"
    ? "Vue complete de votre magasin avec zones modifiables selon vos droits."
    : "Suivi partage en direct entre planning chantier, rendez-vous, remontees et rapports.";
}

function renderPinGate() {
  const user = currentUser();
  const bypassActive = presentationBypassUsers.includes(state.activeUserName) || presentationBypassUsers.includes(user?.name || "");
  pinGate?.classList.toggle("hidden-panel", state.pinValidated || bypassActive);
  if (pinFeedback && !state.pinValidated) {
    pinFeedback.textContent = user ? `Dernier profil charge: ${user.name}` : "";
  }
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

  const availableTabs = accessibleTabsForUser();
  const sidebarVisible = state.pinValidated && (
    availableTabs.includes("*") || availableTabs.some((tab) => tab !== "dashboard")
  );
  const debugViewVisible = canShowRoleReturn();

  workspaceSidebar.classList.toggle("hidden-panel", !sidebarVisible);
  workspaceShell?.classList.toggle("without-sidebar", !sidebarVisible);
  if (quickReturnViewButton) {
    quickReturnViewButton.classList.toggle("hidden-panel", !debugViewVisible);
  }
  if (userViewField) {
    userViewField.classList.toggle("hidden-panel", !debugViewVisible);
  }
  if (resetUserViewButton) {
    resetUserViewButton.classList.toggle("hidden-panel", !debugViewVisible);
  }

  const targetPanel = panelForTab(state.activeAdminTab);
  twemWorkspace.classList.toggle("hidden-panel", !sidebarVisible || targetPanel === "dashboard");
}

function renderAdminTabs() {
  const user = currentUser();
  const debugViewVisible = canUseRoleSimulation();
  const canKeepCurrentTab = state.activeAdminTab === "visibility" ? debugViewVisible : canAccessTab(state.activeAdminTab, user);
  if (!canKeepCurrentTab || ![...mainWorkspaceTabs, "contacts", "reports", "automations", "tools", "pin-access", "import-export", "visibility"].includes(state.activeAdminTab)) {
    state.activeAdminTab = "dashboard";
  }
  adminTabs.querySelectorAll("[data-admin-tab]").forEach((button) => {
    const tab = button.getAttribute("data-admin-tab");
    const visible = state.pinValidated && (tab === "visibility" ? debugViewVisible : canAccessTab(tab, user));
    button.classList.toggle("hidden-panel", !visible);
    button.classList.toggle("is-active", visible && tab === state.activeAdminTab);
    button.textContent = tabTitle(tab);
  });

  const targetPanel = panelForTab(state.activeAdminTab);
  document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.getAttribute("data-admin-panel") === targetPanel);
  });

  document.querySelectorAll(".workspace-view").forEach((panel) => {
    panel.classList.toggle("is-active", panel.getAttribute("data-admin-panel") === targetPanel);
  });

  const planningTitleNode = document.getElementById("planningTitle");
  if (planningTitleNode) {
    planningTitleNode.textContent = tabTitle(state.activeAdminTab);
  }
}

function fillPinAccessForm(person) {
  if (!pinAccessForm || !person) {
    return;
  }
  pinAccessForm.dataset.editPersonId = person.id;
  pinPersonNameInput.value = person.name || "";
  pinRoleSelect.value = person.role || "manager";
  pinCodeInput.value = person.pin || "";
  pinExpiryInput.value = person.pinExpiresAt || "";
  pinStatusSelect.value = person.pinStatus || "active";
  [...pinStoreMultiSelect.options].forEach((option) => {
    option.selected = (person.allowedStoreCodes || []).includes(option.value) || (person.allowedStoreCodes || []).includes("*");
  });
}

function syncPinAccessFromSelectedPerson() {
  const name = pinPersonNameInput?.value.trim().toLowerCase();
  if (!name) {
    return;
  }
  const person = state.people.find((entry) => entry.name.toLowerCase() === name);
  if (!person) {
    return;
  }
  fillPinAccessForm(person);
}

function filterPinStoreOptions() {
  if (!pinStoreMultiSelect || !pinStoreSearchInput) {
    return;
  }
  const search = pinStoreSearchInput.value.trim().toLowerCase();
  [...pinStoreMultiSelect.options].forEach((option) => {
    const store = state.stores.find((entry) => entry.code === option.value);
    const label = `${store?.name || ""} ${store?.code || option.value} ${store?.city || ""}`.toLowerCase();
    option.hidden = Boolean(search) && !label.includes(search);
  });
}

function renderPinAccessList() {
  if (!pinAccessList) {
    return;
  }

  const visibleRows = state.people
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  if (!visibleRows.length) {
    pinAccessList.innerHTML = '<div class="empty-state">Aucun acces PIN configure.</div>';
    return;
  }

  pinAccessList.innerHTML = visibleRows.map((person) => {
    const stores = person.allowedStoreCodes?.includes("*")
      ? "Tous les magasins"
      : (person.allowedStoreCodes?.length ? person.allowedStoreCodes.join(", ") : (person.storeCode || "-"));
    const lastSeen = person.loginHistory?.length ? formatDateTime(person.loginHistory[0].at) : "Jamais";
    return `
      <div class="simple-item person-row">
        <div>
          <strong>${escapeHtml(person.name)}</strong>
          <div class="override-meta">${escapeHtml(roleLabel(person.role))}</div>
        </div>
        <div>
          <strong>${escapeHtml(person.pin || "------")}</strong>
          <div class="override-meta">PIN</div>
        </div>
        <div>
          <strong>${escapeHtml(person.pinStatus || "active")}</strong>
          <div class="override-meta">Statut</div>
        </div>
        <div>
          <strong>${escapeHtml(stores)}</strong>
          <div class="override-meta">Magasins</div>
        </div>
        <div>
          <strong>${escapeHtml(person.pinExpiresAt || "-")}</strong>
          <div class="override-meta">Expiration</div>
        </div>
        <div>
          <strong>${escapeHtml(lastSeen)}</strong>
          <div class="override-meta">Derniere connexion</div>
        </div>
        <div class="person-row-actions">
          <button type="button" class="mini-button" data-pin-edit="${escapeHtml(person.id)}">Modifier</button>
          <button type="button" class="mini-button" data-pin-disable="${escapeHtml(person.id)}">Desactiver</button>
        </div>
      </div>
    `;
  }).join("");

  pinAccessList.querySelectorAll("[data-pin-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const person = state.people.find((entry) => entry.id === button.getAttribute("data-pin-edit"));
      fillPinAccessForm(person);
    });
  });

  pinAccessList.querySelectorAll("[data-pin-disable]").forEach((button) => {
    button.addEventListener("click", async () => {
      const person = state.people.find((entry) => entry.id === button.getAttribute("data-pin-disable"));
      if (!person) return;
      person.pinStatus = "disabled";
      if (hasRemoteData()) {
        await syncPersonToRemote(person);
        await loadRemoteState();
      }
      saveState();
      render();
    });
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
    checkbox.addEventListener("change", async () => {
      const id = checkbox.getAttribute("data-tool-toggle");
      const item = state.toolItems.find((entry) => entry.id === id);
      if (!item) {
        return;
      }
      item.done = checkbox.checked;
      if (hasRemoteData()) {
        await syncSettingsToRemote();
      }
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
    status_admin: "Statut global",
    sav_ticket: "SAV / tickets"
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
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-override-remove");
      state.accessOverrides = state.accessOverrides.filter((entry) => entry.id !== id);
      if (hasRemoteData()) {
        await syncSettingsToRemote();
      }
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
  remoteSyncSuppressed = true;
  try {
  if (supabaseClient) {
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
    state.roleOptions = normalizedRoleOptions(rolesResult.data.map((role) => role.name));

    const { data: authData } = await supabaseClient.auth.getSession();
    const sessionPerson = roleValueFromSession(authData.session);
    if (sessionPerson) {
      state.activeUserName = sessionPerson.name;
    } else if (!state.people.some((person) => person.name === state.activeUserName)) {
      state.activeUserName = state.people.find((person) => person.role === "supadmin_twem")?.name || state.people[0]?.name || "";
    }

    saveState();
    refreshRemoteSyncShadow();
    return;
  }

  if (!hasAppwriteDataConfig) {
    return;
  }

  const [
    storeDocuments,
    peopleDocuments,
    activityDocuments,
    settingsDocuments,
    ticketDocuments
  ] = await Promise.all([
    listAllAppwriteDocuments(appwriteStoresCollectionId, appwriteQuery ? [appwriteQuery.orderAsc("code")] : []),
    listAllAppwriteDocuments(appwritePeopleCollectionId, appwriteQuery ? [appwriteQuery.orderAsc("name")] : []),
    listAllAppwriteDocuments(appwriteActivitiesCollectionId, appwriteQuery ? [appwriteQuery.orderDesc("created_at")] : []),
    listAllAppwriteDocuments(appwriteSettingsCollectionId),
    listAllAppwriteDocuments(appwriteTicketsCollectionId, appwriteQuery ? [appwriteQuery.orderDesc("created_at")] : [])
  ]);

  state.stores = storeDocuments.length
    ? storeDocuments.map(normalizeAppwriteStore)
    : (state.stores.length ? state.stores : clone(demoStores));
  state.activities = activityDocuments.length
    ? activityDocuments.map(normalizeAppwriteActivity)
    : (state.activities.length ? state.activities : clone(demoActivities));
  state.people = peopleDocuments.length
    ? mergePeopleWithPinFallback(peopleDocuments.map(normalizeAppwritePerson))
    : (state.people.length ? mergePeopleWithPinFallback(state.people) : demoPinPeople());
  state.tickets = ticketDocuments.length
    ? stripKnownTestTickets(ticketDocuments.map(normalizeAppwriteTicket))
    : [];

  const settingsDocument = settingsDocuments.find((document) => document.$id === "global-state") || settingsDocuments[0];
  if (settingsDocument) {
    state.roleOptions = normalizedRoleOptions(parseJsonField(settingsDocument.role_options_json, []));
    state.toolItems = parseJsonField(settingsDocument.tool_items_json, []);
    state.accessOverrides = parseJsonField(settingsDocument.access_overrides_json, []);
  } else {
    state.roleOptions = state.roleOptions?.length ? normalizedRoleOptions(state.roleOptions) : [...defaultRoleOptions];
    state.toolItems = state.toolItems || [];
    state.accessOverrides = state.accessOverrides || [];
  }

  if (!state.people.some((person) => person.name === state.activeUserName)) {
    state.activeUserName = state.people.find((person) => person.role === "supadmin_twem")?.name || state.people[0]?.name || state.activeUserName;
  }

  state.people = stripKnownTestPeople(state.people);
  saveState();
  refreshRemoteSyncShadow();
  } finally {
    remoteSyncSuppressed = false;
  }
}

async function syncStoreToRemote(store, activityComment) {
  if (supabaseClient) {
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
    return;
  }

  if (!hasAppwriteDataConfig) {
    return;
  }

  const documentId = safeDocumentId("store", store.code || store.id);
  await upsertAppwriteDocument(
    appwriteStoresCollectionId,
    documentId,
    buildAppwriteStoreDocument(store)
  );

  if (activityComment) {
    const activity = {
      id: `activity-${Date.now()}`,
      storeName: store.name,
      result: store.status === "blocked" ? "issue" : "ok",
      comment: activityComment,
      confirmedBy: state.activeUserName,
      createdAt: new Date().toISOString()
    };
    await upsertAppwriteDocument(
      appwriteActivitiesCollectionId,
      safeDocumentId("activity", activity.id),
      buildAppwriteActivityDocument(activity)
    );
  }
}

async function syncPersonToRemote(person) {
  if (supabaseClient) {
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
    return;
  }

  if (!hasAppwriteDataConfig) {
    return;
  }

  await upsertAppwriteDocument(
    appwritePeopleCollectionId,
    safeDocumentId("person", person.id || person.email || person.name),
    buildAppwritePersonDocument(person)
  );
}

async function deletePersonFromRemote(personId) {
  if (supabaseClient) {
    const numericId = Number(personId);
    if (Number.isNaN(numericId)) {
      return;
    }
    const { error } = await supabaseClient.from("contacts").delete().eq("id", numericId);
    if (error) throw error;
    return;
  }

  if (!hasAppwriteDataConfig) {
    return;
  }

  await appwriteDatabases.deleteDocument(
    appwriteDatabaseId,
    appwritePeopleCollectionId,
    safeDocumentId("person", personId)
  );
}

async function syncRoleOptionsToRemote() {
  if (supabaseClient) {
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
    return;
  }

  if (hasAppwriteDataConfig) {
    await upsertAppwriteDocument(
      appwriteSettingsCollectionId,
      "global-state",
      buildAppwriteSettingsDocument()
    );
  }
}

async function syncSettingsToRemote() {
  if (supabaseClient) {
    await syncRoleOptionsToRemote();
    return;
  }

  if (!hasAppwriteDataConfig) {
    return;
  }

  await upsertAppwriteDocument(
    appwriteSettingsCollectionId,
    "global-state",
    buildAppwriteSettingsDocument()
  );
}

async function syncAllRemoteState() {
  if (!hasRemoteData()) {
    return;
  }

  await syncPeopleRemoteState();
  await syncStoresRemoteState();
  await syncSettingsToRemote();

  if (supabaseClient) {
    return;
  }

  await syncTicketsRemoteState();
  await syncActivitiesRemoteState();
}

async function syncTicketsRemoteState(options = {}) {
  const {
    delayMs = 700,
    every = 2
  } = options;

  if (!hasAppwriteDataConfig) {
    return;
  }

  for (let index = 0; index < state.tickets.length; index += 1) {
    await paceRemoteSync(index, every, delayMs);
    const ticket = state.tickets[index];
    await upsertAppwriteDocument(
      appwriteTicketsCollectionId,
      safeDocumentId("ticket", ticket.id || `${ticket.storeCode}-${ticket.createdAt}`),
      buildAppwriteTicketDocument(ticket)
    );
  }
}

async function syncSavStateToRemote() {
  if (!hasRemoteData()) {
    return;
  }

  if (supabaseClient) {
    await syncAllRemoteState();
    await loadRemoteState();
    return;
  }

  await syncTicketsRemoteState();
  await syncActivitiesRemoteState();
  await loadRemoteState();
}

async function syncPeopleRemoteState(options = {}) {
  const {
    delayMs = 1200,
    every = 1
  } = options;

  for (let index = 0; index < state.people.length; index += 1) {
    await paceRemoteSync(index, every, delayMs);
    const person = state.people[index];
    await syncPersonToRemote(person);
  }
}

async function syncStoresRemoteState(options = {}) {
  const {
    delayMs = 1500,
    every = 1
  } = options;

  for (let index = 0; index < state.stores.length; index += 1) {
    await paceRemoteSync(index, every, delayMs);
    const store = state.stores[index];
    await syncStoreToRemote(store);
  }
}

async function syncActivitiesRemoteState(options = {}) {
  const {
    delayMs = 900,
    every = 1
  } = options;

  if (!hasAppwriteDataConfig) {
    return;
  }

  for (let index = 0; index < state.activities.length; index += 1) {
    await paceRemoteSync(index, every, delayMs);
    const activity = state.activities[index];
    await upsertAppwriteDocument(
      appwriteActivitiesCollectionId,
      safeDocumentId("activity", activity.id || `${activity.storeName}-${activity.createdAt}`),
      buildAppwriteActivityDocument(activity)
    );
  }
}

async function sendMagicLink(email) {
  if (!magicLinksEnabled) {
    window.alert("L envoi de lien magique est desactive pour le moment.");
    return;
  }

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

function describeAppwriteError(error) {
  const code = error?.code || error?.response?.code;
  const type = error?.type || error?.response?.type;
  const message = error?.message || "Erreur inconnue";
  const isFetchFailure = message === "Failed to fetch" || error instanceof TypeError;

  if (isFetchFailure) {
    return [
      "Impossible de joindre Appwrite depuis le navigateur.",
      `Site ouvert: ${window.location.hostname}.`,
      "Verifie la plateforme Web Appwrite et recopie-moi la vraie erreur console si cela persiste."
    ].join(" ");
  }

  return [code, type, message].filter(Boolean).join(" | ");
}

function isMissingAppwriteDatabaseError(error) {
  const message = String(error?.message || "");
  const type = String(error?.type || error?.response?.type || "");
  const code = Number(error?.code || error?.response?.code || 0);
  return (
    code === 404
    || type.includes("database_not_found")
    || message.includes("Database with the requested ID")
  );
}

async function syncImportedStateIfPossible(mode = "full") {
  if (!hasRemoteData()) {
    return { synced: false, skipped: true };
  }

  try {
    if (mode === "stores") {
      await syncStoresRemoteState({ delayMs: 1800, every: 1 });
      await syncSettingsToRemote();
    } else if (mode === "telephony") {
      await syncStoresRemoteState({ delayMs: 1800, every: 1 });
    } else if (mode === "extensions") {
      await syncSettingsToRemote();
    } else {
      await syncAllRemoteState();
    }
    await loadRemoteState();
    return { synced: true, skipped: false };
  } catch (error) {
    if (isMissingAppwriteDatabaseError(error)) {
      return { synced: false, skipped: false, missingDatabase: true };
    }
    throw error;
  }
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
  if (supabaseClient && !realtimeChannel) {
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
    return;
  }

  if (!hasAppwriteDataConfig || appwriteRealtimeUnsubscribe || !appwriteClient?.subscribe) {
    return;
  }

  appwriteRealtimeUnsubscribe = appwriteClient.subscribe([
      `databases.${appwriteDatabaseId}.collections.${appwriteStoresCollectionId}.documents`,
      `databases.${appwriteDatabaseId}.collections.${appwriteTicketsCollectionId}.documents`,
      `databases.${appwriteDatabaseId}.collections.${appwritePeopleCollectionId}.documents`,
      `databases.${appwriteDatabaseId}.collections.${appwriteActivitiesCollectionId}.documents`,
      `databases.${appwriteDatabaseId}.collections.${appwriteSettingsCollectionId}.documents`
    ], async () => {
      await loadRemoteState();
      render();
    });
}

function setupAppwritePolling() {
  if (!isAppwriteMode || !hasAppwriteDataConfig || appwritePollHandle) {
    return;
  }

  appwritePollHandle = window.setInterval(async () => {
    if (state.connectionState === "initializing") {
      return;
    }
    try {
      await loadRemoteState();
      render();
    } catch (error) {
      console.error("Appwrite polling error", error);
    }
  }, 250000);
}

function render() {
  ensureValidActiveTab();
  applyStaticTranslations();
  renderConnectionStatus();
  syncSelectors();
  renderPinGate();
  renderAuthState();
  renderAdminTabs();
  const activePanel = panelForTab(state.activeAdminTab);
  if (activePanel === "dashboard") {
    renderSummary();
    renderStores();
    renderActivities();
    applyReadOnlyRules();
    return;
  }
  if (activePanel === "contacts") {
    renderPeopleList();
    renderRoleList();
    return;
  }
  if (activePanel === "reports") {
    renderStores();
    renderActivities();
    return;
  }
  if (activePanel === "automations") {
    renderAutomations();
    return;
  }
  if (activePanel === "import-export") {
    renderImportExportHistory();
    return;
  }
  if (activePanel === "pin-access") {
    renderPinAccessList();
    return;
  }
  if (activePanel === "tools") {
    renderToolList();
    return;
  }
  if (activePanel === "visibility") {
    renderVisibilityEditor();
    renderVisibilityOverrides();
    return;
  }
  applyReadOnlyRules();
}

async function importJsonData(payload) {
  if (Array.isArray(payload.stores)) {
    state.stores = payload.stores;
  }
  if (Array.isArray(payload.activities)) {
    state.activities = payload.activities;
  }
  if (Array.isArray(payload.tickets)) {
    state.tickets = payload.tickets;
  }
  if (Array.isArray(payload.people)) {
    state.people = payload.people.map((person) => hydrateAccessProfile({
      language: "fr",
      storeCode: "",
      ...person
    }));
  }
  if (Array.isArray(payload.accessOverrides)) {
    state.accessOverrides = payload.accessOverrides;
  }
  if (Array.isArray(payload.roleOptions)) {
    state.roleOptions = normalizedRoleOptions(payload.roleOptions);
  }
  if (Array.isArray(payload.toolItems)) {
    state.toolItems = payload.toolItems;
  }
  if (Array.isArray(payload.automations)) {
    state.automations = normalizedAutomations(payload.automations);
  }
  if (payload.roleVisibilityConfig && typeof payload.roleVisibilityConfig === "object") {
    state.roleVisibilityConfig = payload.roleVisibilityConfig;
  }
  if (typeof payload.visibilityEditorRole === "string" && payload.visibilityEditorRole) {
    state.visibilityEditorRole = payload.visibilityEditorRole;
  }
  if (typeof payload.activeUserName === "string" && payload.activeUserName) {
    state.activeUserName = payload.activeUserName;
  }
  if (hasRemoteData()) {
    await syncAllRemoteState();
    await loadRemoteState();
  }
  saveState();
  render();
}

function handleImportButtonClick() {
  state.importMode = "stores";
  importInput.value = "";
  importInput.click();
}

function triggerImport(mode) {
  state.importMode = mode;
  importInput.value = "";
  importInput.click();
}

function downloadTextFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",;\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function buildCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(";")).join("\n");
}

function xlsxAvailable() {
  return typeof window.XLSX !== "undefined";
}

function pdfAvailable() {
  return Boolean(window.jspdf?.jsPDF);
}

function exportRowsToXlsx(rows, fileName, sheetName) {
  if (!xlsxAvailable()) {
    throw new Error("Bibliotheque XLSX indisponible.");
  }
  const worksheet = window.XLSX.utils.aoa_to_sheet(rows);
  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  window.XLSX.writeFile(workbook, fileName);
}

function exportRowsToPdf(title, headers, bodyRows, fileName) {
  if (!pdfAvailable()) {
    throw new Error("Bibliotheque PDF indisponible.");
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Genere le ${formatDateTime(new Date().toISOString())}`, 14, 23);
  doc.autoTable({
    head: [headers],
    body: bodyRows,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [255, 243, 174], textColor: [50, 50, 50] },
    margin: { left: 10, right: 10 }
  });
  doc.save(fileName);
}

function readWorkbookRows(file, arrayBuffer) {
  if (!xlsxAvailable()) {
    throw new Error("Bibliotheque XLSX indisponible.");
  }
  const workbook = window.XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return window.XLSX.utils.sheet_to_json(worksheet, { defval: "" });
}

function readExtensionWorkbookRows(arrayBuffer) {
  if (!xlsxAvailable()) {
    throw new Error("Bibliotheque XLSX indisponible.");
  }
  const workbook = window.XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const matrix = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  if (!Array.isArray(matrix) || matrix.length < 3) {
    return [];
  }

  const headerRow = matrix[1].map((value) => normalizeImportCell(value));
  return matrix
    .slice(2)
    .filter((row) => Array.isArray(row) && row.some((cell) => normalizeImportCell(cell) !== ""))
    .map((row) => {
      const entry = {};
      headerRow.forEach((header, index) => {
        if (header) {
          entry[header] = row[index] ?? "";
        }
      });
      return entry;
    });
}

function exportJsonData() {
  const payload = {
    stores: state.stores,
    activities: state.activities,
    tickets: state.tickets,
    people: state.people,
    accessOverrides: state.accessOverrides,
    roleOptions: state.roleOptions,
    roleVisibilityConfig: state.roleVisibilityConfig,
    visibilityEditorRole: state.visibilityEditorRole,
    activeUserName: state.activeUserName,
    exportedAt: new Date().toISOString()
  };
  downloadTextFile(
    JSON.stringify(payload, null, 2),
    `twem-brico-export-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
  recordImportExportHistory("export", "Export JSON complet", "Sauvegarde complete de l etat courant.");
}

function exportStoresXlsx() {
  const rows = [
    ["Code", "Nom", "Ville", "Type", "Responsable TWEM", "Manager", "Statut", "Etape", "Prochaine action"]
  ];
  getRoleScopedStores().forEach((store) => {
    rows.push([
      store.code,
      store.name,
      store.city,
      store.shopType,
      store.owner,
      store.manager,
      store.status,
      currentWorkflowStage(store),
      nextActionForStore(store)
    ]);
  });
  exportRowsToXlsx(
    rows,
    `twem-brico-magasins-${new Date().toISOString().slice(0, 10)}.xlsx`,
    "Magasins"
  );
  recordImportExportHistory("export", "Export magasins XLSX", `${rows.length - 1} magasin(s) exporte(s).`);
}

function exportStoresCheckXlsx() {
  const rows = [
    ["Code magasin", "Nom magasin", "Licences", "Postes fixes", "Mobiles", "Call buttons", "Panic buttons", "Date telephonie actuelle"]
  ];
  getRoleScopedStores().forEach((store) => {
    const workflow = ensureStoreWorkflowData(store);
    const quantityPlan = getStoreQuantityPlan(store);
    rows.push([
      store.code,
      store.name,
      quantityPlan.licenseCount,
      quantityPlan.fixCount,
      quantityPlan.mobileCount,
      quantityPlan.callButtonCount,
      quantityPlan.panicCount,
      workflow.currentPhoneDate || ""
    ]);
  });
  exportRowsToXlsx(
    rows,
    `twem-brico-controle-magasins-${new Date().toISOString().slice(0, 10)}.xlsx`,
    "Controle magasins"
  );
  recordImportExportHistory("export", "Export controle magasins XLSX", `${rows.length - 1} magasin(s) exporte(s).`);
}

function exportStoresPdf() {
  const headers = ["Code", "Nom", "Ville", "Type", "Responsable TWEM", "Manager", "Statut", "Etape", "Prochaine action"];
  const bodyRows = getRoleScopedStores().map((store) => ([
    store.code,
    store.name,
    store.city,
    store.shopType,
    store.owner,
    store.manager,
    store.status,
    currentWorkflowStage(store),
    nextActionForStore(store)
  ]));
  exportRowsToPdf(
    "Magasins TWEM Brico",
    headers,
    bodyRows,
    `twem-brico-magasins-${new Date().toISOString().slice(0, 10)}.pdf`
  );
  recordImportExportHistory("export", "Export magasins PDF", `${bodyRows.length} magasin(s) exporte(s).`);
}

function exportExtensionsXlsx() {
  const rows = [
    ["Categorie", "Modele", "Numero", "Libelle", "Ancien numero", "Langue", "Item", "Activation", "Usage"]
  ];
  extensionCatalogRows.forEach((row) => {
    rows.push([
      row.category,
      row.model,
      row.number,
      row.label,
      row.oldNumber,
      row.language,
      row.item,
      row.activation,
      row.usage || ""
    ]);
  });
  exportRowsToXlsx(
    rows,
    `twem-brico-extensions-${new Date().toISOString().slice(0, 10)}.xlsx`,
    "Extensions"
  );
  recordImportExportHistory("export", "Export extensions XLSX", `${extensionCatalogRows.length} extension(s) exportee(s).`);
}

function exportExtensionsPdf() {
  const headers = ["Categorie", "Modele", "Numero", "Libelle", "Ancien numero", "Langue", "Item", "Activation", "Usage"];
  const bodyRows = extensionCatalogRows.map((row) => ([
    row.category,
    row.model,
    row.number,
    row.label,
    row.oldNumber,
    row.language,
    row.item,
    row.activation,
    row.usage || ""
  ]));
  exportRowsToPdf(
    "Catalogue extensions TWEM Brico",
    headers,
    bodyRows,
    `twem-brico-extensions-${new Date().toISOString().slice(0, 10)}.pdf`
  );
  recordImportExportHistory("export", "Export extensions PDF", `${bodyRows.length} extension(s) exportee(s).`);
}

function safeRunExport(action) {
  try {
    action();
    renderImportExportHistory();
  } catch (error) {
    console.error("Export error", error);
    window.alert(`Export impossible: ${error.message}`);
  }
}

function parseDelimitedText(raw) {
  const lines = String(raw || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) {
    return [];
  }
  const separator = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(separator).map((item) => item.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = line.split(separator).map((item) => item.trim());
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = cols[index] || "";
    });
    return entry;
  });
}

function importExtensionRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("Aucune ligne extension exploitable.");
  }

  extensionCatalogRows.splice(0, extensionCatalogRows.length, ...rows.map((row, index) => ({
    category: normalizeImportCell(
      row.category
      || row.categorie
      || row.type
      || row.Type
      || "Extension"
    ),
    model: normalizeImportCell(row.model || row.modele || row.Model || ""),
    number: normalizeImportCell(
      row.number
      || row.numero
      || row.extension
      || row["NEW NUMBER"]
      || row["Extension*OLD"]
      || `EXT-${index + 1}`
    ),
    label: normalizeImportCell(
      row.label
      || row.libelle
      || row.lieu
      || row["Last name*"]
      || row.Departement
      || ""
    ),
    oldNumber: normalizeImportCell(
      row.old_number
      || row["ancien numero"]
      || row.ancien_numero
      || row["ancien numéro"]
      || row["Extension*OLD"]
      || ""
    ),
    language: normalizeImportCell(row.language || row.langue || row.Language || ""),
    item: normalizeImportCell(row.item || row.Item || ""),
    activation: normalizeImportCell(
      row.activation
      || row["Activation or Port-in type"]
      || row["Activation / Port-in"]
      || ""
    ),
    usage: normalizeImportCell(
      row.usage
      || row.Departement
      || row["Fixed phone type"]
      || row["External direct number"]
      || ""
    )
  })));
}

function normalizeImportCell(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function preserveCoreTwemPeople() {
  const source = mergePeopleWithPinFallback(state.people).filter((person) => ["Emir", "Valou"].includes(person.name));
  return source.map((person) => hydrateAccessProfile({
    ...person,
    allowedStoreCodes: ["*"],
    storeCode: "",
    email: person.email || `${person.name.toLowerCase()}@twem.be`
  }));
}

function languageFromStoreSheet(value) {
  const normalized = normalizeImportCell(value).toLowerCase();
  if (normalized === "n" || normalized === "nl" || normalized === "nl/f") {
    return "nl";
  }
  if (normalized.includes("n") && !normalized.includes("f")) {
    return "nl";
  }
  return "fr";
}

function normalizeImportKey(key) {
  return normalizeImportCell(key)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeImportRow(row) {
  const normalized = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    normalized[normalizeImportKey(key)] = value;
  });
  return normalized;
}

function readImportValue(row, keys, fallback = "") {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return fallback;
}

function toImportNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatImportDateValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  const numericValue = typeof value === "number"
    ? value
    : (/^\d+(\.\d+)?$/.test(String(value).trim()) ? Number(String(value).trim()) : NaN);
  if (Number.isFinite(numericValue) && numericValue <= 0) {
    return "";
  }
  if (Number.isFinite(numericValue) && numericValue > 59) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + Math.floor(numericValue));
    const year = excelEpoch.getUTCFullYear();
    const month = String(excelEpoch.getUTCMonth() + 1).padStart(2, "0");
    const day = String(excelEpoch.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const parsed = normalizeDateOnly(value);
  if (!parsed) {
    return "";
  }
  if (parsed.getFullYear() <= 1970) {
    return "";
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function freshImportedSteps() {
  return [
    { actorType: "store_manager", label: "Magasin", status: "planned", note: "A lancer" },
    { actorType: "installer", label: "Telephonie", status: "planned", note: "A planifier" },
    { actorType: "electrician", label: "Electricien", status: "planned", note: "A planifier" }
  ];
}

function importTelephonyRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("Aucune ligne telephonie exploitable.");
  }

  const storesByNumber = new Map();
  state.stores.forEach((store) => {
    storesByNumber.set(normalizeImportCell(store.shopNumber).replace(/\.0$/, ""), store);
  });

  let matchedCount = 0;
  rows.forEach((rawRow) => {
    const row = normalizeImportRow(rawRow);
    const shopNumber = normalizeImportCell(readImportValue(row, ["store_nr", "shopnumber", "store_number", "store_nr_"], "")).replace(/\.0$/, "");
    if (!shopNumber) {
      return;
    }
    const store = storesByNumber.get(shopNumber);
    if (!store) {
      return;
    }
    matchedCount += 1;
    store.status = "planned";
    store.health = "";
    store.steps = freshImportedSteps();
    store.updatedAt = new Date().toISOString();

    store.licenseCount = toImportNumber(readImportValue(row, ["license", "_license", "license_count", "nb_license", "nb_licence"], store.licenseCount || 0));
    store.fixCount = toImportNumber(readImportValue(row, ["fix", "_fix", "nb_fix"], store.fixCount || 0));
    store.mobileCount = toImportNumber(readImportValue(row, ["mobile", "_mobile", "nb_mobile"], store.mobileCount || 0));
    store.callButtonCount = toImportNumber(readImportValue(row, ["call_button", "_call_button", "nb_call_button"], store.callButtonCount || 0));
    store.panicCount = toImportNumber(readImportValue(row, ["panic_button", "_panic_button", "nb_panic_button"], store.panicCount || 0));

    const workflow = ensureStoreWorkflowData(store);
    workflow.currentPhoneDate = formatImportDateValue(readImportValue(row, ["installation_date", "installation_on_date", "install_date"], workflow.currentPhoneDate || ""));
    workflow.destinyInstallDate = "";
    workflow.collectDate = "";
    workflow.itValidationDate = "";
    workflow.previsitDate = "";
    workflow.transferDate = "";
    workflow.destinyInstallDone = "Non";
    workflow.extensionRequestStatus = "A envoyer";
    workflow.extensionConfigStatus = "En attente";
    workflow.networkConfigConfirmed = false;
    workflow.vlan22Status = normalizeImportCell(readImportValue(row, ["configuration_vlan_22"], workflow.vlan22Status || "A relancer"));
    workflow.mobileOperator = normalizeImportCell(readImportValue(row, ["reseau_mobile"], workflow.mobileOperator || ""));
    workflow.alarmType = normalizeImportCell(readImportValue(row, ["type_d_alarme_pstn_data", "type_dalarme_pstn_data"], workflow.alarmType || "A confirmer"));
    workflow.callFlowNote = normalizeImportCell(readImportValue(row, ["call_flow"], workflow.callFlowNote || ""));
  });

  if (!matchedCount) {
    throw new Error("Aucun Store NR du fichier telephonie ne correspond aux magasins deja importes.");
  }
}

function importStoresRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("Aucune ligne magasin exploitable.");
  }

  const importedManagers = [];
  const nextStores = rows.map((rawRow, index) => {
    const row = normalizeImportRow(rawRow);
    const shopNumber = normalizeImportCell(readImportValue(row, ["store_nr", "shopnumber", "store_number", "numero", "store_nr_"], `${index + 1}`));
    const code = normalizeImportCell(readImportValue(row, ["code", "code_magasin", "store_code"], shopNumber ? `BRI-${shopNumber}` : `MAG-${index + 1}`));
    const name = normalizeImportCell(readImportValue(row, ["shop_name", "name", "magasin", "store_name"], `Magasin ${index + 1}`));
    const city = normalizeImportCell(readImportValue(row, ["city", "ville", "commune", "region"], ""));
    const street = normalizeImportCell(readImportValue(row, ["street", "adresse", "address"], ""));
    const number = normalizeImportCell(readImportValue(row, ["n", "numero", "number"], ""));
    const postalCode = normalizeImportCell(readImportValue(row, ["cp", "code_postal", "canton_postal"], ""));
    const country = normalizeImportCell(readImportValue(row, ["country", "pays"], ""));
    const address = [street, number].filter(Boolean).join(" ").trim();
    const addressTail = [postalCode, city, country].filter(Boolean).join(" - ").trim();
    const fullAddress = [address, addressTail].filter(Boolean).join(" - ");
    const shopType = normalizeImportCell(readImportValue(row, ["type_shop", "type_magasin", "shop_type"], "DOS"));
    const shopSize = normalizeImportCell(readImportValue(row, ["shop_type_2", "shopsize", "type_shop_2"], ""));
    const fallbackOwner = twemOptions.includes(state.activeUserName) ? state.activeUserName : "Valou";
    const owner = normalizeImportCell(readImportValue(row, ["owner", "responsable_twem", "twem"], fallbackOwner));
    const manager = normalizeImportCell(readImportValue(row, ["nom_manager", "manager", "responsable_magasin", "responsable"], ""));
    const status = "planned";
    const updatedAt = new Date().toISOString();
    const licenseCount = toImportNumber(readImportValue(row, ["license", "licenses", "license_count", "nb_licence", "nb_licenses"], 0));
    const fixCount = toImportNumber(readImportValue(row, ["fix", "_fix", "nb_fix", "fix_count", "fixes"], 0));
    const mobileCount = toImportNumber(readImportValue(row, ["mobile", "_mobile", "nb_mobile", "mobile_count"], 0));
    const panicCount = toImportNumber(readImportValue(row, ["panic_button", "_panic_button", "nb_panic_button", "panic_count"], 0));
    const callButtonCount = toImportNumber(readImportValue(row, ["call_button", "_call_button", "nb_call_button", "call_button_count"], 0));
    const storeDraft = {
      id: Date.now() + index,
      code,
      shopNumber,
      name,
      city,
      address: fullAddress,
      shopType,
      shopSize,
      poLicences: normalizeImportCell(readImportValue(row, ["po_licences", "po_licence", "po_licences_", "po_licence_"], "")),
      poHpDesk: normalizeImportCell(readImportValue(row, ["po_hpdesk", "po_hp_desk"], "")),
      poPm: normalizeImportCell(readImportValue(row, ["po_pm"], "")),
      poRentingHw: normalizeImportCell(readImportValue(row, ["po_renting_hw", "po_renting"], "")),
      owner,
      manager,
      status,
      health: "",
      updatedAt,
      steps: freshImportedSteps(),
      appointments: [],
      licenseCount,
      fixCount,
      mobileCount,
      callButtonCount,
      panicCount
    };
    const workflow = ensureStoreWorkflowData(storeDraft);
    workflow.currentPhoneDate = formatImportDateValue(readImportValue(row, ["installation_date", "installation_on_date", "install_date"], workflow.currentPhoneDate || ""));
    workflow.alarmType = normalizeImportCell(readImportValue(row, ["type_d_alarme_pstn_data", "type_dalarme_pstn_data"], workflow.alarmType || "A confirmer"));
    workflow.mobileOperator = normalizeImportCell(readImportValue(row, ["reseau_mobile"], workflow.mobileOperator || ""));
    workflow.callFlowNote = normalizeImportCell(readImportValue(row, ["call_flow"], workflow.callFlowNote || ""));
    workflow.destinyInstallDate = "";
    workflow.collectDate = "";
    workflow.itValidationDate = "";
    workflow.previsitDate = "";
    workflow.transferDate = "";
    workflow.destinyInstallDone = "Non";
    workflow.extensionRequestStatus = "A envoyer";
    workflow.extensionConfigStatus = "En attente";
    workflow.networkConfigConfirmed = false;

    const managerEmail = normalizeImportCell(readImportValue(row, ["email"], ""));
    const managerPhone = normalizeImportCell(readImportValue(row, ["tel", "telephone"], ""));
    if (manager) {
      importedManagers.push(hydrateAccessProfile({
        id: `mgr-${shopNumber || code}`,
        name: manager,
        role: "magasin",
        phone: managerPhone,
        email: managerEmail,
        storeCode: code,
        language: languageFromStoreSheet(readImportValue(row, ["lang"], "")),
        allowedStoreCodes: [code],
        pin: generateUniquePin(),
        pinStatus: "active",
        pinCreatedAt: new Date().toISOString()
      }));
    }

    storeDraft.workflowData = workflow;
    return storeDraft;
  });

  state.stores = nextStores;
  state.activities = [];
  state.tickets = [];

  const coreTwem = preserveCoreTwemPeople();
  const managersByKey = new Map();
  importedManagers.forEach((person) => {
    const key = `${normalizeImportCell(person.email).toLowerCase()}|${normalizeImportCell(person.name).toLowerCase()}|${person.storeCode}`;
    if (!managersByKey.has(key)) {
      managersByKey.set(key, person);
    }
  });
  state.people = mergePeopleWithPinFallback([
    ...coreTwem,
    ...[...managersByKey.values()]
  ]);
  state.activeUserName = state.people.find((person) => person.name === "Valou")?.name || "Valou";
}

function handleImportInputChange(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const useBinaryReader = file.name.toLowerCase().endsWith(".xls") || file.name.toLowerCase().endsWith(".xlsx");
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const fileName = file.name.toLowerCase();
      if (state.importMode === "extensions") {
        if (fileName.endsWith(".json")) {
          const payload = JSON.parse(String(reader.result));
          const rows = Array.isArray(payload) ? payload : (payload.extensions || payload.rows || []);
          importExtensionRows(rows);
        } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
          importExtensionRows(readExtensionWorkbookRows(reader.result));
        } else if (fileName.endsWith(".csv")) {
          importExtensionRows(parseDelimitedText(reader.result));
        } else {
          throw new Error("Format extension non supporte. Utilise XLS/XLSX, CSV ou JSON.");
        }
        recordImportExportHistory("import", "Import extensions", file.name);
        saveState();
        render();
      } else if (state.importMode === "telephony") {
        if (fileName.endsWith(".json")) {
          const payload = JSON.parse(String(reader.result));
          const rows = Array.isArray(payload) ? payload : (payload.telephony || payload.rows || []);
          importTelephonyRows(rows);
        } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
          importTelephonyRows(readWorkbookRows(file, reader.result));
        } else if (fileName.endsWith(".csv")) {
          importTelephonyRows(parseDelimitedText(reader.result));
        } else {
          throw new Error("Pour la telephonie, utilise XLS/XLSX, CSV ou JSON.");
        }
        saveState();
        render();
        const syncResult = await syncImportedStateIfPossible("telephony");
        recordImportExportHistory("import", "Import telephonie", file.name);
        saveState();
        render();
        window.alert(syncResult.missingDatabase
          ? "Import telephonie termine dans l application. La base Appwrite 'twem_brico' n existe pas encore, donc la synchro backend est en attente."
          : "Import telephonie termine.");
      } else if (fileName.endsWith(".json")) {
        const payload = JSON.parse(String(reader.result));
        await importJsonData(payload);
        recordImportExportHistory("import", "Import magasins / donnees", file.name);
        window.alert(t("importDone"));
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        importStoresRows(readWorkbookRows(file, reader.result));
        saveState();
        render();
        const syncResult = await syncImportedStateIfPossible("stores");
        recordImportExportHistory("import", "Import magasins XLS/XLSX", file.name);
        saveState();
        render();
        window.alert(syncResult.missingDatabase
          ? "Import magasins termine dans l application. La base Appwrite 'twem_brico' n existe pas encore, donc la synchro backend est en attente."
          : "Import magasins termine.");
      } else if (fileName.endsWith(".csv")) {
        importStoresRows(parseDelimitedText(reader.result));
        saveState();
        render();
        const syncResult = await syncImportedStateIfPossible("stores");
        recordImportExportHistory("import", "Import magasins CSV", file.name);
        saveState();
        render();
        window.alert(syncResult.missingDatabase
          ? "Import magasins termine dans l application. La base Appwrite 'twem_brico' n existe pas encore, donc la synchro backend est en attente."
          : "Import magasins termine.");
      } else {
        window.alert("Pour les magasins, utilise XLS/XLSX, CSV ou JSON.");
      }
    } catch (error) {
      window.alert(`${t("importError")}: ${error.message}`);
    } finally {
      importInput.value = "";
      state.importMode = "stores";
    }
  };
  if (useBinaryReader) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
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

function buildStoreReportHtml(group) {
  const generatedAt = new Intl.DateTimeFormat("fr-BE", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date());

  return `
    <!doctype html>
    <html lang="${state.language}">
    <head>
      <meta charset="UTF-8">
      <title>Rapport ${escapeHtml(group.storeName)}</title>
      <style>
        @page { margin: 12mm; }
        body { font-family: Arial, sans-serif; padding: 0; color: #222; font-size: 11px; line-height: 1.35; }
        h1 { margin: 0 0 4px; font-size: 22px; }
        .meta { color: #666; margin-bottom: 10px; font-size: 11px; }
        .list { border-top: 1px solid #d8d8d8; }
        .entry { border-bottom: 1px solid #e2e2e2; padding: 6px 0; margin: 0; break-inside: avoid; }
        .entry-head { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 2px; color: #666; font-size: 10px; }
        .entry-author { font-weight: 700; margin-bottom: 2px; }
        .entry-text { margin: 0; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 999px; font-weight: 700; font-size: 10px; }
        .badge-ok { background: #e6f5ea; color: #2d6b46; }
        .badge-issue { background: #fde8e6; color: #b3422c; }
      </style>
    </head>
    <body>
      <h1>Rapport magasin - ${escapeHtml(group.storeName)}</h1>
      <div class="meta">Genere le ${escapeHtml(generatedAt)} - ${escapeHtml(state.activeUserName)}</div>
      <div class="list">
      ${group.entries.map((entry) => `
        <div class="entry">
          <div class="entry-head">
            <span class="badge ${entry.result === "issue" ? "badge-issue" : "badge-ok"}">${entry.result === "issue" ? "Probleme" : "OK"}</span>
            <span>${escapeHtml(formatDateTime(entry.createdAt))}</span>
          </div>
          <div class="entry-author">${escapeHtml(entry.confirmedBy)}</div>
          <p class="entry-text">${escapeHtml(entry.comment)}</p>
        </div>
      `).join("")}
      </div>
    </body>
    </html>
  `;
}

function exportStoreReportPdf(group) {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    window.alert(t("reportWindowError"));
    return;
  }

  reportWindow.document.open();
  reportWindow.document.write(buildStoreReportHtml(group));
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

function handleStorePlanUploadTrigger(event) {
  const storeId = event.currentTarget.getAttribute("data-plan-upload");
  const input = projectTableBody.querySelector(`[data-plan-file="${storeId}"]`);
  if (!input) {
    return;
  }
  input.value = "";
  input.click();
}

function handleStorePlanOpen(event) {
  const storeId = Number(event.currentTarget.getAttribute("data-plan-open"));
  const store = state.stores.find((item) => item.id === storeId);
  const workflow = store ? ensureStoreWorkflowData(store) : null;
  if (!workflow?.planPdfDataUrl) {
    return;
  }
  window.open(workflow.planPdfDataUrl, "_blank");
}

async function handleStorePlanDelete(event) {
  const storeId = Number(event.currentTarget.getAttribute("data-plan-delete"));
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }
  const workflow = ensureStoreWorkflowData(store);
  workflow.planPdfName = "";
  workflow.planPdfDataUrl = "";
  workflow.planPdfUpdatedAt = "";
  store.updatedAt = new Date().toISOString();
  if (hasRemoteData()) {
    await syncStoreToRemote(store, "Suppression du plan magasin PDF");
    await loadRemoteState();
  }
  saveState();
  render();
}

async function handleStorePlanFileChange(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  const storeId = Number(input.getAttribute("data-plan-file"));
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }
  if (!/\.pdf$/i.test(file.name)) {
    window.alert("Utilise uniquement un fichier PDF pour le plan magasin.");
    input.value = "";
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    window.alert("Le plan PDF est trop lourd. Garde un fichier inferieur a 4 Mo.");
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const workflow = ensureStoreWorkflowData(store);
    workflow.planPdfName = file.name;
    workflow.planPdfDataUrl = String(reader.result || "");
    workflow.planPdfUpdatedAt = new Date().toISOString();
    store.updatedAt = workflow.planPdfUpdatedAt;
    if (hasRemoteData()) {
      await syncStoreToRemote(store, "Ajout / mise a jour du plan magasin PDF");
      await loadRemoteState();
    }
    saveState();
    render();
  };
  reader.readAsDataURL(file);
}

function buildPrintableStoreHtml(store) {
  const workflow = ensureStoreWorkflowData(store);
  const quantityPlan = getStoreQuantityPlan(store);
  const appointments = sortedAppointments(store);
  const tickets = getFilteredTickets().filter((ticket) => ticket.storeId === store.id);

  return `
    <!doctype html>
    <html lang="${state.language}">
    <head>
      <meta charset="UTF-8">
      <title>Fiche magasin - ${escapeHtml(store.name)}</title>
      <style>
        @page { margin: 12mm; }
        body { font-family: Arial, sans-serif; color: #222; padding: 0; font-size: 12px; line-height: 1.35; }
        h1, h2, h3 { margin: 0 0 8px; }
        .meta { color: #666; margin-bottom: 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .card { border: 1px solid #ddd; border-radius: 10px; padding: 12px; break-inside: avoid; }
        .full { grid-column: 1 / -1; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background: #fff3ae; }
        .muted { color: #666; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(store.name)}</h1>
      <div class="meta">${escapeHtml(store.code)} - ${escapeHtml(store.city || "-")} - ${escapeHtml(store.address || "-")}</div>
      <div class="grid">
        <div class="card">
          <h3>Identite</h3>
          <div><strong>Type</strong> ${escapeHtml(store.shopType || "-")}</div>
          <div><strong>Taille</strong> ${escapeHtml(store.shopSize || "-")}</div>
          <div><strong>Manager</strong> ${escapeHtml(store.manager || "-")}</div>
          <div><strong>Provenance</strong> ${escapeHtml(storeProvenance(store))}</div>
          <div><strong>Date telephonie actuelle</strong> ${escapeHtml(workflow.currentPhoneDate || "-")}</div>
        </div>
        <div class="card">
          <h3>Quantites telephonie</h3>
          <div><strong>Licences</strong> ${quantityPlan.licenseCount}</div>
          <div><strong>Postes fixes</strong> ${quantityPlan.fixCount}</div>
          <div><strong>Mobiles</strong> ${quantityPlan.mobileCount}</div>
          <div><strong>Call buttons</strong> ${quantityPlan.callButtonCount}</div>
          <div><strong>Panic buttons</strong> ${quantityPlan.panicCount}</div>
        </div>
        <div class="card full">
          <h3>Rendez-vous</h3>
          ${appointments.length ? `
            <table>
              <thead><tr><th>Date</th><th>Statut</th><th>Personnes</th><th>Note</th></tr></thead>
              <tbody>
                ${appointments.map((appointment) => `
                  <tr>
                    <td>${escapeHtml(formatDateTime(appointment.datetime))}</td>
                    <td>${escapeHtml(appointment.status || "-")}</td>
                    <td>${escapeHtml(peopleLabel(appointment.people))}</td>
                    <td>${escapeHtml(appointment.note || "-")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : "<div class=\"muted\">Aucun rendez-vous.</div>"}
        </div>
        <div class="card full">
          <h3>SAV</h3>
          ${tickets.length ? `
            <table>
              <thead><tr><th>Reference</th><th>Service</th><th>Sujet</th><th>Statut</th><th>Date</th></tr></thead>
              <tbody>
                ${tickets.map((ticket) => `
                  <tr>
                    <td>${escapeHtml(ticket.id)}</td>
                    <td>${escapeHtml(ticket.targetService || "-")}</td>
                    <td>${escapeHtml(ticket.concern || "-")}</td>
                    <td>${escapeHtml(ticketStatusLabel(ticket.status))}</td>
                    <td>${escapeHtml(formatDateTime(ticket.createdAt))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : "<div class=\"muted\">Aucun SAV.</div>"}
        </div>
      </div>
    </body>
    </html>
  `;
}

function handleStorePrint(event) {
  const storeId = Number(event.currentTarget.getAttribute("data-store-print"));
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.alert(t("reportWindowError"));
    return;
  }
  printWindow.document.open();
  printWindow.document.write(buildPrintableStoreHtml(store));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
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
  if (hasRemoteData()) {
    await syncStoreToRemote(store);
    await loadRemoteState();
  }
  saveState();
  render();
}

function readAppointments(form, store) {
  const currentAppointments = store.appointments.map((appointment, index) => ({
    ...appointment,
    datetime: form.querySelector(`[name="appointment_datetime_${index}"]`)?.value || appointment.datetime,
    status: form.querySelector(`[name="appointment_status_${index}"]`)?.value || appointment.status,
    people: form.querySelector(`[name="appointment_people_${index}"]`)
      ? [...form.querySelector(`[name="appointment_people_${index}"]`).selectedOptions].map((option) => option.value)
      : appointment.people
  })).filter((appointment) => appointment.datetime);

  const newDatetime = form.querySelector('[name="new_appointment_datetime"]')?.value || "";
  const newPeopleField = form.querySelector('[name="new_appointment_people"]');
  const newPeople = newPeopleField ? [...newPeopleField.selectedOptions].map((option) => option.value) : [];
  const newStatus = form.querySelector('[name="new_appointment_status"]')?.value || "Propose";
  const newNote = form.querySelector('[name="new_appointment_note"]')?.value.trim() || "";

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

function readNetworkRows(form, store) {
  return getNetworkConfigRows(store).map((row) => ({
    ...row,
    extensionLabel: form.querySelector(`[name="network_extension_${row.id}"]`)?.value ?? row.extensionLabel ?? "",
    note: form.querySelector(`[name="network_note_${row.id}"]`)?.value?.trim() ?? row.note ?? ""
  }));
}

function readGsmRows(form, store) {
  return getGsmRows(store).map((row) => ({
    ...row,
    model: form.querySelector(`[name="gsm_model_${row.id}"]`)?.value.trim() || "",
    mobileNumber: form.querySelector(`[name="gsm_number_${row.id}"]`)?.value.trim() || "",
    mobileNetwork: form.querySelector(`[name="gsm_network_${row.id}"]`)?.value.trim() || "",
    iccid: form.querySelector(`[name="gsm_iccid_${row.id}"]`)?.value.trim() || "",
    puk: form.querySelector(`[name="gsm_puk_${row.id}"]`)?.value.trim() || "",
    extensionLinked: form.querySelector(`[name="gsm_extension_${row.id}"]`)?.value.trim() || "",
    user: form.querySelector(`[name="gsm_user_${row.id}"]`)?.value.trim() || "",
    callGroup: form.querySelector(`[name="gsm_group_${row.id}"]`)?.value.trim() || ""
  }));
}

function readIntervenantRows(form, store) {
  return getIntervenantRows(store).map((row) => ({
    ...row,
    slotName: form.querySelector(`[name="intervenant_name_${row.id}"]`)?.value || row.slotName || "",
    note: form.querySelector(`[name="intervenant_note_${row.id}"]`)?.value.trim() || ""
  }));
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

  const globalStatus = form.querySelector('[name="global_status"]')?.value || store.status || "planned";
  const health = form.querySelector('[name="health"]')?.value.trim() || store.health || "";

  if (globalStatus === "blocked" && !health) {
    validationNode.textContent = "Le champ probleme est obligatoire si le statut est bloque.";
    return;
  }

  validationNode.textContent = "";
  const workflow = ensureStoreWorkflowData(store);
  store.owner = form.querySelector('[name="owner"]')?.value || store.owner || "";
  store.manager = form.querySelector('[name="manager"]')?.value.trim() || store.manager || "";
  store.status = globalStatus;
  store.health = health;
  store.updatedAt = new Date().toISOString();

  stepFor(store, "store_manager").status = form.querySelector('[name="store_manager_status"]')?.value || stepFor(store, "store_manager").status;
  stepFor(store, "installer").status = form.querySelector('[name="installer_status"]')?.value || stepFor(store, "installer").status;
  stepFor(store, "electrician").status = form.querySelector('[name="electrician_status"]')?.value || stepFor(store, "electrician").status;
  stepFor(store, "store_manager").note = form.querySelector('[name="store_manager_note"]')?.value.trim() || stepFor(store, "store_manager").note || "";
  stepFor(store, "installer").note = form.querySelector('[name="installer_note"]')?.value.trim() || stepFor(store, "installer").note || "";
  stepFor(store, "electrician").note = form.querySelector('[name="electrician_note"]')?.value.trim() || stepFor(store, "electrician").note || "";
  store.appointments = readAppointments(form, store);

  workflow.destinyInstallDate = form.querySelector('[name="destiny_install_date"]').value;
  workflow.configStatus = form.querySelector('[name="config_status"]')?.value || workflow.configStatus;
  workflow.currentPhoneDate = form.querySelector('[name="current_phone_date"]')?.value || "";
  workflow.orderStatus = form.querySelector('[name="order_status"]')?.value || workflow.orderStatus;
  workflow.orderNote = form.querySelector('[name="order_note"]')?.value.trim() || "";
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
  workflow.networkRows = readNetworkRows(form, store);
  workflow.gsmRows = readGsmRows(form, store);
  workflow.intervenantRows = readIntervenantRows(form, store);
  workflow.alarmType = form.querySelector('[name="alarm_type"]')?.value || workflow.alarmType;
  workflow.alarmCompany = form.querySelector('[name="alarm_company"]')?.value.trim() || "";
  workflow.alarmCentralPhone = form.querySelector('[name="alarm_phone"]')?.value.trim() || "";
  workflow.alarmOther = form.querySelector('[name="alarm_other"]')?.value.trim() || "";
  workflow.callGroupsNote = form.querySelector('[name="call_groups_note"]')?.value.trim() || "";
  workflow.cascadeNote = form.querySelector('[name="cascade_note"]')?.value.trim() || "";

  state.activities.unshift({
    id: `edit-${Date.now()}`,
    storeName: store.name,
    result: store.status === "blocked" ? "issue" : "ok",
    comment: `Mise a jour magasin - statut ${statusLabel(store.status)}`,
    confirmedBy: state.activeUserName,
    createdAt: new Date().toISOString()
  });

  if (hasRemoteData()) {
    await syncStoreToRemote(store, `Mise a jour magasin - statut ${statusLabel(store.status)}`);
    await loadRemoteState();
  }
  saveState();
  state.expandedStoreIds.delete(storeId);
  render();
}

async function handleSavCreate(event) {
  const button = event.currentTarget;
  const storeId = Number(button.getAttribute("data-sav-create"));
  const form = button.closest("[data-store-editor]");
  const feedback = form?.querySelector(`[data-sav-feedback="${storeId}"]`);
  const store = state.stores.find((item) => item.id === storeId);
  if (!form || !store) {
    return;
  }

  const concern = form.querySelector('[name="new_ticket_concern"]').value.trim();
  const initialNote = form.querySelector('[name="new_ticket_note"]').value.trim();
  const targetService = form.querySelector('[name="new_ticket_service"]').value;
  if (!concern || !initialNote) {
    if (feedback) {
      feedback.textContent = "Le sujet et la note du ticket sont obligatoires.";
    }
    return;
  }

  const now = new Date().toISOString();
  const ticket = {
    id: `SAV-${store.code}-${Date.now()}`,
    storeId: store.id,
    storeCode: store.code,
    storeName: store.name,
    requesterName: currentUser()?.name || state.activeUserName || store.manager || "-",
    targetService,
    concern,
    initialNote,
    status: "open",
    createdAt: now,
    updates: []
  };

  state.tickets.unshift(ticket);
  state.activities.unshift({
    id: `sav-create-${Date.now()}`,
    storeName: store.name,
    result: "issue",
    comment: `Creation SAV ${concern}`,
    confirmedBy: ticket.requesterName,
    createdAt: now
  });

  form.querySelector('[name="new_ticket_concern"]').value = "";
  form.querySelector('[name="new_ticket_note"]').value = "";
  form.querySelector('[name="new_ticket_service"]').value = "Destiny";
  if (feedback) {
    feedback.textContent = "Ticket SAV cree.";
  }
  if (hasRemoteData()) {
    await syncSavStateToRemote();
  }
  saveState();
  render();
}

async function handleSavUpdate(event) {
  const button = event.currentTarget;
  const ticketId = button.getAttribute("data-sav-update");
  const ticket = state.tickets.find((entry) => entry.id === ticketId);
  const form = button.closest("[data-store-editor]");
  if (!ticket || !form) {
    return;
  }

  const noteField = form.querySelector(`[name="ticket_update_note_${ticketId}"]`);
  const statusField = form.querySelector(`[name="ticket_status_${ticketId}"]`);
  const nextNote = noteField?.value.trim() || "";
  const nextStatus = statusField?.value || ticket.status;

  if (!nextNote && nextStatus === ticket.status) {
    return;
  }

  if (nextNote) {
    ticket.updates.push({
      id: `${ticket.id}-u-${Date.now()}`,
      authorName: currentUser()?.name || state.activeUserName || "-",
      createdAt: new Date().toISOString(),
      note: nextNote
    });
  }

  ticket.status = nextStatus;
  if (noteField) {
    noteField.value = "";
  }

  state.activities.unshift({
    id: `sav-update-${Date.now()}`,
    storeName: ticket.storeName,
    result: ticket.status === "closed" ? "ok" : "issue",
    comment: `Suivi SAV ${ticket.concern} - ${ticketStatusLabel(ticket.status)}`,
    confirmedBy: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString()
  });

  if (hasRemoteData()) {
    await syncSavStateToRemote();
  }
  saveState();
  render();
}

async function handleSavToggleClose(event) {
  const button = event.currentTarget;
  const ticketId = button.getAttribute("data-sav-toggle-close");
  const ticket = state.tickets.find((entry) => entry.id === ticketId);
  if (!ticket) {
    return;
  }

  const nextStatus = ticket.status === "closed" ? "open" : "closed";
  ticket.status = nextStatus;
  ticket.updates.push({
    id: `${ticket.id}-u-${Date.now()}`,
    authorName: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString(),
    note: nextStatus === "closed" ? "Ticket cloture." : "Ticket reouvert."
  });

  state.activities.unshift({
    id: `sav-status-${Date.now()}`,
    storeName: ticket.storeName,
    result: nextStatus === "closed" ? "ok" : "issue",
    comment: `Ticket SAV ${nextStatus === "closed" ? "cloture" : "reouvert"} - ${ticket.concern}`,
    confirmedBy: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString()
  });

  if (hasRemoteData()) {
    await syncSavStateToRemote();
  }
  saveState();
  render();
}

function handleGsmAdd(event) {
  const button = event.currentTarget;
  const storeId = Number(button.getAttribute("data-gsm-add"));
  const store = state.stores.find((entry) => entry.id === storeId);
  if (!store) {
    return;
  }

  const workflow = ensureStoreWorkflowData(store);
  const rows = getGsmRows(store);
  rows.push({
    id: `gsm-${Date.now()}`,
    model: "",
    mobileNumber: "",
    mobileNetwork: "",
    iccid: "",
    puk: "",
    extensionLinked: "",
    user: "",
    callGroup: ""
  });
  workflow.gsmRows = rows;
  saveState();
  render();
}

async function handleSavRowStatusUpdate(event) {
  const button = event.currentTarget;
  const ticketId = button.getAttribute("data-sav-row-apply");
  const ticket = state.tickets.find((entry) => entry.id === ticketId);
  if (!ticket) {
    return;
  }
  const statusField = projectTableBody.querySelector(`[data-sav-row-status="${ticketId}"]`);
  const nextStatus = statusField?.value || ticket.status;
  if (nextStatus === ticket.status) {
    return;
  }

  ticket.status = nextStatus;
  ticket.updates.push({
    id: `${ticket.id}-u-${Date.now()}`,
    authorName: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString(),
    note: `Statut change vers ${ticketStatusLabel(nextStatus)} depuis la vue SAV.`
  });

  if (hasRemoteData()) {
    await syncSavStateToRemote();
  }
  saveState();
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

  if (hasRemoteData()) {
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
  if (hasRemoteData()) {
    await syncSettingsToRemote();
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
  if (hasRemoteData()) {
    for (const person of state.people.filter((entry) => entry.role === nextRole)) {
      await syncPersonToRemote(person);
    }
    await syncSettingsToRemote();
    await loadRemoteState();
  }
  saveState();
  render();
}

function normalizePin(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 6);
}

function firstAccessibleTabForUser(user = currentUser()) {
  const tabs = accessibleTabsForUser(user);
  if (tabs.includes("*")) {
    return "dashboard";
  }
  return tabs[0] || "dashboard";
}

function ensureValidActiveTab() {
  if (!canAccessTab(state.activeAdminTab)) {
    state.activeAdminTab = firstAccessibleTabForUser();
  }
}

function loginAllowedForPerson(person) {
  if (!person) {
    return false;
  }
  if (person.pinStatus === "disabled" || person.pinStatus === "expired") {
    return false;
  }
  if (person.pinExpiresAt) {
    const expiry = new Date(`${person.pinExpiresAt}T23:59:59`);
    if (Date.now() > expiry.getTime()) {
      person.pinStatus = "expired";
      return false;
    }
  }
  return true;
}

async function handlePinSubmit(event) {
  event.preventDefault();
  const submittedPin = normalizePin(pinInput?.value);
  const pinCandidates = mergePeopleWithPinFallback(state.people);
  const emergencyCandidates = demoPinPeople();
  const matchedPerson = pinCandidates.find((person) => normalizePin(person.pin) === submittedPin)
    || emergencyCandidates.find((person) => normalizePin(person.pin) === submittedPin);

  if (!matchedPerson || !loginAllowedForPerson(matchedPerson)) {
    if (pinFeedback) {
      pinFeedback.textContent = "PIN invalide, desactive ou expire.";
    }
    return;
  }

  matchedPerson.loginHistory = [
    { at: new Date().toISOString(), source: window.location.hostname },
    ...(matchedPerson.loginHistory || [])
  ].slice(0, 20);

  state.activeUserName = matchedPerson.name;
  state.pinValidated = true;
  state.activeAdminTab = firstAccessibleTabForUser(matchedPerson);
  pinInput.value = "";
  if (pinFeedback) {
    pinFeedback.textContent = "";
  }

  state.people = mergePeopleWithPinFallback(state.people);
  const currentStatePerson = state.people.find((person) => (person.email || person.name).toLowerCase() === (matchedPerson.email || matchedPerson.name).toLowerCase());
  const hydratedMatch = hydrateAccessProfile(matchedPerson);
  if (currentStatePerson) {
    currentStatePerson.loginHistory = hydratedMatch.loginHistory;
    currentStatePerson.pin = hydratedMatch.pin;
    currentStatePerson.pinStatus = hydratedMatch.pinStatus;
  } else {
    state.people.push(hydratedMatch);
  }

  if (hasRemoteData()) {
    await syncPersonToRemote(currentStatePerson || hydratedMatch);
  }
  saveState();
  render();
}

async function handlePinAccessSubmit(event) {
  event.preventDefault();
  const name = pinPersonNameInput?.value.trim();
  const role = pinRoleSelect?.value;
  const pin = normalizePin(pinCodeInput?.value);
  if (!name || !role) {
    return;
  }

  const selectedStores = [...pinStoreMultiSelect.selectedOptions].map((option) => option.value);
  const editId = pinAccessForm.dataset.editPersonId;
  let target = editId
    ? state.people.find((person) => person.id === editId)
    : state.people.find((person) => person.name.toLowerCase() === name.toLowerCase());

  if (!target) {
    target = hydrateAccessProfile({
      id: `person-${Date.now()}`,
      name,
      role,
      phone: "",
      email: "",
      storeCode: selectedStores[0] || "",
      language: "fr"
    });
    state.people.push(target);
  }

  const finalPin = pin.length === 6 ? pin : (normalizePin(target.pin).length === 6 ? normalizePin(target.pin) : generateUniquePin());
  const duplicate = state.people.find((person) => person.id !== target.id && normalizePin(person.pin) === finalPin);
  if (duplicate) {
    window.alert("Ce PIN est deja attribue a une autre personne.");
    return;
  }

  target.name = name;
  target.role = role;
  target.pin = finalPin;
  target.storeCode = selectedStores[0] || target.storeCode || "";
  target.allowedStoreCodes = canSeeAllStores(target) ? ["*"] : selectedStores;
  target.accessibleTabs = accessibleTabsForUser(target).includes("*") ? ["*"] : defaultTabsForRole(role);
  target.pinStatus = pinStatusSelect?.value || "active";
  target.pinCreatedAt = target.pinCreatedAt || new Date().toISOString();
  target.pinExpiresAt = pinExpiryInput?.value || "";

  if (hasRemoteData()) {
    await syncPersonToRemote(target);
    await loadRemoteState();
  }

  pinAccessForm.reset();
  pinAccessForm.dataset.editPersonId = "";
  saveState();
  render();
}

function handleActiveUserChange(event) {
  state.activeUserName = event.target.value;
  state.roleViewUnlocked = true;
  state.pinValidated = true;
  ensureValidActiveTab();
  saveState();
  render();
}

function handleResetUserView() {
  state.activeUserName = preferredSupAdminViewName();
  state.roleViewUnlocked = false;
  state.pinValidated = true;
  ensureValidActiveTab();
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
    const nextTab = button.getAttribute("data-admin-tab");
    if (!canAccessTab(nextTab)) {
      return;
    }
    state.activeAdminTab = nextTab;
    saveState();
    render();
    return;
  }
}

async function handleVisibilityOverrideSubmit(event) {
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
  if (hasRemoteData()) {
    await syncSettingsToRemote();
  }
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
  set("sidebarTitle", t("navigation"));
  set("modeLabel", t("mode"));
  set("connectionLabel", t("connection"));
  set("searchLabel", t("search"));
  set("statusLabel", t("status"));
  set("stageLabel", state.language === "nl" ? "Stap" : "Etape");
  set("typeLabel", state.language === "nl" ? "Winkeltype" : "Type magasin");
  set("cityLabelTop", state.language === "nl" ? "Stad / regio" : "Ville / region");
  set("ownerLabel", t("owner"));
  set("userViewLabel", t("userView"));
  set("dateLabel", state.language === "nl" ? "Datum" : "Date");
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

  const generatedPin = generateUniquePin();
  const linkedStoreCode = personStoreCodeInput.value.trim().toUpperCase();
  state.people.push(hydrateAccessProfile({
    id: `person-${Date.now()}`,
    name,
    role,
    phone: personPhoneInput.value.trim(),
    email: personEmailInput.value.trim(),
    storeCode: linkedStoreCode,
    language: personLanguageSelect.value,
    pin: generatedPin,
    allowedStoreCodes: linkedStoreCode ? [linkedStoreCode] : (role === "manager" ? [] : ["*"]),
    pinCreatedAt: new Date().toISOString(),
    pinStatus: "active"
  }));

  if (hasRemoteData()) {
    await syncPersonToRemote(state.people.at(-1));
    await loadRemoteState();
  }
  personForm.reset();
  personLanguageSelect.value = "fr";
  saveState();
  render();
  window.alert(`PIN attribue a ${name}: ${generatedPin}`);
}

async function handleIntervenantSubmit(event) {
  event.preventDefault();
  const personId = intervenantPersonSelect?.value;
  const nextRole = intervenantRoleSelect?.value;
  const person = state.people.find((entry) => entry.id === personId);
  if (!person || !nextRole) {
    return;
  }

  person.role = nextRole;
  if (hasRemoteData()) {
    await syncPersonToRemote(person);
    await loadRemoteState();
  }
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

  if (hasRemoteData()) {
    await syncStoreToRemote(state.stores.at(-1));
    await loadRemoteState();
  }
  storeForm.reset();
  saveState();
  render();
}

async function handleToolSubmit(event) {
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

  if (hasRemoteData()) {
    await syncSettingsToRemote();
  }
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
    console.error("Magic link error", error);
    window.alert(`Envoi impossible: ${describeAppwriteError(error)}`);
  }
}

async function handleLogout() {
  if (isAppwriteMode && appwriteAccount) {
    await appwriteAccount.deleteSession("current");
  }
  if (isSupabaseMode && supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  state.pinValidated = false;
  state.activeUserName = state.people.find((person) => person.role === "supadmin_twem")?.name || state.people[0]?.name || "";
  state.activeAdminTab = "dashboard";
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

stageFilter.addEventListener("change", (event) => {
  state.filters.stage = event.target.value;
  renderStores();
});

typeFilter.addEventListener("change", (event) => {
  state.filters.type = event.target.value;
  renderStores();
});

cityFilter.addEventListener("change", (event) => {
  state.filters.city = event.target.value;
  renderStores();
});

dateFilter.addEventListener("change", (event) => {
  state.filters.date = event.target.value;
  renderStores();
});

pinForm?.addEventListener("submit", handlePinSubmit);
pinAccessForm?.addEventListener("submit", handlePinAccessSubmit);
authForm.addEventListener("submit", handleAuthSubmit);
logoutButton.addEventListener("click", handleLogout);
activeUserSelect.addEventListener("change", handleActiveUserChange);
languageSelect.addEventListener("change", handleLanguageChange);
visibilityRoleSelect?.addEventListener("change", (event) => {
  state.visibilityEditorRole = event.target.value;
  saveState();
  renderVisibilityEditor();
});
resetUserViewButton?.addEventListener("click", handleResetUserView);
quickReturnViewButton?.addEventListener("click", handleResetUserView);
pinPersonNameInput?.addEventListener("change", syncPinAccessFromSelectedPerson);
pinPersonNameInput?.addEventListener("blur", syncPinAccessFromSelectedPerson);
pinStoreSearchInput?.addEventListener("input", filterPinStoreOptions);
personForm.addEventListener("submit", handlePersonSubmit);
intervenantForm?.addEventListener("submit", handleIntervenantSubmit);
storeForm.addEventListener("submit", handleStoreSubmit);
adminTabs.addEventListener("click", handleAdminTabClick);
peopleSearchInput.addEventListener("input", (event) => {
  state.contactSearch = event.target.value.trim().toLowerCase();
  saveState();
  renderPeopleList();
});
roleForm.addEventListener("submit", handleRoleSubmit);
toolForm.addEventListener("submit", handleToolSubmit);
automationList?.addEventListener("change", handleAutomationFieldChange);
automationList?.addEventListener("input", handleAutomationFieldChange);
visibilityOverrideForm?.addEventListener("submit", handleVisibilityOverrideSubmit);
projectTableBody.addEventListener("click", handleNetworkConfirm);
importButton.addEventListener("click", handleImportButtonClick);
importInput.addEventListener("change", handleImportInputChange);
reportButton.addEventListener("click", handleReportButtonClick);
tabImportButton?.addEventListener("click", handleImportButtonClick);
tabImportStoresButton?.addEventListener("click", () => triggerImport("stores"));
tabImportTelephonyButton?.addEventListener("click", () => triggerImport("telephony"));
tabImportExtensionsButton?.addEventListener("click", () => triggerImport("extensions"));
tabExportButton?.addEventListener("click", () => safeRunExport(exportJsonData));
tabExportStoresCheckXlsxButton?.addEventListener("click", () => safeRunExport(exportStoresCheckXlsx));
tabExportStoresXlsxButton?.addEventListener("click", () => safeRunExport(exportStoresXlsx));
tabExportStoresPdfButton?.addEventListener("click", () => safeRunExport(exportStoresPdf));
tabExportExtensionsXlsxButton?.addEventListener("click", () => safeRunExport(exportExtensionsXlsx));
tabExportExtensionsPdfButton?.addEventListener("click", () => safeRunExport(exportExtensionsPdf));

async function init() {
  const stored = loadState();
  state.stores = stored.stores;
  state.activities = stored.activities;
  state.people = stored.people;
  state.activeUserName = stored.activeUserName;
  state.language = stored.language || "fr";
  state.activeAdminTab = stored.activeAdminTab || "dashboard";
  state.pinValidated = false;
  state.toolItems = stored.toolItems || [];
  state.accessOverrides = stored.accessOverrides || [];
  state.roleOptions = normalizedRoleOptions(stored.roleOptions);
  state.automations = normalizedAutomations(stored.automations);
  state.roleVisibilityConfig = stored.roleVisibilityConfig || {};
  state.visibilityEditorRole = stored.visibilityEditorRole || "supadmin_twem";
  state.roleViewUnlocked = Boolean(stored.roleViewUnlocked);
  state.contactSearch = stored.contactSearch || "";
  state.importExportHistory = cleanImportHistory(stored.importExportHistory || []);
  state.people = stripKnownTestPeople(state.people);
  state.tickets = stripKnownTestTickets(state.tickets);
  document.documentElement.lang = state.language;

  if (hasImportedStoreSet(state.stores)) {
    state.stores = resetImportedStoresForKickoff(state.stores);
    state.people = cleanPeopleForImportedStores(state.people, state.stores);
  }

  const queryUserName = preferredUserFromQuery();
  if (queryUserName) {
    state.activeUserName = queryUserName;
    state.pinValidated = presentationBypassUsers.includes(queryUserName);
    state.activeAdminTab = "dashboard";
  } else if (presentationBypassUsers.length) {
    state.activeUserName = state.people.find((person) => person.name === state.activeUserName)?.name
      || state.people.find((person) => person.name === "Valou")?.name
      || state.people.find((person) => person.name === "Emir")?.name
      || state.activeUserName;
    state.pinValidated = true;
    state.activeAdminTab = "dashboard";
  }

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
      if (hasAppwriteDataConfig) {
        await loadRemoteState();
        await setupRealtime();
        setupAppwritePolling();
      }
    } catch (error) {
      state.connectionState = "fallback";
      console.error("Appwrite init error", error);
    }
  }

  ensureValidActiveTab();
  render();
}

init();

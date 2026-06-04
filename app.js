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
  "900 - zaagmachine",
  "901 - tuin",
  "902 - verf",
  "903 - keukens",
  "904 - tegels",
  "922 - front end evacuation",
  "923 - safe room",
  "924 - drive in till zone"
];
const groupedCallExtensionNumbers = new Set(["300", "310", "320", "330", "340", "350", "360", "370", "380", "390"]);
const groupedCallExtensionCategoryLabel = "Extension d'appel groupé";

function extensionCategoryKey(category) {
  const normalized = normalizeImportCell(category).toLowerCase();
  if (normalized.includes("appel groupe") || normalized.includes("group")) return "grouped-call";
  if (normalized.includes("panic") || normalized.includes("panique")) return "panic";
  if (normalized.includes("appel") || normalized.includes("call")) return "call";
  if (normalized.includes("flash")) return "flash";
  if (normalized.includes("fixed") || normalized.includes("fixe")) return "fixed";
  if (normalized.includes("mobile")) return "mobile";
  return "other";
}

function isGroupedCallExtension(row) {
  return groupedCallExtensionNumbers.has(normalizeExtensionNumber(row?.number));
}

function extensionDisplayCategoryKey(row) {
  return isGroupedCallExtension(row) ? "grouped-call" : extensionCategoryKey(row?.category);
}

function extensionDisplayCategoryLabel(row) {
  return isGroupedCallExtension(row) ? groupedCallExtensionCategoryLabel : normalizeImportCell(row?.category || "Extension");
}

function isSelectableExtensionRow(row) {
  return !isGroupedCallExtension(row);
}

function extensionRowsForCategory(categoryFilter = "") {
  const targetKey = extensionCategoryKey(categoryFilter);
  return extensionCatalogRows
    .filter((row) => {
      const rowKey = extensionDisplayCategoryKey(row);
      if (!categoryFilter) return true;
      if (targetKey === "grouped-call") return rowKey === "grouped-call";
      if (rowKey === "grouped-call") return false;
      if (targetKey === "fixed" || targetKey === "mobile") return rowKey === "fixed" || rowKey === "mobile";
      if (targetKey === "flash") return rowKey === "flash";
      if (targetKey === "call") return rowKey === "call";
      if (targetKey === "panic") return rowKey === "panic";
      return true;
    })
    .slice()
    .sort((left, right) => {
      const leftLabel = getExtensionPreferredLabel(left, "fr").toLowerCase();
      const rightLabel = getExtensionPreferredLabel(right, "fr").toLowerCase();
      const leftNumber = normalizeImportCell(left.number);
      const rightNumber = normalizeImportCell(right.number);
      if (targetKey === "fixed" || targetKey === "mobile") {
        return leftLabel.localeCompare(rightLabel, "fr", { sensitivity: "base" })
          || leftNumber.localeCompare(rightNumber, "fr", { numeric: true, sensitivity: "base" });
      }
      return leftNumber.localeCompare(rightNumber, "fr", { numeric: true, sensitivity: "base" })
        || leftLabel.localeCompare(rightLabel, "fr", { sensitivity: "base" });
    });
}

function normalizeLanguageCode(value) {
  const normalized = normalizeImportCell(value).toLowerCase();
  if (normalized.startsWith("nl")) return "nl";
  if (normalized.startsWith("en") || normalized.startsWith("ang")) return "en";
  return "fr";
}

function normalizeExtensionNumber(value) {
  const normalized = normalizeImportCell(value);
  return /^\d+\.0$/.test(normalized) ? normalized.slice(0, -2) : normalized;
}

function getExtensionPreferredLabel(row, language = "fr") {
  const normalizedLanguage = normalizeLanguageCode(language);
  const labelFr = normalizeImportCell(row?.labelFr || row?.label_fr || row?.labelFR || row?.label);
  const labelNl = normalizeImportCell(row?.labelNl || row?.label_nl || row?.labelNL || row?.label);
  const labelEn = normalizeImportCell(row?.labelEn || row?.label_en || row?.labelEN || row?.label);
  if (normalizedLanguage === "nl") {
    return labelNl || labelFr || labelEn || "";
  }
  if (normalizedLanguage === "en") {
    return labelEn || labelFr || labelNl || "";
  }
  return labelFr || labelNl || labelEn || "";
}

function extensionReferenceText(row, language = "fr") {
  const number = normalizeImportCell(row?.number);
  const label = getExtensionPreferredLabel(row, language);
  if (!number && !label) {
    return "";
  }
  return label ? `${number} - ${label}` : number;
}

function availableExtensionReferenceOptions(categoryFilter = "", language = "fr") {
  const targetKey = extensionCategoryKey(categoryFilter);
  const importedOptions = extensionRowsForCategory(categoryFilter)
    .filter(isSelectableExtensionRow)
    .slice()
    .sort((left, right) => {
      const leftLabel = getExtensionPreferredLabel(left, language).toLowerCase();
      const rightLabel = getExtensionPreferredLabel(right, language).toLowerCase();
      const leftNumber = normalizeImportCell(left.number);
      const rightNumber = normalizeImportCell(right.number);
      if (targetKey === "fixed" || targetKey === "mobile") {
        return leftLabel.localeCompare(rightLabel, "fr", { sensitivity: "base" })
          || leftNumber.localeCompare(rightNumber, "fr", { numeric: true, sensitivity: "base" });
      }
      return leftNumber.localeCompare(rightNumber, "fr", { numeric: true, sensitivity: "base" })
        || leftLabel.localeCompare(rightLabel, "fr", { sensitivity: "base" });
    })
    .map((row) => extensionReferenceText(row, language))
    .filter(Boolean);

  return importedOptions.length ? importedOptions : extensionReferenceOptions;
}

const notApplicableExtensionOption = "NVT - Non applicable / Niet van toepassing / Not applicable";
const defaultPanicButtonExtensions = {
  1: "922 - FRONT END EVACUATION",
  2: "923 - SAFE ROOM"
};
const defaultFlashLightExtensions = {
  1: "932 - SAFE ROOM DRIVE IN(coffre/koffer drive in )",
  2: "933 - MERCHANDISE RECEPTION",
  3: "931 - SAFE ROOM(Coffre/ koffer safe room)",
  4: "930 - BRICO SERVICE"
};

function defaultNetworkExtensionForRow(row = {}) {
  const match = String(row.id || row.slotLabel || "").match(/(\d+)$/);
  const index = match ? Number(match[1]) : 0;
  if (row.category === "Panic button") {
    return defaultPanicButtonExtensions[index] || "";
  }
  if (row.category === "Flash light") {
    return defaultFlashLightExtensions[index] || "";
  }
  return "";
}

function networkExtensionOptionsForCategory(categoryFilter = "", language = "fr", selected = "") {
  const options = [notApplicableExtensionOption, ...availableExtensionReferenceOptions(categoryFilter, language)];
  const selectedValue = normalizeImportCell(selected);
  if (selectedValue && !options.includes(selectedValue)) {
    options.unshift(selectedValue);
  }
  return [...new Set(options)];
}

function normalizeExtensionCatalogRow(row, index = 0) {
  const fallbackLabel = normalizeImportCell(
    row.label
    || row.libelle
    || row.lieu
    || row["Last name*"]
    || row.Departement
    || ""
  );
  return {
    category: normalizeImportCell(
      row.category
      || row.Category
      || row.Categorie
      || row.categorie
      || row.type
      || row.Type
      || "Extension"
    ),
    model: normalizeImportCell(row.model || row.modele || row.Model || row.Modele || ""),
    number: normalizeExtensionNumber(
      row.number
      || row.Number
      || row.Numero
      || row.numero
      || row.extension
      || row["NEW NUMBER"]
      || row["Extension*OLD"]
      || `EXT-${index + 1}`
    ),
    label: fallbackLabel,
    labelFr: normalizeImportCell(
      row.labelFr
      || row.label_fr
      || row["Libelle FR"]
      || row["label fr"]
      || row["Label FR"]
      || row["libelle fr"]
      || row["libelle fr_be"]
      || row["FR"]
      || ""
    ),
    labelNl: normalizeImportCell(
      row.labelNl
      || row.label_nl
      || row["Libelle NL"]
      || row["label nl"]
      || row["Label NL"]
      || row["libelle nl"]
      || row["NL"]
      || ""
    ),
    labelEn: normalizeImportCell(
      row.labelEn
      || row.label_en
      || row["Libelle EN"]
      || row["label en"]
      || row["Label EN"]
      || row["libelle en"]
      || row["EN"]
      || ""
    ),
    oldNumber: normalizeImportCell(
      row.oldNumber
      || row.old_number
      || row["ancien numero"]
      || row.ancien_numero
      || row["ancien numÃ©ro"]
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
  };
}
const storeRequestTypeOptions = [
  "SAV",
  "Demande d'info",
  "Commande materiel casse",
  "Commande materiel supplementaire"
];
const storeMaterialOptions = [
  "Bouton Appel",
  "HELIOS IP Verso1 B PoE / Fixed",
  "VVX250 / Fixed",
  "VVX411 + MOD / Fixed",
  "VVX450 + MOD / Flash light",
  "ALGO 8128 SIP FLASH / Mobile",
  "HAmerLT / ALGO PLAGER",
  "Algo 8180 Loud ringer & voice"
];
const extraMaterialWorkflowOptions = [
  "Demande creee",
  "En attente direction",
  "Refusee",
  "Validee",
  "N de commande recu",
  "Commande passee"
];

function isOperationalIntervenant(person) {
  const role = canonicalRoleKey(person?.role);
  const globalOperationalRoles = ["twem", "brico"];
  return Boolean(
    person
    && normalizeImportCell(person.name)
    && (isIntervenantRole(role) || globalOperationalRoles.includes(role))
  );
}

function intervenantPeopleForSelection(selectedNames = []) {
  const selectedSet = new Set((selectedNames || []).map((name) => normalizeImportCell(name).toLowerCase()).filter(Boolean));
  return [...(state.people || [])]
    .filter((person) => isOperationalIntervenant(person) || selectedSet.has(normalizeImportCell(person?.name).toLowerCase()))
    .sort((left, right) => normalizeImportCell(left.name).localeCompare(normalizeImportCell(right.name), "fr", { sensitivity: "base" }));
}

function savPersonOptions(store = null, selectedNames = []) {
  const people = intervenantPeopleForSelection(selectedNames);
  const seen = new Set();
  return people
    .filter((person) => {
      const name = normalizeImportCell(person.name);
      if (!name || seen.has(name.toLowerCase())) {
        return false;
      }
      seen.add(name.toLowerCase());
      return true;
    })
    .map((person) => {
      const role = roleLabel(person.role || "");
      const storeCode = normalizeImportCell(person.storeCode);
      const details = [role, storeCode && store?.code !== storeCode ? storeCode : ""].filter(Boolean).join(" - ");
      return {
        value: person.name,
        label: details ? `${person.name} (${details})` : person.name
      };
    });
}

function ticketTargetPeople(ticket = {}) {
  const rawPeople = Array.isArray(ticket.targetPeople)
    ? ticket.targetPeople
    : Array.isArray(ticket.targetPersonNames)
      ? ticket.targetPersonNames
      : [];
  const people = rawPeople
    .map((value) => normalizeImportCell(value))
    .filter(Boolean);
  if (people.length) {
    return [...new Set(people)];
  }
  const legacyTarget = normalizeImportCell(ticket.targetService);
  if (!legacyTarget) {
    return [];
  }
  return legacyTarget
    .split(/[,;|]/)
    .map((value) => normalizeImportCell(value))
    .filter(Boolean);
}

function ticketTargetLabel(ticket = {}) {
  return ticketTargetPeople(ticket).join(", ")
    || normalizeImportCell(ticket.targetService)
    || (["new", "dispatch"].includes(ticket.status) ? "TWEM a dispatcher" : "Personne a definir");
}

function renderSavPersonCheckboxes(store) {
  const options = savPersonOptions(store);
  if (!options.length) {
    return '<div class="empty-state sav-empty">Aucune personne disponible dans les contacts.</div>';
  }
  return options.map((option) => `
    <label class="sav-person-option">
      <input type="checkbox" name="new_ticket_people" value="${escapeHtml(option.value)}">
      <span>${escapeHtml(option.label)}</span>
    </label>
  `).join("");
}

function renderSavDispatchCheckboxes(store, selectedNames = [], inputName = "sav_dispatch_people") {
  const selectedSet = new Set((selectedNames || []).map((name) => normalizeImportCell(name).toLowerCase()).filter(Boolean));
  const options = savPersonOptions(store, selectedNames);
  if (!options.length) {
    return '<div class="empty-state sav-empty">Aucune personne disponible dans les contacts.</div>';
  }
  return options.map((option) => {
    const checked = selectedSet.has(normalizeImportCell(option.value).toLowerCase()) ? "checked" : "";
    return `
      <label class="sav-person-option">
        <input type="checkbox" name="${escapeHtml(inputName)}" value="${escapeHtml(option.value)}" ${checked}>
        <span>${escapeHtml(option.label)}</span>
      </label>
    `;
  }).join("");
}

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
  "direction_brico",
  "supmanager",
  "manager",
  "magasin",
  "telephonie_destiny",
  "pm_dstny",
  "uc_pm_fr_nl_dstny",
  "uc_tech_fr_nl_dstny",
  "logistic_coord_dstny"
];
const defaultIntervenantRoleOptions = ["telephonie_destiny", "pm_dstny", "uc_pm_fr_nl_dstny", "uc_tech_fr_nl_dstny", "logistic_coord_dstny"];
const tutorialVideosSettingsItemId = "__tutorial_videos__";
const technicalSheetsSettingsItemId = "__technical_sheets__";
const automationEmailsSettingsItemId = "__automation_emails__";
const mailerStateSettingsItemId = "__mailer_state__";
const defaultTutorialVideos = [
  {
    key: "network_info",
    title: "Configuration réseau",
    description: "Choisissez les extensions souhaitées sur les téléphones fixes, les téléphones mobiles, les flash buttons, les call buttons et les autres équipements, puis enregistrez."
  },
  {
    key: "orders_material",
    title: "Pré-visite",
    description: "Indiquez les informations VLAN, switch, réseau présent et câblage, ajoutez la date de constat, choisissez le statut, commentez si utile pour aider l'équipe, puis enregistrez."
  },
  {
    key: "first_login",
    title: "Quelques onglets",
    description: "Voici les onglets d'aide et de vue générale disponibles selon votre rôle et vos accès."
  },
  {
    key: "planning",
    title: "Rendez-vous",
    description: "Demandez un rendez-vous, mettez-le en proposition et la personne invitée pourra ensuite le confirmer."
  },
  {
    key: "create_sav",
    title: "SAV",
    description: "Cette section permet de signaler un SAV, faire une demande d'info, demander un remplacement ou demander du matériel supplémentaire."
  }
];
const defaultTechnicalSheets = [];
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
    responseDelayHours: 12,
    escalationHours: 4,
    repeatHours: 4,
    maxEscalations: 3,
    finalAlertRecipient: "Valou / TWEM",
    linkTarget: "Lien vers l'élément concerné",
    languageMode: "Langue du contact",
    notes: "Nouvel élément magasin: relance au bout de 12h si le lien n'est pas consulté, puis 3 escalades espacées de 4h. Si toujours rien, prévenir Valou."
  },
  {
    id: "new_person_welcome",
    category: "access",
    title: "Création personne → envoi lien app + PIN",
    description: "Lorsqu'un nouveau contact est créé, lui envoyer automatiquement l'accès à l'application avec son code PIN dans la bonne langue.",
    active: false,
    trigger: "Création d'une nouvelle personne active",
    recipients: "Le nouveau contact uniquement",
    channels: "Mail d'accueil FR/NL",
    responseDelayHours: 24,
    escalationHours: 12,
    repeatHours: 0,
    maxEscalations: 1,
    finalAlertRecipient: "Valou / TWEM",
    linkTarget: "Lien vers l'application",
    languageMode: "FR / NL selon la fiche contact",
    notes: "Nouvel utilisateur: envoyer le lien app + PIN, faire une seule relance après 24h si aucune connexion, puis attendre 12h. Si toujours pas de connexion, prévenir Valou: l'accès ou le mail peut ne pas être arrivé."
  },
  {
    id: "install_reminder",
    category: "notifications",
    title: "Rappel avant installation",
    description: "Envoyer un rappel doux uniquement au responsable du magasin avant une installation planifiée.",
    active: false,
    trigger: "Date d'installation planifiée dans une fiche magasin",
    recipients: "Responsable du magasin uniquement",
    channels: "Mail doux FR/NL",
    responseDelayHours: 48,
    escalationHours: 24,
    repeatHours: 0,
    maxEscalations: 0,
    finalAlertRecipient: "",
    linkTarget: "Lien vers la fiche magasin",
    languageMode: "Langue du responsable magasin",
    notes: "Rappel doux au responsable du magasin uniquement: J-2 puis J-1 avant l'installation. Pas d'escalade automatique."
  },
  {
    id: "previsit_reminder",
    category: "notifications",
    title: "Rappel avant pre-visite",
    description: "Envoyer un mail au responsable du magasin lorsqu'une pre-visite reseau / VLAN / cablage / switch est planifiee.",
    active: false,
    trigger: "Date de pre-visite ou preparation externe planifiee dans une fiche magasin",
    recipients: "Responsable du magasin uniquement",
    channels: "Mail doux FR/NL",
    responseDelayHours: 48,
    escalationHours: 0,
    repeatHours: 0,
    maxEscalations: 0,
    finalAlertRecipient: "",
    linkTarget: "Lien vers la fiche magasin",
    languageMode: "Langue du responsable magasin",
    notes: "Prevenir le responsable magasin des qu'une date future est planifiee pour la pre-visite ou la preparation externe: VLAN, reseau, cablage, switch."
  },
  {
    id: "daily_operations_digest",
    category: "notifications",
    title: "Digest quotidien Emir + Valou",
    description: "Envoyer chaque matin a Emir et Valou le recap des installations du lendemain, des blocages et des SAV ouverts/en cours.",
    active: true,
    trigger: "Tous les matins a partir du 2026-05-22",
    recipients: "Emir + Valou",
    digestAdditionalRecipientIds: [],
    channels: "Mail quotidien",
    responseDelayHours: 9,
    escalationHours: 0,
    repeatHours: 24,
    maxEscalations: 0,
    finalAlertRecipient: "",
    linkTarget: "Planning, blocages et SAV",
    languageMode: "FR",
    notes: "A envoyer tous les matins: installations prevues le lendemain pour controle planning, magasins bloques, SAV ouverts et SAV en cours."
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
    responseDelayHours: 12,
    escalationHours: 4,
    repeatHours: 4,
    maxEscalations: 3,
    finalAlertRecipient: "Valou / TWEM",
    linkTarget: "Lien vers la fiche magasin",
    languageMode: "Langue de la personne relancée",
    notes: "Autre action ou événement: relance au bout de 12h si le lien n'est pas consulté, puis 3 escalades espacées de 4h. Si toujours rien, prévenir Valou."
  }
];
const futureAutomationIdeas = [
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
    key: "invoice",
    label: "Invoice",
    blocks: [
      { key: "invoice_po", label: "PO magasins", hint: "Numeros PO par magasin." },
      { key: "invoice_orders", label: "Commandes / facturation", hint: "A facturer, remplacement, statut commande et livraison." }
    ]
  },
  {
    key: "tuto",
    label: "TUTO",
    blocks: [
      { key: "tuto_videos", label: "Videos d'utilisation", hint: "Tutoriels courts par theme." },
      { key: "tuto_helpdesk", label: "Contacts support", hint: "Helpdesk, telephonie et support app." }
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
    people: "Nouveau contact",
    storeName: "Nom magasin affiche dans les listes",
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
    people: "Nieuw contact",
    storeName: "Winkelnaam in lijsten",
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

const nlUiTextMap = {
  "Navigation": "Navigatie",
  "Dashboard": "Dashboard",
  "Timeline / Planning": "Tijdlijn / Planning",
  "Magasins": "Winkels",
  "Configuration magasin": "Winkelconfiguratie",
  "SAV / Tickets": "SAV / Tickets",
  "Extensions": "Extensies",
  "Invoice": "Facturatie",
  "TUTO": "TUTO",
  "Contacts": "Contacten",
  "Rapports": "Rapporten",
  "Automatisations": "Automatiseringen",
  "Tools TWEM": "Tools TWEM",
  "PIN / Acces": "PIN / Toegang",
  "Import / Export": "Import / Export",
  "Qui voit quoi": "Wie ziet wat",
  "Recherche": "Zoeken",
  "Statut": "Status",
  "Etape": "Stap",
  "Type magasin": "Winkeltype",
  "Ville / region": "Stad / regio",
  "Provenance": "Herkomst",
  "Date": "Datum",
  "Langue": "Taal",
  "Tous": "Alle",
  "Toutes": "Alle",
  "A commencer": "Te starten",
  "En cours": "Bezig",
  "Termine": "Voltooid",
  "Termines": "Voltooid",
  "Bloque": "Geblokkeerd",
  "Bloques": "Geblokkeerd",
  "Sans rendez-vous": "Zonder afspraak",
  "Aujourd hui": "Vandaag",
  "Cette semaine": "Deze week",
  "En retard": "Te laat",
  "Futur": "Toekomst",
  "Import fichier": "Bestand importeren",
  "Creation / impression rapport": "Rapport maken / afdrukken",
  "Imprimer la liste affichee": "Getoonde lijst afdrukken",
  "Imprimer la fiche complete": "Volledige fiche afdrukken",
  "Imprimer": "Afdrukken",
  "Voir fiche": "Fiche bekijken",
  "Voir la fiche": "Fiche bekijken",
  "Fermer fiche": "Fiche sluiten",
  "Ouvrir la configuration": "Configuratie openen",
  "Enregistrer ce magasin": "Winkel opslaan",
  "Sauvegarder ce bloc": "Blok opslaan",
  "Sauvegarder la preparation": "Voorbereiding opslaan",
  "Confirmer / envoyer": "Bevestigen / verzenden",
  "Modifier": "Wijzigen",
  "Supprimer": "Verwijderen",
  "Desactiver": "Deactiveren",
  "Activer": "Activeren",
  "Envoyer mail": "Mail verzenden",
  "Mail envoye": "Mail verzonden",
  "Jamais": "Nooit",
  "Derniere connexion": "Laatste verbinding",
  "Expiration": "Vervaldatum",
  "Mail acces": "Toegangsmail",
  "Acces envoye": "Toegang verzonden",
  "Acces pas encore envoye": "Toegang nog niet verzonden",
  "Diffusion progressive": "Gefaseerde verspreiding",
  "Historique des acces PIN": "Historiek PIN-toegang",
  "Nom": "Naam",
  "Telephone": "Telefoon",
  "Mail": "Mail",
  "Role": "Rol",
  "Magasin lie": "Gekoppelde winkel",
  "Nouveau contact": "Nieuw contact",
  "Liste des contacts": "Contactenlijst",
  "Ajouter une personne": "Persoon toevoegen",
  "Ajouter le role": "Rol toevoegen",
  "Ajouter un magasin": "Winkel toevoegen",
  "Nom magasin": "Winkelnaam",
  "Nom du magasin": "Winkelnaam",
  "N du magasin": "Winkelnummer",
  "Responsable magasin": "Winkelverantwoordelijke",
  "Responsable": "Verantwoordelijke",
  "Demandeur": "Aanvrager",
  "Materiel concerne / commande": "Betrokken materiaal / bestelling",
  "Ce que ca concerne": "Waarover gaat het",
  "Type de demande": "Type aanvraag",
  "Quantite demandee": "Gevraagde hoeveelheid",
  "Note explicative libre": "Vrije toelichting",
  "Aucun ticket SAV pour ce magasin pour le moment.": "Nog geen SAV-ticket voor deze winkel.",
  "Documents / Plan magasin": "Documenten / winkelplan",
  "Aucun plan PDF importe": "Geen PDF-plan geimporteerd",
  "Importer le plan PDF": "PDF-plan importeren",
  "Remplacer le document": "Document vervangen",
  "Ouvrir le PDF": "PDF openen",
  "Telecharger le ZIP": "ZIP downloaden",
  "Statut global": "Globale status",
  "Probleme / notes": "Probleem / notities",
  "Quantites magasin": "Winkelhoeveelheden",
  "Licences": "Licenties",
  "Postes fixes": "Vaste toestellen",
  "Mobiles": "Mobiele toestellen",
  "Mobile smartphone": "Mobiele smartphone",
  "Flash light": "Flashlight",
  "Call buttons": "Call buttons",
  "Panic buttons": "Panic buttons",
  "Preparation chantier": "Werfvoorbereiding",
  "Preparation externe": "Externe voorbereiding",
  "Installation": "Installatie",
  "Couverture mobile": "Mobiele dekking",
  "Cablage": "Bekabeling",
  "Date cablage": "Datum bekabeling",
  "Date switch": "Datum switch",
  "Nouvelle remarque preparation externe": "Nieuwe opmerking externe voorbereiding",
  "Nouvelle remarque installation": "Nieuwe opmerking installatie",
  "Aucune remarque enregistree.": "Geen opmerking opgeslagen.",
  "Elements confirmes": "Bevestigde elementen",
  "Coordination Destiny": "Coordination Destiny",
  "Pre-visite": "Pre-visit",
  "Previsite OK": "Pre-visit OK",
  "Previsite a suivre": "Pre-visit op te volgen",
  "Configuration reseau": "Netwerkconfiguratie",
  "Configuration complete": "Configuratie volledig",
  "Configuration incomplete": "Configuratie onvolledig",
  "Choix telephonie": "Telefoniekeuze",
  "Config OK": "Config OK",
  "Config a faire": "Config te doen",
  "VLAN22 OK": "VLAN22 OK",
  "VLAN22 a valider": "VLAN22 te valideren",
  "Infra a valider": "Infra te valideren",
  "Pre-visite OK": "Pre-visit OK",
  "Pre-visite a faire": "Pre-visit te doen",
  "Installation a faire": "Installatie te doen",
  "Winkelopvolging telefonie": "Winkelopvolging telefonie",
  "Base de suivi globale": "Globale opvolgbasis",
  "Type magasin DOS": "Winkeltype DOS",
  "Type magasin FOS": "Winkeltype FOS",
  "Type magasin FOSDOS": "Winkeltype FOSDOS",
  "Interventions prevues": "Geplande interventies",
  "Magasins avec SAV": "Winkels met SAV",
  "Chantiers clotures": "Afgesloten werven",
  "Dossiers a debloquer": "Dossiers te deblokkeren",
  "Statut projets": "Projectstatus",
  "A lancer": "Op te starten",
  "En attente infos": "Wachten op info",
  "Validation VLAN22": "Validatie VLAN22",
  "Validation Infra": "Validatie Infra",
  "PO attente": "PO in afwachting",
  "Tickets urgents": "Dringende tickets",
  "Dossiers a demarrer": "Dossiers op te starten",
  "Config magasin attendue": "Winkelconfig verwacht",
  "VLAN22 a valider": "VLAN22 te valideren",
  "Cablage / alarme": "Bekabeling / alarm",
  "Commandes a relancer": "Bestellingen op te volgen",
  "SAV prioritaire": "Prioritaire SAV",
  "Mail libre / lancement app": "Vrije mail / lancering app",
  "Destinataires": "Ontvangers",
  "Objet FR": "Onderwerp FR",
  "Texte FR": "Tekst FR",
  "Objet NL": "Onderwerp NL",
  "Texte NL": "Tekst NL",
  "Ouvrir Outlook": "Outlook openen",
  "Copier destinataires + texte": "Ontvangers + tekst kopieren",
  "Reinitialiser le brouillon": "Concept resetten"
};

const nlUiPhraseMap = {
  "Vue d ensemble": "Overzicht",
  "Vue de pilotage rapide des besoins reseau et materiel du magasin.": "Snelle opvolging van netwerk- en materiaalbehoeften van de winkel.",
  "Recap configuration et preparation": "Samenvatting configuratie en voorbereiding",
  "Vue synthetique des demandes transmises et des elements deja confirmes.": "Synthetisch overzicht van verzonden aanvragen en reeds bevestigde elementen.",
  "Demandes transmises": "Verzonden aanvragen",
  "Elements confirmes": "Bevestigde elementen",
  "Demande configuration": "Configuratieaanvraag",
  "Commande articles": "Bestelling artikelen",
  "Mail configuration": "Configuratiemail",
  "Ticket Destiny": "Destiny-ticket",
  "Date telephonie actuelle": "Huidige telefoniedatum",
  "Configuration VLAN22": "VLAN22-configuratie",
  "Reference recue": "Referentie ontvangen",
  "A envoyer": "Te verzenden",
  "A confirmer": "Te bevestigen",
  "A renseigner": "In te vullen",
  "En attente": "In afwachting",
  "Confirmee": "Bevestigd",
  "Confirmes": "Bevestigd",
  "Oui": "Ja",
  "Non": "Nee",
  "Fait": "Gedaan",
  "Termine": "Voltooid",
  "Configure": "Geconfigureerd",
  "Postes magasin": "Winkeltoestellen",
  "ligne(s) configuree(s)": "lijn(en) geconfigureerd",
  "ligne(s) configure(s)": "lijn(en) geconfigureerd",
  "Les choix enregistres dans Configuration magasin remonteront ici des qu ils seront completes.": "De keuzes die in Winkelconfiguratie worden opgeslagen, verschijnen hier zodra ze volledig zijn.",
  "Les choix enregistres dans Configuration magasin remonteront ici des qu'ils seront completes.": "De keuzes die in Winkelconfiguratie worden opgeslagen, verschijnen hier zodra ze volledig zijn.",
  "Choix telephonie confirmes et visibles ici sans devoir ouvrir l onglet configuration.": "Bevestigde telefoniekeuzes zijn hier zichtbaar zonder de configuratietab te openen.",
  "Configuration detaillee": "Gedetailleerde configuratie",
  "Lecture directe de toute la configuration sans devoir repasser par l onglet Configuration magasin.": "Directe lezing van de volledige configuratie zonder terug te gaan naar de tab Winkelconfiguratie.",
  "Type d alarme": "Type alarm",
  "Type d'alarme": "Type alarm",
  "Societe": "Bedrijf",
  "Tel centrale alarme": "Telefoon alarmcentrale",
  "Autres": "Andere",
  "Groupes d appel et cascades": "Oproepgroepen en cascades",
  "Groupes d appel": "Oproepgroepen",
  "Groupes d'appel": "Oproepgroepen",
  "Cascades": "Cascades",
  "Cloture installation Destiny": "Afsluiting installatie Destiny",
  "Validation de fin d intervention et remarques de chantier apres installation.": "Validatie einde interventie en werfopmerkingen na installatie.",
  "Installation Destiny terminee": "Installatie Destiny voltooid",
  "Mail de fin equipe Brico": "Eindmail team Brico",
  "Retour Brico / bascule": "Feedback Brico / omschakeling",
  "Remarques finales du magasin et eventuelle bascule vers la plateforme": "Eindopmerkingen van de winkel en eventuele omschakeling naar het platform",
  "Remarques finales": "Eindopmerkingen",
  "Ligne du temps": "Tijdlijn",
  "Chronologie des rendez-vous programmes pour ce magasin.": "Chronologie van de geplande afspraken voor deze winkel.",
  "Aucun rendez-vous programme.": "Geen afspraak gepland.",
  "Rendez-vous pris": "Gemaakte afspraken",
  "Plusieurs rendez-vous et plusieurs jours d installation possibles par magasin.": "Meerdere afspraken en installatiedagen mogelijk per winkel.",
  "Aucun rendez-vous pour ce magasin.": "Geen afspraak voor deze winkel.",
  "Nouveau rendez-vous": "Nieuwe afspraak",
  "Personnes concernees": "Betrokken personen",
  "Note rendez-vous": "Opmerking afspraak",
  "Confirmer / envoyer": "Bevestigen / verzenden",
  "Demande SAV / ticket": "SAV-aanvraag / ticket",
  "Les demandes arrivent d abord chez TWEM. Emir ou Valou dispatchent ensuite vers la bonne personne avant intervention.": "Aanvragen komen eerst bij TWEM terecht. Emir of Valou sturen ze daarna door naar de juiste persoon voor interventie.",
  "La demande sera envoyee a Emir et Valou pour dispatch.": "De aanvraag wordt naar Emir en Valou gestuurd voor dispatch.",
  "Reception TWEM": "Ontvangst TWEM",
  "N de magasin": "Winkelnummer",
  "Nom du magasin": "Winkelnaam",
  "Type de demande": "Type aanvraag",
  "Ce que ca concerne": "Waarover gaat het",
  "Materiel concerne / commande": "Betrokken materiaal / bestelling",
  "Extension liee": "Gekoppelde extensie",
  "Quantite demandee": "Gevraagde hoeveelheid",
  "Workflow materiel supplementaire": "Workflow extra materiaal",
  "Note explicative libre": "Vrije toelichting",
  "Choisir un materiel": "Kies materiaal",
  "Choisir une extension": "Kies een extensie",
  "Demande creee": "Aanvraag aangemaakt",
  "Poste fixe": "Vast toestel",
  "Mobile": "Mobiel",
  "Quantites magasin": "Winkelhoeveelheden",
  "Licences": "Licenties",
  "Postes fixes": "Vaste toestellen",
  "Fix big": "Fix big",
  "Mobiles": "Mobiele toestellen",
  "Mobile smartphone": "Mobiele smartphone",
  "Date telephonie actuelle": "Huidige telefoniedatum",
  "IP range": "IP-range",
  "Recap configuration": "Samenvatting configuratie",
  "Equipements": "Uitrusting",
  "Documents": "Documenten",
  "Cloture": "Afsluiting",
  "Enregistrer": "Opslaan",
  "Ouvrir la configuration detaillee": "Gedetailleerde configuratie openen"
};

const nlUiExtraPhraseMap = {
  "Vue d'ensemble": "Overzicht",
  "Quantités magasin": "Winkelhoeveelheden",
  "Vue de pilotage rapide des besoins réseau et matériel du magasin.": "Snelle opvolging van netwerk- en materiaalbehoeften van de winkel.",
  "Récap configuration et préparation": "Samenvatting configuratie en voorbereiding",
  "Vue synthétique des demandes transmises et des éléments déjà confirmés.": "Synthetisch overzicht van verzonden aanvragen en reeds bevestigde elementen.",
  "Éléments confirmés": "Bevestigde elementen",
  "Eléments confirmés": "Bevestigde elementen",
  "À envoyer": "Te verzenden",
  "À confirmer": "Te bevestigen",
  "À renseigner": "In te vullen",
  "Pas envoye": "Niet verzonden",
  "Pas envoyé": "Niet verzonden",
  "Envoye": "Verzonden",
  "Envoyé": "Verzonden",
  "Recue": "Ontvangen",
  "Reçue": "Ontvangen",
  "Relancee": "Herinnerd",
  "Relancée": "Herinnerd",
  "Confirmée": "Bevestigd",
  "Confirmés": "Bevestigd",
  "Configuré": "Geconfigureerd",
  "Aucune ligne configuree": "Geen lijn geconfigureerd",
  "Aucune ligne configurée": "Geen lijn geconfigureerd",
  "ligne(s) configurée(s)": "lijn(en) geconfigureerd",
  "Les choix enregistrés dans Configuration magasin remonteront ici dès qu'ils seront complétés.": "De keuzes die in Winkelconfiguratie worden opgeslagen, verschijnen hier zodra ze volledig zijn.",
  "Choix téléphonie confirmés et visibles ici sans devoir ouvrir l'onglet configuration.": "Bevestigde telefoniekeuzes zijn hier zichtbaar zonder de configuratietab te openen.",
  "Configuration détaillée": "Gedetailleerde configuratie",
  "Lecture directe de toute la configuration sans devoir repasser par l'onglet Configuration magasin.": "Directe lezing van de volledige configuratie zonder terug te gaan naar de tab Winkelconfiguratie.",
  "Société": "Bedrijf",
  "Modele": "Model",
  "Modèle": "Model",
  "Utilisateur": "Gebruiker",
  "Numero": "Nummer",
  "Numéro": "Nummer",
  "Reseau": "Netwerk",
  "Réseau": "Netwerk",
  "Aucun GSM renseigne.": "Geen GSM ingevuld.",
  "Aucun GSM renseigné.": "Geen GSM ingevuld.",
  "Clôture installation Destiny": "Afsluiting installatie Destiny",
  "Validation de fin d'intervention et remarques de chantier après installation.": "Validatie einde interventie en werfopmerkingen na installatie.",
  "Installation Destiny terminée": "Installatie Destiny voltooid",
  "Mail de fin équipe Brico": "Eindmail team Brico",
  "Remarques finales du magasin et éventuelle bascule vers la plateforme": "Eindopmerkingen van de winkel en eventuele omschakeling naar het platform",
  "Chronologie des rendez-vous programmés pour ce magasin.": "Chronologie van de geplande afspraken voor deze winkel.",
  "Aucun rendez-vous programmé.": "Geen afspraak gepland.",
  "Plusieurs rendez-vous et plusieurs jours d'installation possibles par magasin.": "Meerdere afspraken en installatiedagen mogelijk per winkel.",
  "Personnes concernées": "Betrokken personen",
  "Réception TWEM": "Ontvangst TWEM",
  "Extension liée": "Gekoppelde extensie",
  "Quantité demandée": "Gevraagde hoeveelheid",
  "Workflow matériel supplémentaire": "Workflow extra materiaal",
  "Choisir un matériel": "Kies materiaal",
  "Demande créée": "Aanvraag aangemaakt",
  "Demande d'info": "Informatieaanvraag",
  "Commande materiel casse": "Bestelling defect materiaal",
  "Commande matériel cassé": "Bestelling defect materiaal",
  "Commande materiel supplementaire": "Bestelling extra materiaal",
  "Commande matériel supplémentaire": "Bestelling extra materiaal",
  "Date téléphonie actuelle": "Huidige telefoniedatum",
  "Récap configuration": "Samenvatting configuratie",
  "Équipements": "Uitrusting",
  "Clôture": "Afsluiting",
  "Ouvrir la configuration détaillée": "Gedetailleerde configuratie openen",
  "Configuration": "Configuratie",
  "Suivi de la demande de configuration magasin.": "Opvolging van de winkelconfiguratieaanvraag.",
  "Suivi de la commande et de la reception magasin.": "Opvolging van de bestelling en ontvangst in de winkel.",
  "Suivi de la commande et de la réception magasin.": "Opvolging van de bestelling en ontvangst in de winkel.",
  "Date et heure": "Datum en uur",
  "Aucun choix extension confirme pour le moment.": "Nog geen extensiekeuze bevestigd.",
  "Aucun choix extension confirmé pour le moment.": "Nog geen extensiekeuze bevestigd.",
  "Configuration du reseau": "Netwerkconfiguratie",
  "Configuration du réseau": "Netwerkconfiguratie",
  "Lignes generees automatiquement par quantite magasin": "Lijnen automatisch gegenereerd op basis van winkelhoeveelheden",
  "Lignes générées automatiquement par quantité magasin": "Lijnen automatisch gegenereerd op basis van winkelhoeveelheden",
  "Le responsable magasin remplit cette partie pour permettre a l IT de programmer les appareils avant installation.": "De winkelverantwoordelijke vult dit deel in zodat IT de toestellen voor de installatie kan programmeren.",
  "Le responsable magasin remplit cette partie pour permettre à l'IT de programmer les appareils avant installation.": "De winkelverantwoordelijke vult dit deel in zodat IT de toestellen voor de installatie kan programmeren.",
  "Choix magasin confirmes. Modifications ensuite via Probleme / notes.": "Winkelkeuzes bevestigd. Wijzigingen daarna via Probleem / notities.",
  "Choix magasin confirmés. Modifications ensuite via Problème / notes.": "Winkelkeuzes bevestigd. Wijzigingen daarna via Probleem / notities.",
  "Le magasin remplit ses choix puis confirme en bas du module.": "De winkel vult de keuzes in en bevestigt onderaan de module.",
  "Choix confirmes": "Keuzes bevestigd",
  "Choix confirmés": "Keuzes bevestigd",
  "Confirmer vos choix": "Uw keuzes bevestigen",
  "Extension + lieu": "Extensie + locatie",
  "Etat": "Status",
  "État": "Status",
  "Aucun choix telephonie enregistre pour le moment.": "Nog geen telefoniekeuze opgeslagen.",
  "Aucun choix téléphonie enregistré pour le moment.": "Nog geen telefoniekeuze opgeslagen.",
  "Poste": "Toestel"
};

const nlUiPlaceholderMap = {
  "Ex: Anderlecht": "Bv: Anderlecht",
  "Choisir une extension / un lieu": "Kies een extensie / locatie",
  "Choisir une extension": "Kies een extensie",
  "Choisir un materiel": "Kies materiaal",
  "Decris le probleme, le besoin ou le contexte de la demande SAV": "Beschrijf het probleem, de behoefte of de context van de SAV-aanvraag",
  "Decris le probleme a traiter": "Beschrijf het te behandelen probleem",
  "Ex: personnaliser la touche / commentaire": "Bv: toets personaliseren / opmerking",
  "La remarque sera horodatee avec ton nom lors de la sauvegarde.": "De opmerking krijgt datum, uur en jouw naam bij het opslaan."
};

const initialPeople = [
  { id: "p1", name: "Emir", role: "admin_twem", phone: "0470 00 00 01", email: "emir@twem.be", storeCode: "", language: "fr" },
  { id: "p2", name: "Valou", role: "supadmin_twem", phone: "0470 00 00 02", email: "backoffice@twem.be", storeCode: "", language: "fr" },
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
const authResetVersionKey = `${storageKey}-auth-reset-version`;
const authResetVersion = "2026-05-20-pin-reset-1";
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
  appwriteSettingsCollectionId: "settings",
  appwriteMailerFunctionId: ""
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
const appwriteStorage = appwriteClient && window.Appwrite?.Storage
  ? new window.Appwrite.Storage(appwriteClient)
  : null;
const appwriteQuery = window.Appwrite?.Query || null;
const appwriteIdFactory = window.Appwrite?.ID || null;
const appwriteEndpoint = appConfig.appwriteEndpoint || "";
const appwriteProjectId = appConfig.appwriteProjectId || "";
const appwriteDatabaseId = appConfig.appwriteDatabaseId || "twem_brico";
const appwriteStoresCollectionId = appConfig.appwriteStoresCollectionId || "stores";
const appwritePeopleCollectionId = appConfig.appwritePeopleCollectionId || "people";
const appwriteActivitiesCollectionId = appConfig.appwriteActivitiesCollectionId || "activities";
const appwriteSettingsCollectionId = appConfig.appwriteSettingsCollectionId || "settings";
const appwriteTicketsCollectionId = appConfig.appwriteTicketsCollectionId || "tickets";
const appwriteMailerFunctionId = appConfig.appwriteMailerFunctionId || "";
const appwritePlansBucketId = appConfig.appwritePlansBucketId || "store-plans";
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
let storeEditorDraftLock = {
  active: false,
  storeId: null,
  lastTouchedAt: 0
};

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
  tutorialVideos: clone(defaultTutorialVideos),
  technicalSheets: clone(defaultTechnicalSheets),
  automations: clone(defaultAutomations),
  roleVisibilityConfig: {},
  visibilityEditorRole: "supadmin_twem",
  roleViewUnlocked: false,
  contactSearch: "",
  importMode: "stores",
  importBusyMessage: "",
  importExportHistory: [],
  tickets: [],
  automationEmails: [],
  activeAutomationSubtab: "rules",
  launchMailDraft: {},
  focusedUpdate: null,
  storeSaveFeedback: null,
  technicalSheetEditId: "",
  filters: {
    search: "",
    status: "all",
    owner: "all",
    stage: "all",
    type: "all",
    city: "all",
    date: "all",
    invoice: "all",
    configStatus: "all"
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
const legacyWelcomeSentAt = "2026-06-02T10:00:00.000Z";
const legacyWelcomeCutoffAt = new Date("2026-06-04T00:00:00+02:00");

function markStoreEditorDirty(storeId) {
  storeEditorDraftLock = {
    active: true,
    storeId: Number(storeId) || null,
    lastTouchedAt: Date.now()
  };
}

function clearStoreEditorDirty(storeId = null) {
  if (storeId !== null && storeEditorDraftLock.storeId !== Number(storeId)) {
    return;
  }
  storeEditorDraftLock = {
    active: false,
    storeId: null,
    lastTouchedAt: 0
  };
}

function isStoreEditorDirty() {
  const activeForm = document.activeElement?.closest?.("[data-store-editor]");
  if (activeForm) {
    return true;
  }
  if (!storeEditorDraftLock.active) {
    return false;
  }
  return Date.now() - storeEditorDraftLock.lastTouchedAt < 15 * 60 * 1000;
}

const mainWorkspaceTabs = ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto"];

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
const printCurrentListButton = document.querySelector("#printCurrentListButton");
const tabImportButton = document.querySelector("#tabImportButton");
const tabImportStoresButton = document.querySelector("#tabImportStoresButton");
const tabImportTelephonyButton = document.querySelector("#tabImportTelephonyButton");
const tabImportSavHistoryButton = document.querySelector("#tabImportSavHistoryButton");
const tabImportExtensionsButton = document.querySelector("#tabImportExtensionsButton");
const tabExportButton = document.querySelector("#tabExportButton");
const tabExportStoresCheckXlsxButton = document.querySelector("#tabExportStoresCheckXlsxButton");
const tabExportStoresXlsxButton = document.querySelector("#tabExportStoresXlsxButton");
const tabExportStoresPdfButton = document.querySelector("#tabExportStoresPdfButton");
const tabBulkStorePrintFilter = document.querySelector("#tabBulkStorePrintFilter");
const tabBulkStorePrintZipButton = document.querySelector("#tabBulkStorePrintZipButton");
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
const automationSubtabs = document.querySelector("#automationSubtabs");
const automationTemplateList = document.querySelector("#automationTemplateList");
const automationEmailQueue = document.querySelector("#automationEmailQueue");
const launchMailComposer = document.querySelector("#launchMailComposer");
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
const intervenantRoleForm = document.querySelector("#intervenantRoleForm");
const intervenantRoleInput = document.querySelector("#intervenantRoleInput");
const intervenantList = document.querySelector("#intervenantList");
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
const pinRolloutSearchInput = document.querySelector("#pinRolloutSearchInput");
const pinRolloutStatusFilter = document.querySelector("#pinRolloutStatusFilter");
const pinRolloutSummary = document.querySelector("#pinRolloutSummary");
const pinRolloutList = document.querySelector("#pinRolloutList");
const pinRolloutOpenButton = document.querySelector("#pinRolloutOpenButton");
const pinRolloutOpenAllButton = document.querySelector("#pinRolloutOpenAllButton");
const pinMarkAllMailSentButton = document.querySelector("#pinMarkAllMailSentButton");
const pinRolloutCloseButton = document.querySelector("#pinRolloutCloseButton");
const storeForm = document.querySelector("#storeForm");
const storeEditSelect = document.querySelector("#storeEditSelect");
const storeNameInput = document.querySelector("#storeNameInput");
const storeCityInput = document.querySelector("#storeCityInput");
const storeCodeInput = document.querySelector("#storeCodeInput");
const storeShopNumberInput = document.querySelector("#storeShopNumberInput");
const storeAddressInput = document.querySelector("#storeAddressInput");
const storeShopTypeSelect = document.querySelector("#storeShopTypeSelect");
const storeShopSizeInput = document.querySelector("#storeShopSizeInput");
const storeOwnerSelect = document.querySelector("#storeOwnerSelect");
const storeManagerInput = document.querySelector("#storeManagerInput");
const storePoLicencesInput = document.querySelector("#storePoLicencesInput");
const storePoHpDeskInput = document.querySelector("#storePoHpDeskInput");
const storePoPmInput = document.querySelector("#storePoPmInput");
const storePoRentingHwInput = document.querySelector("#storePoRentingHwInput");
const storeLicenseCountInput = document.querySelector("#storeLicenseCountInput");
const storeFixCountInput = document.querySelector("#storeFixCountInput");
const storeMobileCountInput = document.querySelector("#storeMobileCountInput");
const storeCallButtonCountInput = document.querySelector("#storeCallButtonCountInput");
const storePanicCountInput = document.querySelector("#storePanicCountInput");
const storeStatusSelect = document.querySelector("#storeStatusSelect");
const storeHealthInput = document.querySelector("#storeHealthInput");
const storeCurrentPlatformInput = document.querySelector("#storeCurrentPlatformInput");
const storeTargetPlatformInput = document.querySelector("#storeTargetPlatformInput");
const storeCurrentPhoneDateInput = document.querySelector("#storeCurrentPhoneDateInput");
const storeCurrentContractClientInput = document.querySelector("#storeCurrentContractClientInput");
const storeNewButton = document.querySelector("#storeNewButton");
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

function shouldMarkLegacyWelcomeSent(person = {}) {
  if (!person?.id || person.welcomeEmailSentAt || normalizePin(person.pin).length !== 6) {
    return false;
  }
  const createdAt = new Date(person.pinCreatedAt || person.createdAt || person.updatedAt || "2026-05-06T00:00:00Z");
  return Number.isNaN(createdAt.getTime()) || createdAt < legacyWelcomeCutoffAt;
}

function markLegacyWelcomeMailsSent(people = state.people) {
  const changed = [];
  (people || []).forEach((person) => {
    if (!shouldMarkLegacyWelcomeSent(person)) {
      return;
    }
    person.welcomeEmailSentAt = legacyWelcomeSentAt;
    person.welcomeEmailQueuedAt = "";
    person.manualWelcomeEmailSentAt = legacyWelcomeSentAt;
    person.manualWelcomeEmailSentBy = person.manualWelcomeEmailSentBy || "Migration TWEM";
    changed.push(person);
  });
  return changed;
}

function stripKnownTestPeople(people = []) {
  return (people || []).filter((person) => !knownTestPeopleNames.includes(person?.name));
}

function normalizeSpecialPeople(people = []) {
  const entries = people || [];
  const canonicalValou = entries.find((person) => {
    if (!person || person.name !== "Valou") {
      return false;
    }
    const email = normalizeImportCell(person.email).toLowerCase();
    const phone = normalizeImportCell(person.phone);
    return email === "backoffice@twem.be" || phone === "0488231773";
  });

  return entries.map((person) => {
    if (!person) {
      return person;
    }
    const email = normalizeImportCell(person.email).toLowerCase();
    const phone = normalizeImportCell(person.phone);
    const shouldRenameLegacyValou = person.name === "Valou"
      && canonicalValou
      && canonicalValou.id !== person.id
      && (email === "valou@twem.be" || phone === "0470 00 00 02");

    if (shouldRenameLegacyValou) {
      return hydrateAccessProfile({
        ...person,
        name: "Georgette Larix",
        role: "intervenant",
        accessibleTabs: ["dashboard", "timeline", "stores", "sav", "extensions", "reports"],
        accessibleBlocks: ["appointments", "sav_ticket", "problem_notes"]
      });
    }
    if (person.name === "Valou" && email === "valou@twem.be") {
      return hydrateAccessProfile({
        ...person,
        email: "backoffice@twem.be"
      });
    }
    return person;
  });
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
    const key = (person.id || person.email || person.name || "").toLowerCase();
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

  return normalizeSpecialPeople(stripKnownTestPeople([...byKey.values()]));
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
      shopType: normalizeShopTypeValue(payload.shopType || document.shop_type || document.shopType || ""),
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
    shop_type: normalizeShopTypeValue(document.shop_type || document.shopType || ""),
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
    remoteDocumentId: document.$id,
    name: document.name || "",
    role: document.role || "manager",
    phone: document.phone || "",
    email: document.email || "",
    storeCode: document.store_code || "",
    language: document.language || "fr"
  };
  return hydrateAccessProfile(
    payload && typeof payload === "object"
      ? { ...base, ...payload, id: payload.id || document.$id, remoteDocumentId: document.$id }
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
  state.roleVisibilityConfig = normalizedRoleVisibilityConfig(state.roleVisibilityConfig || {});
  const cleanToolItems = (state.toolItems || []).filter((item) =>
    item?.id !== tutorialVideosSettingsItemId
    && item?.kind !== "tutorial_videos"
    && item?.id !== technicalSheetsSettingsItemId
    && item?.kind !== "technical_sheets"
    && item?.id !== automationEmailsSettingsItemId
    && item?.kind !== "automation_emails"
    && item?.id !== mailerStateSettingsItemId
    && item?.kind !== "mailer_state"
  );
  return {
    role_options_json: JSON.stringify(state.roleOptions || []),
    tool_items_json: JSON.stringify([
      ...cleanToolItems,
      {
        id: tutorialVideosSettingsItemId,
        kind: "tutorial_videos",
        videos: normalizedTutorialVideos(state.tutorialVideos || [])
      },
      {
        id: automationEmailsSettingsItemId,
        kind: "automation_emails",
        emails: state.automationEmails || []
      }
    ]),
    access_overrides_json: JSON.stringify(state.accessOverrides || []),
    role_visibility_config_json: JSON.stringify(state.roleVisibilityConfig || {}),
    automations_json: JSON.stringify(normalizedAutomations(state.automations || [])),
    extension_catalog_json: JSON.stringify(extensionCatalogRows || [])
  };
}

function storeProvenance(store) {
  const raw = normalizeImportCell(store?.owner);
  return provenanceOptions.includes(raw) ? raw : "Migration";
}

function storeLanguageForPrint(store) {
  const storeLanguage = normalizeImportCell(store?.language);
  if (storeLanguage) {
    return normalizeLanguageCode(storeLanguage);
  }
  const linkedPerson = state.people.find((person) =>
    (store?.code && person.storeCode === store.code)
    || (store?.manager && person.name === store.manager)
  );
  const personLanguage = normalizeImportCell(linkedPerson?.language);
  if (personLanguage) {
    return normalizeLanguageCode(personLanguage);
  }
  return inferStoreLanguage(store) || "fr";
}

function inferStoreLanguage(store) {
  const haystack = normalizeImportCell([store?.name, store?.city, store?.address].filter(Boolean).join(" ")).toLowerCase();
  if (!haystack) {
    return "";
  }
  const nlSignals = [
    "aalst", "aarschot", "antwerpen", "brugge", "deurne", "dilbeek", "genk", "gent",
    "hasselt", "kapellen", "kortrijk", "leuven", "lier", "lokeren", "mechelen",
    "mortsel", "ninove", "oostende", "roeselare", "sint", "turnhout", "vilvoorde",
    "waregem", "wetteren", "wilrijk", "zaventem"
  ];
  return nlSignals.some((signal) => haystack.includes(signal)) ? "nl" : "";
}

function managerPersonForStore(store) {
  return state.people.find((person) =>
    (store?.code && person.storeCode === store.code && ["manager", "magasin"].includes(String(person.role || "").toLowerCase()))
    || (store?.manager && person.name === store.manager)
  ) || null;
}

function managerContactForStore(store) {
  const managerPerson = managerPersonForStore(store);
  return {
    name: normalizeImportCell(managerPerson?.name || store?.manager || ""),
    phone: normalizeImportCell(managerPerson?.phone || store?.phone || ""),
    email: normalizeImportCell(managerPerson?.email || store?.email || "")
  };
}

function linkedPeopleForStore(store) {
  if (!store?.code) {
    return [];
  }
  return (state.people || []).filter((person) =>
    normalizeImportCell(person.email)
    && (
      person.storeCode === store.code
      || (Array.isArray(person.allowedStoreCodes) && person.allowedStoreCodes.includes(store.code))
    )
  );
}

function personHasFirstAppLogin(person = {}) {
  return Array.isArray(person.loginHistory)
    && person.loginHistory.some((entry) => normalizeImportCell(entry?.at || entry?.loginAt));
}

function firstLoginBlockLabel(people = []) {
  const pendingNames = people
    .filter((person) => normalizeImportCell(person.email) && !personHasFirstAppLogin(person))
    .map((person) => normalizeImportCell(person.name) || normalizeImportCell(person.email));
  if (!pendingNames.length) {
    return "";
  }
  return `Premiere connexion requise: ${pendingNames.join(", ")}`;
}

function normalizeShopTypeValue(value) {
  const raw = normalizeImportCell(value).toUpperCase().replace(/\s+/g, "");
  const lettersOnly = raw.replace(/[^A-Z]/g, "");
  if (!raw) {
    return "";
  }
  if (lettersOnly === "FOSDOS" || lettersOnly === "DOSFOS") {
    return "FOSDOS";
  }
  if (lettersOnly === "DOS") {
    return "DOS";
  }
  if (lettersOnly === "FOS") {
    return "FOS";
  }
  return normalizeImportCell(value).toUpperCase();
}

function normalizeImportClosureValue(value) {
  const normalized = normalizeImportCell(value).toLowerCase().replace(/[\s_-]+/g, "");
  if (!normalized) {
    return "";
  }
  if (["done", "cloture", "cloturé", "closed"].includes(normalized)) {
    return "done";
  }
  if (["todo", "planned"].includes(normalized)) {
    return "planned";
  }
  return "";
}

function buildAppwriteTicketDocument(ticket) {
  return {
    store_id: String(ticket.storeId || ""),
    store_code: ticket.storeCode || "",
    store_name: ticket.storeName || "",
    requester_name: ticket.requesterName || "",
    target_service: ticketTargetLabel(ticket),
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
    retries = 8,
    delayMs = 2000
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
    automationEmails: state.automationEmails,
    launchMailDraft: state.launchMailDraft,
    people: state.people,
    activeUserName: state.activeUserName,
    language: state.language,
    activeAdminTab: state.activeAdminTab,
    activeAutomationSubtab: state.activeAutomationSubtab,
    tutorialSeenByUser: state.tutorialSeenByUser,
    toolItems: state.toolItems,
    accessOverrides: state.accessOverrides,
    roleOptions: state.roleOptions,
    automations: state.automations,
    tutorialVideos: state.tutorialVideos,
    technicalSheets: state.technicalSheets,
    roleVisibilityConfig: state.roleVisibilityConfig,
    visibilityEditorRole: state.visibilityEditorRole,
    roleViewUnlocked: state.roleViewUnlocked,
    contactSearch: state.contactSearch,
    importExportHistory: state.importExportHistory,
    extensionCatalogRows
  };
}

function loadState() {
  const storedAuthResetVersion = window.localStorage.getItem(authResetVersionKey);
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    window.localStorage.setItem(authResetVersionKey, authResetVersion);
    return {
      stores: clone(demoStores),
      activities: clone(demoActivities),
      tickets: clone(demoTickets),
      automationEmails: [],
      launchMailDraft: {},
      people: demoPinPeople(),
      activeUserName: "",
      language: "fr",
      activeAdminTab: "dashboard",
      tutorialSeenByUser: {},
        toolItems: [],
        accessOverrides: [],
        roleOptions: [...defaultRoleOptions],
        tutorialVideos: clone(defaultTutorialVideos),
        technicalSheets: clone(defaultTechnicalSheets),
        automations: clone(defaultAutomations),
        roleVisibilityConfig: {},
        visibilityEditorRole: "supadmin_twem",
        roleViewUnlocked: false,
        contactSearch: "",
        importExportHistory: [],
        extensionCatalogRows: extensionCatalogRows
      };
  }

  try {
    const parsed = JSON.parse(raw);
    const shouldResetRememberedNonBypassUser = storedAuthResetVersion !== authResetVersion
      && parsed.activeUserName
      && !presentationBypassUsers.includes(parsed.activeUserName);
    if (storedAuthResetVersion !== authResetVersion) {
      window.localStorage.setItem(authResetVersionKey, authResetVersion);
    }
    return {
      stores: parsed.stores || clone(demoStores),
      activities: parsed.activities || clone(demoActivities),
      tickets: parsed.tickets || clone(demoTickets),
      automationEmails: Array.isArray(parsed.automationEmails) ? parsed.automationEmails : [],
      launchMailDraft: parsed.launchMailDraft || {},
      people: mergePeopleWithPinFallback((parsed.people || []).map((person) => ({
        language: "fr",
        storeCode: "",
        ...person
      }))),
      activeUserName: shouldResetRememberedNonBypassUser ? "" : (parsed.activeUserName || ""),
      language: parsed.language || "fr",
      activeAdminTab: parsed.activeAdminTab || "dashboard",
      activeAutomationSubtab: parsed.activeAutomationSubtab || "rules",
      tutorialSeenByUser: parsed.tutorialSeenByUser || {},
        toolItems: parsed.toolItems || [],
        accessOverrides: parsed.accessOverrides || [],
        roleOptions: normalizedRoleOptions(parsed.roleOptions),
        tutorialVideos: normalizedTutorialVideos(parsed.tutorialVideos || []),
        technicalSheets: normalizedTechnicalSheets(parsed.technicalSheets || []),
        automations: normalizedAutomations(parsed.automations),
        roleVisibilityConfig: parsed.roleVisibilityConfig || {},
        visibilityEditorRole: parsed.visibilityEditorRole || "supadmin_twem",
        roleViewUnlocked: Boolean(parsed.roleViewUnlocked),
        contactSearch: parsed.contactSearch || "",
        importExportHistory: parsed.importExportHistory || [],
        extensionCatalogRows: Array.isArray(parsed.extensionCatalogRows) && parsed.extensionCatalogRows.length ? parsed.extensionCatalogRows : extensionCatalogRows
      };
  } catch {
    window.localStorage.setItem(authResetVersionKey, authResetVersion);
    return {
      stores: clone(demoStores),
      activities: clone(demoActivities),
      tickets: clone(demoTickets),
      automationEmails: [],
      launchMailDraft: {},
      people: demoPinPeople(),
      activeUserName: "",
      language: "fr",
      activeAdminTab: "dashboard",
      tutorialSeenByUser: {},
        toolItems: [],
        accessOverrides: [],
        roleOptions: [...defaultRoleOptions],
        tutorialVideos: clone(defaultTutorialVideos),
        technicalSheets: clone(defaultTechnicalSheets),
        automations: clone(defaultAutomations),
        roleVisibilityConfig: {},
        visibilityEditorRole: "supadmin_twem",
        roleViewUnlocked: false,
        contactSearch: "",
        importExportHistory: [],
        extensionCatalogRows: extensionCatalogRows
      };
}
}

function saveState() {
  window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
  scheduleRemoteStateSync();
}

function saveVisibilityState() {
  window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
  if (hasRemoteData()) {
    void syncSettingsToRemote().catch((error) => console.error("Visibility sync error", error));
  }
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
  return person.remoteDocumentId || safeDocumentId("person", person.id || person.email || person.name);
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
  remoteSyncShadow.tickets = new Map((state.tickets || []).filter(Boolean).map((ticket) => [ticketRemoteSyncKey(ticket), stableSerialize(ticket)]));
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
  const removedRoles = new Set(["it", "infra", "intervenant", "uc_pm_nl_dstny", "uc_tech_fr_dstny"]);
  return [...new Set([...(Array.isArray(list) ? list : []), ...defaultRoleOptions]
    .map(canonicalRoleKey)
    .filter((role) => role && !removedRoles.has(role)))];
}

function normalizedRoleVisibilityConfig(config = {}) {
  const allowedRoles = new Set(normalizedRoleOptions(state.roleOptions || defaultRoleOptions));
  return Object.entries(config || {}).reduce((nextConfig, [role, value]) => {
    const canonicalRole = canonicalRoleKey(role);
    if (!allowedRoles.has(canonicalRole)) {
      return nextConfig;
    }
    nextConfig[canonicalRole] = {
      ...(nextConfig[canonicalRole] || {}),
      ...(value || {})
    };
    return nextConfig;
  }, {});
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

function stageForStore(store) {
  return currentWorkflowStage(store);
}

function t(key) {
  return translations[state.language]?.[key] || translations.fr[key] || key;
}

function textForLanguage(key, language = "fr") {
  const normalizedLanguage = normalizeLanguageCode(language);
  return translations[normalizedLanguage]?.[key] || translations.fr[key] || key;
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

function updateFocusFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const rawStore = normalizeImportCell(params.get("store"));
  const rawFocus = normalizeImportCell(params.get("focus"));
  if (!rawStore && !rawFocus) {
    return false;
  }

  const store = state.stores.find((entry) =>
    String(entry.code || "").toLowerCase() === rawStore.toLowerCase()
    || String(entry.id || "") === rawStore
  ) || state.stores.find((entry) =>
    (state.activities || []).some((activity) =>
      activity.id === rawFocus
      && activity.storeName === entry.name
    )
  );
  if (!store) {
    return false;
  }

  const activity = rawFocus
    ? (state.activities || []).find((entry) => entry.id === rawFocus)
    : null;
  state.focusedUpdate = {
    storeId: store.id,
    storeCode: store.code,
    activityId: rawFocus,
    message: activity?.comment || normalizeImportCell(params.get("message")) || "Nouvelle information a consulter",
    createdAt: activity?.createdAt || ""
  };
  state.activeAdminTab = canAccessTab("stores") ? "stores" : "dashboard";
  state.filters = { search: "", status: "all", owner: "all", stage: "all", type: "all", city: "all", date: "all", invoice: "all", configStatus: "all" };
  state.expandedStoreIds = new Set([store.id]);
  return true;
}

function scrollToFocusedUpdate() {
  if (!state.focusedUpdate) {
    return;
  }
  window.setTimeout(() => {
    document.querySelector("[data-update-focus-banner]")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 120);
}

function renderPreservingScroll() {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  render();
  window.requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY);
  });
}

function setStoreSaveFeedback(storeId, message, status = "success") {
  state.storeSaveFeedback = {
    storeId: Number(storeId),
    message,
    status,
    at: new Date().toISOString()
  };
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
  const ordered = [...filtered].sort((left, right) => {
    const leftTime = Date.parse(left?.createdAt || "") || 0;
    const rightTime = Date.parse(right?.createdAt || "") || 0;
    return rightTime - leftTime;
  });
  const latestByLabel = new Map();
  ordered.forEach((item) => {
    const key = normalizeImportCell(item?.label).toLowerCase();
    if (!key || latestByLabel.has(key)) {
      return;
    }
    latestByLabel.set(key, item);
  });
  return [...latestByLabel.values()].slice(0, 8);
}

function resetImportedStoresForKickoff(stores = []) {
  return (stores || []).map((store) => {
    const nextStore = clone(store);
    nextStore.status = "planned";
    nextStore.health = "";
    nextStore.steps = freshImportedSteps();
    nextStore.appointments = Array.isArray(nextStore.appointments) ? nextStore.appointments : [];
    const workflow = ensureStoreWorkflowData(nextStore);
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

const plannedInstallDatesRestore20260522 = {
  "BRI-4213": "2026-06-01",
  "BRI-4214": "2026-06-01",
  "BRI-3311": "2026-06-04",
  "BRI-3621": "2026-06-09",
  "BRI-5430": "2026-06-09",
  "BRI-3597": "2026-06-16",
  "BRI-3315": "2026-06-19",
  "BRI-3603": "2026-06-22",
  "BRI-3660": "2026-06-22",
  "BRI-3678": "2026-06-22",
  "BRI-3305": "2026-06-29",
  "BRI-3320": "2026-06-29",
  "BRI-3625": "2026-06-29",
  "BRI-3612": "2026-07-06",
  "BRI-3667": "2026-07-06",
  "BRI-4203": "2026-07-06",
  "BRI-3669": "2026-07-13",
  "BRI-4204": "2026-07-13",
  "BRI-3319": "2026-07-20",
  "BRI-3582": "2026-07-20",
  "BRI-3632": "2026-07-20",
  "BRI-3617": "2026-07-27",
  "BRI-3694": "2026-07-27",
  "BRI-4215": "2026-07-27",
  "BRI-3322": "2026-08-03",
  "BRI-3645": "2026-08-03",
  "BRI-4212": "2026-08-03",
  "BRI-3431": "2026-08-10",
  "BRI-3443": "2026-08-10",
  "BRI-3675": "2026-08-10",
  "BRI-3400": "2026-08-17",
  "BRI-3637": "2026-08-17"
};

function restorePlanningInstallDatesFromSnapshot() {
  const existingPlannedDateCount = (state.stores || []).filter((store) => {
    if (!plannedInstallDatesRestore20260522[store.code]) {
      return false;
    }
    return Boolean(ensureStoreWorkflowData(store).destinyInstallDate);
  }).length;
  if (existingPlannedDateCount >= 10) {
    return [];
  }

  const changedStores = [];
  (state.stores || []).forEach((store) => {
    const expectedDate = plannedInstallDatesRestore20260522[store.code];
    if (!expectedDate) {
      return;
    }
    const workflow = ensureStoreWorkflowData(store);
    if (workflow.destinyInstallDate === expectedDate) {
      return;
    }
    workflow.destinyInstallDate = expectedDate;
    store.updatedAt = new Date().toISOString();
    changedStores.push(store);
  });
  return changedStores;
}

function isSupAdmin(user = currentUser()) {
  return Boolean(user && user.role === "supadmin_twem" && user.name === "Valou");
}

function isAdminTwem(user = currentUser()) {
  return Boolean(user && (user.role === "admin_twem" || isSupAdmin(user)));
}

function canDispatchSav(user = currentUser()) {
  const name = normalizeImportCell(user?.name).toLowerCase();
  const email = normalizeImportCell(user?.email).toLowerCase();
  return Boolean(
    isAdminTwem(user)
    || ["valou", "emir"].includes(name)
    || ["backoffice@twem.be", "emir.massart@brico.be", "emir@twem.be"].includes(email)
  );
}

function canSeePinLoginJournal(user = currentUser()) {
  const name = normalizeImportCell(user?.name).toLowerCase();
  const email = normalizeImportCell(user?.email).toLowerCase();
  return Boolean(
    isAdminTwem(user)
    || ["valou", "emir"].includes(name)
    || ["backoffice@twem.be", "emir.massart@brico.be", "emir@twem.be"].includes(email)
  );
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
  const normalizedRole = canonicalRoleKey(role);
  const map = {
    supadmin_twem: ["*"],
    admin_twem: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "contacts", "reports", "automations", "tools", "pin-access", "import-export"],
    direction_brico: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    brico: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    supmanager: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "contacts", "reports", "automations"],
    manager: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    magasin: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    telephonie_destiny: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    pm_dstny: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    uc_pm_fr_nl_dstny: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    uc_tech_fr_nl_dstny: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    logistic_coord_dstny: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    it: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    infra: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"],
    intervenant: ["dashboard", "timeline", "stores", "configuration", "sav", "extensions", "invoice", "tuto", "reports"]
  };
  return map[normalizedRole] || ["dashboard"];
}

function accessibleTabsForUser(user = currentUser()) {
  if (!user) {
    return ["dashboard"];
  }
  if (user.accessibleTabs?.includes("*") || isSupAdmin(user)) {
    return ["*"];
  }
  const roleDefaults = defaultTabsForRole(user.role) || ["dashboard"];
  const savedTabs = Array.isArray(user.accessibleTabs) ? user.accessibleTabs.filter(Boolean) : [];
  const mergedTabs = [...new Set([...roleDefaults, ...savedTabs])];
  return mergedTabs.length ? mergedTabs : ["dashboard"];
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

function resetWorkspaceFilters() {
  state.filters = {
    search: "",
    status: "all",
    owner: "all",
    stage: "all",
    type: "all",
    city: "all",
    date: "all",
    invoice: "all",
    configStatus: "all"
  };
}

function tabTitle(tab) {
  const isNl = state.language === "nl";
  const titles = {
    dashboard: "Dashboard",
    timeline: isNl ? "Tijdlijn / Planning" : "Timeline / Planning",
    stores: isNl ? "Winkels" : "Magasins",
    configuration: isNl ? "Configuratie winkel" : "Configuration magasin",
    sav: "SAV / Tickets",
    extensions: isNl ? "Extensies" : "Extensions",
    invoice: isNl ? "Facturatie" : "Invoice",
    tuto: "TUTO",
    contacts: isNl ? "Contacten" : "Contacts",
    reports: isNl ? "Rapporten" : "Rapports",
    automations: isNl ? "Automatiseringen" : "Automatisations",
    tools: "Tools TWEM",
    "pin-access": isNl ? "PIN / Toegang" : "PIN / Acces",
    "import-export": isNl ? "Import / Export" : "Import / Export",
    visibility: isNl ? "Wie ziet wat" : "Qui voit quoi"
  };
  return titles[tab] || "Dashboard";
}

function editableZonesForRole(role) {
  const normalizedRole = canonicalRoleKey(role);
  const map = {
    supadmin_twem: ["all"],
    admin_twem: ["all"],
    direction_brico: ["problem_notes", "brico_feedback", "sav_ticket"],
    brico: ["problem_notes", "brico_feedback", "sav_ticket"],
    supmanager: ["appointments", "project_prep", "problem_notes", "brico_feedback", "status_admin", "configuration_request", "sav_ticket"],
    manager: ["appointments", "project_prep", "configuration_request", "network_config", "brico_feedback", "problem_notes", "sav_ticket"],
    magasin: ["appointments", "project_prep", "configuration_request", "network_config", "brico_feedback", "problem_notes", "sav_ticket"],
    telephonie_destiny: ["appointments", "order_articles", "destiny_coordination", "external_prep", "destiny_closure", "problem_notes", "status_admin", "sav_ticket"],
    pm_dstny: ["appointments", "destiny_coordination", "external_prep", "destiny_closure", "problem_notes", "sav_ticket"],
    uc_pm_fr_nl_dstny: ["appointments", "destiny_coordination", "external_prep", "destiny_closure", "problem_notes", "sav_ticket"],
    uc_tech_fr_nl_dstny: ["appointments", "external_prep", "network_config", "store_posts", "problem_notes", "sav_ticket"],
    logistic_coord_dstny: ["appointments", "order_articles", "problem_notes", "sav_ticket"],
    it: ["appointments", "external_prep", "network_config", "store_posts", "sav_ticket"],
    infra: ["appointments", "external_prep", "problem_notes", "sav_ticket"],
    default: ["appointments", "sav_ticket"]
  };
  return map[normalizedRole] || map.default;
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

function visibleActivitiesForUser(user = currentUser()) {
  if (!user || canSeeAllStores(user)) {
    return state.activities;
  }
  const allowedCodes = allowedStoresForUser(user);
  if (allowedCodes.includes("*")) {
    return state.activities;
  }
  const storesByName = new Map(state.stores.map((store) => [normalizeImportCell(store.name).toLowerCase(), store]));
  const allowedSet = new Set(allowedCodes);
  return state.activities.filter((activity) => {
    const store = storesByName.get(normalizeImportCell(activity.storeName).toLowerCase());
    return Boolean(store && allowedSet.has(store.code));
  });
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
  const normalizedRole = canonicalRoleKey(role);
  const labels = {
    supadmin_twem: "SupAdmin TWEM",
    admin_twem: "Admin TWEM",
    direction_brico: "Direction Brico",
    twem: "TWEM",
    brico: "Brico",
    supmanager: "SupManager",
    manager: "Manager magasin",
    magasin: "Magasin",
    telephonie_destiny: "Telephonie / Destiny",
    pm_dstny: "PM dstny",
    uc_pm_fr_nl_dstny: "uc pm fr & nl dstny",
    uc_tech_fr_nl_dstny: "uc tech fr & nl dstny",
    logistic_coord_dstny: "logistic coord dstny",
    it: "IT",
    infra: "Infra",
    intervenant: "Autre intervenant"
  };
  return labels[normalizedRole] || String(role || "").replace(/_/g, " ");
}

function normalizeRoleKey(value = "") {
  return normalizeImportCell(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function canonicalRoleKey(value = "") {
  const normalized = normalizeRoleKey(value);
  const aliases = {
    direction: "direction_brico",
    directory: "direction_brico",
    directory_brico: "direction_brico",
    direction_brico: "direction_brico",
    uc_pm_fr_nl_dstny: "uc_pm_fr_nl_dstny",
    uc_pm_fr_and_nl_dstny: "uc_pm_fr_nl_dstny",
    uc_tech_fr_nl_dstny: "uc_tech_fr_nl_dstny",
    uc_tech_fr_and_nl_dstny: "uc_tech_fr_nl_dstny",
    logistic_coord_dstny: "logistic_coord_dstny"
  };
  return aliases[normalized] || normalized;
}

function isIntervenantRole(role) {
  const normalized = String(role || "");
  return defaultIntervenantRoleOptions.includes(normalized)
    || ((state.roleOptions || []).includes(normalized) && !defaultRoleOptions.includes(normalized));
}

function intervenantRoleOptions() {
  return [...new Set([
    ...defaultIntervenantRoleOptions,
    ...(state.roleOptions || []).filter((role) => isIntervenantRole(role))
  ])];
}

function renderIntervenantRoleOptions(selectedValue) {
  return renderOptions(
    intervenantRoleOptions().map((role) => ({ value: role, label: roleLabel(role) })),
    selectedValue
  );
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
  const modeLabels = {
    hide: "Cacher",
    view: "Consulter",
    edit: "Encoder / modifier"
  };

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
                <span>${modeLabels.hide}</span>
                <input type="radio" name="visibility-${escapeHtml(role)}-${escapeHtml(tab.key)}-${escapeHtml(block.key)}" value="hide" data-visibility-mode="${escapeHtml(tab.key)}::${escapeHtml(block.key)}" ${currentMode === "hide" ? "checked" : ""}>
              </label>
              <label>
                <span>${modeLabels.view}</span>
                <input type="radio" name="visibility-${escapeHtml(role)}-${escapeHtml(tab.key)}-${escapeHtml(block.key)}" value="view" data-visibility-mode="${escapeHtml(tab.key)}::${escapeHtml(block.key)}" ${currentMode === "view" ? "checked" : ""}>
              </label>
              <label>
                <span>${modeLabels.edit}</span>
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
          <button type="button" class="mini-button" data-visibility-edit-role="${escapeHtml(entry)}">Configurer</button>
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
      saveVisibilityState();
      renderVisibilityEditor();
    });
  });

  visibilityZonesEditor.querySelectorAll("[data-visibility-mode]").forEach((input) => {
    input.addEventListener("change", () => {
      const [tabKey, blockKey] = input.getAttribute("data-visibility-mode").split("::");
      config.blocks[tabKey] ||= {};
      config.blocks[tabKey][blockKey] = input.value;
      saveVisibilityState();
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
  const candidates = intervenantPeopleForSelection(selectedValues);

  return candidates.map((person) => {
    const selected = selectedValues.includes(person.name) ? "selected" : "";
    return `<option value="${escapeHtml(person.name)}" ${selected}>${escapeHtml(person.name)} - ${escapeHtml(roleLabel(person.role))}</option>`;
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
  if (dateLike instanceof Date && !Number.isNaN(dateLike.getTime())) {
    const parsedDate = new Date(dateLike);
    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  }
  const raw = String(dateLike).trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const parsedIso = new Date(Number(year), Number(month) - 1, Number(day));
    parsedIso.setHours(0, 0, 0, 0);
    return Number.isNaN(parsedIso.getTime()) ? null : parsedIso;
  }
  const localMatch = raw.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})(?:\s+.*)?$/);
  if (localMatch) {
    let [, day, month, year] = localMatch;
    if (year.length === 2) {
      year = Number(year) >= 70 ? `19${year}` : `20${year}`;
    }
    const parsedLocal = new Date(Number(year), Number(month) - 1, Number(day));
    parsedLocal.setHours(0, 0, 0, 0);
    return Number.isNaN(parsedLocal.getTime()) ? null : parsedLocal;
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

function hasPlannedIntervention(store) {
  if (store.status === "done") {
    return false;
  }
  const workflow = ensureStoreWorkflowData(store);
  return sortedAppointments(store).some((appointment) => Boolean(normalizeDateOnly(appointment.datetime)))
    || Boolean(normalizeDateOnly(workflow.destinyInstallDate));
}

function hasActiveSav(store) {
  return ticketsForStore(store.id).some((ticket) => ticket.status !== "closed");
}

function isPlannedInterventionListView() {
  return state.filters.search === "intervention prevue";
}

function interventionDateLabel(store) {
  const appointments = sortedAppointments(store).filter((appointment) => normalizeDateOnly(appointment.datetime));
  if (appointments[0]?.datetime) {
    return formatDateTime(appointments[0].datetime);
  }
  const workflow = ensureStoreWorkflowData(store);
  return workflow.destinyInstallDate || "";
}

function compareStoresByInterventionDate(left, right) {
  const fallbackDate = new Date(8640000000000000);
  const leftDate = normalizeDateOnly(interventionDateLabel(left)) || fallbackDate;
  const rightDate = normalizeDateOnly(interventionDateLabel(right)) || fallbackDate;
  return leftDate - rightDate
    || normalizeImportCell(left.code).localeCompare(normalizeImportCell(right.code), "fr", { numeric: true });
}

function missingValidationLabels(store) {
  const workflow = ensureStoreWorkflowData(store);
  const missing = [];
  if (!isNetworkConfigurationOk(store)) missing.push("Config magasin");
  if (!isVlan22Ok(workflow)) missing.push("VLAN22");
  if (externalPrepStatusLabel(workflow) !== "Termine") missing.push("Pre-visite");
  if (workflow.destinyInstallDone !== "Oui") missing.push("Installation Destiny");
  return missing;
}

function isVlan22Ok(workflow = {}) {
  return workflow.vlan22Activated === "Oui"
    || workflow.vlan22Activated === "OK"
    || Boolean(normalizeImportCell(workflow.vlan22Date));
}

function isNetworkConfigurationOk(store) {
  const workflow = ensureStoreWorkflowData(store);
  const networkRows = getNetworkConfigRows(store);
  return Boolean(workflow.networkConfigConfirmed)
    || (networkRows.length > 0 && networkRows.every((row) => normalizeImportCell(row.extensionLabel)));
}

function storeValidationItems(store) {
  const workflow = ensureStoreWorkflowData(store);
  return [
    {
      label: "Config",
      okLabel: "Config OK",
      issueLabel: "Config a faire",
      ok: isNetworkConfigurationOk(store)
    },
    {
      label: "VLAN22",
      okLabel: "VLAN22 OK",
      issueLabel: "VLAN22 a valider",
      ok: isVlan22Ok(workflow)
    },
    {
      label: "Pre-visite",
      okLabel: "Pre-visite OK",
      issueLabel: "Pre-visite a faire",
      ok: externalPrepStatusLabel(workflow) === "Termine"
    },
    {
      label: "Installation",
      okLabel: "Installation OK",
      issueLabel: "Installation a faire",
      ok: workflow.destinyInstallDone === "Oui"
    }
  ];
}

function renderStoreValidationSignals(store, options = {}) {
  const items = storeValidationItems(store);
  const visibleItems = items;
  return `
    <div class="store-validation-signals">
      ${store.status === "blocked" ? '<span class="validation-signal signal-issue">Blocage</span>' : ""}
      ${visibleItems.map((item) => `
        <span class="validation-signal ${item.ok ? "signal-ok" : "signal-issue"}">
          ${escapeHtml(item.ok ? item.okLabel : item.issueLabel)}
        </span>
      `).join("")}
    </div>
  `;
}

function configControlStatus(store) {
  const workflow = ensureStoreWorkflowData(store);
  return {
    vlanOk: isVlan22Ok(workflow),
    networkConfigOk: isNetworkConfigurationOk(store),
    previsitOk: externalPrepStatusLabel(workflow) === "Termine",
    cablingOk: workflow.cablingStatus === "OK",
    switchOk: workflow.ltSwitchStatus === "Basculee" || workflow.ltSwitchStatus === "OK"
  };
}

function configStatusCards(visibleStores, total) {
  const countOk = (key) => visibleStores.filter((store) => configControlStatus(store)[key]).length;
  const cardPair = (label, key, okNote = "OK", koNote = "A traiter", filterKey = key) => {
    const okCount = countOk(key);
    const koCount = visibleStores.length - okCount;
    return [
      { label: `${label} OK`, value: okCount, note: okNote, portion: Math.round((okCount / total) * 100), filter: { reset: true, key: "configStatus", value: `${filterKey}:ok`, tab: "configuration" } },
      { label: `${label} pas OK`, value: koCount, note: koNote, portion: Math.round((koCount / total) * 100), filter: { reset: true, key: "configStatus", value: `${filterKey}:ko`, tab: "configuration" } }
    ];
  };
  return [
    ...cardPair("VLAN22", "vlanOk", "VLAN valide", "VLAN a valider", "vlanOk"),
    ...cardPair("Config reseau", "networkConfigOk", "Configuration complete", "Configuration incomplete", "networkConfigOk"),
    ...cardPair("Previsite", "previsitOk", "Previsite OK", "Previsite a suivre", "previsitOk"),
    ...cardPair("Cablage", "cablingOk", "Cablage OK", "Cablage a suivre", "cablingOk"),
    ...cardPair("Switch", "switchOk", "Switch effectue", "Switch a faire", "switchOk")
  ];
}

function matchesConfigStatusScope(store) {
  const scope = state.filters.configStatus || "all";
  if (scope === "all") {
    return true;
  }
  const [key, expected] = scope.split(":");
  const status = configControlStatus(store);
  if (!(key in status)) {
    return true;
  }
  return expected === "ok" ? Boolean(status[key]) : !status[key];
}

function getFilteredStores() {
  const filteredStores = getRoleScopedStores().filter((store) => {
    const searchTerm = normalizeImportCell(state.filters.search).toLowerCase();
    const normalizedSearch = normalizeImportStoreCode(searchTerm);
    const normalizedCode = normalizeImportStoreCode(store.code);
    const normalizedShopNumber = normalizeImportStoreCode(store.shopNumber);
    const exactCodeSearch = Boolean(searchTerm)
      && (
        normalizedSearch === normalizedCode
        || normalizedSearch === normalizedShopNumber
        || searchTerm === normalizeImportCell(store.code).toLowerCase()
        || searchTerm === normalizeImportCell(store.shopNumber).toLowerCase()
      );
    const appointments = sortedAppointments(store);
    const nextAction = appointments[0]?.note || store.health || "";
    const stage = currentWorkflowStage(store);
    const workflow = ensureStoreWorkflowData(store);
    const appointmentHaystack = appointments.map((appointment) => [
      appointment.status || "",
      appointment.note || "",
      peopleLabel(appointment.people || []),
      formatDateTime(appointment.datetime || "")
    ].join(" ")).join(" ");
    const plannedInstallKeywords = appointments.length || workflow.destinyInstallDate
      ? "installation prevue installation planifiee rendez-vous planifie"
      : "";
    const interventionKeywords = hasPlannedIntervention(store)
      ? "intervention prevue intervention planifiee"
      : "";
    const savKeywords = hasActiveSav(store)
      ? "sav actif sav ouvert sav en cours"
      : "";
    const invoiceHaystack = [
      store.poLicences,
      store.poHpDesk,
      store.poPm,
      store.poRentingHw,
      ...invoiceTicketsForStore(store).map((ticket) => [
        ticket.requestKind,
        ticket.materialLabel,
        ticket.concern,
        ticket.orderWorkflowStatus,
        ticket.invoiceOrderStatus,
        ticket.orderApproved,
        invoiceOrderReference(ticket),
        invoiceOrderDeliveredDate(ticket)
      ].join(" "))
    ].join(" ");
    const haystack = `${store.code} ${store.name} ${store.city} ${store.manager} ${store.shopType || ""} ${store.status} ${store.owner} ${nextAction} ${stage} ${appointmentHaystack} ${workflow.destinyInstallDate || ""} ${workflow.currentPhoneDate || ""} ${plannedInstallKeywords} ${interventionKeywords} ${savKeywords} ${invoiceHaystack}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm);
    const matchesStatus = state.filters.status === "all" || store.status === state.filters.status;
    const matchesOwner = state.filters.owner === "all" || storeProvenance(store) === state.filters.owner;
    const matchesStage = state.filters.stage === "all" || stage === state.filters.stage;
    const matchesType = state.filters.type === "all" || normalizeShopTypeValue(store.shopType || "") === state.filters.type;
    const matchesCity = state.filters.city === "all" || store.city === state.filters.city;
    const matchesDate = matchesDateScope(store);
    const matchesInvoice = matchesInvoiceScope(store);
    const matchesConfigStatus = matchesConfigStatusScope(store);
    if (exactCodeSearch) {
      return matchesSearch;
    }
    return matchesSearch && matchesStatus && matchesOwner && matchesStage && matchesType && matchesCity && matchesDate && matchesInvoice && matchesConfigStatus;
  });

  if (isPlannedInterventionListView()) {
    return filteredStores.slice().sort(compareStoresByInterventionDate);
  }
  return filteredStores;
}

function renderSummary() {
  const visibleStores = getRoleScopedStores();
  const total = visibleStores.length || 1;
  const doneCount = visibleStores.filter((store) => store.status === "done").length;
  const blockedCount = visibleStores.filter((store) => store.status === "blocked").length;
  const noRdvCount = visibleStores.filter((store) => !hasPlannedIntervention(store)).length;
  const deploymentCount = visibleStores.filter(hasPlannedIntervention).length;
  const runCount = visibleStores.filter(hasActiveSav).length;
  const dosCount = visibleStores.filter((store) => normalizeShopTypeValue(store.shopType) === "DOS").length;
  const fosCount = visibleStores.filter((store) => normalizeShopTypeValue(store.shopType) === "FOS").length;
  const fosdosCount = visibleStores.filter((store) => normalizeShopTypeValue(store.shopType) === "FOSDOS").length;
  const validationItCount = visibleStores.filter((store) => !isVlan22Ok(ensureStoreWorkflowData(store))).length;
  const riskCount = visibleStores.filter((store) => {
    const workflow = ensureStoreWorkflowData(store);
    return store.status === "blocked" || externalPrepStatusLabel(workflow) !== "Termine";
  }).length;
  const mainTab = activeMainWorkspaceTab();
  const cardsByTab = {
    dashboard: [
      { label: "Total magasins", value: visibleStores.length, note: "Vision globale parc", portion: 100, filter: null },
      { label: "DOS", value: dosCount, note: "Type magasin DOS", portion: Math.round((dosCount / total) * 100), filter: { key: "type", value: "DOS", tab: "stores" } },
      { label: "FOS", value: fosCount, note: "Type magasin FOS", portion: Math.round((fosCount / total) * 100), filter: { key: "type", value: "FOS", tab: "stores" } },
      { label: "FOSDOS", value: fosdosCount, note: "Type magasin FOSDOS", portion: Math.round((fosdosCount / total) * 100), filter: { key: "type", value: "FOSDOS", tab: "stores" } },
      { label: "En deploiement", value: deploymentCount, note: "Interventions prevues", portion: Math.round((deploymentCount / total) * 100), filter: { reset: true, key: "search", value: "intervention prevue", tab: "stores" } },
      { label: "Helpdesk on", value: runCount, note: "Magasins avec SAV", portion: Math.round((runCount / total) * 100), filter: { reset: true, key: "search", value: "sav actif", tab: "stores" } },
      { label: "Clotures", value: doneCount, note: "Projets finalises", portion: Math.round((doneCount / total) * 100), filter: { key: "status", value: "done", tab: "stores" } },
      { label: "Bloques", value: blockedCount, note: "Dossiers a debloquer", portion: Math.round((blockedCount / total) * 100), filter: { key: "status", value: "blocked", tab: "stores" } }
    ],
    timeline: [
      { label: "Interventions planifiees", value: visibleStores.filter((store) => sortedAppointments(store).length).length, note: "Chronologie magasins", portion: Math.round((visibleStores.filter((store) => sortedAppointments(store).length).length / total) * 100), filter: null },
      { label: "Validation VLAN22", value: validationItCount, note: "VLAN22 a valider", portion: Math.round((validationItCount / total) * 100), filter: { key: "stage", value: "Validation VLAN22", tab: "timeline" } },
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
    invoice: [
      { label: "Magasins", value: visibleStores.length, note: "Suivi facturation", portion: 100, filter: null },
      { label: "PO manquants", value: visibleStores.filter(hasMissingInvoicePo).length, note: "Au moins un PO absent", portion: Math.round((visibleStores.filter(hasMissingInvoicePo).length / total) * 100), filter: { reset: true, key: "invoice", value: "missing_po", tab: "invoice" } },
      { label: "A facturer", value: visibleStores.reduce((sum, store) => sum + invoiceTicketsForStore(store, "billable").length, 0), note: "Commandes supplementaires", portion: 100, filter: { reset: true, key: "invoice", value: "billable", tab: "invoice" } },
      { label: "Remplacements", value: visibleStores.reduce((sum, store) => sum + invoiceTicketsForStore(store, "replacement").length, 0), note: "Materiel casse / remplace", portion: 100, filter: { reset: true, key: "invoice", value: "replacement", tab: "invoice" } }
    ],
    stores: [
      { label: t("summaryStores"), value: visibleStores.length, note: t("summaryStoresNote"), portion: 100 },
      { label: t("summaryDone"), value: doneCount, note: t("summaryDoneNote"), portion: Math.round((doneCount / total) * 100) },
      { label: t("summaryBlocked"), value: blockedCount, note: t("summaryBlockedNote"), portion: Math.round((blockedCount / total) * 100) },
      { label: t("summaryNoAppointment"), value: noRdvCount, note: t("summaryNoAppointmentNote"), portion: Math.round((noRdvCount / total) * 100) }
    ],
    configuration: configStatusCards(visibleStores, total)
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
      if (filter?.reset) {
        resetWorkspaceFilters();
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
              { label: "En attente infos", value: visibleStores.filter((store) => !isNetworkConfigurationOk(store)).length, note: "Config magasin attendue", filter: { key: "stage", value: "Validation manager config", tab: "stores" } },
              { label: "Validation VLAN22", value: visibleStores.filter((store) => !isVlan22Ok(ensureStoreWorkflowData(store))).length, note: "VLAN22 a valider", filter: { key: "stage", value: "Validation VLAN22", tab: "timeline" } },
              { label: "En cours", value: visibleStores.filter(hasPlannedIntervention).length, note: "Interventions prevues", filter: { reset: true, key: "search", value: "intervention prevue", tab: "stores" } },
              { label: "RUN", value: visibleStores.filter(hasActiveSav).length, note: "Magasins avec SAV", filter: { reset: true, key: "search", value: "sav actif", tab: "stores" } },
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
      </div>
    `;
    dashboardExtra.querySelectorAll("[data-kpi-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = JSON.parse(button.getAttribute("data-kpi-filter"));
        if (filter?.tab) {
          state.activeAdminTab = filter.tab;
        }
        if (filter?.reset) {
          resetWorkspaceFilters();
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
  const types = [...new Set(getRoleScopedStores().map((store) => normalizeShopTypeValue(store.shopType)).filter(Boolean))].sort();
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
  if (storeEditSelect) {
    const selectedStoreId = storeEditSelect.value;
    storeEditSelect.innerHTML = [
      '<option value="">Nouveau magasin</option>',
      ...state.stores
        .slice()
        .sort((a, b) => String(a.code || "").localeCompare(String(b.code || ""), "fr", { numeric: true }))
        .map((store) => `<option value="${escapeHtml(String(store.id))}">${escapeHtml(`${store.code} - ${store.name}`)}</option>`)
    ].join("");
    if ([...storeEditSelect.options].some((option) => option.value === selectedStoreId)) {
      storeEditSelect.value = selectedStoreId;
    }
  }

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
  if (intervenantRoleSelect) {
    intervenantRoleSelect.innerHTML = renderIntervenantRoleOptions(intervenantRoleSelect.value || "intervenant");
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
      <p>Plusieurs rendez-vous et plusieurs jours d installation possibles par magasin.</p>
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
    || Number.isFinite(Number(store.fixBigCount))
    || Number.isFinite(Number(store.mobileCount))
    || Number.isFinite(Number(store.mobileSmartphoneCount))
    || Number.isFinite(Number(store.flashLightCount))
    || Number.isFinite(Number(store.callButtonCount))
    || Number.isFinite(Number(store.panicCount))
  ) {
    return {
      licenseCount: Math.max(0, Number(store.licenseCount) || 0),
      fixCount: Math.max(0, Number(store.fixCount) || 0),
      fixBigCount: Math.max(0, Number(store.fixBigCount) || 0),
      mobileCount: Math.max(0, Number(store.mobileCount) || 0),
      mobileSmartphoneCount: Math.max(0, Number(store.mobileSmartphoneCount) || 0),
      flashLightCount: Math.max(0, Number(store.flashLightCount) || 0),
      callButtonCount: Math.max(0, Number(store.callButtonCount) || 0),
      panicCount: Math.max(0, Number(store.panicCount) || 0)
    };
  }

  const codeNumber = Number.parseInt(String(store.code).replace(/\D/g, ""), 10) || 0;
  const licenseCount = 8 + (codeNumber % 6);
  const fixCount = Math.max(2, Math.round(licenseCount * 0.6));
  const fixBigCount = 0;
  const mobileCount = Math.max(1, Math.round(licenseCount * 0.3));
  const mobileSmartphoneCount = 0;
  const flashLightCount = 0;
  const callButtonCount = Math.max(1, Math.round(licenseCount * 0.15));
  const panicCount = Math.max(0, Math.round(licenseCount * 0.08));

  return { licenseCount, fixCount, fixBigCount, mobileCount, mobileSmartphoneCount, flashLightCount, callButtonCount, panicCount };
}

function defaultNetworkRowsForStore(store) {
  const { fixCount, fixBigCount, mobileCount, mobileSmartphoneCount, flashLightCount, callButtonCount, panicCount } = getStoreQuantityPlan(store);
  const rows = [];
  const pushRows = (category, count) => {
    for (let index = 1; index <= count; index += 1) {
      rows.push({
        id: `${category}-${index}`,
        category,
        slotLabel: `${category} ${index}`,
        extensionLabel: defaultNetworkExtensionForRow({ id: `${category}-${index}`, category }),
        note: ""
      });
    }
  };
  pushRows("Poste fixe", fixCount);
  pushRows("Poste fixe big", fixBigCount);
  pushRows("Mobile", mobileCount);
  pushRows("Mobile smartphone", mobileSmartphoneCount);
  pushRows("Flash light", flashLightCount);
  pushRows("Call button", callButtonCount);
  pushRows("Panic button", panicCount);
  return rows;
}

function getNetworkConfigRows(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (!Array.isArray(workflow.networkRows) || !workflow.networkRows.length) {
    workflow.networkRows = defaultNetworkRowsForStore(store);
  }
  reconcileNetworkRowsWithQuantities(store);
  return workflow.networkRows;
}

function reconcileNetworkRowsWithQuantities(store) {
  const workflow = ensureStoreWorkflowData(store);
  const blueprintRows = defaultNetworkRowsForStore(store);
  const existingRows = Array.isArray(workflow.networkRows) ? workflow.networkRows : [];
  const existingById = new Map(existingRows.map((row) => [row.id, row]));
  workflow.networkRows = blueprintRows.map((row) => {
    const previous = existingById.get(row.id);
    return previous
      ? {
          ...row,
          extensionLabel: previous.extensionLabel || row.extensionLabel || "",
          note: previous.note || ""
        }
      : row;
  });
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
  reconcileGsmRowsWithQuantities(store);
  return workflow.gsmRows;
}

function reconcileGsmRowsWithQuantities(store) {
  const workflow = ensureStoreWorkflowData(store);
  const blueprintRows = defaultGsmRowsForStore(store);
  const existingRows = Array.isArray(workflow.gsmRows) ? workflow.gsmRows : [];
  workflow.gsmRows = blueprintRows.map((row, index) => {
    const previous = existingRows[index];
    return previous
      ? {
          ...row,
          id: previous.id || row.id,
          model: previous.model || "",
          mobileNumber: previous.mobileNumber || "",
          mobileNetwork: previous.mobileNetwork || "",
          iccid: previous.iccid || "",
          puk: previous.puk || "",
          extensionLinked: previous.extensionLinked || "",
          user: previous.user || "",
          callGroup: previous.callGroup || ""
        }
      : row;
  });
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
  const { licenseCount, fixCount, fixBigCount, mobileCount, mobileSmartphoneCount, flashLightCount, callButtonCount, panicCount } = getStoreQuantityPlan(store);
  const workflow = ensureStoreWorkflowData(store);
  const quantityCells = [
    ["Licences", "license_count", licenseCount],
    ["Postes fixes", "fix_count", fixCount],
    ["Fix big", "fix_big_count", fixBigCount],
    ["Mobiles", "mobile_count", mobileCount],
    ["Mobile smartphone", "mobile_smartphone_count", mobileSmartphoneCount],
    ["Flash light", "flash_light_count", flashLightCount],
    ["Call buttons", "call_button_count", callButtonCount],
    ["Panic buttons", "panic_count", panicCount]
  ];

  return `
    <article class="editor-card full-span-card">
      <h3>Quantites magasin</h3>
      <p>Vue de pilotage rapide des besoins reseau et materiel du magasin.</p>
      <div class="quantity-meta-row">
        <div><strong>Date telephonie actuelle</strong> ${escapeHtml(workflow.currentPhoneDate || "-")}</div>
        <div><strong>IP range</strong> ${escapeHtml(store.ipRange || "-")}</div>
      </div>
      <div class="quantity-grid">
        ${quantityCells.map(([label, fieldName, value]) => `
          <div class="quantity-card">
            <span class="mini-label">${label}</span>
            ${isAdminTwem()
              ? `<input type="number" min="0" name="${fieldName}" value="${escapeHtml(String(value))}">`
              : `<strong>${value}</strong>`}
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

  function buildNetworkConfigSkeleton(store, options = {}) {
    const { showConfirmBar = true } = options;
    const workflow = ensureStoreWorkflowData(store);
    const rows = getNetworkConfigRows(store);
  const extensionOptionsForCategory = (category, selected = "") => networkExtensionOptionsForCategory(category, store.language || "fr", selected);
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
                ${extensionOptionsForCategory(category, row.extensionLabel).map((option) => `<option value="${escapeHtml(option)}" ${row.extensionLabel === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
            <label>
              <span>Note</span>
              <input type="text" name="network_note_${escapeHtml(row.id)}" value="${escapeHtml(row.note || "")}" placeholder="Ex: personnaliser la touche / commentaire">
            </label>
            </div>
          `).join("")}
        </div>
        <div class="posts-skeleton-actions">
          <button type="submit" class="mini-button">Sauvegarder ce bloc</button>
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
                <td>${escapeHtml(extensionDisplayCategoryLabel(row))}</td>
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
          ? (workflow.networkConfigConfirmed && !canEditZone(store, "network_config") ? summaryContent : editableContent)
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
  const workflow = ensureStoreWorkflowData(store);
  const rows = getNetworkConfigRows(store);

  return `
    <details class="posts-skeleton" open data-access-zone="store_posts">
      <summary>
        <span>Postes magasin</span>
        <span>${rows.length ? `${rows.length} ligne(s) configuree(s)` : "Aucune ligne configuree"}</span>
      </summary>
      <div class="posts-skeleton-body">
        <p class="posts-skeleton-intro">${workflow.networkConfigConfirmed ? "Choix telephonie confirmes et visibles ici sans devoir ouvrir l onglet configuration." : "Les choix enregistres dans Configuration magasin remonteront ici des qu ils seront completes."}</p>
        ${rows.length ? `
          <div class="posts-table-wrap">
            <table class="posts-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Poste</th>
                  <th>Extension + lieu</th>
                  <th>Etat</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map((row) => `
                  <tr>
                    <td>${escapeHtml(extensionDisplayCategoryLabel(row) || "-")}</td>
                    <td>${escapeHtml(row.slotLabel || "-")}</td>
                    <td>${escapeHtml(row.extensionLabel || "-")}</td>
                    <td><span class="${badgeClass(row.extensionLabel ? "ok" : "planned")}">${escapeHtml(row.extensionLabel ? "Configure" : "A confirmer")}</span></td>
                    <td>${escapeHtml(row.note || "-")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : '<div class="empty-state">Aucun choix telephonie enregistre pour le moment.</div>'}
      </div>
    </details>
  `;
}

function buildStoreConfigurationReadbackCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  const gsmRows = getGsmRows(store);
  return `
    <div class="editor-grid">
      <article class="editor-card full-span-card grouped-card">
        <div class="grouped-card-head">
          <h3>Configuration detaillee</h3>
          <p>Lecture directe de toute la configuration sans devoir repasser par l onglet Configuration magasin.</p>
        </div>
        <div class="two-col">
          <section class="subpanel">
            <h4>Alarme</h4>
            <table class="compact-table compact-table-summary">
              <tbody>
                <tr><td>Type d alarme</td><td>${escapeHtml(workflow.alarmType || "A confirmer")}</td></tr>
                <tr><td>Societe</td><td>${escapeHtml(workflow.alarmCompany || "A renseigner")}</td></tr>
                <tr><td>Tel centrale alarme</td><td>${escapeHtml(workflow.alarmCentralPhone || "A renseigner")}</td></tr>
                <tr><td>Autres</td><td>${escapeHtml(workflow.alarmOther || "A renseigner")}</td></tr>
              </tbody>
            </table>
          </section>
          <section class="subpanel">
            <h4>Groupes d appel et cascades</h4>
            <table class="compact-table compact-table-summary">
              <tbody>
                <tr><td>Groupes d appel</td><td>${escapeHtml(workflow.callGroupsNote || "A renseigner")}</td></tr>
                <tr><td>Cascades</td><td>${escapeHtml(workflow.cascadeNote || "A renseigner")}</td></tr>
              </tbody>
            </table>
          </section>
        </div>
        <section class="subpanel">
          <h4>GSM / SIM</h4>
          ${gsmRows.length ? `
            <div class="compact-table-wrap">
              <table class="compact-table">
                <thead>
                  <tr>
                    <th>GSM</th>
                    <th>Modele</th>
                    <th>Extension</th>
                    <th>Utilisateur</th>
                    <th>Numero</th>
                    <th>Reseau</th>
                  </tr>
                </thead>
                <tbody>
                  ${gsmRows.map((row, index) => `
                    <tr>
                      <td>GSM ${index + 1}</td>
                      <td>${escapeHtml(row.model || "A confirmer")}</td>
                      <td>${escapeHtml(row.extensionLinked || "A confirmer")}</td>
                      <td>${escapeHtml(row.user || "A renseigner")}</td>
                      <td>${escapeHtml(row.mobileNumber || "A renseigner")}</td>
                      <td>${escapeHtml(row.mobileNetwork || "A renseigner")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : '<div class="empty-state">Aucun GSM renseigne.</div>'}
        </section>
      </article>
    </div>
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

function buildStoreSectionNav(mode = "stores", store = null) {
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
      ${store ? '<button type="submit" class="mini-button store-editor-nav-action store-editor-save-top" data-store-submit-top>Enregistrer</button>' : ""}
      ${store ? `<button type="button" class="mini-button store-editor-nav-action" data-store-print="${store.id}">Imprimer la fiche complete</button>` : ""}
    </nav>
  `;
}

function externalPrepProgress(workflow) {
  const done = [
    Boolean(normalizeImportCell(workflow.vlan22Date))
      || ["oui", "ok", "bloque"].includes(normalizeRoleKey(workflow.vlan22Activated)),
    Boolean(normalizeImportCell(workflow.cablingDate))
      || ["ok", "bloque", "probleme"].includes(normalizeRoleKey(workflow.cablingStatus)),
    Boolean(normalizeImportCell(workflow.ltSwitchDate || workflow.transferDate))
      || ["ok", "bloque", "probleme", "basculee"].includes(normalizeRoleKey(workflow.ltSwitchStatus)),
    Boolean(normalizeImportCell(workflow.mobileCoverage))
      && normalizeRoleKey(workflow.mobileCoverage) !== "a_verifier"
  ].filter(Boolean).length;
  return { done, total: 4 };
}

function externalPrepStatusLabel(workflow) {
  const progress = externalPrepProgress(workflow);
  if (progress.done === 0) {
    return "A faire";
  }
  if (progress.done >= progress.total) {
    return "Termine";
  }
  return `Partiel ${progress.done}/${progress.total}`;
}

  function buildConfigurationSummaryCard(store) {
    const workflow = ensureStoreWorkflowData(store);
    const networkRows = getNetworkConfigRows(store);
    const configuredRows = networkRows.filter((row) => row.extensionLabel || row.note).length;
    const missingRows = Math.max(0, networkRows.length - configuredRows);
    const transmittedRows = [
      ["Demande configuration", workflow.extensionRequestStatus || "A envoyer"],
      ["Commande articles", normalizeImportCell(store.poHardware || store.poHw || "-") ? "Reference recue" : "A confirmer"],
      ["Mail configuration", workflow.extensionRequestStatus || "A envoyer"],
      ["Ticket Destiny", workflow.destinyTicketRef || "A confirmer"],
    ["Date telephonie actuelle", workflow.currentPhoneDate || "A confirmer"],
    ["Configuration VLAN22", workflow.vlan22Date || workflow.vlan22Status || "A confirmer"]
  ];

    const confirmedRows = [
      ["Coordination Destiny", workflow.destinyPmName || workflow.destinyInstallDate ? "Fait" : "A faire"],
      ["Pre-visite", externalPrepStatusLabel(workflow)],
      ["Preparation externe", externalPrepStatusLabel(workflow)],
      ["VLAN22 active", workflow.vlan22Date ? "Oui" : (workflow.vlan22Activated || "A faire")],
      ["Configuration magasin", workflow.extensionConfigStatus === "Recue" ? "Confirmee" : "En attente"],
      ["Choix telephonie", isNetworkConfigurationOk(store) ? "Confirmes" : "A confirmer"],
      ["Configuration reseau", networkRows.length ? `${configuredRows}/${networkRows.length} configures${missingRows ? ` - ${missingRows} manquant(s)` : ""}` : "A definir"]
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
              <table class="compact-table compact-table-summary">
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
              <table class="compact-table compact-table-summary">
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

function renderWorkflowRemarks(remarks = []) {
  return Array.isArray(remarks) && remarks.length
    ? `
      <div class="remark-history">
        ${remarks.slice().reverse().map((remark) => `
          <div class="remark-entry">
            <div class="remark-meta">${escapeHtml(formatDateTime(remark.createdAt))} - ${escapeHtml(remark.author || "-")}</div>
            <div>${escapeHtml(remark.text || "-")}</div>
          </div>
        `).join("")}
      </div>
    `
    : '<div class="cell-note">Aucune remarque enregistree.</div>';
}

function buildPreparationHubCard(store) {
  const workflow = ensureStoreWorkflowData(store);
  return `
    <div class="editor-grid section-anchor" id="section-preparation">
      <article class="editor-card full-span-card grouped-card" data-access-zone="external_prep">
        <div class="grouped-card-head">
          <h3>Preparation chantier</h3>
          <p>Preparation externe et installation suivies en deux cadres lisibles.</p>
        </div>
        <div class="preparation-stack">
          <section class="subpanel prep-wide-panel">
            <h4>1. Preparation externe</h4>
            <div class="prep-status-grid">
              <div class="prep-pair-card">
                <label>
                  <span>VLAN22</span>
                  <select name="vlan22_activated">
                    ${renderOptions(["A prevoir", "OK", "Bloque", "Non"], workflow.vlan22Activated === "Oui" ? "OK" : workflow.vlan22Activated)}
                  </select>
                </label>
                <label>
                  <span>Date VLAN22</span>
                  <input type="date" name="vlan22_date" value="${escapeHtml(workflow.vlan22Date || "")}">
                </label>
              </div>
              <div class="prep-pair-card">
                <label>
                  <span>Cablage</span>
                  <select name="cabling_status">
                    ${renderOptions(["A prevoir", "OK", "Bloque", "Probleme"], workflow.cablingStatus)}
                  </select>
                </label>
                <label>
                  <span>Date cablage</span>
                  <input type="date" name="cabling_date" value="${escapeHtml(workflow.cablingDate || "")}">
                </label>
              </div>
              <div class="prep-pair-card">
                <label>
                  <span>Switch</span>
                  <select name="lt_switch_preparation_status">
                    ${renderOptions(["A prevoir", "OK", "Bloque", "En attente", "Basculee"], workflow.ltSwitchStatus === "Basculee" ? "OK" : workflow.ltSwitchStatus)}
                  </select>
                </label>
                <label>
                  <span>Date switch</span>
                  <input type="date" name="lt_switch_date" value="${escapeHtml(workflow.ltSwitchDate || workflow.transferDate || "")}">
                </label>
              </div>
              <div class="prep-pair-card">
                <label>
                  <span>Couverture mobile</span>
                  <select name="mobile_coverage">
                    ${renderOptions(["A verifier", "Telenet", "Proximus", "Tous", "Bloque"], workflow.mobileCoverage)}
                  </select>
                </label>
              </div>
            </div>
            <div class="remark-box">
              <label>
                <span>Nouvelle remarque preparation externe</span>
                <textarea name="external_prep_new_note" rows="3" placeholder="La remarque sera horodatee avec ton nom lors de la sauvegarde."></textarea>
              </label>
              ${renderWorkflowRemarks(workflow.externalPrepRemarks)}
            </div>
          </section>
          <section class="subpanel prep-wide-panel">
            <h4>2. Installation</h4>
            <div class="prep-status-grid">
              <label>
                <span>Date installation Destiny</span>
                <input type="date" name="destiny_install_date" value="${escapeHtml(workflow.destinyInstallDate)}">
              </label>
              <label>
                <span>Reference ticket</span>
                <input type="text" name="destiny_ticket_ref" value="${escapeHtml(workflow.destinyTicketRef)}" placeholder="Ex: DST-2026-0412">
              </label>
              <label>
                <span>Switch</span>
                <input type="date" name="install_switch_date" value="${escapeHtml(workflow.installSwitchDate || "")}">
              </label>
              <label>
                <span>Cable</span>
                <input type="date" name="install_cable_date" value="${escapeHtml(workflow.installCableDate || "")}">
              </label>
              <label>
                <span>Antenne</span>
                <input type="date" name="install_antenna_date" value="${escapeHtml(workflow.installAntennaDate || "")}">
              </label>
              <label>
                <span>Centrale</span>
                <input type="date" name="install_central_date" value="${escapeHtml(workflow.installCentralDate || "")}">
              </label>
            </div>
            <div class="remark-box">
              <label>
                <span>Nouvelle remarque installation</span>
                <textarea name="installation_new_note" rows="3" placeholder="La remarque sera horodatee avec ton nom lors de la sauvegarde."></textarea>
              </label>
              ${renderWorkflowRemarks(workflow.installationRemarks)}
            </div>
            <div class="posts-skeleton-actions">
              <button type="submit" class="mini-button">Sauvegarder la preparation</button>
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
        <div class="two-col section-block">
          <label>
            <span>Type magasin</span>
            <select name="shop_type">${renderOptions(["DOS", "FOS", "FOSDOS"], normalizeShopTypeValue(store.shopType) || "DOS")}</select>
          </label>
          <label>
            <span>IP range</span>
            <input type="text" value="${escapeHtml(store.ipRange || "")}" readonly>
          </label>
        </div>
        <div class="two-col section-block">
          <label>
            <span>N client contrat actuel</span>
            <input type="text" name="current_contract_client_number" value="${escapeHtml(workflow.currentContractClientNumber || "")}">
          </label>
          <label>
            <span>Numero principal actuel</span>
            <input type="text" name="current_contract_main_number" value="${escapeHtml(workflow.currentContractMainNumber || "")}">
          </label>
        </div>
        <div class="section-block">
          <label>
            <span>Autres numeros releves</span>
            <textarea name="current_contract_other_numbers" rows="4">${escapeHtml(workflow.currentContractOtherNumbers || "")}</textarea>
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
  const isZipPlan = /\.zip$/i.test(planName) || workflow.planFileType === "application/zip";
  const emptyLabel = "Aucun document importe";
  const importLabel = planName ? "Remplacer le document" : "Importer PDF / ZIP";
  const openLabel = isZipPlan ? "Telecharger le ZIP" : "Ouvrir le PDF";
  const updatedLabel = workflow.planPdfUpdatedAt
    ? `Derniere mise a jour ${formatDateTime(workflow.planPdfUpdatedAt)}`
    : "Ajoute ici le plan PDF du magasin ou un ZIP contenant plusieurs plans.";
  const saveFeedback = state.storeSaveFeedback?.storeId === Number(store.id)
    ? state.storeSaveFeedback
    : null;

  return `
    <div class="editor-grid section-anchor" id="section-documents">
      <article class="editor-card full-span-card" data-access-zone="store_documents">
        <h3>Documents / Plan magasin</h3>
        <div class="two-col align-end-grid">
          <div class="cell-stack">
            <strong>${escapeHtml(planName || emptyLabel)}</strong>
            <span class="cell-note">${escapeHtml(updatedLabel)}</span>
          </div>
          <div class="posts-skeleton-actions">
            <input type="file" class="hidden-file-input" data-plan-file="${store.id}" accept="application/pdf,application/zip,.pdf,.zip">
            <button type="button" class="mini-button" data-plan-upload="${store.id}">${importLabel}</button>
            <button type="button" class="mini-button" data-plan-open="${store.id}" ${workflow.planPdfDataUrl || workflow.planFileId ? "" : "disabled"}>${openLabel}</button>
            <button type="button" class="mini-button" data-plan-delete="${store.id}" ${workflow.planPdfDataUrl || workflow.planFileId ? "" : "disabled"}>Supprimer</button>
          </div>
        </div>
        ${saveFeedback ? `<p class="validation-text is-${escapeHtml(saveFeedback.status)} document-feedback">${escapeHtml(saveFeedback.message)}</p>` : ""}
      </article>
    </div>
  `;
}

function buildEquipmentCards(store) {
  const workflow = ensureStoreWorkflowData(store);
  const gsmRows = getGsmRows(store);
  const extensionOptions = availableExtensionReferenceOptions("", store.language || "fr");
  return `
    <div class="editor-grid section-anchor" id="section-equipment">
      <article class="editor-card full-span-card grouped-card" data-access-zone="store_posts">
        <h3>GSM / SIM</h3>
        <div class="gsm-compact-stack">
          ${gsmRows.map((row, index) => `
            <article class="gsm-compact-item">
              <div class="network-category-head">
                <h4>GSM ${index + 1}</h4>
                <span>${escapeHtml(row.user || row.mobileNumber || "A definir")}</span>
              </div>
              <div class="gsm-compact-grid">
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
                    ${extensionOptions.map((option) => `<option value="${escapeHtml(option)}" ${row.extensionLinked === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
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
            </article>
          `).join("")}
        </div>
        <div class="posts-skeleton-actions">
          ${isSupAdmin() ? `<button type="button" class="mini-button" data-gsm-add="${store.id}">Ajouter un GSM</button>` : ""}
          <button type="submit" class="mini-button">Sauvegarder les GSM</button>
        </div>
      </article>
        <article class="editor-card full-span-card">
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
          <div class="posts-skeleton-actions">
            <button type="submit" class="mini-button">Sauvegarder ce bloc</button>
          </div>
        </article>
        <article class="editor-card full-span-card">
          <h3>Groupes d appel</h3>
          <label>
            <span>Groupes d appel</span>
            <textarea name="call_groups_note" rows="6" placeholder="Ex: accueil > caisse > directeur">${escapeHtml(workflow.callGroupsNote)}</textarea>
          </label>
          <div class="posts-skeleton-actions">
            <button type="submit" class="mini-button">Sauvegarder ce bloc</button>
          </div>
        </article>
        <article class="editor-card full-span-card">
          <h3>Cascades</h3>
          <label>
            <span>Cascades</span>
          <textarea name="cascade_note" rows="6" placeholder="Ex: si non reponse, renvoi vers permanence">${escapeHtml(workflow.cascadeNote)}</textarea>
        </label>
        <div class="posts-skeleton-actions">
          <button type="submit" class="mini-button">Sauvegarder ce bloc</button>
        </div>
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
    currentContractClientNumber: "",
    currentContractMainNumber: "",
    currentContractOtherNumbers: "",
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
    vlan22Date: "",
    vlan22Activated: "Non",
    charlesRouxStatus: "A verifier",
    cablingStatus: "A verifier",
    cablingDate: "",
    mobileChargersSent: "Non",
    mobileChargerCount: String(Math.max(1, Math.ceil(mobileCount / 10))),
    planPdfName: "",
    planFileType: "",
    planFileId: "",
    planFileBucketId: "",
    planFileSize: "",
    planPdfDataUrl: "",
    planPdfUpdatedAt: "",
    destinyInstallDone: "Non",
    destinyInstallRemark: "",
    bricoFinalMailStatus: "A envoyer",
    bricoFinalRemark: "",
    ltSwitchStatus: "En attente",
    ltSwitchDate: "",
    installSwitchDate: "",
    installCableDate: "",
    installAntennaDate: "",
    installCentralDate: "",
    externalPrepRemarks: [],
    installationRemarks: [],
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

  if (store.workflow.vlan22Date === "1970-01-01") {
    store.workflow.vlan22Date = "";
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
  const managerContact = managerContactForStore(store);
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
        <span class="mini-label">Responsable</span>
        <strong>${escapeHtml(managerContact.name || "-")}</strong>
        <span class="cell-note">${escapeHtml(managerContact.phone || "-")}</span>
        <span class="cell-note">${escapeHtml(managerContact.email || "-")}</span>
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
  const focused = state.focusedUpdate && (
    state.focusedUpdate.storeId === store.id
    || state.focusedUpdate.storeCode === store.code
  );
  const focusBanner = focused
    ? `
        <div class="store-update-focus" data-update-focus-banner>
          <div>
            <span class="mini-label">Nouveaute a consulter</span>
            <strong>${escapeHtml(state.focusedUpdate.message || "Nouvelle information a consulter")}</strong>
            ${state.focusedUpdate.createdAt ? `<p>${escapeHtml(formatDateTime(state.focusedUpdate.createdAt))}</p>` : ""}
          </div>
        </div>
      `
    : "";
  const saveFeedback = state.storeSaveFeedback?.storeId === Number(store.id)
    ? state.storeSaveFeedback
    : null;
  const detailContent = mode === "configuration"
    ? `
        ${buildStoreSectionNav("configuration", store)}

        ${buildPreparationHubCard(store)}

        ${buildConfigurationHubCard(store)}

          ${buildEquipmentCards(store)}

        <div class="editor-grid section-anchor" id="section-closing">
          ${buildClosureWorkflowCard(store)}
        </div>
      `
    : `
        ${buildStoreSectionNav("stores", store)}

        <div class="editor-grid section-anchor" id="section-quantities">
          ${buildStorePilotSkeleton(store)}
        </div>

          ${buildConfigurationSummaryCard(store)}

          <div class="editor-grid section-anchor" id="section-overview">
            ${buildStorePostsSkeleton(store)}
          </div>

          ${buildStoreConfigurationReadbackCard(store)}

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
      ${focusBanner}
      <form class="store-editor" data-store-editor="${store.id}" data-store-mode="${mode}">
        ${detailContent}
        <div class="editor-actions">
          <span class="validation-text ${saveFeedback ? `is-${escapeHtml(saveFeedback.status)}` : ""}" data-validation="${store.id}">${escapeHtml(saveFeedback?.message || "")}</span>
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
    form.addEventListener("input", () => {
      markStoreEditorDirty(form.getAttribute("data-store-editor"));
    });
    form.addEventListener("change", () => {
      markStoreEditorDirty(form.getAttribute("data-store-editor"));
    });
    form.addEventListener("focusin", () => {
      markStoreEditorDirty(form.getAttribute("data-store-editor"));
    });
  });

  projectTableBody.querySelectorAll("[data-sav-create]").forEach((button) => {
    button.addEventListener("click", handleSavCreate);
  });

  projectTableBody.querySelectorAll("[data-sav-update]").forEach((button) => {
    button.addEventListener("click", handleSavUpdate);
  });

  projectTableBody.querySelectorAll("[data-sav-dispatch]").forEach((button) => {
    button.addEventListener("click", handleSavDispatch);
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
  const plannedInterventionView = isPlannedInterventionListView();
  const displayStores = mode === "configuration"
    ? stores.slice().sort(compareStoresByInterventionDate)
    : stores;
  displayStores.forEach((store) => {
    const isExpanded = state.expandedStoreIds.has(store.id);
    const row = document.createElement("tr");
    const managerContact = managerContactForStore(store);
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
          <strong>${escapeHtml(managerContact.name || "-")}</strong>
          <div class="cell-note">${escapeHtml(managerContact.phone || "-")}</div>
          <div class="cell-note">${escapeHtml(managerContact.email || "-")}</div>
        </td>
        <td>${plannedInterventionView ? escapeHtml(interventionDateLabel(store) || "-") : "&nbsp;"}</td>
        <td><span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span></td>
        <td>${renderStoreValidationSignals(store, { showAll: plannedInterventionView })}</td>
        <td>
          <div class="store-row-actions">
            <button type="button" class="mini-button" data-store-toggle="${store.id}">${isExpanded ? "Fermer fiche" : "Voir fiche"}</button>
            <button type="button" class="mini-button" data-store-print="${store.id}">Imprimer</button>
          </div>
        </td>
      `;
    } else {
      row.innerHTML = `
        <td>${escapeHtml(store.code)}</td>
        <td><strong>${escapeHtml(store.name)}</strong></td>
        <td>${escapeHtml(store.city || "-")}</td>
        <td>${escapeHtml(store.shopType || "-")}</td>
        <td>
          <strong>${escapeHtml(managerContact.name || "-")}</strong>
          <div class="cell-note">${escapeHtml(managerContact.phone || "-")}</div>
          <div class="cell-note">${escapeHtml(managerContact.email || "-")}</div>
        </td>
        <td>${escapeHtml(interventionDateLabel(store) || "-")}</td>
        <td><span class="${badgeClass(store.status)}">${escapeHtml(statusLabel(store.status))}</span></td>
        <td>${renderStoreValidationSignals(store)}</td>
        <td>
          <div class="store-row-actions">
            <button type="button" class="mini-button" data-store-toggle="${store.id}">${isExpanded ? "Fermer fiche" : "Voir fiche"}</button>
            <button type="button" class="mini-button" data-store-print="${store.id}">Imprimer</button>
          </div>
        </td>
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

const MAIN_TABLE_HEADER_IDS = ["thDetail", "thStore", "thTwem", "thManager", "thPhone", "thElectrician", "thAppointment", "thStatus", "thIssue"];

function resetMainTableHeaderStructure() {
  const headerRow = document.querySelector(".project-table thead tr");
  if (!headerRow) return;
  if (MAIN_TABLE_HEADER_IDS.every((id) => document.getElementById(id))) return;
  headerRow.innerHTML = MAIN_TABLE_HEADER_IDS
    .map((id) => `<th id="${id}"></th>`)
    .join("");
}

function setMainTableHeaders(headers) {
  resetMainTableHeaderStructure();
  const ids = MAIN_TABLE_HEADER_IDS;
  ids.forEach((id, index) => {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = headers[index] || "";
    }
  });
}

function setInvoiceTableHeaders() {
  const headerRow = document.querySelector(".project-table thead tr");
  if (!headerRow) return;
  headerRow.innerHTML = `
    <th>N magasin</th>
    <th>Nom magasin</th>
    <th colspan="4">PO</th>
    <th>A facturer</th>
    <th>En remplacement</th>
    <th>Statut cde / livraison</th>
  `;
}

function storeQuickActions() {
  return '<div class="cell-stack"><span class="badge badge-done">Voir</span><span class="badge badge-planned">Relancer</span><span class="badge badge-progress">Valider</span></div>';
}

function nextActionForStore(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (store.status === "blocked") return "Deblocage projet";
  if (!isNetworkConfigurationOk(store)) return "Validation manager config";
  if (!isVlan22Ok(workflow)) return "Validation VLAN22";
  if (workflow.destinyInstallDone !== "Oui") return "Installation Destiny";
  return workflow.ltSwitchStatus === "Basculee" ? "RUN / SAV" : "Bascule plateforme";
}

function currentWorkflowStage(store) {
  const workflow = ensureStoreWorkflowData(store);
  if (store.status === "blocked") return "Blocage chantier";
  if (!isNetworkConfigurationOk(store)) return "Collecte infos";
  if (!isVlan22Ok(workflow)) return "Validation VLAN22";
  if (externalPrepStatusLabel(workflow) !== "Termine") return "Pre-visite";
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
  const sortedStores = [...stores].sort((left, right) => {
    const leftWorkflow = ensureStoreWorkflowData(left);
    const rightWorkflow = ensureStoreWorkflowData(right);
    const leftDate = normalizeDateOnly(leftWorkflow.destinyInstallDate);
    const rightDate = normalizeDateOnly(rightWorkflow.destinyInstallDate);
    if (!leftDate && !rightDate) {
      return String(left.code || "").localeCompare(String(right.code || ""), "fr", { numeric: true });
    }
    if (!leftDate) return 1;
    if (!rightDate) return -1;
    return new Date(leftDate) - new Date(rightDate)
      || String(left.code || "").localeCompare(String(right.code || ""), "fr", { numeric: true });
  });
  const rows = sortedStores.map((store) => {
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
        date: workflow.vlan22Date || workflow.itValidationDate || "",
        label: "IT",
        status: isVlan22Ok(workflow) ? "done" : (store.status === "blocked" ? "blocked" : "in_progress"),
        note: "Validation reseau / VLAN"
      },
      {
        date: workflow.previsitDate || "A confirmer",
        label: "Pre-visite",
        status: externalPrepStatusLabel(workflow) === "Termine" ? "done" : "planned",
        note: externalPrepStatusLabel(workflow)
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
  setMainTableHeaders([]);
  projectTableBody.innerHTML = "";
}

function googleDrivePreviewUrl(url = "") {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }
  const fileMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  const idParamMatch = value.match(/[?&]id=([^&]+)/i);
  const fileId = fileMatch?.[1] || idParamMatch?.[1] || "";
  if (fileId) {
    return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
  }
  return value;
}

function normalizedTutorialVideos(videos = []) {
  const byKey = new Map((videos || []).map((video) => [String(video?.key || ""), video]));
  return defaultTutorialVideos.map((base) => {
    const saved = byKey.get(base.key) || {};
    const url = normalizeImportCell(saved.url || saved.videoUrl || "");
    return {
      ...base,
      url,
      embedUrl: googleDrivePreviewUrl(url)
    };
  });
}

function normalizedTechnicalSheets(sheets = []) {
  const seen = new Set();
  return (Array.isArray(sheets) ? sheets : [])
    .map((sheet, index) => ({
      id: String(sheet?.id || `sheet-${Date.now()}-${index}`),
      title: normalizeImportCell(sheet?.title || ""),
      tag: normalizeImportCell(sheet?.tag || ""),
      summary: normalizeImportCell(sheet?.summary || ""),
      body: String(sheet?.body || sheet?.content || "").trim(),
      note: String(sheet?.note || "").trim(),
      updatedAt: sheet?.updatedAt || new Date().toISOString()
    }))
    .filter((sheet) => {
      if ((!sheet.title && !sheet.body) || seen.has(sheet.id)) {
        return false;
      }
      seen.add(sheet.id);
      return true;
    })
    .sort((left, right) =>
      normalizeImportCell(left.title || "").localeCompare(
        normalizeImportCell(right.title || ""),
        "fr",
        { sensitivity: "base" }
      )
    );
}

function technicalSheetDocumentId(sheetOrId) {
  const rawId = typeof sheetOrId === "object" ? sheetOrId?.id : sheetOrId;
  return safeDocumentId("technical-sheet", rawId || Date.now());
}

function renderTutorialVideoMedia(video) {
  if (!video.embedUrl) {
    return `
      <div class="tuto-video-placeholder">
        <span>Video a ajouter</span>
      </div>
    `;
  }
  return `
    <iframe
      class="tuto-video-frame"
      src="${escapeHtml(video.embedUrl)}"
      title="${escapeHtml(video.title)}"
      allow="autoplay; encrypted-media; fullscreen"
      allowfullscreen
      loading="lazy"></iframe>
  `;
}

async function handleTutorialVideoSubmit(event) {
  event.preventDefault();
  if (!isAdminTwem()) {
    return;
  }
  const form = event.currentTarget;
  const key = form.getAttribute("data-tutorial-key");
  const url = form.querySelector('[name="tutorial_url"]')?.value.trim() || "";
  state.tutorialVideos = normalizedTutorialVideos(state.tutorialVideos).map((video) =>
    video.key === key ? { ...video, url, embedUrl: googleDrivePreviewUrl(url) } : video
  );
  saveState();
  renderTutorialRows();
  if (hasRemoteData()) {
    try {
      await syncSettingsToRemote();
    } catch (error) {
      console.error("Impossible de synchroniser la video tuto.", error);
      window.alert("Lien video sauvegarde localement, mais la synchronisation distante a echoue.");
    }
  }
}

async function syncTechnicalSheetsAfterEdit(options = {}) {
  state.technicalSheets = normalizedTechnicalSheets(state.technicalSheets || []);
  saveState();
  renderTutorialRows();
  if (hasRemoteData()) {
    try {
      if (options.deletedId) {
        await deleteTechnicalSheetFromRemote(options.deletedId);
      }
      if (options.sheet) {
        await syncTechnicalSheetToRemote(options.sheet);
      }
    } catch (error) {
      console.error("Impossible de synchroniser les fiches techniques.", error);
      window.alert("Fiche sauvegardee localement, mais la synchronisation distante a echoue.");
    }
  }
}

async function handleTechnicalSheetSubmit(event) {
  event.preventDefault();
  if (!isAdminTwem()) {
    return;
  }
  const form = event.currentTarget;
  const editId = form.getAttribute("data-technical-sheet-edit") || "";
  const nextSheet = {
    id: editId || `sheet-${Date.now()}`,
    title: form.querySelector('[name="technical_title"]')?.value.trim() || "",
    tag: form.querySelector('[name="technical_tag"]')?.value.trim() || "",
    summary: form.querySelector('[name="technical_summary"]')?.value.trim() || "",
    body: form.querySelector('[name="technical_body"]')?.value.trim() || "",
    note: form.querySelector('[name="technical_note"]')?.value.trim() || "",
    updatedAt: new Date().toISOString()
  };
  if (!nextSheet.title || !nextSheet.body) {
    window.alert("Indique au minimum un titre et le texte de la fiche.");
    return;
  }
  const sheets = normalizedTechnicalSheets(state.technicalSheets || []);
  state.technicalSheets = editId
    ? sheets.map((sheet) => (sheet.id === editId ? nextSheet : sheet))
    : [nextSheet, ...sheets];
  state.technicalSheetEditId = "";
  await syncTechnicalSheetsAfterEdit({ sheet: nextSheet });
}

function handleTechnicalSheetEdit(event) {
  state.technicalSheetEditId = event.currentTarget.getAttribute("data-technical-edit") || "";
  renderTutorialRows();
}

async function handleTechnicalSheetDelete(event) {
  const id = event.currentTarget.getAttribute("data-technical-delete") || "";
  if (!id || !window.confirm("Supprimer cette fiche technique ?")) {
    return;
  }
  state.technicalSheets = normalizedTechnicalSheets(state.technicalSheets || []).filter((sheet) => sheet.id !== id);
  if (state.technicalSheetEditId === id) {
    state.technicalSheetEditId = "";
  }
  await syncTechnicalSheetsAfterEdit({ deletedId: id });
}

function handleTechnicalSheetCancel() {
  state.technicalSheetEditId = "";
  renderTutorialRows();
}

function renderTechnicalSheets() {
  const sheets = normalizedTechnicalSheets(state.technicalSheets || []);
  const canEditSheets = isAdminTwem();
  const editedSheet = sheets.find((sheet) => sheet.id === state.technicalSheetEditId) || null;
  return `
    <div class="tuto-intro">
      <h3>Fiches techniques</h3>
      <p>Guides courts crees selon les besoins terrain.</p>
    </div>
    ${canEditSheets ? `
      <form class="technical-sheet-form" data-technical-sheet-edit="${escapeHtml(editedSheet?.id || "")}">
        <label>
          <span>Titre</span>
          <input type="text" name="technical_title" value="${escapeHtml(editedSheet?.title || "")}" placeholder="Ex: Faire un transfert d'appel">
        </label>
        <label>
          <span>Theme</span>
          <input type="text" name="technical_tag" value="${escapeHtml(editedSheet?.tag || "")}" placeholder="Ex: Telephone fixe, Call button, SAV">
        </label>
        <label class="technical-sheet-wide">
          <span>Resume court</span>
          <input type="text" name="technical_summary" value="${escapeHtml(editedSheet?.summary || "")}" placeholder="Une phrase pour expliquer a quoi sert la fiche">
        </label>
        <label class="technical-sheet-wide">
          <span>Texte de la fiche</span>
          <textarea name="technical_body" rows="6" placeholder="Ecris ici les etapes, consignes, cas particuliers...">${escapeHtml(editedSheet?.body || "")}</textarea>
        </label>
        <label class="technical-sheet-wide">
          <span>Point d'attention</span>
          <textarea name="technical_note" rows="3" placeholder="Optionnel: attention, exception, info importante">${escapeHtml(editedSheet?.note || "")}</textarea>
        </label>
        <div class="technical-sheet-actions">
          ${editedSheet ? `<button type="button" class="mini-button" data-technical-cancel>Annuler</button>` : ""}
          <button type="submit" class="mini-button">${editedSheet ? "Enregistrer la fiche" : "Creer la fiche"}</button>
        </div>
      </form>
    ` : ""}
    ${sheets.length ? `
    <div class="technical-sheet-grid">
      ${sheets.map((sheet) => `
        <details class="technical-sheet-card">
          <summary>
            <span>
              <strong>${escapeHtml(sheet.title)}</strong>
              <small>${escapeHtml(sheet.summary)}</small>
            </span>
            ${sheet.tag ? `<em>${escapeHtml(sheet.tag)}</em>` : ""}
          </summary>
          <div class="technical-sheet-body">${escapeHtml(sheet.body).replace(/\n/g, "<br>")}</div>
          ${sheet.note ? `<p class="technical-sheet-note">${escapeHtml(sheet.note).replace(/\n/g, "<br>")}</p>` : ""}
          ${canEditSheets ? `
            <div class="technical-sheet-card-actions">
              <button type="button" class="mini-button" data-technical-edit="${escapeHtml(sheet.id)}">Modifier</button>
              <button type="button" class="mini-button" data-technical-delete="${escapeHtml(sheet.id)}">Supprimer</button>
            </div>
          ` : ""}
        </details>
      `).join("")}
    </div>
    ` : '<div class="empty-state">Aucune fiche technique pour le moment.</div>'}
  `;
}

function renderTutorialRows() {
  setMainTableHeaders([]);
  const videos = normalizedTutorialVideos(state.tutorialVideos);
  const canEditVideos = isAdminTwem();
  projectTableBody.innerHTML = `
    <tr>
      <td colspan="9" class="tuto-cell">
        <section class="tuto-shell">
          <div class="tuto-helpdesk">
            <strong>Helpdesk 999</strong>
            <span>Probleme de telephonie : envoyer un mail a <a href="mailto:emir.massart@brico.be">emir.massart@brico.be</a></span>
            <span>Probleme d'app : envoyer un mail a <a href="mailto:backoffice@twem.be">backoffice@twem.be</a></span>
          </div>
          <div class="tuto-intro">
            <h3>Tutoriels d'utilisation</h3>
            <p>Les videos seront ajoutees par theme pour pouvoir remplacer uniquement la partie concernee si un point change.</p>
          </div>
          <div class="tuto-grid">
            ${videos.map((video) => `
              <article class="tuto-video-card">
                ${renderTutorialVideoMedia(video)}
                <div>
                  <h4>${escapeHtml(video.title)}</h4>
                  <p>${escapeHtml(video.description)}</p>
                  ${video.url ? `<a class="tuto-video-link" href="${escapeHtml(video.url)}" target="_blank" rel="noreferrer">Ouvrir la video</a>` : ""}
                  ${canEditVideos ? `
                    <form class="tuto-video-form" data-tutorial-key="${escapeHtml(video.key)}">
                      <input type="url" name="tutorial_url" value="${escapeHtml(video.url || "")}" placeholder="Coller le lien Google Drive">
                      <button type="submit" class="mini-button">Enregistrer</button>
                    </form>
                  ` : ""}
                </div>
              </article>
            `).join("")}
          </div>
          ${renderTechnicalSheets()}
        </section>
      </td>
    </tr>
  `;
  projectTableBody.querySelectorAll(".tuto-video-form").forEach((form) => {
    form.addEventListener("submit", handleTutorialVideoSubmit);
  });
  projectTableBody.querySelector(".technical-sheet-form")?.addEventListener("submit", handleTechnicalSheetSubmit);
  projectTableBody.querySelector("[data-technical-cancel]")?.addEventListener("click", handleTechnicalSheetCancel);
  projectTableBody.querySelectorAll("[data-technical-edit]").forEach((button) => {
    button.addEventListener("click", handleTechnicalSheetEdit);
  });
  projectTableBody.querySelectorAll("[data-technical-delete]").forEach((button) => {
    button.addEventListener("click", handleTechnicalSheetDelete);
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
    const goNoGo = isVlan22Ok(workflow) && externalPrepStatusLabel(workflow) === "Termine" && store.status !== "blocked";
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

function hasMissingInvoicePo(store) {
  return ![store.poLicences, store.poHpDesk, store.poPm, store.poRentingHw]
    .every((value) => normalizeImportCell(value));
}

function invoicePoLine(title, value) {
  const normalized = normalizeImportCell(value);
  return `
    <div class="invoice-po-line">
      <span>${escapeHtml(title)}</span>
      <strong>${escapeHtml(normalized || "A renseigner")}</strong>
    </div>
  `;
}

function invoicePoBlock(store) {
  return `
    <div class="invoice-po-stack">
      ${invoicePoLine("PO Licences", store.poLicences)}
      ${invoicePoLine("PO HP Desk", store.poHpDesk)}
      ${invoicePoLine("PO PM", store.poPm)}
      ${invoicePoLine("PO renting HW", store.poRentingHw)}
    </div>
  `;
}

function invoiceTicketType(ticket) {
  const billingType = normalizeImportCell(ticket.billingType || ticket.invoiceType).toLowerCase();
  const requestKind = normalizeImportCell(ticket.requestKind).toLowerCase();
  const concern = normalizeImportCell(ticket.concern).toLowerCase();
  if (billingType.includes("remplac") || billingType.includes("remplacement") || requestKind.includes("casse") || concern.includes("remplacement")) {
    return "replacement";
  }
  if (billingType.includes("factur") || billingType.includes("supplementaire") || requestKind.includes("supplementaire") || concern.includes("factur")) {
    return "billable";
  }
  return "";
}

function invoiceTicketsForStore(store, type = "") {
  return ticketsForStore(store.id)
    .filter((ticket) => normalizeImportCell(ticket.requestKind).toLowerCase().includes("commande")
      || normalizeImportCell(ticket.billingType || ticket.invoiceType))
    .filter((ticket) => !type || invoiceTicketType(ticket) === type);
}

function matchesInvoiceScope(store) {
  const scope = state.filters.invoice || "all";
  if (scope === "all") {
    return true;
  }
  if (scope === "missing_po") {
    return hasMissingInvoicePo(store);
  }
  if (scope === "billable" || scope === "replacement") {
    return invoiceTicketsForStore(store, scope).length > 0;
  }
  if (scope === "with_orders") {
    return invoiceTicketsForStore(store).length > 0;
  }
  return true;
}

function invoiceTicketTime(ticket) {
  return Date.parse(ticket.createdAt || ticket.orderApprovedAt || ticket.approvedAt || ticket.deliveryDate || "") || Number.MAX_SAFE_INTEGER;
}

function oldestInvoiceTicketTime(store, type = "") {
  const times = invoiceTicketsForStore(store, type).map(invoiceTicketTime);
  return times.length ? Math.min(...times) : Number.MAX_SAFE_INTEGER;
}

function invoiceOrderReference(ticket) {
  return normalizeImportCell(ticket.orderNumber || ticket.commandNumber || ticket.orderRef || ticket.purchaseOrderNumber || "");
}

function invoiceOrderStatus(ticket) {
  return normalizeImportCell(ticket.invoiceOrderStatus || ticket.orderWorkflowStatus || ticketStatusLabel(ticket.status) || "En cours");
}

function invoiceOrderApprovedValue(ticket) {
  const raw = normalizeImportCell(ticket.orderApproved || ticket.commandApproved || ticket.invoiceApproved || "");
  if (/^(oui|yes|true|1)$/i.test(raw)) {
    return "Oui";
  }
  if (/^(non|no|false|0)$/i.test(raw)) {
    return "Non";
  }
  return raw || "Non";
}

function invoiceOrderDeliveredDate(ticket) {
  return normalizeImportCell(ticket.deliveredAt || ticket.deliveryDate || ticket.orderDeliveredAt || "");
}

function invoiceTicketLabel(ticket) {
  const material = normalizeImportCell(ticket.materialLabel) || normalizeImportCell(ticket.concern) || "Commande";
  const quantity = normalizeImportCell(ticket.quantityRequested) || "1";
  return `${material} x${quantity}`;
}

function invoiceBillingTypeValue(ticket, fallbackType = "") {
  const raw = normalizeImportCell(ticket.billingType || ticket.invoiceType);
  if (raw) {
    return raw;
  }
  if (fallbackType === "replacement" || invoiceTicketType(ticket) === "replacement") {
    return "A remplacer";
  }
  if (normalizeImportCell(ticket.requestKind).toLowerCase().includes("supplementaire")) {
    return "Supplementaire";
  }
  return "A facturer";
}

function renderInvoiceTicketList(tickets, emptyLabel, fallbackType = "") {
  if (!tickets.length) {
    return `<span class="cell-note">${escapeHtml(emptyLabel)}</span>`;
  }
  return `
    <div class="invoice-order-list">
      ${tickets.map((ticket) => `
        <div class="invoice-order-item invoice-order-edit" data-invoice-ticket="${escapeHtml(ticket.id)}">
          <label>
            <span>Detail</span>
            <input type="text" data-invoice-field="materialLabel" value="${escapeHtml(normalizeImportCell(ticket.materialLabel) || normalizeImportCell(ticket.concern) || "")}" placeholder="Detail commande">
          </label>
          <label>
            <span>Quantite</span>
            <input type="number" min="1" step="1" data-invoice-field="quantityRequested" value="${escapeHtml(String(ticket.quantityRequested || "1"))}">
          </label>
          <label>
            <span>Statut</span>
            <select data-invoice-field="billingType">
              ${renderOptions(["A facturer", "A remplacer", "Supplementaire"], invoiceBillingTypeValue(ticket, fallbackType))}
            </select>
          </label>
        </div>
      `).join("")}
    </div>
  `;
}

function renderInvoiceStatusList(tickets) {
  if (!tickets.length) {
    return '<span class="cell-note">Aucune commande liee</span>';
  }
  return `
    <div class="invoice-order-list">
      ${tickets.map((ticket) => `
        <div class="invoice-order-item invoice-order-edit" data-invoice-ticket="${escapeHtml(ticket.id)}">
          <strong>${escapeHtml(invoiceTicketLabel(ticket))}</strong>
          <label>
            <span>Statut cde</span>
            <select data-invoice-field="invoiceOrderStatus">
              ${renderOptions(["En cours", "Attente accord"], invoiceOrderStatus(ticket))}
            </select>
          </label>
          <label>
            <span>Cde approuvee</span>
            <select data-invoice-field="orderApproved">
              ${renderOptions(["Non", "Oui"], invoiceOrderApprovedValue(ticket))}
            </select>
          </label>
          <label>
            <span>N commande</span>
            <input type="text" data-invoice-field="orderNumber" value="${escapeHtml(invoiceOrderReference(ticket))}" placeholder="N commande">
          </label>
          <label>
            <span>Livre</span>
            <input type="date" data-invoice-field="deliveredAt" value="${escapeHtml(invoiceOrderDeliveredDate(ticket))}">
          </label>
        </div>
      `).join("")}
    </div>
  `;
}

function renderInvoiceRows(stores) {
  setInvoiceTableHeaders();
  const sortScope = ["billable", "replacement"].includes(state.filters.invoice) ? state.filters.invoice : "";
  const sortedStores = [...stores].sort((left, right) => {
    const leftTime = oldestInvoiceTicketTime(left, sortScope);
    const rightTime = oldestInvoiceTicketTime(right, sortScope);
    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    return String(left.code || left.name || "").localeCompare(String(right.code || right.name || ""), "fr", { numeric: true });
  });
  projectTableBody.innerHTML = sortedStores.map((store) => {
    const billableTickets = invoiceTicketsForStore(store, "billable");
    const replacementTickets = invoiceTicketsForStore(store, "replacement");
    const allInvoiceTickets = [...billableTickets, ...replacementTickets];
    return `
      <tr>
        <td><strong>${escapeHtml(store.shopNumber || store.code || "-")}</strong><div class="cell-note">${escapeHtml(store.code || "")}</div></td>
        <td><strong>${escapeHtml(store.name || "-")}</strong><div class="cell-note">${escapeHtml([store.city, store.shopType].filter(Boolean).join(" - ") || "-")}</div></td>
        <td colspan="4">${invoicePoBlock(store)}</td>
        <td>${renderInvoiceTicketList(billableTickets, "Aucune commande a facturer", "billable")}</td>
        <td>${renderInvoiceTicketList(replacementTickets, "Aucun remplacement", "replacement")}</td>
        <td>${renderInvoiceStatusList(allInvoiceTickets)}</td>
      </tr>
    `;
  }).join("");
  attachInvoiceHandlers();
}

function renderSavRows() {
  setMainTableHeaders(["Code", "Magasin", "Ticket", "Demandeur", "Personnes", "Ouverture", "Etat", "Dernier suivi", "Action"]);
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
        <td>${escapeHtml(ticketTargetLabel(ticket))}</td>
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
    const haystack = [
      row.category,
      row.model,
      row.number,
      row.label,
      row.labelFr,
      row.labelNl,
      row.labelEn,
      row.language,
      row.item,
      row.activation,
      row.oldNumber,
      row.usage
    ].join(" ");
    return matchesSearchTokens(haystack, search);
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
                    <td>${escapeHtml(extensionDisplayCategoryLabel(row) || "-")}</td>
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
  { value: "new", label: "Nouveau TWEM" },
  { value: "dispatch", label: "A dispatcher" },
  { value: "assigned", label: "Assigne" },
  { value: "open", label: "Ouvert" },
  { value: "in_progress", label: "En cours" },
  { value: "waiting", label: "En attente" },
  { value: "resolved", label: "Resolu" },
  { value: "closed", label: "Cloture" }
];

function ticketStatusLabel(status, language = state.language) {
  const isNl = normalizeLanguageCode(language) === "nl";
  const labels = isNl
    ? {
        new: "Nieuw TWEM",
        dispatch: "Te dispatchen",
        assigned: "Toegewezen",
        open: "Open",
        in_progress: "Bezig",
        waiting: "In afwachting",
        resolved: "Opgelost",
        closed: "Afgesloten"
      }
    : {
        new: "Nouveau TWEM",
        dispatch: "A dispatcher",
        assigned: "Assigne",
        open: "Ouvert",
        in_progress: "En cours",
        waiting: "En attente",
        resolved: "Resolu",
        closed: "Cloture"
      };
  return labels[status] || status;
}

function ticketBadgeClass(status) {
  const map = {
    new: "badge badge-planned",
    dispatch: "badge badge-planned",
    assigned: "badge badge-progress",
    open: "badge badge-planned",
    in_progress: "badge badge-progress",
    waiting: "badge badge-warning",
    resolved: "badge badge-done",
    closed: "badge badge-done"
  };
  return map[status] || "badge badge-planned";
}

function ticketsForStore(storeId) {
  return (state.tickets || [])
    .filter(Boolean)
    .filter((ticket) => String(ticket.storeId) === String(storeId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function handleAddExtensionSubmit(event) {
  event.preventDefault();
  if (!isSupAdmin()) {
    return;
  }
  const form = event.currentTarget;
  const category = normalizeImportCell(form.querySelector('[name="category"]')?.value);
  const model = normalizeImportCell(form.querySelector('[name="model"]')?.value);
  const number = normalizeImportCell(form.querySelector('[name="number"]')?.value);
  const labelFr = normalizeImportCell(form.querySelector('[name="label_fr"]')?.value);
  const labelNl = normalizeImportCell(form.querySelector('[name="label_nl"]')?.value);
  const labelEn = normalizeImportCell(form.querySelector('[name="label_en"]')?.value);
  const item = normalizeImportCell(form.querySelector('[name="item"]')?.value);
  if (!category || !number) {
    window.alert("La categorie et le numero sont obligatoires.");
    return;
  }
  extensionCatalogRows.push({
    category,
    model,
    number,
    label: labelFr || labelNl || labelEn,
    labelFr,
    labelNl,
    labelEn,
    oldNumber: "",
    language: "",
    item,
    activation: "",
    usage: ""
  });
  saveState();
  render();
  if (hasRemoteData()) {
    try {
      await syncSettingsToRemote();
    } catch (error) {
      console.error("Impossible de synchroniser l extension ajoutee.", error);
      window.alert("Extension ajoutee localement, mais la synchronisation distante a echoue.");
    }
  }
}

function renderExtensionsRowsV2(stores) {
  setMainTableHeaders(["Numero", "Libelle FR", "Libelle NL", "Libelle EN", "Item"]);
  const filteredExtensions = extensionCatalogRows.filter((row) => {
    const search = state.filters.search;
    if (!search) {
      return true;
    }
    const haystack = [
      row.category,
      row.model,
      row.number,
      row.label,
      row.labelFr,
      row.labelNl,
      row.labelEn,
      row.language,
      row.item,
      row.activation,
      row.oldNumber,
      row.usage
    ].join(" ");
    return matchesSearchTokens(haystack, search);
  });

  if (!filteredExtensions.length) {
    projectTableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Aucune extension ne correspond a la recherche.</td></tr>';
    return;
  }

  const groupedExtensions = [
    ["Boutons d appel", filteredExtensions.filter((row) => extensionDisplayCategoryKey(row) === "call")],
    ["Panic Button", filteredExtensions.filter((row) => ["panic", "other"].includes(extensionDisplayCategoryKey(row)))],
    ["Flash light", filteredExtensions.filter((row) => extensionDisplayCategoryKey(row) === "flash")],
    ["Fix", filteredExtensions.filter((row) => extensionDisplayCategoryKey(row) === "fixed").sort((a, b) => getExtensionPreferredLabel(a, "fr").localeCompare(getExtensionPreferredLabel(b, "fr"), "fr", { sensitivity: "base" }) || normalizeImportCell(a.number).localeCompare(normalizeImportCell(b.number), "fr", { numeric: true, sensitivity: "base" }))],
    ["Mobile", filteredExtensions.filter((row) => extensionDisplayCategoryKey(row) === "mobile").sort((a, b) => getExtensionPreferredLabel(a, "fr").localeCompare(getExtensionPreferredLabel(b, "fr"), "fr", { sensitivity: "base" }) || normalizeImportCell(a.number).localeCompare(normalizeImportCell(b.number), "fr", { numeric: true, sensitivity: "base" }))],
    [groupedCallExtensionCategoryLabel, filteredExtensions.filter((row) => extensionDisplayCategoryKey(row) === "grouped-call").sort((a, b) => normalizeImportCell(a.number).localeCompare(normalizeImportCell(b.number), "fr", { numeric: true, sensitivity: "base" }))]
  ].filter(([, rows]) => rows.length);

  projectTableBody.innerHTML = `
    <tr>
      <td colspan="5">
        <article class="extensions-store">
          <div class="extensions-store-head">
            <div>
              <h3>Reference complete des extensions disponibles</h3>
              <span class="cell-note">${filteredExtensions.length} ligne(s) du tableau ConfigVoIPExt</span>
            </div>
            ${isSupAdmin() ? `
              <form class="extensions-add-form" id="extensionsAddForm">
                <select name="category">
                  <option value="Bouton Appel">Bouton d appel</option>
                  <option value="Bouton Panique">Bouton panique</option>
                  <option value="Flash light">Flash light</option>
                  <option value="Fixed">Fix</option>
                  <option value="Mobile">Mobile</option>
                </select>
                <input type="text" name="model" placeholder="Modele">
                <input type="text" name="number" placeholder="Numero">
                <input type="text" name="label_fr" placeholder="Libelle FR">
                <input type="text" name="label_nl" placeholder="Libelle NL">
                <input type="text" name="label_en" placeholder="Libelle EN">
                <input type="text" name="item" placeholder="Item">
                <button type="submit" class="mini-button">Ajouter extension</button>
              </form>
            ` : ""}
          </div>
          <div class="extensions-store-body">
            ${groupedExtensions.map(([title, rows]) => `
              <section class="extensions-section">
                <div class="extensions-section-head">
                  <h4>${escapeHtml(title)}</h4>
                  <span class="cell-note">${rows.length} ligne(s)</span>
                </div>
                <p class="cell-note extensions-model-note">Modeles possibles: ${escapeHtml([...new Set(rows.map((row) => normalizeImportCell(row.model)).filter(Boolean))].join(" / ") || "-")}</p>
                <table class="extensions-table">
                  <thead>
                    <tr>
                      <th>Numero</th>
                      <th>Libelle FR</th>
                      <th>Libelle NL</th>
                      <th>Libelle EN</th>
                      <th>Item</th>
                      <th>Ancien n°</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map((row) => `
                      <tr>
                        <td><strong>${escapeHtml(row.number || "-")}</strong></td>
                        <td>${escapeHtml(row.labelFr || row.label || "-")}</td>
                        <td>${escapeHtml(row.labelNl || row.label || "-")}</td>
                        <td>${escapeHtml(row.labelEn || row.label || "-")}</td>
                        <td>${escapeHtml(row.item || "-")}</td>
                        <td>${escapeHtml(row.oldNumber || "-")}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </section>
            `).join("")}
          </div>
        </article>
      </td>
    </tr>
  `;

  projectTableBody.querySelector("#extensionsAddForm")?.addEventListener("submit", handleAddExtensionSubmit);
}

function getFilteredTickets() {
  const visibleStoreIds = new Set(getFilteredStores().map((store) => String(store.id)));
  const search = state.filters.search;
  const user = currentUser();
  const userName = normalizeImportCell(user?.name || state.activeUserName).toLowerCase();
  const userRole = canonicalRoleKey(user?.role || "");
  return (state.tickets || [])
    .filter(Boolean)
    .filter((ticket) => visibleStoreIds.has(String(ticket.storeId)))
    .filter((ticket) => {
      if (canDispatchSav(user) || ["manager", "magasin", "direction_brico", "supmanager"].includes(userRole)) {
        return true;
      }
      return ticketTargetPeople(ticket).some((name) => normalizeImportCell(name).toLowerCase() === userName)
        || normalizeImportCell(ticket.requesterName).toLowerCase() === userName;
    })
    .filter((ticket) => {
      if (!search) {
        return true;
      }
      const haystack = [
        ticket.storeCode,
        ticket.storeName,
        ticket.requesterName,
        ticketTargetLabel(ticket),
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
  const extensionOptions = availableExtensionReferenceOptions("", store.language || "fr");
  return `
    <article class="editor-card full-span-card sav-ticket-card" data-access-zone="sav_ticket">
      <h3>Demande SAV / ticket</h3>
      <p>Les demandes arrivent d'abord chez TWEM. Emir ou Valou dispatchent ensuite vers la bonne personne avant intervention.</p>
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
              <span>Type de demande</span>
              <select name="new_ticket_kind">
                ${renderOptions(storeRequestTypeOptions, "SAV")}
              </select>
            </label>
            <div class="sav-twem-routing">
              <strong>Reception TWEM</strong>
              <span>La demande sera envoyee a Emir et Valou pour dispatch.</span>
            </div>
          </div>

          <div class="two-col">
            <label>
              <span>Ce que ca concerne</span>
              <input type="text" name="new_ticket_concern" placeholder="Ex: poste caisse, GSM, transfert, VLAN, accueil">
            </label>
            <label>
              <span>Materiel concerne / commande</span>
              <select name="new_ticket_material">
                <option value="">Choisir un materiel</option>
                ${storeMaterialOptions.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
          </div>

          <div class="three-col sav-request-grid">
            <label>
              <span>Extension liee</span>
              <select name="new_ticket_extension">
                <option value="">Choisir une extension</option>
                ${extensionOptions.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
            <label>
              <span>Quantite demandee</span>
              <input type="number" min="1" name="new_ticket_quantity" value="1">
            </label>
            <label>
              <span>Workflow materiel supplementaire</span>
              <select name="new_ticket_order_status">
                ${renderOptions(extraMaterialWorkflowOptions, "Demande creee")}
              </select>
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
  const selectedTargets = ticketTargetPeople(ticket);
  const isDispatcher = canDispatchSav();
  const currentName = normalizeImportCell(currentUser()?.name || state.activeUserName).toLowerCase();
  const canWorkOnTicket = isDispatcher
    || selectedTargets.some((name) => normalizeImportCell(name).toLowerCase() === currentName);
  const dispatchBlock = isDispatcher ? `
    <div class="sav-dispatch-box">
      <div class="sav-thread-label">Dispatch TWEM</div>
      <div class="sav-people-grid">
        ${renderSavDispatchCheckboxes(store, selectedTargets, `ticket_dispatch_people_${ticket.id}`)}
      </div>
      <label>
        <span>Message de transfert</span>
        <textarea name="ticket_dispatch_note_${ticket.id}" rows="3" placeholder="Explique ce qui est attendu avant de transferer le SAV."></textarea>
      </label>
      <button type="button" class="mini-button" data-sav-dispatch="${ticket.id}" data-sav-store="${store.id}">Transférer / assigner</button>
    </div>
  ` : "";
  const contextRows = [
    ticket.requestKind ? `<div><strong>Type</strong> ${escapeHtml(ticket.requestKind)}</div>` : "",
    `<div><strong>Assignation</strong> ${escapeHtml(ticketTargetLabel(ticket))}</div>`,
    ticket.materialLabel ? `<div><strong>Materiel</strong> ${escapeHtml(ticket.materialLabel)}</div>` : "",
    ticket.extensionLabel ? `<div><strong>Extension</strong> ${escapeHtml(ticket.extensionLabel)}</div>` : "",
    ticket.quantityRequested ? `<div><strong>Quantite</strong> ${escapeHtml(String(ticket.quantityRequested))}</div>` : "",
    ticket.orderWorkflowStatus ? `<div><strong>Workflow</strong> ${escapeHtml(ticket.orderWorkflowStatus)}</div>` : ""
  ].filter(Boolean).join("");
  return `
    <article class="sav-thread-card">
      <div class="sav-thread-head">
        <div>
          <strong>${escapeHtml(ticket.id)} - ${escapeHtml(ticket.concern || "Sans objet")}</strong>
          <div class="cell-note">Demande initiale par ${escapeHtml(ticket.requesterName || "-")} le ${escapeHtml(formatDateTime(ticket.createdAt))} - ${escapeHtml(ticketTargetLabel(ticket))}</div>
        </div>
        <span class="${ticketBadgeClass(ticket.status)}">${escapeHtml(ticketStatusLabel(ticket.status))}</span>
      </div>

      <div class="sav-thread-request">
        <div class="sav-thread-label">Demande initiale</div>
        ${contextRows ? `<div class="sav-thread-context">${contextRows}</div>` : ""}
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

      ${dispatchBlock}

      <div class="sav-thread-actions">
        ${canWorkOnTicket ? `
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
        ` : '<div class="empty-state sav-empty">En attente du dispatch TWEM avant intervention.</div>'}
      </div>
    </article>
  `;
}

function renderStores() {
  const stores = getFilteredStores();
  projectTableBody.innerHTML = "";
  const projectTable = document.querySelector(".project-table");
  projectTable?.classList.remove("compact-rows-table");
  projectTable?.classList.remove("store-list-table");
  projectTable?.classList.remove("dashboard-summary-only");
  projectTable?.classList.remove("tuto-table");

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
      renderExtensionsRowsV2(stores);
      return;
    case "invoice":
      projectTable?.classList.add("compact-rows-table");
      renderInvoiceRows(stores);
      return;
    case "tuto":
      projectTable?.classList.add("tuto-table");
      renderTutorialRows();
      return;
    case "dashboard":
      projectTable?.classList.add("dashboard-summary-only");
      renderDashboardRows(stores);
      return;
    case "configuration":
      projectTable?.classList.add("compact-rows-table");
      setMainTableHeaders(["Code", "Magasin", "Ville", "Type", "Responsable", "Intervention", "Statut", "Validations", "Actions"]);
      renderStoreOverviewRows(stores, "configuration");
      return;
      case "stores":
      default:
        projectTable?.classList.add("compact-rows-table");
        projectTable?.classList.add("store-list-table");
        setMainTableHeaders(isPlannedInterventionListView()
          ? ["Code", "Magasin", "Type / licence", "PO / PM", "Responsable / tel", "Intervention", "Statut", "Validations manquantes", "Actions"]
          : ["Code", "Magasin", "Type / licence", "PO / PM", "Responsable / tel", "", "Statut", "Prochaine action", "Actions"]);
        renderStoreOverviewRows(stores, "stores");
    }
  }

function renderActivities() {
  if (activityList) {
    activityList.innerHTML = "";
  }
  reportArchiveList.innerHTML = "";
  const storesByName = new Map(state.stores.map((store) => [normalizeImportCell(store.name).toLowerCase(), store]));
  const groupsByStore = new Map();
  visibleActivitiesForUser().forEach((activity) => {
    const store = storesByName.get(normalizeImportCell(activity.storeName).toLowerCase());
    const key = store?.code || normalizeImportCell(activity.storeName).toLowerCase();
    if (!groupsByStore.has(key)) {
      groupsByStore.set(key, {
        key,
        store,
        storeName: store?.name || activity.storeName || "Magasin",
        entries: []
      });
    }
    groupsByStore.get(key).entries.push(activity);
  });
  const groupedByStore = [...groupsByStore.values()]
    .map((group) => ({
      ...group,
      entries: group.entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }))
    .sort((a, b) => new Date(b.entries[0]?.createdAt || 0) - new Date(a.entries[0]?.createdAt || 0));

  if (!groupedByStore.length) {
    reportArchiveList.innerHTML = '<div class="empty-state">Aucun rapport magasin disponible pour le moment.</div>';
    return;
  }

  groupedByStore.forEach((group) => {
    const details = document.createElement("details");
    const latestEntry = group.entries[0];
    details.className = `report-store ${latestEntry?.alertQueuedAt || isSameLocalDay(new Date(latestEntry?.createdAt || 0), new Date()) ? "has-new-update" : ""}`;
    details.innerHTML = `
      <summary>
        <span class="report-store-title">${escapeHtml(group.store?.code ? `${group.store.code} - ${group.storeName}` : group.storeName)}</span>
        <span class="report-store-meta">${group.entries.length} remontee(s)</span>
        <span class="report-store-latest">${escapeHtml(formatDateTime(latestEntry?.createdAt || ""))}</span>
        <button type="button" class="mini-button report-export-button" data-report-export="${escapeHtml(group.key)}">Exporter PDF</button>
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
      const storeKey = button.getAttribute("data-report-export");
      const group = groupedByStore.find((entry) => entry.key === storeKey);
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

const automationEmailStatusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "ready", label: "A envoyer" },
  { value: "blocked", label: "Bloque premiere connexion" },
  { value: "sent", label: "Deja envoye" },
  { value: "error", label: "Erreur" }
];

function automationEmailStatusLabel(status) {
  return automationEmailStatusOptions.find((option) => option.value === status)?.label || status || "Brouillon";
}

function selectableAutomationEmailStatusOptions(email = {}) {
  return automationEmailStatusOptions.filter((option) => option.value !== "sent" || email.status === "sent");
}

function automationEmailStatusClass(status) {
  const normalized = status || "draft";
  if (normalized === "ready") return "automation-email-status status-ready";
  if (normalized === "sent") return "automation-email-status status-sent";
  if (normalized === "blocked") return "automation-email-status status-blocked";
  if (normalized === "error") return "automation-email-status status-error";
  return "automation-email-status status-draft";
}

function automationEmailStatusHelp(status) {
  const labels = {
    ready: "La fonction Appwrite peut envoyer ce mail au prochain passage.",
    sent: "Journal uniquement: ce statut indique que le mail est deja parti.",
    draft: "Brouillon: la fonction ne l'envoie pas.",
    blocked: "Bloque tant que la premiere connexion PIN n'est pas faite.",
    error: "Erreur d'envoi: repasser a A envoyer apres correction."
  };
  return labels[status] || "";
}

function personRecipientValue(person = {}) {
  return normalizeImportCell(person.email) || normalizeImportCell(person.name);
}

function launchMailEligiblePeople() {
  return (state.people || [])
    .filter((person) =>
      normalizeImportCell(person.email)
      && normalizePin(person.pin).length === 6
      && !["disabled", "expired"].includes(String(person.pinStatus || "").toLowerCase())
    );
}

function personMatchesStoreType(person, targetType) {
  const types = storesForPersonAccess(person).map((store) => normalizeShopTypeValue(store.shopType)).filter(Boolean);
  if (targetType === "FOS-FOSDOS") {
    return types.some((type) => type === "FOS" || type === "FOSDOS");
  }
  return types.includes(targetType);
}

function launchMailRecipientsFromForm(form) {
  if (!form) {
    return [];
  }
  const mode = form.querySelector('[name="launch_recipient_mode"]')?.value || "storeType";
  const storeType = form.querySelector('[name="launch_store_type"]')?.value || "DOS";
  const role = form.querySelector('[name="launch_role"]')?.value || "";
  const personId = form.querySelector('[name="launch_person"]')?.value || "";
  const seen = new Set();
  return launchMailEligiblePeople()
    .filter((person) => {
      if (mode === "storeType") {
        return personMatchesStoreType(person, storeType);
      }
      if (mode === "role") {
        return String(person.role || "") === role;
      }
      if (mode === "person") {
        return String(person.id || "") === personId;
      }
      return false;
    })
    .filter((person) => {
      const email = normalizeImportCell(person.email).toLowerCase();
      if (!email || seen.has(email)) {
        return false;
      }
      seen.add(email);
      return true;
    })
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "fr", { sensitivity: "base" }));
}

function digestBasePeople() {
  return ["Emir", "Valou"]
    .map((name) => (state.people || []).find((person) => person.name === name) || { id: name, name })
    .filter(Boolean);
}

function digestAdditionalPeople(automation = {}) {
  const ids = Array.isArray(automation.digestAdditionalRecipientIds) ? automation.digestAdditionalRecipientIds : [];
  return ids
    .map((id) => (state.people || []).find((person) =>
      String(person.id || "") === String(id)
      || String(person.email || "") === String(id)
      || String(person.name || "") === String(id)
    ))
    .filter(Boolean);
}

function digestRecipientPeople(automation = {}) {
  const seen = new Set();
  return [...digestBasePeople(), ...digestAdditionalPeople(automation)].filter((person) => {
    const key = personRecipientValue(person).toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function digestRecipientLabel(automation = {}) {
  const recipients = digestRecipientPeople(automation)
    .map((person) => personRecipientValue(person) || person.name)
    .filter(Boolean);
  return recipients.join(", ") || "Emir + Valou";
}

function digestRecipientSummaryHtml(automation = {}) {
  const people = digestRecipientPeople(automation);
  if (!people.length) {
    return '<span class="digest-recipient-chip">Emir + Valou</span>';
  }
  return people.map((person) => `
    <span class="digest-recipient-chip">
      <strong>${escapeHtml(person.name || "-")}</strong>
      ${person.email ? `<small>${escapeHtml(person.email)}</small>` : ""}
    </span>
  `).join("");
}

function renderDigestRecipientChoices(automation = {}) {
  const selectedIds = new Set(Array.isArray(automation.digestAdditionalRecipientIds) ? automation.digestAdditionalRecipientIds.map(String) : []);
  const baseNames = new Set(["emir", "valou"]);
  return (state.people || [])
    .filter((person) => normalizeImportCell(person.name) && !baseNames.has(normalizeImportCell(person.name).toLowerCase()))
    .sort((left, right) => normalizeImportCell(left.name).localeCompare(normalizeImportCell(right.name), "fr", { sensitivity: "base" }))
    .map((person) => {
      const id = String(person.id || person.email || person.name);
      const label = [person.name, person.email].filter(Boolean).join(" - ");
      return `
        <label class="digest-recipient-choice">
          <input type="checkbox" value="${escapeHtml(id)}" data-automation-id="${escapeHtml(automation.id)}" data-automation-field="digestAdditionalRecipientIds" ${selectedIds.has(id) ? "checked" : ""}>
          <span>${escapeHtml(label)}</span>
        </label>
      `;
    })
    .join("");
}

function nextMorningIso(hour = 9) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function emailDateLabel(value, language = "fr") {
  const date = normalizeDateOnly(value);
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(normalizeLanguageCode(language) === "nl" ? "nl-BE" : "fr-BE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function fillMailTemplate(template, values = {}) {
  return String(template || "").replace(/\[(responsable|contact|date intervention|date pre-visite|date prévisite|magasin|nom du magasin|code magasin|lien app|lien vers l'application|lien vers l’application|pin|modification|nouveaute|nouveauté)\]/gi, (match, key) => {
    const normalized = normalizeImportCell(key).toLowerCase();
    if (normalized === "responsable") return values.managerName || "";
    if (normalized === "contact") return values.contactName || "";
    if (normalized === "date intervention") return values.installDate || "";
    if (normalized === "date pre-visite" || normalized === "date prévisite") return values.previsitDate || "";
    if (normalized === "magasin" || normalized === "nom du magasin") return values.storeName || "";
    if (normalized === "code magasin") return values.storeCode || "";
    if (normalized === "lien app" || normalized === "lien vers l'application" || normalized === "lien vers l’application") return values.appLink || "";
    if (normalized === "pin") return values.pin || "";
    if (normalized === "modification" || normalized === "nouveaute" || normalized === "nouveauté") return values.updateText || "";
    return match;
  });
}

function hasMailTemplateVariables(template) {
  return /\[(responsable|contact|date intervention|date pre-visite|date prévisite|magasin|nom du magasin|code magasin|lien app|lien vers l'application|lien vers l’application|pin|modification|nouveaute|nouveauté)\]/i.test(String(template || ""));
}

function buildInstallReminderEmail(store, automation = {}) {
  const workflow = ensureStoreWorkflowData(store);
  const managerPerson = managerPersonForStore(store);
  const language = storeLanguageForPrint(store);
  const managerName = managerPerson?.name || store.manager || store.name || (language === "nl" ? "verantwoordelijke" : "responsable");
  const installDate = emailDateLabel(workflow.destinyInstallDate, language) || workflow.destinyInstallDate || "";
  const subject = language === "nl"
    ? `Herinnering installatie - ${store.name || store.code || "winkel"}`
    : `Rappel installation - ${store.name || store.code || "magasin"}`;
  const body = language === "nl"
    ? [
        `Hallo ${managerName},`,
        "",
        `Wij bevestigen de komst van ons team voor de installatie van uw nieuwe telefooncentrale op ${installDate}.`,
        "",
        "Alles is gepland zodat de interventie in de best mogelijke omstandigheden kan verlopen.",
        "U ontvangt ook toegang tot de opvolgingsapplicatie, waarmee u de voortgang van de verschillende stappen in realtime kunt volgen.",
        "",
        "Ons team blijft uiteraard tijdens de volledige interventie beschikbaar indien nodig.",
        "",
        "Alvast bedankt voor uw ontvangst en samenwerking.",
        "",
        "Met vriendelijke groeten,"
      ].join("\n")
    : [
        `Bonjour ${managerName},`,
        "",
        `Nous vous confirmons le passage de notre equipe pour l'installation de votre nouvelle centrale telephonique a la date du ${installDate}.`,
        "",
        "Tout est planifie afin que l'intervention se deroule dans les meilleures conditions possibles.",
        "Vous recevrez egalement l'acces a l'application de suivi, qui vous permettra de suivre l'avancement des differentes etapes en temps reel.",
        "",
        "Notre equipe reste bien entendu a votre disposition durant toute l'intervention si necessaire.",
        "",
        "Nous vous remercions d'avance pour votre accueil et votre collaboration.",
        "",
        "Bien a vous,"
      ].join("\n");
  const values = {
    managerName,
    installDate,
    storeName: store.name || "",
    storeCode: store.code || ""
  };

  return {
    subject: fillMailTemplate(automation.emailSubject || subject, values),
    body: automation.emailBodyManual && automation.emailBody && hasMailTemplateVariables(automation.emailBody)
      ? fillMailTemplate(automation.emailBody, values)
      : body,
    recipient: managerPerson?.email || "",
    language,
    status: managerPerson && !personHasFirstAppLogin(managerPerson) ? "blocked" : "",
    blockedReason: managerPerson && !personHasFirstAppLogin(managerPerson)
      ? firstLoginBlockLabel([managerPerson])
      : ""
  };
}

function previsitDateForStore(store, options = {}) {
  const workflow = ensureStoreWorkflowData(store);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidates = [
    workflow.previsitDate,
    workflow.vlan22Date,
    workflow.cablingDate,
    workflow.ltSwitchDate || workflow.transferDate
  ]
    .map((value) => ({
      raw: value,
      date: normalizeDateOnly(value)
    }))
    .filter((entry) =>
      entry.date instanceof Date
      && !Number.isNaN(entry.date.getTime())
      && (!options.futureOnly || entry.date >= today)
    );
  if (!candidates.length) {
    return "";
  }
  candidates.sort((left, right) => left.date - right.date);
  return candidates[0].raw;
}

function buildPrevisitReminderEmail(store, automation = {}) {
  const managerPerson = managerPersonForStore(store);
  const language = storeLanguageForPrint(store);
  const managerName = managerPerson?.name || store.manager || store.name || (language === "nl" ? "verantwoordelijke" : "responsable");
  const rawPrevisitDate = previsitDateForStore(store, { futureOnly: true }) || previsitDateForStore(store);
  const previsitDate = emailDateLabel(rawPrevisitDate, language) || rawPrevisitDate || "";
  const subject = language === "nl"
    ? `Aankondiging pre-visit - ${store.name || store.code || "winkel"}`
    : `Pre-visite planifiee - ${store.name || store.code || "magasin"}`;
  const body = language === "nl"
    ? [
        `Hallo ${managerName},`,
        "",
        `Wij bevestigen de komst van ons team op ${previsitDate} voor de pre-visit ter voorbereiding van de installatie van uw nieuwe telefooncentrale.`,
        "",
        "Tijdens deze passage controleren we de nodige voorbereidingspunten: VLAN, netwerk, bekabeling, switch en de elementen die nodig zijn voor een vlotte installatie.",
        "",
        "Deze controle helpt ons om de latere installatie in de best mogelijke omstandigheden te laten verlopen.",
        "",
        "Ons team blijft uiteraard beschikbaar als u intussen vragen heeft.",
        "",
        "Alvast bedankt voor uw ontvangst en samenwerking.",
        "",
        "Met vriendelijke groeten,"
      ].join("\n")
    : [
        `Bonjour ${managerName},`,
        "",
        `Nous vous confirmons le passage de notre equipe le ${previsitDate} pour effectuer la pre-visite en vue de l'installation de votre nouvelle centrale telephonique.`,
        "",
        "Lors de ce passage, nous verifierons les points de preparation necessaires: VLAN, reseau, cablage, switch et les elements utiles au bon deroulement de l'installation.",
        "",
        "Cette verification nous permettra de preparer l'intervention finale dans les meilleures conditions possibles.",
        "",
        "Notre equipe reste bien entendu a votre disposition si vous avez des questions d'ici la.",
        "",
        "Nous vous remercions d'avance pour votre accueil et votre collaboration.",
        "",
        "Bien a vous,"
      ].join("\n");
  const values = {
    managerName,
    previsitDate,
    storeName: store.name || "",
    storeCode: store.code || ""
  };

  return {
    subject: fillMailTemplate(automation.emailSubject || subject, values),
    body: automation.emailBodyManual && automation.emailBody && hasMailTemplateVariables(automation.emailBody)
      ? fillMailTemplate(automation.emailBody, values)
      : body,
    recipient: managerPerson?.email || "",
    language,
    status: managerPerson && !personHasFirstAppLogin(managerPerson) ? "blocked" : "",
    blockedReason: managerPerson && !personHasFirstAppLogin(managerPerson)
      ? firstLoginBlockLabel([managerPerson])
      : ""
  };
}

function appAccessLink() {
  return window.location.href.split("?")[0];
}

function appStoreUpdateLink(store, activity) {
  const params = new URLSearchParams();
  params.set("store", store?.code || store?.id || "");
  if (activity?.id) {
    params.set("focus", activity.id);
  }
  return `${appAccessLink()}?${params.toString()}`;
}

function storeForActivity(activity) {
  return (state.stores || []).find((store) =>
    (activity?.storeCode && store.code === activity.storeCode)
    || (activity?.storeId && store.id === activity.storeId)
    || (activity?.storeName && store.name === activity.storeName)
  ) || null;
}

function buildStoreUpdateAlertEmail(activity, automation = {}) {
  const store = storeForActivity(activity);
  const language = store ? storeLanguageForPrint(store) : "fr";
  const appLink = store ? appStoreUpdateLink(store, activity) : appAccessLink();
  const storeName = store?.name || activity?.storeName || "magasin";
  const updateText = activity?.comment || "Nouvelle information a consulter";
  const linkedPeople = store ? linkedPeopleForStore(store) : [];
  const connectedPeople = linkedPeople.filter(personHasFirstAppLogin);
  const recipients = connectedPeople.map((person) => person.email);
  const subject = language === "nl"
    ? `Nieuwe update - ${storeName}`
    : `Nouvelle mise a jour - ${storeName}`;
  const body = language === "nl"
    ? [
        "Hallo,",
        "",
        `Er is een nieuwe update / informatie toegevoegd in de applicatie voor winkel ${storeName}.`,
        "",
        `Waarover gaat het: ${updateText}`,
        "",
        "Klik op onderstaande link om rechtstreeks naar de wijziging te gaan en de nieuwe elementen van het dossier te bekijken:",
        "",
        appLink,
        "",
        "Wij blijven uiteraard beschikbaar voor elke vraag of bijkomende informatie.",
        "",
        "Met vriendelijke groeten,"
      ].join("\n")
    : [
        "Bonjour,",
        "",
        `Une nouvelle mise a jour / information a ete ajoutee dans l'application pour le magasin ${storeName}.`,
        "",
        `Ce qui est nouveau: ${updateText}`,
        "",
        "Veuillez cliquer sur le lien ci-dessous afin d'acceder directement a la modification et consulter les nouveaux elements du dossier :",
        "",
        appLink,
        "",
        "Nous restons bien entendu a votre disposition pour toute question ou information complementaire.",
        "",
        "Bien a vous,"
      ].join("\n");
  const values = {
    storeName,
    appLink,
    updateText
  };
  return {
    subject: fillMailTemplate(automation.emailSubject || subject, values),
    body: automation.emailBodyManual && automation.emailBody && hasMailTemplateVariables(automation.emailBody)
      ? fillMailTemplate(automation.emailBody, values)
      : body,
    recipient: recipients.join(", "),
    language,
    status: recipients.length ? "" : "blocked",
    blockedReason: recipients.length ? "" : firstLoginBlockLabel(linkedPeople) || "Aucun contact connecte une premiere fois"
  };
}

function storesForPersonAccess(person = {}) {
  const codes = Array.isArray(person.allowedStoreCodes) && person.allowedStoreCodes.length
    ? person.allowedStoreCodes
    : person.storeCode
      ? [person.storeCode]
      : [];
  if (!codes.length || codes.includes("*")) {
    return person.storeCode
      ? (state.stores || []).filter((store) => store.code === person.storeCode)
      : [];
  }
  return (state.stores || []).filter((store) => codes.includes(store.code));
}

function accessMailStoreTypeGroup(person = {}) {
  const types = storesForPersonAccess(person)
    .map((store) => normalizeShopTypeValue(store.shopType))
    .filter(Boolean);
  if (types.some((type) => type === "FOS" || type === "FOSDOS")) {
    return "FOS-FOSDOS";
  }
  if (types.some((type) => type === "DOS")) {
    return "DOS";
  }
  return "DOS";
}

function accessMailStoreLabel(person = {}) {
  const stores = storesForPersonAccess(person);
  if (!stores.length) {
    return "";
  }
  return stores
    .map((store) => [store.code, store.name].filter(Boolean).join(" - "))
    .join(", ");
}

function defaultAccessMailBody({ language, contactName, appLink, pin, storeLabel, storeTypeGroup }) {
  const isFos = storeTypeGroup === "FOS-FOSDOS";
  if (language === "nl") {
    return [
      `Hallo ${contactName},`,
      "",
      isFos
        ? "Uw toegang tot de TWEM Brico opvolgingsapplicatie voor uw FOS / FOSDOS-winkel is aangemaakt."
        : "Uw toegang tot de TWEM Brico opvolgingsapplicatie voor uw DOS-winkel is aangemaakt.",
      storeLabel ? `Betrokken winkel(s): ${storeLabel}` : null,
      "",
      `Link naar de applicatie: ${appLink}`,
      `Uw persoonlijke PIN-code: ${pin}`,
      "",
      isFos
        ? "Met deze toegang kunt u de voorbereiding, interventies, afspraken en opvolging voor het FOS / FOSDOS-traject raadplegen."
        : "Met deze toegang kunt u de informatie, afspraken en opvolging voor het DOS-traject raadplegen.",
      "",
      "Met vriendelijke groeten,"
    ].filter((line) => line !== null).join("\n");
  }
  return [
    `Bonjour ${contactName},`,
    "",
    isFos
      ? "Votre acces a l'application de suivi TWEM Brico pour votre magasin FOS / FOSDOS a ete cree."
      : "Votre acces a l'application de suivi TWEM Brico pour votre magasin DOS a ete cree.",
    storeLabel ? `Magasin(s) concerne(s): ${storeLabel}` : null,
    "",
    `Lien vers l'application: ${appLink}`,
    `Votre code PIN personnel: ${pin}`,
    "",
    isFos
      ? "Cet acces vous permet de consulter la preparation, les interventions, les rendez-vous et le suivi du parcours FOS / FOSDOS."
      : "Cet acces vous permet de consulter les informations, les rendez-vous et le suivi du parcours DOS.",
    "",
    "Bien a vous,"
  ].filter((line) => line !== null).join("\n");
}

function buildNewPersonWelcomeEmail(person, automation = {}) {
  const language = normalizeLanguageCode(person?.language || "fr");
  const contactName = person?.name || (language === "nl" ? "gebruiker" : "utilisateur");
  const appLink = appAccessLink();
  const pin = normalizePin(person?.pin) || "------";
  const storeTypeGroup = accessMailStoreTypeGroup(person);
  const storeLabel = accessMailStoreLabel(person);
  const subject = language === "nl"
    ? `Toegang TWEM Brico-app ${storeTypeGroup} + PIN-code`
    : `Acces application TWEM Brico ${storeTypeGroup} + code PIN`;
  const body = defaultAccessMailBody({ language, contactName, appLink, pin, storeLabel, storeTypeGroup });
  const values = {
    contactName,
    appLink,
    pin,
    storeName: storeLabel,
    storeCode: storeLabel,
    storeType: storeTypeGroup
  };

  return {
    subject: fillMailTemplate(automation.emailSubject || subject, values),
    body: automation.emailBodyManual && automation.emailBody && hasMailTemplateVariables(automation.emailBody)
      ? fillMailTemplate(automation.emailBody, values)
      : body,
    recipient: person?.email || "",
    language
  };
}

function automationEmailTemplate(automation, context = {}) {
  if (automation.id === "daily_operations_digest") {
    return {
      subject: "Digest quotidien - installations, blocages et SAV",
      body: buildDailyOperationsDigestBody(),
      recipient: digestRecipientLabel(automation)
    };
  }
  if (automation.id === "store_update_alert" && context.activity) {
    return buildStoreUpdateAlertEmail(context.activity, automation);
  }
  if (automation.id === "install_reminder" && context.store) {
    return buildInstallReminderEmail(context.store, automation);
  }
  if (automation.id === "previsit_reminder" && context.store) {
    return buildPrevisitReminderEmail(context.store, automation);
  }
  if (automation.id === "new_person_welcome" && context.person) {
    return buildNewPersonWelcomeEmail(context.person, automation);
  }

  const subjectById = {
    store_update_alert: "Nouvelle information magasin a consulter",
    new_person_welcome: "Acces application TWEM Brico + code PIN",
    install_reminder: "Rappel doux - installation planifiee",
    previsit_reminder: "Pre-visite planifiee",
    no_response_escalation: "Relance action attendue"
  };
  const bodyById = {
    store_update_alert: "Bonjour,\n\nUne nouvelle mise a jour / information a ete ajoutee dans l'application pour le magasin [Nom du magasin].\n\nCe qui est nouveau: [modification]\n\nVeuillez cliquer sur le lien ci-dessous afin d'acceder directement a la modification et consulter les nouveaux elements du dossier :\n\n[Lien app]\n\nNous restons bien entendu a votre disposition pour toute question ou information complementaire.\n\nBien a vous,",
    new_person_welcome: "Bonjour [contact],\n\nVotre acces a l'application de suivi TWEM Brico a ete cree.\n\nLien vers l'application: [lien app]\nVotre code PIN personnel: [pin]\n\nCet acces vous permet de consulter les informations disponibles pour votre magasin.\n\nBien a vous,",
    install_reminder: "Bonjour [responsable],\n\nNous vous confirmons le passage de notre equipe pour l'installation de votre nouvelle centrale telephonique a la date du [date intervention].\n\nTout est planifie afin que l'intervention se deroule dans les meilleures conditions possibles.\nVous recevrez egalement l'acces a l'application de suivi, qui vous permettra de suivre l'avancement des differentes etapes en temps reel.\n\nNotre equipe reste bien entendu a votre disposition durant toute l'intervention si necessaire.\n\nNous vous remercions d'avance pour votre accueil et votre collaboration.\n\nBien a vous,",
    previsit_reminder: "Bonjour [responsable],\n\nNous vous confirmons le passage de notre equipe le [date pre-visite] pour effectuer la pre-visite en vue de l'installation de votre nouvelle centrale telephonique.\n\nLors de ce passage, nous verifierons les points de preparation necessaires: VLAN, reseau, cablage, switch et les elements utiles au bon deroulement de l'installation.\n\nCette verification nous permettra de preparer l'intervention finale dans les meilleures conditions possibles.\n\nNotre equipe reste bien entendu a votre disposition si vous avez des questions d'ici la.\n\nNous vous remercions d'avance pour votre accueil et votre collaboration.\n\nBien a vous,",
    no_response_escalation: "Bonjour,\n\nUne action attendue n'a pas encore ete consultee ou traitee.\nMerci de verifier le lien vers la fiche magasin.\n\nSi la situation reste bloquee, Valou / TWEM sera prevenu."
  };
  return {
    subject: subjectById[automation.id] || automation.title || "Mail automatique TWEM Brico",
    body: bodyById[automation.id] || automation.notes || automation.description || ""
  };
}

function digestDateLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function lineList(items, emptyText) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${emptyText}`;
}

function storeDigestLabel(store) {
  return [store.code, store.name, store.city].filter(Boolean).join(" - ");
}

function getTomorrowInstallationsForDigest(targetDate) {
  const target = normalizeDateOnly(targetDate);
  return (state.stores || []).flatMap((store) => {
    const workflow = ensureStoreWorkflowData(store);
    const rows = [];
    const destinyDate = normalizeDateOnly(workflow.destinyInstallDate);
    if (destinyDate && target && isSameLocalDay(destinyDate, target)) {
      rows.push(`${storeDigestLabel(store)} | Destiny: ${workflow.destinyInstallDate}${workflow.destinyPmName ? ` | PM ${workflow.destinyPmName}` : ""}`);
    }
    (store.appointments || []).forEach((appointment) => {
      const appointmentDate = normalizeDateOnly(appointment.datetime);
      if (appointmentDate && target && isSameLocalDay(appointmentDate, target)) {
        rows.push(`${storeDigestLabel(store)} | RDV ${formatDateTime(appointment.datetime)} | ${appointment.status || "-"} | ${appointment.note || "-"}`);
      }
    });
    return [...new Set(rows)];
  });
}

function getBlockedStoresForDigest() {
  return (state.stores || [])
    .filter((store) => store.status === "blocked" || normalizeImportCell(store.health))
    .map((store) => `${storeDigestLabel(store)} | ${statusLabel(store.status) || store.status || "-"} | ${store.health || "Point a verifier"}`);
}

function getTicketsForDigest(status) {
  return (state.tickets || [])
    .filter((ticket) => ticket.status === status)
    .map((ticket) => `${ticket.id || "-"} | ${ticket.storeCode || ""} ${ticket.storeName || ""} | ${ticket.concern || "-"} | ${ticketTargetLabel(ticket)}`.trim());
}

function buildDailyOperationsDigestBody() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const installations = getTomorrowInstallationsForDigest(tomorrow);
  const blockedStores = getBlockedStoresForDigest();
  const openTickets = getTicketsForDigest("open");
  const inProgressTickets = getTicketsForDigest("in_progress");

  return [
    "Bonjour Emir, bonjour Valou,",
    "",
    `Voici le digest automatique du matin pour preparer ${digestDateLabel(tomorrow)}.`,
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

function installReminderStores() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (state.stores || [])
    .filter((store) => {
      const installDate = normalizeDateOnly(ensureStoreWorkflowData(store).destinyInstallDate);
      return Boolean(installDate) && installDate >= today;
    })
    .sort((left, right) => {
      const leftDate = normalizeDateOnly(ensureStoreWorkflowData(left).destinyInstallDate);
      const rightDate = normalizeDateOnly(ensureStoreWorkflowData(right).destinyInstallDate);
      return (leftDate?.getTime?.() || 0) - (rightDate?.getTime?.() || 0)
        || String(left.name || left.code || "").localeCompare(String(right.name || right.code || ""));
    });
}

function previsitReminderStores() {
  return (state.stores || [])
    .filter((store) => {
      const previsitDate = normalizeDateOnly(previsitDateForStore(store, { futureOnly: true }));
      return Boolean(previsitDate);
    })
    .sort((left, right) => {
      const leftDate = normalizeDateOnly(previsitDateForStore(left, { futureOnly: true }));
      const rightDate = normalizeDateOnly(previsitDateForStore(right, { futureOnly: true }));
      return (leftDate?.getTime?.() || 0) - (rightDate?.getTime?.() || 0)
        || String(left.name || left.code || "").localeCompare(String(right.name || right.code || ""));
    });
}

function storeUpdateAlertActivities() {
  return (state.activities || [])
    .filter((activity) =>
      activity.alertQueuedAt
      && storeForActivity(activity)
    )
    .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0))
    .slice(0, 30);
}

function defaultAutomationEmailDraft(automation, context = {}) {
  const template = automationEmailTemplate(automation, context);
  const isManualBody = Boolean(automation.emailBodyManual);
  const suffix = context.store
    ? `-${context.store.id || context.store.code}`
    : context.person
      ? `-${context.person.id || safeDocumentId("person", context.person.email || context.person.name)}`
      : context.activity
        ? `-${context.activity.id || safeDocumentId("activity", `${context.activity.storeName || "store"}-${context.activity.createdAt || Date.now()}`)}`
      : "";
  return {
    id: `mail-${automation.id}${suffix}`,
    automationId: automation.id,
    automationTitle: context.store
      ? `${automation.title} - ${context.store.name || context.store.code || "magasin"}`
      : context.person
        ? `${automation.title} - ${context.person.name || context.person.email || "contact"}`
        : context.activity
          ? `${automation.title} - ${context.activity.storeName || "magasin"}`
      : automation.title,
    recipient: template.recipient || automation.recipients || "",
    subject: automation.emailSubject || template.subject,
    body: isManualBody && !context.store && !context.activity ? (automation.emailBody || "") : template.body,
    status: template.status || automation.emailStatus || (automation.active ? "ready" : "draft"),
    blockedReason: template.blockedReason || "",
    plannedAt: automation.emailPlannedAt || (automation.id === "daily_operations_digest" ? nextMorningIso(9) : ""),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function mergedAutomationDraftStatus(baseDraft, current) {
  if (current?.status === "sent" && current.sentAt) {
    return "sent";
  }
  if (baseDraft.status === "blocked") {
    return "blocked";
  }
  if (current?.status === "blocked") {
    return baseDraft.status;
  }
  return current?.status || baseDraft.status;
}

function mergeAutomationEmailDraft(baseDraft, current, overrides = {}) {
  if (!current) {
    return baseDraft;
  }
  return {
    ...baseDraft,
    ...current,
    ...overrides,
    subject: overrides.subject || baseDraft.subject,
    body: overrides.body || baseDraft.body,
    status: mergedAutomationDraftStatus(baseDraft, current),
    blockedReason: baseDraft.blockedReason || current.blockedReason || ""
  };
}

function ensureAutomationEmailDrafts() {
  const existingById = new Map((state.automationEmails || []).map((email) => [email.id, email]));
  const existingByAutomation = new Map((state.automationEmails || []).map((email) => [email.automationId, email]));
  const drafts = [];
  const storeScopedAutomations = {
    install_reminder: installReminderStores,
    previsit_reminder: previsitReminderStores
  };
  (state.automations || []).forEach((automation) => {
    if (automation.id === "store_update_alert") {
      const activities = storeUpdateAlertActivities();
      activities.forEach((activity) => {
        const baseDraft = defaultAutomationEmailDraft(automation, { activity });
        const current = existingById.get(baseDraft.id);
        drafts.push(mergeAutomationEmailDraft(baseDraft, current, {
          automationTitle: baseDraft.automationTitle,
          recipient: baseDraft.recipient || current?.recipient,
          bodyManual: false
        }));
      });
      return;
    }
    if (storeScopedAutomations[automation.id]) {
      const stores = storeScopedAutomations[automation.id]();
      if (!stores.length) {
        const current = existingByAutomation.get(automation.id);
        const baseDraft = defaultAutomationEmailDraft(automation);
        drafts.push(mergeAutomationEmailDraft(baseDraft, current, {
          automationTitle: automation.title,
          recipient: current?.recipient || automation.recipients || "",
          subject: automation.emailSubject || baseDraft.subject,
          body: automation.emailBodyManual ? (current?.body || baseDraft.body) : baseDraft.body
        }));
        return;
      }
      stores.forEach((store) => {
        const baseDraft = defaultAutomationEmailDraft(automation, { store });
        const current = existingById.get(baseDraft.id);
        drafts.push(mergeAutomationEmailDraft(baseDraft, current, {
          automationTitle: baseDraft.automationTitle,
          recipient: baseDraft.recipient || current?.recipient,
          bodyManual: false
        }));
      });
      return;
    }
    if (automation.id === "new_person_welcome") {
      const queuedPeople = (state.people || []).filter((person) =>
        person.welcomeEmailQueuedAt
        && normalizePin(person.pin).length === 6
        && !["disabled", "expired"].includes(person.pinStatus)
      );
      queuedPeople.forEach((person) => {
        const baseDraft = defaultAutomationEmailDraft(automation, { person });
        const current = existingById.get(baseDraft.id);
        drafts.push(mergeAutomationEmailDraft(baseDraft, current, {
          automationTitle: baseDraft.automationTitle,
          recipient: current?.recipient || baseDraft.recipient,
          bodyManual: false
        }));
      });
      return;
    }
    const current = existingByAutomation.get(automation.id);
    const baseDraft = defaultAutomationEmailDraft(automation);
    drafts.push(current
      ? {
          ...baseDraft,
          ...current,
          automationTitle: automation.title,
          recipient: automation.id === "daily_operations_digest" ? baseDraft.recipient : (current.recipient || automation.recipients || ""),
          subject: automation.emailSubject || baseDraft.subject,
          body: automation.emailBodyManual ? (current.body || baseDraft.body) : baseDraft.body,
          status: current.status || baseDraft.status
        }
      : baseDraft);
  });
  state.automationEmails = drafts;
}

function defaultLaunchMailBody() {
  return [
    "Bonjour,",
    "",
    "L'application de suivi TWEM Brico est disponible pour votre magasin.",
    "",
    "Elle vous permet de consulter les informations utiles, les rendez-vous, les demandes SAV et le suivi du dossier.",
    "",
    "Nous vous invitons a vous connecter regulierement afin de suivre les mises a jour.",
    "",
    "Lien vers l'application : https://twem-brico-suivi.appwrite.network/",
    "",
    "Bien a vous,",
    "",
    "Valou",
    "Back Office TWEM"
  ].join("\n");
}

function defaultLaunchMailBodyNl() {
  return [
    "Hallo,",
    "",
    "De TWEM Brico opvolgingsapplicatie is beschikbaar voor uw winkel.",
    "",
    "Via deze applicatie kunt u nuttige informatie, afspraken, SAV-aanvragen en de opvolging van het dossier raadplegen.",
    "",
    "Wij nodigen u uit om regelmatig in te loggen zodat u de updates kunt opvolgen.",
    "",
    "Link naar de applicatie: https://twem-brico-suivi.appwrite.network/",
    "",
    "Met vriendelijke groeten,",
    "",
    "Valou",
    "Back Office TWEM"
  ].join("\n");
}

function launchMailLanguageForPerson(person = {}) {
  const personLanguage = normalizeLanguageCode(person.language || "");
  if (personLanguage === "nl") {
    return "nl";
  }
  const storeLanguage = storesForPersonAccess(person)
    .map((store) => storeLanguageForPrint(store))
    .find((language) => language === "nl");
  return storeLanguage === "nl" ? "nl" : "fr";
}

function groupedLaunchMailRecipients(recipients = []) {
  return recipients.reduce((groups, person) => {
    const language = launchMailLanguageForPerson(person);
    groups[language === "nl" ? "nl" : "fr"].push(person);
    return groups;
  }, { fr: [], nl: [] });
}

function renderLaunchMailComposer() {
  if (!launchMailComposer) {
    return;
  }
  const roles = normalizedRoleOptions(state.roleOptions || defaultRoleOptions);
  const people = launchMailEligiblePeople();
  const draft = {
    recipientMode: "storeType",
    storeType: "DOS",
    role: roles[0] || "",
    personId: people[0]?.id || "",
    subjectFr: "Utilisation de l'application TWEM Brico",
    bodyFr: defaultLaunchMailBody(),
    subjectNl: "Gebruik van de TWEM Brico-applicatie",
    bodyNl: defaultLaunchMailBodyNl(),
    ...(state.launchMailDraft || {})
  };
  draft.subjectFr ||= draft.subject || "Utilisation de l'application TWEM Brico";
  draft.bodyFr ||= draft.body || defaultLaunchMailBody();
  draft.subjectNl ||= "Gebruik van de TWEM Brico-applicatie";
  draft.bodyNl ||= defaultLaunchMailBodyNl();
  launchMailComposer.innerHTML = `
    <section class="launch-mail-card">
      <div class="automation-group-head">
        <div>
          <h4>Mail libre / lancement app</h4>
          <p>Preparer un mail manuel vers des magasins DOS/FOS, un role ou une personne precise. Les destinataires sont mis en BCC.</p>
        </div>
      </div>
      <form class="launch-mail-form">
        <label>
          <span>Cible</span>
          <select name="launch_recipient_mode">
            <option value="storeType" ${draft.recipientMode === "storeType" ? "selected" : ""}>Type magasin</option>
            <option value="role" ${draft.recipientMode === "role" ? "selected" : ""}>Role</option>
            <option value="person" ${draft.recipientMode === "person" ? "selected" : ""}>Personne precise</option>
          </select>
        </label>
        <label data-launch-filter="storeType">
          <span>Type magasin</span>
          <select name="launch_store_type">
            <option value="DOS" ${draft.storeType === "DOS" ? "selected" : ""}>DOS</option>
            <option value="FOS-FOSDOS" ${draft.storeType === "FOS-FOSDOS" ? "selected" : ""}>FOS + FOSDOS</option>
            <option value="FOS" ${draft.storeType === "FOS" ? "selected" : ""}>FOS uniquement</option>
            <option value="FOSDOS" ${draft.storeType === "FOSDOS" ? "selected" : ""}>FOSDOS uniquement</option>
          </select>
        </label>
        <label data-launch-filter="role">
          <span>Role</span>
          <select name="launch_role">
            ${roles.map((role) => `<option value="${escapeHtml(role)}" ${draft.role === role ? "selected" : ""}>${escapeHtml(roleLabel(role))}</option>`).join("")}
          </select>
        </label>
        <label data-launch-filter="person">
          <span>Personne</span>
          <select name="launch_person">
            ${people.map((person) => `<option value="${escapeHtml(person.id)}" ${draft.personId === person.id ? "selected" : ""}>${escapeHtml([person.name, person.email].filter(Boolean).join(" - "))}</option>`).join("")}
          </select>
        </label>
        <label class="launch-mail-wide">
          <span>Objet FR</span>
          <input type="text" name="launch_subject_fr" value="${escapeHtml(draft.subjectFr)}">
        </label>
        <label class="launch-mail-wide">
          <span>Texte FR</span>
          <textarea rows="8" name="launch_body_fr">${escapeHtml(draft.bodyFr)}</textarea>
        </label>
        <label class="launch-mail-wide">
          <span>Objet NL</span>
          <input type="text" name="launch_subject_nl" value="${escapeHtml(draft.subjectNl)}">
        </label>
        <label class="launch-mail-wide">
          <span>Tekst NL</span>
          <textarea rows="8" name="launch_body_nl">${escapeHtml(draft.bodyNl)}</textarea>
        </label>
        <div class="launch-mail-summary" data-launch-mail-summary></div>
        <div class="launch-mail-actions">
          <button type="button" class="mini-button" data-launch-reset>Reinitialiser le brouillon</button>
          <button type="button" class="mini-button" data-launch-copy>Copier destinataires + texte</button>
          <button type="submit" class="mini-button">Ouvrir Outlook</button>
        </div>
      </form>
    </section>
  `;
  const form = launchMailComposer.querySelector(".launch-mail-form");
  const update = () => updateLaunchMailComposer(form);
  form?.addEventListener("input", update);
  form?.addEventListener("change", update);
  form?.addEventListener("submit", handleLaunchMailSubmit);
  form?.querySelector("[data-launch-copy]")?.addEventListener("click", handleLaunchMailCopy);
  form?.querySelector("[data-launch-reset]")?.addEventListener("click", handleLaunchMailReset);
  update();
}

function saveLaunchMailDraftFromForm(form) {
  if (!form) {
    return;
  }
  state.launchMailDraft = {
    recipientMode: form.querySelector('[name="launch_recipient_mode"]')?.value || "storeType",
    storeType: form.querySelector('[name="launch_store_type"]')?.value || "DOS",
    role: form.querySelector('[name="launch_role"]')?.value || "",
    personId: form.querySelector('[name="launch_person"]')?.value || "",
    subjectFr: form.querySelector('[name="launch_subject_fr"]')?.value || "",
    bodyFr: form.querySelector('[name="launch_body_fr"]')?.value || "",
    subjectNl: form.querySelector('[name="launch_subject_nl"]')?.value || "",
    bodyNl: form.querySelector('[name="launch_body_nl"]')?.value || ""
  };
  saveState();
}

function updateLaunchMailComposer(form) {
  saveLaunchMailDraftFromForm(form);
  const mode = form?.querySelector('[name="launch_recipient_mode"]')?.value || "storeType";
  form?.querySelectorAll("[data-launch-filter]").forEach((node) => {
    node.classList.toggle("is-hidden", node.getAttribute("data-launch-filter") !== mode);
  });
  const recipients = launchMailRecipientsFromForm(form);
  const groups = groupedLaunchMailRecipients(recipients);
  const summary = form?.querySelector("[data-launch-mail-summary]");
  if (summary) {
    summary.innerHTML = recipients.length
      ? `<strong>${recipients.length} destinataire(s)</strong><span>FR: ${groups.fr.length} - NL: ${groups.nl.length}</span><span>${escapeHtml(recipients.slice(0, 12).map((person) => `${person.name || person.email} (${launchMailLanguageForPerson(person).toUpperCase()})`).join(", "))}${recipients.length > 12 ? "..." : ""}</span>`
      : "<strong>0 destinataire</strong><span>Aucun contact avec mail et PIN actif pour cette selection.</span>";
  }
}

function handleLaunchMailReset(event) {
  if (!window.confirm("Reinitialiser le brouillon du mail libre ?")) {
    return;
  }
  state.launchMailDraft = {};
  saveState();
  renderLaunchMailComposer();
}

function launchMailPayloadFromForm(form) {
  const recipients = launchMailRecipientsFromForm(form);
  return {
    recipients,
    groups: groupedLaunchMailRecipients(recipients),
    to: "backoffice@twem.be",
    subjectFr: form?.querySelector('[name="launch_subject_fr"]')?.value.trim() || "Utilisation de l'application TWEM Brico",
    bodyFr: form?.querySelector('[name="launch_body_fr"]')?.value.trim() || "",
    subjectNl: form?.querySelector('[name="launch_subject_nl"]')?.value.trim() || "Gebruik van de TWEM Brico-applicatie",
    bodyNl: form?.querySelector('[name="launch_body_nl"]')?.value.trim() || ""
  };
}

async function handleLaunchMailCopy(event) {
  const form = event.currentTarget.closest("form");
  const payload = launchMailPayloadFromForm(form);
  if (!payload.recipients.length) {
    window.alert("Aucun destinataire pour cette selection.");
    return;
  }
  const text = [
    `A: ${payload.to}`,
    `CCI FR: ${launchMailAddressList(payload.groups.fr)}`,
    `Objet FR: ${payload.subjectFr}`,
    "",
    payload.bodyFr,
    "",
    "-----",
    `CCI NL: ${launchMailAddressList(payload.groups.nl)}`,
    `Objet NL: ${payload.subjectNl}`,
    "",
    payload.bodyNl
  ].join("\n");
  try {
    await navigator.clipboard?.writeText(text);
    window.alert("Destinataires et texte copies.");
  } catch {
    window.alert(text);
  }
}

function handleLaunchMailSubmit(event) {
  event.preventDefault();
  const payload = launchMailPayloadFromForm(event.currentTarget);
  if (!payload.recipients.length) {
    window.alert("Aucun destinataire pour cette selection.");
    return;
  }
  const chunkSize = 40;
  const mailJobs = [];
  [
    { language: "FR", people: payload.groups.fr, subject: payload.subjectFr, body: payload.bodyFr },
    { language: "NL", people: payload.groups.nl, subject: payload.subjectNl, body: payload.bodyNl }
  ].forEach((group) => {
    for (let index = 0; index < group.people.length; index += chunkSize) {
      mailJobs.push({
        ...group,
        people: group.people.slice(index, index + chunkSize)
      });
    }
  });
  const dispatchWindow = window.open("about:blank", `twem_launch_mail_${Date.now()}`);
  if (!dispatchWindow) {
    window.alert("La fenetre d'envoi a ete bloquee par le navigateur.");
    return;
  }
  writeLaunchMailDispatcherWindow(dispatchWindow, mailJobs, payload);
}

function writeLaunchMailDispatcherWindow(targetWindow, mailJobs, payload) {
  targetWindow.document.open();
  targetWindow.document.write("<!doctype html><title>Preparation envoi mails</title><body>Preparation de la page d'envoi...</body>");
  targetWindow.document.close();
  const jobs = mailJobs.map((job, index) => ({
    index: index + 1,
    language: job.language,
    count: job.people.length,
    cci: launchMailAddressList(job.people),
    subject: job.subject,
    body: job.body,
    url: outlookComposeUrl({
      to: payload.to,
      bcc: launchMailAddressList(job.people),
      subject: job.subject,
      body: job.body
    })
  }));
  const jobsJson = JSON.stringify(jobs).replace(/<\/script/gi, "<\\/script");
  const generatedAt = formatDateTime(new Date().toISOString());
  targetWindow.document.open();
  targetWindow.document.write(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Envoi mails lancement app</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 22px; color: #201b10; background: #f7f3e8; }
          h1 { margin: 0 0 6px; font-size: 22px; }
          p { margin: 0 0 16px; color: #675f52; }
          .mail-card { display: grid; gap: 10px; margin: 14px 0; padding: 14px; border: 1px solid #dfd2b8; border-radius: 10px; background: #fffdf8; }
          .head { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
          .badge { padding: 6px 10px; border-radius: 999px; background: #ffec74; font-weight: 700; }
          label { display: grid; gap: 5px; font-weight: 700; }
          textarea, input { width: 100%; box-sizing: border-box; border: 1px solid #dfd2b8; border-radius: 8px; padding: 8px; font: inherit; background: #fff; }
          textarea { min-height: 74px; resize: vertical; }
          .body-text { min-height: 150px; }
          .actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
          a, button { border: 0; border-radius: 999px; padding: 10px 14px; background: #c43b2f; color: #fff; font-weight: 700; text-decoration: none; cursor: pointer; }
          button.secondary { background: #ffdd4a; color: #201b10; }
          button.clean { background: #201b10; }
          .hint { padding: 10px 12px; border-radius: 8px; background: #fff8d1; font-weight: 700; }
          .top-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; margin: 0 0 14px; }
          .mail-card.is-opened { opacity: .45; background: #f0ece2; }
          .mail-card.is-opened .head::after { content: "Ouvert dans Outlook"; color: #266a35; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>Mails lancement app</h1>
        <p>Page generee le ${escapeHtml(generatedAt)}. FR: ${payload.groups.fr.length} destinataire(s) - NL: ${payload.groups.nl.length} destinataire(s). Ouvre les mails un par un. Si Outlook ne remplit pas le CCI, copie uniquement le CCI du bloc concerne.</p>
        <div class="top-actions">
          <button type="button" class="clean" onclick="clearOpenedCards()">Masquer les blocs ouverts</button>
          <button type="button" class="clean" onclick="clearAllCards()">Vider cette page</button>
        </div>
        <div class="hint">Cette page est temporaire: elle ne garde pas l'historique. L'historique reste dans l'application.</div>
        <div id="mailJobs"></div>
        <script>
          const jobs = ${jobsJson};
          const container = document.getElementById("mailJobs");
          function escapeHtml(value) {
            return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
          }
          function copyText(value, label) {
            navigator.clipboard?.writeText(value).then(
              () => alert(label + " copie."),
              () => {
                const area = document.createElement("textarea");
                area.value = value;
                document.body.append(area);
                area.select();
                document.execCommand("copy");
                area.remove();
                alert(label + " copie.");
              }
            );
          }
          function markOpened(index) {
            document.querySelector('[data-mail-card="' + index + '"]')?.classList.add("is-opened");
          }
          function clearOpenedCards() {
            document.querySelectorAll(".mail-card.is-opened").forEach((node) => node.remove());
          }
          function clearAllCards() {
            if (confirm("Vider cette page d'envoi ? L'historique dans l'application ne sera pas modifie.")) {
              container.innerHTML = '<div class="hint">Page videe. Tu peux fermer cet onglet.</div>';
            }
          }
          container.innerHTML = jobs.map((job, idx) => \`
            <article class="mail-card" data-mail-card="\${idx}">
              <div class="head">
                <strong>Mail \${job.index} - \${escapeHtml(job.language)}</strong>
                <span class="badge">\${job.count} destinataire(s)</span>
              </div>
              <label>CCI<textarea readonly id="cci-\${idx}">\${escapeHtml(job.cci)}</textarea></label>
              <label>Objet<input readonly value="\${escapeHtml(job.subject)}"></label>
              <label>Texte<textarea readonly class="body-text">\${escapeHtml(job.body)}</textarea></label>
              <div class="actions">
                <button type="button" class="secondary" onclick="copyText(jobs[\${idx}].cci, 'CCI')">Copier CCI</button>
                <button type="button" class="secondary" onclick="copyText(jobs[\${idx}].subject + '\\\\n\\\\n' + jobs[\${idx}].body, 'Objet + texte')">Copier objet + texte</button>
                <a href="\${escapeHtml(job.url)}" target="_blank" rel="noreferrer" onclick="markOpened(\${idx})">Ouvrir Outlook</a>
              </div>
            </article>
          \`).join("");
        </script>
      </body>
    </html>
  `);
  targetWindow.document.close();
  targetWindow.focus();
}

function renderAutomationEmailQueue() {
  if (!automationEmailQueue) {
    return;
  }
  renderLaunchMailComposer();
  ensureAutomationEmailDrafts();
  const emails = [...(state.automationEmails || [])].sort((a, b) => {
    const statusScore = { ready: 0, draft: 1, error: 2, blocked: 3, sent: 4 };
    return (statusScore[a.status] ?? 9) - (statusScore[b.status] ?? 9)
      || String(a.automationTitle || "").localeCompare(String(b.automationTitle || ""));
  });

  if (!emails.length) {
    automationEmailQueue.innerHTML = '<div class="empty-state">Aucun mail automatique prepare pour le moment.</div>';
    return;
  }

  automationEmailQueue.innerHTML = `
    <div class="automation-email-table">
      ${emails.map((email) => `
        <article class="automation-email-row">
          <div>
            <strong>${escapeHtml(email.automationTitle || email.automationId || "Automatisation")}</strong>
            <span>${escapeHtml(email.subject || "-")}</span>
          </div>
          <div>
            <span class="automation-email-label">Destinataires</span>
            <span>${escapeHtml(email.recipient || "-")}</span>
          </div>
          <div>
            <span class="automation-email-label">Prevu</span>
            <span>${email.plannedAt ? escapeHtml(formatDateTime(email.plannedAt)) : "Selon declencheur"}</span>
          </div>
          <label>
            <span class="automation-email-label">Statut</span>
            <select data-automation-email-id="${escapeHtml(email.id)}" data-automation-email-field="status">
              ${selectableAutomationEmailStatusOptions(email).map((option) => `<option value="${escapeHtml(option.value)}" ${email.status === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
          <div>
            <span class="${automationEmailStatusClass(email.status)}">${escapeHtml(automationEmailStatusLabel(email.status))}</span>
            ${automationEmailStatusHelp(email.status) ? `<small class="automation-email-note">${escapeHtml(automationEmailStatusHelp(email.status))}</small>` : ""}
            ${email.blockedReason ? `<small class="automation-email-note">${escapeHtml(email.blockedReason)}</small>` : ""}
          </div>
          <details>
            <summary>Apercu</summary>
            <textarea rows="6" data-automation-email-id="${escapeHtml(email.id)}" data-automation-email-field="body">${escapeHtml(email.body || "")}</textarea>
          </details>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAutomationTemplateList() {
  if (!automationTemplateList) {
    return;
  }
  automationTemplateList.innerHTML = (state.automations || []).map((automation) => {
    const template = automationEmailTemplate(automation);
    return `
      <article class="automation-template-card">
        <div class="automation-card-head">
          <div>
            <h5>${escapeHtml(automation.title || automation.id)}</h5>
            <p>${escapeHtml(automation.languageMode || "")}</p>
          </div>
          <span class="automation-email-status ${automation.emailBodyManual ? "status-ready" : "status-draft"}">${automation.emailBodyManual ? "Personnalise" : "Modele auto"}</span>
        </div>
        <label class="automation-field">
          <span>Objet du mail</span>
          <input type="text" data-automation-template-id="${escapeHtml(automation.id)}" data-automation-template-field="emailSubject" value="${escapeHtml(automation.emailSubject || template.subject || "")}">
        </label>
        <label class="automation-field">
          <span>Corps du mail</span>
          <textarea rows="7" data-automation-template-id="${escapeHtml(automation.id)}" data-automation-template-field="emailBody">${escapeHtml(automation.emailBodyManual ? (automation.emailBody || "") : (template.body || ""))}</textarea>
        </label>
      </article>
    `;
  }).join("");
}

function updateAutomationSubtabs() {
  const active = state.activeAutomationSubtab || "rules";
  automationSubtabs?.querySelectorAll("[data-automation-subtab]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-automation-subtab") === active);
  });
  document.querySelectorAll("[data-automation-subpanel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.getAttribute("data-automation-subpanel") === active);
  });
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
                  <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="recipients" value="${escapeHtml(item.id === "daily_operations_digest" ? digestRecipientLabel(item) : item.recipients)}" ${item.id === "daily_operations_digest" ? "readonly" : ""}>
                </label>
                ${item.id === "daily_operations_digest" ? `
                  <div class="automation-field automation-field-wide">
                    <span>Destinataires supplementaires du digest</span>
                    <div class="digest-recipient-choices">
                      ${renderDigestRecipientChoices(item)}
                    </div>
                    <div class="digest-recipient-summary" data-digest-recipient-summary="${escapeHtml(item.id)}">
                      ${digestRecipientSummaryHtml(item)}
                    </div>
                  </div>
                ` : ""}
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
                ${Object.prototype.hasOwnProperty.call(item, "maxEscalations") ? `
                  <label class="automation-field">
                    <span>${state.language === "nl" ? "Maximum escalaties" : "Escalades max"}</span>
                    <input type="number" min="0" step="1" data-automation-id="${escapeHtml(item.id)}" data-automation-field="maxEscalations" value="${escapeHtml(item.maxEscalations)}">
                  </label>
                  <label class="automation-field">
                    <span>${state.language === "nl" ? "Na max." : "Apres max."}</span>
                    <input type="text" data-automation-id="${escapeHtml(item.id)}" data-automation-field="finalAlertRecipient" value="${escapeHtml(item.finalAlertRecipient || "")}">
                  </label>
                ` : ""}
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

  renderAutomationEmailQueue();
  renderAutomationTemplateList();
  updateAutomationSubtabs();

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

      if (!window.confirm(`Supprimer ${target.name || "ce contact"} ?`)) {
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
        try {
          await deletePersonFromRemote(target);
        } catch (error) {
          console.error("Delete person error", error);
          window.alert(`Suppression distante impossible: ${error.message}`);
        }
      }
      saveState();
      render();
    });
  });
}

function renderIntervenantList() {
  if (!intervenantList) {
    return;
  }

  const intervenants = state.people
    .filter((person) => isIntervenantRole(person.role))
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));

  if (!intervenants.length) {
    intervenantList.innerHTML = '<div class="empty-state">Aucun intervenant actif.</div>';
    return;
  }

  intervenantList.innerHTML = intervenants.map((person) => `
    <div class="simple-item">
      <div class="simple-item-title">${escapeHtml(person.name)}</div>
      <div class="simple-item-meta">${escapeHtml(roleLabel(person.role))}${person.storeCode ? ` - ${escapeHtml(person.storeCode)}` : ""}</div>
      <div class="person-row-actions">
        <button type="button" class="mini-button" data-intervenant-remove="${escapeHtml(person.id)}">Retirer</button>
      </div>
    </div>
  `).join("");

  intervenantList.querySelectorAll("[data-intervenant-remove]").forEach((button) => {
    button.addEventListener("click", handleIntervenantRemove);
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
  importExportHistoryMeta.textContent = state.importBusyMessage
    || (count ? `${count} operation(s) memorisee(s)` : "Aucune operation pour le moment.");

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

function isSavRelatedActivity(activity) {
  const id = String(activity?.id || "");
  const comment = normalizeImportCell(activity?.comment).toLowerCase();
  return /^sav-(create|update|status)-/.test(id)
    || comment.startsWith("creation sav")
    || comment.startsWith("suivi sav")
    || comment.startsWith("ticket sav");
}

async function handlePurgeSav() {
  if (!isSupAdmin()) {
    return;
  }

  if (!window.confirm("Supprimer tous les SAV actuels de l'application avant l'import historique ?")) {
    return;
  }

  const removedTickets = [...(state.tickets || [])];
  const removedActivities = (state.activities || []).filter((activity) => isSavRelatedActivity(activity));
  state.importBusyMessage = "Purge SAV en cours...";
  renderImportExportHistory();

  state.tickets = [];
  state.activities = (state.activities || []).filter((activity) => !isSavRelatedActivity(activity));

  try {
    if (hasRemoteData() && appwriteDatabases && !supabaseClient) {
      for (const ticket of removedTickets) {
        await withAppwriteRetry(() =>
          appwriteDatabases.deleteDocument(
            appwriteDatabaseId,
            appwriteTicketsCollectionId,
            ticketRemoteSyncKey(ticket)
          )
        );
      }
      for (const activity of removedActivities) {
        await withAppwriteRetry(() =>
          appwriteDatabases.deleteDocument(
            appwriteDatabaseId,
            appwriteActivitiesCollectionId,
            activityRemoteSyncKey(activity)
          )
        );
      }
      await loadRemoteState();
      refreshRemoteSyncShadow();
    } else {
      saveState();
    }
    recordImportExportHistory("import", "Purge SAV", `${removedTickets.length} SAV supprime(s).`);
  } catch (error) {
    console.error("Purge SAV error", error);
    window.alert(`Purge SAV impossible: ${error.message}`);
  } finally {
    state.importBusyMessage = "";
    saveState();
    render();
  }
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

  if (item.id === "daily_operations_digest" && field === "digestAdditionalRecipientIds") {
    item[field] = [...automationList.querySelectorAll(`[data-automation-id="${item.id}"][data-automation-field="digestAdditionalRecipientIds"]:checked`)]
      .map((input) => input.value);
  } else if (target.type === "checkbox") {
    item[field] = target.checked;
  } else if (target.multiple) {
    item[field] = [...target.selectedOptions].map((option) => option.value);
  } else if (target.type === "number") {
    item[field] = Number(target.value || 0);
  } else {
    item[field] = target.value;
  }

  if (item.id === "daily_operations_digest" && field === "digestAdditionalRecipientIds") {
    item.recipients = digestRecipientLabel(item);
  }

  ensureAutomationEmailDrafts();
  state.automationEmails
    .filter((entry) => entry.automationId === item.id)
    .forEach((emailDraft) => {
      if ((field === "recipients" || field === "digestAdditionalRecipientIds") && !["store_update_alert", "install_reminder", "previsit_reminder"].includes(item.id)) {
        emailDraft.recipient = item.id === "daily_operations_digest" ? digestRecipientLabel(item) : (item.recipients || "");
      }
      if (field === "active" && ["draft", "ready"].includes(emailDraft.status)) {
        emailDraft.status = item.active ? "ready" : "draft";
        item.emailStatus = emailDraft.status;
      }
      emailDraft.updatedAt = new Date().toISOString();
    });
  if (field === "active") {
    item.emailStatus = item.active ? "ready" : "draft";
  }

  saveState();
  if (field === "digestAdditionalRecipientIds") {
    const recipientInput = automationList?.querySelector(`[data-automation-id="${item.id}"][data-automation-field="recipients"]`);
    const summary = automationList?.querySelector(`[data-digest-recipient-summary="${item.id}"]`);
    if (recipientInput) {
      recipientInput.value = digestRecipientLabel(item);
    }
    if (summary) {
      summary.innerHTML = digestRecipientSummaryHtml(item);
    }
    renderAutomationEmailQueue();
    return;
  }
  if (field === "active" || field === "recipients") {
    renderAutomations();
  }
}

function handleAutomationTemplateFieldChange(event) {
  const target = event.target;
  const automationId = target?.getAttribute?.("data-automation-template-id");
  const field = target?.getAttribute?.("data-automation-template-field");
  if (!automationId || !field) {
    return;
  }

  const automation = state.automations.find((entry) => entry.id === automationId);
  if (!automation) {
    return;
  }

  automation[field] = target.value;
  if (field === "emailBody") {
    automation.emailBodyManual = true;
  }

  ensureAutomationEmailDrafts();
  if (event.type === "input") {
    window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
    return;
  }

  saveState();
  renderAutomations();
}

function handleAutomationSubtabClick(event) {
  const button = event.target.closest("[data-automation-subtab]");
  if (!button) {
    return;
  }
  state.activeAutomationSubtab = button.getAttribute("data-automation-subtab") || "rules";
  updateAutomationSubtabs();
  window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
}

function handleAutomationEmailFieldChange(event) {
  const target = event.target;
  const emailId = target?.getAttribute?.("data-automation-email-id");
  const field = target?.getAttribute?.("data-automation-email-field");
  if (!emailId || !field) {
    return;
  }

  const email = state.automationEmails.find((entry) => entry.id === emailId);
  if (!email) {
    return;
  }

  email[field] = target.value;
  email.updatedAt = new Date().toISOString();
  const automation = state.automations.find((entry) => entry.id === email.automationId);
  if (automation && field === "status") {
    automation.emailStatus = email.status;
  }
  if (automation && field === "body") {
    automation.emailBody = email.body;
    automation.emailBodyManual = true;
    email.bodyManual = true;
  }
  if (field === "body" && event.type === "input") {
    window.localStorage.setItem(storageKey, JSON.stringify(localUiState()));
    return;
  }

  saveState();
  if (field !== "body") {
    renderAutomationEmailQueue();
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

function canManageRolloutPerson(person) {
  const role = canonicalRoleKey(person?.role);
  return Boolean(person?.id && !["supadmin_twem", "admin_twem"].includes(role));
}

function pinRolloutStatus(person) {
  return ["disabled", "expired"].includes(person?.pinStatus) ? "closed" : "open";
}

function pinRolloutStoreLabel(person) {
  if (person.allowedStoreCodes?.includes("*")) {
    return "Tous les magasins";
  }
  const codes = person.allowedStoreCodes?.length ? person.allowedStoreCodes : (person.storeCode ? [person.storeCode] : []);
  if (!codes.length) {
    return "-";
  }
  return codes
    .map((code) => {
      const store = state.stores.find((entry) => entry.code === code);
      return store ? `${store.code} ${store.name}` : code;
    })
    .join(", ");
}

function pinRolloutPeople() {
  const search = normalizeImportCell(pinRolloutSearchInput?.value).toLowerCase();
  const statusFilter = pinRolloutStatusFilter?.value || "all";
  return state.people
    .filter(canManageRolloutPerson)
    .filter((person) => {
      const status = pinRolloutStatus(person);
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }
      if (!search) {
        return true;
      }
      const haystack = [
        person.name,
        person.email,
        roleLabel(person.role),
        person.role,
        person.storeCode,
        pinRolloutStoreLabel(person)
      ].join(" ").toLowerCase();
      return haystack.includes(search);
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

function renderPinRolloutList() {
  if (!pinRolloutList) {
    return;
  }
  const people = pinRolloutPeople();
  const manageable = state.people.filter(canManageRolloutPerson);
  const openCount = manageable.filter((person) => pinRolloutStatus(person) === "open").length;
  const closedCount = Math.max(0, manageable.length - openCount);
  if (pinRolloutSummary) {
    pinRolloutSummary.textContent = `${openCount} acces ouvert(s) - ${closedCount} ferme(s) - ${people.length} affiche(s)`;
  }
  if (!people.length) {
    pinRolloutList.innerHTML = '<div class="empty-state">Aucune personne ne correspond a ce filtre.</div>';
    return;
  }
  pinRolloutList.innerHTML = people.map((person) => {
    const isOpen = pinRolloutStatus(person) === "open";
    return `
      <label class="simple-item pin-rollout-row">
        <input type="checkbox" data-pin-rollout-person="${escapeHtml(person.id)}">
        <span>
          <strong>${escapeHtml(person.name || "-")}</strong>
          <span class="override-meta">${escapeHtml([roleLabel(person.role), person.email || "", pinRolloutStoreLabel(person)].filter(Boolean).join(" - "))}</span>
        </span>
        <span class="pin-rollout-status ${isOpen ? "is-open" : "is-closed"}">${isOpen ? "Ouvert" : "Ferme"}</span>
      </label>
    `;
  }).join("");
}

async function applyPinRollout(action, scope = "selected") {
  const selectedIds = [...(pinRolloutList?.querySelectorAll("[data-pin-rollout-person]:checked") || [])]
    .map((checkbox) => checkbox.getAttribute("data-pin-rollout-person"))
    .filter(Boolean);
  const targetPeople = scope === "all-closed"
    ? state.people.filter((person) => canManageRolloutPerson(person) && pinRolloutStatus(person) === "closed")
    : state.people.filter((person) => selectedIds.includes(person.id) && canManageRolloutPerson(person));
  if (!targetPeople.length) {
    window.alert(scope === "all-closed" ? "Aucun acces ferme a rouvrir." : "Coche au moins une personne.");
    return;
  }
  if (scope === "all-closed" && !window.confirm(`Rouvrir ${targetPeople.length} acces ferme(s) ?`)) {
    return;
  }
  targetPeople.forEach((person) => {
    if (action === "open") {
      person.pinStatus = "active";
      if (normalizePin(person.pin).length !== 6) {
        person.pin = generateUniquePin();
      }
      person.welcomeEmailQueuedAt = new Date().toISOString();
    } else {
      person.pinStatus = "disabled";
    }
  });
  ensureAutomationEmailDrafts();
  saveState();
  if (hasRemoteData()) {
    let synced = 0;
    for (const person of targetPeople) {
      try {
        await syncPersonToRemote(person);
        synced += 1;
      } catch (error) {
        console.error("Erreur sync acces PIN", person.name, error);
      }
    }
    try {
      await syncSettingsToRemote();
    } catch (error) {
      console.error("Erreur sync settings apres diffusion PIN", error);
    }
    if (synced !== targetPeople.length) {
      window.alert(`${synced}/${targetPeople.length} acces synchronise(s). Les autres sont gardes localement, retente apres refresh.`);
    }
  }
  render();
}

async function markAllPinMailsReceived() {
  const sentAt = legacyWelcomeSentAt;
  const targetPeople = state.people.filter((person) => person?.id && normalizePin(person.pin).length === 6);
  if (!targetPeople.length) {
    window.alert("Aucun contact PIN a mettre a jour.");
    return;
  }
  if (!window.confirm(`Marquer ${targetPeople.length} contact(s) PIN comme mail recu/envoye le 02/06/2026 ?`)) {
    return;
  }
  targetPeople.forEach((person) => {
    person.welcomeEmailSentAt = sentAt;
    person.welcomeEmailQueuedAt = "";
    person.manualWelcomeEmailSentAt = sentAt;
    person.manualWelcomeEmailSentBy = currentUser()?.name || state.activeUserName || "TWEM";
  });
  ensureAutomationEmailDrafts();
  saveState();
  if (hasRemoteData()) {
    let synced = 0;
    for (const person of targetPeople) {
      try {
        await syncPersonToRemote(person);
        synced += 1;
      } catch (error) {
        console.error("Erreur sync mail recu PIN", person.name, error);
      }
    }
    if (synced !== targetPeople.length) {
      window.alert(`${synced}/${targetPeople.length} contact(s) synchronise(s). Les autres sont gardes localement, retente apres refresh.`);
    }
  }
  render();
}

function renderPinAccessList() {
  if (!pinAccessList) {
    return;
  }

  const visibleRows = state.people.slice();

  if (!visibleRows.length) {
    pinAccessList.innerHTML = '<div class="empty-state">Aucun acces PIN configure.</div>';
    return;
  }

  const statusGroups = [
    {
      title: "Connectes",
      people: visibleRows
        .filter((person) => person.loginHistory?.[0]?.at)
        .sort((a, b) => new Date(b.loginHistory?.[0]?.at || 0) - new Date(a.loginHistory?.[0]?.at || 0))
    },
    {
      title: "Acces envoye",
      people: visibleRows
        .filter((person) => !person.loginHistory?.[0]?.at && person.welcomeEmailSentAt)
        .sort((a, b) => new Date(b.welcomeEmailSentAt || 0) - new Date(a.welcomeEmailSentAt || 0))
    },
    {
      title: "Acces pas encore envoye",
      people: visibleRows
        .filter((person) => !person.loginHistory?.[0]?.at && !person.welcomeEmailSentAt)
        .sort((a, b) => a.name.localeCompare(b.name, "fr"))
    }
  ];

  const renderPersonRow = (person) => {
    const stores = person.allowedStoreCodes?.includes("*")
      ? "Tous les magasins"
      : (person.allowedStoreCodes?.length ? person.allowedStoreCodes.join(", ") : (person.storeCode || "-"));
    const lastSeen = person.loginHistory?.length ? formatDateTime(person.loginHistory[0].at) : "Jamais";
    const pinReady = normalizePin(person.pin).length === 6;
    const mailReady = Boolean(normalizeImportCell(person.email));
    const mailSent = Boolean(person.welcomeEmailSentAt);
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
        <div>
          <strong>${mailSent ? "✓" : "-"}</strong>
          <div class="override-meta">${mailSent ? `Mail envoye ${formatDateTime(person.welcomeEmailSentAt)}` : "Mail acces"}</div>
        </div>
        <div class="person-row-actions">
          <button type="button" class="mini-button" data-pin-send-mail="${escapeHtml(person.id)}" ${pinReady && mailReady ? "" : "disabled"}>
            ${mailSent ? "Renvoyer mail" : "Envoyer mail"}
          </button>
          <button type="button" class="mini-button" data-pin-edit="${escapeHtml(person.id)}">Modifier</button>
          <button type="button" class="mini-button" data-pin-disable="${escapeHtml(person.id)}">Desactiver</button>
        </div>
      </div>
    `;
  };

  pinAccessList.innerHTML = statusGroups.map((group) => `
    <section class="pin-access-group">
      <div class="pin-access-group-title">
        <strong>${escapeHtml(group.title)}</strong>
        <span>${group.people.length}</span>
      </div>
      ${group.people.length
        ? group.people.map(renderPersonRow).join("")
        : '<div class="empty-state">Aucune personne dans ce groupe.</div>'}
    </section>
  `).join("");

  pinAccessList.querySelectorAll("[data-pin-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const person = state.people.find((entry) => entry.id === button.getAttribute("data-pin-edit"));
      fillPinAccessForm(person);
    });
  });

  pinAccessList.querySelectorAll("[data-pin-send-mail]").forEach((button) => {
    button.addEventListener("click", handleManualWelcomeMailClick);
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

async function handleManualWelcomeMailClick(event) {
  const button = event.currentTarget;
  const personId = event.currentTarget.getAttribute("data-pin-send-mail");
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) {
    return;
  }
  const email = normalizeImportCell(person.email);
  const pin = normalizePin(person.pin);
  if (!email || pin.length !== 6) {
    window.alert("Il faut une adresse mail et un PIN a 6 chiffres avant d'envoyer.");
    return;
  }

  const automation = (state.automations || []).find((entry) => entry.id === "new_person_welcome") || {};
  const welcomeMail = buildNewPersonWelcomeEmail(person, automation);
  const subjectText = welcomeMail.subject || "Acces application TWEM Brico";
  const bodyText = welcomeMail.body || "";
  const clipboardText = [
    `A: ${email}`,
    `Objet: ${subjectText}`,
    "",
    bodyText
  ].join("\n");
  const outlookWindow = window.open("", "_blank");
  writeMailFallbackWindow(outlookWindow, email, subjectText, bodyText);
  try {
    await navigator.clipboard?.writeText(clipboardText);
  } catch {
    // Clipboard can be blocked by browser permissions; Outlook compose still opens below.
  }

  if (appwriteMailerFunctionId) {
    button.disabled = true;
    const previousLabel = button.textContent;
    button.textContent = "Envoi...";
    try {
      const result = await executeWelcomeMailFunction(person);
      if (result?.dryRun) {
        throw new Error("La fonction Appwrite est encore en DRY_RUN=true, donc aucun mail reel n'est parti.");
      }
      await markManualWelcomeMailSent(person, result.sentAt || new Date().toISOString(), email);
      outlookWindow?.close?.();
      window.alert(`Mail envoye depuis backoffice@twem.be a ${email}.`);
      return;
    } catch (sendError) {
      const openFallback = window.confirm(`L'envoi direct depuis l'app n'a pas fonctionne.\n\nDetail: ${sendError.message}\n\nOuvrir Outlook Web en secours ?`);
      if (!openFallback) {
        outlookWindow?.close?.();
        return;
      }
      openWelcomeMailInOutlookWindow(outlookWindow, email, subjectText, bodyText);
    } finally {
      button.disabled = false;
      button.textContent = previousLabel;
    }
  } else {
    openWelcomeMailInOutlookWindow(outlookWindow, email, subjectText, bodyText);
  }

  await confirmManualWelcomeMailSent(person, email);
}

async function executeWelcomeMailFunction(person) {
  if (!appwriteEndpoint || !appwriteProjectId || !appwriteMailerFunctionId) {
    throw new Error("Configuration Appwrite mailer incomplete.");
  }
  const path = `/?action=send-welcome&personId=${encodeURIComponent(person.id || "")}`;
  const response = await fetch(`${appwriteEndpoint}/functions/${encodeURIComponent(appwriteMailerFunctionId)}/executions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": appwriteProjectId,
      "X-Appwrite-Response-Format": "1.9.5"
    },
    body: JSON.stringify({
      body: "",
      async: false,
      path,
      method: "GET",
      headers: {}
    })
  });
  const execution = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(execution?.message || `Execution Appwrite refusee (${response.status}).`);
  }
  const body = parseJsonField(execution.responseBody, {});
  if (execution.status !== "completed" || execution.responseStatusCode >= 400 || body?.ok === false) {
    throw new Error(body?.error || execution.errors || `Execution Appwrite ${execution.status || "inconnue"}.`);
  }
  return body;
}

function welcomeMailOutlookUrl(email, subjectText, bodyText) {
  const encodeOutlookParam = (value) => encodeURIComponent(String(value || "")).replace(/%20/g, "%20");
  return [
    "https://outlook.office.com/mail/deeplink/compose",
    `?to=${encodeOutlookParam(email)}`,
    `&subject=${encodeOutlookParam(subjectText)}`,
    `&body=${encodeOutlookParam(bodyText)}`
  ].join("");
}

function outlookComposeUrl({ to = "", bcc = "", subject = "", body = "" } = {}) {
  const encodeOutlookParam = (value) => encodeURIComponent(String(value || "")).replace(/%20/g, "%20");
  return [
    "https://outlook.office.com/mail/deeplink/compose",
    `?to=${encodeOutlookParam(to)}`,
    bcc ? `&bcc=${encodeOutlookParam(bcc)}` : "",
    `&subject=${encodeOutlookParam(subject)}`,
    `&body=${encodeOutlookParam(body)}`
  ].join("");
}

function launchMailAddressList(people = []) {
  return people.map((person) => normalizeImportCell(person.email)).filter(Boolean).join(",");
}

function openWelcomeMailInOutlookWindow(outlookWindow, email, subjectText, bodyText) {
  const outlookUrl = welcomeMailOutlookUrl(email, subjectText, bodyText);
  if (outlookWindow && !outlookWindow.closed) {
    outlookWindow.location.href = outlookUrl;
    return;
  }
  window.open(outlookUrl, "_blank");
}

function writeMailFallbackWindow(targetWindow, email, subjectText, bodyText) {
  if (!targetWindow) {
    return;
  }
  const outlookUrl = welcomeMailOutlookUrl(email, subjectText, bodyText);
  targetWindow.document.open();
  targetWindow.document.write(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Mail acces TWEM Brico</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #201b10; line-height: 1.45; }
          a, button { display: inline-block; margin: 8px 8px 16px 0; padding: 10px 14px; border-radius: 999px; background: #c43b2f; color: #fff; text-decoration: none; border: 0; font-weight: 700; }
          pre { white-space: pre-wrap; border: 1px solid #e0d6bd; background: #fff9e8; padding: 14px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>Mail pret</h1>
        <p>Si Outlook ne s'ouvre pas automatiquement, clique sur le bouton ci-dessous. Le contenu a aussi ete copie dans le presse-papiers.</p>
        <a href="${escapeHtml(outlookUrl)}">Ouvrir dans Outlook Web</a>
        <p><strong>A:</strong> ${escapeHtml(email)}<br><strong>Objet:</strong> ${escapeHtml(subjectText)}</p>
        <pre>${escapeHtml(bodyText)}</pre>
      </body>
    </html>
  `);
  targetWindow.document.close();
}

async function confirmManualWelcomeMailSent(person, email) {
  const markSent = window.confirm("Le mail est ouvert dans Outlook Web et le contenu est copie. Marquer ce mail comme envoye apres ton envoi depuis backoffice@twem.be ?");
  if (!markSent) {
    return;
  }
  if (!person) {
    return;
  }
  await markManualWelcomeMailSent(person, new Date().toISOString(), email);
}

async function markManualWelcomeMailSent(person, sentAt, email) {
  person.welcomeEmailSentAt = sentAt;
  person.welcomeEmailQueuedAt = "";
  person.manualWelcomeEmailSentAt = sentAt;
  person.manualWelcomeEmailSentBy = currentUser()?.name || state.activeUserName || "";

  const draft = (state.automationEmails || []).find((entry) =>
    entry.automationId === "new_person_welcome"
    && (
      entry.personId === person.id
      || String(entry.id || "").includes(person.id)
      || normalizeImportCell(entry.recipient).toLowerCase() === email.toLowerCase()
    )
  );
  if (draft) {
    draft.status = "sent";
    draft.sentAt = sentAt;
    draft.updatedAt = sentAt;
  }

  saveState();
  render();

  if (hasRemoteData()) {
    try {
      await syncPersonToRemote(person);
      await syncSettingsToRemote();
    } catch (syncError) {
      console.warn("Impossible de synchroniser le marquage mail envoye pour le moment.", syncError);
      window.alert("Le mail est marque envoye dans l'app. La synchronisation Appwrite n'a pas repondu tout de suite, recharge dans quelques secondes pour verifier.");
    }
  }
}

function renderToolList() {
  toolList.innerHTML = "";
  const visibleToolItems = (state.toolItems || []).filter((item) =>
    item?.id !== tutorialVideosSettingsItemId
    && item?.kind !== "tutorial_videos"
    && item?.id !== technicalSheetsSettingsItemId
    && item?.kind !== "technical_sheets"
    && item?.id !== automationEmailsSettingsItemId
    && item?.kind !== "automation_emails"
    && item?.id !== mailerStateSettingsItemId
    && item?.kind !== "mailer_state"
  );

  if (!visibleToolItems.length) {
    toolList.innerHTML = '<div class="empty-state">Aucune note pour le moment.</div>';
    return;
  }

  visibleToolItems.forEach((item) => {
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
        <strong>${override.level === "edit" ? "Encoder / modifier" : "Consulter"}</strong>
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

async function handleNetworkConfirm(event) {
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
  setStoreSaveFeedback(storeId, "Sauvegarde en cours...", "pending");
  workflow.networkRows = readNetworkRows(form, store);
  workflow.networkConfigConfirmed = true;
  store.updatedAt = new Date().toISOString();
  const hiddenField = form.querySelector('[name="network_config_confirmed"]');
  if (hiddenField) {
    hiddenField.value = "1";
  }
  saveState();
  if (hasRemoteData()) {
    try {
      await syncStoreToRemote(store, "Choix telephonie confirmes");
      setStoreSaveFeedback(storeId, `Sauvegarde Appwrite OK a ${new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}`, "success");
    } catch (error) {
      console.error("Erreur sauvegarde Appwrite configuration reseau", error);
      setStoreSaveFeedback(storeId, "Garde localement, erreur Appwrite. Ne refresh pas tout de suite.", "error");
    }
  } else {
    setStoreSaveFeedback(storeId, `Sauvegarde locale OK a ${new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}`, "success");
  }
  renderPreservingScroll();
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
    } else if (state.activeUserName && !state.people.some((person) => person.name === state.activeUserName)) {
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
    const remoteToolItems = parseJsonField(settingsDocument.tool_items_json, []);
    const tutorialVideosItem = remoteToolItems.find((item) => item?.id === tutorialVideosSettingsItemId || item?.kind === "tutorial_videos");
    const technicalSheetsItem = remoteToolItems.find((item) => item?.id === technicalSheetsSettingsItemId || item?.kind === "technical_sheets");
    const automationEmailsItem = remoteToolItems.find((item) => item?.id === automationEmailsSettingsItemId || item?.kind === "automation_emails");
    state.toolItems = remoteToolItems.filter((item) =>
      item?.id !== tutorialVideosSettingsItemId
      && item?.kind !== "tutorial_videos"
      && item?.id !== technicalSheetsSettingsItemId
      && item?.kind !== "technical_sheets"
      && item?.id !== automationEmailsSettingsItemId
      && item?.kind !== "automation_emails"
      && item?.id !== mailerStateSettingsItemId
      && item?.kind !== "mailer_state"
    );
    state.accessOverrides = parseJsonField(settingsDocument.access_overrides_json, []);
    const remoteRoleVisibilityConfig = parseJsonField(settingsDocument.role_visibility_config_json, null);
    if (remoteRoleVisibilityConfig && Object.keys(remoteRoleVisibilityConfig).length) {
      state.roleVisibilityConfig = normalizedRoleVisibilityConfig(remoteRoleVisibilityConfig);
    }
    state.automations = normalizedAutomations(parseJsonField(settingsDocument.automations_json, state.automations || []));
    state.automationEmails = Array.isArray(automationEmailsItem?.emails)
      ? automationEmailsItem.emails
      : parseJsonField(settingsDocument.automation_emails_json, state.automationEmails || []);
    state.tutorialVideos = normalizedTutorialVideos(tutorialVideosItem?.videos || state.tutorialVideos || []);
    const technicalSheetDocuments = settingsDocuments
      .flatMap((document) => parseJsonField(document.tool_items_json, []))
      .filter((item) => item?.kind === "technical_sheet" && item?.sheet)
      .map((item) => item.sheet);
    state.technicalSheets = normalizedTechnicalSheets([
      ...technicalSheetDocuments,
      ...(technicalSheetsItem?.sheets || state.technicalSheets || [])
    ]);
    const remoteExtensions = parseJsonField(settingsDocument.extension_catalog_json, []);
    if (Array.isArray(remoteExtensions) && remoteExtensions.length) {
      extensionCatalogRows.splice(0, extensionCatalogRows.length, ...remoteExtensions.map((row, index) => normalizeExtensionCatalogRow(row, index)));
    }
  } else {
    state.roleOptions = state.roleOptions?.length ? normalizedRoleOptions(state.roleOptions) : [...defaultRoleOptions];
    state.toolItems = state.toolItems || [];
    state.accessOverrides = state.accessOverrides || [];
    state.tutorialVideos = normalizedTutorialVideos(state.tutorialVideos || []);
    state.technicalSheets = normalizedTechnicalSheets(state.technicalSheets || []);
  }

  if (state.activeUserName && !state.people.some((person) => person.name === state.activeUserName)) {
    state.activeUserName = state.people.find((person) => person.role === "supadmin_twem")?.name || state.people[0]?.name || state.activeUserName;
  }

  state.people = normalizeSpecialPeople(stripKnownTestPeople(state.people));
  const legacyWelcomePeople = markLegacyWelcomeMailsSent(state.people);
  ensureAutomationEmailDrafts();
  saveState();
  refreshRemoteSyncShadow();
  if (legacyWelcomePeople.length && hasAppwriteDataConfig) {
    legacyWelcomePeople.forEach((person) => {
      syncPersonToRemote(person).catch((error) => {
        console.error("Erreur sync migration mail acces", person.name, error);
      });
    });
  }
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
      storeId: store.id,
      storeCode: store.code,
      storeName: store.name,
      result: store.status === "blocked" ? "issue" : "ok",
      comment: activityComment,
      confirmedBy: state.activeUserName,
      createdAt: new Date().toISOString(),
      alertQueuedAt: new Date().toISOString()
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

  const documentId = person.remoteDocumentId || safeDocumentId("person", person.id || person.email || person.name);
  const savedDocument = await upsertAppwriteDocument(
    appwritePeopleCollectionId,
    documentId,
    buildAppwritePersonDocument(person)
  );
  person.remoteDocumentId = savedDocument?.$id || documentId;
}

async function deletePersonFromRemote(personOrId) {
  if (supabaseClient) {
    const numericId = Number(typeof personOrId === "object" ? personOrId.id : personOrId);
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

  const person = typeof personOrId === "object" ? personOrId : null;
  const rawId = person?.id || personOrId;
  const candidateIds = [
    person?.remoteDocumentId,
    person?.$id,
    rawId,
    safeDocumentId("person", rawId),
    safeDocumentId("person", person?.email || person?.name || rawId)
  ].filter(Boolean);
  const uniqueIds = [...new Set(candidateIds)];

  for (const documentId of uniqueIds) {
    try {
      await appwriteDatabases.deleteDocument(
        appwriteDatabaseId,
        appwritePeopleCollectionId,
        documentId
      );
      return;
    } catch (error) {
      const code = Number(error?.code || error?.response?.code || 0);
      if (code !== 404) {
        throw error;
      }
    }
  }
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

async function syncTechnicalSheetToRemote(sheet) {
  if (!hasAppwriteDataConfig || !sheet) {
    return;
  }
  await upsertAppwriteDocument(
    appwriteSettingsCollectionId,
    technicalSheetDocumentId(sheet),
    {
      tool_items_json: JSON.stringify([
        {
          id: sheet.id,
          kind: "technical_sheet",
          sheet
        }
      ])
    }
  );
}

async function deleteTechnicalSheetFromRemote(sheetId) {
  if (!hasAppwriteDataConfig || !appwriteDatabases || !sheetId) {
    return;
  }
  try {
    await appwriteDatabases.deleteDocument(
      appwriteDatabaseId,
      appwriteSettingsCollectionId,
      technicalSheetDocumentId(sheetId)
    );
  } catch (error) {
    const code = Number(error?.code || error?.response?.code || 0);
    if (code !== 404) {
      throw error;
    }
  }
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

  const liveTickets = (state.tickets || []).filter((ticket) => ticket && ticket.id && ticket.storeId !== undefined && ticket.storeId !== null);
  for (let index = 0; index < liveTickets.length; index += 1) {
    await paceRemoteSync(index, every, delayMs);
    const ticket = liveTickets[index];
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
    every = 1,
    onProgress = null,
    stores = state.stores
  } = options;

  for (let index = 0; index < stores.length; index += 1) {
    if (typeof onProgress === "function") {
      onProgress(index + 1, stores.length, stores[index]);
    }
    await paceRemoteSync(index, every, delayMs);
    const store = stores[index];
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

async function syncImportedStateIfPossible(mode = "full", options = {}) {
  if (!hasRemoteData()) {
    return { synced: false, skipped: true };
  }

  try {
    if (mode === "stores") {
      await syncStoresRemoteState({ delayMs: 1800, every: 1 });
      await syncSettingsToRemote();
      await loadRemoteState();
    } else if (mode === "telephony") {
      await syncStoresRemoteState({
        stores: Array.isArray(options.stores) && options.stores.length ? options.stores : state.stores,
        delayMs: 2500,
        every: 1,
        onProgress: (current, total, store) => {
          state.importBusyMessage = `Import telephonie en cours... ${current}/${total} - ${store?.code || ""}`;
          renderImportExportHistory();
        }
      });
      return { synced: true, skipped: false };
    } else if (mode === "extensions") {
      await syncSettingsToRemote();
      await loadRemoteState();
    } else {
      await syncAllRemoteState();
      await loadRemoteState();
    }
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
    if (isStoreEditorDirty()) {
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
    finalizeRender();
    return;
  }
  if (activePanel === "contacts") {
    renderPeopleList();
    renderIntervenantList();
    renderRoleList();
    finalizeRender();
    return;
  }
  if (activePanel === "reports") {
    renderStores();
    renderActivities();
    finalizeRender();
    return;
  }
  if (activePanel === "automations") {
    renderAutomations();
    finalizeRender();
    return;
  }
  if (activePanel === "import-export") {
    renderImportExportHistory();
    finalizeRender();
    return;
  }
  if (activePanel === "pin-access") {
    renderPinRolloutList();
    renderPinAccessList();
    finalizeRender();
    return;
  }
  if (activePanel === "tools") {
    renderToolList();
    finalizeRender();
    return;
  }
  if (activePanel === "visibility") {
    renderVisibilityEditor();
    renderVisibilityOverrides();
    finalizeRender();
    return;
  }
  applyReadOnlyRules();
  finalizeRender();
}

function finalizeRender() {
  applyReadOnlyRules();
  schedulePostRenderLanguagePass();
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
  if (Array.isArray(payload.extensionCatalogRows) && payload.extensionCatalogRows.length) {
    extensionCatalogRows.splice(0, extensionCatalogRows.length, ...payload.extensionCatalogRows.map((row, index) => normalizeExtensionCatalogRow(row, index)));
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
  downloadBlob(blob, fileName);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function dataUrlToBlob(dataUrl) {
  const [header, payload] = String(dataUrl || "").split(",");
  const mimeMatch = header?.match(/^data:([^;]+);base64$/i);
  if (!mimeMatch || !payload) {
    return null;
  }
  const binary = window.atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeMatch[1] || "application/pdf" });
}

function appwriteStorageFileUrl(fileId, mode = "download") {
  if (!fileId || !appwritePlansBucketId || !appwriteEndpoint || !appwriteProjectId) {
    return "";
  }
  const action = mode === "view" ? "view" : "download";
  const base = appwriteEndpoint.replace(/\/$/, "");
  return `${base}/storage/buckets/${encodeURIComponent(appwritePlansBucketId)}/files/${encodeURIComponent(fileId)}/${action}?project=${encodeURIComponent(appwriteProjectId)}`;
}

async function createAppwriteStorageFile(bucketId, fileId, file) {
  if (!appwriteStorage) {
    throw new Error("Storage Appwrite indisponible.");
  }
  try {
    return await appwriteStorage.createFile({ bucketId, fileId, file });
  } catch (error) {
    return appwriteStorage.createFile(bucketId, fileId, file);
  }
}

async function deleteAppwriteStorageFile(bucketId, fileId) {
  if (!appwriteStorage || !bucketId || !fileId) {
    return;
  }
  try {
    await appwriteStorage.deleteFile({ bucketId, fileId });
  } catch (error) {
    await appwriteStorage.deleteFile(bucketId, fileId);
  }
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

function zipAvailable() {
  return typeof window.JSZip !== "undefined";
}

function sanitizeFileNamePart(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "fiche";
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
  const workbook = window.XLSX.read(arrayBuffer, { type: "array", cellDates: true });
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
  if (!Array.isArray(matrix) || matrix.length < 2) {
    return [];
  }

  const normalizeHeaderKey = (value) => normalizeImportCell(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  const looksLikeExtensionHeader = (row) => {
    const keys = (row || []).map(normalizeHeaderKey);
    return keys.includes("categorie")
      && keys.includes("modele")
      && keys.includes("numero")
      && (keys.includes("libelle fr") || keys.includes("libelle") || keys.includes("last name*"));
  };

  const headerIndex = looksLikeExtensionHeader(matrix[0])
    ? 0
    : (looksLikeExtensionHeader(matrix[1]) ? 1 : 0);
  const headerRow = (matrix[headerIndex] || []).map((value) => normalizeImportCell(value));

  return matrix
    .slice(headerIndex + 1)
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
    ["Code magasin", "Nom magasin", "Licences", "Postes fixes", "Mobiles", "Call buttons", "Panic buttons", "Date telephonie actuelle", "IP range", "Statut"]
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
      workflow.currentPhoneDate || "",
      store.ipRange || "",
      statusLabel(store.status)
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

function storesForFicheZipExport() {
  const selection = tabBulkStorePrintFilter?.value || "all";
  const scopedStores = getRoleScopedStores();
  const ticketsByStore = new Map();
  getFilteredTickets().forEach((ticket) => {
    if (ticket?.storeId) {
      ticketsByStore.set(ticket.storeId, true);
    }
  });

  switch (selection) {
    case "dos":
      return scopedStores.filter((store) => normalizeShopTypeValue(store.shopType || "") === "DOS");
    case "fos":
      return scopedStores.filter((store) => normalizeShopTypeValue(store.shopType || "") === "FOS");
    case "fosdos":
      return scopedStores.filter((store) => normalizeShopTypeValue(store.shopType || "") === "FOSDOS");
    case "with_installation_date":
      return scopedStores.filter((store) => {
        const workflow = ensureStoreWorkflowData(store);
        return Boolean(String(workflow.destinyInstallDate || "").trim());
      });
    case "blocked":
      return scopedStores.filter((store) => store.status === "blocked");
    case "with_sav":
      return scopedStores.filter((store) => ticketsByStore.has(store.id));
    case "all":
    default:
      return scopedStores;
  }
}

async function exportStoreFichesZip() {
  if (!zipAvailable()) {
    throw new Error("Bibliotheque ZIP indisponible.");
  }
  const stores = storesForFicheZipExport();
  if (!stores.length) {
    throw new Error("Aucun magasin ne correspond a cette selection.");
  }

  const selection = tabBulkStorePrintFilter?.value || "all";
  const zip = new window.JSZip();
  stores.forEach((store) => {
    const code = sanitizeFileNamePart(store.code || "store");
    const name = sanitizeFileNamePart(store.name || "magasin");
    zip.file(`${code}-${name}.html`, buildPrintableStoreHtml(store));
  });

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(
    blob,
    `twem-brico-fiches-${selection}-${new Date().toISOString().slice(0, 10)}.zip`
  );
  recordImportExportHistory("export", "Export fiches magasin ZIP", `${stores.length} fiche(s) exportee(s) en ZIP.`);
}

function exportExtensionsXlsx() {
  const rows = [
    ["Categorie", "Modele", "Numero", "Libelle FR", "Libelle NL", "Libelle EN", "Ancien numero", "Item", "Activation", "Usage"]
  ];
  extensionCatalogRows.forEach((row) => {
    rows.push([
      extensionDisplayCategoryLabel(row),
      row.model,
      row.number,
      row.labelFr || row.label,
      row.labelNl || row.label,
      row.labelEn || row.label,
      row.oldNumber,
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
  if (!pdfAvailable()) {
    throw new Error("Bibliotheque PDF indisponible.");
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const groupedRows = [
    ["Boutons d appel", extensionRowsForCategory("Bouton Appel")],
    ["Panic Button", extensionCatalogRows.filter((row) => ["panic", "other"].includes(extensionDisplayCategoryKey(row)))],
    ["Flash light", extensionRowsForCategory("Flash light")],
    ["Fix", extensionRowsForCategory("Fixed")],
    ["Mobile", extensionRowsForCategory("Mobile")],
    [groupedCallExtensionCategoryLabel, extensionRowsForCategory(groupedCallExtensionCategoryLabel)]
  ].filter(([, rows]) => rows.length);

  doc.setFillColor(255, 222, 59);
  doc.rect(0, 0, 210, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(36, 33, 20);
  doc.setFontSize(15);
  doc.text("Liste des extensions magasin", 12, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`TWEM x Brico - Genere le ${formatDateTime(new Date().toISOString())}`, 12, 18);
  doc.setTextColor(36, 33, 20);

  let currentY = 30;
  groupedRows.forEach(([title, rows], sectionIndex) => {
    const estimatedSectionHeight = 12 + Math.min(rows.length, 14) * 5;
    if (sectionIndex > 0 && currentY + estimatedSectionHeight > 274) {
      doc.addPage();
      currentY = 18;
    } else if (sectionIndex > 0) {
      currentY += 4;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(195, 55, 46);
    doc.text(`${title} (${rows.length})`, 12, currentY);
    currentY += 5;
    doc.setTextColor(36, 33, 20);
    doc.autoTable({
      head: [["Numero", "Libelle FR", "Libelle NL", "Libelle EN", "Item"]],
      body: rows.map((row) => ([
        normalizeImportCell(row.number) || "-",
        normalizeImportCell(row.labelFr) || "-",
        normalizeImportCell(row.labelNl) || "-",
        normalizeImportCell(row.labelEn) || "-",
        normalizeImportCell(row.item) || "-"
      ])),
      startY: currentY,
      margin: { left: 12, right: 12 },
      tableWidth: "auto",
      styles: {
        fontSize: 8,
        cellPadding: { top: 1.6, right: 2, bottom: 1.6, left: 2 },
        overflow: "linebreak",
        lineColor: [224, 218, 199],
        lineWidth: 0.1,
        textColor: [36, 33, 20]
      },
      headStyles: {
        fillColor: [255, 243, 174],
        textColor: [36, 33, 20],
        fontStyle: "bold"
      },
      alternateRowStyles: { fillColor: [255, 253, 246] },
      columnStyles: {
        0: { cellWidth: 22, fontStyle: "bold", halign: "left" },
        1: { cellWidth: 49 },
        2: { cellWidth: 49 },
        3: { cellWidth: 49 },
        4: { cellWidth: 20 }
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(110, 104, 82);
        doc.text(`Page ${pageCount}`, 184, 288);
      }
    });
    currentY = (doc.lastAutoTable?.finalY || currentY) + 8;
  });

  doc.save(`twem-brico-liste-extensions-responsable-${new Date().toISOString().slice(0, 10)}.pdf`);
  recordImportExportHistory("export", "Export liste extensions responsable PDF", `${extensionCatalogRows.length} extension(s) exportee(s).`);
}

async function safeRunExport(action) {
  try {
    await action();
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

  extensionCatalogRows.splice(0, extensionCatalogRows.length, ...rows.map((row, index) => normalizeExtensionCatalogRow(row, index)));
  return;

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

function normalizeSearchText(value) {
  return normalizeImportCell(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesSearchTokens(haystack, search) {
  const normalizedHaystack = normalizeSearchText(haystack);
  const compactHaystack = normalizedHaystack.replace(/\s+/g, "");
  const tokens = normalizeSearchText(search).split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return true;
  }
  return tokens.every((token) => normalizedHaystack.includes(token) || compactHaystack.includes(token));
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
  if (!normalized) {
    return "";
  }
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
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    if (year <= 1970) {
      return "";
    }
    return `${year}-${month}-${day}`;
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

function formatImportedSavTimeValue(value) {
  if (value === null || value === undefined || value === "") {
    return "00:00";
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
  }
  const raw = normalizeImportCell(value);
  if (!raw) {
    return "00:00";
  }
  const numericValue = typeof value === "number"
    ? value
    : (/^\d+(\.\d+)?$/.test(raw) ? Number(raw) : NaN);
  if (Number.isFinite(numericValue) && numericValue > 0 && numericValue < 1) {
    const totalMinutes = Math.round(numericValue * 24 * 60);
    const hours = String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  const parsed = raw.match(/^(\d{1,2})[:h.](\d{2})(?::\d{2})?$/i);
  if (parsed) {
    return `${String(Number(parsed[1])).padStart(2, "0")}:${parsed[2]}`;
  }
  return "00:00";
}

function buildImportedSavTimestamp(dateValue, timeValue) {
  const datePart = formatImportDateValue(dateValue);
  if (!datePart) {
    return new Date().toISOString();
  }
  return `${datePart}T${formatImportedSavTimeValue(timeValue)}:00`;
}

function normalizeImportedSavStatus(value) {
  const raw = normalizeImportCell(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!raw) {
    return "open";
  }
  if (raw.includes("resolu") || raw.includes("cloture") || raw.includes("clos")) {
    return "closed";
  }
  if (raw.includes("cours")) {
    return "in_progress";
  }
  return "open";
}

function normalizeImportedRequestKind(value) {
  const raw = normalizeImportCell(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const matched = storeRequestTypeOptions.find((option) => option.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === raw);
  return matched || normalizeImportCell(value) || "SAV";
}

function normalizeImportStoreCode(value) {
  const raw = normalizeImportCell(value);
  if (!raw) {
    return "";
  }
  const match = raw.match(/\d{4}/);
  return match ? match[0] : raw.replace(/\.0$/, "");
}

function parseSecondaryStoreCodes(value) {
  const raw = normalizeImportCell(value);
  if (!raw) {
    return [];
  }
  return [...new Set((raw.match(/\d{4}/g) || []).map((entry) => entry.trim()).filter(Boolean))];
}

function buildImportedSavMessage(recipients, copies, summary) {
  const parts = [];
  if (normalizeImportCell(recipients)) {
    parts.push(`Envoye a : ${normalizeImportCell(recipients)}`);
  }
  if (normalizeImportCell(copies)) {
    parts.push(`En copie : ${normalizeImportCell(copies)}`);
  }
  if (normalizeImportCell(summary)) {
    parts.push(normalizeImportCell(summary));
  }
  return parts.join("\n\n") || "-";
}

function findStoreByImportCode(code) {
  const normalizedCode = normalizeImportStoreCode(code);
  if (!normalizedCode) {
    return null;
  }
  return state.stores.find((store) => normalizeImportStoreCode(store.shopNumber) === normalizedCode || normalizeImportStoreCode(store.code) === normalizedCode) || null;
}

function importSavHistoryRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("Aucune ligne historique SAV exploitable.");
  }

  const importedTickets = [];
  const secondaryPointerKeys = new Set();
  const secondaryStoreNotes = new Map();
  let currentThread = null;
  let orphanedRows = 0;

  rows.forEach((rawRow, index) => {
    const row = normalizeImportRow(rawRow);
    const importedStatus = normalizeImportCell(readImportValue(row, ["statut"], ""));
    const importedType = normalizeImportCell(readImportValue(row, ["type_de_demande", "type", "typededemande"], ""));
    const primaryStoreCode = normalizeImportStoreCode(readImportValue(row, ["code_magasin", "ref_magasin_principal", "store_nr", "store_code"], ""));
    const secondaryStoreCodes = parseSecondaryStoreCodes(readImportValue(row, ["ref_magasin_secondaire", "refs_magasins_secondaires", "ref_magasin_secondaires"], ""));
    const author = normalizeImportCell(readImportValue(row, ["auteur"], ""));
    const recipients = normalizeImportCell(readImportValue(row, ["envoye_a", "envoye_a_"], ""));
    const copies = normalizeImportCell(readImportValue(row, ["en_copie", "copie", "copies"], ""));
    const summary = normalizeImportCell(readImportValue(row, ["resume", "resume_du_sujet_du_mail", "resume_du_mail"], ""));
    const dateValue = readImportValue(row, ["date"], "");
    const timeValue = readImportValue(row, ["heure"], "");
    const startsNewThread = Boolean(importedStatus || importedType || primaryStoreCode || secondaryStoreCodes.length);
    const lineHasContent = [importedStatus, importedType, primaryStoreCode, author, recipients, copies, summary, normalizeImportCell(String(dateValue || "")), normalizeImportCell(String(timeValue || ""))].some(Boolean);
    if (!lineHasContent) {
      return;
    }

    if (startsNewThread) {
      const store = findStoreByImportCode(primaryStoreCode);
      if (!store) {
        orphanedRows += 1;
        currentThread = null;
        return;
      }
      const createdAt = buildImportedSavTimestamp(dateValue, timeValue);
      const ticket = {
        id: `SAV-HIST-${store.code}-${createdAt.replace(/[^0-9]/g, "").slice(0, 12)}-${index + 1}`,
        storeId: store.id,
        storeCode: store.code,
        storeName: store.name,
        requesterName: author || state.activeUserName || "-",
        targetService: recipients || "-",
        concern: normalizeImportCell(importedType) || "SAV historique",
        initialNote: buildImportedSavMessage(recipients, copies, summary),
        requestKind: normalizeImportedRequestKind(importedType),
        materialLabel: "",
        extensionLabel: "",
        quantityRequested: "",
        orderWorkflowStatus: "",
        status: normalizeImportedSavStatus(importedStatus),
        createdAt,
        updates: []
      };
      importedTickets.push(ticket);
      currentThread = { ticket };

      secondaryStoreCodes.forEach((secondaryCode) => {
        const secondaryStore = findStoreByImportCode(secondaryCode);
        if (!secondaryStore || String(secondaryStore.id) === String(store.id)) {
          return;
        }
        const pointerKey = `${store.code}|${secondaryStore.code}`;
        if (secondaryPointerKeys.has(pointerKey)) {
          return;
        }
        secondaryPointerKeys.add(pointerKey);
        secondaryStoreNotes.set(secondaryStore.id, `Voir SAV magasin ${store.code}`);
      });
      return;
    }

    if (!currentThread?.ticket) {
      orphanedRows += 1;
      return;
    }

    currentThread.ticket.updates.push({
      id: `sav-hist-update-${currentThread.ticket.id}-${currentThread.ticket.updates.length + 1}`,
      authorName: author || currentThread.ticket.requesterName || "-",
      createdAt: buildImportedSavTimestamp(dateValue, timeValue),
      note: buildImportedSavMessage(recipients, copies, summary)
    });
  });

  if (!importedTickets.length) {
    throw new Error("Aucun ticket historique n a pu etre construit depuis ce fichier.");
  }

  secondaryStoreNotes.forEach((note, storeId) => {
    const linkedStore = state.stores.find((store) => String(store.id) === String(storeId));
    if (!linkedStore) {
      return;
    }
    const existing = normalizeImportCell(linkedStore.health || "");
    if (!existing.includes(note)) {
      linkedStore.health = existing ? `${existing}\n${note}` : note;
    }
  });

  state.tickets = importedTickets.filter((ticket) => ticket && ticket.id && ticket.storeId !== undefined && ticket.storeId !== null);
  return {
    importedTickets: importedTickets.length,
    orphanedRows
  };
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
  const matchedStores = [];
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
    matchedStores.push(store);
    store.status = normalizeImportClosureValue(readImportValue(row, ["cloturer"], "")) || "planned";
    store.health = "";
    store.steps = freshImportedSteps();
    store.updatedAt = new Date().toISOString();
    store.ipRange = normalizeImportCell(readImportValue(row, ["ip_range"], store.ipRange || ""));

    store.licenseCount = toImportNumber(readImportValue(row, ["license", "_license", "license_count", "nb_license", "nb_licence"], store.licenseCount || 0));
    store.fixCount = toImportNumber(readImportValue(row, ["fix", "_fix", "nb_fix"], store.fixCount || 0));
    store.mobileCount = toImportNumber(readImportValue(row, ["mobile", "_mobile", "nb_mobile"], store.mobileCount || 0));
    store.callButtonCount = toImportNumber(readImportValue(row, ["call_button", "_call_button", "nb_call_button"], store.callButtonCount || 0));
    store.panicCount = toImportNumber(readImportValue(row, ["panic_button", "_panic_button", "nb_panic_button"], store.panicCount || 0));

    const workflow = ensureStoreWorkflowData(store);
    workflow.currentPhoneDate = formatImportDateValue(readImportValue(row, ["installation_date", "installation_on_date", "install_date"], workflow.currentPhoneDate || ""));
    workflow.collectDate = "";
    workflow.itValidationDate = "";
    workflow.previsitDate = "";
    workflow.transferDate = "";
    workflow.destinyInstallDone = "Non";
    workflow.extensionRequestStatus = "A envoyer";
    workflow.extensionConfigStatus = "En attente";
    workflow.networkConfigConfirmed = false;
    workflow.vlan22Date = formatImportDateValue(readImportValue(row, ["configuration_vlan_22"], workflow.vlan22Date || ""));
    workflow.vlan22Status = workflow.vlan22Date ? "Recue" : (workflow.vlan22Status || "A relancer");
    workflow.mobileOperator = normalizeImportCell(readImportValue(row, ["reseau_mobile"], workflow.mobileOperator || ""));
    workflow.alarmType = normalizeImportCell(readImportValue(row, ["type_d_alarme_pstn_data", "type_dalarme_pstn_data"], workflow.alarmType || "A confirmer"));
    workflow.callFlowNote = normalizeImportCell(readImportValue(row, ["call_flow"], workflow.callFlowNote || ""));
  });

  if (!matchedCount) {
    throw new Error("Aucun Store NR du fichier telephonie ne correspond aux magasins deja importes.");
  }
  return matchedStores;
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
    const shopType = normalizeShopTypeValue(readImportValue(row, ["type_shop", "type_magasin", "shop_type"], "DOS"));
    const shopSize = normalizeImportCell(readImportValue(row, ["shop_type_2", "shopsize", "type_shop_2"], ""));
    const fallbackOwner = twemOptions.includes(state.activeUserName) ? state.activeUserName : "Valou";
    const owner = normalizeImportCell(readImportValue(row, ["owner", "responsable_twem", "twem"], fallbackOwner));
    const manager = normalizeImportCell(readImportValue(row, ["nom_manager", "manager", "responsable_magasin", "responsable"], ""));
    const status = normalizeImportClosureValue(readImportValue(row, ["cloturer"], "")) || "planned";
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
      language: languageFromStoreSheet(readImportValue(row, ["lang"], "")),
      status,
      ipRange: "",
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
        language: storeDraft.language,
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

  const importLabel = state.importMode === "telephony"
    ? "Import telephonie en cours..."
    : state.importMode === "sav-history"
      ? "Import historique SAV en cours..."
    : state.importMode === "extensions"
      ? "Import extensions en cours..."
      : "Import magasins en cours...";
  state.importBusyMessage = `${importLabel} ${file.name}`;
  renderImportExportHistory();

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
      } else if (state.importMode === "sav-history") {
        let importResult = { importedTickets: 0, orphanedRows: 0 };
        if (fileName.endsWith(".json")) {
          const payload = JSON.parse(String(reader.result));
          const rows = Array.isArray(payload) ? payload : (payload.savHistory || payload.rows || []);
          importResult = importSavHistoryRows(rows);
        } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
          importResult = importSavHistoryRows(readWorkbookRows(file, reader.result));
        } else if (fileName.endsWith(".csv")) {
          importResult = importSavHistoryRows(parseDelimitedText(reader.result));
        } else {
          throw new Error("Pour l historique SAV, utilise XLS/XLSX, CSV ou JSON.");
        }
        remoteSyncSuppressed = true;
        try {
          saveState();
          render();
          if (hasRemoteData()) {
            await syncTicketsRemoteState({ delayMs: 900, every: 1 });
            await loadRemoteState();
            refreshRemoteSyncShadow();
          }
          recordImportExportHistory("import", "Import historique SAV", `${file.name} - ${importResult.importedTickets} ticket(s) / ${importResult.orphanedRows} ligne(s) ignoree(s)`);
          saveState();
          render();
          window.alert(`Import historique SAV termine. ${importResult.importedTickets} ticket(s) importes.${importResult.orphanedRows ? ` ${importResult.orphanedRows} ligne(s) ignoree(s).` : ""}`);
        } finally {
          remoteSyncSuppressed = false;
          refreshRemoteSyncShadow();
        }
      } else if (state.importMode === "telephony") {
        let touchedStores = [];
        if (fileName.endsWith(".json")) {
          const payload = JSON.parse(String(reader.result));
          const rows = Array.isArray(payload) ? payload : (payload.telephony || payload.rows || []);
          touchedStores = importTelephonyRows(rows);
        } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
          touchedStores = importTelephonyRows(readWorkbookRows(file, reader.result));
        } else if (fileName.endsWith(".csv")) {
          touchedStores = importTelephonyRows(parseDelimitedText(reader.result));
        } else {
          throw new Error("Pour la telephonie, utilise XLS/XLSX, CSV ou JSON.");
        }
        remoteSyncSuppressed = true;
        try {
          saveState();
          render();
          const syncResult = await syncImportedStateIfPossible("telephony", { stores: touchedStores });
          recordImportExportHistory("import", "Import telephonie", file.name);
          saveState();
          render();
          window.alert(syncResult.missingDatabase
            ? "Import telephonie termine dans l application. La base Appwrite 'twem_brico' n existe pas encore, donc la synchro backend est en attente."
            : "Import telephonie termine.");
        } finally {
          remoteSyncSuppressed = false;
          refreshRemoteSyncShadow();
        }
      } else if (fileName.endsWith(".json")) {
        const payload = JSON.parse(String(reader.result));
        await importJsonData(payload);
        recordImportExportHistory("import", "Import magasins / donnees", file.name);
        window.alert(t("importDone"));
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        importStoresRows(readWorkbookRows(file, reader.result));
        remoteSyncSuppressed = true;
        try {
          saveState();
          render();
          const syncResult = await syncImportedStateIfPossible("stores");
          recordImportExportHistory("import", "Import magasins XLS/XLSX", file.name);
          saveState();
          render();
          window.alert(syncResult.missingDatabase
            ? "Import magasins termine dans l application. La base Appwrite 'twem_brico' n existe pas encore, donc la synchro backend est en attente."
            : "Import magasins termine.");
        } finally {
          remoteSyncSuppressed = false;
          refreshRemoteSyncShadow();
        }
      } else if (fileName.endsWith(".csv")) {
        importStoresRows(parseDelimitedText(reader.result));
        remoteSyncSuppressed = true;
        try {
          saveState();
          render();
          const syncResult = await syncImportedStateIfPossible("stores");
          recordImportExportHistory("import", "Import magasins CSV", file.name);
          saveState();
          render();
          window.alert(syncResult.missingDatabase
            ? "Import magasins termine dans l application. La base Appwrite 'twem_brico' n existe pas encore, donc la synchro backend est en attente."
            : "Import magasins termine.");
        } finally {
          remoteSyncSuppressed = false;
          refreshRemoteSyncShadow();
        }
      } else {
        window.alert("Pour les magasins, utilise XLS/XLSX, CSV ou JSON.");
      }
    } catch (error) {
      window.alert(`${t("importError")}: ${error.message}`);
    } finally {
      state.importBusyMessage = "";
      importInput.value = "";
      state.importMode = "stores";
      renderImportExportHistory();
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
        <div class="card"><strong>${t("summaryNoAppointment")}</strong><div>${stores.filter((store) => !hasPlannedIntervention(store)).length}</div></div>
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
          ${visibleActivitiesForUser().slice(0, 10).map((activity) => `<li>${escapeHtml(activity.storeName)} - ${escapeHtml(activity.comment)} - ${escapeHtml(formatDateTime(activity.createdAt))}</li>`).join("")}
        </ul>
      </div>
    </body>
    </html>
  `;
}

function buildPrintableCurrentListHtml() {
  const stores = getFilteredStores()
    .slice()
    .sort(compareStoresByInterventionDate);
  const generatedAt = new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
  const title = isPlannedInterventionListView() ? "Liste interventions prevues" : "Liste magasins affichee";

  return `
    <!doctype html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(title)}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: Arial, sans-serif; color: #242114; font-size: 10.5px; line-height: 1.3; }
        h1 { margin: 0; font-size: 22px; }
        .meta { margin: 4px 0 14px; color: #6f684d; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ded7c4; padding: 6px 7px; text-align: left; vertical-align: top; }
        th { background: #fff3ae; color: #3b3420; font-size: 10px; text-transform: uppercase; }
        tbody tr:nth-child(even) td { background: #fffdf6; }
        .code { font-weight: 800; white-space: nowrap; }
        .missing { color: #8d2f28; font-weight: 700; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(title)}</h1>
      <div class="meta">${escapeHtml(generatedAt)} - ${stores.length} magasin(s)</div>
      <table>
        <thead>
          <tr>
            <th>Date intervention</th>
            <th>N magasin</th>
            <th>Nom du magasin</th>
            <th>Responsable</th>
            <th>Telephone</th>
            <th>Validations manquantes</th>
          </tr>
        </thead>
        <tbody>
          ${stores.map((store) => {
            const phone = state.people.find((person) => person.name === store.manager)?.phone || store.phone || "";
            const missing = missingValidationLabels(store);
            return `
              <tr>
                <td>${escapeHtml(interventionDateLabel(store) || "-")}</td>
                <td class="code">${escapeHtml(store.code)}</td>
                <td>${escapeHtml(store.name)}</td>
                <td>${escapeHtml(store.manager || "-")}</td>
                <td>${escapeHtml(phone || "-")}</td>
                <td class="missing">${escapeHtml(missing.join(", ") || "OK")}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
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
  if (!workflow?.planPdfDataUrl && !workflow?.planFileId) {
    window.alert("Aucun document n'est enregistre pour ce magasin.");
    return;
  }
  const isZipPlan = /\.zip$/i.test(workflow.planPdfName || "") || workflow.planFileType === "application/zip";
  if (workflow.planFileId) {
    const url = appwriteStorageFileUrl(workflow.planFileId, isZipPlan ? "download" : "view");
    if (!url) {
      window.alert("Impossible de construire le lien Appwrite Storage.");
      return;
    }
    const openedWindow = window.open(url, "_blank");
    if (!openedWindow) {
      window.location.href = url;
    }
    return;
  }
  const blob = dataUrlToBlob(workflow.planPdfDataUrl);
  if (isZipPlan) {
    if (blob) {
      downloadBlob(blob, workflow.planPdfName || `plans-${store?.code || storeId}.zip`);
      return;
    }
    window.alert("Impossible de telecharger ce ZIP.");
    return;
  }
  const pdfWindow = window.open(workflow.planPdfDataUrl, "_blank");
  if (!pdfWindow && blob) {
    downloadBlob(blob, workflow.planPdfName || `plan-${store?.code || storeId}.pdf`);
  } else if (!pdfWindow) {
    window.alert("Impossible d'ouvrir ou de telecharger ce document.");
  }
}

async function handleStorePlanDelete(event) {
  const storeId = Number(event.currentTarget.getAttribute("data-plan-delete"));
  const store = state.stores.find((item) => item.id === storeId);
  if (!store) {
    return;
  }
  const workflow = ensureStoreWorkflowData(store);
  const previousFileId = workflow.planFileId || "";
  const previousBucketId = workflow.planFileBucketId || appwritePlansBucketId;
  workflow.planPdfName = "";
  workflow.planFileType = "";
  workflow.planFileId = "";
  workflow.planFileBucketId = "";
  workflow.planFileSize = "";
  workflow.planPdfDataUrl = "";
  workflow.planPdfUpdatedAt = "";
  store.updatedAt = new Date().toISOString();
  setStoreSaveFeedback(storeId, "Document supprime localement, synchronisation en cours...", "pending");
  saveState();
  renderPreservingScroll();
  if (hasRemoteData()) {
    try {
      if (previousFileId) {
        await deleteAppwriteStorageFile(previousBucketId, previousFileId).catch((error) => {
          console.warn("Document Storage non supprime, reference retiree de la fiche", error);
        });
      }
      await syncStoreToRemote(store, "Suppression du document magasin");
      setStoreSaveFeedback(storeId, "Document supprime et synchronise.", "success");
    } catch (error) {
      console.error("Erreur suppression document magasin", error);
      setStoreSaveFeedback(storeId, "Document supprime localement, mais Appwrite n'a pas confirme la synchro.", "error");
    }
  }
  saveState();
  renderPreservingScroll();
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
  const isPdf = /\.pdf$/i.test(file.name) || file.type === "application/pdf";
  const isZip = /\.zip$/i.test(file.name) || file.type === "application/zip" || file.type === "application/x-zip-compressed";
  if (!isPdf && !isZip) {
    window.alert("Utilise uniquement un fichier PDF ou ZIP pour les plans magasin.");
    input.value = "";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    window.alert("Le document est trop lourd. Garde un fichier inferieur a 10 Mo.");
    input.value = "";
    return;
  }

  setStoreSaveFeedback(storeId, `Import de ${file.name} en cours...`, "pending");
  renderPreservingScroll();
  const reader = new FileReader();
  reader.onload = async () => {
    const workflow = ensureStoreWorkflowData(store);
    const previousFileId = workflow.planFileId || "";
    const previousBucketId = workflow.planFileBucketId || appwritePlansBucketId;
    workflow.planPdfName = file.name;
    workflow.planFileType = isZip ? "application/zip" : "application/pdf";
    workflow.planFileSize = String(file.size || "");
    workflow.planPdfUpdatedAt = new Date().toISOString();
    store.updatedAt = workflow.planPdfUpdatedAt;
    setStoreSaveFeedback(storeId, "Document prepare, envoi vers Appwrite Storage en cours...", "pending");
    saveState();
    renderPreservingScroll();
    if (hasRemoteData() && appwriteStorage && appwritePlansBucketId) {
      try {
        const fileId = safeDocumentId("plan", `${store.code || store.id}-${Date.now()}`);
        await createAppwriteStorageFile(appwritePlansBucketId, fileId, file);
        workflow.planFileId = fileId;
        workflow.planFileBucketId = appwritePlansBucketId;
        workflow.planPdfDataUrl = "";
        if (previousFileId) {
          await deleteAppwriteStorageFile(previousBucketId, previousFileId).catch((error) => {
            console.warn("Ancien document non supprime", error);
          });
        }
        await syncStoreToRemote(store, "Ajout / mise a jour du document magasin");
        setStoreSaveFeedback(storeId, "Document importe et synchronise.", "success");
      } catch (error) {
        console.error("Erreur sync document magasin", error);
        workflow.planFileId = "";
        workflow.planFileBucketId = "";
        workflow.planPdfDataUrl = String(reader.result || "");
        setStoreSaveFeedback(storeId, "Appwrite Storage refuse le document. Verifie que le bucket store-plans existe et accepte PDF/ZIP.", "error");
      }
    } else {
      workflow.planPdfDataUrl = String(reader.result || "");
      setStoreSaveFeedback(storeId, "Document importe localement.", "success");
    }
    saveState();
    renderPreservingScroll();
    input.value = "";
  };
  reader.onerror = () => {
    setStoreSaveFeedback(storeId, "Impossible de lire ce PDF. Essaie de le retelecharger puis de le reinserer.", "error");
    saveState();
    renderPreservingScroll();
    input.value = "";
  };
  reader.readAsDataURL(file);
}

function buildPrintableStoreHtml(store) {
  const workflow = ensureStoreWorkflowData(store);
  const quantityPlan = getStoreQuantityPlan(store);
  const appointments = sortedAppointments(store);
  const tickets = getFilteredTickets().filter((ticket) => ticket.storeId === store.id);
  const networkRows = getNetworkConfigRows(store);
  const gsmRows = getGsmRows(store);
  const planName = workflow.planPdfName || "";
  const storeLanguage = storeLanguageForPrint(store);
  const managerContact = managerContactForStore(store);
  const isNl = storeLanguage === "nl";
  const labels = isNl
    ? {
        fiche: "Winkelfiche verantwoordelijke",
        installDate: "Installatiedatum Destiny",
        verifyPlanning: "Te controleren met de werfplanning voor definitieve afdruk.",
        noInstallDate: "",
        identity: "Identiteit",
        type: "Type",
        size: "Grootte",
        manager: "Manager",
        managerPhone: "Telefoon manager",
        managerEmail: "Mail manager",
        twemOwner: "TWEM verantwoordelijke",
        provenance: "Herkomst",
        currentPhoneDate: "Datum huidige telefonie",
        ipRange: "IP range",
        globalStatus: "Globale status",
        issueNotes: "Probleem / notities",
        quantities: "Telefonie aantallen",
        licences: "Licenties",
        fixed: "Vaste toestellen",
        mobiles: "Mobiele toestellen",
        intervenants: "Intervenanten",
        block: "Blok",
        person: "Persoon",
        noteRole: "Nota / rol",
        noIntervenants: "Geen intervenanten ingevuld.",
        configPrep: "Configuratie en voorbereiding",
        externalPrep: "Externe voorbereiding",
        installation: "Installatie",
        remarks: "Opmerkingen",
        noRemarks: "Geen opmerking.",
        vlan22: "VLAN22",
        switch: "Switch",
        cable: "Kabel",
        antenna: "Antenne",
        central: "Centrale",
        configRequest: "Configuratieaanvraag",
        orderArticles: "Artikelenbestelling",
        logisticComment: "Logistieke opmerking",
        configMail: "Configuratiemail",
        clientNumber: "Klantnummer huidig contract",
        mainNumber: "Huidig hoofdnummer",
        otherNumbers: "Andere nummers",
        configReceived: "Extensieconfiguratie ontvangen",
        destinyTicket: "Destiny ticket",
        destinyCase: "Destiny dossier",
        pmDestiny: "PM Destiny",
        distribution: "Distributie",
        preVisit: "Pre-visit",
        mobileCoverage: "Mobiele dekking",
        vlanConfig: "VLAN22 configuratie",
        vlanActive: "VLAN22 actief",
        alarmByIt: "Alarm beheerd door IT",
        cabling: "Bekabeling",
        chargersSent: "Mobiele laders verzonden",
        chargerCount: "Aantal laders",
        alarmType: "Alarmtype",
        mobileNetwork: "Mobiel netwerk",
        callFlow: "Call flow",
        welcomeMessage: "Welkombericht / IVR",
        otherInstructions: "Andere Brico instructies",
        finalValidation: "Eindvalidatie installatie",
        finalMail: "Finale mail Brico",
        installRemark: "Opmerking installatie Destiny",
        finalRemark: "Finale opmerking Brico",
        platformSwitch: "Switch platform LT",
        storePlan: "Winkelplan PDF",
        networkConfig: "Netwerkconfiguratie",
        category: "Type",
        slot: "Slot",
        assignedExtension: "Toegekende extensie",
        managerNote: "Nota verantwoordelijke",
        writeNote: "De kolom Toegekende extensie is bewust leeg gelaten voor notities ter plaatse.",
        noNetwork: "Geen netwerkconfiguratie ingevuld.",
        gsmSim: "GSM / SIM",
        model: "Model",
        mobileNumber: "Mobiel nummer",
        network: "Netwerk",
        linkedExtension: "Gelinkte extensie",
        user: "Gebruiker",
        callGroup: "Oproepgroep",
        noGsm: "Geen GSM ingevuld.",
        alarmGroups: "Alarm, oproepgroepen en cascades",
        alarmCompany: "Firma",
        alarmCentralPhone: "Tel alarmcentrale",
        other: "Andere",
        callGroups: "Oproepgroepen",
        cascades: "Cascades",
        appointments: "Afspraken",
        date: "Datum",
        status: "Status",
        people: "Personen",
        note: "Nota",
        noAppointments: "Geen afspraak gepland.",
        tickets: "SAV / tickets",
        reference: "Referentie",
        service: "Personen",
        subject: "Onderwerp",
        noTickets: "Geen SAV-ticket."
      }
    : {
        fiche: "Fiche magasin responsable",
        installDate: "Date installation Destiny",
        verifyPlanning: "A verifier avec le planning chantier avant impression finale.",
        noInstallDate: "",
        identity: "Identite",
        type: "Type",
        size: "Taille",
        manager: "Manager",
        managerPhone: "Telephone manager",
        managerEmail: "Mail manager",
        twemOwner: "Responsable TWEM",
        provenance: "Provenance",
        currentPhoneDate: "Date telephonie actuelle",
        ipRange: "IP range",
        globalStatus: "Statut global",
        issueNotes: "Probleme / notes",
        quantities: "Quantites telephonie",
        licences: "Licences",
        fixed: "Postes fixes",
        mobiles: "Mobiles",
        intervenants: "Intervenants",
        block: "Bloc",
        person: "Personne",
        noteRole: "Note / role",
        noIntervenants: "Aucun intervenant renseigne.",
        configPrep: "Configuration et preparation",
        externalPrep: "Preparation externe",
        installation: "Installation",
        remarks: "Remarques",
        noRemarks: "Aucune remarque.",
        vlan22: "VLAN22",
        switch: "Switch",
        cable: "Cable",
        antenna: "Antenne",
        central: "Centrale",
        configRequest: "Demande configuration",
        orderArticles: "Commande articles",
        logisticComment: "Commentaire logistique",
        configMail: "Mail configuration",
        clientNumber: "N client contrat actuel",
        mainNumber: "Numero principal actuel",
        otherNumbers: "Autres numeros releves",
        configReceived: "Configuration extensions recue",
        destinyTicket: "Ticket Destiny",
        destinyCase: "Dossier Destiny",
        pmDestiny: "PM Destiny",
        distribution: "Diffusion",
        preVisit: "Pre-visite",
        mobileCoverage: "Couverture mobile",
        vlanConfig: "Configuration VLAN22",
        vlanActive: "VLAN22 active",
        alarmByIt: "Alarme geree par IT",
        cabling: "Cablage",
        chargersSent: "Chargeurs mobiles envoyes",
        chargerCount: "Nombre chargeurs",
        alarmType: "Type alarme",
        mobileNetwork: "Reseau mobile",
        callFlow: "Call flow",
        welcomeMessage: "Message accueil / IVR",
        otherInstructions: "Autres consignes Brico",
        finalValidation: "Validation finale installation",
        finalMail: "Mail final Brico",
        installRemark: "Remarque installation Destiny",
        finalRemark: "Remarque finale Brico",
        platformSwitch: "Switch plateforme LT",
        storePlan: "Plan magasin PDF",
        networkConfig: "Configuration du reseau",
        category: "Type",
        slot: "Slot",
        assignedExtension: "Extension attribuee",
        managerNote: "Note responsable",
        writeNote: "La colonne Extension attribuee est volontairement vide pour annotation sur site.",
        noNetwork: "Aucune configuration reseau renseignee.",
        gsmSim: "GSM / SIM",
        model: "Modele",
        mobileNumber: "Numero mobile",
        network: "Reseau",
        linkedExtension: "Extension liee",
        user: "Utilisateur",
        callGroup: "Groupe appel",
        noGsm: "Aucun GSM renseigne.",
        alarmGroups: "Alarme, groupes d appel et cascades",
        alarmCompany: "Societe",
        alarmCentralPhone: "Tel centrale alarme",
        other: "Autres",
        callGroups: "Groupes d appel",
        cascades: "Cascades",
        appointments: "Rendez-vous",
        date: "Date",
        status: "Statut",
        people: "Personnes",
        note: "Note",
        noAppointments: "Aucun rendez-vous planifie.",
        tickets: "SAV / tickets",
        reference: "Reference",
        service: "Personnes",
        subject: "Sujet",
        noTickets: "Aucun ticket SAV."
      };
  const printableValue = (value, emptyLabel = "") => {
    const normalized = String(value ?? "").trim();
    const placeholderValues = new Set([
      "a confirmer",
      "a renseigner",
      "a envoyer",
      "a planifier",
      "a verifier",
      "a choisir",
      "en attente",
      "pas de date",
      "non renseigne",
      "te bevestigen",
      "in te vullen",
      "te versturen",
      "te plannen",
      "te controleren",
      "te kiezen",
      "in afwachting"
    ]);
    const normalizedPlaceholder = normalized
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (placeholderValues.has(normalizedPlaceholder)) {
      return emptyLabel;
    }
    return normalized ? normalized : emptyLabel;
  };
  const printableRemarkList = (remarks = []) => Array.isArray(remarks) && remarks.length
    ? `
      <ul class="remark-list">
        ${remarks.slice().reverse().map((remark) => `
          <li><strong>${escapeHtml(formatDateTime(remark.createdAt))} - ${escapeHtml(remark.author || "-")}</strong><br>${escapeHtml(remark.text || "-")}</li>
        `).join("")}
      </ul>
    `
    : `<div class="muted">${escapeHtml(labels.noRemarks)}</div>`;
  const installDate = printableValue(workflow.destinyInstallDate, labels.noInstallDate);
  const hasInstallDate = Boolean(String(workflow.destinyInstallDate || "").trim());

  return `
    <!doctype html>
    <html lang="${storeLanguage}">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(labels.fiche)} - ${escapeHtml(store.name)}</title>
      <style>
        @page { margin: 12mm; }
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #242114; padding: 0; font-size: 11.5px; line-height: 1.35; background: #fff; }
        h1, h2, h3 { margin: 0 0 8px; }
        .hero { background: #ffde3b; border: 1px solid #d9bd2f; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
        .eyebrow { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #7a3a2f; margin-bottom: 4px; }
        .hero h1 { font-size: 22px; line-height: 1.05; }
        .meta { color: #5c553c; margin-top: 5px; }
        .install-banner { border: 3px solid #c3372e; background: #fff3ae; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; display: flex; justify-content: space-between; gap: 14px; align-items: center; break-inside: avoid; box-shadow: inset 0 -3px 0 rgba(195,55,46,0.12); }
        .install-banner .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800; color: #7a3a2f; }
        .install-banner .date { font-size: 34px; line-height: 1; font-weight: 900; color: #242114; margin-top: 4px; }
        .install-banner.is-missing { border-color: #e0dac7; background: #fffdf6; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
        .card { border: 1px solid #e0dac7; border-radius: 10px; padding: 12px; break-inside: avoid; background: #fffefa; }
        .full { grid-column: 1 / -1; }
        .card h3 { color: #c3372e; font-size: 13px; border-bottom: 2px solid #fff3ae; padding-bottom: 5px; margin-bottom: 9px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e0dac7; padding: 5px 7px; text-align: left; vertical-align: top; }
        th { background: #fff3ae; color: #3b3420; font-size: 10.5px; }
        tbody tr:nth-child(even) td { background: #fffdf6; }
        .muted { color: #6f684d; }
        .write-cell { height: 22px; background: #fff !important; }
        .write-cell::after { content: ""; display: block; border-bottom: 1px solid #b9b196; margin-top: 12px; }
        .network-table th:nth-child(1), .network-table td:nth-child(1) { width: 24%; }
        .network-table th:nth-child(2), .network-table td:nth-child(2) { width: 22%; }
        .network-table th:nth-child(3), .network-table td:nth-child(3) { width: 32%; }
        .network-table th:nth-child(4), .network-table td:nth-child(4) { width: 22%; }
        .install-table { table-layout: fixed; }
        .install-table th, .install-table td { width: 25%; }
        .print-note { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: #fff3ae; color: #5c553c; font-size: 10.5px; }
        .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .status-box-print { border: 1px solid #e0dac7; border-radius: 8px; padding: 8px; background: #fff; }
        .status-box-print strong { display: block; color: #7a3a2f; margin-bottom: 4px; }
        .print-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 10px; }
        .print-info-item { border: 1px solid #e0dac7; border-radius: 8px; padding: 8px; background: #fff; }
        .print-info-item strong { display: block; color: #7a3a2f; margin-bottom: 4px; }
        .print-info-item.full { grid-column: 1 / -1; }
        .remark-list { margin: 6px 0 0; padding-left: 16px; }
        .remark-list li { margin-bottom: 6px; }
      </style>
    </head>
    <body>
      <section class="hero">
        <div class="eyebrow">TWEM x Brico - ${escapeHtml(labels.fiche)}</div>
        <h1>${escapeHtml(store.name)}</h1>
        <div class="meta">${escapeHtml([store.code, store.city, store.address].map(printableValue).filter(Boolean).join(" - "))}</div>
      </section>
      <section class="install-banner ${hasInstallDate ? "" : "is-missing"}">
        <div>
          <div class="label">${escapeHtml(labels.installDate)}</div>
          <div class="date">${escapeHtml(installDate)}</div>
        </div>
        <div class="muted">${escapeHtml(labels.verifyPlanning)}</div>
      </section>
      <div class="grid">
        <div class="card">
          <h3>${escapeHtml(labels.identity)}</h3>
          <div><strong>${escapeHtml(labels.type)}</strong> ${escapeHtml(printableValue(store.shopType))}</div>
          <div><strong>${escapeHtml(labels.size)}</strong> ${escapeHtml(printableValue(store.shopSize))}</div>
          <div><strong>${escapeHtml(labels.manager)}</strong> ${escapeHtml(printableValue(managerContact.name || store.manager))}</div>
          <div><strong>${escapeHtml(labels.managerPhone)}</strong> ${escapeHtml(printableValue(managerContact.phone))}</div>
          <div><strong>${escapeHtml(labels.managerEmail)}</strong> ${escapeHtml(printableValue(managerContact.email))}</div>
          <div><strong>${escapeHtml(labels.twemOwner)}</strong> ${escapeHtml(printableValue(store.owner))}</div>
          <div><strong>${escapeHtml(labels.provenance)}</strong> ${escapeHtml(storeProvenance(store))}</div>
          <div><strong>${escapeHtml(labels.currentPhoneDate)}</strong> ${escapeHtml(printableValue(workflow.currentPhoneDate))}</div>
          <div><strong>${escapeHtml(labels.ipRange)}</strong> ${escapeHtml(printableValue(store.ipRange))}</div>
          <div><strong>${escapeHtml(labels.globalStatus)}</strong> ${escapeHtml(textForLanguage(store.status, storeLanguage))}</div>
          <div><strong>${escapeHtml(labels.issueNotes)}</strong> ${escapeHtml(printableValue(store.health))}</div>
        </div>
        <div class="card">
          <h3>${escapeHtml(labels.quantities)}</h3>
          <div><strong>${escapeHtml(labels.licences)}</strong> ${quantityPlan.licenseCount}</div>
          <div><strong>${escapeHtml(labels.fixed)}</strong> ${quantityPlan.fixCount}</div>
          <div><strong>Fix big</strong> ${quantityPlan.fixBigCount}</div>
          <div><strong>${escapeHtml(labels.mobiles)}</strong> ${quantityPlan.mobileCount}</div>
          <div><strong>Mobile smartphone</strong> ${quantityPlan.mobileSmartphoneCount}</div>
          <div><strong>Flash light</strong> ${quantityPlan.flashLightCount}</div>
          <div><strong>Call buttons</strong> ${quantityPlan.callButtonCount}</div>
          <div><strong>Panic buttons</strong> ${quantityPlan.panicCount}</div>
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.externalPrep)}</h3>
          <div class="status-grid">
            <div class="status-box-print"><strong>${escapeHtml(labels.mobileCoverage)}</strong>${escapeHtml(printableValue(workflow.mobileCoverage))}</div>
            <div class="status-box-print"><strong>${escapeHtml(labels.vlan22)}</strong>${escapeHtml(printableValue(workflow.vlan22Activated))}<br>${escapeHtml(printableValue(workflow.vlan22Date))}</div>
            <div class="status-box-print"><strong>${escapeHtml(labels.cabling)}</strong>${escapeHtml(printableValue(workflow.cablingStatus))}<br>${escapeHtml(printableValue(workflow.cablingDate))}</div>
            <div class="status-box-print"><strong>${escapeHtml(labels.switch)}</strong>${escapeHtml(printableValue(workflow.ltSwitchStatus))}<br>${escapeHtml(printableValue(workflow.ltSwitchDate || workflow.transferDate))}</div>
          </div>
          <h3 style="margin-top: 12px;">${escapeHtml(labels.remarks)}</h3>
          ${printableRemarkList(workflow.externalPrepRemarks)}
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.installation)}</h3>
          <table class="install-table">
            <tbody>
              <tr><th>${escapeHtml(labels.installDate)}</th><td>${escapeHtml(hasInstallDate ? installDate : "")}</td><th>${escapeHtml(labels.destinyTicket)}</th><td>${escapeHtml(printableValue(workflow.destinyTicketRef))}</td></tr>
              <tr><th>${escapeHtml(labels.switch)}</th><td>${escapeHtml(printableValue(workflow.installSwitchDate))}</td><th>${escapeHtml(labels.cable)}</th><td>${escapeHtml(printableValue(workflow.installCableDate))}</td></tr>
              <tr><th>${escapeHtml(labels.antenna)}</th><td>${escapeHtml(printableValue(workflow.installAntennaDate))}</td><th>${escapeHtml(labels.central)}</th><td>${escapeHtml(printableValue(workflow.installCentralDate))}</td></tr>
            </tbody>
          </table>
          <h3 style="margin-top: 12px;">${escapeHtml(labels.remarks)}</h3>
          ${printableRemarkList(workflow.installationRemarks)}
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.configPrep)}</h3>
          <table>
            <tbody>
              <tr><th>${escapeHtml(labels.configRequest)}</th><td>${escapeHtml(printableValue(workflow.configStatus))}</td><th>${escapeHtml(labels.orderArticles)}</th><td>${escapeHtml(printableValue(workflow.orderStatus))}</td></tr>
              <tr><th>${escapeHtml(labels.logisticComment)}</th><td>${escapeHtml(printableValue(workflow.orderNote))}</td><th>${escapeHtml(labels.configMail)}</th><td>${escapeHtml(printableValue(workflow.extensionRequestStatus))}</td></tr>
              <tr><th>${escapeHtml(labels.clientNumber)}</th><td>${escapeHtml(printableValue(workflow.currentContractClientNumber))}</td><th>${escapeHtml(labels.mainNumber)}</th><td>${escapeHtml(printableValue(workflow.currentContractMainNumber))}</td></tr>
              <tr><th>${escapeHtml(labels.otherNumbers)}</th><td colspan="3">${escapeHtml(printableValue(workflow.currentContractOtherNumbers))}</td></tr>
              <tr><th>${escapeHtml(labels.configReceived)}</th><td>${escapeHtml(printableValue(workflow.extensionConfigStatus))}</td><th>${escapeHtml(labels.storePlan)}</th><td>${escapeHtml(printableValue(planName))}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.networkConfig)}</h3>
          ${networkRows.length ? `
            <table class="network-table">
              <thead><tr><th>${escapeHtml(labels.category)}</th><th>${escapeHtml(labels.slot)}</th><th>${escapeHtml(labels.assignedExtension)}</th><th>${escapeHtml(labels.managerNote)}</th></tr></thead>
              <tbody>
                ${networkRows.map((row) => `
                  <tr>
                    <td>${escapeHtml(row.category)}</td>
                    <td>${escapeHtml(printableValue(row.slotLabel))}</td>
                    <td>${escapeHtml(printableValue(row.extensionLabel))}</td>
                    <td>${escapeHtml(row.note || "")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">${escapeHtml(labels.noNetwork)}</div>`}
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.gsmSim)}</h3>
          ${gsmRows.length ? `
            <table>
              <thead><tr><th>${escapeHtml(labels.model)}</th><th>${escapeHtml(labels.mobileNumber)}</th><th>${escapeHtml(labels.network)}</th><th>ICCID</th><th>PUK</th><th>${escapeHtml(labels.linkedExtension)}</th><th>${escapeHtml(labels.user)}</th><th>${escapeHtml(labels.callGroup)}</th></tr></thead>
              <tbody>
                ${gsmRows.map((row) => `
                  <tr>
                    <td>${escapeHtml(printableValue(row.model))}</td>
                    <td>${escapeHtml(printableValue(row.mobileNumber))}</td>
                    <td>${escapeHtml(printableValue(row.mobileNetwork))}</td>
                    <td>${escapeHtml(printableValue(row.iccid))}</td>
                    <td>${escapeHtml(printableValue(row.puk))}</td>
                    <td>${escapeHtml(printableValue(row.extensionLinked))}</td>
                    <td>${escapeHtml(printableValue(row.user))}</td>
                    <td>${escapeHtml(printableValue(row.callGroup))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">${escapeHtml(labels.noGsm)}</div>`}
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.alarmGroups)}</h3>
          <div class="print-info-grid">
            <div class="print-info-item"><strong>${escapeHtml(labels.alarmType)}</strong>${escapeHtml(printableValue(workflow.alarmType))}</div>
            <div class="print-info-item"><strong>${escapeHtml(labels.alarmCompany)}</strong>${escapeHtml(printableValue(workflow.alarmCompany))}</div>
            <div class="print-info-item"><strong>${escapeHtml(labels.alarmCentralPhone)}</strong>${escapeHtml(printableValue(workflow.alarmCentralPhone))}</div>
            <div class="print-info-item"><strong>${escapeHtml(labels.other)}</strong>${escapeHtml(printableValue(workflow.alarmOther))}</div>
            <div class="print-info-item full"><strong>${escapeHtml(labels.callGroups)}</strong>${escapeHtml(printableValue(workflow.callGroupsNote))}</div>
            <div class="print-info-item full"><strong>${escapeHtml(labels.cascades)}</strong>${escapeHtml(printableValue(workflow.cascadeNote))}</div>
          </div>
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.appointments)}</h3>
          ${appointments.length ? `
            <table>
              <thead><tr><th>${escapeHtml(labels.date)}</th><th>${escapeHtml(labels.status)}</th><th>${escapeHtml(labels.people)}</th><th>${escapeHtml(labels.note)}</th></tr></thead>
              <tbody>
                ${appointments.map((appointment) => `
                  <tr>
                    <td>${escapeHtml(formatDateTime(appointment.datetime))}</td>
                    <td>${escapeHtml(printableValue(appointment.status))}</td>
                    <td>${escapeHtml(peopleLabel(appointment.people))}</td>
                    <td>${escapeHtml(printableValue(appointment.note))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">${escapeHtml(labels.noAppointments)}</div>`}
        </div>
        <div class="card full">
          <h3>${escapeHtml(labels.tickets)}</h3>
          ${tickets.length ? `
            <table>
              <thead><tr><th>${escapeHtml(labels.reference)}</th><th>${escapeHtml(labels.service)}</th><th>${escapeHtml(labels.type)}</th><th>${escapeHtml(labels.subject)}</th><th>${escapeHtml(labels.status)}</th><th>${escapeHtml(labels.date)}</th></tr></thead>
              <tbody>
                ${tickets.map((ticket) => `
                  <tr>
                    <td>${escapeHtml(ticket.id)}</td>
                    <td>${escapeHtml(printableValue(ticketTargetLabel(ticket)))}</td>
                    <td>${escapeHtml(printableValue(ticket.requestKind || "SAV"))}</td>
                    <td>${escapeHtml(printableValue(ticket.concern))}</td>
                    <td>${escapeHtml(ticketStatusLabel(ticket.status, storeLanguage))}</td>
                    <td>${escapeHtml(formatDateTime(ticket.createdAt))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">${escapeHtml(labels.noTickets)}</div>`}
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

function handlePrintCurrentListClick() {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.alert(t("reportWindowError"));
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildPrintableCurrentListHtml());
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
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
    extensionLabel: form.querySelector(`[name="network_extension_${row.id}"]`)?.value || row.extensionLabel || defaultNetworkExtensionForRow(row) || "",
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

function appendWorkflowRemark(workflow, key, text) {
  const cleanText = normalizeImportCell(text);
  if (!cleanText) {
    return;
  }
  if (!Array.isArray(workflow[key])) {
    workflow[key] = [];
  }
  workflow[key].push({
    id: `remark-${Date.now()}-${workflow[key].length}`,
    text: cleanText,
    author: currentUser()?.name || state.activeUserName || "TWEM",
    createdAt: new Date().toISOString()
  });
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
  setStoreSaveFeedback(storeId, "Sauvegarde en cours...", "pending");
  const workflow = ensureStoreWorkflowData(store);
  store.owner = form.querySelector('[name="owner"]')?.value || store.owner || "";
  store.manager = form.querySelector('[name="manager"]')?.value.trim() || store.manager || "";
  store.shopType = normalizeShopTypeValue(form.querySelector('[name="shop_type"]')?.value || store.shopType || "DOS");
  store.status = globalStatus;
  store.health = health;
  store.updatedAt = new Date().toISOString();
  const quantityInputsPresent = form.querySelector('[name="license_count"]')
    || form.querySelector('[name="fix_count"]')
    || form.querySelector('[name="mobile_count"]');
  if (isAdminTwem() && quantityInputsPresent) {
    store.licenseCount = Math.max(0, Number(form.querySelector('[name="license_count"]')?.value) || 0);
    store.fixCount = Math.max(0, Number(form.querySelector('[name="fix_count"]')?.value) || 0);
    store.fixBigCount = Math.max(0, Number(form.querySelector('[name="fix_big_count"]')?.value) || 0);
    store.mobileCount = Math.max(0, Number(form.querySelector('[name="mobile_count"]')?.value) || 0);
    store.mobileSmartphoneCount = Math.max(0, Number(form.querySelector('[name="mobile_smartphone_count"]')?.value) || 0);
    store.flashLightCount = Math.max(0, Number(form.querySelector('[name="flash_light_count"]')?.value) || 0);
    store.callButtonCount = Math.max(0, Number(form.querySelector('[name="call_button_count"]')?.value) || 0);
    store.panicCount = Math.max(0, Number(form.querySelector('[name="panic_count"]')?.value) || 0);
    reconcileNetworkRowsWithQuantities(store);
    reconcileGsmRowsWithQuantities(store);
  }

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
  workflow.currentContractClientNumber = form.querySelector('[name="current_contract_client_number"]')?.value.trim() || "";
  workflow.currentContractMainNumber = form.querySelector('[name="current_contract_main_number"]')?.value.trim() || "";
  workflow.currentContractOtherNumbers = form.querySelector('[name="current_contract_other_numbers"]')?.value.trim() || "";
  workflow.destinyPmName = form.querySelector('[name="destiny_pm_name"]')?.value.trim() || "";
  workflow.destinyPmEmail = form.querySelector('[name="destiny_pm_email"]')?.value.trim() || "";
  workflow.destinyTicketRef = form.querySelector('[name="destiny_ticket_ref"]')?.value.trim() || "";
  workflow.destinyCaseRef = form.querySelector('[name="destiny_case_ref"]')?.value.trim() || "";
  workflow.destinyDistribution = form.querySelector('[name="destiny_distribution"]')?.value.trim() || "";
  workflow.networkSurveyStatus = form.querySelector('[name="network_survey_status"]')?.value || workflow.networkSurveyStatus;
  workflow.mobileCoverage = form.querySelector('[name="mobile_coverage"]')?.value || workflow.mobileCoverage;
  workflow.firstVisitRemark = form.querySelector('[name="first_visit_remark"]')?.value.trim() || workflow.firstVisitRemark || "";
  workflow.extensionRequestStatus = form.querySelector('[name="extension_request_status"]')?.value || workflow.extensionRequestStatus;
  workflow.extensionConfigStatus = form.querySelector('[name="extension_config_status"]')?.value || workflow.extensionConfigStatus;
  workflow.ivrNotes = form.querySelector('[name="ivr_notes"]')?.value.trim() || "";
  workflow.greetingNotes = form.querySelector('[name="greeting_notes"]')?.value.trim() || "";
  workflow.alarmHandledByIt = form.querySelector('[name="alarm_handled_by_it"]')?.value || workflow.alarmHandledByIt;
  workflow.vlan22Status = form.querySelector('[name="vlan22_status"]')?.value || workflow.vlan22Status;
  workflow.vlan22Date = form.querySelector('[name="vlan22_date"]')?.value || "";
  const vlanValue = form.querySelector('[name="vlan22_activated"]')?.value || workflow.vlan22Activated;
  workflow.vlan22Activated = workflow.vlan22Date ? "Oui" : (vlanValue === "OK" ? "Oui" : vlanValue);
  workflow.charlesRouxStatus = form.querySelector('[name="charles_roux_status"]')?.value || workflow.charlesRouxStatus;
  workflow.cablingStatus = form.querySelector('[name="cabling_status"]')?.value || workflow.cablingStatus;
  workflow.cablingDate = form.querySelector('[name="cabling_date"]')?.value || "";
  workflow.mobileChargersSent = form.querySelector('[name="mobile_chargers_sent"]')?.value || workflow.mobileChargersSent;
  workflow.mobileChargerCount = form.querySelector('[name="mobile_charger_count"]')?.value || workflow.mobileChargerCount;
  workflow.destinyInstallDone = form.querySelector('[name="destiny_install_done"]')?.value || workflow.destinyInstallDone;
  workflow.destinyInstallRemark = form.querySelector('[name="destiny_install_remark"]')?.value.trim() || "";
  workflow.bricoFinalMailStatus = form.querySelector('[name="brico_final_mail_status"]')?.value || workflow.bricoFinalMailStatus;
  workflow.bricoFinalRemark = form.querySelector('[name="brico_final_remark"]')?.value.trim() || "";
  const preparationSwitchField = form.querySelector('[name="lt_switch_preparation_status"]');
  const closureSwitchField = form.querySelector('[name="lt_switch_status"]');
  const switchValue = form.dataset.storeMode === "configuration"
    ? (preparationSwitchField?.value || closureSwitchField?.value || workflow.ltSwitchStatus)
    : (closureSwitchField?.value || preparationSwitchField?.value || workflow.ltSwitchStatus);
  workflow.ltSwitchStatus = switchValue === "OK" ? "Basculee" : switchValue;
  workflow.ltSwitchDate = form.querySelector('[name="lt_switch_date"]')?.value || workflow.ltSwitchDate || "";
  workflow.networkSurveyStatus = externalPrepStatusLabel(workflow);
  workflow.installSwitchDate = form.querySelector('[name="install_switch_date"]')?.value || "";
  workflow.installCableDate = form.querySelector('[name="install_cable_date"]')?.value || "";
  workflow.installAntennaDate = form.querySelector('[name="install_antenna_date"]')?.value || "";
  workflow.installCentralDate = form.querySelector('[name="install_central_date"]')?.value || "";
  appendWorkflowRemark(workflow, "externalPrepRemarks", form.querySelector('[name="external_prep_new_note"]')?.value || "");
  appendWorkflowRemark(workflow, "installationRemarks", form.querySelector('[name="installation_new_note"]')?.value || "");
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

  const updateActivity = {
    id: `edit-${Date.now()}`,
    storeId: store.id,
    storeCode: store.code,
    storeName: store.name,
    result: store.status === "blocked" ? "issue" : "ok",
    comment: `Mise a jour magasin - statut ${statusLabel(store.status)}`,
    confirmedBy: state.activeUserName,
    createdAt: new Date().toISOString(),
    alertQueuedAt: new Date().toISOString()
  };
  state.activities.unshift(updateActivity);

  saveState();
  if (hasRemoteData()) {
    try {
      await syncStoreToRemote(store, `Mise a jour magasin - statut ${statusLabel(store.status)}`);
      setStoreSaveFeedback(storeId, `Sauvegarde Appwrite OK a ${new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}`, "success");
    } catch (error) {
      console.error("Erreur sauvegarde Appwrite magasin", error);
      setStoreSaveFeedback(storeId, "Garde localement, erreur Appwrite. Ne refresh pas tout de suite.", "error");
    }
  } else {
    setStoreSaveFeedback(storeId, `Sauvegarde locale OK a ${new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}`, "success");
  }
  clearStoreEditorDirty(storeId);
  if (form.dataset.storeMode !== "configuration") {
    state.expandedStoreIds.delete(storeId);
  }
  renderPreservingScroll();
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
  const targetPeople = [];
  const targetService = "TWEM a dispatcher";
  const requestKind = form.querySelector('[name="new_ticket_kind"]')?.value || "SAV";
  const materialLabel = form.querySelector('[name="new_ticket_material"]')?.value || "";
  const extensionLabel = form.querySelector('[name="new_ticket_extension"]')?.value || "";
  const quantityRequested = Number(form.querySelector('[name="new_ticket_quantity"]')?.value || 1) || 1;
  const orderWorkflowStatus = form.querySelector('[name="new_ticket_order_status"]')?.value || "Demande creee";
  const resolvedConcern = concern || (
    requestKind === "Commande materiel casse"
      ? `Materiel casse - ${materialLabel || "a preciser"}`
      : requestKind === "Commande materiel supplementaire"
        ? `Commande materiel supplementaire - ${materialLabel || "a preciser"}`
        : requestKind
  );
  if (!resolvedConcern || !initialNote) {
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
    targetPeople,
    concern: resolvedConcern,
    initialNote,
    requestKind,
    materialLabel,
    extensionLabel,
    quantityRequested,
    orderWorkflowStatus,
    status: "dispatch",
    dispatchStatus: "pending_twem",
    receivedByTwemAt: now,
    createdAt: now,
    updates: []
  };

  state.tickets.unshift(ticket);
  state.activities.unshift({
    id: `sav-create-${Date.now()}`,
    storeId: store.id,
    storeCode: store.code,
    storeName: store.name,
    result: "issue",
    comment: `Creation ${requestKind} ${resolvedConcern} - a dispatcher par TWEM`,
    confirmedBy: ticket.requesterName,
    createdAt: now
  });

  form.querySelector('[name="new_ticket_concern"]').value = "";
  form.querySelector('[name="new_ticket_note"]').value = "";
  form.querySelectorAll('[name="new_ticket_people"]:checked').forEach((field) => {
    field.checked = false;
  });
  form.querySelector('[name="new_ticket_kind"]').value = "SAV";
  form.querySelector('[name="new_ticket_material"]').value = "";
  form.querySelector('[name="new_ticket_extension"]').value = "";
  form.querySelector('[name="new_ticket_quantity"]').value = "1";
  form.querySelector('[name="new_ticket_order_status"]').value = "Demande creee";
  if (feedback) {
    feedback.textContent = "Ticket SAV cree et transmis a TWEM pour dispatch.";
  }
  if (hasRemoteData()) {
    await syncSavStateToRemote();
  }
  saveState();
  render();
}

async function handleSavDispatch(event) {
  const button = event.currentTarget;
  const ticketId = button.getAttribute("data-sav-dispatch");
  const ticket = state.tickets.find((entry) => entry.id === ticketId);
  const form = button.closest("[data-store-editor]");
  if (!ticket || !form || !canDispatchSav()) {
    return;
  }

  const selectedPeople = [...form.querySelectorAll(`[name="ticket_dispatch_people_${ticketId}"]:checked`)]
    .map((field) => normalizeImportCell(field.value))
    .filter(Boolean);
  const note = form.querySelector(`[name="ticket_dispatch_note_${ticketId}"]`)?.value.trim() || "";
  if (!selectedPeople.length) {
    window.alert("Choisis au moins une personne pour dispatcher le SAV.");
    return;
  }

  const now = new Date().toISOString();
  ticket.targetPeople = [...new Set(selectedPeople)];
  ticket.targetService = ticket.targetPeople.join(", ");
  ticket.dispatchStatus = "assigned";
  ticket.dispatchedAt = now;
  ticket.dispatchedBy = currentUser()?.name || state.activeUserName || "TWEM";
  if (["new", "dispatch", "open"].includes(ticket.status)) {
    ticket.status = "assigned";
  }
  ticket.updates = Array.isArray(ticket.updates) ? ticket.updates : [];
  ticket.updates.push({
    id: `${ticket.id}-dispatch-${Date.now()}`,
    authorName: ticket.dispatchedBy,
    createdAt: now,
    note: `Dispatch TWEM vers ${ticket.targetService}.${note ? ` ${note}` : ""}`
  });

  state.activities.unshift({
    id: `sav-dispatch-${Date.now()}`,
    storeId: state.stores.find((store) => store.code === ticket.storeCode || store.name === ticket.storeName)?.id || "",
    storeCode: ticket.storeCode || "",
    storeName: ticket.storeName,
    result: "issue",
    comment: `SAV assigne a ${ticket.targetService} - ${ticket.concern}`,
    confirmedBy: ticket.dispatchedBy,
    createdAt: now,
    alertQueuedAt: now
  });

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
    storeId: state.stores.find((store) => store.code === ticket.storeCode || store.name === ticket.storeName)?.id || "",
    storeCode: ticket.storeCode || "",
    storeName: ticket.storeName,
    result: ticket.status === "closed" ? "ok" : "issue",
    comment: `Suivi SAV ${ticket.concern} - ${ticketStatusLabel(ticket.status)}`,
    confirmedBy: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString(),
    alertQueuedAt: new Date().toISOString()
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
    storeId: state.stores.find((store) => store.code === ticket.storeCode || store.name === ticket.storeName)?.id || "",
    storeCode: ticket.storeCode || "",
    storeName: ticket.storeName,
    result: nextStatus === "closed" ? "ok" : "issue",
    comment: `Ticket SAV ${nextStatus === "closed" ? "cloture" : "reouvert"} - ${ticket.concern}`,
    confirmedBy: currentUser()?.name || state.activeUserName || "-",
    createdAt: new Date().toISOString(),
    alertQueuedAt: new Date().toISOString()
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

async function syncInvoiceTicketToRemote(ticket) {
  if (!hasRemoteData()) {
    return;
  }
  if (supabaseClient) {
    await syncAllRemoteState();
    return;
  }
  if (!hasAppwriteDataConfig) {
    return;
  }
  await upsertAppwriteDocument(
    appwriteTicketsCollectionId,
    ticketRemoteSyncKey(ticket),
    buildAppwriteTicketDocument(ticket)
  );
}

async function handleInvoiceFieldChange(event) {
  const field = event.currentTarget.getAttribute("data-invoice-field");
  const wrapper = event.currentTarget.closest("[data-invoice-ticket]");
  const ticketId = wrapper?.getAttribute("data-invoice-ticket");
  const ticket = state.tickets.find((entry) => entry.id === ticketId);
  if (!field || !ticket) {
    return;
  }
  const nextValue = event.currentTarget.value;
  if (String(ticket[field] || "") === String(nextValue || "")) {
    return;
  }

  ticket[field] = nextValue;
  if (field === "invoiceOrderStatus") {
    ticket.orderWorkflowStatus = nextValue;
  }
  ticket.updatedAt = new Date().toISOString();
  saveState();

  try {
    await syncInvoiceTicketToRemote(ticket);
    event.currentTarget.classList.remove("is-save-error");
  } catch (error) {
    console.error("Invoice ticket sync error", error);
    event.currentTarget.classList.add("is-save-error");
  }
}

function attachInvoiceHandlers() {
  projectTableBody.querySelectorAll("[data-invoice-field]").forEach((field) => {
    field.addEventListener("change", handleInvoiceFieldChange);
  });
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
  return tabs.find((tab) => tab !== "dashboard") || tabs[0] || "dashboard";
}

function tutorialSeenKeyForUser(user = currentUser()) {
  return String(user?.id || user?.email || user?.name || "").toLowerCase();
}

function shouldOpenTutorialOnLogin(user) {
  const key = tutorialSeenKeyForUser(user);
  return Boolean(key && canAccessTab("tuto", user) && !state.tutorialSeenByUser?.[key]);
}

function markTutorialSeenForUser(user) {
  const key = tutorialSeenKeyForUser(user);
  if (!key) return;
  state.tutorialSeenByUser ||= {};
  state.tutorialSeenByUser[key] = new Date().toISOString();
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

  matchedPerson.loginHistory = [{
    at: new Date().toISOString(),
    source: window.location.hostname || "app",
    userAgent: window.navigator?.userAgent || ""
  }];

  state.activeUserName = matchedPerson.name;
  state.language = normalizeLanguageCode(matchedPerson.language) === "nl" ? "nl" : "fr";
  document.documentElement.lang = state.language;
  state.pinValidated = true;
  if (shouldOpenTutorialOnLogin(matchedPerson)) {
    state.activeAdminTab = "tuto";
    markTutorialSeenForUser(matchedPerson);
  } else {
    state.activeAdminTab = firstAccessibleTabForUser(matchedPerson);
  }
  updateFocusFromQuery();
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
  const isNewAccessPerson = !target;
  const now = new Date().toISOString();

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
  target.pinCreatedAt = isNewAccessPerson ? now : (target.pinCreatedAt || now);
  target.pinExpiresAt = pinExpiryInput?.value || "";
  if (isNewAccessPerson) {
    target.welcomeEmailQueuedAt = now;
    target.welcomeEmailSentAt = "";
  }

  if (hasRemoteData()) {
    await syncPersonToRemote(target);
  }

  pinAccessForm.reset();
  pinAccessForm.dataset.editPersonId = "";
  saveState();
  render();
}

function handleActiveUserChange(event) {
  state.activeUserName = event.target.value;
  const selectedPerson = state.people.find((person) => person.name === state.activeUserName);
  if (selectedPerson) {
    state.language = normalizeLanguageCode(selectedPerson.language) === "nl" ? "nl" : "fr";
    document.documentElement.lang = state.language;
  }
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
    if (nextTab === "dashboard") {
      resetWorkspaceFilters();
    }
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
  schedulePostRenderLanguagePass();
}

function schedulePostRenderLanguagePass() {
  if (state.language !== "nl" || typeof window === "undefined") {
    return;
  }
  window.requestAnimationFrame(applyPostRenderLanguagePass);
}

function normalizeUiTranslationKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizedTranslationFromMap(value, map) {
  const targetKey = normalizeUiTranslationKey(value);
  if (!targetKey) {
    return "";
  }
  const found = Object.entries(map).find(([key]) => normalizeUiTranslationKey(key) === targetKey);
  return found?.[1] || "";
}

function translateExactText(value, map) {
  if (!value) {
    return value;
  }
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (Object.prototype.hasOwnProperty.call(map, trimmed)) {
    return `${leading}${map[trimmed]}${trailing}`;
  }
  const normalized = normalizedTranslationFromMap(trimmed, map);
  return normalized ? `${leading}${normalized}${trailing}` : value;
}

function translateUiTextValue(value) {
  let next = translateExactText(translateExactText(value, nlUiTextMap), nlUiPhraseMap);
  Object.entries({ ...nlUiPhraseMap, ...nlUiExtraPhraseMap })
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([from, to]) => {
      if (next.includes(from)) {
        next = next.split(from).join(to);
      }
    });
  return next;
}

function applyPostRenderLanguagePass() {
  if (state.language !== "nl") {
    return;
  }
  const root = document.body;
  if (!root) {
    return;
  }
  const ignoredTags = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ignoredTags.has(parent.tagName) || parent.isContentEditable) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.nodeValue || !node.nodeValue.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  nodes.forEach((node) => {
    const next = translateUiTextValue(node.nodeValue);
    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  });
  document.querySelectorAll("[placeholder]").forEach((node) => {
    const next = translateExactText(node.getAttribute("placeholder"), nlUiPlaceholderMap);
    if (next !== node.getAttribute("placeholder")) {
      node.setAttribute("placeholder", next);
    }
  });
  document.querySelectorAll("[title]").forEach((node) => {
    const next = translateExactText(node.getAttribute("title"), nlUiTextMap);
    if (next !== node.getAttribute("title")) {
      node.setAttribute("title", next);
    }
  });
  document.querySelectorAll("[aria-label]").forEach((node) => {
    const next = translateExactText(node.getAttribute("aria-label"), nlUiTextMap);
    if (next !== node.getAttribute("aria-label")) {
      node.setAttribute("aria-label", next);
    }
  });
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
  const createdPerson = hydrateAccessProfile({
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
    pinStatus: "active",
    welcomeEmailQueuedAt: new Date().toISOString()
  });
  state.people.push(createdPerson);

  if (hasRemoteData()) {
    await syncPersonToRemote(createdPerson);
  }
  ensureAutomationEmailDrafts();
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

  if (!isIntervenantRole(person.role)) {
    person.previousRoleBeforeIntervenant = person.role;
  }
  person.role = nextRole;
  if (hasRemoteData()) {
    await syncPersonToRemote(person);
  }
  saveState();
  render();
  scrollToFocusedUpdate();
}

async function handleIntervenantRoleSubmit(event) {
  event.preventDefault();
  const role = normalizeRoleKey(intervenantRoleInput?.value || "");
  if (!role || state.roleOptions.includes(role)) {
    return;
  }

  state.roleOptions.push(role);
  state.roleOptions = normalizedRoleOptions(state.roleOptions);
  state.roleVisibilityConfig[role] = defaultVisibilityModesForRole("intervenant");
  if (intervenantRoleInput) {
    intervenantRoleInput.value = "";
  }
  if (intervenantRoleSelect) {
    intervenantRoleSelect.innerHTML = renderIntervenantRoleOptions(role);
    intervenantRoleSelect.value = role;
  }

  if (hasRemoteData()) {
    await syncSettingsToRemote();
    await loadRemoteState();
  }
  saveState();
  render();
}

async function handleIntervenantRemove(event) {
  const personId = event.currentTarget.getAttribute("data-intervenant-remove");
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) {
    return;
  }

  person.role = person.previousRoleBeforeIntervenant || "manager";
  delete person.previousRoleBeforeIntervenant;

  if (hasRemoteData()) {
    await syncPersonToRemote(person);
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
  const editId = Number(storeEditSelect?.value || 0);

  if (!name || !city || !code || !owner) {
    return;
  }

  const targetStore = editId
    ? state.stores.find((store) => store.id === editId)
    : null;
  const store = targetStore || {
    id: Date.now(),
    steps: [
      { actorType: "store_manager", label: "Magasin", status: "planned", note: "" },
      { actorType: "installer", label: "Telephonie", status: "planned", note: "" },
      { actorType: "electrician", label: "Electricien", status: "planned", note: "" }
    ],
    appointments: []
  };
  const workflow = ensureStoreWorkflowData(store);

  Object.assign(store, {
    code,
    shopNumber: storeShopNumberInput?.value.trim() || code.replace(/^BRI-/i, ""),
    name,
    city,
    address: storeAddressInput?.value.trim() || "",
    shopType: normalizeShopTypeValue(storeShopTypeSelect?.value || ""),
    shopSize: storeShopSizeInput?.value.trim() || "",
    poLicences: storePoLicencesInput?.value.trim() || "",
    poHpDesk: storePoHpDeskInput?.value.trim() || "",
    poPm: storePoPmInput?.value.trim() || "",
    poRentingHw: storePoRentingHwInput?.value.trim() || "",
    owner,
    manager,
    status: storeStatusSelect?.value || "planned",
    health: storeHealthInput?.value.trim() || "",
    licenseCount: Number(storeLicenseCountInput?.value || 0),
    fixCount: Number(storeFixCountInput?.value || 0),
    mobileCount: Number(storeMobileCountInput?.value || 0),
    callButtonCount: Number(storeCallButtonCountInput?.value || 0),
    panicCount: Number(storePanicCountInput?.value || 0),
    updatedAt: new Date().toISOString()
  });
  workflow.currentPlatform = storeCurrentPlatformInput?.value.trim() || "Destiny";
  workflow.targetPlatform = storeTargetPlatformInput?.value.trim() || "TELEPO";
  workflow.currentPhoneDate = storeCurrentPhoneDateInput?.value || "";
  workflow.currentContractClientNumber = storeCurrentContractClientInput?.value.trim() || "";

  if (!targetStore) {
    state.stores.push(store);
  }

  if (hasRemoteData()) {
    await syncStoreToRemote(store, targetStore ? `Mise a jour magasin depuis Contacts - ${code}` : `Creation magasin depuis Contacts - ${code}`);
    await loadRemoteState();
  }
  resetStoreContactForm();
  saveState();
  render();
  window.alert(targetStore ? "Magasin modifie et enregistre." : "Magasin cree et enregistre.");
}

function resetStoreContactForm() {
  storeForm.reset();
  if (storeEditSelect) storeEditSelect.value = "";
  if (storeCodeInput) storeCodeInput.readOnly = false;
  if (storeOwnerSelect) storeOwnerSelect.value = provenanceOptions[0] || "DOS";
  if (storeShopTypeSelect) storeShopTypeSelect.value = "";
  if (storeStatusSelect) storeStatusSelect.value = "planned";
  if (storeCurrentPlatformInput) storeCurrentPlatformInput.value = "Destiny";
  if (storeTargetPlatformInput) storeTargetPlatformInput.value = "TELEPO";
  if (document.querySelector("#addStoreButton")) {
    document.querySelector("#addStoreButton").textContent = "Ajouter un magasin";
  }
}

function fillStoreContactForm(store) {
  if (!store) {
    resetStoreContactForm();
    return;
  }
  const workflow = ensureStoreWorkflowData(store);
  storeNameInput.value = store.name || "";
  storeCodeInput.value = store.code || "";
  storeCodeInput.readOnly = true;
  if (storeShopNumberInput) storeShopNumberInput.value = store.shopNumber || String(store.code || "").replace(/^BRI-/i, "");
  storeCityInput.value = store.city || "";
  if (storeAddressInput) storeAddressInput.value = store.address || "";
  if (storeShopTypeSelect) storeShopTypeSelect.value = normalizeShopTypeValue(store.shopType || "");
  if (storeShopSizeInput) storeShopSizeInput.value = store.shopSize || "";
  storeOwnerSelect.value = store.owner || provenanceOptions[0] || "DOS";
  storeManagerInput.value = store.manager || "";
  if (storePoLicencesInput) storePoLicencesInput.value = store.poLicences || "";
  if (storePoHpDeskInput) storePoHpDeskInput.value = store.poHpDesk || "";
  if (storePoPmInput) storePoPmInput.value = store.poPm || "";
  if (storePoRentingHwInput) storePoRentingHwInput.value = store.poRentingHw || "";
  if (storeLicenseCountInput) storeLicenseCountInput.value = store.licenseCount || "";
  if (storeFixCountInput) storeFixCountInput.value = store.fixCount || "";
  if (storeMobileCountInput) storeMobileCountInput.value = store.mobileCount || "";
  if (storeCallButtonCountInput) storeCallButtonCountInput.value = store.callButtonCount || "";
  if (storePanicCountInput) storePanicCountInput.value = store.panicCount || "";
  if (storeStatusSelect) storeStatusSelect.value = store.status || "planned";
  if (storeHealthInput) storeHealthInput.value = store.health || "";
  if (storeCurrentPlatformInput) storeCurrentPlatformInput.value = workflow.currentPlatform || "Destiny";
  if (storeTargetPlatformInput) storeTargetPlatformInput.value = workflow.targetPlatform || "TELEPO";
  if (storeCurrentPhoneDateInput) storeCurrentPhoneDateInput.value = workflow.currentPhoneDate || "";
  if (storeCurrentContractClientInput) storeCurrentContractClientInput.value = workflow.currentContractClientNumber || "";
  if (document.querySelector("#addStoreButton")) {
    document.querySelector("#addStoreButton").textContent = "Enregistrer le magasin";
  }
}

function handleStoreEditSelectChange() {
  const storeId = Number(storeEditSelect?.value || 0);
  const store = state.stores.find((entry) => entry.id === storeId);
  fillStoreContactForm(store);
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
pinRolloutSearchInput?.addEventListener("input", renderPinRolloutList);
pinRolloutStatusFilter?.addEventListener("change", renderPinRolloutList);
pinRolloutOpenButton?.addEventListener("click", () => applyPinRollout("open"));
pinRolloutOpenAllButton?.addEventListener("click", () => applyPinRollout("open", "all-closed"));
pinMarkAllMailSentButton?.addEventListener("click", markAllPinMailsReceived);
pinRolloutCloseButton?.addEventListener("click", () => applyPinRollout("close"));
personForm.addEventListener("submit", handlePersonSubmit);
intervenantForm?.addEventListener("submit", handleIntervenantSubmit);
intervenantRoleForm?.addEventListener("submit", handleIntervenantRoleSubmit);
storeForm.addEventListener("submit", handleStoreSubmit);
storeEditSelect?.addEventListener("change", handleStoreEditSelectChange);
storeNewButton?.addEventListener("click", resetStoreContactForm);
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
automationSubtabs?.addEventListener("click", handleAutomationSubtabClick);
automationTemplateList?.addEventListener("change", handleAutomationTemplateFieldChange);
automationTemplateList?.addEventListener("input", handleAutomationTemplateFieldChange);
automationEmailQueue?.addEventListener("change", handleAutomationEmailFieldChange);
automationEmailQueue?.addEventListener("input", handleAutomationEmailFieldChange);
visibilityOverrideForm?.addEventListener("submit", handleVisibilityOverrideSubmit);
projectTableBody.addEventListener("click", handleNetworkConfirm);
importButton.addEventListener("click", handleImportButtonClick);
importInput.addEventListener("change", handleImportInputChange);
reportButton.addEventListener("click", handleReportButtonClick);
printCurrentListButton?.addEventListener("click", handlePrintCurrentListClick);
tabImportButton?.addEventListener("click", handleImportButtonClick);
tabImportStoresButton?.addEventListener("click", () => triggerImport("stores"));
tabImportTelephonyButton?.addEventListener("click", () => triggerImport("telephony"));
tabImportSavHistoryButton?.addEventListener("click", () => triggerImport("sav-history"));
tabImportExtensionsButton?.addEventListener("click", () => triggerImport("extensions"));
tabExportButton?.addEventListener("click", () => safeRunExport(exportJsonData));
tabExportStoresCheckXlsxButton?.addEventListener("click", () => safeRunExport(exportStoresCheckXlsx));
tabExportStoresXlsxButton?.addEventListener("click", () => safeRunExport(exportStoresXlsx));
tabExportStoresPdfButton?.addEventListener("click", () => safeRunExport(exportStoresPdf));
tabBulkStorePrintZipButton?.addEventListener("click", () => safeRunExport(exportStoreFichesZip));
tabExportExtensionsXlsxButton?.addEventListener("click", () => safeRunExport(exportExtensionsXlsx));
tabExportExtensionsPdfButton?.addEventListener("click", () => safeRunExport(exportExtensionsPdf));

async function init() {
  const stored = loadState();
  state.stores = stored.stores;
  state.activities = stored.activities;
  state.people = normalizeSpecialPeople(stored.people);
  state.activeUserName = stored.activeUserName;
  state.language = stored.language || "fr";
  state.activeAdminTab = stored.activeAdminTab || "dashboard";
  state.activeAutomationSubtab = stored.activeAutomationSubtab || "rules";
  state.pinValidated = false;
  state.launchMailDraft = stored.launchMailDraft || {};
  state.toolItems = (stored.toolItems || []).filter((item) =>
    item?.id !== tutorialVideosSettingsItemId
    && item?.kind !== "tutorial_videos"
    && item?.id !== technicalSheetsSettingsItemId
    && item?.kind !== "technical_sheets"
  );
  state.accessOverrides = stored.accessOverrides || [];
  state.roleOptions = normalizedRoleOptions(stored.roleOptions);
  state.tutorialVideos = normalizedTutorialVideos(stored.tutorialVideos || []);
  state.technicalSheets = normalizedTechnicalSheets(stored.technicalSheets || []);
  state.automations = normalizedAutomations(stored.automations);
  state.roleVisibilityConfig = stored.roleVisibilityConfig || {};
  state.visibilityEditorRole = stored.visibilityEditorRole || "supadmin_twem";
  state.roleViewUnlocked = Boolean(stored.roleViewUnlocked);
  state.contactSearch = stored.contactSearch || "";
  state.importExportHistory = cleanImportHistory(stored.importExportHistory || []);
  state.automationEmails = Array.isArray(stored.automationEmails) ? stored.automationEmails : [];
  if (Array.isArray(stored.extensionCatalogRows) && stored.extensionCatalogRows.length) {
    extensionCatalogRows.splice(0, extensionCatalogRows.length, ...stored.extensionCatalogRows.map((row, index) => normalizeExtensionCatalogRow(row, index)));
  }
  state.people = normalizeSpecialPeople(stripKnownTestPeople(state.people));
  state.tickets = stripKnownTestTickets(state.tickets);
  ensureAutomationEmailDrafts();
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
  } else if (state.activeUserName && presentationBypassUsers.includes(state.activeUserName)) {
    state.activeUserName = state.people.find((person) => person.name === state.activeUserName)?.name || state.activeUserName;
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
        const restoredInstallDateStores = restorePlanningInstallDatesFromSnapshot();
        if (restoredInstallDateStores.length) {
          saveState();
          for (const store of restoredInstallDateStores) {
            await syncStoreToRemote(store);
          }
          refreshRemoteSyncShadow();
        }
        await setupRealtime();
        setupAppwritePolling();
      }
    } catch (error) {
      state.connectionState = "fallback";
      console.error("Appwrite init error", error);
    }
  }

  ensureValidActiveTab();
  if (state.pinValidated) {
    updateFocusFromQuery();
  }
  render();
  scrollToFocusedUpdate();
}

init();

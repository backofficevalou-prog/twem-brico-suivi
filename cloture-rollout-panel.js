(() => {
  "use strict";
  const Core = window.ClosureRolloutCore;
  let context = null;
  let root = null;
  const state = { user: null, records: [], activeTab: "dstny", drawing: false, signatureDirty: false };
  const $ = (selector, scope = root) => scope?.querySelector(selector) || null;
  const $$ = (selector, scope = root) => [...(scope?.querySelectorAll(selector) || [])];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const formatDate = (value) => value ? new Intl.DateTimeFormat("fr-BE", { dateStyle: "short" }).format(new Date(`${String(value).slice(0, 10)}T12:00:00`)) : "—";
  const formatDateTime = (value) => value ? new Intl.DateTimeFormat("fr-BE", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "—";
  const payloadOf = (record) => Core.safeParse(record.payload_json, {});
  const findRecord = (id) => state.records.find((item) => item.$id === id);
  const linkedPoints = (storeCode) => state.records.filter((item) => item.record_type === "dstny" && item.store_code === storeCode);
  const generalPoints = () => state.records.filter((item) => item.record_type === "dstny" && payloadOf(item).scope === "general");
  const bricoStatus = (record, payload = payloadOf(record)) => Core.derivedBricoStatus(payload, linkedPoints(record.store_code));
  function openRemarksFor(record, payload = payloadOf(record)) {
    const managerRemarks = (payload.liveClosure?.remarks || payload.remarks || [])
      .filter((item) => !Core.hasValue(item.response) && !Core.hasValue(item.decision))
      .map((item, index) => ({ id: item.id || `manager-${index}`, source: "Rapport manager", category: item.category || item.label || "Rapport de clôture", text: item.text || item.comment || item.label || "Remarque du rapport", response: "", owner: item.owner || "Valou / Emir", nextAction: item.nextAction || "Répondre dans l’outil existant", dueDate: item.dueDate || "", status: "Réponse requise", kind: "manager" }));
    const dstnyRemarks = linkedPoints(record.store_code)
      .filter((item) => item.status !== "Résolu")
      .map((item) => { const data = payloadOf(item); return { id: item.$id, source: "Dstny", category: data.category || "Demande DSTNY", text: data.request || data.problem || item.title, response: data.lastReply || "", owner: data.owner || "Non attribué", nextAction: data.nextAction || "", dueDate: data.dueDate || data.lastReminderDate || "", status: item.status || "En attente", kind: "dstny" }; });
    const internalRemarks = (payload.internalRemarks || [])
      .filter((item) => !["Résolu", "Clôturé"].includes(item.status))
      .map((item, index) => ({ id: item.id || `internal-${index}`, source: "Contrôle interne", category: item.category || "Contrôle", text: item.text || item.comment || "Point interne", response: item.response || "", owner: item.owner || "Non attribué", nextAction: item.nextAction || "", dueDate: item.dueDate || "", status: item.status || (item.response ? "En attente" : "Réponse requise"), kind: "internal" }));
    return [...managerRemarks, ...dstnyRemarks, ...internalRemarks];
  }

  function toast(message) {
    const node = $("#toast"); node.textContent = message; node.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("show"), 3200);
  }
  function setSaving(label) { $("#saveState").textContent = label; }
  function statusColor(status) {
    return ({ "À demander": "#c92b25", "Incomplet": "#c92b25", "Réponse requise": "#c92b25", "En attente": "#e89b21", "À contrôler": "#e89b21", "Répondu": "#2877a8", "Résolu": "#25824c", "Prêt pour clôture": "#25824c", "Clôturé": "#25824c" })[status] || "#657078";
  }
  function documentUrl(doc = {}, mode = "view") {
    if (doc.externalUrl) {
      if (mode === "download") {
        const driveId = String(doc.externalUrl).match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([^/?&]+)/i)?.[1];
        if (driveId) return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}`;
      }
      return doc.externalUrl;
    }
    if (doc.fileId && doc.bucketId) return `${context.config.appwriteEndpoint}/storage/buckets/${encodeURIComponent(doc.bucketId)}/files/${encodeURIComponent(doc.fileId)}/${mode === "download" ? "download" : "view"}?project=${encodeURIComponent(context.config.appwriteProjectId)}`;
    return doc.url || "";
  }
  async function gateway(action, input = {}) {
    if (!context?.gateway) throw new Error("La passerelle de clôture n’est pas disponible.");
    return context.gateway(action, input);
  }
  function normalizedDocs(payload) {
    const labels = { installationZip: "ZIP / dossier complet d’installation", fnp: "FNP signé", installationReport: "Rapport d’installation", callflow: "Callflow", simStatement: "Relevé SIM", signedClosure: "Rapport de clôture signé" };
    return ["installationZip", ...Core.REQUIRED_DOCS].flatMap((kind) => {
      const value = Core.hasValue(payload.liveDocuments?.[kind])
        ? payload.liveDocuments[kind]
        : kind === "signedClosure" && Core.hasValue(payload.liveClosure?.signedReports)
          ? payload.liveClosure.signedReports
          : payload.documents?.[kind];
      const rows = Array.isArray(value) ? value : value ? [value] : [];
      return rows.map((doc, index) => typeof doc === "string" ? { kind, label: labels[kind], name: index ? `${labels[kind]} ${index + 1}` : labels[kind], externalUrl: doc, source: "TWEM Brico", matchStatus: "Validé", validated: true } : { kind, label: labels[kind], ...doc });
    });
  }

  async function loadRecords() {
    setSaving("Chargement…");
    const response = await gateway("list");
    state.records = response.documents || [];
    state.records.forEach((record) => {
      if (record.record_type === "brico") record.status = bricoStatus(record);
    });
    render(); setSaving("À jour");
  }
  async function saveRecord(record, payload, explicitStatus = "") {
    const status = record.record_type === "brico" ? Core.derivedBricoStatus(payload, linkedPoints(record.store_code)) : explicitStatus || record.status;
    const persistedPayload = structuredClone(payload);
    delete persistedPayload.liveClosure;
    delete persistedPayload.liveDocuments;
    setSaving("Sauvegarde…");
    const result = await gateway("update", { documentId: record.$id, expectedVersion: Number(record.version || 0), data: {
      store_code: record.store_code || "", title: record.title, ticket: record.ticket || "", status, payload_json: JSON.stringify(persistedPayload), updated_at: new Date().toISOString(), updated_by: state.user.name || state.user.email, version: Number(record.version || 0) + 1
    }});
    const updated = result.document;
    const index = state.records.findIndex((item) => item.$id === record.$id);
    state.records[index] = updated; await loadRecords(); setSaving("À jour"); toast("Modification enregistrée.");
  }

  function summaryData() {
    const dstny = state.records.filter((r) => r.record_type === "dstny");
    const brico = state.records.filter((r) => r.record_type === "brico");
    return [
      [dstny.filter((r) => r.status !== "Résolu").length, "Points DSTNY ouverts"],
      [dstny.filter((r) => r.status === "Résolu").length, "Points DSTNY résolus"],
      [brico.length, "Magasins installés"],
      [brico.filter((r) => bricoStatus(r) === "Prêt pour clôture").length, "Prêts pour GO clôture"]
    ];
  }
  function render() {
    $("#summary").innerHTML = summaryData().map(([n, label]) => `<div class="summary-card"><strong>${n}</strong><span>${escapeHtml(label)}</span></div>`).join("");
    renderDstny(); renderBrico();
  }
  function renderDstny() {
    const term = $("#dstnySearch").value.trim().toLowerCase();
    const filter = $("#dstnyStatusFilter").value;
    let rows = state.records.filter((r) => r.record_type === "dstny");
    rows = rows.filter((r) => !filter || r.status === filter).filter((r) => !term || `${r.store_code} ${r.title} ${r.ticket} ${r.payload_json}`.toLowerCase().includes(term));
    rows = Core.sortRecords(rows, "dstny");
    $("#dstnyList").innerHTML = rows.length ? rows.map((r) => {
      const p = payloadOf(r);
      return `<article class="record" data-status="${escapeHtml(r.status)}"><div class="record-main">
        <div class="record-title"><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(p.scope === "outside_rollout" ? `${p.storeName || "Magasin"} · Hors roll-out — DSTNY uniquement` : r.store_code || "Général · partagé avec BRICO")}${r.ticket ? ` · Ticket ${escapeHtml(r.ticket)}` : ""}</small></div>
        <div><span class="status">${escapeHtml(r.status)}</span><div class="record-meta">${escapeHtml(p.owner || "Responsable non attribué")}</div></div>
        <div class="record-snippet">${escapeHtml(p.request || p.problem || "")}</div>
        <div class="record-actions"><button class="icon-button" data-edit="${r.$id}" type="button">Ouvrir</button></div>
      </div></article>`;
    }).join("") : `<div class="record"><div class="record-main">Aucun point ne correspond aux filtres.</div></div>`;
    $$('[data-edit]', $("#dstnyList")).forEach((b) => b.addEventListener("click", () => openDstnyEditor(b.dataset.edit)));
  }
  function renderBrico() {
    const term = $("#bricoSearch").value.trim().toLowerCase();
    const filter = $("#bricoStatusFilter").value;
    let rows = state.records.filter((r) => r.record_type === "brico").map((r) => ({ ...r, status: bricoStatus(r) }));
    rows = rows.filter((r) => !filter || r.status === filter).filter((r) => !term || `${r.store_code} ${r.title}`.toLowerCase().includes(term));
    rows = Core.sortRecords(rows, "brico");
    const general = state.records.find((r) => r.record_type === "brico_general");
    const gp = generalPoints(); const generalOpen = gp.filter((x) => x.status !== "Résolu").length;
    const generalHtml = general && (!term || `${general.title} général roll out`.toLowerCase().includes(term)) && !filter ? `<article class="record" data-status="${generalOpen ? "À contrôler" : "Prêt pour clôture"}"><div class="record-main"><div class="record-title"><strong>${escapeHtml(general.title)}</strong><small>Dossier autonome · avant les magasins</small></div><div><span class="status">${generalOpen ? "À contrôler" : "Prêt pour clôture"}</span><div class="record-meta">${generalOpen} point(s) général(aux) ouvert(s)</div></div><div class="record-snippet">Décisions communes, procédures, actions, pièces et remarques générales.</div><div class="record-actions"><button class="icon-button" data-general="${general.$id}" type="button">Dossier général</button></div></div></article>` : "";
    const storesHtml = rows.length ? rows.map((r) => {
      const p = payloadOf(r); const docs = normalizedDocs(p); const complete = Core.REQUIRED_DOCS.filter((k) => Core.hasRequiredDocument(p, k)).length; const openPoints = linkedPoints(r.store_code).filter((x) => x.status !== "Résolu").length; const remarkProgress = Core.remarkProgress(p); const algo = Core.algoConnectionState(p, r.store_code);
      return `<article class="record" data-status="${escapeHtml(r.status)}"><div class="record-main">
        <div class="record-title"><strong>${escapeHtml(r.store_code)} · ${escapeHtml(r.title)}</strong><small>Installation ${formatDate(p.installDate)} · ${complete}/5 pièces</small></div>
        <div><span class="status">${escapeHtml(r.status)}</span><div class="record-meta">Algo : ${algo.connected ? "raccordé" : "non confirmé"} · ${escapeHtml(algo.source)}${algo.contradiction ? " · ⚠ contradiction à contrôler" : ""} · ${openPoints} point(s) DSTNY ouvert(s)</div></div>
        <div class="record-snippet"><span class="remark-indicator ${remarkProgress.status}">${escapeHtml(remarkProgress.label)}${remarkProgress.total ? ` · ${remarkProgress.answered}/${remarkProgress.total}` : ""}</span><span>${escapeHtml(`${docs.length} document(s) référencé(s)`)}</span></div>
        <div class="record-actions"><button class="icon-button" data-store="${r.$id}" type="button">Dossier</button><button class="icon-button" data-go="${r.$id}" type="button" ${r.status === "Incomplet" ? "disabled" : ""}>GO clôture</button></div>
      </div></article>`;
    }).join("") : `<div class="record"><div class="record-main">Aucun magasin ne correspond aux filtres.</div></div>`;
    $("#bricoList").innerHTML = generalHtml + storesHtml;
    $$('[data-general]', $("#bricoList")).forEach((b) => b.addEventListener("click", () => openGeneralEditor(b.dataset.general)));
    $$('[data-store]', $("#bricoList")).forEach((b) => b.addEventListener("click", () => openBricoEditor(b.dataset.store)));
    $$('[data-go]', $("#bricoList")).forEach((b) => b.addEventListener("click", () => openClosure(b.dataset.go)));
  }

  function dialogShell(title, subtitle, content, buttons) {
    return `<div class="dialog-body"><div class="dialog-head"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(subtitle || "")}</p></div><button class="icon-button" value="cancel" formnovalidate>Fermer</button></div>${content}<div class="actions">${buttons}</div></div>`;
  }
  function openDstnyEditor(id) {
    const r = findRecord(id), p = payloadOf(r), d = $("#editorDialog"), stores = Core.sortRecords(state.records.filter((x) => x.record_type === "brico"), "brico"), currentScope = p.scope || (r.store_code ? "rollout_store" : "general");
    $("#editorContent").innerHTML = dialogShell(r.title, r.store_code || "Demande générale", `<div class="dialog-grid">
      <label>Statut<select name="status">${Core.DSTNY_ORDER.map((x) => `<option ${x === r.status ? "selected" : ""}>${x}</option>`).join("")}</select></label>
      <label>Portée<select name="scope" id="editScope"><option value="general" ${currentScope === "general" ? "selected" : ""}>Général / multi-magasins</option><option value="rollout_store" ${currentScope === "rollout_store" ? "selected" : ""}>Magasin du roll-out</option><option value="outside_rollout" ${currentScope === "outside_rollout" ? "selected" : ""}>Hors roll-out — DSTNY uniquement</option></select></label>
      <label id="editRolloutStore">Magasin du roll-out<select name="storeCode"><option value="">Choisir…</option>${stores.map((s) => `<option value="${escapeHtml(s.store_code)}" ${s.store_code === r.store_code ? "selected" : ""}>${escapeHtml(s.store_code)} · ${escapeHtml(s.title)}</option>`).join("")}</select></label><label id="editOutsideStore">Magasin hors roll-out<input name="storeName" value="${escapeHtml(p.storeName || "")}"></label>
      <label>Qui s’en occupe ?<select name="owner">${["Installateur","Support","Commercial","Brico","TWEM"].map((x) => `<option ${x === p.owner ? "selected" : ""}>${x}</option>`).join("")}</select></label>
      <label>Catégorie<input name="category" value="${escapeHtml(p.category || "")}"></label><label>Destinataire<input name="recipient" value="${escapeHtml(p.recipient || "Dstny")}"></label><label>Priorité<select name="priority">${["Normale","Haute","Urgente"].map((x) => `<option ${x === (p.priority || "Normale") ? "selected" : ""}>${x}</option>`).join("")}</select></label>
      <label>Ticket Support<input name="ticket" value="${escapeHtml(r.ticket || "")}"></label><label>Date première demande<input name="firstRequestDate" type="date" value="${escapeHtml(p.firstRequestDate || "")}"></label>
      <label>Dernière relance<input name="lastReminderDate" type="date" value="${escapeHtml(p.lastReminderDate || "")}"></label><label>Dernière réponse Dstny<input name="lastReplyDate" type="date" value="${escapeHtml(p.lastReplyDate || "")}"></label>
      <label class="wide">Demande / problème<textarea name="request">${escapeHtml(p.request || p.problem || "")}</textarea></label>
      <label class="wide">Dernière réponse / réponse finale Dstny<textarea name="lastReply">${escapeHtml(p.lastReply || "")}</textarea></label>
      <label class="wide">Prochaine action<textarea name="nextAction">${escapeHtml(p.nextAction || "")}</textarea></label>
      <label class="wide">Pièces jointes / liens (un par ligne)<textarea name="attachments">${escapeHtml((p.attachments || []).map((x) => x.url || x).join("\n"))}</textarea></label><p id="editScopeNotice" class="wide scope-note"></p>
      <div class="wide"><h3>Historique partagé DSTNY / BRICO</h3><div class="history-list">${(p.history || []).map((x) => `<div class="history-item">${formatDateTime(x.at)} · ${escapeHtml(x.from || "—")} → ${escapeHtml(x.to || "—")} · ${escapeHtml(x.reply || "")}</div>`).join("") || "<p>Aucun changement enregistré.</p>"}</div></div>
    </div>`, `<button class="button" type="submit">Enregistrer</button>`);
    const scopeField = $("#editScope"); const renderScope = () => { const value = scopeField.value; $("#editRolloutStore").classList.toggle("hidden", value !== "rollout_store"); $("#editOutsideStore").classList.toggle("hidden", value !== "outside_rollout"); $("#editScopeNotice").textContent = value === "general" ? "Partagé avec le dossier GÉNÉRAL BRICO." : value === "rollout_store" ? "Partagé avec le dossier BRICO du magasin choisi." : "Hors roll-out — visible uniquement dans DSTNY."; }; scopeField.onchange = renderScope; renderScope();
    const form = $("#editorForm"); form.onsubmit = async (event) => {
      event.preventDefault(); const fd = new FormData(form); const nextStatus = fd.get("status"); const nextScope = fd.get("scope"); const nextStoreCode = nextScope === "rollout_store" ? String(fd.get("storeCode") || "") : ""; if (nextScope === "rollout_store" && !nextStoreCode) return toast("Choisis un magasin du roll-out."); if (currentScope === "outside_rollout" && nextScope === "rollout_store" && !window.confirm("Aperçu des conséquences : ce point apparaîtra désormais dans le dossier BRICO du magasin et dans son compteur. Confirmer la conversion officielle ?")) return;
      const now = new Date().toISOString(); const next = { ...p, scope: nextScope, storeName: nextScope === "outside_rollout" ? String(fd.get("storeName") || "").trim() : "", category: fd.get("category"), recipient: fd.get("recipient"), priority: fd.get("priority"), owner: fd.get("owner"), firstRequestDate: fd.get("firstRequestDate"), lastReminderDate: fd.get("lastReminderDate"), lastReplyDate: fd.get("lastReplyDate"), request: fd.get("request"), lastReply: fd.get("lastReply"), nextAction: fd.get("nextAction"), attachments: String(fd.get("attachments") || "").split(/\r?\n/).map((url) => url.trim()).filter(Boolean).map((url) => ({ name: url, url })) };
      if (nextStatus !== r.status) next.history = [...(p.history || []), { at: now, from: r.status, to: nextStatus, reply: next.lastReply, by: state.user.email }];
      if (nextScope !== currentScope || nextStoreCode !== r.store_code) next.history = [...(next.history || p.history || []), { at: now, type: "routing_changed", from: currentScope, to: nextScope, storeCode: nextStoreCode, by: state.user.email }];
      if (next.lastReminderDate !== (p.lastReminderDate || "")) next.history = [...(next.history || p.history || []), { at: now, type: "reminder", date: next.lastReminderDate, by: state.user.email }];
      if (next.lastReplyDate !== (p.lastReplyDate || "") || next.lastReply !== (p.lastReply || "")) next.history = [...(next.history || p.history || []), { at: now, type: "reply", date: next.lastReplyDate, reply: next.lastReply, by: state.user.email }];
      if (nextStatus === "Résolu") next.resolvedAt = p.resolvedAt || now; else if (r.status === "Résolu") { next.reopenedAt = now; next.resolvedAt = ""; }
      r.store_code = nextStoreCode; r.ticket = String(fd.get("ticket") || ""); await saveRecord(r, next, nextStatus); d.close();
    }; d.showModal();
  }
  function openNewDstny() {
    const d = $("#editorDialog");
    const stores = Core.sortRecords(state.records.filter((r) => r.record_type === "brico"), "brico");
    $("#editorContent").innerHTML = dialogShell("Nouveau point DSTNY", "Il sera créé une seule fois et pourra être lié à un magasin.", `<div class="dialog-grid">
      <label class="wide">Titre<input name="title" required></label><label>Catégorie<input name="category" required placeholder="Support, procédure, matériel…"></label><label>Portée<select name="scope" id="newScope"><option value="general">Général / multi-magasins du roll-out</option><option value="rollout_store">Magasin du roll-out</option><option value="outside_rollout">Hors roll-out — visible uniquement dans DSTNY</option></select></label>
      <label id="rolloutStoreField" class="hidden">Magasin du roll-out<select name="storeCode"><option value="">Choisir…</option>${stores.map((s) => `<option value="${escapeHtml(s.store_code)}">${escapeHtml(s.store_code)} · ${escapeHtml(s.title)}</option>`).join("")}</select></label><label id="outsideStoreField" class="hidden">Magasin hors roll-out<input name="outsideStoreName" placeholder="Ex. Overijse ou Éghezée"></label>
      <label>Date de demande<input name="firstRequestDate" type="date" value="${new Date().toISOString().slice(0,10)}" required></label><label>Destinataire<input name="recipient" value="Dstny" required></label><label>Responsable<select name="owner">${["Installateur","Support","Commercial","Brico","TWEM"].map((x) => `<option>${x}</option>`).join("")}</select></label><label>Priorité<select name="priority"><option>Normale</option><option>Haute</option><option>Urgente</option></select></label>
      <label>Statut<select name="status">${Core.DSTNY_ORDER.map((x) => `<option>${x}</option>`).join("")}</select></label><label>Ticket Support (facultatif)<input name="ticket"></label>
      <label class="wide">Description<textarea name="request" required></textarea></label><label class="wide">Prochaine action<textarea name="nextAction"></textarea></label><label class="wide">Pièces jointes / liens (un par ligne)<textarea name="attachments"></textarea></label><p id="scopeNotice" class="wide scope-note">Ce point sera visible dans DSTNY et dans le dossier GÉNÉRAL BRICO.</p>
    </div>`, `<button class="button" type="submit">Créer le point</button>`);
    const scope = $("#newScope"); const updateScope = () => { const value = scope.value; $("#rolloutStoreField").classList.toggle("hidden", value !== "rollout_store"); $("#outsideStoreField").classList.toggle("hidden", value !== "outside_rollout"); $("#scopeNotice").textContent = value === "general" ? "Ce point sera visible dans DSTNY et dans le dossier GÉNÉRAL BRICO." : value === "rollout_store" ? "Ce point sera visible dans DSTNY et dans le dossier BRICO du magasin choisi." : "Hors roll-out — visible uniquement dans DSTNY. Aucun dossier ni compteur BRICO ne sera créé."; }; scope.onchange = updateScope; updateScope();
    const form = $("#editorForm"); form.onsubmit = async (event) => {
      event.preventDefault(); const fd = new FormData(form); const selectedScope = fd.get("scope"); const storeCode = selectedScope === "rollout_store" ? String(fd.get("storeCode") || "") : ""; const storeName = selectedScope === "outside_rollout" ? String(fd.get("outsideStoreName") || "").trim() : ""; if (selectedScope === "rollout_store" && !storeCode) return toast("Choisis un magasin du roll-out."); if (selectedScope === "outside_rollout" && !storeName) return toast("Indique le magasin hors roll-out.");
      const title = String(fd.get("title") || "").trim(), ticket = String(fd.get("ticket") || "").trim(); const duplicate = state.records.find((x) => x.record_type === "dstny" && String(x.title).trim().toLowerCase() === title.toLowerCase() && String(x.ticket || "") === ticket && x.store_code === storeCode); if (duplicate) return toast("Doublon détecté : ouvre le point existant au lieu d’en créer un second.");
      setSaving("Création…"); const now = new Date().toISOString(); const payload = { category: fd.get("category"), scope: selectedScope, storeName, recipient: fd.get("recipient"), priority: fd.get("priority"), request: fd.get("request"), owner: fd.get("owner"), firstRequestDate: fd.get("firstRequestDate"), lastReminderDate: "", lastReplyDate: "", lastReply: "", nextAction: fd.get("nextAction"), attachments: String(fd.get("attachments") || "").split(/\r?\n/).map((url) => url.trim()).filter(Boolean).map((url) => ({ name: url, url })), history: [{ at: now, type: "created", by: state.user.email }] };
      const result = await gateway("create", { data: { record_type: "dstny", store_code: storeCode, title, ticket, status: fd.get("status"), payload_json: JSON.stringify(payload) } });
      const created = result.document;
      state.records.push(created); render(); setSaving("À jour"); d.close(); toast("Point DSTNY créé.");
    }; d.showModal();
  }
  function docEditorRows(payload) {
    const labels = { fnp: "FNP", installationReport: "Rapport d’installation", callflow: "Callflow", simStatement: "Relevé SIM", signedClosure: "Rapport de clôture signé" };
    return Core.REQUIRED_DOCS.map((k) => `<label class="check-row"><input type="checkbox" name="doc_${k}" ${Core.hasRequiredDocument(payload, k) ? "checked" : ""} ${k === "signedClosure" && Core.hasValue(payload.liveClosure?.signedReports) ? "disabled" : ""}><span>${labels[k]}${k === "signedClosure" && Core.hasValue(payload.liveClosure?.signedReports) ? " · synchronisé depuis l’outil existant" : ""}</span></label>`).join("");
  }
  function openGeneralEditor(id) {
    const r = findRecord(id), p = payloadOf(r), d = $("#editorDialog"), points = generalPoints();
    const pointHtml = points.map((x) => { const xp = payloadOf(x); return `<div class="remark-item"><strong>${escapeHtml(x.title)}</strong><p><span class="status" style="--status-color:${statusColor(x.status)}">${escapeHtml(x.status)}</span> ${xp.resolvedAt ? `· ${formatDateTime(xp.resolvedAt)}` : ""}</p><p>${escapeHtml(xp.lastReply || xp.request || "")}</p><button class="icon-button" data-general-point="${x.$id}" type="button">Ouvrir le point partagé</button></div>`; }).join("");
    const docs = (p.documents || []).map((x) => `<div class="document-item"><a href="${escapeHtml(x.url)}" target="_blank" rel="noopener">${escapeHtml(x.name || x.url)}</a></div>`).join("") || "<p>Aucun document général.</p>";
    $("#editorContent").innerHTML = dialogShell(r.title, `${points.filter((x) => x.status !== "Résolu").length} point(s) ouvert(s)`, `<div class="dialog-grid"><div class="wide"><h3>Points généraux · source unique DSTNY</h3><div class="remark-list">${pointHtml}</div></div><div class="wide"><h3>Documents généraux</h3>${docs}<label>Ajouter des liens (un par ligne)<textarea name="links"></textarea></label></div><label class="wide">Remarques / décisions générales<textarea name="generalRemarks">${escapeHtml(p.generalRemarks || "")}</textarea></label><div class="wide"><h3>Historique</h3>${(p.history || []).map((x) => `<div class="history-item">${formatDateTime(x.at)} · ${escapeHtml(x.text || "")}</div>`).join("") || "<p>Aucun historique.</p>"}</div></div>`, `<button class="button" type="submit">Enregistrer</button><button class="button secondary" id="printGeneral" type="button">Imprimer le dossier général</button>`);
    $$('[data-general-point]', $("#editorContent")).forEach((b) => b.addEventListener("click", () => { d.close(); openDstnyEditor(b.dataset.generalPoint); }));
    $("#printGeneral").onclick = () => printGeneral(r, p, points);
    const form = $("#editorForm"); form.onsubmit = async (event) => { event.preventDefault(); const fd = new FormData(form); const next = structuredClone(p); const links = String(fd.get("links") || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean); next.documents = [...(next.documents || []), ...links.map((url) => ({ name: url, url }))]; const note = String(fd.get("generalRemarks") || ""); if (note !== (p.generalRemarks || "")) next.history = [...(p.history || []), { at: new Date().toISOString(), text: "Remarque générale mise à jour", by: state.user.email }]; next.generalRemarks = note; await saveRecord(r, next, points.some((x) => x.status !== "Résolu") ? "À contrôler" : "Prêt pour clôture"); d.close(); };
    d.showModal();
  }
  function printGeneral(r, p, points) {
    const w = window.open("", "_blank"); if (!w) return toast("Autorise la fenêtre d’impression.");
    w.document.write(`<html><head><title>${escapeHtml(r.title)}</title><style>body{font:15px Arial;margin:30px;color:#20272d}h1,h2{color:#123957}.head{border-top:28px solid #ffdf38;padding:24px}.item{padding:12px;border-bottom:1px solid #ccc}</style></head><body><div class="head"><h1>${escapeHtml(r.title)}</h1><p>${escapeHtml(p.generalRemarks || "")}</p></div><h2>Points généraux</h2>${points.map((x) => `<div class="item"><strong>${escapeHtml(x.title)} — ${escapeHtml(x.status)}</strong><p>${escapeHtml(payloadOf(x).lastReply || payloadOf(x).request || "")}</p></div>`).join("")}<h2>Documents</h2>${(p.documents || []).map((x) => `<p><a href="${escapeHtml(x.url)}">${escapeHtml(x.name || x.url)}</a></p>`).join("")}</body></html>`); w.document.close(); setTimeout(() => w.print(), 300);
  }
  function openBricoEditor(id) {
    const r = findRecord(id), p = payloadOf(r), docs = normalizedDocs(p), d = $("#editorDialog"), linked = linkedPoints(r.store_code), algo = Core.algoConnectionState(p, r.store_code);
    const liveRemarks = p.liveClosure?.remarks || p.remarks || [];
    const remarks = liveRemarks.map((x, i) => `<div class="remark-item"><strong>${escapeHtml(x.label || x.text || x.comment || `Remarque ${i + 1}`)}</strong>${x.text && x.label ? `<p>${escapeHtml(x.text)}</p>` : ""}<div class="remark-answer ${Core.hasValue(x.response) || Core.hasValue(x.decision) ? "answered" : "missing"}"><span>${Core.hasValue(x.response) || Core.hasValue(x.decision) ? "Réponse enregistrée" : "Réponse ou décision requise dans l’outil existant"}</span><p>${escapeHtml(x.response || x.decision || "Aucune réponse enregistrée.")}</p>${x.responseAt || x.responseBy ? `<small>${escapeHtml([x.responseAt ? formatDateTime(x.responseAt) : "", x.responseBy || ""].filter(Boolean).join(" · "))}</small>` : ""}</div></div>`).join("") || `<p>Aucune remarque relevée dans le rapport signé.</p>`;
    const missingKinds = Core.REQUIRED_DOCS.filter((kind) => !Core.hasRequiredDocument(p, kind));
    const links = docs.map((doc) => `<div class="document-item ${doc.validated === false || doc.matchStatus === "À vérifier" ? "needs-review" : "is-valid"}"><div><strong>${escapeHtml(doc.name || doc.label)}</strong><small>${escapeHtml(doc.label)} · ${escapeHtml(doc.source || "TWEM Brico")} · ${escapeHtml(doc.documentDate ? formatDateTime(doc.documentDate) : "Date non renseignée")} · ${escapeHtml(doc.matchStatus || "Validé")}</small></div><div class="document-actions">${documentUrl(doc) ? `<a class="icon-button" href="${escapeHtml(documentUrl(doc))}" target="_blank" rel="noopener">Voir</a><a class="icon-button" href="${escapeHtml(documentUrl(doc, "download"))}" target="_blank" rel="noopener">Télécharger</a>` : `<span class="missing-document">Lien indisponible</span>`}</div></div>`).join("") || `<p>Aucun document référencé.</p>`;
    const linkedHtml = linked.map((x) => { const xp = payloadOf(x); return `<div class="remark-item"><strong>${escapeHtml(x.title)}</strong><p><span class="status" style="--status-color:${statusColor(x.status)}">${escapeHtml(x.status)}</span> ${xp.resolvedAt ? `· résolu le ${formatDateTime(xp.resolvedAt)}` : ""}</p><p>${escapeHtml(xp.lastReply || xp.request || "")}</p><button class="icon-button" data-linked-point="${x.$id}" type="button">Corriger ce point partagé</button></div>`; }).join("") || "<p>Aucun point DSTNY lié.</p>";
    $("#editorContent").innerHTML = dialogShell(`${r.store_code} · ${r.title}`, `Statut calculé : ${bricoStatus(r, p)}`, `<div class="dialog-grid">
      <label>Date d’installation<input name="installDate" type="date" value="${escapeHtml(p.installDate || "")}"></label><label>Confirmation individuelle Algo<select name="algoConnected"><option value="false" ${!p.algoConnected ? "selected" : ""}>Non confirmée individuellement</option><option value="true" ${p.algoConnected ? "selected" : ""}>Raccordé confirmé</option></select></label>
      <div class="wide algo-rule ${algo.contradiction ? "has-conflict" : algo.connected ? "is-connected" : "is-pending"}"><strong>Algo calculé : ${algo.connected ? "raccordé" : "non confirmé"}</strong><span>${escapeHtml(algo.source)}</span>${algo.contradiction ? "<p>Contradiction détectée : la règle métier indique raccordé mais la confirmation individuelle stockée indique le contraire. Aucune donnée n’est écrasée.</p>" : ""}<details><summary>Réponse automatique proposée</summary><p>${escapeHtml(Core.algoSuggestedResponse(p, r.store_code))}</p></details></div>
      <div class="wide"><h3>Contrôle des pièces</h3><div class="check-grid">${docEditorRows(p)}</div><p class="signature-note">Les cases reflètent les références existantes. Les fichiers originaux restent dans Drive ou Appwrite.</p></div>
      <div class="wide"><h3>Documents classés</h3><p class="signature-note">Rapprochement prioritaire par numéro magasin. Les originaux restent dans Drive/Appwrite et conservent leurs permissions.</p>${missingKinds.length ? `<div class="missing-documents"><strong>Pièces manquantes</strong><span>${escapeHtml(missingKinds.join(" · "))}</span></div>` : ""}<div class="document-list">${links}</div></div>
      <div class="wide"><h3>Remarques du rapport signé et réponses existantes</h3><p class="signature-note">Source unique : l’outil actuel « Rapports de clôture signés / réponses aux remarques ». La lecture est reprise ici sans duplication.</p><div class="remark-list">${remarks}</div></div>
      <div class="wide"><h3>Points DSTNY liés · source unique</h3><div class="remark-list">${linkedHtml}</div></div>
      <label class="wide check-row"><input type="checkbox" name="reviewConfirmed" ${p.reviewConfirmed ? "checked" : ""}><span>J’ai contrôlé le dossier et les réponses</span></label>
    </div>`, `<button class="button" type="submit">Enregistrer le contrôle</button>`);
    $$('[data-linked-point]', $("#editorContent")).forEach((button) => button.addEventListener("click", () => { d.close(); openDstnyEditor(button.dataset.linkedPoint); }));
    const form = $("#editorForm"); form.onsubmit = async (event) => {
      event.preventDefault(); const fd = new FormData(form); const next = structuredClone(p); next.installDate = fd.get("installDate"); next.algoConnected = fd.get("algoConnected") === "true"; next.reviewConfirmed = fd.get("reviewConfirmed") === "on"; next.documents ||= {};
      Core.REQUIRED_DOCS.filter((k) => k !== "signedClosure" || !Core.hasValue(p.liveClosure?.signedReports)).forEach((k) => { if (fd.get(`doc_${k}`) !== "on") next.documents[k] = []; });
      await saveRecord(r, next); d.close();
    }; d.showModal();
  }

  function canvasPoint(canvas, event) { const rect = canvas.getBoundingClientRect(); const touch = event.touches?.[0] || event.changedTouches?.[0] || event; return { x: (touch.clientX - rect.left) * canvas.width / rect.width, y: (touch.clientY - rect.top) * canvas.height / rect.height }; }
  function setupSignature(canvas) {
    canvas.width = Math.max(900, Math.floor(canvas.clientWidth * devicePixelRatio)); canvas.height = Math.max(300, Math.floor(canvas.clientHeight * devicePixelRatio));
    const ctx = canvas.getContext("2d"); ctx.lineWidth = 4 * devicePixelRatio; ctx.lineCap = "round"; ctx.strokeStyle = "#123957";
    const start = (e) => { e.preventDefault(); state.drawing = true; const p = canvasPoint(canvas, e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!state.drawing) return; e.preventDefault(); const p = canvasPoint(canvas, e); ctx.lineTo(p.x, p.y); ctx.stroke(); state.signatureDirty = true; };
    const end = () => { state.drawing = false; };
    canvas.addEventListener("pointerdown", start); canvas.addEventListener("pointermove", move); window.addEventListener("pointerup", end, { once: false });
    return () => { ctx.clearRect(0, 0, canvas.width, canvas.height); state.signatureDirty = false; };
  }
  function coverHtml(r, p, signature = p.closure || {}) {
    const docs = normalizedDocs(p);
    const remarks = p.liveClosure?.remarks || p.remarks || [];
    const algo = Core.algoConnectionState(p, r.store_code);
    const openRemarks = openRemarksFor(r, p);
    const openSection = openRemarks.length ? `<section class="open-remarks"><div class="open-remarks-head"><div><p class="eyebrow">REMARQUES ENCORE OUVERTES</p><h2>CLÔTURE BLOQUÉE</h2></div><strong>${openRemarks.length}</strong></div>${openRemarks.map((item) => `<article class="open-remark-card" data-open-kind="${escapeHtml(item.kind)}" data-open-id="${escapeHtml(item.id)}"><div class="open-remark-top"><span>${escapeHtml(item.source)}</span><span class="open-status" style="--status-color:${statusColor(item.status)}">${escapeHtml(item.status)}</span></div><h3>${escapeHtml(item.category)}</h3><details><summary>${escapeHtml(item.text)}</summary><p>${escapeHtml(item.text)}</p></details><dl><div><dt>Réponse</dt><dd>${escapeHtml(item.response || "Réponse requise")}</dd></div><div><dt>Responsable</dt><dd>${escapeHtml(item.owner)}</dd></div><div><dt>Prochaine action</dt><dd>${escapeHtml(item.nextAction || "À définir")}${item.dueDate ? ` · échéance ${escapeHtml(formatDate(item.dueDate))}` : ""}</dd></div></dl><button class="icon-button no-print" type="button" data-open-remark="${escapeHtml(item.id)}" data-open-source="${escapeHtml(item.kind)}">Ouvrir cette remarque</button></article>`).join("")}</section>` : `<section class="open-remarks is-clear"><p class="eyebrow">REMARQUES ENCORE OUVERTES</p><h2>Aucun point ouvert</h2></section>`;
    const approval = openRemarks.length ? `<div class="approval blocked"><h2>GO CLÔTURE DÉSACTIVÉ</h2><p>Répondre ou clôturer chaque remarque avant signature.</p></div>` : `<div class="approval"><h2>GO CLÔTURE</h2><p><strong>Date :</strong> ${escapeHtml(signature.date || "—")} · <strong>Nom :</strong> ${escapeHtml(signature.name || "—")} · <strong>Fonction :</strong> ${escapeHtml(signature.role || "—")}</p>${signature.signatureDataUrl ? `<img src="${signature.signatureDataUrl}" alt="Signature" style="max-width:360px;max-height:150px">` : "<p>Signature à apposer</p>"}<p><small>Validation enregistrée : ${formatDateTime(signature.confirmedAt)}</small></p></div>`;
    return `<article class="preview-sheet ${openRemarks.length ? "closure-blocked" : ""}"><p class="eyebrow">TWEM × BRICO · DOSSIER DE FINALISATION</p><h1>${escapeHtml(r.store_code)} · ${escapeHtml(r.title)}</h1><p><strong>Date d’installation :</strong> ${formatDate(p.installDate)}</p><p><strong>Algo raccordé :</strong> ${algo.connected ? "Oui" : "Non confirmé"} · ${escapeHtml(algo.source)}</p><h2>Pièces classées</h2><ol>${docs.map((d) => `<li>${escapeHtml(d.label)} — ${escapeHtml(d.name || "Document")}</li>`).join("")}</ol>${openSection}<h2>Remarques traitées</h2>${remarks.filter((x) => Core.hasValue(x.response) || Core.hasValue(x.decision)).map((x) => `<p><strong>${escapeHtml(x.label || x.text || x.comment || "Remarque")}</strong><br>${escapeHtml(x.response || x.decision)}</p>`).join("") || "<p>Aucune remarque traitée enregistrée.</p>"}${approval}</article>`;
  }
  function bindCoverRemarkButtons(root, record, dialog) {
    $$('[data-open-remark]', root).forEach((button) => button.addEventListener("click", () => {
      const source = button.dataset.openSource;
      if (source === "dstny") {
        dialog?.close();
        openDstnyEditor(button.dataset.openRemark);
        return;
      }
      if (source === "manager") {
        context.openClosureReview?.(record.store_code);
        return;
      }
      dialog?.close();
      openBricoEditor(record.$id);
    }));
  }
  function openClosure(id) {
    const r = findRecord(id), p = payloadOf(r), d = $("#closureDialog"), linked = linkedPoints(r.store_code); const hasOpenRemarks = openRemarksFor(r, p).length > 0; const confirmed = Boolean(p.closure?.confirmedAt) && !hasOpenRemarks; const ready = Core.derivedBricoStatus(p, linked) === "Prêt pour clôture";
    const content = confirmed
      ? `${coverHtml(r, p)}<div class="history-list">${(p.history || []).map((x) => `<div class="history-item">${escapeHtml(x.type)} · ${formatDateTime(x.at)} · ${escapeHtml(x.signerName || "")}</div>`).join("")}</div>`
      : hasOpenRemarks
        ? coverHtml(r, p)
        : `<div id="signStep"><div class="dialog-grid"><label>Nom du signataire<input name="signerName" required></label><label>Fonction<input name="signerRole"></label><label>Date<input name="signedDate" type="date" required value="${new Date().toISOString().slice(0, 10)}"></label></div><div class="signature-wrap"><strong>Signature au doigt ou au stylet</strong><canvas id="signaturePad" class="signature-pad"></canvas><p class="signature-note">Signe dans le cadre. Tu peux effacer et recommencer tant que le dossier n’est pas confirmé.</p><div class="actions"><button id="clearSignature" class="button secondary" type="button">Effacer</button><button id="restartSignature" class="button secondary" type="button">Recommencer</button></div></div></div><div id="closurePreview" class="hidden"></div>`;
    const buttons = confirmed
      ? `<button class="button" type="button" id="printFinal">Imprimer</button><button class="button secondary" type="button" id="prepareEmail">Préparer l’e-mail</button>`
      : hasOpenRemarks
        ? `<button class="button secondary" type="button" id="returnToDossier">Revenir au dossier magasin</button>`
        : `<button class="button secondary" type="button" id="previewClosure" ${ready ? "" : "disabled"}>Aperçu complet</button><button class="button" type="button" id="confirmClosure" disabled>Confirmer le GO clôture</button>`;
    $("#closureContent").innerHTML = dialogShell(`GO CLÔTURE · ${r.store_code}`, confirmed ? "Validation enregistrée — elle ne sera pas écrasée." : hasOpenRemarks ? "Clôture bloquée : ouvre directement le point à traiter." : ready ? "Signe puis vérifie l’aperçu avant confirmation." : "Le dossier doit être contrôlé avant signature.", content, buttons);
    d.showModal();
    bindCoverRemarkButtons($("#closureContent"), r, d);
    if (confirmed) { $("#printFinal").onclick = () => printClosure(r, p); $("#prepareEmail").onclick = () => prepareEmail(r, p); return; }
    if (hasOpenRemarks) { $("#returnToDossier").onclick = () => { d.close(); openBricoEditor(r.$id); }; return; }
    const canvas = $("#signaturePad"), clear = setupSignature(canvas); $("#clearSignature").onclick = clear; $("#restartSignature").onclick = () => { clear(); $("[name=signerName]").value = ""; $("[name=signerRole]").value = ""; };
    let signature = null;
    $("#previewClosure").onclick = () => {
      const name = $("[name=signerName]").value.trim(), role = $("[name=signerRole]").value.trim(), date = $("[name=signedDate]").value;
      signature = { name, role, date, signatureDataUrl: state.signatureDirty ? canvas.toDataURL("image/png") : "" };
      if (!Core.canConfirmClosure(p, signature, linked)) return toast("Nom, date et signature sont obligatoires, tous les points DSTNY doivent être résolus et le dossier doit être prêt.");
      $("#signStep").classList.add("hidden"); $("#closurePreview").classList.remove("hidden"); $("#closurePreview").innerHTML = `${coverHtml(r, p, signature)}<button id="backToSignature" class="button secondary" type="button">Modifier avant confirmation</button>`; bindCoverRemarkButtons($("#closurePreview"), r, d); $("#confirmClosure").disabled = false; $("#backToSignature").onclick = () => { $("#signStep").classList.remove("hidden"); $("#closurePreview").classList.add("hidden"); $("#confirmClosure").disabled = true; };
    };
    $("#confirmClosure").onclick = async () => {
      if (!signature || !Core.canConfirmClosure(p, signature, linked) || p.closure?.confirmedAt) return;
      if (!window.confirm("Confirmer définitivement ce GO CLÔTURE signé ?")) return;
      const now = new Date().toISOString(); const next = structuredClone(p); next.closure = { ...signature, confirmedAt: now, confirmedBy: state.user.email }; next.history = [...(next.history || []), Core.buildHistoryEntry(signature, now)]; await saveRecord(r, next); d.close(); openClosure(r.$id);
    };
  }
  function printClosure(r, p) {
    const w = window.open("", "_blank"); if (!w) return toast("Autorise l’ouverture de la fenêtre d’impression.");
    const docs = normalizedDocs(p).filter((doc) => doc.validated !== false && doc.matchStatus !== "À vérifier"); w.document.write(`<html><head><title>${escapeHtml(r.store_code)} - clôture</title><style>body{font:15px Arial;color:#20272d;margin:30px}h1,h2{color:#123957}.cover{min-height:90vh;border-top:28px solid #ffdf38;padding:28px}.approval{border:3px solid #25824c;padding:18px;margin-top:28px}.page{break-before:page}.doc{border-bottom:1px solid #ccc;padding:12px 0}img{max-width:360px;max-height:150px}.no-print{display:none}details summary{display:none}details p{display:block}</style></head><body><div class="cover">${coverHtml(r,p)}</div><section class="page"><h1>Index des documents validés</h1>${docs.map((d,i)=>`<div class="doc"><strong>${i+1}. ${escapeHtml(d.label)}</strong><br>${escapeHtml(d.name||"")}<br>${escapeHtml(d.source||"TWEM Brico")} · ${escapeHtml(d.matchStatus||"Validé")}</div>`).join("")}</section></body></html>`); w.document.close(); setTimeout(() => w.print(), 300);
  }
  function prepareEmail(r, p) {
    const d = $("#emailDialog"), docs = normalizedDocs(p), subject = `Dossier de clôture ${r.store_code} - ${r.title}`, body = `Bonjour,\n\nVeuillez trouver le dossier de clôture du magasin ${r.store_code} - ${r.title}.\n\nCordialement,\nValou`;
    $("#emailContent").innerHTML = dialogShell(`Préparer l’e-mail · ${r.store_code}`, "Aucun envoi automatique. Vérifie tout avant d’ouvrir le brouillon.", `<div class="dialog-grid"><label class="wide">Destinataires<input id="emailTo" placeholder="adresse@exemple.be"></label><label class="wide">Objet<input id="emailSubject" value="${escapeHtml(subject)}"></label><label class="wide">Texte<textarea id="emailBody">${escapeHtml(body)}</textarea></label><div class="wide"><h3>Pièces à joindre manuellement</h3>${docs.map((x) => `<div class="document-item">${escapeHtml(x.name || x.label)}</div>`).join("")}</div><label class="wide check-row"><input id="emailChecked" type="checkbox"><span>J’ai vérifié les destinataires, l’objet, le texte et les pièces jointes</span></label></div>`, `<button id="openDraft" class="button" type="button" disabled>Ouvrir le brouillon e-mail</button>`);
    d.showModal(); $("#emailChecked").onchange = (e) => $("#openDraft").disabled = !e.target.checked; $("#openDraft").onclick = () => { const to = $("#emailTo").value.trim(); if (!to) return toast("Ajoute au moins un destinataire."); const uri = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent($("#emailSubject").value)}&body=${encodeURIComponent($("#emailBody").value)}`; window.location.href = uri; };
  }
  function printDstny() { $("#dstnyPanel").classList.add("printing"); window.print(); setTimeout(() => $("#dstnyPanel").classList.remove("printing"), 500); }
  function switchTab(tab) { state.activeTab = tab; $$(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab)); $$(".panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === tab)); }

  function panelMarkup() {
    return `
      <link rel="stylesheet" href="cloture-rollout-panel.css?v=20261027-5">
      <div class="closure-panel-shell">
        <div id="closurePanelError" class="panel-error hidden" role="alert"></div>
        <div id="app" class="app">
          <header class="topbar">
            <div class="brand"><img src="assets/logo-appli.png" alt="TWEM"><div><span>TWEM × BRICO</span><h1>Clôture GO Roll Out</h1></div></div>
            <div class="top-actions"><span id="saveState" class="save-state">Chargement…</span><button id="closureInternalBack" class="button secondary" type="button">Retour aux Tools</button></div>
          </header>
          <main>
            <section class="hero"><div><p class="eyebrow">SOURCE UNIQUE DE PILOTAGE</p><h2>Finalisation Dstny + Brico</h2><p>Les couleurs découlent uniquement des statuts. Les documents d’origine restent dans Drive ou Appwrite Storage.</p></div><button id="refreshButton" class="button secondary" type="button">Actualiser les données</button></section>
            <section id="summary" class="summary" aria-label="Récapitulatif"></section>
            <nav class="tabs" aria-label="Dossiers"><button class="tab active" data-tab="dstny" type="button">DSTNY · 30 octobre</button><button class="tab" data-tab="brico" type="button">BRICO · 16 novembre</button></nav>
            <section id="dstnyPanel" class="panel active" data-panel="dstny">
              <div class="panel-head"><div><h2>Feuille DSTNY</h2><p>Demandes générales et problèmes magasin, triés automatiquement. Les éléments résolus sont verts et descendent en bas.</p></div><div class="actions"><button id="addDstnyButton" class="button secondary" type="button">Ajouter un point</button><button id="printDstnyButton" class="button" type="button">Rapport réunion</button></div></div>
              <div class="filters"><label>Recherche<input id="dstnySearch" type="search" placeholder="Magasin, ticket, demande…"></label><label>Statut<select id="dstnyStatusFilter"><option value="">Tous</option><option>À demander</option><option>En attente</option><option>Répondu</option><option>Résolu</option></select></label></div>
              <div id="dstnyList" class="record-list"></div>
            </section>
            <section id="bricoPanel" class="panel" data-panel="brico">
              <div class="panel-head"><div><h2>Feuille BRICO</h2><p>Exactement 33 magasins installés. Blankenberge est exclu. L’Algo est suivi séparément des pièces de clôture.</p></div><div class="scope-note"><strong>Algo calculé depuis les fiches</strong><span>Règle Cédric + Kraainem, avec confirmations individuelles.</span></div></div>
              <div class="filters"><label>Recherche<input id="bricoSearch" type="search" placeholder="Numéro ou magasin…"></label><label>Statut<select id="bricoStatusFilter"><option value="">Tous</option><option>Incomplet</option><option>À contrôler</option><option>Prêt pour clôture</option><option>Clôturé</option></select></label></div>
              <div id="bricoList" class="record-list"></div>
            </section>
          </main>
        </div>
        <dialog id="editorDialog" class="dialog"><form id="editorForm" method="dialog"><div id="editorContent"></div></form></dialog>
        <dialog id="closureDialog" class="dialog closure-dialog"><form id="closureForm" method="dialog"><div id="closureContent"></div></form></dialog>
        <dialog id="emailDialog" class="dialog"><form method="dialog"><div id="emailContent"></div></form></dialog>
        <div id="toast" class="toast" role="status" aria-live="polite"></div>
      </div>`;
  }

  function bindPanelEvents() {
    $$(".tab").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.tab)));
    $("#refreshButton").addEventListener("click", loadRecords);
    $("#dstnySearch").addEventListener("input", renderDstny);
    $("#dstnyStatusFilter").addEventListener("change", renderDstny);
    $("#bricoSearch").addEventListener("input", renderBrico);
    $("#bricoStatusFilter").addEventListener("change", renderBrico);
    $("#printDstnyButton").addEventListener("click", printDstny);
    $("#addDstnyButton").addEventListener("click", openNewDstny);
    $("#closureInternalBack").addEventListener("click", () => context.close?.());
  }

  async function mount(options) {
    context = options;
    state.user = options.identity;
    state.actor = options.identity;
    const host = options.host;
    root = host.shadowRoot || host.attachShadow({ mode: "open" });
    root.innerHTML = panelMarkup();
    bindPanelEvents();
    try {
      await gateway("ping");
      await loadRecords();
      $("#closurePanelError").classList.add("hidden");
    } catch (error) {
      const message = error?.message || "Le panneau de clôture ne peut pas être chargé.";
      $("#closurePanelError").textContent = message;
      $("#closurePanelError").classList.remove("hidden");
      setSaving("Erreur");
      throw error;
    }
  }

  window.TwemClosureRolloutPanel = { mount };
})();

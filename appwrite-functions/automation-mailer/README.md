# TWEM Brico automation mailer

Appwrite Function planifiee pour envoyer le digest quotidien via Outlook / Microsoft 365.

## Planning

Execution recommandee: chaque matin a 09:00 Europe/Brussels.

Appwrite utilise des expressions cron pour les Functions planifiees. Si l'heure du projet est UTC, utiliser `0 7 * * *` pour 09:00 Bruxelles en heure d'ete.

## Variables d'environnement

Obligatoires cote Appwrite:

- `APPWRITE_ENDPOINT`
- `APPWRITE_PROJECT_ID`
- `APPWRITE_DATABASE_ID`
- `APPWRITE_API_KEY`
- `GRAPH_TENANT_ID`
- `GRAPH_CLIENT_ID`
- `GRAPH_CLIENT_SECRET`
- `OUTLOOK_SENDER`

Optionnelles:

- `APPWRITE_STORES_COLLECTION_ID` = `stores`
- `APPWRITE_TICKETS_COLLECTION_ID` = `tickets`
- `DIGEST_RECIPIENTS` = `emir@twem.be,valou@twem.be`
- `DRY_RUN` = `true`

Mettre `DRY_RUN=false` uniquement quand le test est valide.

## Permissions Microsoft

L'application Azure / Entra ID doit avoir Microsoft Graph `Mail.Send` en permission application, avec consentement administrateur. Idealement, limiter l'acces a la mailbox emettrice via une policy Exchange.

## Permissions Appwrite

La cle Appwrite de la Function doit pouvoir lire:

- `stores`
- `tickets`

La Function ne modifie pas les donnees applicatives.

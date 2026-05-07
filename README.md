# Txwem / Brico - suivi chantier Web

Cette base sert de point de depart pour un outil partage entre responsables Txwem, intervenants terrain
et responsables magasin.

L application tourne en deux modes:

- `demo`: tout fonctionne en local dans le navigateur pour cadrer vite le besoin
- `appwrite`: auth Appwrite par lien magique branchee, avec session reelle utilisateur
- `supabase`: ancien branchement MVP conserve provisoirement

## Fichiers

- `index.html`: interface principale
- `styles.css`: design du tableau de bord
- `app.js`: logique de pilotage, auth magique et confirmations
- `config.js`: mode demo ou parametres Appwrite / Supabase publics
- `config.example.js`: modele de configuration
- `netlify.toml`: config de deploiement Netlify
- `supabase/schema.sql`: schema de base de donnees pour le MVP

## Demarrage rapide

1. Ouvrir `index.html` pour tester en mode demo.
2. Pour passer en mode Appwrite, mettre `mode: "appwrite"` dans `config.js`.
3. Remplir `appwriteEndpoint` et `appwriteProjectId`.
4. Dans Appwrite:
   - ajouter la plateforme web `localhost` ou ton domaine
   - activer l auth par Magic URL
5. Pour l ancien mode Supabase:
   - mettre `mode: "supabase"` dans `config.js`
   - remplir `supabaseUrl` et `supabaseAnonKey`
6. Dans Supabase:
   - activer l auth par email magic link
   - executer `supabase/schema.sql`
7. Deployer le dossier sur Netlify ou GitHub Pages.

## GitHub Pages

Le repo contient maintenant un workflow GitHub Actions pour publier automatiquement le front sur GitHub Pages.

Activation:

1. Aller dans GitHub > `Settings` > `Pages`
2. Dans `Build and deployment`, choisir `GitHub Actions`
3. Pousser sur `main`

Le workflow publie:

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `assets/`

Important:

- GitHub Pages met l interface en ligne hors local
- si `mode: "demo"` est actif, les donnees restent locales au navigateur
- si `mode: "appwrite"` est actif, l app reste partagee mais depend de l etat du backend Appwrite

## Structure de donnees

Le MVP partage maintenant les donnees principales via:

- `stores`
  - un magasin Brico
  - responsable Txwem
  - date prevue
  - statut global
  - sante chantier
- `store_steps`
  - une etape par intervenant
  - exemple: installateur, electricien, responsable magasin
  - statut, commentaire, date de confirmation
- `confirmations`
  - journal des remontees terrain
  - qui a confirme
  - resultat OK ou probleme
  - commentaire
- `appointments`
  - rendez-vous par magasin
  - date/heure, statut, personnes concernees
- `contacts`
  - personnes du projet
  - role, telephone, email, langue, magasin lie
- `roles`
  - roles metier affiches dans l admin

## Processus recommande

1. Txwem cree ou importe les 40 magasins dans `stores`.
2. Chaque magasin recoit ses etapes dans `store_steps`.
3. Les responsables et intervenants se connectent avec lien magique.
4. Une confirmation met a jour l etape, le statut global du magasin et le flux activite.
5. Les responsables voient instantanement les blocages.

## Netlify

Cette app est statique, donc Netlify suffit pour l hebergement.

Reglage recommande:

- publish directory: `.`
- build command: vide

## Supabase

Activer dans Supabase:

- Authentication par email magic link
- Row Level Security
- Realtime sur `stores`, `store_steps`, `confirmations`

## Etat Appwrite actuel

Le socle Appwrite branche maintenant:

- SDK web charge dans `index.html`
- configuration publique via `config.js`
- envoi de lien magique
- creation de session a partir du lien de retour
- reconnaissance de l utilisateur par email / nom dans les contacts locaux

La couche donnees Appwrite est maintenant preparee pour une structure simple:

- Database ID: `twem_brico`
- Collection ID: `stores`
- Collection ID: `people`
- Collection ID: `activities`
- Collection ID: `settings`

## Appwrite - attributs minimum

### `stores`

- `code` : string
- `name` : string
- `city` : string
- `owner_name` : string
- `manager_name` : string
- `status` : string
- `health` : string
- `updated_at` : string
- `payload_json` : string long

### `people`

- `name` : string
- `role` : string
- `phone` : string
- `email` : string
- `store_code` : string
- `language` : string
- `payload_json` : string long

### `activities`

- `store_name` : string
- `result` : string
- `comment` : string
- `confirmed_by` : string
- `created_at` : string
- `payload_json` : string long

### `settings`

- `role_options_json` : string long
- `tool_items_json` : string long
- `access_overrides_json` : string long

## Permissions Appwrite conseillees pour demarrer

- collections accessibles aux utilisateurs connectes
- lecture / creation / mise a jour / suppression autorisees pour les utilisateurs connectes
- le filtrage metier fin reste gere dans l application

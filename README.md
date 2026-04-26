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
7. Deployer le dossier sur Netlify.

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

La base de donnees Appwrite n est pas encore branchee. Les donnees chantier restent actuellement dans l etat local du navigateur tant que les collections Appwrite ne sont pas migrees.

## Prochaine etape utile

Pour passer d Appwrite auth au vrai outil partage, je te recommande ensuite:

1. Creer les collections Appwrite
2. Brancher les magasins et les contacts sur Appwrite
3. Brancher les rendez-vous et les remontees
4. Ajouter les notifications email et les roles stricts

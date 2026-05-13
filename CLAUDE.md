# Règles du projet — Mangwa Corpus

## Historique des tâches effectuées

### Session 1 — Routes et pages principales
- Création des routes Astro : `/audio`, `/audioitem/[id]`, `/album/[id]`, `/ebook`, `/ebook/[id]`, `/qui-sommes-nous`, `/paiement`
- Création des pages admin : `/admin/index`, `/admin/audios`, `/admin/magazines`, `/admin/videos`, `/admin/users`, `/admin/payments`, `/admin/payment-methods`, `/admin/hero`, `/admin/media`, `/admin/newsletter`
- Mise en place du `Layout.astro` avec `<Header>`, `<Footer>` et hydratation `client:load`

### Session 2 — Audio engine + streaming
- Création de `src/utils/audioEngine.ts` : singleton global avec `loadTrack`, `play`, `pause`, `toggle`, `seek`
- Création du hook `useAudioEngine` : écoute les events de l'engine (playing, progress, currentTime, duration, previewStart, previewEnd)
- Création du hook `useAudioWaveform` : calcule ou utilise les waveform pré-calculées (champ `waveform` JSON en base)
- Composant `ListeAudio.tsx` : liste des 5 dernières sorties audio avec lecteur intégré, waveform cliquable, bouton Lyrics et Télécharger
- Composant `AudioItemPlayer.tsx` : page détail d'un audio avec paroles synchronisées (LRC ou JSON), tracklist de l'album, waveform
- Composant `AlbumDetailPlayer.tsx` : page détail d'un album avec tracklist complète, navigation prev/next, waveform par piste
- Pré-calcul du waveform côté admin : champ `waveform` stocké en JSON dans la table audio

### Session 3 — Onglet Pistes automatique depuis album_id
- `AudioItemPlayer.tsx` : chargement automatique de l'album parent via `api.audioAlbum(activeId)`
- Affichage de la tracklist de l'album dans le panneau gauche si l'audio appartient à un album
- Navigation entre pistes via `handleTrackSelect` : change `activeId`, recharge l'audio et lance la lecture
- `window.history.pushState` pour mettre à jour l'URL sans rechargement lors du changement de piste

### Session 4 — Paiement et checkout
- Création de `src/pages/paiement.astro` : lit `?type` et `?id` depuis les query params, redirige vers `/` si invalide
- Création de `src/Componant/CheckoutPage.tsx` : formulaire de checkout pour audio, magazine et album
- `EntityType = "magazine" | "audio" | "album"` — les trois types sont supportés
- Pages admin `/admin/payments` et `/admin/payment-methods` pour gérer les transactions et méthodes de paiement

### Session 5 — Responsive design (pass complet)
Tous les composants publics ont été mis à jour pour respecter les règles responsive ci-dessous.

| Composant | Modifications |
|---|---|
| `Container.tsx` | Padding progressif `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-360` |
| `Banniere.tsx` | Hauteur fixe → `h-[280px] sm:h-[360px] md:h-[455px]` |
| `CarteEdition.tsx` | `h-[80px]` desc → `line-clamp-3`, texte 3 paliers |
| `SectionEdition.tsx` | `auto-rows-[300px] sm:auto-rows-[380px] lg:auto-rows-[420px]` |
| `SectionAudio.tsx` | Texte titre : `text-[13px] sm:text-[15px] lg:text-[18px]` |
| `QuiSommesNous.tsx` | Toutes hauteurs fixes → `aspect-16/7`, `aspect-4/3` |
| `EbookDetailViewer.tsx` | Grille `md:grid-cols-3 lg:grid-cols-4`, suppression `DownloadIcon` inutilisé |
| `ListeEditions.tsx` | Couverture `aspect-3/4`, textes 3 paliers |
| `ListeAudio.tsx` (TrackRow) | `flex sm:grid sm:grid-cols-5`, thumbnail `w-24 sm:w-auto aspect-square` |
| `CarteCategorie.tsx` | Titre `text-[22px] sm:text-[26px] lg:text-[30px]` |
| `AlbumDetailPlayer.tsx` | `max-h-[60vh] lg:max-h-[600px]` au lieu de `style={{ maxHeight }}` |
| `AudioItemPlayer.tsx` | Idem + suppression `DownloadIcon` inutilisé |

### Session 7 — Preview loop + paywall + validation waveform serveur

#### Lecture en boucle de la fenêtre de preview + écran de paiement
- **`src/utils/audioEngine.ts`** : ajout de `previewDidComplete: boolean` (public) et `_restartForLoop()` (privé)
  - `tick()` : quand `clamped >= previewEnd`, remet `_offset = previewStart`, passe `previewDidComplete = true`, appelle `_restartForLoop()` (boucle sans reset du flag)
  - `play()`, `loadTrack()`, `close()` : reset `previewDidComplete = false`
  - `TrackMeta` : ajout de `isPaid?: boolean`
- **`src/Componant/ListeAudio.tsx`** : `paywallShownRef` + `useEffect` sur `engine.previewDidComplete` → affiche paywall overlay après la première boucle si `isPaid`
- **`src/Componant/StickyPlayer.tsx`** : même logique, deux modes d'affichage (paywall / normal), hooks déplacés avant le `return null` conditionnel
- **`src/Componant/AudioItemPlayer.tsx`** : paywall overlay + preview-relative time/progress + waveform 3 zones
- **`src/Componant/AlbumDetailPlayer.tsx`** : idem, paywall dit "Achetez l'album" → `/paiement?type=album&id=...`
- **`src/lib/api.ts`** : `AlbumTrack` étendu avec `price`, `preview_start`, `preview_end`
- **`serveur/src/routes/albums.ts`** : SQL SELECT inclut `preview_start`, `preview_end`, `price`

#### Validation waveform côté serveur (seuil 2000 barres)
- **`serveur/src/routes/audios.ts`** et **`serveur/src/routes/albums.ts`** : ajout de `validateWaveform()` helper
  - Parse le JSON `waveform`, vérifie `Array.length >= 2000`
  - Si < 2000 ou JSON invalide → retourne `waveform: null`
  - Appliqué sur toutes les routes GET (liste, détail, pistes d'album)
- **Règle** : le champ `waveform` n'est affiché que s'il contient exactement 2000 barres ou plus. Toujours générer avec `decodeWaveform(url, 2000)` dans `AdminAudios.tsx`

### Session 6 — Preview audio + lien album + paiement album
- **Fenêtre de prévisualisation audio** : les champs `preview_start` et `preview_end` (secondes) stockés en base dans la table `audios`
  - `serveur/utils/tables.ts` : type `Audio` + `audioSchema` mis à jour, migrations `addColumnIfNotExists` ajoutées
  - `serveur/src/routes/admin/audios.ts` : POST et PUT lisent et sauvegardent `preview_start` / `preview_end`
  - `src/lib/api.ts` : type `Audio` étendu avec `preview_start: number | null` et `preview_end: number | null`
  - `src/utils/audioEngine.ts` : `TrackMeta` accepte `previewStart`/`previewEnd` ; `tick()` s'arrête à `previewEnd` ; `seek()` clampé dans la fenêtre
  - `src/Componant/ListeAudio.tsx` : waveform 3 zones (gris/clair/cyan), temps et progress bar relatifs à la fenêtre
  - `src/Componant/admin/AdminAudios.tsx` : section "Fenêtre de prévisualisation" avec inputs `preview_start` et `preview_end`
- **Lien vers l'album** : dans `ListeAudio.tsx`, nom de l'album affiché sous chaque titre et cliquable → `/album/[id]`
- **Prix album + paiement** :
  - `AlbumDetailPlayer.tsx` : bouton "Acheter l'album" → `/paiement?type=album&id=${album.id}`
  - `CheckoutPage.tsx` : support du type `album` (fetch `api.album`, label, lien retour)
  - `src/pages/paiement.astro` : accepte `type=album`
  - `AdminAudios.tsx` (formulaire album) : champ "Prix (XAF)" ajouté

---

## Stack

- **Frontend** : Astro + React (composants en `src/Componant/`)
- **Styles** : Tailwind CSS v4
- **Backend/CMS** : `@geniusofdigital/astro-cms` (Cloudflare D1 + R2)
- **Serveur custom** : Hono API dans `serveur/src/routes/` (admin CRUD, paiements)
- **Audio engine** : singleton `src/utils/audioEngine.ts` + hooks `useAudioEngine`, `useAudioWaveform`
- **Admin layout** : `src/layouts/AdminLayout.astro` — sidebar fixe, nav avec `active` prop

---

## Architecture audio

### AudioEngine (`src/utils/audioEngine.ts`)
Singleton global. Méthodes principales :
- `loadTrack(url, meta)` : charge le buffer, applique `previewStart`/`previewEnd`/`isPaid` depuis `meta`
- `play()` / `pause()` / `toggle()` / `seek(ratio)` / `close()`
- `previewStart: number | null` / `previewEnd: number | null` — exposés publiquement
- `previewDidComplete: boolean` — passe à `true` après la première boucle de preview, reset par `play()`/`loadTrack()`/`close()`

Fenêtre de preview (loop + paywall) :
- `tick()` : quand `clamped >= previewEnd` → remet `_offset = previewStart`, `previewDidComplete = true`, appelle `_restartForLoop()` (boucle infinie)
- `_restartForLoop()` : identique à `play()` SAUF qu'il ne reset pas `previewDidComplete`
- `seek(ratio)` clamp dans `[previewStart, previewEnd]`
- Progress exposé = position absolue dans le fichier (0–1)
- `previewProgress = (currentTime - previewStart) / (previewEnd - previewStart)` — calculé dans les composants pour l'affichage UI

Pattern paywall dans les composants :
```tsx
const paywallShownRef = useRef(false);
// Reset au changement de piste
useEffect(() => { paywallShownRef.current = false; setShowPaywall(false); }, [engine.currentAudioUrl]);
// Déclencher après la première boucle
useEffect(() => {
  if (engine.previewDidComplete && !paywallShownRef.current && isPaid) {
    paywallShownRef.current = true;
    setShowPaywall(true);
  }
}, [engine.previewDidComplete]);
// Replay : reset ref + appel audioEngine.play() qui reset previewDidComplete
```

### Waveform 3 zones (`ListeAudio.tsx`)
Quand `previewStart` et `previewEnd` sont définis :
- Barres avant `previewStartBar` : `#4b5563`, opacity 0.3 (hors preview)
- Barres dans la preview non lues : `#a0aec0`, opacity 0.85
- Barres lues : `#00bcd4`, opacity 1

---

## Page de paiement

La page `/paiement` existe (`src/pages/paiement.astro`).  
Elle accepte : `?type=audio&id=N`, `?type=magazine&id=N`, `?type=album&id=N`.

Pour lier un bouton d'achat depuis n'importe quel composant :
```tsx
href={`/paiement?type=audio&id=${audio.id}`}
href={`/paiement?type=magazine&id=${mag.id}`}
href={`/paiement?type=album&id=${album.id}`}
```

Le composant React utilisé : `src/Componant/CheckoutPage.tsx` (hydraté avec `client:load`).

---

## Règles responsive (appliquées à tous les composants)

### 1. Container
Toujours utiliser `<Container>` pour le contenu de page. Le composant applique :
```tsx
className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-360"
```
Ne jamais ajouter `px-N` directement sur une section qui utilise déjà `<Container>`.

### 2. Hauteurs d'images et de médias
Remplacer tous les `h-[Npx]` fixes par des **aspect ratios** :
- Image hero pleine largeur → `aspect-16/7`
- Couverture livre/magazine portrait → `aspect-3/4`
- Vignette carrée → `aspect-square`
- Image paysage standard → `aspect-4/3`

Ne jamais utiliser `style={{ height: "Npx" }}` sur un conteneur d'image.

### 3. Progression des tailles de texte
Toujours utiliser **3 paliers** minimum pour les titres :
```
text-[Npx] sm:text-[N+4px] lg:text-[N+8px]
```
Exemples validés :
- Titres principaux : `text-[20px] sm:text-[24px] lg:text-[28px]`
- Titres secondaires : `text-[18px] sm:text-[22px] lg:text-[26px]`
- Corps/labels : `text-[13px] sm:text-[14px] lg:text-[16px]`

Ne jamais sauter de `text-[13px]` directement à `sm:text-[20px]`.

### 4. Hauteurs max des panneaux scrollables
Remplacer `style={{ maxHeight: "600px" }}` par :
```tsx
max-h-[60vh] lg:max-h-[600px]
```

### 5. Grilles avec thumbnail sur mobile
Pour les lignes avec image + contenu (ex: TrackRow), utiliser :
```tsx
className="flex sm:grid sm:grid-cols-N"
```
et sur le thumbnail :
```tsx
className="w-24 sm:w-auto shrink-0 aspect-square overflow-hidden"
```
Ne pas définir une grille sans préciser le comportement mobile (`flex` ou `block`).

### 6. Descriptions tronquées
Remplacer les `h-[80px]` fixes sur les descriptions par :
```tsx
line-clamp-3
```

---

## Règles composants

### Bannière (`Banniere.tsx`)
Hauteur responsive fixée :
```tsx
h-[280px] sm:h-[360px] md:h-[455px]
```

### CarteCategorie / CarteEdition
- Utiliser `auto-rows-[300px] sm:auto-rows-[380px] lg:auto-rows-[420px]` dans la grille parente
- Titres : 3 paliers de taille

### AlbumDetailPlayer / AudioItemPlayer
- Panneau lyrics/tracklist : `max-h-[60vh] lg:max-h-[600px]`
- Onglets mobiles : tab bar `flex lg:hidden` pour switcher entre lecteur et pistes/paroles

### AdminLayout (`src/layouts/AdminLayout.astro`)
- Sidebar fixe `w-60 bg-gray-900`, nav items avec prop `active` pour highlight
- Ajouter une entrée dans le tableau `nav` pour chaque nouvelle page admin
- Ne pas utiliser `Layout.astro` pour les pages admin — utiliser `AdminLayout.astro`

---

## Conventions de code

- **Pas de commentaires** sauf si le comportement est non-évident
- **Pas de `style={{ }}`** pour les valeurs responsive — utiliser Tailwind
- **Classes Tailwind canoniques** : `aspect-4/3` (pas `aspect-[4/3]`), `max-w-360` (pas `max-w-[1440px]`)
- Ne pas importer/déclarer des variables inutilisées
- Hydratation Astro : utiliser `client:load` pour tous les composants React interactifs
- Migrations DB : utiliser `orm.addColumnIfNotExists` dans `initDatabase()` de `serveur/utils/tables.ts`
- Types partagés front/back : `src/lib/api.ts` pour le frontend, `serveur/utils/tables.ts` pour le serveur
- **Waveform** : toujours générer avec `decodeWaveform(url, 2000)` (2000 barres). Le serveur invalide tout `waveform` avec moins de 2000 barres en le remplaçant par `null` via `validateWaveform()` dans `audios.ts` et `albums.ts`

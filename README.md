# LFG - Panorama Gallery

![WordPress](https://img.shields.io/badge/WordPress-6.5+-blue) ![PHP](https://img.shields.io/badge/PHP-7.4+-green) ![Licence](https://img.shields.io/badge/licence-GPL--2.0--or--later-lightgrey)

**🇫🇷 Français** · [🇬🇧 English version below ↓](#english)

**Contributeurs :** La Ferme Graphique  
**Version stable :** 2.0.0  
**Licence :** GPL-2.0-or-later

Affiche une grande image panoramique défilable horizontalement, avec une miniature sous l'image pour naviguer (minimap). Molette, glisser à la souris, glisser au doigt, boutons et clavier.

## Français

### Installation

1. Télécharger `panorama-gallery-X.Y.Z.zip` depuis la [dernière release](https://github.com/JuReyms/WordPress-Panorama-Gallery/releases/latest).
2. Dans WordPress : Extensions > Ajouter > Téléverser une extension, choisir le zip, puis activer.
3. Dans l'éditeur, insérer le bloc « Panorama » et choisir une image très large.

### Blocs

| Bloc | Rôle |
|---|---|
| `w0/panorama-gallery` (« Panorama ») | Le bloc à utiliser. |
| `lfg-block-custom/lfg-block-panorama` (« Panorama (ancien bloc LFG) ») | Reprise de l'ancien bloc de `lfg-block-custom`, pour les articles existants. Absent de l'outil d'insertion. Se transforme en bloc Panorama depuis la barre d'outils. |

Pourquoi deux blocs et deux dossiers : voir [blocks/README.md](blocks/README.md).

Les deux blocs ont le même rendu, fait côté serveur (`includes/render.php`). Le HTML enregistré dans les articles n'est jamais réécrit : il sert à la validation dans l'éditeur.

### Navigation et accessibilité

- Molette verticale changée en défilement horizontal ; au bord du panorama, la page reprend la main.
- Glisser à la souris ; au doigt, défilement natif du navigateur.
- Boutons ‹ › sur les bords (souris et pavé tactile seulement) et fondu du côté où il reste de l'image.
- Clavier : la zone défilante reçoit le focus (Tab), puis flèches gauche et droite, Page préc./suiv., Début, Fin.
- `aria-label` construit sur le texte alternatif, repris de la médiathèque s'il est vide dans le bloc.
- `prefers-reduced-motion` : défilement instantané, aucune transition.
- Images responsives (`srcset`, `sizes`) et chargement différé, à partir de l'ID de la médiathèque.

### Pleine définition

WordPress réduit toute image de plus de 2 560 px. Pour une image au moins trois fois plus large que haute, l'extension relève cette limite à 8 192 px (filtre `panorama_gallery_max_width`) et ajoute une taille de 4 096 px. Les autres images ne changent pas. Seuls les téléversements faits après l'activation sont concernés.

### Couleurs

Le style lit les préréglages du thème, avec un repli neutre si le thème ne les définit pas :

- `--wp--preset--color--surface` : fond de la zone et de la miniature ;
- `--wp--preset--color--accent` : barre de défilement, cadre de la miniature, focus ;
- `--wp--preset--color--border` : filet de la miniature et des boutons ;
- `--wp--preset--color--background` et `--wp--preset--color--foreground` : fondus et boutons.

Hauteur du panorama : variable `--panorama-height` (par défaut `clamp(180px, 34vw, 480px)`), modifiable par le thème.

### Structure

```
panorama-gallery.php     enregistrement des blocs et des fichiers
includes/render.php      rendu serveur commun
includes/media.php       panoramas en pleine définition
blocks/*/block.json      métadonnées des deux blocs
assets/editor.js         éditeur (sans étape de construction)
assets/view.js           comportement sur le site
assets/style.css         styles du site et de l'éditeur
assets/editor.css        styles de l'éditeur seul
bin/release.sh           publication d'une version
```

Aucune étape de construction : le dossier se déploie tel quel.

### Remplacer lfg-block-custom

1. Installer et activer Panorama Gallery 2.0.0. Tant que `lfg-block-custom` est active, son bloc panorama et son script sont remplacés par ceux de cette extension.
2. Contrôler un article à panorama w0 et un article à panorama LFG, sur le site et dans l'éditeur.
3. Désactiver `lfg-block-custom`.

### Publier une version

1. Passer la version dans l'en-tête de `panorama-gallery.php` et dans `PANORAMA_GALLERY_VERSION`.
2. Ajouter sa section `## X.Y.Z` en haut de `CHANGELOG.md`.
3. Commiter et pousser `main`.
4. Lancer `bash bin/release.sh` : zip dans `dist/`, étiquette `vX.Y.Z`, release GitHub avec le zip et la section du journal.

`bash bin/release.sh --zip` construit seulement le zip. Le zip ne contient que les fichiers commités, sans les fichiers de développement (liste dans `.gitattributes`).

### Journal

Voir [CHANGELOG.md](CHANGELOG.md). Idées à venir : [ROADMAP.md](ROADMAP.md).

---

## English

[↑ Version française](#wordpress-panorama-gallery)

Displays a large panoramic image with horizontal scrolling and a thumbnail below it for quick navigation (minimap). Mouse wheel, mouse drag, touch swipe, buttons and keyboard.

### Installation

1. Download `panorama-gallery-X.Y.Z.zip` from the [latest release](https://github.com/JuReyms/WordPress-Panorama-Gallery/releases/latest).
2. In WordPress: Plugins > Add New > Upload Plugin, choose the zip, then activate.
3. In the editor, insert the "Panorama" block and pick a very wide image.

### Blocks

| Block | Purpose |
|---|---|
| `w0/panorama-gallery` ("Panorama") | The block to use. |
| `lfg-block-custom/lfg-block-panorama` ("Panorama (ancien bloc LFG)") | Takes over the legacy block from the `lfg-block-custom` plugin, for existing posts. Hidden from the inserter. Can be transformed into a Panorama block from the toolbar. |

Why two blocks and two folders: see [blocks/README.md](blocks/README.md) (in French).

Both blocks share the same server-side rendering (`includes/render.php`). The HTML saved in posts is never rewritten: it is only used for block validation in the editor.

### Navigation and accessibility

- Vertical mouse wheel turns into horizontal scrolling; at either end of the panorama, the page scrolls again.
- Mouse drag; on touch screens, the browser's native scrolling.
- ‹ › buttons on the edges (mouse and trackpad only) and a fade on the side where more image remains.
- Keyboard: the scroll area takes focus (Tab), then Left and Right arrows, Page Up / Page Down, Home, End.
- `aria-label` built from the alt text, taken from the media library when the block's alt text is empty.
- `prefers-reduced-motion`: instant scrolling, no transitions.
- Responsive images (`srcset`, `sizes`) and lazy loading, from the media library ID.

### Full resolution

WordPress scales down any image wider than 2,560 px. For an image at least three times wider than it is tall, the plugin raises this limit to 8,192 px (`panorama_gallery_max_width` filter) and adds a 4,096 px size. Other images are unchanged. Only uploads made after activation are affected.

### Colors

Styles read the theme's color presets, with a neutral fallback when the theme does not define them:

- `--wp--preset--color--surface`: scroll area and minimap background;
- `--wp--preset--color--accent`: scrollbar, minimap frame, focus;
- `--wp--preset--color--border`: minimap and button outline;
- `--wp--preset--color--background` and `--wp--preset--color--foreground`: fades and buttons.

Panorama height: `--panorama-height` custom property (default `clamp(180px, 34vw, 480px)`), which a theme can override.

### Structure

```
panorama-gallery.php     block and asset registration
includes/render.php      shared server-side rendering
includes/media.php       full-resolution panoramas
blocks/*/block.json      metadata for both blocks
assets/editor.js         editor (no build step)
assets/view.js           front-end behavior
assets/style.css         front-end and editor styles
assets/editor.css        editor-only styles
bin/release.sh           release script
```

No build step: the folder can be deployed as is.

### Publishing a release

1. Bump the version in the `panorama-gallery.php` header and in `PANORAMA_GALLERY_VERSION`.
2. Add its `## X.Y.Z` section at the top of `CHANGELOG.md`.
3. Commit and push `main`.
4. Run `bash bin/release.sh`: zip in `dist/`, `vX.Y.Z` tag, GitHub release with the zip and the changelog section.

`bash bin/release.sh --zip` only builds the zip. The zip contains committed files only, without development files (listed in `.gitattributes`).

### Changelog

See [CHANGELOG.md](CHANGELOG.md) (in French).

[↑ Back to top](#wordpress-panorama-gallery)

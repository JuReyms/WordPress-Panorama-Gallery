# WordPress Panorama Gallery

![WordPress](https://img.shields.io/badge/WordPress-6.5+-blue) ![PHP](https://img.shields.io/badge/PHP-7.4+-green)

**Contributeurs :** La Ferme Graphique  
**Tags :** block, panorama, horizontal, image, scroll  
**Version stable :** 2.0.0  
**Licence :** GPL-2.0-or-later

Affiche une grande image panoramique défilable horizontalement, avec une miniature sous l'image pour naviguer (minimap). Molette, glisser à la souris, glisser au doigt et clavier.

## Blocs

| Bloc | Rôle |
|---|---|
| `w0/panorama-gallery` (« Panorama ») | Le bloc à utiliser. |
| `lfg-block-custom/lfg-block-panorama` (« Panorama (ancien bloc LFG) ») | Reprise de l'ancien bloc de `lfg-block-custom`, pour les articles existants. Absent de l'outil d'insertion. Se transforme en bloc Panorama depuis la barre d'outils. |

Pourquoi deux blocs et deux dossiers : voir [blocks/README.md](blocks/README.md).

Les deux blocs ont le même rendu, fait côté serveur (`includes/render.php`). Le HTML enregistré dans les articles n'est jamais réécrit : il sert à la validation dans l'éditeur.

## Navigation et accessibilité

- Molette verticale changée en défilement horizontal ; au bord du panorama, la page reprend la main.
- Glisser à la souris ; au doigt, défilement natif du navigateur.
- Boutons ‹ › sur les bords (souris et pavé tactile seulement) et fondu du côté où il reste de l'image.
- Clavier : la zone défilante reçoit le focus (Tab), puis flèches gauche et droite, Page préc./suiv., Début, Fin.
- `aria-label` construit sur le texte alternatif, repris de la médiathèque s'il est vide dans le bloc.
- `prefers-reduced-motion` : défilement instantané, aucune transition.
- Images responsives (`srcset`, `sizes`) et chargement différé, à partir de l'ID de la médiathèque.

## Pleine définition

WordPress réduit toute image de plus de 2 560 px. Pour une image au moins trois fois plus large que haute, l'extension relève cette limite à 8 192 px (filtre `panorama_gallery_max_width`) et ajoute une taille de 4 096 px. Les autres images ne changent pas. Seuls les téléversements faits après l'activation sont concernés.

## Couleurs

Le style lit les préréglages du thème, avec un repli neutre si le thème ne les définit pas :

- `--wp--preset--color--surface` : fond de la zone et de la miniature ;
- `--wp--preset--color--accent` : barre de défilement, cadre de la miniature, focus ;
- `--wp--preset--color--border` : filet de la miniature.

Hauteur du panorama : variable `--panorama-height` (par défaut `clamp(180px, 34vw, 480px)`), modifiable par le thème.

## Structure

```
panorama-gallery.php     enregistrement des blocs et des fichiers
includes/render.php      rendu serveur commun
includes/media.php       panoramas en pleine définition
blocks/*/block.json      métadonnées des deux blocs
assets/editor.js         éditeur (sans étape de construction)
assets/view.js           comportement sur le site
assets/style.css         styles du site et de l'éditeur
assets/editor.css        styles de l'éditeur seul
```

Aucune étape de construction : le dossier se déploie tel quel.

## Remplacer lfg-block-custom

1. Installer et activer Panorama Gallery 2.0.0. Tant que `lfg-block-custom` est active, son bloc panorama et son script sont remplacés par ceux de cette extension.
2. Contrôler un article à panorama w0 et un article à panorama LFG, sur le site et dans l'éditeur.
3. Désactiver `lfg-block-custom`.

## Publier une version

1. Passer la version dans l'en-tête de `panorama-gallery.php` et dans `PANORAMA_GALLERY_VERSION`.
2. Ajouter sa section `## X.Y.Z` en haut de `CHANGELOG.md`.
3. Commiter et pousser `main`.
4. Lancer `bash bin/release.sh` : zip dans `dist/`, étiquette `vX.Y.Z`, release GitHub avec le zip et la section du journal.

`bash bin/release.sh --zip` construit seulement le zip. Le zip ne contient que les fichiers commités, sans les fichiers de développement (liste dans `.gitattributes`).

## Journal

Voir [CHANGELOG.md](CHANGELOG.md). Idées à venir : [ROADMAP.md](ROADMAP.md).

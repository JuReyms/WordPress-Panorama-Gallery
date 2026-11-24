# Journal des changements

## 2.0.2 (24/11/2026)

- La liste des articles propose un filtre « Avec un bloc Panorama » ou « Sans bloc Panorama », cumulable avec les catégories de WordPress.

## 2.0.1 (24/11/2026)

- L’extension s’affiche sous le nom « LFG - Panorama Gallery » dans WordPress.

## 2.0.0 (20/11/2026)

Panorama Gallery devient la seule extension panorama de onedeft.com : `lfg-block-custom` peut être désactivée sans casser d'article.

### Ajouté
- Reprise de l'ancien bloc `lfg-block-custom/lfg-block-panorama` (attributs `pictureID`, `pictureURL`, `pictureAlt`). Sa fonction save reproduit à l'identique le HTML enregistré : aucun bloc invalide dans l'éditeur, aucun contenu modifié en base. Il n'apparaît plus dans l'outil d'insertion et peut être transformé en bloc Panorama.
- Rendu serveur commun aux deux blocs : même balisage, même script, mêmes styles.
- Images responsives à partir de l'ID de la médiathèque : `srcset`, `sizes` calculé sur les proportions, `loading="lazy"`, `decoding="async"`, largeur et hauteur.
- Accessibilité : zone défilante atteignable au clavier (`tabindex="0"`, `role="region"`, `aria-label`), flèches gauche et droite, Page préc./suiv., Début, Fin. Focus visible. Texte alternatif modifiable dans l'éditeur ; vide, il est repris de la médiathèque. Miniature masquée aux lecteurs d'écran.
- Transformation d'une image (`core/image`) en panorama.
- Panoramas en pleine définition : pour une image au moins trois fois plus large que haute, la réduction automatique de WordPress passe de 2 560 à 8 192 px (filtre `panorama_gallery_max_width`), et une taille de 4 096 px est ajoutée. Les autres images ne changent pas. Seuls les nouveaux téléversements sont concernés.
- `srcset` des panoramas étendu au-delà des 2 048 px de WordPress.
- Boutons ‹ › sur les bords, pour la souris et le pavé tactile, masqués au bout du panorama et sur les écrans tactiles. Fondu sur le bord où il reste de l'image.
- Compatibilité avec `lfg-block-custom` encore active : son bloc panorama et son script `js/panorama.js` sont remplacés, ce qui permet d'activer cette version avant de désactiver l'ancienne extension.

### Corrigé
- Plusieurs panoramas par page : chaque bloc est indépendant (plus d'`id` partagé, plus de recherche de `#lfg-pano`, qui n'existait pas dans le balisage `#lfg-panorama-block`).
- La molette ne bloque plus la page : arrivé au bord du panorama, la page reprend le défilement.
- La miniature ne déborde plus sur mobile : sa largeur est limitée à celle du bloc.
- Le glisser à la souris ne se déclenche plus sur la barre de défilement.

### Modifié
- Couleurs tirées du thème avec repli neutre : `--wp--preset--color--surface`, `--wp--preset--color--accent`, `--wp--preset--color--border`. Plus de couleur, d'arrondi ni d'ombre codés en dur.
- `prefers-reduced-motion` respecté : défilement instantané et aucune transition.
- Glisser au doigt confié au défilement natif du navigateur (inertie comprise).
- Plus d'étape de construction : JavaScript simple sur les paquets globaux de WordPress, fichiers dans `assets/`, blocs dans `blocks/`. Le dossier `build/` et `package.json` disparaissent.
- WordPress 6.5 minimum.
- Suppression de l'exemple qui chargeait une image depuis via.placeholder.com.

## 1.0.0

Première version : bloc `w0/panorama-gallery` avec miniature de navigation.

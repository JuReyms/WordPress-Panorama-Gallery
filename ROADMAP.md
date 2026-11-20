# Feuille de route

Idées retenues pour les prochaines versions, par ordre d'intérêt.

| Idée | Ce que ça apporte | Notes |
|---|---|---|
| **Légende** | Un `figcaption` éditable sous le panorama, comme le bloc Image du cœur : lieu, année, artistes. | Attribut `caption` sur les deux blocs. Le HTML enregistré des anciens blocs n'a pas de légende : passer par le rendu serveur, pas par la save. |
| **Plein écran** | Bouton « Agrandir » qui ouvre le panorama à la hauteur de l'écran (API Fullscreen, sans dépendance). Gros gain sur mobile en paysage. | Sortie par Échap et par un bouton ; clavier et molette identiques. |
| **Point de départ** | Ouvrir le panorama au début, au centre, à la fin ou à un pourcentage choisi, quand le sujet n'est pas à gauche. | Attribut `start` ; appliqué après le chargement de l'image, sans animation. |
| **Hauteur par bloc** | Réglage compact / normal / haut, pour les panoramas très étroits. | Agit sur `--panorama-height`. |
| **Aperçu dans l'éditeur** | Miniature et point de départ visibles dans l'éditeur, pour voir ce que verra le visiteur. | Réutiliser `view.js` dans l'aperçu de l'éditeur. |
| **Un seul bloc** | Convertir les articles qui utilisent encore `lfg-block-custom/lfg-block-panorama` en bloc Panorama, puis retirer l'ancien nom (voir `blocks/README.md`). | Modifie le contenu de la base : script WP-CLI testé sur Local, puis décision de Julien. Pas urgent, le rendu est déjà identique. |
| **Anciens panoramas en pleine définition** | Les images téléversées avant la 2.0.0 restent réduites à 2 560 px. | Régénérer depuis l'original quand WordPress l'a gardé (`original_image`), sinon téléverser à nouveau. À faire avec une commande WP-CLI, sur Local d'abord. |

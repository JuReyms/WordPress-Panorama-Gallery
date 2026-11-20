# Pourquoi deux dossiers de blocs ?

Ce ne sont pas deux copies du même bloc : ce sont **deux noms de blocs** qui partagent **le même code**.

| Dossier | Bloc enregistré | Rôle |
|---|---|---|
| `panorama-gallery/` | `w0/panorama-gallery` | Le bloc « Panorama », celui à utiliser. Présent dans l'outil d'insertion. |
| `lfg-panorama/` | `lfg-block-custom/lfg-block-panorama` | L'ancien bloc de l'extension `lfg-block-custom`, gardé pour les articles qui l'utilisent déjà. Absent de l'outil d'insertion. |

## Pourquoi un dossier par bloc

WordPress enregistre un bloc par fichier `block.json`. Chaque dossier ne contient donc que ce fichier : le nom du bloc et ses attributs.

Tout le reste est commun et n'existe qu'une fois :

- rendu sur le site : `includes/render.php` ;
- éditeur : `assets/editor.js` ;
- comportement sur le site : `assets/view.js` ;
- styles : `assets/style.css` et `assets/editor.css`.

Les deux blocs ont donc exactement le même affichage.

## Pourquoi garder l'ancien nom

Chaque article enregistre le nom de ses blocs dans son contenu, par exemple :

```html
<!-- wp:lfg-block-custom/lfg-block-panorama {"pictureID":11028} -->
```

Sur onedeft.com, une trentaine d'articles portent ce nom. Si plus aucune extension ne l'enregistrait :

- l'éditeur afficherait ces blocs comme « non pris en charge » ;
- le site afficherait l'ancien HTML enregistré, sans miniature ni navigation.

Garder ce nom permet de désactiver `lfg-block-custom` sans toucher au contenu de la base.

## Et pour n'en garder qu'un ?

Il faudrait d'abord convertir ces articles en bloc Panorama :

- dans l'éditeur, article par article : barre d'outils du bloc, « Transformer en » Panorama ;
- ou d'un coup, avec un script WP-CLI, testé d'abord sur une copie locale.

Une fois aucun article ne l'utilisant plus, on pourra supprimer `lfg-panorama/` et son enregistrement dans `panorama-gallery.php`. C'est noté dans [ROADMAP.md](../ROADMAP.md).

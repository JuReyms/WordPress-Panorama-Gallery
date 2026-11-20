#!/usr/bin/env bash
# Publie une version de Panorama Gallery : zip, étiquette Git et release GitHub.
#
# Usage, depuis la racine du dépôt :
#   bash bin/release.sh            publie la version lue dans panorama-gallery.php
#   bash bin/release.sh --zip      construit seulement le zip dans dist/
#
# Avant : passer la version (en-tête de panorama-gallery.php et constante
# PANORAMA_GALLERY_VERSION) et ajouter sa section « ## X.Y.Z » à CHANGELOG.md,
# commiter et pousser main.
# Prérequis : git, et gh connecté à GitHub (gh auth status) pour publier.
set -euo pipefail

cd "$(dirname "$0")/.."

fail() { echo "Erreur : $*" >&2; exit 1; }

version=$(sed -n 's/^[ *]*Version:[[:space:]]*\([0-9][0-9.]*\).*/\1/p' panorama-gallery.php | head -1)
[ -n "$version" ] || fail "version introuvable dans panorama-gallery.php"
grep -q "define( 'PANORAMA_GALLERY_VERSION', '$version' )" panorama-gallery.php \
	|| fail "PANORAMA_GALLERY_VERSION ne vaut pas $version"

tag="v$version"
zip="dist/panorama-gallery-$version.zip"

# Notes de version : la section du journal, sans son titre.
notes=$(awk -v v="$version" '
	$0 ~ "^## " v "([^0-9.]|$)" { inside = 1; next }
	inside && /^## / { exit }
	inside { print }
' CHANGELOG.md)
[ -n "$(printf '%s' "$notes" | tr -d '[:space:]')" ] || fail "pas de section « ## $version » dans CHANGELOG.md"

mkdir -p dist
git archive --format=zip --prefix=panorama-gallery/ -o "$zip" HEAD
echo "Zip : $zip"

[ "${1:-}" = "--zip" ] && exit 0

# Publication : uniquement depuis main propre et identique à GitHub.
[ "$(git branch --show-current)" = "main" ] || fail "publier depuis main"
[ -z "$(git status --porcelain)" ] || fail "modifications non commitées"
git fetch --quiet origin main --tags
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || fail "main n'est pas identique à origin/main (push ou pull d'abord)"
git rev-parse -q --verify "refs/tags/$tag" >/dev/null && fail "l'étiquette $tag existe déjà"

git tag -a "$tag" -m "Panorama Gallery $version"
git push --quiet origin "$tag"
printf '%s\n' "$notes" | gh release create "$tag" "$zip" --title "Panorama Gallery $version" --notes-file -
echo "Publié : $tag"

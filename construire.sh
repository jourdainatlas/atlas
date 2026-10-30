#!/bin/sh
# Construit le site (site/) à partir du dossier contenu/ ; ATLAS_APERCU=1 écrit aussi construction/atlas.html.
set -e
cd "$(dirname "$0")"
python3 construire.py
# Le rendu tient dans le tas par défaut de Node (≈ 2 Go) ; 4 Go laissent de la marge à la croissance.
node --max-old-space-size=4096 rendu.mjs

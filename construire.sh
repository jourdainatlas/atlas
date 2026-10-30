#!/bin/sh
# Construit construction/atlas.html à partir du dossier contenu/.
set -e
cd "$(dirname "$0")"
python3 construire.py
# Le rendu tient aujourd'hui dans le tas par défaut de Node (≈ 2 Go) ; 4 Go laissent de la marge à la croissance.
node --max-old-space-size=4096 rendu.mjs

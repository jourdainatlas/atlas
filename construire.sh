#!/bin/sh
# Construit construction/atlas.html à partir du dossier contenu/.
set -e
cd "$(dirname "$0")"
python3 construire.py
node rendu.mjs

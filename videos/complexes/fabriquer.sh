#!/bin/sh
# Refait la vidéo « Nombres complexes » (Terminale Maths expertes) : out/complexes.mp4, 1920 × 1080, 30 images/s, 4 min 03 s.
# Il faut Node 22+, ffmpeg et Google Chrome ou Chromium. Compter une vingtaine de minutes.
#   sh videos/equations/fabriquer.sh
set -e
cd "$(dirname "$0")"
mkdir -p out
# 1. Ce qui est partagé avec la vidéo de présentation (moteur, polices, chien, jardinier) ou avec celle de la dérivation (commun.js) est copié ici : le moteur ne
#    sert que le dossier du film. Ces copies ne sont pas versionnées (.gitignore).
rm -rf ./engine ./fonts
cp -R ../presentation/engine ../presentation/fonts ../presentation/chien.js ../presentation/jardinier.js ../derivation/commun.js .
# 2. Les formules : formules.js est versionné ; pour le refaire après une retouche de formules-src.mjs,
#    installer MathJax hors dépôt (npm i mathjax-full@3 dans un dossier D) puis : node ../derivation/gen-formules.mjs D
# 3. La bande-son, synthétisée à partir de score.js.
LUFS=-14 node song.js
# 4. L'image (une image à la fois, dans Chrome sans écran), puis l'assemblage et le contrôle de la synchronisation.
node engine/render.js video
node engine/render.js mux
node engine/render.js verify --allow-unclear
ls -l out/complexes.mp4

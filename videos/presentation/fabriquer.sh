#!/bin/sh
# Refait la vidéo de présentation d'ATLAS : out/presentation-atlas.mp4 (1080 × 1920, 30 images/s, 48 s, H.264 + AAC).
# Il faut Node 22+, ffmpeg et Google Chrome ou Chromium. Compter trois à quatre minutes.
#   sh videos/presentation/fabriquer.sh            musique retenue (lo-fi, thème d'origine par citations)
#   MUSIQUE=marimba sh videos/presentation/fabriquer.sh      première musique (marimba et boîte à musique)
set -e
cd "$(dirname "$0")"
mkdir -p out
# 1. Les dessins tirés du site : symboles de gabarit.html, miniature de l'édifice (edifice-mini.json, voir extraire-edifice.mjs).
node gen-data.js ../../gabarit.html edifice-mini.json
# 2. La bande-son, synthétisée à partir de score.js.
if [ "$MUSIQUE" = "marimba" ]; then
  LUFS=-14 node song.js
else
  MELODIE=melange LUFS=-14 node song-lofi.js
  cp out/music-lofi-melange.wav out/music.wav
fi
# 3. L'image (une image à la fois, dans Chrome sans écran), puis l'assemblage et le contrôle de la synchronisation.
node engine/render.js video
node engine/render.js mux
node engine/render.js verify --allow-unclear
ls -l out/presentation.mp4

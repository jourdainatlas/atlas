#!/usr/bin/env python3
"""Écrit la fiche YouTube d'une vidéo du catalogue : titre, description avec repères de temps, mots-clés, réglages.

    python3 videos/fiche.py p-04 [dossier de sortie]

Les repères viennent des intertitres de `score.js`. YouTube n'active les chapitres que si le premier repère est 0:00
et si chaque chapitre dure au moins dix secondes : l'ouverture (huit secondes) est donc rattachée à la première partie.
"""
import json, pathlib, subprocess, sys

ICI = pathlib.Path(__file__).resolve().parent
SITE = 'https://www.atlasjourdain.fr'

def fiche(v):
    js = f"const S=require({json.dumps(str(ICI / v['dossier'] / 'score.js'))});console.log(JSON.stringify({{d:S.DURATION,c:S.intertitres.map(i=>[i.t,i.nom])}}))"
    sc = json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)
    mmss = lambda t: f'{int(t) // 60}:{int(t) % 60:02d}'
    bornes = [0.0] + [t for t, _ in sc['c'][1:]] + [sc['d']]
    assert len(sc['c']) >= 3 and all(b - a >= 10 for a, b in zip(bornes, bornes[1:])), 'chapitre de moins de dix secondes'
    reperes = '\n'.join(f"{mmss(0 if i == 0 else t)} {nom.replace('’', chr(39))}" for i, (t, nom) in enumerate(sc['c']))
    description = f"""{v['presentation']}

Le cours complet, rédigé et démontré, et ses {v['exercices']} exercices sont sur ATLAS :
{SITE}/cours/{v['cours']}/

La vidéo est sans voix : les explications s'affichent à l'écran. Mettez en pause pour lire à votre rythme.

Sommaire
{reperes}

ATLAS — L'architecture des mathématiques, de l'axiome au théorème
{SITE}/"""
    assert len(v['titre_youtube']) <= 100 and len(description) <= 5000 and len(', '.join(v['mots_cles'])) <= 500
    return f"""FICHE YOUTUBE — {v['niveau']}, chapitre {v['chapitre']} ({v['cours']})
Durée : {mmss(sc['d'])}. Fichiers : {v['fichier']}.mp4 (vidéo) et {v['fichier']}.jpg (miniature).

━━ TITRE ━━
{v['titre_youtube']}

━━ DESCRIPTION (à coller telle quelle) ━━
{description}

━━ MOTS-CLÉS ━━
{', '.join(v['mots_cles'])}

━━ RÉGLAGES CONSEILLÉS ━━
Miniature : importer {v['fichier']}.jpg.
Playlist : « {v['liste']} ».
Audience : « Non, elle n'est pas conçue pour les enfants » (le public visé est lycéen ou étudiant).
Catégorie : Éducation. Langue de la vidéo : français.
Visibilité : « Non répertoriée » le temps de la vérifier, puis « Publique ».

Une fois la vidéo en ligne, donner son adresse (https://youtu.be/…) : elle sera inscrite dans videos/catalogue.json.
"""

if __name__ == '__main__':
    cat = json.loads((ICI / 'catalogue.json').read_text(encoding='utf-8'))['videos']
    v = next(x for x in cat if x['cours'] == sys.argv[1])
    sortie = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else '.') / f"{v['fichier']}-fiche-youtube.txt"
    sortie.write_text(fiche(v), encoding='utf-8'); print(sortie)

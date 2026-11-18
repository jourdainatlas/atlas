#!/usr/bin/env python3
"""Assemble score.js et film.js d'une vidéo de cours à partir de videos/espace/ et des morceaux de films/<nom>/."""
import json, os, re, shutil, sys
nom = sys.argv[1]; ICI = os.path.dirname(os.path.abspath(__file__)); D = f'{ICI}/{nom}'; cfg = json.load(open(f'{D}/conf.json', encoding='utf-8'))
V = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); dst = f"{V}/{cfg['dossier']}"; os.makedirs(dst, exist_ok=True)
lit = lambda f: open(f, encoding='utf-8').read()
def rep(txt, o, n):
    assert o in txt, o[:80]
    return txt.replace(o, n)
for f in ['index.html', 'song.js', 'package.json', 'fabriquer.sh']:
    s = lit(f'{V}/espace/{f}')
    if f == 'fabriquer.sh': s = re.sub(r'« .*? » \(.*?\) : out/espace\.mp4', f"« {cfg['titre_long']} » ({cfg['niveau_long']}) : out/{cfg['dossier']}.mp4", s); s = s.replace('espace', cfg['dossier']); s = re.sub(r'\d min \d\d s', cfg.get('duree', '4 min 03 s'), s)
    if f == 'package.json': s = s.replace('espace', cfg['dossier'])
    open(f'{dst}/{f}', 'w', encoding='utf-8').write(s)
for f in ['engine', 'fonts']:
    if not os.path.exists(f'{dst}/{f}'): shutil.copytree(f'{V}/presentation/{f}', f'{dst}/{f}')
for f in ['chien.js', 'jardinier.js']: shutil.copy(f'{V}/presentation/{f}', dst)
shutil.copy(f'{V}/derivation/commun.js', dst); shutil.copy(f'{D}/formules-src.mjs', dst)
# ---- partition
s = lit(f'{V}/espace/score.js'); a = s.index("  // ---------- les parties"); b = s.index("  // ---------- le jardin du bas")
tete = rep(s[:a], "« La géométrie dans l'espace », Terminale spécialité, chapitre 4 du cours du site", cfg['entete_score'])
if 'bornes' in cfg:
    tete = rep(tete, "BORNES = [2, 6, 14, 22, 26, 34, 46]", f"BORNES = {cfg['bornes']}")
    tete = rep(tete, "const BILAN = 46, FIN = 50;", f"const BILAN = {cfg['bornes'][-1]}, FIN = {cfg['bornes'][-1] + 4};")
queue = rep(s[b:], "ouverture, repere, scalaire, plan, droite, positions, projete, bilan, fin, jardin };", f"ouverture, {', '.join(cfg['parties'])}, bilan, fin, jardin }};")
open(f'{dst}/score.js', 'w', encoding='utf-8').write(tete + lit(f'{D}/score-corps.js') + queue)
# ---- film
s = lit(f'{V}/espace/film.js'); a = s.index("  // ---------- outils de figure : une vue en perspective cavalière"); b = s.index("  // ---------- fin : le logo")
tete, queue = s[:a], s[b:]
tete = rep(tete, "// LE FILM — « La géométrie dans l'espace », Terminale spécialité, 1920 × 1080.", f"// LE FILM — « {cfg['titre_long']} », {cfg['niveau_long']}, 1920 × 1080.")
tete = rep(tete, "// Le chien y est tour à tour un point que l'on repère, un point du plan, le point de paramètre t, puis le point M\n// qui saute sur son projeté orthogonal.", cfg['role_chien'])
tete = rep(tete, "const TITRE = 'La géométrie dans l’espace', NIVEAU = 'TERMINALE SPÉCIALITÉ', LONG = 'TERMINALE SPÉCIALITÉ · CHAPITRE 4', NB_EXERCICES = 38;", f"const TITRE = '{cfg['titre']}', NIVEAU = '{cfg['niveau']}', LONG = '{cfg['long']}', NB_EXERCICES = {cfg['exercices']};")
tete = rep(tete, "ligne(ctx, 'Des figures aux {coordonnées}'", f"ligne(ctx, '{cfg['sous_titre']}'")
tete = rep(tete, "txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 112, w: 800, a: k1 });", f"txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, {{ size: {cfg.get('corps_titre', 112)}, w: 800, a: k1 }});")
queue = rep(queue, "txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 92, w: 800, a: k1 });", f"txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, {{ size: {cfg.get('corps_fin', 92)}, w: 800, a: k1 }});")
if 'pas_jardin' in cfg: queue = rep(queue, "(300 + 250 * k)", cfg['pas_jardin'])
a3 = queue.index("  // Le chien est l'acteur de quatre scènes (voir acteur)"); b3 = queue.index("  function chienA(t) {")
queue = queue[:a3] + lit(f'{D}/acteur.js') + queue[b3:]
a5 = queue.index("  // ---------- la vignette"); b5 = queue.index("  function draw(ctx, t) {")
queue = queue[:a5] + lit(f'{D}/vignette.js') + queue[b5:]
queue = rep(queue, "repere(ctx, ts); scalaire(ctx, ts); plan(ctx, ts); droite(ctx, ts); positions(ctx, ts); projete(ctx, ts); bilan(ctx, ts); fin(ctx, t);", ' '.join(f'{p}(ctx, ts);' for p in cfg['parties']) + " bilan(ctx, ts); fin(ctx, t);")
open(f'{dst}/film.js', 'w', encoding='utf-8').write(tete + lit(f'{ICI}/outils.js') + lit(f'{D}/scenes.js') + queue)
print('assemblé', dst)

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
B = cfg.get('bornes', [2, 6, 14, 22, 26, 34, 46])
def corps_auto():
    ch = ',\n'.join(f"    {{ id: '{p}', nom: {json.dumps(n, ensure_ascii=False)}, b0: {B[i]}, b1: {B[i + 1]} }}" for i, (p, n) in enumerate(zip(cfg['parties'], cfg['noms'])))
    return f"""  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
{ch},
  ].map((c, k) => ({{ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }}));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = {{ ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] }};

  // les événements que le son reprend : {{ t, g }} ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => {{ EV.push({{ t, g }}); return t; }};
  const N = (m, b) => ev(L(m, b)), P = (m, b) => ev(L(m, b), 'pas'), Cl = (m, b) => ev(L(m, b), 'cloche');   // raccourcis
  const G = (...l) => l.map(([a, b, c, d]) => [L(a, b), L(c, d)]);                                          // fenêtres des légendes

  const intertitres = [...CH.map((c) => ({{ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${{c.k + 1}} / ${{CH.length}}` }})), {{ t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }}];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = {{ logo, titre: ev(L(0, 3)), sous: L(1, 0.5) }};

""" + lit(f'{D}/score-parties.js') + """
  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

"""
open(f'{dst}/score.js', 'w', encoding='utf-8').write(tete + (lit(f'{D}/score-corps.js') if os.path.exists(f'{D}/score-corps.js') else corps_auto()) + queue)
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
ACTEUR = """  // Le chien joue les scènes décrites par ACTES_DEF (scenes.js) : il bondit sous l'écran, retombe du haut sur la figure,
  // y tient son rôle, puis redescend au jardin d'un saut presque vertical et regagne sa place au trot.
  const ACTES = ACTES_DEF(), EN_SCENE = ACTES.map((a) => a.en), T1 = S.CH.map((c) => c.t1);
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]), ...ACTES.map((a) => a.trajet)].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) { for (const a of ACTES) a.joue(ctx, t); }
"""
queue = queue[:a3] + (lit(f'{D}/acteur.js') if os.path.exists(f'{D}/acteur.js') else ACTEUR) + queue[b3:]
a5 = queue.index("  // ---------- la vignette"); b5 = queue.index("  function draw(ctx, t) {")
def vignette_auto():
    v = cfg['vignette']; n = len(v['titre'])
    lignes = ' '.join(f"txt(ctx, {json.dumps(l, ensure_ascii=False)}, 76, {(352 if n == 2 else 400) + 154 * i}, {{ size: {v.get('corps', 150)}, w: 800, align: 'left' }});" for i, l in enumerate(v['titre']))
    return f"""  // ---------- la vignette (image d'attente du lecteur, miniature YouTube) ----------
  // Elle n'appartient pas au film : `node engine/render.js stills 1000` la dessine (tout instant au-delà de la durée
  // plus 100 s). Le titre, la figure de vignetteFig (scenes.js), le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {{
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, {{ fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' }});
    {lignes}
    vignetteFig(ctx);
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }}

"""
queue = queue[:a5] + (lit(f'{D}/vignette.js') if os.path.exists(f'{D}/vignette.js') else vignette_auto()) + queue[b5:]
queue = rep(queue, "repere(ctx, ts); scalaire(ctx, ts); plan(ctx, ts); droite(ctx, ts); positions(ctx, ts); projete(ctx, ts); bilan(ctx, ts); fin(ctx, t);", ' '.join(f'{p}(ctx, ts);' for p in cfg['parties']) + " bilan(ctx, ts); fin(ctx, t);")
bil = ''
if 'bilan' in cfg:
    b = cfg['bilan']; J = lambda x: json.dumps(x, ensure_ascii=False)
    bil = f"  // ---------- bilan ----------\n  function bilan(ctx, t) {{ bilanCartes(ctx, t, {J(b['titre'])}, {J(b['ids'])}, {J(b['fs'])}, {J(b.get('lc', [540, 540, 540]))}, {J(b['tx'])}, {J(b['phrase'])}); }}\n\n"
open(f'{dst}/film.js', 'w', encoding='utf-8').write(tete + lit(f'{ICI}/outils.js') + lit(f'{D}/scenes.js') + bil + queue)
print('assemblé', dst)

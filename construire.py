#!/usr/bin/env python3
"""Construction de l'atlas, étape 1 : lecture et vérification du contenu, mise en page des graphes.

Lit contenu/*.yaml, vérifie la cohérence de l'ensemble, calcule la disposition de chaque
graphe et écrit construction/donnees.json, que rendu.mjs transforme ensuite en page HTML.

Vérifications bloquantes (le script s'arrête sur erreur) :
  - identifiants uniques, natures et familles connues ;
  - arêtes entre nœuds existants d'un même graphe, graphes sans cycle ;
  - chaque nœud « sous » renvoie à un graphe dont il est le conteneur, et réciproquement ;
  - cohérence entre niveaux : chaque entrée d'un sous-graphe est un ancêtre du conteneur
    dans le graphe parent, et chaque parent direct du conteneur figure parmi les entrées ;
  - tout terme [[id]] et tout lien {{id|...}} renvoie à une entrée existante ;
  - aucune arête tracée ne traverse un nœud.
Avertissements : termes du lexique jamais employés, arêtes redondantes non tracées.
"""
import glob, json, re, sys
from collections import defaultdict
import networkx as nx
import yaml

NATURES = {'théorie', 'chapitre', 'axiome', 'définition', 'théorème',
           'proposition', 'lemme', 'corollaire'}
NUMEROTEES = ['définition', 'proposition', 'lemme', 'théorème', 'corollaire']
FAMILLES = {'fond', 'ord', 'alg', 'top', 'mix', 'n', 'z', 'q', 'r', 'c'}
NOMBRES = {'n', 'z', 'q', 'r', 'c'}
CHAMPS_TEXTE = ['texte', 'enonce', 'preuve', 'choix']

erreurs, avertissements = [], []
def erreur(m): erreurs.append(m)
def avert(m): avertissements.append(m)

# ------------------------------------------------------------------ lecture
lexique = yaml.safe_load(open('contenu/lexique.yaml', encoding='utf-8'))
graphes = [yaml.safe_load(open(f, encoding='utf-8'))
           for f in sorted(glob.glob('contenu/*.yaml')) if not f.endswith('lexique.yaml')]

lex = {}
for e in lexique:
    if e['id'] in lex: erreur(f"lexique : id en double « {e['id']} »")
    lex[e['id']] = e

noeuds, G = {}, {}
for g in graphes:
    G[g['graphe']] = g
    g.setdefault('entrees', {})
    for n in g['noeuds']:
        if n['id'] in noeuds: erreur(f"nœud en double « {n['id']} »")
        n['graphe'] = g['graphe']
        n.setdefault('famille', 'mix')
        n.setdefault('titre', n['etiquette'])
        n.setdefault('remarques', [])
        if n['nature'] not in NATURES: erreur(f"{n['id']} : nature inconnue « {n['nature']} »")
        if n['famille'] not in FAMILLES: erreur(f"{n['id']} : famille inconnue « {n['famille']} »")
        noeuds[n['id']] = n

racines = [g for g in graphes if g['conteneur'] is None]
if len(racines) != 1: erreur("il faut exactement un graphe sans conteneur")

# ------------------------------------------------------------------ graphes
D, R = {}, {}   # graphe déclaré, réduction transitive
for g in graphes:
    gid, ids = g['graphe'], [n['id'] for n in g['noeuds']]
    d = nx.DiGraph(); d.add_nodes_from(ids)
    for a, b in g['aretes']:
        for x in (a, b):
            if x not in ids: erreur(f"[{gid}] arête {a}->{b} : « {x} » n'est pas un nœud de ce graphe")
        d.add_edge(a, b)
    if not nx.is_directed_acyclic_graph(d):
        erreur(f"[{gid}] cycle : {nx.find_cycle(d)}"); continue
    D[gid] = d
    R[gid] = nx.transitive_reduction(d); R[gid].add_nodes_from(ids)
    retirees = sorted(set(d.edges()) - set(R[gid].edges()))
    if retirees: avert(f"[{gid}] arêtes redondantes non tracées : {retirees}")

# ------------------------------------------------------------------ niveaux
for n in noeuds.values():
    if 'sous' in n:
        s = n['sous']
        if s not in G: erreur(f"{n['id']} : sous-graphe « {s} » introuvable")
        elif G[s]['conteneur'] != n['id']: erreur(f"{n['id']} : le graphe « {s} » a pour conteneur {G[s]['conteneur']}")
for g in graphes:
    k = g['conteneur']
    if k is None: continue
    if k not in noeuds: erreur(f"[{g['graphe']}] conteneur « {k} » inconnu"); continue
    if noeuds[k].get('sous') != g['graphe']: erreur(f"[{g['graphe']}] le nœud {k} ne pointe pas vers ce graphe")
    P = noeuds[k]['graphe']; g['parent'] = P
    if P not in D: continue
    anc = nx.ancestors(D[P], k)
    for e, cibles in g['entrees'].items():
        if e not in noeuds or noeuds[e]['graphe'] != P:
            erreur(f"[{g['graphe']}] entrée « {e} » absente du graphe parent {P}")
        elif e not in anc:
            erreur(f"[{g['graphe']}] entrée « {e} » : ce n'est pas un ancêtre de {k} dans {P}")
        for c in cibles:
            if c not in D[g['graphe']]: erreur(f"[{g['graphe']}] entrée {e} -> {c} : cible inconnue")
    for p in D[P].predecessors(k):
        if p not in g['entrees']:
            erreur(f"[{g['graphe']}] {p} est un parent direct de {k} dans {P} mais n'est pas une entrée")

# ------------------------------------------------------------------ références
RE_TERME = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]')
RE_LIEN = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}')
emplois = defaultdict(set)

def textes(n):
    for c in CHAMPS_TEXTE:
        if n.get(c): yield n[c]
    yield from n['remarques']

def verifie_refs(texte, ou, lieu=None):
    for t in RE_TERME.findall(texte):
        if t not in lex: erreur(f"{ou} : terme inconnu [[{t}]]")
        elif lieu: emplois[t].add(lieu)
    for t in RE_LIEN.findall(texte):
        if t not in noeuds: erreur(f"{ou} : lien vers un nœud inconnu {{{{{t}}}}}")

for n in noeuds.values():
    for t in textes(n): verifie_refs(t, n['id'], n['id'])
for e in lex.values():
    verifie_refs(e['definition'], f"lexique/{e['id']}")
for t in lex:
    if not emplois[t]:
        cites = [e['id'] for e in lex.values() if f'[[{t}' in e['definition']]
        if not cites: avert(f"lexique : « {t} » n'est employé nulle part")

# ------------------------------------------------------------------ rangs et numéros
for gid, d in D.items():
    for v in nx.topological_sort(d):
        noeuds[v]['rang'] = max((noeuds[p]['rang'] + 1 for p in d.predecessors(v)), default=0)
    compteur = defaultdict(int)
    ordre = list(nx.lexicographical_topological_sort(
        d, key=lambda v: [n['id'] for n in G[gid]['noeuds']].index(v)))
    for v in ordre:
        nat = noeuds[v]['nature']
        if nat in NUMEROTEES:
            compteur[nat] += 1; noeuds[v]['numero'] = compteur[nat]

if erreurs:
    print("ERREURS :"); [print("  -", e) for e in erreurs]; sys.exit(1)

# ------------------------------------------------------------------ mise en page
ECART_Y, MARGE = 108, 36
SEP_NOEUDS, SEP_FICTIF = 30, 18

def taille(n, entree=False):
    if n['famille'] in NOMBRES and not entree: return 48, 48
    lab = n['etiquette'] + (' ⋆' if n.get('choix') else '')
    larg = len(lab) * 7.1 + 30
    if larg <= 176: return max(larg, 92), 44
    return 176, 60

def disposer(gid):
    g = G[gid]
    r = R[gid].copy()
    entrees = list(g['entrees'])
    for e, cibles in g['entrees'].items():
        r.add_node('↑' + e)
        for c in cibles: r.add_edge('↑' + e, c)
    # rangs : plus long chemin depuis les sources
    # dans le graphe racine, il n'y a pas d'entrées ; ailleurs, elles occupent seules le rang 0
    plancher = 1 if entrees else 0
    rang = {}
    for v in nx.topological_sort(r):
        base = 0 if v.startswith('↑') else plancher
        rang[v] = max([base] + [rang[p] + 1 for p in r.predecessors(v)])
    # nœuds fictifs sur les arêtes longues
    chaines, couches = [], defaultdict(list)
    for v in r.nodes: couches[rang[v]].append(v)
    k = 0
    for a, b in r.edges():
        ch = [a]
        for t in range(rang[a] + 1, rang[b]):
            f = f'·{k}'; k += 1; rang[f] = t; couches[t].append(f); ch.append(f)
        ch.append(b); chaines.append(ch)
    nmax = max(rang.values())
    voisins_bas, voisins_haut = defaultdict(list), defaultdict(list)
    for ch in chaines:
        for u, v in zip(ch, ch[1:]): voisins_haut[u].append(v); voisins_bas[v].append(u)

    def croisements(ordre):
        pos = {v: i for c in ordre.values() for i, v in enumerate(c)}
        tot = 0
        for t in range(nmax):
            segs = [(pos[u], pos[v]) for u in ordre[t] for v in voisins_haut[u]]
            tot += sum(1 for i in range(len(segs)) for j in range(i + 1, len(segs))
                       if (segs[i][0] - segs[j][0]) * (segs[i][1] - segs[j][1]) < 0)
        return tot
    ordre = {t: list(couches[t]) for t in range(nmax + 1)}
    meilleur, score = {t: list(c) for t, c in ordre.items()}, croisements(ordre)
    for it in range(40):
        montee = it % 2 == 0
        rng = range(1, nmax + 1) if montee else range(nmax - 1, -1, -1)
        for t in rng:
            ref = {v: i for i, v in enumerate(ordre[t - 1 if montee else t + 1])}
            def bary(v, i):
                vs = [ref[w] for w in (voisins_bas[v] if montee else voisins_haut[v]) if w in ref]
                return (sum(vs) / len(vs), i) if vs else (i, i)
            ordre[t] = [v for i, v in sorted(enumerate(ordre[t]), key=lambda iv: bary(iv[1], iv[0]))]
        s = croisements(ordre)
        if s < score: meilleur, score = {t: list(c) for t, c in ordre.items()}, s
    ordre = meilleur

    dims = {}
    for v in rang:
        if v.startswith('·'): dims[v] = (0, 0)
        elif v.startswith('↑'): dims[v] = taille(noeuds[v[1:]], entree=True)
        else: dims[v] = taille(noeuds[v])
    def sep(a, b):
        fict = a.startswith('·') or b.startswith('·')
        return (dims[a][0] + dims[b][0]) / 2 + (SEP_FICTIF if fict else SEP_NOEUDS)
    x = {}
    for t, c in ordre.items():
        cur = 0
        for i, v in enumerate(c):
            if i: cur += sep(c[i - 1], v)
            x[v] = cur
    for it in range(60):
        rng = range(nmax + 1) if it % 2 == 0 else range(nmax, -1, -1)
        for t in rng:
            c = ordre[t]
            voulu = []
            for v in c:
                vs = voisins_bas[v] + voisins_haut[v]
                poids = [3 if (w.startswith('·') or v.startswith('·')) else 1 for w in vs]
                voulu.append(sum(x[w] * p for w, p in zip(vs, poids)) / sum(poids) if vs else x[v])
            # placement au plus près des positions voulues, ordre et écarts respectés
            g_ = list(voulu)
            for i in range(1, len(c)): g_[i] = max(g_[i], g_[i - 1] + sep(c[i - 1], c[i]))
            d_ = list(voulu)
            for i in range(len(c) - 2, -1, -1): d_[i] = min(d_[i], d_[i + 1] - sep(c[i], c[i + 1]))
            moy = [(a + b) / 2 for a, b in zip(g_, d_)]
            for i in range(1, len(c)): moy[i] = max(moy[i], moy[i - 1] + sep(c[i - 1], c[i]))
            for i, v in enumerate(c): x[v] = moy[i]
    xmin = min(x[v] - dims[v][0] / 2 for v in x)
    xmax = max(x[v] + dims[v][0] / 2 for v in x)
    decal = MARGE - xmin
    if gid == racines[0]['graphe']: decal += 64   # place des étiquettes de rang
    for v in x: x[v] += decal
    y = {v: MARGE + 10 + (nmax - rang[v]) * ECART_Y for v in rang}
    largeur = xmax - xmin + 2 * MARGE + (64 if gid == racines[0]['graphe'] else 0)
    hauteur = 2 * MARGE + 20 + nmax * ECART_Y

    places = []
    for v in rang:
        if v.startswith('·'): continue
        w, h = dims[v]
        places.append({'id': v[1:] if v.startswith('↑') else v, 'entree': v.startswith('↑'),
                       'x': round(x[v], 1), 'y': round(y[v], 1), 'w': round(w, 1), 'h': h})
    aretes, morceaux = [], []
    HMAX = max(h for w, h in dims.values())
    for ch in chaines:
        a, b = ch[0], ch[-1]
        pts = [(x[a], y[a] - dims[a][1] / 2)] + [(x[f], y[f]) for f in ch[1:-1]] + [(x[b], y[b] + dims[b][1] / 2 + 6)]
        centres = [y[v] for v in ch]
        dstr = f'M{pts[0][0]:.1f},{pts[0][1]:.1f}'
        for i, ((x0, y0), (x1, y1)) in enumerate(zip(pts, pts[1:])):
            # le changement d'abscisse se fait entièrement dans la bande libre entre deux couches
            yb = centres[i] - HMAX / 2 - 3
            ya = centres[i + 1] + HMAX / 2 + 3
            if y0 > yb:
                dstr += f' L{x0:.1f},{yb:.1f}'; morceaux.append((a, b, 'L', (x0, y0), (x0, yb)))
            else: yb = y0
            ym = (yb + ya) / 2
            dstr += f' C{x0:.1f},{ym:.1f} {x1:.1f},{ym:.1f} {x1:.1f},{ya:.1f}'
            morceaux.append((a, b, 'C', (x0, yb), (x0, ym), (x1, ym), (x1, ya)))
            if y1 < ya:
                dstr += f' L{x1:.1f},{y1:.1f}'; morceaux.append((a, b, 'L', (x1, ya), (x1, y1)))
        aretes.append({'de': a[1:] if a.startswith('↑') else a, 'vers': b,
                       'entree': a.startswith('↑'), 'd': dstr})
    # vérification : aucun tracé ne traverse un nœud autre que ses extrémités
    for m in morceaux:
        a, b, typ, pts_ = m[0], m[1], m[2], m[3:]
        for i in range(0, 61):
            t = i / 60
            if typ == 'L':
                (x0, y0), (x1, y1) = pts_
                px, py = x0 + t * (x1 - x0), y0 + t * (y1 - y0)
            else:
                (x0, y0), (c1x, c1y), (c2x, c2y), (x1, y1) = pts_
                u = 1 - t
                px = u**3 * x0 + 3 * u**2 * t * c1x + 3 * u * t**2 * c2x + t**3 * x1
                py = u**3 * y0 + 3 * u**2 * t * c1y + 3 * u * t**2 * c2y + t**3 * y1
            for v in rang:
                if v in (a, b) or v.startswith('·'): continue
                w, h = dims[v]
                if abs(px - x[v]) < w / 2 + 4 and abs(py - y[v]) < h / 2 + 4:
                    msg = f"[{gid}] l'arête {a}->{b} traverse {v}"
                    if msg not in erreurs: erreur(msg)
                    break
    rangs = []
    if gid == racines[0]['graphe']:
        rangs = [{'rang': t, 'y': MARGE + 10 + (nmax - t) * ECART_Y} for t in range(nmax + 1)]
    return {'largeur': round(largeur), 'hauteur': round(hauteur), 'noeuds': places,
            'aretes': aretes, 'rangs': rangs, 'croisements': score}

sortie = {'racine': racines[0]['graphe'], 'graphes': {}, 'noeuds': {}, 'lexique': {}}
for g in graphes:
    lay = disposer(g['graphe'])
    sortie['graphes'][g['graphe']] = {'id': g['graphe'], 'titre': g['titre'],
        'conteneur': g['conteneur'], 'parent': g.get('parent'), **lay}
    print(f"[{g['graphe']}] {len(g['noeuds'])} nœuds, {lay['largeur']}×{lay['hauteur']} px, "
          f"{lay['croisements']} croisement(s)")
if erreurs:
    print("ERREURS :"); [print("  -", e) for e in erreurs]; sys.exit(1)

for gid, d in D.items():
    g = G[gid]
    for n in g['noeuds']:
        v = n['id']
        amont = [e for e, cs in g['entrees'].items() if v in cs]
        sortie['noeuds'][v] = {k: n.get(k) for k in
            ['id', 'graphe', 'etiquette', 'titre', 'nature', 'famille', 'numero', 'rang',
             'texte', 'enonce', 'preuve', 'choix', 'remarques', 'sous']}
        sortie['noeuds'][v].update(parents=list(d.predecessors(v)), enfants=list(d.successors(v)),
                                   amont=amont)
for t, e in lex.items():
    sortie['lexique'][t] = {'id': t, 'terme': e['terme'], 'definition': e['definition'],
                            'emplois': sorted(emplois[t])}

import os; os.makedirs('construction', exist_ok=True)
json.dump(sortie, open('construction/donnees.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for a in avertissements: print("avertissement :", a)
print(f"OK : {len(noeuds)} nœuds, {len(lex)} termes, {len(G)} graphes.")

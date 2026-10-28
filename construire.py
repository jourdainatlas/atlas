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
  - un lien {{id|...}} dans un texte, un énoncé ou une démonstration renvoie à un nœud antérieur ;
  - aucune arête tracée ne traverse un nœud.
Avertissements : termes du lexique jamais employés, arêtes redondantes non tracées.
"""
import glob, json, os, re, sys
from collections import defaultdict
import networkx as nx
import yaml
import random

NATURES = {'théorie', 'chapitre', 'axiome', 'définition', 'théorème',
           'proposition', 'lemme', 'corollaire'}
NUMEROTEES = ['définition', 'proposition', 'lemme', 'théorème', 'corollaire']
FAMILLES = {'fond', 'ord', 'alg', 'top', 'ana', 'geo', 'ari', 'mix', 'n', 'z', 'q', 'r', 'c'}
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
RE_LEX = re.compile(r'\\lex\{([^}]+)\}')          # notation du lexique dans une formule

def termes(texte):
    """Termes du lexique employés : [[id]] dans le texte, \\lex{id}{...} dans les formules."""
    return RE_TERME.findall(texte) + RE_LEX.findall(texte)

def mentionne(texte, t):
    return f'[[{t}]' in texte or f'[[{t}|' in texte or f'\\lex{{{t}}}' in texte
emplois = defaultdict(set)

def textes(n):
    for c in CHAMPS_TEXTE:
        if n.get(c): yield n[c]
    yield from n['remarques']

def verifie_refs(texte, ou, lieu=None):
    for t in termes(texte):
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
        cites = [e['id'] for e in lex.values() if mentionne(e['definition'], t)]
        if not cites: avert(f"lexique : « {t} » n'est employé nulle part")

# ------------------------------------------------------------------ ordre d'apparition des notions
# Ordre global de l'atlas : arêtes de chaque graphe, entrées des sous-graphes ; chaque nœud
# intérieur vient après les parents de son conteneur et avant le conteneur lui-même (ce qui
# dépend d'une théorie dépend de tout son contenu).
# Un terme du lexique est défini au nœud indiqué par « defini_dans » ; on ne peut l'employer,
# dans un texte, un énoncé ou une démonstration, qu'en ce nœud ou après lui. Les remarques et
# les notes sur le choix peuvent renvoyer en avant : ces renvois sont seulement signalés.
ORDRE = nx.DiGraph(); ORDRE.add_nodes_from(noeuds)
for d in D.values(): ORDRE.add_edges_from(d.edges())
for g in graphes:
    for e, cibles in g['entrees'].items():
        for c in cibles: ORDRE.add_edge(e, c)
    if g['conteneur']:
        k = g['conteneur']
        for n in g['noeuds']:
            ORDRE.add_edge(n['id'], k)                 # le contenu précède son conteneur...
            for p in D[noeuds[k]['graphe']].predecessors(k):
                ORDRE.add_edge(p, n['id'])             # ...et suit les parents de ce conteneur
if not nx.is_directed_acyclic_graph(ORDRE):
    erreur(f"ordre global : cycle {nx.find_cycle(ORDRE)}")
avant = {v: nx.ancestors(ORDRE, v) | {v} for v in noeuds} if not erreurs else {}
renvois = []
for t, e in lex.items():
    if e.get('defini_dans') not in noeuds:
        erreur(f"lexique/{t} : « defini_dans » absent ou inconnu ({e.get('defini_dans')})")
    for v in e.get('voir', []):
        if v not in lex: erreur(f"lexique/{t} : « voir » renvoie au terme inconnu {v}")
if avant and not erreurs:
    for n in noeuds.values():
        for champ in ['texte', 'enonce', 'preuve']:
            for t in termes(n.get(champ) or ''):
                d = lex[t]['defini_dans']
                if d not in avant[n['id']]:
                    erreur(f"{n['id']}/{champ} emploie « {t} », défini plus loin, au nœud {d}")
            for t in RE_LIEN.findall(n.get(champ) or ''):
                if t in noeuds and t not in avant[n['id']]:
                    erreur(f"{n['id']}/{champ} renvoie au nœud {t}, qui vient plus loin ou ailleurs")
        for txt in n['remarques'] + ([n['choix']] if n.get('choix') else []):
            for t in termes(txt):
                if lex[t]['defini_dans'] not in avant[n['id']]:
                    renvois.append(f"{n['id']} → {t}")
    for t, e in lex.items():
        d = e['defini_dans']
        for t2 in termes(e['definition']):
            d2 = lex[t2]['defini_dans']
            if d2 not in avant[d]:
                erreur(f"lexique/{t} (défini au nœud {d}) emploie « {t2} », défini plus loin, au nœud {d2}")
        if not any(mentionne(x, t) for x in textes(noeuds[d])):
            avert(f"lexique/{t} : le nœud {d}, où il est défini, ne le mentionne pas")
    if renvois: avert(f"renvois en avant dans les remarques ({len(renvois)}) : " + ', '.join(sorted(renvois)))

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
    # Graphe reconstruit dans l'ordre des fichiers de contenu : sans cela, l'ordre de parcours
    # des ensembles, propre à chaque exécution de Python, changeait la disposition d'une fois à l'autre.
    rang_yaml = {n['id']: k for k, n in enumerate(g['noeuds'])}
    r = nx.DiGraph()
    r.add_nodes_from(sorted(R[gid].nodes, key=rang_yaml.get))
    r.add_edges_from(sorted(R[gid].edges, key=lambda e: (rang_yaml[e[0]], rang_yaml[e[1]])))
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

    # Ordre des nœuds dans chaque rang : on minimise les croisements d'arêtes.
    # Heuristique de Sugiyama : balayages par barycentres, puis échanges de voisins (transposition),
    # le tout à partir de plusieurs ordres de départ déterministes ; on garde le meilleur.
    def croisements_entre(ordre, t):
        bas = {v: i for i, v in enumerate(ordre[t])}
        haut = {v: i for i, v in enumerate(ordre[t + 1])}
        segs = [(bas[u], haut[v]) for u in ordre[t] for v in voisins_haut[u]]
        return sum(1 for i in range(len(segs)) for j in range(i + 1, len(segs))
                   if (segs[i][0] - segs[j][0]) * (segs[i][1] - segs[j][1]) < 0)
    def croisements(ordre):
        return sum(croisements_entre(ordre, t) for t in range(nmax))
    def autour(ordre, t):
        return (croisements_entre(ordre, t - 1) if t > 0 else 0) + (croisements_entre(ordre, t) if t < nmax else 0)
    def transposer(ordre):
        for _ in range(30):
            ameliore = False
            for t in range(nmax + 1):
                c = ordre[t]
                for i in range(len(c) - 1):
                    avant = autour(ordre, t)
                    c[i], c[i + 1] = c[i + 1], c[i]
                    if autour(ordre, t) < avant: ameliore = True
                    else: c[i], c[i + 1] = c[i + 1], c[i]
            if not ameliore: return
    def balayer(ordre):
        meilleur, score = {t: list(c) for t, c in ordre.items()}, croisements(ordre)
        for it in range(24):
            montee = it % 2 == 0
            rng = range(1, nmax + 1) if montee else range(nmax - 1, -1, -1)
            for t in rng:
                ref = {v: i for i, v in enumerate(ordre[t - 1 if montee else t + 1])}
                def bary(v, i):
                    vs = [ref[w] for w in (voisins_bas[v] if montee else voisins_haut[v]) if w in ref]
                    return (sum(vs) / len(vs), i) if vs else (i, i)
                ordre[t] = [v for i, v in sorted(enumerate(ordre[t]), key=lambda iv: bary(iv[1], iv[0]))]
            transposer(ordre)
            s = croisements(ordre)
            if s < score: meilleur, score = {t: list(c) for t, c in ordre.items()}, s
            if score == 0: break
        return meilleur, score
    departs = [{t: list(couches[t]) for t in range(nmax + 1)},
               {t: list(reversed(couches[t])) for t in range(nmax + 1)}]
    for graine in range(6):
        hasard = random.Random(graine)
        departs.append({t: hasard.sample(couches[t], len(couches[t])) for t in range(nmax + 1)})
    ordre, score = None, None
    for d in departs:
        o, s = balayer(d)
        if score is None or s < score: ordre, score = o, s
        if score == 0: break

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
                # Une feuille posée au-dessus (nœud sans successeur) suit son parent sans l'attirer :
                # sinon chaque embranchement décale la chaîne principale, et les décalages s'accumulent.
                poids = [p * (0.2 if (w in voisins_haut[v] and not voisins_haut[w] and len(vs) > 1) else 1)
                         for w, p in zip(vs, poids)]
                voulu.append(sum(x[w] * p for w, p in zip(vs, poids)) / sum(poids) if vs else x[v])
            # placement au plus près des positions voulues, ordre et écarts respectés
            g_ = list(voulu)
            for i in range(1, len(c)): g_[i] = max(g_[i], g_[i - 1] + sep(c[i - 1], c[i]))
            d_ = list(voulu)
            for i in range(len(c) - 2, -1, -1): d_[i] = min(d_[i], d_[i + 1] - sep(c[i], c[i + 1]))
            moy = [(a + b) / 2 for a, b in zip(g_, d_)]
            for i in range(1, len(c)): moy[i] = max(moy[i], moy[i - 1] + sep(c[i - 1], c[i]))
            for i, v in enumerate(c): x[v] = moy[i]
    # Redressement : une couche réduite à un seul nœud, de parent unique, est alignée sur ce parent,
    # et tout ce qui est au-dessus suit. Toute arête qui traverse la couche passe par ce nœud
    # (les arêtes longues y auraient un nœud fictif), donc aucune autre arête n'est déformée.
    for t in range(1, nmax + 1):
        c = ordre[t]
        if len(c) == 1 and len(voisins_bas[c[0]]) == 1:
            d = x[voisins_bas[c[0]][0]] - x[c[0]]
            for v in x:
                if rang[v] >= t: x[v] += d
    # Centrage de l'édifice (demande de l'auteur, 28 oct. 2026) : chaque couche est translatée pour que
    # le milieu de ses bulles soit à l'aplomb de la source (la logique). Une translation d'une couche
    # entière, nœuds fictifs compris, garde l'ordre dans chaque couche, donc le nombre de croisements ;
    # la vérification « aucune arête ne traverse un nœud », plus bas, porte sur le tracé obtenu.
    if gid == racines[0]['graphe']:
        sources = [v for v in ordre[0] if not v.startswith('·')]
        axe = (min(x[v] - dims[v][0] / 2 for v in sources) + max(x[v] + dims[v][0] / 2 for v in sources)) / 2
        for t in range(1, nmax + 1):
            vrais = [v for v in ordre[t] if not v.startswith('·')]
            if not vrais: continue
            milieu = (min(x[v] - dims[v][0] / 2 for v in vrais) + max(x[v] + dims[v][0] / 2 for v in vrais)) / 2
            for v in ordre[t]: x[v] += axe - milieu
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
                            'emplois': sorted(emplois[t]), 'defini': e['defini_dans'],
                            'voir': e.get('voir', []), 'notation': e.get('notation')}

# ------------------------------------------------------------------ rubriques (cours, exercices…)
# Fichiers rubriques/*.yaml : chaque rubrique est passée telle quelle à la page ; on vérifie
# seulement que les renvois vers l'atlas (nœuds, termes) et entre rubriques existent.
rubriques = {}
for f in sorted(glob.glob('rubriques/*.yaml')):
    rubriques[os.path.basename(f)[:-5]] = yaml.safe_load(open(f, encoding='utf-8')) or {}
def verifie_rubrique(nom, objet, ou):
    if isinstance(objet, dict):
        for cle, v in objet.items():
            if cle in ('theories', 'noeuds'):
                for t in v or []:
                    if t not in noeuds: erreur(f"rubriques/{nom} {ou} : nœud inconnu {t}")
            elif cle == 'notions':
                for t in v or []:
                    if t not in lex: erreur(f"rubriques/{nom} {ou} : terme inconnu {t}")
            else:
                verifie_rubrique(nom, v, f"{ou}/{objet.get('id', cle)}")
    elif isinstance(objet, list):
        for x in objet: verifie_rubrique(nom, x, ou)
    elif isinstance(objet, str):
        verifie_refs(objet, f"rubriques/{nom} {ou}")
# Les exercices d'une feuille peuvent être rangés dans rubriques/exercices/<feuille>.yaml (une liste).
# L'index du moteur des annales est rangé par session dans rubriques/annales-index/AAAA.yaml.
if 'annales-index' in rubriques:
    AI = rubriques['annales-index']; AI['sujets'] = AI.get('sujets') or []
    for f in sorted(glob.glob('rubriques/annales-index/*.yaml')):
        AI['sujets'] += yaml.safe_load(open(f, encoding='utf-8')) or []
    urls = [x['sujet'] for x in AI['sujets']]
    for u in set(x for x in urls if urls.count(x) > 1): erreur(f"rubriques/annales-index : sujet en double {u}")
if 'exercices' in rubriques:
    E = rubriques['exercices']; E.setdefault('exercices', [])
    for f in sorted(glob.glob('rubriques/exercices/*.yaml')):
        E['exercices'] += yaml.safe_load(open(f, encoding='utf-8')) or []
    ids = [e['id'] for e in E['exercices']]
    for i in set(x for x in ids if ids.count(x) > 1): erreur(f"rubriques/exercices : id en double {i}")
    for fe in E.get('feuilles', []):
        les = [e for e in E['exercices'] if e['feuille'] == fe['id']]
        if les:
            fe['nombre'] = len(les)
            fe['etoiles'] = [sum(1 for e in les if e['etoiles'] == k) for k in (1, 2, 3, 4)]
            fe['parties'] = list(dict.fromkeys(e['partie'] for e in les))
        for champ in ('pdf_enonce', 'pdf_corrige'):
            if fe.get(champ) and not os.path.isfile(fe[champ]):
                erreur(f"rubriques/exercices {fe['id']} : fichier introuvable {fe[champ]}")
    for e in E['exercices']:
        e['mots_cles'] = [m.strip().lower() if m.strip() != 'Python' else m for m in e.get('mots_cles', [])]
for nom, r in rubriques.items(): verifie_rubrique(nom, r, '')
if 'exercices' in rubriques and 'cours' in rubriques:
    ids_cours = {c['id'] for c in rubriques['cours'].get('cours', [])}
    ids_feuilles = {f['id'] for f in rubriques['exercices'].get('feuilles', [])}
    for c in rubriques['cours'].get('cours', []):
        if c.get('exercices') and c['exercices'] not in ids_feuilles:
            erreur(f"rubriques/cours {c['id']} : feuille inconnue {c['exercices']}")
    for fe in rubriques['exercices'].get('feuilles', []):
        if fe.get('cours') and fe['cours'] not in ids_cours:
            erreur(f"rubriques/exercices {fe['id']} : cours inconnu {fe['cours']}")
    for e in rubriques['exercices'].get('exercices', []):
        if e['feuille'] not in ids_feuilles:
            erreur(f"rubriques/exercices {e['id']} : feuille inconnue {e['feuille']}")
for c in rubriques.get('cours', {}).get('cours', []):
    for champ in ('pdf', 'tex'):
        if c.get(champ) and not os.path.isfile(c[champ]):
            erreur(f"rubriques/cours {c['id']} : fichier introuvable {c[champ]}")
# Cours : identifiants uniques, niveau déclaré, chapitres liés existants, numéros distincts par niveau.
if 'cours' in rubriques:
    Cr = rubriques['cours']
    ids_c = [c['id'] for c in Cr.get('cours', [])]
    for i in sorted(set(x for x in ids_c if ids_c.count(x) > 1)): erreur(f"rubriques/cours : id en double {i}")
    ids_niv = {n['id'] for n in Cr.get('niveaux', [])}
    vus = set()
    for c in Cr.get('cours', []):
        if c.get('niveau') not in ids_niv: erreur(f"rubriques/cours {c['id']} : niveau inconnu {c.get('niveau')}")
        for l in c.get('liens') or []:
            if l not in ids_c or l == c['id']: erreur(f"rubriques/cours {c['id']} : lien invalide {l}")
        if c.get('chapitre'):
            if (c['niveau'], c['chapitre']) in vus: erreur(f"rubriques/cours {c['id']} : chapitre {c['chapitre']} déjà pris au niveau {c['niveau']}")
            vus.add((c['niveau'], c['chapitre']))
if erreurs:
    print("ERREURS :"); [print("  -", e) for e in erreurs]; sys.exit(1)
sortie['rubriques'] = rubriques

import os; os.makedirs('construction', exist_ok=True)
json.dump(sortie, open('construction/donnees.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for a in avertissements: print("avertissement :", a)
print(f"OK : {len(noeuds)} nœuds, {len(lex)} termes, {len(G)} graphes.")

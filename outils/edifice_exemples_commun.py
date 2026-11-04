"""Chargement commun aux outils des exemples du lexique (edifice_exemples_*.py).

Lit contenu/*.yaml, contenu/lexique.yaml et contenu/exemples/<theorie>.yaml comme construire.py, sans rien
vérifier ni disposer (construire.py reste seul juge) : renvoie de quoi situer un terme dans l'ordre de l'atlas.

    from edifice_exemples_commun import charge
    A = charge()
    A.lex[id]            entrée du lexique, avec 'exemples' (liste, éventuellement vide) et 'theorie'
    A.noeuds[v]          nœud (avec 'graphe', 'remarques')
    A.avant[v]           nœuds en amont de v dans l'ordre global, v compris (ORDRE de construire.py)
    A.theorie_de(v)      théorie de premier niveau qui contient v
    A.emplois[id]        nœuds dont le texte, l'énoncé, la preuve, le choix ou une remarque emploient le terme
    A.theories           théories du graphe racine, dans l'ordre du fichier edifice.yaml

Option commune des outils : --theorie <id> (ou --theorie tout).
"""
import glob
import os
import re
import sys
from collections import defaultdict

import networkx as nx
import yaml

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RE_TERME = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]')
RE_LEX = re.compile(r'\\lex\{([^}]+)\}')
RE_LIEN = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}')
# même liste que construire.py (RE_ANNONCE) : phrase qui annonce une ouverture vers l'aval
RE_ANNONCE = re.compile(r"\b(?:plus loin|montrera|montreront|établira|établiront|verra|verrons|sera (?:démontré|établi|vu|défini)e?s?"
                        r"|seront (?:démontré|établi|vu|défini)e?s|chapitre suivant|par la suite)\b", re.I)


def termes(texte):
    return RE_TERME.findall(texte or '') + RE_LEX.findall(texte or '')


class Atlas:
    pass


def charge():
    A = Atlas()
    lexique = yaml.safe_load(open(os.path.join(RACINE, 'contenu/lexique.yaml'), encoding='utf-8'))
    graphes = []
    for f in sorted(glob.glob(os.path.join(RACINE, 'contenu/*.yaml'))):
        if f.endswith('lexique.yaml'):
            continue
        g = yaml.safe_load(open(f, encoding='utf-8'))
        g['_fichier'] = os.path.relpath(f, RACINE)
        graphes.append(g)
    noeuds, G, D = {}, {}, {}
    for g in graphes:
        G[g['graphe']] = g
        g.setdefault('entrees', {})
        for n in g['noeuds']:
            n['graphe'] = g['graphe']
            n['_fichier'] = g['_fichier']
            n.setdefault('remarques', [])
            n.setdefault('titre', n['etiquette'])
            noeuds[n['id']] = n
        d = nx.DiGraph()
        d.add_nodes_from(n['id'] for n in g['noeuds'])
        d.add_edges_from(map(tuple, g['aretes']))
        D[g['graphe']] = d
    O = nx.DiGraph()
    O.add_nodes_from(noeuds)
    for d in D.values():
        O.add_edges_from(d.edges())
    for g in graphes:
        for e, cs in g['entrees'].items():
            for c in cs:
                O.add_edge(e, c)
        if g['conteneur']:
            k = g['conteneur']
            P = noeuds[k]['graphe']
            amont = list(D[P].predecessors(k)) + [e for e, cs in G[P]['entrees'].items() if k in cs]
            for n in g['noeuds']:
                O.add_edge(n['id'], k)
                for p in amont:
                    O.add_edge(p, n['id'])
    A.noeuds, A.G = noeuds, G
    A.avant = {v: nx.ancestors(O, v) | {v} for v in noeuds}
    racine = next(g for g in graphes if g['conteneur'] is None)
    A.racine = racine['graphe']
    A.theories = [n['id'] for n in racine['noeuds']]

    def theorie_de(v):
        while v in noeuds and noeuds[v]['graphe'] != A.racine:
            v = G[noeuds[v]['graphe']]['conteneur']
        return v if v in noeuds else None
    A.theorie_de = theorie_de

    A.lex = {e['id']: e for e in lexique}
    for e in lexique:
        e['exemples'] = []
        e['theorie'] = theorie_de(e['defini_dans'])
    A.fichier_exemples = {}
    for f in sorted(glob.glob(os.path.join(RACINE, 'contenu/exemples/*.yaml'))):
        th = os.path.basename(f)[:-5]
        for t, xs in ((yaml.safe_load(open(f, encoding='utf-8')) or {}).get('exemples') or {}).items():
            if t in A.lex:
                A.lex[t]['exemples'] = xs or []
                A.fichier_exemples[t] = th
    A.lexique = lexique

    emplois = defaultdict(set)
    for n in noeuds.values():
        for c in ['texte', 'enonce', 'preuve', 'choix']:
            for t in termes(n.get(c)):
                emplois[t].add(n['id'])
        for r in n['remarques']:
            for t in termes(r):
                emplois[t].add(n['id'])
    A.emplois = emplois
    return A


def theories_demandees(A, argv=None):
    """Valeur de --theorie (une théorie, ou « tout », ou absente : tout) ; arrêt sur un nom inconnu."""
    argv = sys.argv[1:] if argv is None else argv
    if '--theorie' not in argv:
        return list(A.theories)
    k = argv.index('--theorie')
    if k + 1 >= len(argv):
        raise SystemExit('--theorie demande un nom (ou « tout »)')
    th = argv[k + 1]
    if th == 'tout':
        return list(A.theories)
    if th not in A.theories:
        raise SystemExit(f'théorie inconnue « {th} » ; théories : {", ".join(A.theories)}')
    return [th]

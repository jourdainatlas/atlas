#!/usr/bin/env python3
"""Diagnostic de l'ordre logique de l'édifice : liste des cas suspects, sans rien bloquer.

construire.py garantit déjà que les liens {{nœud|…}} et les termes [[terme]] ou \\lex{terme}{…} d'un texte,
d'un énoncé ou d'une démonstration ne visent que l'amont. Ce script cherche ce que ce contrôle ne voit pas :

  A. notations employées sans balise hors de l'aval de leur fiche de définition (exp, sin, π, ℂ, det, ∫, …) ;
  B. numéros de point cités qui n'existent pas dans la fiche visée : « {{x|…}}, (iii) » ;
  C. « même nœud, (iii) » : le nœud désigné est le dernier cité ; le point doit y exister ;
  D. choix non transmis : une fiche sans champ « choix » qui cite, hors remarque, une fiche marquée ⋆
     (D2 : cas probablement légitimes, points cités disjoints de ceux qui utilisent le choix, ou convention
     de la mesure de Lebesgue) ;
  E. admis non transmis : une fiche qui cite, hors remarque, une fiche dont l'énoncé ou la preuve est admis,
     sans le dire ;
  F. termes du lexique écrits en clair (sans [[…]]) dans une fiche qui ne vient pas après leur définition.

Usage : python3 outils/edifice_diagnostic.py [--detail] [graphe …]
Écrit construction/diagnostic.md (liste complète) et affiche le bilan par catégorie.
Les cas listés sont des candidats : beaucoup sont légitimes (un point de la fiche visée qui n'utilise pas
le choix, une notation définie localement…) ; chacun demande un regard.
"""
import glob, re, sys, os
from collections import defaultdict
import networkx as nx
import yaml

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

# ------------------------------------------------------------------ lecture et ordre global (comme construire.py)
lexique = yaml.safe_load(open('contenu/lexique.yaml', encoding='utf-8'))
lex = {e['id']: e for e in lexique}
graphes = [yaml.safe_load(open(f, encoding='utf-8'))
           for f in sorted(glob.glob('contenu/*.yaml')) if not f.endswith('lexique.yaml')]
noeuds, G, D = {}, {}, {}
for g in graphes:
    G[g['graphe']] = g
    g.setdefault('entrees', {})
    for n in g['noeuds']:
        n['graphe'] = g['graphe']
        n.setdefault('remarques', [])
        noeuds[n['id']] = n
    d = nx.DiGraph(); d.add_nodes_from(n['id'] for n in g['noeuds']); d.add_edges_from(map(tuple, g['aretes']))
    D[g['graphe']] = d
ORDRE = nx.DiGraph(); ORDRE.add_nodes_from(noeuds)
for d in D.values(): ORDRE.add_edges_from(d.edges())
for g in graphes:
    for e, cibles in g['entrees'].items():
        for c in cibles: ORDRE.add_edge(e, c)
    if g['conteneur']:
        k = g['conteneur']; P = noeuds[k]['graphe']
        amont = list(D[P].predecessors(k)) + [e for e, cs in G[P]['entrees'].items() if k in cs]
        for n in g['noeuds']:
            ORDRE.add_edge(n['id'], k)
            for p in amont: ORDRE.add_edge(p, n['id'])
avant = {v: nx.ancestors(ORDRE, v) | {v} for v in noeuds}
FICHE = lambda n: n['nature'] not in ('théorie', 'chapitre')

args = [a for a in sys.argv[1:] if not a.startswith('--')]
DETAIL = '--detail' in sys.argv
def retenu(n):
    return not args or n['graphe'] in args

CHAMPS = ['texte', 'enonce', 'preuve']
RE_LIEN = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}')
RE_POINT = re.compile(r'\(([ivx]{1,5})\)')
RE_CITE = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}\s*,?\s*((?:\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*)?)+)')
RE_MEME = re.compile(r'm[êe]me n[œo]e?ud\s*,\s*((?:\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*)?)+)')
ROMAINS = set('i ii iii iv v vi vii viii ix x xi xii'.split())

def points(n):
    """Numéros de point définis par une fiche : ceux de l'énoncé et du texte, une fois retirées les citations
    d'autres fiches (« {{x|…}}, (ii) », « même nœud, (ii) ») ; à défaut, ceux de la démonstration."""
    def pris(t):
        t = RE_CITE.sub(' ', t); t = RE_MEME.sub(' ', t)
        return {p for p in RE_POINT.findall(t) if p in ROMAINS}
    s = pris(str(n.get('enonce') or '')) | pris(str(n.get('texte') or ''))
    return s or pris(str(n.get('preuve') or ''))

def sans_balises(t):
    """Texte sans les liens, les termes balisés ni les \\lex, pour chercher les mentions en clair."""
    t = re.sub(r'\{\{[^}]*\}\}', ' ', t)
    t = re.sub(r'\[\[[^\]]*\]\]', ' ', t)
    t = re.sub(r'\\lex\{[^}]*\}\{[^}]*\}', ' ', t)
    return t

cas = defaultdict(list)     # catégorie -> [(graphe, nœud, message)]
def note(cat, n, msg): cas[cat].append((n['graphe'], n['id'], msg))

# ------------------------------------------------------------------ A. notations sans balise
# Chaque notation a une ou plusieurs fiches de définition ; l'emploi est suspect si aucune n'est en amont.
NOTATIONS = [
    ('exponentielle', r'\\exp\b|(?<![A-Za-z\\])e\^\{', ['cx-exponentielle', 'ed-lineaires', 'lp-puissances']),
    ('logarithme', r'\\ln\b|\\log\b', ['nb-logarithme', 'lp-puissances']),
    ('sinus, cosinus', r'\\sin\b|\\cos\b|\\tan\b', ['cx-exponentielle']),
    ('le nombre π', r'(?:\d|(?<![A-Za-z\\])i)\s*\\pi\b|\\pi\s*/\s*\d|\\frac\s*\{\d*\s*\\pi|\\frac\\pi|\\pi\^2|\\pi\}\{\d', ['cx-pi']),
    ('ℂ', r'\\mathbb\s*C\b|ℂ', ['c-construction']),
    ('ℝ', r'\\mathbb\s*R\b|ℝ', ['rr-definition']),
    ('ℚ', r'\\mathbb\s*Q\b|ℚ', ['q-construction']),
    ('déterminant', r'\\det\b|déterminant', ['v-determinant', 'v-det-matrice', 'v-formes-alternees']),
    ('racine carrée', r'\\sqrt(?!\s*\{?\s*(?:[IJ]|\\mathfrak))\b|racine carrée', ['c-racine-reelle', 'lp-puissances', 'me-espace', 'tr-dense']),
    ('mesure de Lebesgue', r'mesure de Lebesgue', ['m-lebesgue']),
    ('intégrale', r'\\int\b|intégrale', ['ri-integrable', 'ri-sommes', 'ri-integrale-escalier', 'm-integrale', 'cx-integrale-chemin', 'gd-integrale-curviligne', 'dr-iterees']),
    ('dérivée', r"(?<!règles )dérivée(?!s)|dérivable", ['de-derivee', 'pol-derivee', 'gd-differentielle']),
    ('limite', r'\\lim\b', ['su-convergence', 'de-limite', 't-separe', 'm-mesures']),
    ('valeur propre', r'valeurs? propres?', ['v-valeurs-propres']),
]
for nom, motif, defs in NOTATIONS:
    defs = [d for d in defs if d in noeuds]
    if not defs: continue
    rx = re.compile(motif)
    for n in noeuds.values():
        if not FICHE(n) or not retenu(n): continue
        if any(d in avant[n['id']] for d in defs): continue
        for c in CHAMPS:
            t = sans_balises(str(n.get(c) or ''))
            m = rx.search(t)
            if m:
                ext = t[max(0, m.start() - 40): m.end() + 40].replace('\n', ' ')
                note('A', n, f"« {nom} » ({c}) sans définition en amont ({', '.join(defs)}) : …{ext}…")
                break

# ------------------------------------------------------------------ B et C. numéros de point
for n in noeuds.values():
    if not retenu(n): continue
    for c in CHAMPS + ['remarques']:
        txts = n['remarques'] if c == 'remarques' else [str(n.get(c) or '')]
        for t in txts:
            for m in RE_CITE.finditer(t):
                cible = m.group(1)
                if cible not in noeuds: continue
                pts = set(RE_POINT.findall(m.group(2)))
                manque = sorted(pts - points(noeuds[cible]))
                if manque:
                    note('B', n, f"{c} : {{{{{cible}}}}}, ({', '.join(manque)}) : point absent de {cible}")
            for m in RE_MEME.finditer(t):
                prec = RE_LIEN.findall(t[:m.start()])
                pts = set(RE_POINT.findall(m.group(1)))
                if not prec:
                    if pts - points(n):
                        note('C', n, f"{c} : « même nœud, ({', '.join(sorted(pts))}) » sans nœud cité avant, point absent de la fiche")
                    continue
                cible = prec[-1]
                if cible in noeuds and pts - points(noeuds[cible]):
                    ici = '' if pts - points(n) else f" (le point existe dans {n['id']} : renvoi à soi-même ?)"
                    note('C', n, f"{c} : « même nœud, ({', '.join(sorted(pts))}) » vise {cible}, où ce point manque{ici}")

# ------------------------------------------------------------------ D. choix non transmis
def a_choix(n): return bool(str(n.get('choix') or '').strip())
for n in noeuds.values():
    if not FICHE(n) or not retenu(n) or a_choix(n): continue
    cites = defaultdict(set)          # fiche citée -> points cités (vide : la fiche entière)
    for c in CHAMPS:
        t = str(n.get(c) or '')
        for x in RE_LIEN.findall(t): cites[x]
        for m in RE_CITE.finditer(t): cites[m.group(1)] |= set(RE_POINT.findall(m.group(2)))
    for x in sorted(cites):
        if x in noeuds and FICHE(noeuds[x]) and a_choix(noeuds[x]):
            ch = ' '.join(str(noeuds[x]['choix']).split())
            vises = {p for p in RE_POINT.findall(ch) if p in ROMAINS}
            if x == 'm-lebesgue':
                note('D2', n, f"cite {x} (convention : le ⋆ de la mesure de Lebesgue n'est pas recompté)")
            elif cites[x] and vises and not (cites[x] & vises):
                note('D2', n, f"cite {x}, ({', '.join(sorted(cites[x]))}), alors que son ⋆ porte sur ({', '.join(sorted(vises))})")
            else:
                pts = f", ({', '.join(sorted(cites[x]))})" if cites[x] else ''
                note('D', n, f"cite {x}{pts}, marqué ⋆ : « {ch[:110]}… »")

# ------------------------------------------------------------------ E. admis non transmis
RE_ADMIS = re.compile(r'\b[Aa]dmise?s?\b')
admis = {i for i, n in noeuds.items() if FICHE(n) and (RE_ADMIS.search(str(n.get('preuve') or ''))
                                                       or RE_ADMIS.search(str(n.get('enonce') or ''))
                                                       or not str(n.get('preuve') or '').strip() and n['nature'] in ('théorème', 'proposition', 'lemme', 'corollaire'))}
for n in noeuds.values():
    if not FICHE(n) or not retenu(n): continue
    tout = ' '.join(str(n.get(c) or '') for c in CHAMPS + ['choix']) + ' '.join(n['remarques'])
    cites = set()
    for c in CHAMPS: cites |= set(RE_LIEN.findall(str(n.get(c) or '')))
    for x in sorted(cites & admis):
        if x == n['id']: continue
        if not RE_ADMIS.search(tout):
            note('E', n, f"cite {x}, dont l'énoncé ou la preuve est admis, sans le dire")

# ------------------------------------------------------------------ F. termes écrits en clair avant leur définition
for t, e in lex.items():
    mot = e.get('terme') or ''
    if len(mot) < 9 or ' ' not in mot: continue        # expressions de plusieurs mots seulement
    rx = re.compile(r'(?<![\w-])' + re.escape(mot) + r's?(?![\w-])', re.I)
    d = e['defini_dans']
    if d not in noeuds: continue
    for n in noeuds.values():
        if not FICHE(n) or not retenu(n) or d in avant[n['id']]: continue
        for c in CHAMPS:
            s = sans_balises(str(n.get(c) or ''))
            s = re.sub(r'\$[^$]*\$', ' ', s)
            m = rx.search(s)
            if m:
                note('F', n, f"« {mot} » en clair ({c}), défini plus loin en {d} : …{s[max(0, m.start()-40):m.end()+30]}…".replace('\n', ' '))
                break

# ------------------------------------------------------------------ rapport
TITRES = {'A': 'Notations sans définition en amont', 'B': 'Points cités absents de la fiche visée',
          'C': '« même nœud » douteux', 'D': 'Choix non transmis', 'D2': 'Choix non transmis, probablement légitime',
          'E': 'Admis non transmis',
          'F': 'Termes en clair avant leur définition'}
lignes = ['# Diagnostic de l\'ordre logique de l\'édifice', '',
          f'{len(noeuds)} nœuds, {len(lex)} termes. Candidats à examiner, non des erreurs certaines.', '']
for k in ['A', 'B', 'C', 'D', 'D2', 'E', 'F']:
    l = sorted(cas[k])
    lignes += [f'## {k}. {TITRES[k]} ({len(l)})', '']
    par_graphe = defaultdict(list)
    for g, i, m in l: par_graphe[g].append((i, m))
    for g in sorted(par_graphe):
        lignes.append(f'### {g} ({len(par_graphe[g])})')
        lignes += [f'- `{i}` : {m}' for i, m in par_graphe[g]]
        lignes.append('')
os.makedirs('construction', exist_ok=True)
open('construction/diagnostic.md', 'w', encoding='utf-8').write('\n'.join(lignes))
print(f"{len(noeuds)} nœuds examinés" + (f" (graphes : {', '.join(args)})" if args else ''))
for k in ['A', 'B', 'C', 'D', 'D2', 'E', 'F']:
    par = defaultdict(int)
    for g, _, _ in cas[k]: par[g] += 1
    top = ', '.join(f'{g} {v}' for g, v in sorted(par.items(), key=lambda x: -x[1])[:6])
    print(f"  {k}. {TITRES[k]} : {len(cas[k])}" + (f"  [{top}]" if top else ''))
    if DETAIL:
        for g, i, m in sorted(cas[k]): print(f"      {i} : {m[:160]}")
print("Liste complète : construction/diagnostic.md")

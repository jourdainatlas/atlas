#!/usr/bin/env python3
"""Diagnostic de l'ordre logique de l'édifice : liste des cas suspects, sans rien bloquer.

construire.py garantit déjà que les liens {{nœud|…}} et les termes [[terme]] ou \\lex{terme}{…} d'un texte,
d'un énoncé ou d'une démonstration ne visent que l'amont. Ce script cherche ce que ce contrôle ne voit pas :

  A. notations employées sans balise hors de l'aval de leur fiche de définition (exp, sin, π, ℂ, det, ∫, …) ;
     seuls le texte, l'énoncé et la preuve sont lus : un schéma (bloc ```schema) placé dans une remarque
     n'est jamais signalé ;
  B. numéros de point cités qui n'existent pas dans la fiche visée : « {{x|…}}, (iii) » ;
  C. « même nœud, (iii) » : le nœud désigné est le dernier cité ; le point doit y exister ;
  D. choix non transmis : une fiche sans champ « choix » cite, hors remarque, une fiche marquée ⋆, et rien
     n'indique que la partie citée est sans choix. Pour chaque citation, on lit les points cités, sous toutes
     leurs formes (« {{x|…}}, (i) et (ii) », « {{x|…}}, sens direct de (iv) », « cas (ii) », « seconde
     affirmation de (i) », « le point (ii) du nœud {{x|…}} », « par le cas dénombrable (i) du {{x|…}} ») ;
     on lit dans le champ choix de la fiche citée, proposition par proposition, les points déclarés sans
     choix (« n'utilisent aucun choix », « n'en font aucun », « Les points (i) à (iii) … », « le reste … »,
     « le sens direct n'en demande aucun ») et ceux qui en font un, en entier ou en partie (« la réciproque
     de (iii) », « l'existence dans (iv) »). Une citation dont tous les points sont déclarés sans choix est
     écartée (comptée à part). Les citations sans point du champ texte, simples renvois à une définition,
     sont ignorées. Restent :
     D  la fiche citée fait elle-même le choix (en tout, ou en partie si le point est marqué « partiel ») ;
     D2 cas probablement légitimes : la fiche qui cite déclare, dans la phrase de la citation ou la suivante,
        qu'aucun choix n'est fait (« sans choix », « rien n'est choisi », « n'ajoute aucun choix ») ; points
        cités non mentionnés par un champ choix qui en nomme d'autres ; convention de la mesure de Lebesgue ;
     D3 héritage transitif : comme D, mais la fiche citée hérite elle-même son ⋆ d'une autre (lien ou nom en
        clair dans son champ choix) ; la cascade est affichée jusqu'à l'origine ;
     D4 citation par son nom en clair d'un résultat ⋆ (« théorème de Baire », « lemme de Zorn », table
        NOMS_ETOILES à compléter) dans une fiche sans champ choix qui ne lie pas ce résultat ;
  E. admis non transmis : une fiche qui cite, hors remarque, une fiche dont l'énoncé ou la preuve est admis,
     sans le dire ;
  F. termes du lexique écrits en clair (sans [[…]]) dans une fiche qui ne vient pas après leur définition.
     Sont écartés : un terme défini sur place (en gras **…**, ou suivi, dans la même phrase, de « c'est-à-dire ») ; un
     terme défini en gras dans une fiche en amont (y compris « sous-espace … **stable** »,
     l'adjectif en gras et le nom dans la phrase) ; une mention annoncée (« construira », « établira »,
     « sera défini », « les nœuds qui suivent »…) ; une preuve « Admis ici » ; un homonyme du lexique (même
     libellé, parenthèse ôtée) défini en amont.

Usage : python3 outils/edifice_diagnostic.py [--detail] [--racine <dossier>] [graphe …]
--racine lit <dossier>/contenu au lieu du dépôt et écrit <dossier>/construction/diagnostic.md : on s'en sert
pour rejouer l'outil sur un état antérieur extrait par « git archive <commit> contenu | tar -x -C <dossier> ».
Écrit construction/diagnostic.md (liste complète) et affiche le bilan par catégorie.
Les cas listés sont des candidats : beaucoup sont légitimes (un point de la fiche visée qui n'utilise pas
le choix, une notation définie localement…) ; chacun demande un regard.
"""
import glob, re, sys, os
from collections import defaultdict
import networkx as nx
import yaml

argv = sys.argv[1:]
RACINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
if '--racine' in argv:
    k = argv.index('--racine'); RACINE = os.path.abspath(argv[k + 1]); del argv[k:k + 2]
os.chdir(RACINE)

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

args = [a for a in argv if not a.startswith('--')]
DETAIL = '--detail' in argv
def retenu(n):
    return not args or n['graphe'] in args

CHAMPS = ['texte', 'enonce', 'preuve']
RE_LIEN = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}')
RE_POINT = re.compile(r'\(([ivx]{1,5})\)')
RE_CITE = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}\s*,?\s*((?:\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*)?)+)')
RE_MEME = re.compile(r'm[êe]me n[œo]e?ud\s*,\s*((?:\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*)?)+)')
ROMAINS_L = 'i ii iii iv v vi vii viii ix x xi xii'.split()
ROMAINS = set(ROMAINS_L)

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

def lisible(t):
    """Texte tel qu'on le lit : liens et termes balisés remplacés par leur libellé."""
    t = re.sub(r'\{\{[^}|]*\|([^}]*)\}\}', r'\1', t)
    t = re.sub(r'\[\[([^\]|]*)\|([^\]]*)\]\]', r'\2', t)
    t = re.sub(r'\[\[([^\]|]*)\]\]', lambda m: (lex.get(m.group(1)) or {}).get('terme', m.group(1)), t)
    t = re.sub(r'\\lex\{[^}]*\}\{([^}]*)\}', r'\1', t)
    return t

def liste_points(s):
    """Points d'une liste « (i), (ii) et (iv) » ou « (i) à (iii) »."""
    out, prec, plage = set(), None, False
    for p, a in re.findall(r'\(([ivx]{1,5})\)|(\bà\b)', s):
        if a: plage = True; continue
        if p not in ROMAINS: continue
        if plage and prec in ROMAINS:
            out |= set(ROMAINS_L[ROMAINS_L.index(prec):ROMAINS_L.index(p) + 1])
        out.add(p); prec, plage = p, False
    return out

def phrase(t, a, b):
    """Bornes de la phrase qui contient t[a:b] (les points des formules sont rares)."""
    d = max(t.rfind('. ', 0, a), t.rfind('\n\n', 0, a), t.rfind('.\n', 0, a))
    f = len(t)
    for s in ('. ', '\n\n', '.\n'):
        x = t.find(s, b)
        if x != -1: f = min(f, x)
    return d + 1, f + 1

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
ETOILE = lambda x: x in noeuds and FICHE(noeuds[x]) and a_choix(noeuds[x])

# Résultats ⋆ que l'on cite souvent par leur nom (D4, et héritage par nom dans un champ choix).
NOMS_ETOILES = [
    (r'(?:théorème|lemme) de Baire', 'f-baire'),
    (r'lemme de Zorn', 'o-zorn'),
    (r'Nullstellensatz', 'ga-nullstellensatz'),
    (r'théorème de Krull', 'ga-krull'),
    (r'Hahn-Banach', 'f-hahn-banach'),
    (r'Banach-Steinhaus', 'f-banach-steinhaus'),
    (r"théorème de l['’]application ouverte", 'f-application-ouverte'),
    (r'(?:théorème de )?Tychonov', 't-tychonov'),
    (r"lemme de l['’]ultrafiltre", 'o-ultrafiltre'),
    (r'Riesz-Markov', 'mk-riesz-markov'),
    (r'Radon-Nikodym', 'lp-radon-nikodym'),
    (r'théorème de Zermelo', 'o-zermelo'),
    (r'théorème de projection', 'f-hilbert'),
    (r'théorème de Riesz(?![-‑])', 'f-riesz'),
    (r'Riesz-Fischer', 'f-lp'),
    (r'lemme de Lindenbaum', 'hk-lindenbaum'),
    (r'ensemble de Vitali', 'm-vitali'),
    (r"théorème d['’]Ascoli", 'fc-ascoli'),
]
NOMS_ETOILES = [(re.compile(r'(?<![\w-])' + r), x) for r, x in NOMS_ETOILES if x in noeuds]

RE_NEG = re.compile(r"n['’](?:en |y )?(?:utilis|emploi|fai|f(?:on)?t\b|demand|ajout|requi|exig)\w*\s+(?:aucun|pas de choix)"
                    r"|ne (?:fai|fon)\w*\s+aucun|sans (?:aucun )?choix|sans aucune forme du choix"
                    r"|se démontrent dans|(?:sont|est) démontrée?s? sans|aucune forme du choix", re.I)
RE_RESTE = re.compile(r"le reste|les autres points|autres implications|tout le reste", re.I)
QUAL = r"(?:sens réciproques?|sens directs?|réciproques?|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|implication[^()]{0,70}?)"
RE_MENTION = re.compile(r'(?P<q>' + QUAL + r"\s+(?:de\s+|dans\s+|du\s+|d['’])?)?(?P<p>\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*(?:de\s+)?\([ivx]{1,5}\))*)", re.I)
MOTS_QUAL = ['sens direct', 'sens réciproque', 'réciproque', 'unicité', 'existence',
             'première affirmation', 'seconde affirmation', 'première assertion', 'seconde assertion']
RE_DECL = re.compile(r"sans (?:aucun )?choix|aucun choix|sans choisir|rien n['’]est choisi|n['’]ajoute aucun"
                     r"|n['’]est à choisir|écarte le choix|dispense de choisir|ne fait aucun choix|sans aucune forme du choix", re.I)

_analyse = {}
def analyse_choix(x):
    """Lecture du champ choix de x : statut de chaque point ('sans', '⋆', 'partiel'), qualificatifs déclarés
    sans choix, présence d'un « le reste … aucun choix »."""
    if x in _analyse: return _analyse[x]
    c = str(noeuds[x].get('choix') or '')
    # retirer les citations d'autres fiches et les formules
    c = re.sub(r"(?:le |au |du )?(?:point|cas)s?\s+(?:\w+\s+)?\([ivx]{1,5}\)\s+(?:du nœud|au nœud|du|de l['’]|de la|des)\s*\{\{[^}]*\}\}", ' ', c)
    c = RE_CITE.sub(' ', c); c = re.sub(r'\{\{[^}]*\}\}', ' ', c); c = re.sub(r'\$[^$]*\$', ' ', c)
    sans_e, sans_p, et_e, et_p, neg_q, reste = set(), set(), set(), set(), set(), False
    for cl in re.split(r'(?<=[.;])\s+|,?\s+mais\s+', ' '.join(c.split())):
        neg = bool(RE_NEG.search(cl))
        if neg:
            reste |= bool(RE_RESTE.search(cl))
            neg_q |= {q for q in MOTS_QUAL if re.search(q + r's?\b', cl, re.I)}
        for m in RE_MENTION.finditer(cl):
            pts = liste_points(m.group('p'))
            if neg: (sans_p if m.group('q') else sans_e).update(pts)
            else: (et_p if m.group('q') else et_e).update(pts)
    statut = {}
    for p in sans_e | sans_p | et_e | et_p:
        if p in sans_e: statut[p] = 'sans'          # « (ii) n'utilise aucun choix » l'emporte
        elif p in et_e and p not in sans_p: statut[p] = '⋆'
        elif p in et_e or p in et_p: statut[p] = 'partiel'
        else: statut[p] = 'sans'
    _analyse[x] = r = dict(statut=statut, neg_q=neg_q, reste=reste, etoile=bool(et_e | et_p))
    return r

RE_HERITE = re.compile(r"hérit|repose|utilise|emploie|applique|passe par|découle|tiré|en dépend|donc le", re.I)
RE_PAS_HERITE = re.compile(r"comme (?:au|à|pour|celle)|cités? au|disparaît|voir le|sans le|n['’]en (?:fait|font|ajoute) aucun|aucun choix", re.I)
def heritage(x, vus=None):
    """Chaîne d'héritage du ⋆ de x : fiche ⋆ en amont que son champ choix lie ou nomme dans une proposition
    qui dit l'emploi (« hérite », « repose sur », « utilise », « passe par »…), récursivement."""
    vus = (vus or set()) | {x}
    c = ' '.join(str(noeuds[x].get('choix') or '').split())
    for cl in re.split(r'(?<=[.;])\s+|,?\s+mais\s+', c):
        if not RE_HERITE.search(cl) or RE_PAS_HERITE.search(cl): continue
        sources = RE_LIEN.findall(cl) + [y for rx, y in NOMS_ETOILES if rx.search(lisible(cl))]
        for y in sources:
            if y != x and y not in vus and ETOILE(y) and y in avant[x]:
                return [y] + heritage(y, vus)
    return []

RE_AVANT = re.compile(r"(?P<q>(?:sens direct|sens réciproque|réciproque|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|points?|cas)(?:\s+\w+)?)\s+"
                      r"(?P<p>\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*\([ivx]{1,5}\))*)\s+(?:du nœud|au nœud|du|de l['’]|de la|des|de)\s*$", re.I)
RE_APRES = re.compile(r"\s*,?\s*(?P<q>(?:(?:le |la |les |l['’])?(?:sens direct|sens réciproque|réciproque|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|cas|points?)\s*(?:de\s+|du\s+|dans\s+|d['’])?)?)"
                      r"(?P<p>\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*\([ivx]{1,5}\))*)", re.I)

def citations(n):
    """Citations d'autres fiches dans le texte, l'énoncé et la preuve : (champ, cible, points, qualificatif, déclaration)."""
    out = []
    for c in CHAMPS:
        t = str(n.get(c) or '')
        for m in RE_LIEN.finditer(t):
            x = m.group(1)
            pts, q = set(), ''
            ma = RE_APRES.match(t, m.end())
            mb = RE_AVANT.search(t[max(0, m.start() - 70):m.start()])
            if ma: pts, q = liste_points(ma.group('p')), ma.group('q')
            elif mb: pts, q = liste_points(mb.group('p')), mb.group('q')
            a, b = phrase(t, m.start(), m.end())
            a2, b2 = phrase(t, b + 1, b + 1) if b < len(t) else (a, b)
            decl = RE_DECL.search(t[a:b2])
            out.append((c, x, pts, ' '.join(q.lower().split()), decl.group(0) if decl else ''))
        for m in RE_MEME.finditer(t):
            prec = RE_LIEN.findall(t[:m.start()])
            if prec: out.append((c, prec[-1], liste_points(m.group(1)), '', ''))
    return out

ecartes = defaultdict(int)       # raison -> nombre de citations écartées
for n in noeuds.values():
    if not FICHE(n) or not retenu(n) or a_choix(n): continue
    vu = {}                      # (cible) -> (rang de gravité, catégorie, message)
    for c, x, pts, q, decl in citations(n):
        if x == n['id'] or not ETOILE(x): continue
        if c == 'texte' and not pts and not q:
            ecartes['renvoi sans point dans le texte'] += 1; continue
        ptxt = f", ({', '.join(sorted(pts, key=ROMAINS_L.index))})" if pts else ''
        qtxt = f", {q}" if q and not q.startswith('point') and not q.startswith('cas') else ''
        if x == 'm-lebesgue':
            cat, msg = 'D2', f"cite {x} (convention : le ⋆ de la mesure de Lebesgue n'est pas recompté)"
        else:
            an = analyse_choix(x)
            st = {p: an['statut'].get(p, 'sans' if an['reste'] else ('hors' if an['etoile'] else '⋆')) for p in pts}
            qd = next((w for w in MOTS_QUAL if w in q), '')
            if qd and qd in an['neg_q'] and all(s != '⋆' for s in st.values()):
                st = {p: 'sans' for p in st} or {'': 'sans'}
            if not pts and not (qd and qd in an['neg_q']):
                st = {'': '⋆' if an['etoile'] or not an['statut'] else 'partiel'}
            if all(s == 'sans' for s in st.values()):
                ecartes['points déclarés sans choix par la fiche citée'] += 1; continue
            ch = ' '.join(str(noeuds[x]['choix']).split())
            if all(s in ('sans', 'hors') for s in st.values()):
                et = sorted((p for p, s in an['statut'].items() if s != 'sans'), key=ROMAINS_L.index)
                cat, msg = 'D2', f"cite {x}{ptxt}{qtxt}, alors que son ⋆ porte sur ({', '.join(et)})"
            elif decl:
                cat, msg = 'D2', f"cite {x}{ptxt}{qtxt}, déclaré sans choix par la fiche (« {decl} »)"
            else:
                part = ' (point en partie ⋆ : préciser le sens ou la partie citée)' if '⋆' not in st.values() else ''
                ch_h = heritage(x)
                if ch_h:
                    cat, msg = 'D3', f"cite {x}{ptxt}{qtxt}{part}, ⋆ hérité : {' ← '.join([x] + ch_h)} ; « {ch[:90]}… »"
                else:
                    cat, msg = 'D', f"cite {x}{ptxt}{qtxt}{part}, marqué ⋆ : « {ch[:110]}… »"
        rang = {'D': 0, 'D3': 1, 'D2': 2}[cat]
        if x not in vu or rang < vu[x][0]: vu[x] = (rang, cat, msg)
    for x in sorted(vu):
        _, cat, msg = vu[x]; note(cat, n, msg)

# D4 : résultats ⋆ cités par leur nom en clair
for n in noeuds.values():
    if not FICHE(n) or not retenu(n) or a_choix(n): continue
    lies = set()
    for c in CHAMPS: lies |= set(RE_LIEN.findall(str(n.get(c) or '')))
    signales = set()
    for c in CHAMPS:
        t = str(n.get(c) or '')
        if c == 'preuve' and re.search(r'\bAdmise?s? ici\b', t): continue
        t = re.sub(r'\{\{[^}]*\}\}', ' ', t)          # les liens relèvent de D
        t = lisible(t)
        for rx, x in NOMS_ETOILES:
            if x == n['id'] or x in lies or x in signales or not ETOILE(x): continue
            for m in rx.finditer(t):
                if re.search(r"\bsans (?:le |la |l['’]|recourir au |passer par le |utiliser le )?$", t[max(0, m.start() - 25):m.start()]):
                    continue
                a, b = phrase(t, m.start(), m.end())
                if RE_DECL.search(t[a:b]): continue
                amont = '' if x in avant[n['id']] else ' (et en aval)'
                ext = ' '.join(t[max(a, m.start() - 60):min(b, m.end() + 50)].split())
                note('D4', n, f"nomme « {m.group(0)} » ({c}), résultat ⋆ de {x}{amont} : …{ext}…")
                signales.add(x); break

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
VIDES = {'de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', "d'", "l'", 'à', 'au', 'en', 'et', 'par', 'sur'}
def mots(s): return [w for w in re.split(r"[\s'’]+", s.lower()) if w and w not in VIDES]
def racine(w): return w[:6]
# gras de chaque fiche, avec sa phrase
gras = defaultdict(list)          # nœud -> [(texte en gras, phrase)]
for n in noeuds.values():
    for c in CHAMPS:
        t = str(n.get(c) or '')
        for m in re.finditer(r'\*\*([^*]{1,80})\*\*', t):
            a, b = phrase(t, m.start(), m.end())
            gras[n['id']].append((m.group(1).lower(), t[a:b].lower()))
def defini_en_gras(mot, i):
    """Le terme est-il défini en gras dans la fiche i : en entier, ou par son dernier mot en gras (adjectif)
    avec les autres mots dans la phrase (« un sous-espace est **stable** si… »)."""
    ws = mots(mot)
    if not ws: return False
    for b, s in gras[i]:
        if mot.lower() in b or mot.lower().rstrip('s') in b: return True
        if racine(ws[-1]) in b and all(racine(w) in s for w in ws):
            return True
    return False
RE_ANNONCE = re.compile(r"construira|établira|établiront|démontrera|définira|sera (?:défini|construit|démontré|établi)e?s?"
                        r"|seront (?:défini|construit|démontré|établi)e?s|les nœuds qui suivent|nœud suivant|chapitre suivant", re.I)
libelle = lambda e: re.sub(r'\s*\([^)]*\)\s*$', '', e.get('terme') or '').lower()
homonymes = defaultdict(list)
for e in lexique: homonymes[libelle(e)].append(e)

for t, e in lex.items():
    mot = e.get('terme') or ''
    if len(mot) < 9 or ' ' not in mot: continue        # expressions de plusieurs mots seulement
    rx = re.compile(r'(?<![\w-])' + re.escape(mot) + r's?(?![\w-])', re.I)
    d = e['defini_dans']
    if d not in noeuds: continue
    autres = [h['defini_dans'] for h in homonymes[libelle(e)] if h is not e and h['defini_dans'] in noeuds]
    for n in noeuds.values():
        if not FICHE(n) or not retenu(n) or d in avant[n['id']]: continue
        if any(h in avant[n['id']] for h in autres): continue                     # homonyme défini en amont
        if any(defini_en_gras(mot, i) for i in avant[n['id']] if gras.get(i)): continue   # gras, ici ou en amont
        trouve = None
        for c in CHAMPS:
            s = str(n.get(c) or '')
            if c == 'preuve' and re.search(r'\bAdmise?s? ici\b', s): continue
            s = sans_balises(s)
            s = re.sub(r'\$[^$]*\$', ' ', s)
            for m in rx.finditer(s):
                a, b = phrase(s, m.start(), m.end())
                if re.match(r"[^.;\n]{0,25}?c['’]est-à-dire", s[m.end():b]): continue   # définition sur place
                if RE_ANNONCE.search(s[a:b]): continue
                trouve = (c, s, m); break
            if trouve: break
        if trouve:
            c, s, m = trouve
            note('F', n, f"« {mot} » en clair ({c}), défini plus loin en {d} : …{s[max(0, m.start()-40):m.end()+30]}…".replace('\n', ' '))

# ------------------------------------------------------------------ rapport
TITRES = {'A': 'Notations sans définition en amont', 'B': 'Points cités absents de la fiche visée',
          'C': '« même nœud » douteux', 'D': 'Choix non transmis', 'D2': 'Choix non transmis, probablement légitime',
          'D3': 'Choix non transmis, hérité en cascade', 'D4': 'Résultat ⋆ cité par son nom en clair',
          'E': 'Admis non transmis',
          'F': 'Termes en clair avant leur définition'}
CATS = ['A', 'B', 'C', 'D', 'D2', 'D3', 'D4', 'E', 'F']
lignes = ['# Diagnostic de l\'ordre logique de l\'édifice', '',
          f'{len(noeuds)} nœuds, {len(lex)} termes. Candidats à examiner, non des erreurs certaines.', '']
for k in CATS:
    l = sorted(cas[k])
    lignes += [f'## {k}. {TITRES[k]} ({len(l)})', '']
    if k == 'D2' and ecartes:
        lignes += ['Citations de fiches ⋆ écartées sans être listées : '
                   + ' ; '.join(f'{r} : {v}' for r, v in sorted(ecartes.items())) + '.', '']
    par_graphe = defaultdict(list)
    for g, i, m in l: par_graphe[g].append((i, m))
    for g in sorted(par_graphe):
        lignes.append(f'### {g} ({len(par_graphe[g])})')
        lignes += [f'- `{i}` : {m}' for i, m in par_graphe[g]]
        lignes.append('')
os.makedirs('construction', exist_ok=True)
open('construction/diagnostic.md', 'w', encoding='utf-8').write('\n'.join(lignes))
print(f"{len(noeuds)} nœuds examinés" + (f" (graphes : {', '.join(args)})" if args else '')
      + ('' if RACINE == os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')) else f" ; racine {RACINE}"))
for k in CATS:
    par = defaultdict(int)
    for g, _, _ in cas[k]: par[g] += 1
    top = ', '.join(f'{g} {v}' for g, v in sorted(par.items(), key=lambda x: -x[1])[:6])
    print(f"  {k}. {TITRES[k]} : {len(cas[k])}" + (f"  [{top}]" if top else ''))
    if DETAIL:
        for g, i, m in sorted(cas[k]): print(f"      {i} : {m[:160]}")
if ecartes:
    print("  (citations ⋆ écartées : " + ', '.join(f'{r} {v}' for r, v in sorted(ecartes.items())) + ')')
print(f"Liste complète : {os.path.join('construction', 'diagnostic.md') if RACINE else ''}")

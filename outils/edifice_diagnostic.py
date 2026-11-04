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
     de (iii) », « l'existence dans (iv) »). Qualificatifs lus, avant ou après le point (« {{x|…}}, (i), première
     assertion ») : sens direct, sens réciproque, réciproque, existence, unicité, caractérisation, première ou
     seconde affirmation (« assertion » vaut « affirmation »). Une citation dont tous les points sont déclarés
     sans choix est écartée (comptée à part). Les citations sans point du champ texte, simples renvois à une
     définition, sont ignorées. Les citations d'une fiche dont le seul ⋆ vient de la mesure de Lebesgue (m-lebesgue,
     ou fiche dont le champ choix ne renvoie qu'à elle, comme sf-aire) sont écartées par la convention du mémo §57
     (comptées à part). Restent :
     D  la fiche citée fait elle-même le choix (en tout, ou en partie si le point est marqué « partiel ») ;
     D2 cas probablement légitimes : la fiche qui cite déclare, dans la phrase de la citation ou la suivante,
        qu'aucun choix n'est fait (« sans choix », « rien n'est choisi », « n'ajoute aucun choix ») ; points
        cités non mentionnés par un champ choix qui en nomme d'autres ;
     D3 héritage transitif : comme D, mais la fiche citée hérite elle-même son ⋆ d'une autre (lien ou nom en
        clair dans son champ choix) ; la cascade est affichée jusqu'à l'origine ;
     D4 citation par son nom en clair d'un résultat ⋆ (« théorème de Baire », « lemme de Zorn », table
        NOMS_ETOILES à compléter) dans une fiche sans champ choix qui ne lie pas ce résultat.
     Une citation de D à D4 vérifiée et légitime (choix écarté par une hypothèse de la fiche qui cite) est inscrite
     dans outils/edifice_choix_exceptions.txt (« fiche -> fiche citée (points) » ou « (sans point) », justification
     après « # ») ; elle n'excuse que les citations de ces points ;
     D5 lignes de ce fichier à nettoyer : illisible, sans justification, en double, ou qui n'excuse plus rien.
     Un qualificatif nié dans un champ choix n'excuse que son point (couples qualificatif, point) : « le sens direct
     de (iii) n'en demande aucun », ou « (iii) … ; le sens direct n'en demande aucun » ;
  E. admis non transmis : une fiche qui cite, hors remarque, une fiche dont l'énoncé ou la preuve est admis,
     sans le dire ; est écartée la fiche désignée comme démonstration de l'admis par le champ « admis » de la fiche
     citée (statut aval ou ailleurs, renvoi), quand chacune de ses citations identifie son énoncé au point admis
     (« C'est le point (ii) du nœud {{x|…}} »), comme ku-commutativite pour cup-anneau, (ii) ;
  F. termes du lexique écrits en clair (sans [[…]]) dans une fiche qui ne vient pas après leur définition.
     Sont écartés : un terme défini sur place (en gras **…**, ou suivi, dans la même phrase, de « c'est-à-dire ») ; un
     terme défini en gras dans une fiche en amont (y compris « sous-espace … **stable** »,
     l'adjectif en gras et le nom dans la phrase) ; une mention annoncée (« construira », « établira »,
     « sera défini », « les nœuds qui suivent »…) ; une preuve « Admis ici » ; un homonyme du lexique (même
     libellé, parenthèse ôtée) défini en amont ; une exception de outils/edifice_clair_exceptions.txt (« fiche |
     terme », justification après « # » : le mot n'y est pas la notion de l'entrée).
     F2 lignes de ce fichier à nettoyer : illisible, fiche ou terme inconnu, sans justification, en double, ou qui
     n'écarte plus rien.
  G. arcs « Repose sur » sans usage visible (mémo §83 : une arête ou une entrée exprime une dépendance logique,
     jamais un choix de disposition). Arc x → y : arête interne [x, y] d'un graphe, ou entrée « x: [y, …] » d'un
     sous-graphe ; les arcs dont la source est un nœud du graphe principal sont ignorés. L'arc a un usage visible
     si y cite {{x}} ou {{x|…}}, ou emploie un terme du lexique ([[t]], [[t|…]], \\lex{t}{…}) défini dans x
     (defini_dans: x), dans son texte, son énoncé, sa preuve ou son champ choix ; les remarques et les blocs
     ```schema (légendes) ne comptent pas. Un conteneur (chapitre, théorie) vaut pour tout son contenu,
     récursivement : en cible, l'usage peut se trouver dans n'importe quelle fiche de son sous-graphe ; en source,
     citer une fiche du contenu suffit. Les arcs sans usage visible jugés vraie dépendance (définition employée en
     clair, notation…) sont listés dans outils/edifice_arcs_valides.txt (« x -> y », commentaire après « # ») et ne
     sont pas signalés ; seuls les autres le sont : y ajouter un renvoi {{x|…}}, ou une ligne commentée au fichier,
     ou retirer l'arc. La catégorie doit rester à 0.
     G2 lignes du fichier des arcs validés à nettoyer : arc qui n'existe plus, ligne devenue inutile (y emploie
     désormais x), ligne illisible ou en double. Avec --racine, le fichier lu est <dossier>/outils/… s'il existe,
     sinon celui du dépôt.
  H. notions définies en gras sans entrée de lexique (2 nov. 2026). Dans les fiches, une définition se signale par
     un passage en gras (**…**, ou \\textbf{…} dans une formule) du texte, de l'énoncé ou de la preuve (les
     remarques ne sont pas lues). Si ce gras n'est la définition d'aucun terme du lexique, construire.py ne peut
     pas vérifier l'ordre d'apparition de la notion : il est signalé. La comparaison se fait sur une forme
     normalisée (casse, accents, pluriel et féminin ôtés, élisions et parenthèse finale du terme ôtées), avec le
     champ terme et l'id de chaque entrée. Sont écartés (et comptés à part) : un gras sans lettre hors formule ; un
     titre de paragraphe (« **Existence.** » en tête de ligne) ; un gras fait de mots de liaison ou d'insistance
     (« **tous** », « **au plus** ») ; un terme du lexique défini dans la fiche, en entier, ou en partie quand le
     gras est une suite contiguë des mots du terme et que les mots manquants sont dans la phrase, du même côté du
     gras que dans le terme et à cinq mots au plus (« un sous-espace F est **stable** » pour « sous-espace
     stable » ; la parenthèse d'une collection, « entiers naturels (ensemble des) », se lit en tête ; un gras plus
     long que le terme, « **sous-groupe engendré** », n'est pas écarté, ni « une relation est **récursive** » pour
     « fonction récursive », ni « un idéal est **radical** » pour « radical d'un idéal »), ou par une variante d'un
     terme d'un seul mot (« **dérivée** » pour « dérivable ») ; un gras d'un mot, variante du premier mot d'un
     terme défini dans la fiche et lié dans la même phrase (« **intégrale** » près du lien « intégrable au sens de
     Riemann », non « **conjugaison** » près du lien « classes de conjugaison ») ; un terme du lexique défini en amont, en entier, en partie avec
     les autres mots du terme, mots entiers, dans la phrase, ou par une variante d'un mot (« adhérent »,
     « adhérence ») : ce dernier gras n'est pas écarté mais versé en H3 (ci-dessous). Deux mots sont des variantes
     s'ils ont un long préfixe commun et des longueurs voisines (à deux lettres près) : « période » et
     « périodique », homonymes, ne le sont pas. Sont enfin écartés les gras couverts par une
     exception déclarée dans outils/edifice_gras_exceptions.txt (« fiche | texte en gras », ou « * | texte » pour
     toutes les fiches ; commentaire après « # » : notion locale, insistance, cas tranché). Chaque cas restant dit
     combien d'autres fiches emploient la notion en clair (texte, énoncé, preuve ; liens, termes balisés et schémas
     ôtés), en aval et hors de l'aval : une notion employée en aval est à lexicaliser, un emploi hors de l'aval est
     un défaut d'ordre possible. Un gras qui porte le nom d'une entrée définie plus loin ou ailleurs (homonyme) est
     signalé comme tel : définition en double, ou entrée mal placée.
     H2 lignes du fichier des exceptions à nettoyer : ligne illisible, fiche inconnue, doublon, ligne qui n'écarte
     plus rien (le gras a disparu ou est devenu un lien).
     H3 gras homonyme (ou fragment, ou variante) d'une entrée définie en amont (4 nov. 2026). Ce peut être un
     rappel, mais aussi une notion NOUVELLE de même nom (« chaînes » singulières après la chaîne d'un ordre,
     « degré » d'une extension après celui d'un polynôme), qui échappait jusque-là à H sans avoir d'entrée. Règle :
     un rappel s'écrit par un lien [[id]], non en gras ; une notion nouvelle reçoit une entrée sous un terme
     distinct ; un gras gardé à dessein (un lien viserait un autre objet) se déclare dans le fichier des exceptions
     du gras, famille « rappel », avec sa raison.

Usage : python3 outils/edifice_diagnostic.py [--detail] [--racine <dossier>] [graphe …]
--racine lit <dossier>/contenu au lieu du dépôt et écrit <dossier>/construction/diagnostic.md : on s'en sert
pour rejouer l'outil sur un état antérieur extrait par « git archive <commit> contenu | tar -x -C <dossier> ».
Écrit construction/diagnostic.md (liste complète) et affiche le bilan par catégorie.
Les cas listés sont des candidats : beaucoup sont légitimes (un point de la fiche visée qui n'utilise pas
le choix, une notation définie localement…) ; chacun demande un regard.
"""
import glob, re, sys, os, unicodedata
from collections import defaultdict
import networkx as nx
import yaml

argv = sys.argv[1:]
RACINE = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
OUTILS = os.path.dirname(os.path.abspath(__file__))
if '--racine' in argv:
    k = argv.index('--racine'); RACINE = os.path.abspath(argv[k + 1]); del argv[k:k + 2]
os.chdir(RACINE)

# ------------------------------------------------------------------ lecture et ordre global (comme construire.py)
lexique = yaml.safe_load(open('contenu/lexique.yaml', encoding='utf-8'))
lex = {e['id']: e for e in lexique}
graphes = []
for f in sorted(glob.glob('contenu/*.yaml')):
    if f.endswith('lexique.yaml'): continue
    g = yaml.safe_load(open(f, encoding='utf-8')); g['_fichier'] = os.path.basename(f); graphes.append(g)
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
    # 2 nov. 2026 (lot 3) : exp, ln, cos, sin, tan et π sont définis en analyse réelle (ar-exp, ar-trigo) ;
    # cx-exponentielle prolonge exp à ℂ (en aval de ex-exponentielle), lp-puissances, dr-exp, nb-logarithme,
    # cx-pi ne sont plus que des rappels, tous en aval : ils ne sont plus des fiches de définition.
    # « _e^{ » est un indice e surmonté d'un exposant (\varphi_e^{(n)} de cal-kleene), non le nombre e : écarté.
    ('exponentielle', r'\\exp\b|(?<![A-Za-z\\_])e\^\{', ['ex-exponentielle', 'ed-lineaires']),
    ('logarithme', r'\\ln\b|\\log\b', ['ex-logarithme']),
    ('sinus, cosinus', r'\\sin\b|\\cos\b', ['tg-prolongement']),
    ('tangente', r'\\tan\b', ['tg-tangente']),
    ('le nombre π', r'(?:\d|(?<![A-Za-z\\])i)\s*\\pi\b|\\pi\s*/\s*\d|\\frac\s*\{\d*\s*\\pi|\\frac\\pi|\\pi\^2|\\pi\}\{\d', ['tg-arctan']),
    ('ℂ', r'\\mathbb\s*C\b|ℂ', ['c-construction']),
    ('ℝ', r'\\mathbb\s*R\b|ℝ', ['rr-definition']),
    ('ℚ', r'\\mathbb\s*Q\b|ℚ', ['q-construction']),
    ('déterminant', r'\\det\b|déterminant', ['v-determinant', 'v-det-matrice', 'v-formes-alternees']),
    ('racine carrée', r'\\sqrt(?!\s*\{?\s*(?:[IJ]|\\mathfrak))\b|racine carrée', ['c-racine-reelle', 'tg-tangente', 'lp-puissances', 'me-espace', 'tr-dense']),
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
# 3 nov. 2026 : « caractérisation » rejoint les qualificatifs. Le chapitre des martingales cite la caractérisation de
# l'espérance conditionnelle (une variable donnée qui vérifie la propriété caractéristique est l'espérance
# conditionnelle, et celle-ci la vérifie), sans choix, alors que l'existence pour une sous-tribu quelconque en demande un.
QUAL = r"(?:sens réciproques?|sens directs?|réciproques?|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|caractérisations?|implication[^()]{0,70}?)"
RE_MENTION = re.compile(r'(?P<q>' + QUAL + r"\s+(?:de\s+|dans\s+|du\s+|d['’])?)?(?P<p>\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*(?:de\s+)?\([ivx]{1,5}\))*)", re.I)
MOTS_QUAL = ['sens direct', 'sens réciproque', 'réciproque', 'unicité', 'existence', 'caractérisation',
             'première affirmation', 'seconde affirmation', 'première assertion', 'seconde assertion']
RE_DECL = re.compile(r"sans (?:aucun )?choix|aucun choix|sans choisir|rien n['’]est choisi|n['’]ajoute aucun"
                     r"|n['’]est à choisir|écarte le choix|dispense de choisir|ne fait aucun choix|sans aucune forme du choix", re.I)

def syn(q):
    """« assertion » et « affirmation » sont synonymes (« seconde affirmation de (i) » dans un champ choix,
    « (i), première assertion » dans la fiche qui cite) : on compare les qualificatifs sous une seule forme."""
    return q.replace('assertion', 'affirmation')

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
    # 3 nov. 2026 (relecture, S5) : un qualificatif déclaré sans choix n'excuse que son point. On garde des couples
    # (qualificatif, point) : « le sens direct de (iii) n'en demande aucun » donne (sens direct, iii). Un qualificatif
    # nié sans point dans une proposition qui ne nomme aucun point (« ; le sens direct n'en demande aucun ») vaut
    # pour les points de la proposition précédente qui en nomme. neg_q (qualificatifs niés, sans point) ne sert plus
    # qu'aux citations sans point.
    neg_paires, prec_pts = set(), set()
    quals = lambda t: {syn(q) for q in MOTS_QUAL if re.search(q + r's?\b', t, re.I)}
    for cl in re.split(r'(?<=[.;])\s+|,?\s+mais\s+', ' '.join(c.split())):
        neg = bool(RE_NEG.search(cl))
        if neg:
            reste |= bool(RE_RESTE.search(cl))
            neg_q |= quals(cl)
        ms = list(RE_MENTION.finditer(cl))
        for m in ms:
            pts = liste_points(m.group('p'))
            if neg: (sans_p if m.group('q') else sans_e).update(pts)
            else: (et_p if m.group('q') else et_e).update(pts)
            if neg and m.group('q'): neg_paires |= {(q, p) for q in quals(m.group('q')) for p in pts}
        if neg and not ms: neg_paires |= {(q, p) for q in quals(cl) for p in prec_pts}
        if ms: prec_pts = set().union(*(liste_points(m.group('p')) for m in ms))
    statut = {}
    for p in sans_e | sans_p | et_e | et_p:
        if p in sans_e: statut[p] = 'sans'          # « (ii) n'utilise aucun choix » l'emporte
        elif p in et_e and p not in sans_p: statut[p] = '⋆'
        elif p in et_e or p in et_p: statut[p] = 'partiel'
        else: statut[p] = 'sans'
    _analyse[x] = r = dict(statut=statut, neg_q=neg_q, neg_paires=neg_paires, reste=reste, etoile=bool(et_e | et_p))
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

RE_AVANT = re.compile(r"(?P<q>(?:sens direct|sens réciproque|réciproque|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|caractérisation|points?|cas)(?:\s+\w+)?)\s+"
                      r"(?P<p>\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*\([ivx]{1,5}\))*)\s+(?:du nœud|au nœud|du|de l['’]|de la|des|de)\s*$", re.I)
RE_APRES = re.compile(r"\s*,?\s*(?P<q>(?:(?:le |la |les |l['’])?(?:sens direct|sens réciproque|réciproque|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|caractérisation|cas|points?)\s*(?:de\s+|du\s+|dans\s+|d['’])?)?)"
                      r"(?P<p>\([ivx]{1,5}\)(?:\s*(?:,|et|à|ou)\s*\([ivx]{1,5}\))*)"
                      # qualificatif placé après le point (3 nov. 2026) : « {{x|…}}, (i), première assertion »
                      r"(?:\s*,\s*(?P<q2>(?:le |la )?(?:sens direct|sens réciproque|réciproque|(?:première|seconde) (?:affirmation|assertion)|existence|unicité|caractérisation))\b)?", re.I)

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
            if ma: pts, q = liste_points(ma.group('p')), ma.group('q') or ma.group('q2') or ''
            elif mb: pts, q = liste_points(mb.group('p')), mb.group('q')
            a, b = phrase(t, m.start(), m.end())
            a2, b2 = phrase(t, b + 1, b + 1) if b < len(t) else (a, b)
            decl = RE_DECL.search(t[a:b2])
            out.append((c, x, pts, syn(' '.join(q.lower().split())), decl.group(0) if decl else ''))
        for m in RE_MEME.finditer(t):
            prec = RE_LIEN.findall(t[:m.start()])
            if prec: out.append((c, prec[-1], liste_points(m.group(1)), '', ''))
    return out

RE_MOT_CHOIX = re.compile(r"choix|choisi|Zorn|ultrafiltre", re.I)
RE_CHOIX_PROPRE = re.compile(r"\bchoisi(?:t|ssent|ssons|r|e|es|s)?\b|\bchoisiss", re.I)
RE_HERITE_LEB = re.compile(r"hérit|repose|en dépend", re.I)
_leb = {}
def lebesgue_seul(x, vus=frozenset()):
    """Le ⋆ de x ne vient-il que de la mesure de Lebesgue (mémo §57 : ce ⋆ hérité est signalé une fois, et n'est pas
    recompté dans les fiches qui emploient λ) ? Vrai pour m-lebesgue ; vrai pour x si chaque proposition de son
    champ choix qui parle du choix est une négation ou ne renvoie, comme source, qu'à des fiches elles-mêmes dans ce
    cas, et qu'il y a au moins une telle source (sf-aire : « La mesure de Lebesgue de ℝ² repose sur le choix
    dénombrable ({{m-lebesgue|…}}) »). Un champ choix qui choisit quelque chose pour son propre compte ne l'est pas.
    Relecture du 3 nov. 2026 (S2) : les propositions sont aussi coupées sur « , et » ; une proposition n'est source que
    si elle dit l'héritage (« repose », « hérite », « en dépend ») sans verbe de choix propre (« choisit »…, hors
    termes balisés) ; une négation n'est sautée que si elle n'en contient pas. Ainsi m-regularite, dont la preuve de
    (i) choisit un recouvrement, n'en relève pas (aucune fiche sans champ choix ne la cite)."""
    if x == 'm-lebesgue': return True
    if x in _leb: return _leb[x]
    if x in vus: return False
    c = ' '.join(str(noeuds[x].get('choix') or '').split())
    sources, ok = set(), True
    for cl in re.split(r'(?<=[.;])\s+|,?\s+mais\s+|,\s+et\s+', c):
        nu = re.sub(r'\[\[[^\]]*\]\]', ' choix ', re.sub(r'\{\{[^}]*\}\}', ' ', cl))
        propre = bool(RE_CHOIX_PROPRE.search(nu))
        ys = {y for y in RE_LIEN.findall(cl) + [y for rx, y in NOMS_ETOILES if rx.search(lisible(cl))]
              if y != x and ETOILE(y) and y in avant[x]}
        if RE_NEG.search(cl) and not propre: continue
        if ys and RE_HERITE_LEB.search(cl) and not propre: sources |= ys
        elif ys or RE_MOT_CHOIX.search(nu): ok = False
    r = ok and bool(sources) and all(lebesgue_seul(y, vus | {x}) for y in sources)
    _leb[x] = r
    return r

# Exceptions D (3 nov. 2026) : citations ⋆ vérifiées à la main et légitimes (le choix est écarté par une hypothèse
# de la fiche qui cite, que l'outil ne lit pas : signature dénombrable, anneau ℤ, variable indépendante…).
# outils/edifice_choix_exceptions.txt, une ligne « fiche -> fiche citée (points) » (pour D4, le résultat nommé),
# commentaire obligatoire après « # ». Les points sont obligatoires (relecture, S4) : « (iv) », « (i) et (ii) », ou
# « (sans point) » pour une citation qui n'en nomme aucun ; la ligne n'excuse qu'une citation dont les points sont
# parmi les siens (une citation sans point, seulement par « (sans point) »). Une ligne qui n'excuse plus rien est
# signalée en D5.
FICHIER_CHOIX = os.path.join('outils', 'edifice_choix_exceptions.txt')
if not os.path.exists(FICHIER_CHOIX): FICHIER_CHOIX = os.path.join(OUTILS, 'edifice_choix_exceptions.txt')
exc_choix, exc_choix_vus = {}, set()      # (fiche, cible, points) -> numéro de ligne
if os.path.exists(FICHIER_CHOIX):
    for k, l in enumerate(open(FICHIER_CHOIX, encoding='utf-8'), 1):
        l0, _, com = l.partition('#'); l0 = l0.strip()
        if not l0: continue
        m = re.fullmatch(r'(\S+)\s*->\s*(\S+)\s+(\(sans point\)|\([ivx]{1,5}\)(?:\s*(?:,|et|à)\s*\([ivx]{1,5}\))*)', l0)
        if not m or (not args and (m.group(1) not in noeuds or m.group(2) not in noeuds)):
            cas['D5'].append(('?', f'ligne {k}', f"ligne illisible ou fiche inconnue : « {l0} » (attendu « fiche -> fiche citée (points) », ou « (sans point) »)")); continue
        if not com.strip():
            cas['D5'].append(('?', f'ligne {k}', f"« {l0} » sans justification après « # »")); continue
        cle_ = (m.group(1), m.group(2), frozenset(liste_points(m.group(3))))
        if cle_ in exc_choix:
            cas['D5'].append(('?', f'ligne {k}', f"doublon de la ligne {exc_choix[cle_]}")); continue
        exc_choix[cle_] = k
def excuse(n, x, pts):
    """Ligne d'exception qui couvre cette citation (points cités parmi ceux de la ligne), marquée employée."""
    for (f_, x_, S), k in exc_choix.items():
        if f_ == n['id'] and x_ == x and ((pts and set(pts) <= S) or (not pts and not S)):
            exc_choix_vus.add((f_, x_, S)); ecartes['exception déclarée'] += 1
            return True
    return False
def note_choix(cat, n, x, msg):
    if cat == 'D4' and excuse(n, x, set()): return
    note(cat, n, msg)

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
        if lebesgue_seul(x):
            # 3 nov. 2026 : la convention du §57 n'est plus listée en D2 (elle l'était comme « probablement
            # légitime ») ; elle est décidée, et comptée parmi les citations écartées.
            ecartes['convention de la mesure de Lebesgue (§57)' + ('' if x == 'm-lebesgue' else ', en cascade')] += 1; continue
        else:
            an = analyse_choix(x)
            st = {p: an['statut'].get(p, 'sans' if an['reste'] else ('hors' if an['etoile'] else '⋆')) for p in pts}
            qd = next((w for w in MOTS_QUAL if w in q), '')
            if qd and pts and all((qd, p) in an['neg_paires'] for p in pts) and all(s != '⋆' for s in st.values()):
                st = {p: 'sans' for p in st}
            elif qd and not pts and qd in an['neg_q']:
                st = {'': 'sans'}
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
        if excuse(n, x, pts): continue
        rang = {'D': 0, 'D3': 1, 'D2': 2}[cat]
        if x not in vu or rang < vu[x][0]: vu[x] = (rang, cat, msg)
    for x in sorted(vu):
        _, cat, msg = vu[x]; note_choix(cat, n, x, msg)

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
                note_choix('D4', n, x, f"nomme « {m.group(0)} » ({c}), résultat ⋆ de {x}{amont} : …{ext}…")
                signales.add(x); break

for (f_, x_, S), k in sorted(exc_choix.items(), key=lambda e: e[1]):
    if (f_, x_, S) in exc_choix_vus or (args and not (f_ in noeuds and retenu(noeuds[f_]))): continue
    ptxt = ', '.join(f'({p})' for p in sorted(S, key=ROMAINS_L.index)) or '(sans point)'
    cas['D5'].append((noeuds[f_]['graphe'] if f_ in noeuds else '?', f_,
                      f"ligne {k} « {f_} -> {x_} {ptxt} » : cette citation n'est plus signalée (D à D4) ; retirer la ligne"))

# ------------------------------------------------------------------ E. admis non transmis
RE_ADMIS = re.compile(r'\b[Aa]dmise?s?\b')
# Relecture du 3 nov. 2026 (S3) : la fiche qui démontre un point admis de x se lit dans le champ « admis » de x
# (statut aval ou ailleurs, renvoi vers elle), non dans une phrase. Elle peut identifier son énoncé au point admis
# (« C'est le point (ii) du nœud {{x|…}} », « Il s'agit du … ») ; toute autre citation de x y est un emploi.
RE_IDENTIFIE = re.compile(r"(?:C['’]est|Il s['’]agit (?:de|du|d['’]))[^.{}$]{0,40}$")
ecartes_e = defaultdict(int)
admis ={i for i, n in noeuds.items() if FICHE(n) and (RE_ADMIS.search(str(n.get('preuve') or ''))
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
            ent = [a for a in (noeuds[x].get('admis') or []) if a.get('lieu') in ('enonce', 'preuve') and a.get('statut') != 'cite']
            if ent and all(a.get('statut') in ('aval', 'ailleurs') and a.get('renvoi') == n['id'] for a in ent):
                ctx = [t[max(0, m.start() - 60):m.start()] for c in CHAMPS for t in [str(n.get(c) or '')]
                       for m in RE_LIEN.finditer(t) if m.group(1) == x]
                if ctx and all(RE_IDENTIFIE.search(u) for u in ctx):
                    ecartes_e['fiche qui démontre le point admis (champ admis de la fiche citée)'] += 1; continue
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

# Exceptions F (3 nov. 2026) : emplois en clair vérifiés à la main, où le mot n'est pas la notion du lexique (sens
# courant, homonyme sans entrée propre). outils/edifice_clair_exceptions.txt, une ligne « fiche | terme du lexique »,
# justification obligatoire après « # » ; une ligne qui n'écarte plus rien est signalée en F2.
FICHIER_CLAIR = os.path.join('outils', 'edifice_clair_exceptions.txt')
if not os.path.exists(FICHIER_CLAIR): FICHIER_CLAIR = os.path.join(OUTILS, 'edifice_clair_exceptions.txt')
exc_clair, exc_clair_vus, ecartes_f = {}, set(), defaultdict(int)
termes_lex = {(e.get('terme') or '').lower() for e in lexique}
if os.path.exists(FICHIER_CLAIR):
    for k, l in enumerate(open(FICHIER_CLAIR, encoding='utf-8'), 1):
        l0, _, com = l.partition('#'); l0 = l0.strip()
        if not l0: continue
        m = re.fullmatch(r'(\S+)\s*\|\s*(.+?)', l0)
        if not m or (not args and m.group(1) not in noeuds) or m.group(2).lower() not in termes_lex:
            cas['F2'].append(('?', f'ligne {k}', f"ligne illisible, fiche ou terme inconnu : « {l0} » (attendu « fiche | terme du lexique »)")); continue
        if not com.strip():
            cas['F2'].append(('?', f'ligne {k}', f"« {l0} » sans justification après « # »")); continue
        c_ = (m.group(1), m.group(2).lower())
        if c_ in exc_clair:
            cas['F2'].append(('?', f'ligne {k}', f"doublon de la ligne {exc_clair[c_]}")); continue
        exc_clair[c_] = k
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
        # gras, ici ou en amont (testé après la recherche, qui est bien moins coûteuse)
        if trouve and any(defini_en_gras(mot, i) for i in avant[n['id']] if gras.get(i)): trouve = None
        if trouve and (n['id'], mot.lower()) in exc_clair:
            exc_clair_vus.add((n['id'], mot.lower())); ecartes_f['exception déclarée'] += 1; trouve = None
        if trouve:
            c, s, m = trouve
            note('F', n, f"« {mot} » en clair ({c}), défini plus loin en {d} : …{s[max(0, m.start()-40):m.end()+30]}…".replace('\n', ' '))

for c_, k in sorted(exc_clair.items(), key=lambda e: e[1]):
    if c_ in exc_clair_vus or (args and not (c_[0] in noeuds and retenu(noeuds[c_[0]]))): continue
    cas['F2'].append((noeuds[c_[0]]['graphe'] if c_[0] in noeuds else '?', c_[0],
                      f"ligne {k} « {c_[0]} | {c_[1]} » : ce terme n'est plus signalé en clair dans cette fiche ; retirer la ligne"))

# ------------------------------------------------------------------ G. arcs « Repose sur » sans usage visible
# Arc x → y : arête interne [x, y] d'un graphe, ou entrée « x: [y, …] » d'un sous-graphe ; on ignore les arcs
# dont la source est un nœud du graphe principal (l'édifice des théories). Un conteneur (chapitre, théorie)
# vaut pour tout son contenu, récursivement, en source comme en cible.
RE_SCHEMA = re.compile(r'```schema.*?```', re.S)
RE_LIEN_TOUT = re.compile(r'\{\{([^}|]+)(?:\|[^}]*)?\}\}')
RE_TERME = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]')
RE_LEX = re.compile(r'\\lex\{([^}]+)\}')
RACINE_G = next(g['graphe'] for g in graphes if g['conteneur'] is None)
sous_graphes = defaultdict(list)
for g in graphes:
    if g['conteneur']: sous_graphes[g['conteneur']].append(g['graphe'])
_contenu = {}
def contenu(v):
    """v et, s'il est un conteneur, tout le contenu de ses sous-graphes, récursivement."""
    if v not in _contenu:
        s = {v}
        for sg in sous_graphes.get(v, []):
            for m in G[sg]['noeuds']: s |= contenu(m['id'])
        _contenu[v] = frozenset(s)
    return _contenu[v]
_usage = {}
def usage(v):
    """Nœuds dont v fait usage visible : cités par {{x}} ou {{x|…}}, ou lieu de définition d'un terme employé
    ([[t]], [[t|…]], \\lex{t}{…}), dans le texte, l'énoncé, la preuve et le choix, schémas ôtés ; pour un
    conteneur, réunion sur son contenu."""
    if v not in _usage:
        s = set()
        for w in contenu(v):
            for c in CHAMPS + ['choix']:
                t = RE_SCHEMA.sub(' ', str(noeuds[w].get(c) or ''))
                s.update(RE_LIEN_TOUT.findall(t))
                s.update((lex.get(u) or {}).get('defini_dans') for u in RE_TERME.findall(t) + RE_LEX.findall(t))
        _usage[v] = s
    return _usage[v]

arcs = {}                        # (x, y) -> (graphe, description)
for g in graphes:
    for x, y in g['aretes']: arcs[(x, y)] = (g['graphe'], f"arête interne de {g['_fichier']}")
    for x, cs in g['entrees'].items():
        for y in cs: arcs[(x, y)] = (g['graphe'], f"entrée de {g['_fichier']}")
FICHIER_VALIDES = os.path.join('outils', 'edifice_arcs_valides.txt')
if not os.path.exists(FICHIER_VALIDES): FICHIER_VALIDES = os.path.join(OUTILS, 'edifice_arcs_valides.txt')
valides = {}                     # (x, y) -> numéro de ligne
if os.path.exists(FICHIER_VALIDES):
    for k, l in enumerate(open(FICHIER_VALIDES, encoding='utf-8'), 1):
        l = l.split('#', 1)[0].strip()
        if not l: continue
        m = re.fullmatch(r'(\S+)\s*->\s*(\S+)', l)
        if not m:
            cas['G2'].append(('?', f'ligne {k}', f"ligne illisible : « {l} » (attendu « x -> y »)")); continue
        if (m.group(1), m.group(2)) in valides:
            cas['G2'].append(('?', f'ligne {k}', f"doublon de la ligne {valides[(m.group(1), m.group(2))]}")); continue
        valides[(m.group(1), m.group(2))] = k
NOM_VALIDES = os.path.relpath(FICHIER_VALIDES) if not os.path.relpath(FICHIER_VALIDES).startswith('..') else FICHIER_VALIDES
for (x, y), (gid, quoi) in sorted(arcs.items()):
    if noeuds[x]['graphe'] == RACINE_G or not retenu(noeuds[y]): continue
    if contenu(x) & usage(y):
        if (x, y) in valides:
            cas['G2'].append((gid, y, f"ligne {valides[(x, y)]} « {x} -> {y} » inutile : {y} emploie désormais {x} (renvoi ou terme)"))
        continue
    if (x, y) in valides: continue
    qui = f"{y} (ni son contenu)" if sous_graphes.get(y) else y
    quoi_x = f"{x} ni son contenu" if sous_graphes.get(x) else x
    cas['G'].append((gid, y, f"{x} -> {y} ({quoi}) : {qui} ne cite pas {quoi_x} et n'emploie aucun terme qui y est défini "
                             f"(texte, énoncé, preuve, choix ; remarques et schémas exclus). Ajouter le renvoi {{{{{x}|…}}}} "
                             f"là où {x} sert, ou la ligne « {x} -> {y} » à {NOM_VALIDES} avec un commentaire, ou retirer l'arc"))
for (x, y), k in sorted(valides.items(), key=lambda e: e[1]):
    if (x, y) in arcs: continue
    gid = noeuds[y]['graphe'] if y in noeuds else '?'
    if args and gid not in args: continue
    cas['G2'].append((gid, y if y in noeuds else f'ligne {k}', f"ligne {k} « {x} -> {y} » : cet arc n'existe plus ; retirer la ligne"))

# ------------------------------------------------------------------ H. notions définies en gras sans entrée de lexique
# Un passage en gras (**…**, ou \textbf{…} dans une formule) du texte, de l'énoncé ou de la preuve d'une fiche
# signale une définition. S'il n'est la définition d'aucun terme du lexique, construire.py ne peut pas vérifier
# l'ordre d'apparition de la notion : on le signale. Comparaison sur une forme normalisée (casse, accents,
# pluriel et féminin ôtés, parenthèse finale du terme ôtée), avec le champ terme et l'id de chaque entrée.
def _sans_accents(s):
    return ''.join(ch for ch in unicodedata.normalize('NFD', s) if unicodedata.category(ch) != 'Mn')
def _canon(w):
    if w.startswith('$'): return w
    w = _sans_accents(w.lower())
    if len(w) > 4 and w.endswith('aux'): w = w[:-3] + 'al'
    if len(w) > 3 and w[-1] in 'sx': w = w[:-1]
    if len(w) > 3 and w.endswith('e'): w = w[:-1]
    return w
RE_JETON = re.compile(r"\$[^$]*\$|[^\W_]+(?:-[^\W_]+)*")
ELIDES = {'d', 'l', 'qu', 'n', 's', 'c', 'j', 'm'}
def jetons(s):
    s = s.replace('’', "'")
    return [_canon(w) for w in RE_JETON.findall(s) if w.lower() not in ELIDES]
def cle(s): return ' '.join(jetons(s))
RE_COLLECTION = re.compile(r'\((?:espace|ensemble|anneau|groupe|corps|module)s?\s+(?:des?|du|d\W)[^)]*\)\s*$')
def sans_parenthese(t):
    """Terme sans sa parenthèse finale, qui distingue des homonymes (« lacet (topologie) ») ; une parenthèse qui
    désigne une collection (« matrices (espace des) », « entiers naturels (ensemble des) ») nomme un autre objet que
    ses éléments et est gardée : sans quoi l'entrée de l'espace passerait pour celle de la notion (cas de « matrice »,
    restée sans entrée jusqu'au 4 nov. 2026)."""
    if RE_COLLECTION.search(t): return t
    return re.sub(r'\s*\([^)]*\)\s*$', '', t)
cles_lex = defaultdict(list)       # forme normalisée -> entrées du lexique
for e in lexique:
    for s in {e.get('terme') or '', sans_parenthese(e.get('terme') or ''), e['id'].replace('-', ' ')}:
        if cle(s): cles_lex[cle(s)].append(e)
mots_lex = {e['id']: cle(sans_parenthese(e.get('terme') or '')).split() for e in lexique}
mots_lex = {i: [w for w in ws if w not in {_canon(v) for v in VIDES}] or ws for i, ws in mots_lex.items()}
# mots de liaison et d'insistance : un gras qui n'est fait que de ces mots n'est pas une définition
INSISTANCE = set(jetons("tous toutes tout toute chaque aucun aucune seul seule seulement unique uniquement exactement "
                        "au plus au moins pas ne non ni et ou même toujours jamais n'importe quel quelle encore aussi "
                        "deux un une le la les de du des en à pour par sur dans avec sans est sont si alors que qui "
                        "fois avant après plus moins très bien autre autres jusqu"))
RE_GRAS = re.compile(r'\*\*(.+?)\*\*|\\textbf\{([^{}]*)\}', re.S)
RE_TITRE_AV = re.compile(r'(?:^|\n)\s*(?:[-*]\s+|\([ivx]+\)\s*|\d+[.)]\s*)?$')

FICHIER_GRAS = os.path.join('outils', 'edifice_gras_exceptions.txt')
if not os.path.exists(FICHIER_GRAS): FICHIER_GRAS = os.path.join(OUTILS, 'edifice_gras_exceptions.txt')
NOM_GRAS = os.path.relpath(FICHIER_GRAS) if not os.path.relpath(FICHIER_GRAS).startswith('..') else FICHIER_GRAS
exc_gras = {}                      # (fiche ou '*', forme normalisée) -> numéro de ligne
exc_gras_texte = {}
if os.path.exists(FICHIER_GRAS):
    for k, l in enumerate(open(FICHIER_GRAS, encoding='utf-8'), 1):
        l = l.split('#', 1)[0].strip()
        if not l: continue
        m = re.fullmatch(r'(\S+)\s*\|\s*(.+?)', l)
        if not m or (m.group(1) != '*' and m.group(1) not in noeuds and not args):
            cas['H2'].append(('?', f'ligne {k}', f"ligne illisible ou fiche inconnue : « {l} » (attendu « fiche | texte en gras » ou « * | texte »)")); continue
        c_ = (m.group(1), cle(m.group(2)))
        if c_ in exc_gras:
            cas['H2'].append(('?', f'ligne {k}', f"doublon de la ligne {exc_gras[c_]}")); continue
        exc_gras[c_] = k; exc_gras_texte[c_] = l
exc_gras_vus = set()

def _clair(t):
    """Texte où chercher un emploi en clair : schémas, termes balisés, \\lex et liens {{x|…}} ôtés (le libellé
    d'un lien nomme la fiche citée, ce n'est pas un emploi de la notion)."""
    t = RE_SCHEMA.sub(' ', t)
    t = re.sub(r'\[\[[^\]]*\]\]', ' ', t); t = re.sub(r'\\lex\{[^}]*\}\{[^}]*\}', ' ', t)
    t = re.sub(r'\{\{[^}]*\}\}', ' ', t)
    return t.replace('**', '')
_jet_fiche = {}
def jetons_fiche(i):
    if i not in _jet_fiche:
        n = noeuds[i]
        _jet_fiche[i] = ' ' + ' '.join(jetons(' '.join(_clair(str(n.get(c) or '')) for c in CHAMPS))) + ' '
    return _jet_fiche[i]

def variante(w, v):
    """Deux formes d'un même mot (« dérivée », « dérivable » ; « adhérent », « adhérence ») : long préfixe commun
    et longueurs voisines. « période » et « périodique » (homonymes) ne le sont pas."""
    return abs(len(w) - len(v)) <= 2 and len(os.path.commonprefix([w, v])) >= max(5, min(len(w), len(v)) - 3)
ecartes_h = defaultdict(int)
vus_h = set()
for n in noeuds.values():
    if not FICHE(n) or not retenu(n): continue
    ici = {e['id'] for e in lexique if e['defini_dans'] == n['id']}
    ici_l = sorted(ici); cles_ici = [cle(sans_parenthese(lex[t]['terme'])).split() for t in ici_l]
    for c in CHAMPS:
        t = str(n.get(c) or '')
        for m in RE_GRAS.finditer(t):
            b = (m.group(1) or m.group(2) or '').strip()
            k = cle(b); ws = k.split()
            suite = t[m.end():m.end() + 2]
            if not ws or not re.search(r'[^\W\d_]', re.sub(r'\$[^$]*\$', '', b)):
                ecartes_h['formule seule'] += 1; continue
            if (re.match(r'[A-ZÀ-Ý]', b) and (b.endswith(('.', ':')) or suite[:1] in '.:')
                    and RE_TITRE_AV.search(t[:m.start()])):
                ecartes_h['titre de paragraphe'] += 1; continue
            if all(w in INSISTANCE for w in ws):
                ecartes_h["mots d'insistance"] += 1; continue
            es = cles_lex.get(k, [])
            if any(e['defini_dans'] == n['id'] for e in es):
                ecartes_h['terme du lexique défini dans la fiche'] += 1; continue
            a, z = phrase(t, m.start(), m.end())
            ph = ' ' + cle(lisible(t[a:z])) + ' '
            # partie d'un terme composé défini dans la fiche (« un sous-espace F est **stable** par u ») : le gras est
            # une suite contiguë des mots du terme, et les mots manquants sont dans la phrase, du même côté du gras
            # que dans le terme, à cinq mots au plus (formules ôtées) ; la parenthèse d'une collection (« entiers
            # naturels (ensemble des) ») se lit en tête. Resserré le 4 nov. 2026 (lot L6) : la règle ne demandait
            # que les mots du terme quelque part dans la phrase, et masquait « une relation est **récursive** »
            # (fonction récursive), « un idéal est **radical** » (radical d'un idéal), « **nombres de Fermat** »
            # (nombre premier de Fermat), « par **conjugaison** » (classe de conjugaison).
            _avant_g = [w for w in jetons(lisible(t[a:m.start()])) if not w.startswith('$')][-5:]; _apres_g = [w for w in jetons(lisible(t[m.end():z])) if not w.startswith('$')][:5]
            def _partie(ce, terme):
                if RE_COLLECTION.search(terme):
                    k_ = len(cle(re.sub(r'\s*\([^)]*\)\s*$', '', terme)).split()); ce = ce[k_:] + ce[:k_]
                for i in range(len(ce) - len(ws) + 1):
                    if ce[i:i + len(ws)] == ws:
                        return all(w in _avant_g for w in ce[:i]) and all(w in _apres_g for w in ce[i + len(ws):])
                return False
            if any(len(ws) < len(ce) and _partie(ce, lex[u]['terme']) for u, ce in zip(ici_l, cles_ici)):
                ecartes_h['partie d\'un terme du lexique défini dans la fiche'] += 1; continue
            if len(ws) == 1 and any(variante(ce[0], ws[0]) for ce in cles_ici if len(ce) == 1):
                ecartes_h['variante d\'un terme du lexique défini dans la fiche (dérivée, dérivable)'] += 1; continue
            # variante du premier mot d'un terme défini dans la fiche et lié dans la même phrase (« son **intégrale** »
            # après le lien « intégrable au sens de Riemann »). Resserré le 4 nov. 2026 (lot L6) : la règle écartait
            # aussi tout gras fait de mots du terme lié, ou variante d'un mot quelconque, et masquait « par
            # **conjugaison** » (lien « classes de conjugaison ») et « une **probabilité** » (lien « espace probabilisé »).
            lies_ici = [u for u in RE_TERME.findall(t[a:z]) + RE_LEX.findall(t[a:z]) if (lex.get(u) or {}).get('defini_dans') == n['id']]
            if any(len(ws) == 1 and mots_lex[u] and variante(mots_lex[u][0], ws[0]) for u in lies_ici):
                ecartes_h['variante du premier mot d\'un terme défini dans la fiche et lié dans la phrase'] += 1; continue
            # Gras homonyme (ou fragment, ou variante) d'une entrée définie en amont. Ce peut être un rappel, mais
            # aussi une notion NOUVELLE de même nom (« chaînes » singulières après la chaîne d'un ordre, « degré »
            # d'une extension après celui d'un polynôme) : elle sortirait de H sans entrée. Règle (MEMO_atlas_edifice
            # §108) : un rappel s'écrit par un lien, non en gras ; un tel gras va donc en H3, sauf exception déclarée.
            amont_h = [e for e in es if e['defini_dans'] in avant[n['id']]]
            if not amont_h:
                def _rappel(e):
                    # rappel partiel : « un sous-espace F est **stable** par u » (sous-espace stable), les autres
                    # mots du terme étant dans la phrase ; variante d'un mot (adhérent / adhérence)
                    ce = mots_lex[e['id']]
                    if len(ce) == 1:
                        return len(ws) == 1 and variante(ce[0], ws[0])
                    return all(w in ce for w in ws) and all(f' {w} ' in ph for w in ce)
                amont_h = [e for e in lexique if e['defini_dans'] in avant[n['id']] and e['defini_dans'] != n['id'] and _rappel(e)]
                genre = 'fragment ou variante'
            else:
                genre = 'homonyme'
            if amont_h:
                for c_ in ((n['id'], k), ('*', k)):
                    if c_ in exc_gras:
                        exc_gras_vus.add(c_); ecartes_h['gras homonyme d\'amont couvert par une exception (H3)'] += 1; break
                else:
                    if (n['id'], k, 'H3') not in vus_h:
                        vus_h.add((n['id'], k, 'H3'))
                        ext = ' '.join(t[max(a, m.start() - 50):min(z, m.end() + 40)].split())
                        cibles = ', '.join(f"{e['id']} ({e['defini_dans']})" for e in amont_h[:4])
                        note('H3', n, f"« {b} » ({c}) : {genre} d'une entrée définie en amont, {cibles} : rappel à écrire "
                                       f"par un lien, ou notion nouvelle à mettre au lexique sous un terme distinct : …{ext}…")
                continue
            if (n['id'], k) in exc_gras: exc_gras_vus.add((n['id'], k)); ecartes_h['exception déclarée'] += 1; continue
            if ('*', k) in exc_gras: exc_gras_vus.add(('*', k)); ecartes_h['exception déclarée'] += 1; continue
            if (n['id'], k) in vus_h: continue
            vus_h.add((n['id'], k))
            ext = ' '.join(t[max(a, m.start() - 50):min(z, m.end() + 40)].split())
            if es:
                ou = ', '.join(sorted({e['defini_dans'] for e in es}))
                note('H', n, f"« {b} » ({c}) : homonyme d'une entrée du lexique définie plus loin ou ailleurs ({', '.join(e['id'] for e in es)} en {ou}) : …{ext}…")
                continue
            motif = ' ' + k + ' '
            aval, amont = [], []
            for i in noeuds:
                if i == n['id'] or not FICHE(noeuds[i]) or motif not in jetons_fiche(i): continue
                (aval if n['id'] in avant[i] else amont).append(i)
            emp = f"employé en clair dans {len(aval)} fiche(s) en aval" + (f" ({', '.join(sorted(aval)[:5])}{'…' if len(aval) > 5 else ''})" if aval else '')
            if amont: emp += f", et dans {len(amont)} fiche(s) qui ne sont pas en aval ({', '.join(sorted(amont)[:5])}{'…' if len(amont) > 5 else ''})"
            note('H', n, f"« {b} » ({c}) : {emp} : …{ext}…")
for c_, k in sorted(exc_gras.items(), key=lambda e: e[1]):
    if c_ not in exc_gras_vus and (not args or c_[0] == '*' or (c_[0] in noeuds and retenu(noeuds[c_[0]]))):
        g_ = noeuds[c_[0]]['graphe'] if c_[0] in noeuds else '?'
        cas['H2'].append((g_, c_[0] if c_[0] in noeuds else f'ligne {k}', f"ligne {k} « {exc_gras_texte[c_]} » : aucun gras de ce texte n'est plus signalé ; retirer la ligne"))

# ------------------------------------------------------------------ rapport
TITRES = {'A': 'Notations sans définition en amont', 'B': 'Points cités absents de la fiche visée',
          'C': '« même nœud » douteux', 'D': 'Choix non transmis', 'D2': 'Choix non transmis, probablement légitime',
          'D3': 'Choix non transmis, hérité en cascade', 'D4': 'Résultat ⋆ cité par son nom en clair',
          'D5': 'Lignes périmées du fichier des exceptions du choix',
          'E': 'Admis non transmis',
          'F': 'Termes en clair avant leur définition', 'F2': 'Lignes périmées du fichier des exceptions du clair',
          'G': 'Arcs « Repose sur » sans usage visible', 'G2': 'Lignes périmées du fichier des arcs validés',
          'H': 'Notions définies en gras sans entrée de lexique', 'H2': 'Lignes périmées du fichier des exceptions du gras',
          'H3': 'Gras homonymes d\'une entrée d\'amont (rappel en gras ou notion nouvelle masquée)'}
CATS = ['A', 'B', 'C', 'D', 'D2', 'D3', 'D4', 'D5', 'E', 'F', 'F2', 'G', 'G2', 'H', 'H2', 'H3']
lignes = ['# Diagnostic de l\'ordre logique de l\'édifice', '',
          f'{len(noeuds)} nœuds, {len(lex)} termes. Candidats à examiner, non des erreurs certaines.', '']
for k in CATS:
    l = sorted(cas[k])
    lignes += [f'## {k}. {TITRES[k]} ({len(l)})', '']
    if k == 'H' and ecartes_h:
        lignes += ['Gras écartés sans être listés : ' + ' ; '.join(f'{r} : {v}' for r, v in sorted(ecartes_h.items())) + '.', '']
    if k == 'E' and ecartes_e:
        lignes += ["Citations d'admis écartées sans être listées : " + ' ; '.join(f'{r} : {v}' for r, v in sorted(ecartes_e.items())) + '.', '']
    if k == 'F' and ecartes_f:
        lignes += ['Termes en clair écartés sans être listés : ' + ' ; '.join(f'{r} : {v}' for r, v in sorted(ecartes_f.items())) + '.', '']
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
        for g, i, m in sorted(cas[k]): print(f"      {i} : {m if k in ('D5', 'F2', 'G', 'G2', 'H2') else m[:220 if k == 'H' else 160]}")
if ecartes:
    print("  (citations ⋆ écartées : " + ', '.join(f'{r} {v}' for r, v in sorted(ecartes.items())) + ')')
if ecartes_e:
    print("  (citations d'admis écartées : " + ', '.join(f'{r} {v}' for r, v in sorted(ecartes_e.items())) + ')')
if ecartes_f:
    print("  (termes en clair écartés : " + ', '.join(f'{r} {v}' for r, v in sorted(ecartes_f.items())) + ')')
if ecartes_h:
    print("  (gras écartés : " + ', '.join(f'{r} {v}' for r, v in sorted(ecartes_h.items())) + ')')
print(f"Liste complète : {os.path.join('construction', 'diagnostic.md') if RACINE else ''}")

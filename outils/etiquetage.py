"""Affinage de l'étiquetage des exercices d'après l'édifice actuel (audit du 2 novembre 2026).

Les feuilles déposées avant l'extension de l'édifice renvoient souvent à des nœuds trop larges (un graphe
entier : ar-deriv, ar-suites, ar-riemann, continuite, z-polynomes) ou devenus inadaptés au niveau :
l'exponentielle et la trigonométrie réelles étaient rattachées à l'analyse complexe (cx-exponentielle,
cx-pi, nb-logarithme), le produit scalaire du lycée aux espaces de Hilbert (f-hilbert), le déterminant
2 × 2 au déterminant d'un endomorphisme. L'édifice possède désormais les nœuds précis (ar-exp, ar-trigo,
de-*, su-*, ri-*, c-*, pol-*, me-produit-scalaire, v-det-matrice, mart-markov) et le lexique les termes
correspondants.

affiner(e, feuille) part des nœuds et notions proposés (meta_<préfixe>.py ou feuille déjà versée) et :
  1. remplace un nœud inadapté par le nœud de même sujet au bon niveau, selon le contexte (réel ou complexe) ;
  2. remplace un graphe entier par ses nœuds précis que le texte désigne (le graphe reste s'il n'en désigne
     aucun) ;
  3. ajoute les notions du lexique que l'énoncé emploie.
Les motifs portent sur l'énoncé ; le corrigé ne sert qu'à décider du contexte complexe. tex2exos.py l'appelle
après les métadonnées : une reconversion redonne le même étiquetage. Propositions à relire."""
import re

COMPLEXE = re.compile(r'complexe|\\mathrm\{i\}|\\ii\b|nombres? complexes?|\\mathbb\{c\}|\\overline\{z|\bz\s*=|affixe|module de|un argument|'
                      r'forme exponentielle|forme trigonométrique|\\mathbb\{u\}|racines? \$?n\$?-ièmes|e\^\{i|'
                      r'plan complexe|\$z\b|\bz_\{', re.I)


def _t(x):
    return (x or '').lower()


def _cherche(motif, texte):
    return re.search(motif, texte, flags=re.S | re.I) is not None


def _ajoute(liste, *ids):
    for i in ids:
        if i not in liste:
            liste.append(i)


def _remplace(liste, ancien, nouveaux):
    if ancien not in liste:
        return
    k = liste.index(ancien)
    liste.pop(k)
    for j, n in enumerate([n for n in nouveaux if n not in liste]):
        liste.insert(k + j, n)


# Graphes entiers → nœuds précis désignés par l'énoncé.
AFFINAGES = {
    'ar-deriv': [
        (r'dérivée|dériver|f\'\(|f\'\s*=|dérivable', 'de-operations'),
        (r'variations?|croissante|décroissante|monoton|sens de variation', 'de-monotonie'),
        (r'tangente', 'de-dl1'),
        (r'compos|u\(v|\\circ|\(ax\s*\+\s*b\)|\\sqrt\{u|e\^\{u|\\mathrm\{e\}\^\{(-|[0-9])', 'de-composee'),
        (r'extremum|maximum|minimum|optimis', 'de-extremum'),
        (r'convex|concav|inflexion', 'ex-convexite'),
        (r'f\'\'|dérivée seconde', 'de-taylor'),
        (r'accroissements finis|rolle', 'de-taf'),
        (r'nombre dérivé|taux d\'accroissement|dérivable en', 'de-derivee'),
    ],
    'ar-suites': [
        (r'converge|limite|\\lim|tend vers', 'su-convergence'),
        (r'\+\s*\\infty|diverge', 'su-infinies'),
        (r'monoton|croissante|décroissante|majorée|minorée', 'su-monotone'),
        (r'encadrement|gendarmes|comparaison', 'su-encadrement'),
        (r'adjacentes', 'su-adjacentes'),
        (r'extraite|u_\{2n', 'su-extraites'),
    ],
    'ar-riemann': [
        (r'linéarité|chasles|positivité|\\int', 'ri-proprietes'),
        (r'valeur moyenne|inégalité de la moyenne', 'ri-moyenne'),
        (r'rectangles?|sommes? de riemann|méthode des', 'ri-sommes'),
        (r'aire', 'ri-integrable'),
    ],
    'continuite': [
        (r'valeurs intermédiaires|s\'annule|unique solution|admet une (unique )?solution|exactement une solution', 'c-tvi'),
        (r'bijection|strictement monotone', 'c-bijection'),
        (r'continue en|continuité en|prolong', 'c-point'),
        (r'maximum|minimum|bornée sur|atteint', 'c-bornes'),
    ],
    'z-polynomes': [
        (r'racines?|factoris|s\'annule', 'pol-racines'),
        (r'division euclidienne|reste de la division', 'pol-division'),
        (r'binôme|\\binom', 'pol-binome'),
        (r'degré', 'pol-anneau'),
        (r'irréductible', 'pol-irreductibles'),
    ],
}

# Notions du lexique que l'énoncé emploie (seulement pour les feuilles où le motif a un sens).
NOTIONS = [
    (r'convexe|concave', 'fonction-convexe'),
    (r'\\mathrm\{e\}\s*\\approx|nombre \$?\\mathrm\{e\}\$?|le nombre e\b', 'nombre-e'),
    (r'\\arctan|arc tangente|arctan', 'arc-tangente'),
    (r'fonction tangente', 'fonction-tangente'),
    (r'cosinus|sinus|cercle trigonométrique', 'cosinus-sinus'),
    (r'fonction périodique|est périodique|périodique de période|\$?2\\pi\$?-périodique', 'fonction-periodique'),
    (r'produit scalaire|\\cdot \\vec|\\vec\{[a-z]\}\s*\\cdot|\\overrightarrow\{[a-z]+\}\s*\\cdot', 'produit-scalaire'),
    (r'matrice de transition|matrice stochastique', 'matrice-transition'),
    (r'chaîne de markov', 'chaine-markov'),
    (r'état stable|distribution invariante|loi invariante|état stationnaire|probabilité invariante', 'mesure-invariante'),
    (r'valeurs? propres?', 'valeur-propre'),
    (r'polynôme caractéristique', 'polynome-caracteristique'),
    (r'\\binom|coefficients? binomia', 'coefficient-binomial'),
    (r'racine double|multiplicité', 'multiplicite-racine'),
    (r'sommes? de riemann|méthode des rectangles', 'somme-riemann'),
    (r'extremum', 'extremum-local'),
    (r'dérivée seconde|f\'\'|dérivées successives|dérivée \$?n\$?-ième', 'derivee-successive'),
    (r'x\^\{\\alpha\}|puissances? réelles?|exposant réel|\b[2-9abcdq]\^\{x\}', 'puissance-reelle'),
    (r'coordonnées polaires', 'coordonnees-polaires'),
    (r'courbe paramétrée', 'courbe-parametree'),
    (r'produit vectoriel', 'produit-vectoriel'),
    (r'point critique', 'point-critique'),
    (r'trace d', 'trace'),
]


def affiner(e, feuille, niveau=''):
    """e : dict de l'exercice (enonce, corrige, noeuds, notions) ; modifié et renvoyé."""
    en, tout = _t(e.get('enonce')), _t(e.get('enonce')) + '\n' + _t(e.get('corrige'))
    N, L = list(e.get('noeuds') or []), list(e.get('notions') or [])
    complexe = COMPLEXE.search(en) is not None

    # 1. Exponentielle, logarithme et trigonométrie réelles : analyse réelle, non plus analyse complexe.
    if not complexe:
        exp = []
        if _cherche(r'\\ln|logarithme|\\log', en): exp.append('ex-logarithme')
        if _cherche(r'\\exp|\\mathrm\{e\}\^|e\^\{|exponentielle|y\'\s*=\s*-?[0-9a-z,.{}\\]*\s*y\b', en): exp.append('ex-exponentielle')   # y' = ay : solutions exponentielles
        if _cherche(r'croissances? comparées|\\frac\{\\mathrm\{e\}\^\{x\}\}\{x|\\frac\{\\ln|x\\ln|x \\ln|n\\ln', en): exp.append('ex-croissances')
        if _cherche(r'x\^\{\\alpha\}|puissances? réelles?|exposant réel|\b[2-9abcdq]\^\{x\}|\\sqrt\[[0-9n]\]', en): exp.append('ex-puissances')
        if _cherche(r'convex', en): exp.append('ex-convexite')
        _remplace(N, 'cx-exponentielle', exp)   # sans exponentielle dans l'énoncé, le nœud tombe
        _remplace(N, 'nb-logarithme', ['ex-logarithme'] + (['ex-puissances'] if 'ex-puissances' in exp else []))
        trig = []
        if _cherche(r'cercle trigonométrique|\\cos|\\sin|cosinus|sinus|enroul|radian', en): trig.append('tg-cercle')
        if _cherche(r'\\cos\s*\(?\s*a\s*[+-]\s*b|formules? d\'addition|duplication|\\cos\s*\(2|\\sin\s*\(2|y\'\'\s*\+', en): trig.append('tg-addition')
        if _cherche(r'\\tan\b|tangente de', en): trig.append('tg-tangente')
        if _cherche(r'\\arctan|arc tangente', en): trig.append('tg-arctan')
        if not trig: trig.append('tg-cercle')
        _remplace(N, 'cx-pi', trig)
    else:
        # contexte complexe : le logarithme réel des puissances complexes n'est pas en cause
        _remplace(N, 'nb-logarithme', ['ex-logarithme'])

    # Produit scalaire du lycée : produit scalaire et Cauchy-Schwarz, non les espaces de Hilbert.
    _remplace(N, 'f-hilbert', ['me-produit-scalaire'])
    # Déterminant d'une matrice (2 × 2 au lycée) plutôt que d'un endomorphisme.
    if niveau in ('seconde', 'premiere', 'terminale', 'expertes'):
        _remplace(N, 'v-determinant', ['v-det-matrice'])
    # Arc tangente : le nœud qui la construit (et définit π).
    if _cherche(r'\\arctan|arctan|arc tangente', en):
        _ajoute(N, 'tg-arctan')
    # Chaînes de Markov : le graphe dédié.
    if _cherche(r'chaîne de markov|matrice de transition|graphe probabiliste|état stable', en):
        _ajoute(N, 'mart-markov')
    # Coefficients binomiaux : le nœud du binôme.
    if _cherche(r'\\binom|binôme|coefficients? binomia|triangle de pascal', en):
        _ajoute(N, 'pol-binome')

    # 2. Graphes entiers → nœuds précis.
    for g, regles in AFFINAGES.items():
        if g in N:
            fins = [n for motif, n in regles if _cherche(motif, en)]
            if fins:
                _remplace(N, g, fins)

    # 3. Notions.
    for motif, terme in NOTIONS:
        if _cherche(motif, en):
            _ajoute(L, terme)
    if 'ex-logarithme' in N: _ajoute(L, 'logarithme')
    if 'ex-exponentielle' in N: _ajoute(L, 'exponentielle')
    if 'me-produit-scalaire' in N: _ajoute(L, 'produit-scalaire')
    if 'mart-markov' in N: _ajoute(L, 'chaine-markov')
    if any(n.startswith('tg-') for n in N): _ajoute(L, 'cosinus-sinus')
    if 'tg-tangente' in N: _ajoute(L, 'fonction-tangente')

    e['noeuds'], e['notions'] = N, L
    return e


# Exercice sans aucun nœud : nœuds désignés par l'énoncé, puis à défaut ceux du cours de la feuille.
BASE = [
    (r'probabilit|tirage|urne|dé équilibré|pièce équilibrée|événement', 'p-espace'),
    (r'indépendan', 'p-independance'),
    (r'variable aléatoire|loi binomiale|loi de', 'p-variables'),
    (r'espérance|variance|écart type', 'p-esperance'),
    (r'dénombr|combien|anagramme|permutations?|listes?|tirages? successifs|arrangement', 'n-fini'),
    (r'\\binom|combinaison|binôme', 'pol-binome'),
    (r'vecteur|droites?|plans?|repère|coordonnées', 'v-espace'),
    (r'produit scalaire|orthogona|perpendiculaire', 'me-produit-scalaire'),
    (r'dérivée|dérivable', 'de-operations'),
    (r'variations?', 'de-monotonie'),
    (r'\\lim|limite', 'de-limite'),
    (r'\\exp|\\mathrm\{e\}\^|exponentielle', 'ex-exponentielle'),
    (r'\\ln|logarithme', 'ex-logarithme'),
    (r'\\int|intégrale', 'ri-proprietes'),
    (r'primitive', 'ar-tfa'),
    (r'y\'|équation différentielle', 'ed-lineaires'),
    (r'anneau', 'a-anneau'),
    (r'idéal', 'a-ideal'),
    (r'\bcorps\b', 'a-corps'),
    (r'assertion|proposition|implication', 'l-connecteurs'),
]


# Exercices restés sans nœud après les métadonnées, relus un à un lors de l'audit (2 novembre 2026).
MANUELS = {
    'ap-01-09': ['q-irrationnel', 'l-connecteurs'], 'ap-05-10': ['z-zn'], 'ap-05-12': ['z-zn'], 'ap-05-13': ['z-zn'],
    't-02-15': ['pol-binome'], 't-03-35': ['de-limite'], 't-04-15': ['me-produit-scalaire', 'v-espace'],
    't-04-32': ['me-espace', 'me-produit-scalaire'], 't-05-15': ['ex-logarithme'], 't-05-22': ['ex-logarithme'],
    't-06-25': ['ri-moyenne'], 't-08-31': ['ed-lineaires', 'ex-exponentielle'], 't-08-33': ['ex-exponentielle', 'de-operations'],
}


def completer(e, defaut):
    """Ne touche qu'un exercice sans nœud : relecture manuelle (MANUELS), motifs de BASE, sinon les nœuds
    par défaut de la feuille."""
    if e.get('noeuds'):
        return e
    if e.get('id') in MANUELS:
        e['noeuds'] = list(MANUELS[e['id']])
        return e
    en = _t(e.get('enonce'))
    N = [n for motif, n in BASE if _cherche(motif, en)][:4]
    e['noeuds'] = N or list(defaut)
    return e

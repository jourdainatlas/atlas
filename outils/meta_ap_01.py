"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 01 (ensembles et logique)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'proposition|valeur de vérité', 'propositions', ['l-connecteurs'], []),
    (r'table de vérité|connecteur|non\}? ?\(|\\text\{ et \}|\\text\{ ou \}', 'connecteurs et tables de vérité', ['l-connecteurs'], ['connecteur']),
    (r'négation|morgan', 'négation', ['l-tautologies'], ['tautologie']),
    (r'implication|réciproque|contraposée|suffisante|nécessaire|\\rightarrow', 'implication', ['l-connecteurs'], []),
    (r'équivalen|\\leftrightarrow', 'équivalence', ['l-connecteurs'], []),
    (r'absurde|irrationnel', "raisonnement par l'absurde", [], []),
    (r'contre-exemple', 'contre-exemple', [], []),
    (r'\\forall|\\exists|quantificateur', 'quantificateurs', ['log'], ['quantificateur']),
    (r'inclus|\\subset|double inclusion', 'inclusion et égalité', ['zf-ext'], ['ensemble']),
    (r'\\cap|\\cup|\\setminus|complémentaire|overline|diagramme|\\delta', 'opérations ensemblistes', ['zf-operations'], []),
    (r'\\pe\(|parties de', 'ensemble des parties', ['zf-parties'], []),
    (r'\\times [a-z]|produit cartésien|couples', 'produit cartésien', ['r-produit'], ['produit-cartesien']),
    (r'extension|compréhension', 'description des ensembles', ['zf-sep'], ['ensemble']),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

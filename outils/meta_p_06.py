"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 6 (trigonométrie)."""
from meta_commun import types_exercice, appliquer

R = [
    ('radian', 'radians', ['cx-pi'], ['pi']),
    ('cercle trigonométrique|enroulement', 'cercle trigonométrique', ['cx-pi'], ['pi']),
    ('mesure principale', 'mesure principale', ['cx-pi'], []),
    ('\\\\cos|cosinus', 'cosinus', ['cx-exponentielle'], []),
    ('\\\\sin|sinus', 'sinus', ['cx-exponentielle'], []),
    ('\\\\tan|tangente', 'tangente', [], []),
    ('associé|\\\\pi ?- ?x|\\\\pi ?\\+ ?x|\\\\dfrac\\{\\\\pi\\}\\{2\\} ?- ?x', 'angles associés', [], []),
    ('équation|inéquation', 'équations trigonométriques', [], []),
    ('angle orienté|\\(\\\\overrightarrow', 'angles orientés', [], []),
    ('cos\\^\\{2\\}|\\\\cos\\^2|sin\\^\\{2\\}', 'relation cos² + sin² = 1', [], []),
    ('al-kashi|archimède|héron', 'histoire', [], []),
    ('python|algorithme', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

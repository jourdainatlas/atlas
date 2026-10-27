"""Métadonnées proposées pour la feuille de Seconde, chapitre 7 (fonctions numériques)."""
from meta_commun import types_exercice, appliquer

R = [
    ('image|antécédent', 'images et antécédents', ['r-application'], ['application']),
    ('ensemble de définition|définie', 'ensemble de définition', ['r-application'], ['application']),
    ('courbe|graphique|\\\\cf|repère', 'courbe représentative', [], []),
    ('croissante|décroissante|variation', 'variations', ['ar-corps'], []),
    ('maximum|minimum|extremum', 'extremums', ['ar-corps'], []),
    ('x\\^\\{2\\}|carré', 'fonction carré', ['c-racine-reelle'], []),
    ('sqrt|racine', 'fonction racine carrée', ['c-racine-reelle'], []),
    ('\\\\dfrac\\{1\\}\\{x\\}|inverse', 'fonction inverse', [], []),
    ('x\\^\\{3\\}|cube', 'fonction cube', [], []),
    ('encadr', 'encadrement', ['q-ordre'], ['intervalle']),
    ('rectangle|aire|périmètre|enclos', "problème d'optimisation", ['ar-corps'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

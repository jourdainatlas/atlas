"""Métadonnées proposées pour la feuille de Seconde, chapitre 10 (vecteurs)."""
from meta_commun import types_exercice, appliquer

R = [
    ('translation', 'translation', ['v-espace'], ['espace-vectoriel']),
    ('égaux|égalité|opposé', 'égalité de vecteurs', ['v-espace'], []),
    ('parallélogramme', 'parallélogramme', [], []),
    ('chasles|somme|\\+\\\\vect', 'somme et relation de Chasles', ['v-combinaisons'], []),
    ('coordonnées', 'coordonnées d.un vecteur', ['v-espace'], []),
    ('norme|longueur', 'norme', ['gd-normes'], ['norme']),
    ('k\\\\vs|produit par|\\b[0-9]\\\\vs|\\\\dfrac\\{1\\}\\{[23]\\}\\\\vect', 'produit par un réel', ['v-combinaisons'], []),
    ('colinéa|déterminant|\\\\det', 'colinéarité', ['v-libre', 'v-determinant'], ['determinant']),
    ('align', 'alignement', ['v-libre'], []),
    ('parallèle', 'parallélisme', ['v-libre'], []),
    ('\\\\vec\\{|\\\\overrightarrow', 'vecteurs', ['v-espace'], ['espace-vectoriel']),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

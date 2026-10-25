"""Métadonnées proposées pour la feuille Terminale, chapitre 4 (géométrie dans l'espace)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'cube|pavé', 'cube et pavé', [], []),
    (r'repère', 'repère', [], []),
    (r'\bbase\b|décompos', 'base', ['v-libre'], ['base-vectorielle']),
    (r'coordonnées', 'coordonnées', [], []),
    (r'milieu', 'milieu', [], []),
    (r'chasles', 'relation de Chasles', [], []),
    (r'colinéaire|alignés|parallélogramme', 'colinéarité', ['v-libre'], ['famille-libre']),
    (r'coplanaire', 'coplanarité', ['v-libre'], ['famille-libre']),
    (r'produit scalaire|\\cdot', 'produit scalaire', ['f-hilbert'], []),
    (r'orthogona', 'orthogonalité', ['f-hilbert'], []),
    (r'\\\|| norme|longueur|distance entre deux points', 'norme et distance', [], ['norme']),
    (r'\bangle|widehat|\\cos', 'angle', [], []),
    (r'perspective|représenter|dessiner|reproduire', 'perspective cavalière', [], []),
    (r'vecteur normal|équation cartésienne', 'équation cartésienne de plan', [], []),
    (r'représentation paramétrique|begin\{cases\} x', 'représentation paramétrique', [], []),
    (r'position relative|sécant|parallèle|non coplanaires', 'positions relatives', [], []),
    (r'intersection', 'intersection', [], []),
    (r'projeté orthogonal', 'projeté orthogonal', ['f-hilbert'], []),
    (r'distance d[ue] (point|l\'origine|\$)[^.]*plan|distance à un plan|au plan', 'distance à un plan', ['f-hilbert'], []),
    (r'\baire\b|volume|tétraèdre', 'aire et volume', [], []),
    (r'sphère', 'sphère', [], []),
    (r'cauchy-schwarz', 'inégalité de Cauchy-Schwarz', ['f-hilbert'], []),
    (r'centre de gravité|médiane|isobarycentre', 'centre de gravité', [], []),
    (r'identité du parallélogramme', 'identité du parallélogramme', [], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, enonce)  # énoncé seul : le corrigé élargit trop
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

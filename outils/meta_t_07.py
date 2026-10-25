"""Métadonnées proposées pour la feuille Terminale, chapitre 7 (dénombrement)."""
import re
from meta_commun import types_exercice, appliquer

R = [
    (r'cardinal|mathrm\{card\}', 'cardinal', ['n-fini'], ['cardinal', 'ensemble-fini']),
    (r'\\cup|\\cap|réunion|intersection|disjoint', 'réunion et intersection', ['n-fini'], []),
    (r'diagramme', 'diagramme', [], []),
    (r'principe multiplicatif|menus|tenues|plaque', 'principe multiplicatif', ['r-produit'], ['produit-cartesien']),
    (r'arbre', 'arbre', [], []),
    (r'uplet|avec remise|code|mot de passe|questionnaire', 'p-uplets', ['r-produit'], ['produit-cartesien']),
    (r'contraire|au moins un', 'passage au complémentaire', [], []),
    (r'\d!|n!|factorielle', 'factorielle', [], []),
    (r'permutation|anagramme|ranger|file|classements?', 'permutations', [], []),
    (r'arrangement|a_\{[^}]*\}\^|tiercé|podium|bureau|sans remise|chiffres (tous )?distincts|lettres toutes distinctes|deux à deux distincts', 'arrangements', [], []),
    (r'binom|combinaison|simultané|comité|\bmains?\b|délégation|groupes?\b|conseils?\b|cocher \$5|numéros cochés', 'combinaisons', [], []),
    (r'pascal', 'triangle de Pascal', [], []),
    (r'symétrie', 'symétrie des coefficients binomiaux', [], []),
    (r'parties de|sous-ensembles', 'parties d\'un ensemble', ['zf-parties'], ['ensemble-parties']),
    (r'binôme|\(a\+b\)\^', 'formule du binôme', [], []),
    (r'\\sum', 'sommes', ['n-sommes'], []),
    (r'probabilit|équiprobable|\bloi\b', 'probabilités', ['p-espace'], []),
    (r'loi binomiale', 'loi binomiale', ['p-variables'], []),
    (r'quadrill', 'chemins sur un quadrillage', [], []),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    T = types_exercice(titre, enonce, corrige, etoiles)
    # « Dénombrer », « combien » : c'est un calcul, que les règles communes ne voient pas.
    if 'Calcul' not in T and re.search(r'dénombrer|combien|calculer', enonce.lower()):
        T = [t for t in T] + ['Calcul']
        if T[0] == 'Démonstration' and not re.search(r'montrer|démontrer|prouver|établir', enonce.lower()): T.remove('Démonstration')
    return {'types': T, 'mots_cles': m, 'noeuds': n, 'notions': l}

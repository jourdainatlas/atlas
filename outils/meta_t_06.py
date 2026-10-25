"""Métadonnées proposées pour la feuille Terminale, chapitre 6 (intégration)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'primitive|même consigne', 'primitive', ['ar-tfa'], []),
    (r'\\int', 'intégrale', ['ar-riemann'], ['riemann-integrable']),
    (r'\baire\b|unités d\'aire|u\.a', 'aire', ['ar-riemann'], []),
    (r'linéarité', 'linéarité', [], []),
    (r'chasles', 'relation de Chasles', [], []),
    (r'positivité|croissance de l\'intégrale|encadr|inégalité de la moyenne|majorer|minorer', 'encadrement', [], []),
    (r'valeur moyenne', 'valeur moyenne', [], []),
    (r'par parties', 'intégration par parties', ['ar-tfa'], []),
    (r'entre (les|deux) courbes|comprise entre', 'aire entre deux courbes', [], []),
    (r'\\mathrm\{e\}|exponentielle', 'exponentielle', [], ['exponentielle']),
    (r'\\ln|logarithme', 'logarithme', [], ['logarithme']),
    (r'suite|u_\{?n|i_\{?n', "suite d'intégrales", ['ar-suites'], ['suite']),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
    (r'rectangles|trapèzes|milieux|riemann', 'méthode des rectangles', ['ar-riemann'], ['fonction-escalier']),
    (r'monte-carlo|aléatoire', 'Monte-Carlo', [], []),
    (r'harmonique', 'série harmonique', [], []),
    (r'adjacentes', 'suites adjacentes', [], []),
    (r'dérivée|dérivable|f\'\(x\)|f\'', 'dérivée', ['ar-deriv'], ['derivable']),
    (r'tableau de variations|sens de variation', 'tableau de variations', [], []),
    (r'\\lim', 'limite', [], []),
    (r'```python|python', 'Python', [], []),
    (r'probabilit|densité', 'probabilités', [], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

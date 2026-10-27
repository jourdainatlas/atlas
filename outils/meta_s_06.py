"""Métadonnées proposées pour la feuille de Seconde, chapitre 6 (pourcentages)."""
from meta_commun import types_exercice, appliquer

R = [
    ('proportion|pourcentage|%', 'proportions', ['q'], ['ensemble-rationnels']),
    ('taux d.évolution|évolution', "taux d'évolution", ['q'], []),
    ('coefficient multiplicateur|cm', 'coefficient multiplicateur', [], []),
    ('successive|puis', 'évolutions successives', ['n-operations'], []),
    ('réciproque|revenir|ramène', 'évolution réciproque', ['q-construction'], []),
    ('point', 'points de pourcentage', [], []),
    ('prix|euro|salaire|soldes|remise', 'contexte économique', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}

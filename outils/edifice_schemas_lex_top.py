"""Schémas des exemples du lexique, théorie top (structures topologiques) : contenu/exemples/top.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur conseillée pour le panneau du lexique : 400 à 440,
étiquettes de 17 (mémo de l'édifice, § 111). Positions calculées, et ce que la figure affirme vérifié par assert.
"""
import itertools
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte


def _sortie_boite(c, vers, dx, dy):
    """Distance de c au bord du rectangle de demi-côtés (dx, dy) centré en c, dans la direction de « vers »."""
    u = np.asarray(vers, float) - c
    u = u / np.linalg.norm(u)
    return min(dx / abs(u[0]) if abs(u[0]) > 1e-12 else np.inf, dy / abs(u[1]) if abs(u[1]) > 1e-12 else np.inf)


@schema('lex-topologie-1')
def lex_topologie_1():
    # Les topologies de X = {a, b}, trouvées par énumération des familles de parties.
    X = frozenset('ab')
    P = [frozenset(c) for k in range(3) for c in itertools.combinations(sorted(X), k)]
    tops = []
    for k in range(len(P) + 1):
        for fam in itertools.combinations(P, k):
            T = set(fam)
            if frozenset() in T and X in T and all(A | B in T and A & B in T for A in T for B in T):
                tops.append(frozenset(T))
    assert len(tops) == 4                                              # « exactement quatre topologies »
    gros = frozenset({frozenset(), X})
    disc = frozenset(P)
    Ta = frozenset({frozenset(), frozenset('a'), X})
    Tb = frozenset({frozenset(), frozenset('b'), X})
    assert set(tops) == {gros, disc, Ta, Tb}
    assert not Ta <= Tb and not Tb <= Ta                               # non comparables
    assert all(gros <= T <= disc for T in tops)                        # entre la grossière et la discrète
    # traits du diagramme : relations de couverture pour l'inclusion
    couv = {(S, T) for S in tops for T in tops
            if S < T and not any(S < U < T for U in tops)}
    assert couv == {(gros, Ta), (gros, Tb), (Ta, disc), (Tb, disc)}

    nom = {gros: '{∅, X}', Ta: '{∅, {a}, X}', Tb: '{∅, {b}, X}', disc: '{∅, {a}, {b}, X}'}
    W, H, taille = 420, 236, 17
    pos = {disc: np.array([W / 2, 34.0]), gros: np.array([W / 2, H - 34.0]),
           Ta: np.array([100.0, H / 2]), Tb: np.array([W - 100.0, H / 2])}
    demi = {T: (largeur_texte(nom[T], taille) / 2 + 6, 13) for T in tops}
    # rien ne sort du cadre, et l'étiquette « non comparables » tient entre les deux topologies du milieu
    for T in tops:
        assert demi[T][0] < pos[T][0] < W - demi[T][0]
    ecart = (pos[Tb][0] - demi[Tb][0]) - (pos[Ta][0] + demi[Ta][0])
    assert ecart > 120, ecart
    S = Schema(W, H, 'Les quatre topologies de {a, b}, rangées par inclusion')
    for A, B in sorted(couv, key=lambda c: (len(c[0]), sorted(map(sorted, c[1])))):
        p, q = pos[A], pos[B]
        u = (q - p) / np.linalg.norm(q - p)
        S.ligne(p + (_sortie_boite(p, q, *demi[A]) + 2) * u, q - (_sortie_boite(q, p, *demi[B]) + 2) * u, 't')
    couleur = {gros: 't', disc: 't', Ta: 'r', Tb: 'r'}
    for T in tops:
        S.texte(pos[T], nom[T], couleur[T], taille=taille)
    S.texte((W / 2, H / 2), 'non comparables', 'r', ui=True)
    S.texte(pos[gros] + [demi[gros][0] + 10, 0], 'grossière', 'g', ancre='start', ui=True)
    S.texte(pos[disc] + [demi[disc][0] + 10, 0], 'discrète', 'g', ancre='start', ui=True)
    return S

"""Schémas du chapitre cal-representation : la séparation de Rosser lue sur les témoins.
Les ensembles de témoins sont des exemples finis ; la figure vérifie par assert ce que dit la légende :
θ vraie quand le premier témoin de α précède tout témoin de β, et, quand un témoin bleu m existe, tout y
tombe dans l'un des deux cas y ≤ m (chiffres 0, …, m, tous sans témoin rouge) ou m ≤ y (témoin bleu sous la
borne)."""
from edifice_schemas import schema
from edifice_svg import Schema


def theta(temoins_a, temoins_b):
    """θ(a) : il existe y témoin de α tel qu'aucun z ≤ y ne soit témoin de β."""
    return any(all(z not in temoins_b for z in range(y + 1)) for y in temoins_a)


@schema('cal-rp-rosser')
def cal_rp_rosser():
    N = 10
    cas = [('a ∈ A', {5, 8}, set()), ('a ∈ B', set(), {4, 7})]
    # A et B disjoints : jamais de témoin des deux sortes pour un même a
    for _, ta, tb in cas:
        assert not (ta and tb)
    assert theta(*cas[0][1:]) and not theta(*cas[1][1:])
    m = min(cas[1][2])
    for y in range(N + 1):                       # la réfutation, cas par cas
        assert y <= m or m <= y
        if y <= m:
            assert y not in cas[1][1]            # chiffre réfuté pour α
        else:
            assert any(z in cas[1][2] for z in range(y + 1))   # témoin bleu sous la borne
    W, H = 500, 300
    S = Schema(W, H, 'Séparation de Rosser : comparaison des témoins')
    x0, dx = 120, 34
    X = [x0 + dx * k for k in range(N + 1)]
    yb = [30, 176]                                  # haut de chaque panneau
    for p, (titre, ta, tb) in enumerate(cas):
        ya, yβ = yb[p] + 26, yb[p] + 66
        S.texte((16, yb[p]), titre, 't', ancre='start', taille=16)
        S.texte((x0 - 22, ya), 'α', 'r', ancre='end', taille=17)
        S.texte((x0 - 22, yβ), 'β', 'b', ancre='end', taille=17)
        for yy in (ya, yβ):
            S.ligne((X[0] - 10, yy), (X[-1] + 10, yy), 'g')
        for k in range(N + 1):
            for yy in (ya, yβ):
                S.ligne((X[k], yy - 4), (X[k], yy + 4), 'g')
            S.texte((X[k], yβ + 22), str(k), 'g', taille=14)
        for k in sorted(ta):
            S.point((X[k], ya), 'r', r=6)
        for k in sorted(tb):
            S.point((X[k], yβ), 'b', r=6)
        if p == 0:
            y1 = min(ta)
            # la borne z ≤ y du premier témoin rouge : aucun témoin bleu
            S.rect(X[0] - 8, yβ - 11, X[y1] - X[0] + 16, 22, 'g', d=True, rx=6)
            S.texte((X[y1] + 16, ya - 18), 'm', 'r', taille=16)
        else:
            # chiffres 0, …, m réfutés pour α
            for k in range(m + 1):
                d = 5
                S.ligne((X[k] - d, ya - d), (X[k] + d, ya + d), 'r', l=2)
                S.ligne((X[k] - d, ya + d), (X[k] + d, ya - d), 'r', l=2)
            S.texte((X[m] + 16, yβ - 18), 'm', 'b', taille=16)
            # un y ≥ m : la borne z ≤ y contient le témoin bleu m
            y2 = 8
            S.rect(X[0] - 8, yβ - 11, X[y2] - X[0] + 16, 22, 'g', d=True, rx=6)
            S.ligne((X[y2], ya - 12), (X[y2], yβ - 12), 'g', d=True)
            S.texte((X[y2] + 6, ya - 18), 'y', 'g', ancre='start', taille=16)
    return S

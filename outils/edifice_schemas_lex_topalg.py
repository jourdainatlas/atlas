"""Schémas des exemples du lexique, théorie topalg (topologie algébrique) : contenu/exemples/topalg.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur conseillée pour le panneau du lexique : 400 à 440,
étiquettes de 17 au plus (mémo de l'édifice, § 111). Toutes les positions sont calculées (numpy), et ce que dit
chaque légende est vérifié par assert : appartenance des courbes aux espaces dessinés, intersections, distances
à un point exclu, images réciproques, étiquettes dans le cadre et sans chevauchement.
"""
import math
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte, arc

W0 = 420
TL = 16


def _boite(p, s, taille=TL, ancre='middle'):
    """Boîte (x0, y0, x1, y1) d'une étiquette posée par Schema.texte (base centrale)."""
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    return (x0, p[1] - taille * 0.6, x0 + w, p[1] + taille * 0.6)


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    x0, y0, x1, y1 = _boite(p, s, taille, ancre)
    assert x0 >= marge and x1 <= S.w - marge and y0 >= 0 and y1 <= S.h, (s, x0, x1, y0, y1)


def _disjointes(*boites, marge=1):
    for i, a in enumerate(boites):
        for b in boites[i + 1:]:
            assert a[2] + marge <= b[0] or b[2] + marge <= a[0] or a[3] + marge <= b[1] or b[3] + marge <= a[1], (a, b)


def _loin(boite, pts, d=3):
    """Aucun point de la courbe pts n'entre dans la boîte (agrandie de d)."""
    x0, y0, x1, y1 = boite
    pts = np.asarray(pts, float)
    dedans = (pts[:, 0] > x0 - d) & (pts[:, 0] < x1 + d) & (pts[:, 1] > y0 - d) & (pts[:, 1] < y1 + d)
    assert not dedans.any(), boite


def _etiq(S, p, s, c='t', taille=TL, ancre='middle', eviter=(), boites=None):
    """Pose une étiquette après avoir vérifié qu'elle tient dans le cadre et évite les courbes données."""
    _dans_cadre(S, p, s, taille, ancre)
    b = _boite(p, s, taille, ancre)
    for pts in eviter:
        _loin(b, pts)
    if boites is not None:
        boites.append(b)
    S.texte(p, s, c, ancre=ancre, taille=taille)
    return b


def _repere_egal(xmin, xmax, ymin, ymax, W, H, marge=16):
    """Repère à échelle égale sur les deux axes, centré dans le cadre."""
    e = min((W - 2 * marge) / (xmax - xmin), (H - 2 * marge) / (ymax - ymin))
    L, Hh = e * (xmax - xmin), e * (ymax - ymin)
    return Repere(xmin, xmax, ymin, ymax, (W - L) / 2, (H - Hh) / 2, L, Hh), e


# ================================================================================================== paquet 1

@schema('lex-relevement-1')
def lex_relevement_1():
    ys = np.linspace(-2, 2, 401)
    f = 2 + ys ** 2 / 2
    r = np.sqrt(f)
    assert (f > 0).all() and (r > 0).all() and (-r < 0).all()           # √f > 0, −√f < 0 : un feuillet chacun
    assert np.allclose(r ** 2, f)                                        # deux relèvements : (±√f)² = f
    W, H = W0, 280
    R = Repere(-2.5, 2.9, -2.35, 4.35, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'Une application f et ses deux relèvements ±√f par x ↦ x²')
    S.ligne(R(-2.5, 0), R(2.9, 0), 'g', d=True)
    S.ligne(R(0, -2.35), R(0, 4.35), 'g')
    pf, pr, pb = R(ys, f), R(ys, r), R(ys, -r)
    S.poly(pf, 'v')
    S.poly(pr, 'r')
    S.poly(pb, 'b')
    bx = []
    _etiq(S, R(2.08, 4.0), 'f', 'v', ancre='start', eviter=[pf, pr, pb], boites=bx)
    _etiq(S, R(2.08, 2.0), '√f', 'r', ancre='start', eviter=[pf, pr, pb], boites=bx)
    _etiq(S, R(2.08, -2.0), '−√f', 'b', ancre='start', eviter=[pf, pr, pb], boites=bx)
    for v in (-2, 2):
        S.ligne(R(v, 0) + [0, -4], R(v, 0) + [0, 4], 'g')
        _etiq(S, R(v, 0) + [0, 15], '−2' if v < 0 else '2', 'g', taille=14, eviter=[pf, pr, pb], boites=bx)
    _etiq(S, R(-0.08, 0) + [0, 15], '0', 'g', taille=14, ancre='end', boites=bx)
    _disjointes(*bx)
    return S


def _gamma_disque(s):
    s = np.asarray(s, float)
    return np.stack([0.25 + 0.42 * np.cos(2 * np.pi * s) + 0.13 * np.cos(4 * np.pi * s),
                     0.52 * np.sin(2 * np.pi * s) + 0.12 * np.sin(6 * np.pi * s)], -1)


@schema('lex-simplement-connexe-1')
def lex_simplement_connexe_1():
    s = np.linspace(0, 1, 601)
    g = _gamma_disque(s)
    x = _gamma_disque(0.0)
    assert np.allclose(_gamma_disque(1.0), x) and np.allclose(x, [0.8, 0])  # lacet en x
    assert np.linalg.norm(g, axis=1).max() < 0.97                          # γ dans D
    H = {t: (1 - t) * g + t * x for t in (1 / 3, 2 / 3)}
    for t, c in H.items():
        assert np.linalg.norm(c, axis=1).max() < 1                          # H(·, t) dans D
    ks = np.arange(0, 1, 1 / 12)[1:]
    for k in ks:                                                            # segments dans D (convexité)
        seg = np.outer(1 - np.linspace(0, 1, 50), _gamma_disque(k)) + np.outer(np.linspace(0, 1, 50), x)
        assert np.linalg.norm(seg, axis=1).max() <= 1
    W, Hh = W0, 290
    R, e = _repere_egal(-1.05, 1.05, -1.05, 1.05, W, Hh, marge=10)
    S = Schema(W, Hh, 'Un lacet du disque contracté en ligne droite vers son point de base')
    S.cercle(R(0, 0), e, 't', rempli='g')
    for k in ks:
        S.ligne(R(*_gamma_disque(k)), R(*x), 'g')
    for t, c in H.items():
        S.poly(R(c[:, 0], c[:, 1]), 'b', d=(t > 0.5))
    S.poly(R(g[:, 0], g[:, 1]), 'r')
    S.point(R(*x), 't', r=3.6)
    pg = R(g[:, 0], g[:, 1])
    _etiq(S, R(*x) + [10, 14], 'x', ancre='start', eviter=[pg])
    _etiq(S, R(*_gamma_disque(0.3)) + [-6, -16], 'γ', 'r')
    _etiq(S, R(-0.78, 0.78) + [-10, -6], 'D', ancre='end')
    return S


@schema('lex-simplement-connexe-3')
def lex_simplement_connexe_3():
    s = np.linspace(0, 1, 721)
    g = np.stack([np.cos(2 * np.pi * s), np.sin(2 * np.pi * s)], -1)
    x = np.array([1.0, 0.0])
    m = (g + x) / 2                                                           # H(·, 1/2)
    assert np.allclose(np.linalg.norm(m - [0.5, 0], axis=1), 0.5)             # cercle de centre (1/2, 0), rayon 1/2
    assert np.allclose(m[360], [0, 0])                                        # s = 1/2 : l'origine
    nm = np.linalg.norm(m, axis=1)
    assert np.allclose(nm, np.abs(np.cos(np.pi * s)))                         # |H(s, 1/2)| = |cos πs|
    assert (nm[1:-1] < 1).all()                                               # ne touche le cercle qu'en x
    W, H = W0, 290
    R, e = _repere_egal(-1.25, 1.35, -1.12, 1.12, W, H, marge=8)
    S = Schema(W, H, 'Les segments de la contraction en ligne droite quittent le cercle')
    for k in range(1, 12):
        S.ligne(R(*g[60 * k]), R(*x), 'g')
    S.poly(R(m[:, 0], m[:, 1]), 'b')
    S.cercle(R(0, 0), e, 'r')
    S.point(R(*x), 't', r=3.6)
    S.point(R(0, 0), 'b', r=3.4)
    _etiq(S, R(*x) + [10, 0], 'x', ancre='start')
    _etiq(S, R(0, 0) + [-8, 14], '0', 'b', ancre='end')
    _etiq(S, R(-0.75, 0.75) + [-12, -10], 'S^1', 'r', ancre='end')
    return S


@schema('lex-ouvert-uniformement-couvert-2')
def lex_ouvert_uniformement_couvert_2():
    a, b, eps = Fr(1), Fr(9, 4), Fr(1, 4)
    # images réciproques exactes : ]1, 3/2[ et ]−3/2, −1[ ; [0, 1/4[ ↦ ]−1/2, 1/2[
    assert (Fr(3, 2)) ** 2 == b and Fr(1, 2) ** 2 == eps
    xs = np.linspace(-1.72, 1.72, 400)
    W, H = W0, 290
    R = Repere(-1.95, 1.95, -0.45, 3.0, 12, 10, W - 24, H - 20)
    S = Schema(W, H, 'Images réciproques par x ↦ x² : deux intervalles au-dessus de U, un seul au voisinage de 0')
    S.fleche(R(-1.95, 0), R(1.95, 0), 'g')
    S.fleche(R(0, -0.3), R(0, 3.0), 'g')
    for y in (1, 2.25, 0.25):
        S.ligne(R(-math.sqrt(y), y), R(math.sqrt(y), y), 'g', d=True)
        for sg in (-1, 1):
            S.ligne(R(sg * math.sqrt(y), y), R(sg * math.sqrt(y), 0), 'g', d=True)
    S.poly(R(xs, xs ** 2), 't')
    u = np.linspace(1, 1.5, 60)
    S.poly(R(u, u ** 2), 'r', l=3.2)
    S.poly(R(-u, u ** 2), 'b', l=3.2)
    S.ligne(R(1, 0), R(1.5, 0), 'r', l=4)
    S.ligne(R(-1.5, 0), R(-1, 0), 'b', l=4)
    S.ligne(R(0, 1), R(0, 2.25), 't', l=4)
    w = np.linspace(-0.5, 0.5, 60)
    S.poly(R(w, w ** 2), 'v', l=3.2)
    S.ligne(R(-0.5, 0), R(0.5, 0), 'v', l=4)
    S.ligne(R(0, 0), R(0, 0.25), 'v', l=4)
    for xx, c in [(1, 'r'), (1.5, 'r'), (-1, 'b'), (-1.5, 'b'), (-0.5, 'v'), (0.5, 'v')]:
        S.point(R(xx, 0), c, r=3.6, creux=True)
    S.point(R(0, 0), 'v', r=3.4)
    for yy, c in [(1, 't'), (2.25, 't'), (0.25, 'v')]:          # extrémités exclues : ]1, 9/4[ et [0, 1/4[
        S.point(R(0, yy), c, r=3.6, creux=True)
    bx = []
    _etiq(S, R(0, 1.62) + [-10, 0], 'U', ancre='end', boites=bx)
    for xx, lab, c in [(1.5, '3/2', 'r'), (-1.5, '−3/2', 'b'), (1, '1', 'r'), (-1, '−1', 'b')]:
        _etiq(S, R(xx, 0) + [0, 17], lab, c, taille=14, boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-connexe-par-arcs-1')
def lex_connexe_par_arcs_1():
    a = np.array([1.2, 0.5])
    lam = -0.8
    b = lam * a
    c = np.array([-a[1], a[0]])
    assert abs(np.linalg.det(np.stack([a, c]))) > 0 and abs(np.linalg.det(np.stack([c, b]))) > 0
    t = np.linspace(0, 1, 400)[:, None]
    chemin = np.vstack([(1 - t) * a + t * c, (1 - t) * c + t * b])
    dmin = np.linalg.norm(chemin, axis=1).min()
    assert dmin > 0.35                                                    # le chemin rouge évite l'origine
    seg = (1 - t) * a + t * b
    assert np.linalg.norm(seg, axis=1).min() < 1e-2                       # le segment gris passe par 0
    W, H = W0, 260
    R, e = _repere_egal(-1.45, 1.65, -0.85, 1.45, W, H, marge=12)
    S = Schema(W, H, 'Dans le plan privé de l’origine, un détour par c relie a à b = λa')
    S.ligne(R(*a), R(*b), 'g', d=True)
    S.poly(R(chemin[:, 0], chemin[:, 1]), 'r')
    for p in (a, b, c):
        S.point(R(*p), 't', r=3.6)
    S.point(R(0, 0), 'g', r=4, creux=True)
    pr = R(chemin[:, 0], chemin[:, 1])
    bx = []
    _etiq(S, R(*a) + [10, 0], 'a', ancre='start', eviter=[pr], boites=bx)
    _etiq(S, R(*b) + [-4, 16], 'b = λa', ancre='end', eviter=[pr], boites=bx)
    _etiq(S, R(*c) + [-10, -4], 'c', ancre='end', eviter=[pr], boites=bx)
    _etiq(S, R(0, 0) + [10, 14], '0', 'g', ancre='start', eviter=[pr], boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-revetement-2')
def lex_revetement_2():
    # E = ]0, 2[ × {0} ∪ ]1, 2[ × {1}, p(x, i) = x : nombre d'antécédents de 1 − η et 1 + η
    eta = 0.3
    def antecedents(x):
        return [i for i, (lo, hi) in enumerate([(0, 2), (1, 2)]) if lo < x < hi]
    assert len(antecedents(1 - eta)) == 1 and len(antecedents(1 + eta)) == 2 and len(antecedents(1)) == 1
    W, H = W0, 210
    X = lambda x: 30 + x / 2 * (W - 60)
    yb, y0, y1 = 170, 105, 55
    S = Schema(W, H, 'Un homéomorphisme local surjectif qui n’est pas un revêtement')
    S.ligne((X(0), yb), (X(2), yb), 't')
    S.ligne((X(0), y0), (X(2), y0), 'r', l=2.6)
    S.ligne((X(1), y1), (X(2), y1), 'b', l=2.6)
    vois = 1.5 * eta                                    # voisinage ouvert ]1 − 1,5η, 1 + 1,5η[, extrémités creuses
    assert 1 - vois < 1 - eta and 1 + eta < 1 + vois and 0 < 1 - vois and 1 + vois < 2
    S.ligne((X(1 - vois), yb), (X(1 + vois), yb), 'v', l=5)
    for x in (1 - vois, 1 + vois):
        S.point((X(x), yb), 'v', r=4, creux=True)
    for x in (1 - eta, 1 + eta):
        S.ligne((X(x), y1 if antecedents(x) == [0, 1] else y0), (X(x), yb), 'g', d=True)
    for (x, y, c) in [(0, yb, 't'), (2, yb, 't'), (0, y0, 'r'), (2, y0, 'r'), (1, y1, 'b'), (2, y1, 'b')]:
        S.point((x and X(x) or X(0), y), c, r=3.6, creux=True)
    S.point((X(1 - eta), y0), 'r', r=3.4)
    S.point((X(1 + eta), y0), 'r', r=3.4)
    S.point((X(1 + eta), y1), 'b', r=3.4)
    S.point((X(1), yb), 't', r=3.2)
    for x in (1 - eta, 1 + eta):
        S.point((X(x), yb), 'v', r=3.4)
    bx = []
    _etiq(S, (X(1), yb + 18), '1', taille=15, boites=bx)
    _etiq(S, (X(1 - eta) - 4, yb + 18), '1 − η', 'v', taille=15, ancre='end', boites=bx)
    _etiq(S, (X(1 + eta) + 4, yb + 18), '1 + η', 'v', taille=15, ancre='start', boites=bx)
    _etiq(S, (X(0) - 2, yb - 16), '0', 'g', taille=14, ancre='start', boites=bx)
    _etiq(S, (X(2) + 2, yb - 16), '2', 'g', taille=14, ancre='end', boites=bx)
    _etiq(S, (X(0.35), y0 - 16), 'E', 'r', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-cercle-quotient-1')
def lex_cercle_quotient_1():
    # p^{-1}(p([0, 1/2[)) = réunion des [k, k + 1/2[ ; les points de ]−1/4, 0[ n'y sont pas
    frac = lambda x: x - math.floor(x)
    dansA = lambda x: frac(x) < 0.5
    assert all(dansA(k + d) for k in (-1, 0, 1) for d in (0, 0.2, 0.49))
    assert not any(dansA(x) for x in np.linspace(-0.249, -0.001, 40))
    W, H = W0, 300
    X = lambda x: 30 + (x + 1.25) / 3.0 * (W - 60)
    yl = 262
    S = Schema(W, H, 'L’arc p([0, 1/2[) n’est pas ouvert dans ℝ/ℤ')
    S.fleche((X(-1.25), yl), (X(1.75) + 12, yl), 'g')
    for k in (-1, 0, 1):
        S.ligne((X(k), yl), (X(k + 0.5), yl), 'r', l=4)
    S.ligne((X(-0.25), yl), (X(0), yl), 'g', l=5)
    for k in (-1, 0, 1):
        S.point((X(k), yl), 'r', r=4)
        S.point((X(k + 0.5), yl), 'r', r=4, creux=True)
    bx = []
    for k in (-1, 0, 1):
        _etiq(S, (X(k), yl + 19), str(k).replace('-', '−'), 'r', taille=14, boites=bx)
    _etiq(S, (X(1.75) + 4, yl - 16), 'ℝ', 'g', ancre='end', taille=16, boites=bx)
    # le cercle : p(t) à l'angle 2πt
    C = np.array([W / 2, 118.0])
    rho = 88
    P = lambda t: C + rho * np.array([math.cos(2 * math.pi * t), -math.sin(2 * math.pi * t)])
    S.cercle(C, rho, 't')
    S.poly(arc(C, rho, 0, -math.pi), 'r', l=4)                               # A : de p(0) à p(1/2), sens direct
    S.poly(arc(C, rho, math.pi / 2, 0), 'g', l=5)                            # image de ]−1/4, 0[
    S.point(P(0), 'r', r=4)
    S.point(P(0.5), 'r', r=4, creux=True)
    _etiq(S, P(0) + [10, 0], 'p(0)', 'r', ancre='start', boites=bx)
    _etiq(S, P(0.5) + [-10, 0], 'p(1/2)', 'r', ancre='end', boites=bx)
    _etiq(S, P(0.25) + [0, -16], 'A', 'r', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-chemin-1')
def lex_chemin_1():
    s = np.linspace(0, 1, 201)
    gd = np.where(s[:, None] <= 0.5, np.stack([2 * s, 0 * s], -1), np.stack([1 + 0 * s, 2 * s - 1], -1))
    assert np.allclose(gd[100], [1, 0]) and np.allclose(gd[0], [0, 0]) and np.allclose(gd[-1], [1, 1])
    W, H = W0, 230
    R, e = _repere_egal(-0.55, 2.75, -0.42, 1.3, W, H, marge=10)
    S = Schema(W, H, 'Concaténation : l’équerre γ·δ, et un chemin δ′ qui ne s’y raccorde pas')
    S.poly(R(gd[:, 0], gd[:, 1]), 'r')
    S.pointe(R(1, 1), (0, -1), 'r')
    S.ligne(R(2, 0), R(2, 1), 'b')
    S.pointe(R(2, 1), (0, -1), 'b')
    for p, c in [((0, 0), 't'), ((1, 0), 'r'), ((2, 0), 'b')]:
        S.point(R(*p), c, r=3.6)
    bx = []
    _etiq(S, R(0, 0) + [0, 18], '(0, 0)', boites=bx)
    _etiq(S, R(1, 0) + [0, 18], '(1, 0)', 'r', boites=bx)
    _etiq(S, R(2, 0) + [0, 18], '(2, 0)', 'b', boites=bx)
    _etiq(S, R(1, 1) + [-10, -4], '(1, 1)', ancre='end', boites=bx)
    _etiq(S, R(0.5, 0) + [0, -16], 'γ', 'r', boites=bx)
    _etiq(S, R(1, 0.5) + [-10, 0], 'δ', 'r', ancre='end', boites=bx)
    _etiq(S, R(2, 0.5) + [10, 0], 'δ′', 'b', ancre='start', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-feuillet-2')
def lex_feuillet_2():
    B = ['u', 'v']
    E = [(x, i) for x in B for i in (0, 1)]
    gauche = [{('u', 0), ('v', 0)}, {('u', 1), ('v', 1)}]
    droite = [{('u', 0), ('v', 1)}, {('u', 1), ('v', 0)}]
    for dec in (gauche, droite):                                   # décompositions : partition, bijection sur B
        assert set().union(*dec) == set(E) and not (dec[0] & dec[1])
        assert all(sorted(x for x, _ in S_) == B for S_ in dec)
    W, H = W0, 220
    S = Schema(W, H, 'Deux décompositions en feuillets de B × {0, 1} au-dessus de B = {u, v}')
    yb, y0, y1 = 186, 120, 56
    bx = []
    for k, (dec, x0) in enumerate([(gauche, 70), (droite, 260)]):
        xs = {'u': x0, 'v': x0 + 110}
        pos = {(x, i): (xs[x], y0 if i == 0 else y1) for (x, i) in E}
        for S_, c in zip(dec, 'rb'):
            p, q = [pos[e] for e in sorted(S_)]
            S.ligne(p, q, c, l=3)
        for (x, i), p in pos.items():
            S.ligne(p, (p[0], yb - 8), 'g', d=True)
            S.point(p, 't', r=4)
        S.ligne((xs['u'] - 20, yb), (xs['v'] + 20, yb), 'g')
        for x in B:
            S.point((xs[x], yb), 't', r=3.6)
            _etiq(S, (xs[x], yb + 18), x, boites=bx)
        for i, y in ((0, y0), (1, y1)):
            _etiq(S, (xs['u'] - 16, y), str(i), 'g', taille=14, ancre='end', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-degre-lacet-1')
def lex_degre_lacet_1():
    s = np.linspace(0, 1, 401)
    phi = 4 * s * (1 - s)
    assert abs(phi.max() - 1) < 1e-12 and phi[0] == 0 and abs(phi[-1]) < 1e-12 and abs(phi[200] - 1) < 1e-12
    W, H = W0, 250
    R = Repere(-0.12, 1.12, -0.25, 2.3, 34, 10, W - 50, H - 34)
    S = Schema(W, H, 'Relèvements issus de 0 : 4s(1 − s) revient en 0, 2s finit en 2')
    for k in (0, 1, 2):
        S.ligne(R(-0.12, k), R(1.12, k), 'g', d=True)
    S.ligne(R(0, -0.25), R(0, 2.3), 'g')
    S.ligne(R(1, -0.25), R(1, 2.3), 'g')
    pr, pb = R(s, phi), R(s, 2 * s)
    S.poly(pr, 'r')
    S.poly(pb, 'b')
    bx = []
    for k in (0, 1, 2):
        _etiq(S, R(-0.12, k) + [-4, 0], str(k), 'g', taille=14, ancre='end', boites=bx)
    _etiq(S, R(0, -0.25) + [0, 13], 's = 0', 'g', taille=14, boites=bx)
    _etiq(S, R(1, -0.25) + [0, 13], 's = 1', 'g', taille=14, boites=bx)
    _etiq(S, R(0.25, 1.16), '4s(1 − s)', 'r', taille=15, eviter=[pr, pb], boites=bx)
    _etiq(S, R(0.7, 1.4) + [14, 10], '2s', 'b', ancre='start', taille=15, eviter=[pr, pb], boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-homotopie-chemins-1')
def lex_homotopie_chemins_1():
    s = np.linspace(0, 1, 301)
    al = np.stack([np.cos(np.pi * s), np.sin(np.pi * s)], -1)
    be = np.stack([np.cos(np.pi * s), -np.sin(np.pi * s)], -1)
    Hs = {t: (1 - t) * al + t * be for t in (0, 0.25, 0.5, 0.75, 1)}
    for t, c in Hs.items():
        assert np.allclose(c, np.stack([np.cos(np.pi * s), (1 - 2 * t) * np.sin(np.pi * s)], -1))
        assert np.allclose(c[0], [1, 0]) and np.allclose(c[-1], [-1, 0])     # extrémités fixes
    assert np.allclose(Hs[0.5][150], [0, 0])                                  # s = t = 1/2 : l'origine
    W, H = W0, 270
    R, e = _repere_egal(-1.45, 1.45, -1.18, 1.18, W, H, marge=8)
    S = Schema(W, H, 'Homotopie en ligne droite du demi-cercle supérieur au demi-cercle inférieur')
    for t in (0.25, 0.5, 0.75):
        S.poly(R(Hs[t][:, 0], Hs[t][:, 1]), 'g')
    S.poly(R(al[:, 0], al[:, 1]), 'r')
    S.poly(R(be[:, 0], be[:, 1]), 'b')
    for p in ((1, 0), (-1, 0)):
        S.point(R(*p), 't', r=3.6)
    S.point(R(0, 0), 'g', r=3.6)
    bx = []
    _etiq(S, R(1, 0) + [8, 0], '(1, 0)', ancre='start', boites=bx)
    _etiq(S, R(-1, 0) + [-8, 0], '(−1, 0)', ancre='end', boites=bx)
    _etiq(S, R(0.72, 0.72) + [8, -8], 'α', 'r', ancre='start', boites=bx)
    _etiq(S, R(0.72, -0.72) + [8, 8], 'β', 'b', ancre='start', boites=bx)
    _etiq(S, R(0, 0) + [6, -12], '0', 'g', ancre='start', taille=14, boites=bx)
    _disjointes(*bx)
    return S


# ================================================================================================== paquet 2

@schema('lex-produit-equilibre-1')
def lex_produit_equilibre_1():
    eq = [(Fr(0), Fr(1, 3)), (Fr(1, 3), Fr(2, 3)), (Fr(2, 3), Fr(1))]
    par = [(Fr(0), Fr(1, 4)), (Fr(1, 4), Fr(1, 2)), (Fr(1, 2), Fr(1))]
    # à l'instant 1/3 : le produit équilibré commence γ₂ ; le parenthésé est à 4s − 1 = 1/3 de γ₂
    assert eq[1][0] == Fr(1, 3) and par[1][0] < Fr(1, 3) < par[1][1] and 4 * Fr(1, 3) - 1 == Fr(1, 3)
    W, H = W0, 214
    X = lambda v: 30 + float(v) * (W - 60)
    S = Schema(W, H, 'Produit équilibré et concaténations parenthésées de trois chemins')
    ys = (62, 132)
    bx = []
    # barre du haut : noms au-dessus, graduations au-dessous ; barre du bas : noms au-dessous, graduations plus bas,
    # de sorte que le pointillé de l'instant 1/3 descende jusqu'à la seconde barre sans traverser d'étiquette
    for (dec, y, dy) in zip((eq, par), ys, (-20, 22)):
        for k, ((u, v), c) in enumerate(zip(dec, 'rbv')):
            S.ligne((X(u), y), (X(v), y), c, l=6)
            _etiq(S, ((X(u) + X(v)) / 2, y + dy), f'γ_{k + 1}', c, boites=bx)
        for u in [d[0] for d in dec] + [Fr(1)]:
            S.ligne((X(u), y - 7), (X(u), y + 7), 't')
    lab = {Fr(0): '0', Fr(1, 4): '1/4', Fr(1, 3): '1/3', Fr(1, 2): '1/2', Fr(2, 3): '2/3', Fr(1): '1'}
    for u in (Fr(0), Fr(1, 3), Fr(2, 3), Fr(1)):
        _etiq(S, (X(u), ys[0] + 20), lab[u], 'g', taille=14, boites=bx)
    for u in (Fr(0), Fr(1, 4), Fr(1, 2), Fr(1)):
        _etiq(S, (X(u), ys[1] + 44), lab[u], 'g', taille=14, boites=bx)
    y0, y1 = ys[0] + 30, ys[1]
    S.ligne((X(Fr(1, 3)), y0), (X(Fr(1, 3)), y1), 'g', d=True)
    S.point((X(Fr(1, 3)), y1), 'g', r=3.4)
    trait = np.array([(X(Fr(1, 3)), yy) for yy in np.linspace(y0, y1 - 6, 30)])
    for b in bx:
        _loin(b, trait, d=1)
    _disjointes(*bx)
    return S


@schema('lex-homotopie-chemins-2')
def lex_homotopie_chemins_2():
    s = np.linspace(0, 1, 601)
    al = np.stack([np.cos(np.pi * s), np.sin(np.pi * s)], -1)

    def bp(u):
        return np.where(u[:, None] <= 1 / 3, np.stack([1 + 0 * u, 3 * u], -1),
                        np.where(u[:, None] <= 2 / 3, np.stack([1 - 6 * (u - 1 / 3), 1 + 0 * u], -1),
                                 np.stack([-1 + 0 * u, 3 * (1 - u)], -1)))
    be = bp(s)
    assert np.allclose(be[0], [1, 0]) and np.allclose(be[-1], [-1, 0]) and np.allclose(be[200], [1, 1])
    Hs = {t: (1 - t) * al + t * be for t in (1 / 3, 2 / 3)}
    for c in [al, be] + list(Hs.values()):
        assert (c[1:-1, 1] > 0).all()                                   # au-dessus de l'axe hors des extrémités
        assert np.linalg.norm(c, axis=1).min() > 0.9                    # l'origine n'est jamais atteinte
    W, H = W0, 250
    R, e = _repere_egal(-1.6, 1.6, -0.35, 1.2, W, H, marge=8)
    S = Schema(W, H, 'Homotopie du demi-cercle au chemin rectangulaire, dans le plan privé de l’origine')
    S.ligne(R(-1.6, 0), R(1.6, 0), 'g', d=True)
    for c in Hs.values():
        S.poly(R(c[:, 0], c[:, 1]), 'g')
    S.poly(R(al[:, 0], al[:, 1]), 'r')
    S.poly(R(be[:, 0], be[:, 1]), 'b')
    for p in ((1, 0), (-1, 0)):
        S.point(R(*p), 't', r=3.6)
    S.point(R(0, 0), 'g', r=4, creux=True)
    bx = []
    _etiq(S, R(1, 0) + [8, 14], '(1, 0)', ancre='start', boites=bx)
    _etiq(S, R(-1, 0) + [-8, 14], '(−1, 0)', ancre='end', boites=bx)
    _etiq(S, R(0, 0) + [0, 18], '0', 'g', taille=14, boites=bx)
    _etiq(S, R(0, 1) + [0, -22], 'β′', 'b', boites=bx)
    _etiq(S, R(0.42, 0.62), 'α', 'r', boites=bx, eviter=[R(c[:, 0], c[:, 1]) for c in [al, be] + list(Hs.values())])
    _disjointes(*bx)
    return S


@schema('lex-theoreme-van-kampen-1')
def lex_theoreme_van_kampen_1():
    R1, R2, R3 = (0, 3, 0, 1), (0, 1, 0, 2), (2, 3, 0, 2)
    dans = lambda x, y, r: r[0] < x < r[1] and r[2] < y < r[3]
    X_ = lambda x, y: any(dans(x, y, r) for r in (R1, R2, R3))
    U_ = lambda x, y: dans(x, y, R1) or dans(x, y, R2)
    V_ = lambda x, y: dans(x, y, R3)
    g = [(x, y) for x in np.linspace(0.01, 2.99, 150) for y in np.linspace(0.01, 1.99, 100)]
    # U ∩ V = ]2, 3[ × ]0, 1[ ; le milieu de (1/2, 3/2) et (5/2, 3/2) n'est pas dans X
    assert all((U_(x, y) and V_(x, y)) == dans(x, y, (2, 3, 0, 1)) for x, y in g)
    assert X_(0.5, 1.5) and X_(2.5, 1.5) and not X_(1.5, 1.5)
    W, H = W0, 280
    Rp, e = _repere_egal(-0.25, 3.25, -0.35, 2.2, W, H, marge=8)
    S = Schema(W, H, 'Région en U : réunion de deux ouverts simplement connexes, d’intersection convexe')
    def rect(r, c, rempli=None, d=False):
        x0, x1, y0, y1 = r
        S.rect(*Rp(x0, y1), (x1 - x0) * e, (y1 - y0) * e, c, rempli=rempli, d=d)
    contourU = [(0, 0), (3, 0), (3, 1), (1, 1), (1, 2), (0, 2)]        # bord de R1 ∪ R2
    assert all(U_(x, y) == (dans(x, y, R1) or dans(x, y, R2)) for x, y in g)
    # le contour de U passe par (3, 0) et (3, 1) : il englobe le carré de l'intersection
    assert (3, 0) in contourU and (3, 1) in contourU
    S.poly([Rp(*q) for q in contourU], 'r', ferme=True, rempli='r')
    rect(R3, 'b', rempli='b')
    m = 4 / e                                                          # carré vert en retrait de 4 px
    rect((2 + m, 3 - m, m, 1 - m), 'v', rempli='v')
    S.poly([Rp(*q) for q in contourU], 'r', ferme=True, l=2.6)        # contour rouge redessiné par-dessus
    S.ligne(Rp(0.5, 1.5), Rp(2.5, 1.5), 'g', d=True)
    for p in ((0.5, 1.5), (2.5, 1.5)):
        S.point(Rp(*p), 't', r=3.6)
    S.point(Rp(1.5, 1.5), 'g', r=4, creux=True)
    bx = []
    _etiq(S, Rp(0.5, 0.5), 'U', 'r', boites=bx)
    _etiq(S, Rp(2.5, 1.2), 'V', 'b', boites=bx)
    _etiq(S, Rp(2.5, 0.5), 'U ∩ V', 'v', taille=15, boites=bx)
    _etiq(S, Rp(0, 0) + [0, 16], '0', 'g', taille=14, boites=bx)
    _etiq(S, Rp(3, 0) + [0, 16], '3', 'g', taille=14, boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-tore-1')
def lex_tore_1():
    s = np.linspace(0, 1, 201)
    L1 = np.where(s[:, None] <= 0.5, np.stack([2 * s, 0 * s], -1), np.stack([1 + 0 * s, 2 * s - 1], -1))
    L2 = np.where(s[:, None] <= 0.5, np.stack([0 * s, 2 * s], -1), np.stack([2 * s - 1, 1 + 0 * s], -1))
    # P∘L1 = a·b : première moitié (p(2s), e), seconde (e, p(2s − 1)) ; P∘L2 = b·a
    frac = lambda v: np.mod(v, 1.0)
    assert np.allclose(frac(L1[:101, 1]), 0) and np.allclose(frac(L1[100:, 0]), 0)
    assert np.allclose(frac(L2[:101, 0]), 0) and np.allclose(frac(L2[100:, 1]), 0)
    for t in np.linspace(0, 1, 11):                                  # homotopie en ligne droite dans le carré
        Hm = (1 - t) * L1 + t * L2
        assert (Hm >= -1e-12).all() and (Hm <= 1 + 1e-12).all()
    W, H = W0, 280
    R, e = _repere_egal(-0.42, 1.42, -0.2, 1.2, W, H, marge=10)
    S = Schema(W, H, 'Dans le carré du tore, les chemins a·b et b·a sont homotopes')
    S.rect(*R(0, 1), e, e, 'g', rempli='g')
    S.ligne(R(0, 0), R(1, 1), 'g', d=True)
    S.poly(R(L1[:, 0], L1[:, 1]), 'r', l=3)
    S.poly(R(L2[:, 0], L2[:, 1]), 'b', l=3)
    S.pointe(R(0.55, 0), (1, 0), 'r')
    S.pointe(R(1, 0.55), (0, -1), 'r')
    S.pointe(R(0, 0.55), (0, -1), 'b')
    S.pointe(R(0.55, 1), (1, 0), 'b')
    for p in ((0, 0), (1, 1)):
        S.point(R(*p), 't', r=3.8)
    bx = []
    _etiq(S, R(0, 0) + [-8, 14], '(0, 0)', ancre='end', boites=bx)
    _etiq(S, R(1, 1) + [8, -14], '(1, 1)', ancre='start', boites=bx)
    _etiq(S, R(0.5, 0) + [0, 18], 'a', 'r', boites=bx)
    _etiq(S, R(1, 0.5) + [16, 0], 'b', 'r', ancre='start', boites=bx)
    _etiq(S, R(0, 0.5) + [-16, 0], 'b', 'b', ancre='end', boites=bx)
    _etiq(S, R(0.5, 1) + [0, -18], 'a', 'b', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-retracte-deformation-1')
def lex_retracte_deformation_1():
    pts = [np.array([math.cos(th), math.sin(th)]) * r for th, r in
           [(0.35, 1.7), (1.25, 0.45), (2.2, 1.45), (2.95, 0.3), (3.9, 1.85), (4.75, 0.55), (5.6, 1.35)]]
    W, H = W0, 290
    R, e = _repere_egal(-2.05, 2.05, -2.05, 2.05, W, H, marge=8)
    S = Schema(W, H, 'Le plan privé de l’origine se rétracte par déformation sur le cercle unité')
    for x in pts:
        u = x / np.linalg.norm(x)
        assert abs(np.linalg.norm(u) - 1) < 1e-12                                # H(x, 1) sur le cercle
        for t in np.linspace(0, 1, 21):                                          # H(x, t) ≠ 0, sur la demi-droite
            h = (1 - t) * x + t * u
            assert np.linalg.norm(h) > 0.2 and abs(h[0] * x[1] - h[1] * x[0]) < 1e-12 and h @ x > 0
        S.ligne(R(0, 0), R(*(2.0 * u)), 'g')
    S.cercle(R(0, 0), e, 'r')
    for x in pts:
        u = x / np.linalg.norm(x)
        if abs(np.linalg.norm(x) - 1) > 0.25:
            S.fleche(R(*x), R(*u), 'b', retrait=2)
        S.point(R(*x), 'b', r=3.4)
        S.point(R(*u), 'r', r=3.2)
    S.point(R(0, 0), 'g', r=4.2, creux=True)
    _etiq(S, R(0, 0) + [10, 14], '0', 'g', ancre='start')
    _etiq(S, R(-0.72, 0.72) + [-14, -16], 'S^1', 'r', ancre='end')
    return S


@schema('lex-theoreme-van-kampen-2')
def lex_theoreme_van_kampen_2():
    # U = S¹ ∖ {p(1/2)}, V = S¹ ∖ {p(0)} ; U ∩ V = p(]0, 1/2[) ∪ p(]1/2, 1[)
    dansU = lambda t: abs(t % 1 - 0.5) > 1e-9
    dansV = lambda t: abs((t + 0.5) % 1 - 0.5) > 1e-9
    ts = np.linspace(0, 1, 4001)[:-1]
    inter = [t for t in ts if dansU(t) and dansV(t)]
    assert all((0 < t < 0.5) or (0.5 < t < 1) for t in inter) and dansU(0.25) and dansV(0.25)
    W, H = W0, 280
    C = np.array([W / 2, H / 2 + 4])
    rho = 92
    P = lambda t, r=rho: C + r * np.array([math.cos(2 * math.pi * t), -math.sin(2 * math.pi * t)])
    arcp = lambda t0, t1, r: np.array([P(t, r) for t in np.linspace(t0, t1, 120)])
    S = Schema(W, H, 'Le cercle, réunion de deux arcs ouverts dont l’intersection a deux morceaux')
    S.poly(arcp(-0.49, 0.49, rho + 16), 'r', l=3)            # U : tout sauf p(1/2)
    S.poly(arcp(0.01, 0.99, rho - 16), 'b', l=3)             # V : tout sauf p(0)
    S.poly(arcp(0.0, 0.5, rho), 'v', l=4)
    S.poly(arcp(0.5, 1.0, rho), 'v', l=4)
    S.point(P(0.5, rho + 16), 'r', r=4, creux=True)
    S.point(P(0.0, rho - 16), 'b', r=4, creux=True)
    S.point(P(0.0), 'g', r=4, creux=True)
    S.point(P(0.5), 'g', r=4, creux=True)
    S.point(P(0.25), 't', r=3.8)
    S.point(P(0.75), 't', r=3.8)
    bx = []
    _etiq(S, P(0.25, rho + 32), 'x_0', boites=bx)
    _etiq(S, P(0.75, rho + 32), 'p(3/4)', boites=bx)
    _etiq(S, P(0.0, rho + 26) + [4, 0], 'p(0)', 'g', ancre='start', boites=bx)
    _etiq(S, P(0.5, rho + 26) + [-4, 0], 'p(1/2)', 'g', ancre='end', boites=bx)
    _etiq(S, P(0.375, rho + 32), 'U', 'r', boites=bx)
    _etiq(S, P(0.63, rho - 36), 'V', 'b', boites=bx)
    _disjointes(*bx)
    return S


# ================================================================================================== paquet 3

@schema('lex-localement-connexe-par-arcs-2')
def lex_localement_connexe_par_arcs_2():
    q, y, r = Fr(1), Fr(1), Fr(1, 2)
    droites = [Fr(k, 10) for k in range(0, 21)]
    # la boule de d∞ de centre (q, y), de rayon |y|/2, ne touche pas la base, et contient des points (q′, y), q′ ≠ q
    assert y - r > 0 and r == abs(y) / 2
    voisines = [d for d in droites if abs(d - q) < r and d != q]
    assert len(voisines) >= 4
    W, H = W0, 260
    R, e = _repere_egal(-0.12, 2.12, -0.32, 1.75, W, H, marge=8)
    S = Schema(W, H, 'Droites verticales d’abscisse rationnelle sur une base : connexe par arcs, non localement')
    S.rect(*R(float(q - r), float(y + r)), float(2 * r) * e, float(2 * r) * e, 'r', rempli='r')
    for d in droites:
        S.ligne(R(float(d), 0), R(float(d), 1.72), 'b' if d == q else 'g', l=2.6 if d == q else None)
    S.ligne(R(-0.12, 0), R(2.12, 0), 't', l=2.4)
    for d in voisines:
        S.point(R(float(d), float(y)), 'g', r=2.8)
    S.point(R(float(q), float(y)), 'b', r=3.8)
    bx = []
    _etiq(S, R(float(q), float(y)) + [8, 17], '(q, 1)', 'b', ancre='start', taille=15, boites=bx)
    _etiq(S, R(0, 0) + [0, 16], '0', 'g', taille=14, boites=bx)
    _etiq(S, R(2, 0) + [0, 16], '2', 'g', taille=14, boites=bx)
    _etiq(S, R(float(q), 0) + [0, 16], 'q', 'b', taille=15, boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-espace-projectif-reel-1')
def lex_espace_projectif_reel_1():
    s = np.linspace(0, 1, 241)
    g = np.stack([np.sin(np.pi * s), np.cos(np.pi * s)], -1)              # (x₁, x₃) de γ
    ag = -g                                                                # a∘γ
    assert np.allclose(g[0], [0, 1]) and np.allclose(g[-1], [0, -1])       # de N à −N
    assert np.allclose(ag[0], [0, -1]) and np.allclose(ag[-1], [0, 1])     # de −N à N : γ·(a∘γ) est un lacet
    assert (g[1:-1, 0] > 0).all() and (ag[1:-1, 0] < 0).all()
    assert np.allclose(np.linalg.norm(g, axis=1), 1)                       # sur la sphère
    W, H = W0, 280
    R, e = _repere_egal(-1.75, 1.75, -1.22, 1.22, W, H, marge=8)
    S = Schema(W, H, 'Un demi-grand cercle relève un lacet non trivial de ℝP², le grand cercle relève son double')
    S.ligne(R(-1.45, 0), R(1.45, 0), 'g', d=True)
    S.ligne(R(0, -1.15), R(0, 1.15), 'g', d=True)
    S.poly(R(g[:, 0], g[:, 1]), 'r', l=2.6)
    S.poly(R(ag[:, 0], ag[:, 1]), 'b', l=2.6)
    S.pointe(R(1, 0), (0, 1), 'r')
    S.pointe(R(-1, 0), (0, -1), 'b')
    S.point(R(0, 1), 't', r=3.8)
    S.point(R(0, -1), 't', r=3.8)
    bx = []
    _etiq(S, R(0, 1) + [10, -12], 'N', ancre='start', boites=bx)
    _etiq(S, R(0, -1) + [10, 12], '−N', ancre='start', boites=bx)
    _etiq(S, R(1, 0) + [12, -18], 'γ', 'r', ancre='start', boites=bx)
    _etiq(S, R(-1, 0) + [-12, -18], 'a ∘ γ', 'b', ancre='end', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-semi-localement-simplement-connexe-2')
def lex_semi_localement_simplement_connexe_2():
    ks = range(1, 13)
    rho = 0.5
    th = np.linspace(0, 2 * np.pi, 361)
    dedans = []
    for k in ks:
        c = np.stack([1 / k + np.cos(th) / k, np.sin(th) / k], -1)
        assert np.allclose(np.linalg.norm(c - [1 / k, 0], axis=1), 1 / k)
        assert np.isclose(np.linalg.norm(c, axis=1).max(), 2 / k)           # le cercle C_k est dans la boule de rayon 2/k
        if 2 / k < rho:
            dedans.append(k)
            assert np.linalg.norm(c, axis=1).max() < rho                   # contenu dans la boule ouverte
    assert dedans == list(range(5, 13))
    W, H = W0, 280
    R, e = _repere_egal(-0.62, 2.12, -1.06, 1.06, W, H, marge=8)
    S = Schema(W, H, 'Boucle d’oreille hawaïenne : la boule de rayon 1/2 contient des cercles entiers')
    S.cercle(R(0, 0), rho * e, 'r', rempli='r')
    for k in ks:
        S.cercle(R(1 / k, 0), e / k, 'b' if k in dedans else 't')
    S.point(R(0, 0), 't', r=3.2)
    bx = []
    _etiq(S, R(2, 0) + [-14, -34], 'C_1', boites=bx)
    _etiq(S, R(1, 0) + [-8, -34], 'C_2', boites=bx)
    _etiq(S, R(0, 0) + [-6, 18], '0', ancre='end', boites=bx)
    _disjointes(*bx)
    return S


@schema('lex-monodromie-3')
def lex_monodromie_3():
    t12 = {1: 2, 2: 1, 3: 3}
    t23 = {1: 1, 2: 3, 3: 2}
    # action à droite : i·a = τ12(i), i·b = τ23(i) ; 1·(ab) = 3, 1·(ba) = 2
    assert t23[t12[1]] == 3 and t12[t23[1]] == 2
    W, H = W0, 200
    pos = {1: np.array([110.0, 100.0]), 2: np.array([210.0, 100.0]), 3: np.array([310.0, 100.0])}
    S = Schema(W, H, 'Monodromie du revêtement à trois feuillets du bouquet : a agit par τ12, b par τ23')
    rr = 13

    def fleche_courbe(i, j, c, haut):
        p, q = pos[i], pos[j]
        signe = -1 if haut else 1
        pts = []
        for u in np.linspace(0, 1, 60):
            m = (1 - u) * p + u * q
            pts.append(m + [0, signe * 34 * math.sin(math.pi * u)])
        pts = np.array(pts)
        d0 = np.linalg.norm(pts - p, axis=1)
        d1 = np.linalg.norm(pts - q, axis=1)
        pts = pts[(d0 > rr) & (d1 > rr + 2)]
        S.courbe_fleche(pts, c)
        return pts

    courbes = []
    courbes.append(fleche_courbe(1, 2, 'r', True))
    courbes.append(fleche_courbe(2, 1, 'r', False))
    courbes.append(fleche_courbe(2, 3, 'b', True))
    courbes.append(fleche_courbe(3, 2, 'b', False))
    # boucles : a fixe 3, b fixe 1
    for i, c, sens in ((3, 'r', 1), (1, 'b', -1)):
        cx = pos[i] + [sens * (rr + 16), 0]
        S.cercle(cx, 16, c)
        S.pointe(cx + [0, -16], (sens, 0), c)
    for i, p in pos.items():
        S.texte(p, str(i), 't', taille=17)
    bx = []
    _etiq(S, (160, 52), 'a', 'r', boites=bx, eviter=courbes)
    _etiq(S, (260, 52), 'b', 'b', boites=bx, eviter=courbes)
    _etiq(S, (pos[3][0] + rr + 46, 100), 'a', 'r', ancre='start', boites=bx)
    _etiq(S, (pos[1][0] - rr - 46, 100), 'b', 'b', ancre='end', boites=bx)
    _disjointes(*bx)
    return S

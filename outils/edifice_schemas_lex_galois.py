"""Schémas des exemples du lexique, théorie galois (théorie de Galois, cyclotomie, Hilbert 90, représentations) :
contenu/exemples/galois.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Les objets (éléments d'un corps fini, points construits, racines) sont calculés, les positions
aussi, et ce que dit chaque légende est vérifié par assert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

TAILLE = 17


def _dans_cadre(x0, x1, y, W, H, marge=3):
    assert marge <= x0 and x1 <= W - marge and marge + 9 <= y <= H - marge - 9, (x0, x1, y)


def _boite(p, s, ancre):
    """Intervalle horizontal occupé par une étiquette (centre vertical p[1], hauteur ± 11)."""
    w = largeur_texte(s, TAILLE)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    return x0, x0 + w


# ---------------------------------------------------------------- 𝔽_9 et le Frobenius
@schema('lex-corps-fini-2')
def lex_corps_fini_2():
    # 𝔽_9 = 𝔽_3[i], i² = −1 ; un élément est un couple (a, b) pour a + bi.
    def mul(u, v):
        return ((u[0] * v[0] - u[1] * v[1]) % 3, (u[0] * v[1] + u[1] * v[0]) % 3)
    assert all((x * x + 1) % 3 != 0 for x in range(3))            # X² + 1 sans racine : irréductible
    g = (1, 1)
    puis = [(1, 0)]
    for _ in range(7):
        puis.append(mul(puis[-1], g))
    assert mul(puis[-1], g) == (1, 0)
    assert len(set(puis)) == 8 and (0, 0) not in puis              # g engendre 𝔽_9^× : cyclique d'ordre 8

    def cube(u):
        return mul(mul(u, u), u)
    assert all(cube(puis[k]) == puis[3 * k % 8] for k in range(8))  # Frobenius : g^k ↦ g^{3k}
    fixes = [k for k in range(8) if 3 * k % 8 == k]
    assert fixes == [0, 4] and puis[0] == (1, 0) and puis[4] == (2, 0)   # 1 et −1 = 2 : 𝔽_3^×
    paires = sorted({tuple(sorted((k, 3 * k % 8))) for k in range(8) if 3 * k % 8 != k})
    assert paires == [(1, 3), (2, 6), (5, 7)]
    assert all(cube(cube(puis[k])) == puis[k] for k in range(8))      # involution : il « échange »

    def ecrit(u):
        a, b = u
        if b == 0:
            return str(a)
        ib = 'i' if b == 1 else f'{b}i'
        return ib if a == 0 else f'{a} + {ib}'
    W, H = 420, 290
    S = Schema(W, H, 'Le corps 𝔽₉ : puissances de g = 1 + i et Frobenius x ↦ x³')
    c0, R = np.array([W / 2, 140.0]), 88
    ang = [2 * math.pi * k / 8 for k in range(8)]
    pos = [c0 + R * np.array([math.cos(t), -math.sin(t)]) for t in ang]   # sens trigonométrique
    S.poly(pos, 'g', ferme=True)
    for (k, l) in paires:
        S.fleche(pos[k], pos[l], 'b', retrait=9, retrait_debut=9, double=True)
    boites = []
    for k in range(8):
        coul = 'r' if k in fixes else 't'
        S.point(pos[k], coul, r=4.5)
        u = (pos[k] - c0) / R
        nom = 'g' if k == 1 else f'g^{k}'
        etiq = f'{nom} = {ecrit(puis[k])}'
        ancre = 'middle' if abs(u[0]) < 0.3 else ('start' if u[0] > 0 else 'end')
        p = pos[k] + u * 18 + (np.array([0, 4 * np.sign(u[1])]) if ancre == 'middle' else 0)
        x0, x1 = _boite(p, etiq.replace('^', ''), ancre)
        _dans_cadre(x0, x1, p[1], W, H)
        boites.append((x0, x1, p[1]))
        S.texte(p, etiq, coul, ancre=ancre, taille=TAILLE)
    for i in range(8):                                                  # étiquettes disjointes
        for k in range(i + 1, 8):
            a0, a1, ya = boites[i]
            b0, b1, yb = boites[k]
            assert a1 + 4 < b0 or b1 + 4 < a0 or abs(ya - yb) > 22, (i, k)
    S.texte((W / 2, H - 16), '`Frobenius` x ↦ x^3', 'b', taille=TAILLE)
    return S


# ---------------------------------------------------------------- racines neuvièmes de l'unité et r = 2 cos(2π/9)
@schema('lex-extension-radicale-3')
def lex_extension_radicale_3():
    zeta = complex(math.cos(2 * math.pi / 9), math.sin(2 * math.pi / 9))
    z = [zeta ** k for k in range(9)]
    assert abs(zeta ** 9 - 1) < 1e-12 and all(abs(abs(w) - 1) < 1e-12 for w in z)
    assert len({(round(w.real, 9), round(w.imag, 9)) for w in z}) == 9         # neuf racines distinctes
    om = z[3]
    assert abs(om ** 2 + om + 1) < 1e-12 and abs(z[6] - om ** 2) < 1e-12        # ω = ζ³ racine de X² + X + 1
    assert abs(z[8] - zeta.conjugate()) < 1e-12                                 # ζ̄ = ζ⁸
    r = (zeta + z[8]).real
    assert abs((zeta + z[8]).imag) < 1e-12 and abs(r - 2 * math.cos(2 * math.pi / 9)) < 1e-12
    assert abs(r ** 3 - 3 * r + 1) < 1e-12                                      # r racine de X³ − 3X + 1
    W, H = 420, 270
    S = Schema(W, H, 'Racines neuvièmes de l\'unité et r = 2 cos(2π/9)')
    c0, R = np.array([170.0, 135.0]), 96
    P = lambda w: c0 + R * np.array([w.real, -w.imag])
    assert P(r)[0] + 30 < W                                                     # r et son étiquette dans le cadre
    S.ligne((c0[0] - R - 30, c0[1]), (W - 14, c0[1]), 'g')
    S.cercle(c0, R, 'g')
    S.poly([P(0), P(zeta), P(r), P(z[8])], 'r', d=True, ferme=True)
    coul = {1: 'r', 8: 'r', 3: 'b', 6: 'b'}
    noms = {0: '1', 1: 'ζ', 3: 'ζ^3', 6: 'ζ^6', 8: 'ζ^8'}
    for k in range(9):
        S.point(P(z[k]), coul.get(k, 't'), r=4)
    for k, nom in noms.items():
        u = np.array([z[k].real, -z[k].imag])
        p = P(z[k]) + 17 * u
        if k == 0:
            p = P(z[k]) + np.array([-10, -15])
        ancre = 'middle' if abs(u[0]) < 0.35 else ('start' if u[0] > 0 else 'end')
        S.texte(p, nom, coul.get(k, 't'), ancre=ancre, taille=TAILLE)
    S.point(P(0), 't', r=3)
    S.texte(P(0) + np.array([-10, 15]), '0', 't', taille=TAILLE)
    S.point(P(r), 'r', r=4.5)
    S.texte(P(r) + np.array([0, 18]), 'r', 'r', taille=TAILLE)
    assert P(r)[1] + 18 + 10 < H and P(z[3])[1] - 30 > 0
    return S


# ---------------------------------------------------------------- plan x + y + z = 0 : droite stable par τ₁₂, pas par σ
@schema('lex-sous-espace-stable-representation-2')
def lex_sous_espace_stable_representation_2():
    e = np.eye(3)
    s = np.ones(3)
    f1, f2 = np.array([1, -1, 0]) / math.sqrt(2), np.array([1, 1, -2]) / math.sqrt(6)   # base orthonormée de H
    assert abs(f1 @ f2) < 1e-12 and abs(f1 @ s) < 1e-12 and abs(f2 @ s) < 1e-12
    coord = lambda v: np.array([v @ f1, v @ f2])
    p = [coord(e[i] - s / 3) for i in range(3)]                    # projections orthogonales sur H
    cotes = [np.linalg.norm(p[i] - p[(i + 1) % 3]) for i in range(3)]
    assert max(cotes) - min(cotes) < 1e-12                          # triangle équilatéral
    tau = np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]])               # τ₁₂ : e₁ ↔ e₂
    sig = np.array([[0, 0, 1], [1, 0, 0], [0, 1, 0]])               # σ : e₁ → e₂ → e₃ → e₁
    assert (sig @ e[0] == e[1]).all() and (sig @ e[1] == e[2]).all()
    u = e[0] - e[1]
    assert (tau @ u == -u).all()                                    # τ₁₂ conserve la droite de u
    su = sig @ u
    assert (su == e[1] - e[2]).all() and abs(np.linalg.det(np.array([coord(u), coord(su)]))) > 1e-6   # non proportionnel
    du, dsu = coord(u), coord(su)
    cross = lambda a, b: a[0] * b[1] - a[1] * b[0]
    assert abs(cross(du, p[0] - p[1])) < 1e-12 and abs(cross(dsu, p[1] - p[2])) < 1e-12   # parallélismes de la légende
    W, H = 420, 280
    S = Schema(W, H, 'Le plan x + y + z = 0 : une droite stable par τ₁₂ mais pas par σ')
    c0, k = np.array([W / 2, 142.0]), 112
    P = lambda v: c0 + k * np.array([v[0], -v[1]])
    S.poly([P(q) for q in p], 'g', ferme=True)
    for d, coul in ((du, 'r'), (dsu, 'b')):
        d = d / np.linalg.norm(d)
        S.ligne(P(-1.15 * d), P(1.15 * d), coul, l=2.2)
    S.fleche(P(np.zeros(2)), P(du / np.linalg.norm(du) * 0.75), 'r', l=2.2)
    S.fleche(P(np.zeros(2)), P(dsu / np.linalg.norm(dsu) * 0.75), 'b', l=2.2)
    S.texte(P(du / np.linalg.norm(du) * 0.75) + np.array([0, 16]), 'u', 'r', taille=TAILLE)
    S.texte(P(dsu / np.linalg.norm(dsu) * 0.75) + np.array([-16, -4]), 'σ(u)', 'b', ancre='end', taille=TAILLE)
    noms = ['p_1', 'p_2', 'p_3']
    for i in range(3):
        S.point(P(p[i]), 't', r=4)
        dirr = p[i] / np.linalg.norm(p[i])
        q = P(p[i]) + 18 * np.array([dirr[0], -dirr[1]])
        S.texte(q, noms[i], 't', taille=TAILLE)
        assert 12 < q[0] < W - 12 and 12 < q[1] < H - 12
    S.point(P(np.zeros(2)), 't', r=3)
    for d in (du, dsu):
        d = d / np.linalg.norm(d)
        for sg in (1, -1):
            q = P(sg * 1.15 * d)
            assert 0 <= q[0] <= W and 0 <= q[1] <= H, q
    return S


# ---------------------------------------------------------------- √2 constructible : cercle de centre 0, écartement |i − 1|
@schema('lex-point-constructible-2')
def lex_point_constructible_2():
    rayon = abs(1j - 1)
    assert abs(rayon - math.sqrt(2)) < 1e-12
    # points communs du cercle |z| = rayon et de la droite (0 1) = ℝ : t réel, |t| = rayon
    inter = [t for t in (rayon, -rayon) if abs(abs(complex(t, 0)) - rayon) < 1e-12]
    assert len(inter) == 2 and abs(max(inter) - math.sqrt(2)) < 1e-12
    W, H = 420, 270
    S = Schema(W, H, 'Construction de √2 à la règle et au compas')
    c0, k = np.array([W / 2, 135.0]), 82
    P = lambda z: c0 + k * np.array([z.real, -z.imag])
    S.ligne((14, c0[1]), (W - 14, c0[1]), 'g')                       # droite (0 1)
    S.ligne((c0[0], H - 14), (c0[0], 14), 'g', d=True)                # axe imaginaire, pour le repère
    S.cercle(c0, k * rayon, 'b')
    S.ligne(P(1), P(1j), 't', d=True)
    for z, nom, dp, ancre in ((0, '0', (-8, 16), 'end'), (1, '1', (0, 18), 'middle'), (1j, 'i', (10, -10), 'start')):
        S.point(P(complex(z)), 't', r=4)
        S.texte(P(complex(z)) + np.array(dp), nom, 't', ancre=ancre, taille=TAILLE)
    S.point(P(complex(rayon, 0)), 'r', r=4.5)
    S.texte(P(complex(rayon, 0)) + np.array([8, 18]), '√2', 'r', ancre='start', taille=TAILLE)
    S.point(P(complex(-rayon, 0)), 't', r=4)
    S.texte(P(complex(-rayon, 0)) + np.array([-8, 18]), '−√2', 't', ancre='end', taille=TAILLE)
    assert c0[1] - k * rayon > 8 and c0[1] + k * rayon < H - 8 and c0[0] - k * rayon - 50 > 0
    return S


# ---------------------------------------------------------------- X³ − 3X + 1 : x ↦ x² − 2 permute les racines
@schema('lex-extension-cyclique-3')
def lex_extension_cyclique_3():
    from edifice_svg import Repere, courbe_entre
    P = lambda x: x ** 3 - 3 * x + 1
    rac = sorted(np.roots([1, 0, -3, 1]).real)
    assert all(abs(P(x)) < 1e-12 for x in rac) and len(rac) == 3
    r1, r2, r3 = rac
    assert 1 < r3 < 2 and abs(r3 - 2 * math.cos(2 * math.pi / 9)) < 1e-12        # r, entre 1 et 2
    phi = lambda x: x * x - 2
    assert abs(phi(r3) - r2) < 1e-9 and abs(phi(r2) - r1) < 1e-9 and abs(phi(r1) - r3) < 1e-9   # cycle r → r² − 2 → …
    W, H = 420, 290
    S = Schema(W, H, 'Les racines de X³ − 3X + 1 permutées par x ↦ x² − 2')
    R = Repere(-2.2, 2.2, -3.4, 4.0, 30, 10, 360, 170)
    a, b = R(-2.2, 0), R(2.2, 0)
    S.ligne(a, b, 'g')
    xs = np.linspace(-2.2, 2.2, 400)
    ys = P(xs)
    m = (ys >= -3.4) & (ys <= 4.0)
    S.poly(R(xs[m], ys[m]), 't', l=2)
    yb = 232
    S.ligne((30, yb), (390, yb), 'g')
    for x in rac:
        S.ligne(R(x, 0), (R(x, 0)[0], yb), 'g', d=True)
        S.point(R(x, 0), 'r', r=4.5)
        S.point((R(x, 0)[0], yb), 'r', r=4.5)
    X = {x: np.array([R(x, 0)[0], yb]) for x in rac}
    for (u, v, cb) in ((r3, r2, 0.35), (r2, r1, 0.3), (r1, r3, 0.22)):
        pts = courbe_entre(X[u], X[v], courbure=cb)
        dU = np.linalg.norm(pts - X[u], axis=1); dV = np.linalg.norm(pts - X[v], axis=1)
        pts = pts[(dU > 8) & (dV > 8)]
        assert pts[:, 1].min() > R(0, 0)[1] + 12 and pts[:, 1].max() < H - 6        # sous l'axe du graphe, dans le cadre
        S.courbe_fleche(pts, 'b')
    S.texte(X[r3] + np.array([12, 16]), 'r', 'r', ancre='start', taille=TAILLE)
    S.texte((135, 172), 'x ↦ x^2 − 2', 'b', taille=TAILLE)
    return S

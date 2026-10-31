"""Schémas du graphe derham (théorème de de Rham en degré 1)."""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _theta(x):
    x = np.asarray(x, float)
    return np.where(x > 0, np.exp(-1 / np.where(x > 0, x, 1)), 0.0)


@schema('dr-plateau')
def dr_plateau():
    # à gauche θ(x) = e^{-1/x} (x > 0), 0 sinon ; point d'inflexion en 1/2 (P_2(u) = u³(u − 2)).
    # à droite ψ_{0,1}(t) = θ(1 − t²) : > 0 sur ]−1, 1[, nulle ailleurs, maximum θ(1) en 0.
    d2 = lambda x: (x ** -4 - 2 * x ** -3) * np.exp(-1 / x)
    assert abs(d2(0.5)) < 1e-12 and d2(0.4) > 0 and d2(0.6) < 0
    assert _theta(-0.5) == 0 and _theta(0) == 0 and abs(_theta(1) - 0.36788) < 1e-5
    ts = np.linspace(-1.6, 1.6, 641)
    ps = _theta(1 - ts ** 2)
    assert np.all(ps[np.abs(ts) >= 1] == 0) and np.all(ps[np.abs(ts) < 1] > 0)
    assert abs(ps.max() - _theta(1)) < 1e-12 and ts[ps.argmax()] == 0
    S = Schema(520, 230, 'La fonction θ, plate en 0, et la fonction plateau θ(1 − t²)')
    R = Repere(-1.0, 3.0, -0.08, 0.8, 24, 18, 250, 180)
    S.fleche(R(-1.0, 0), R(3.0, 0), 'g'); S.texte(R(3.0, 0) + [6, 12], 'x', 'g', ancre='start')
    S.fleche(R(0, -0.08), R(0, 0.8), 'g')
    S.ligne(R(-1.0, 0), R(0, 0), 't', l=2.2)
    R.graphe(S, _theta, 0, 3.0, 't', l=2.2)
    S.point(R(0.5, float(_theta(0.5))), 'r', r=4.2)
    S.ligne(R(0.5, 0), R(0.5, float(_theta(0.5))), 'r', d=True)
    S.texte(R(0.5, 0) + [0, 16], '1/2', 'r', taille=15)
    S.texte(R(2.3, float(_theta(2.3))) + [0, -16], 'θ', 't', taille=17)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    Q = Repere(-1.6, 1.6, -0.08, 0.8, 300, 18, 200, 180)
    S.fleche(Q(-1.6, 0), Q(1.6, 0), 'g'); S.texte(Q(1.6, 0) + [6, 12], 't', 'g', ancre='start')
    S.fleche(Q(0, -0.08), Q(0, 0.8), 'g')
    S.poly(Q(ts, ps), 'b', l=2.2)
    S.surface(np.vstack([Q(ts[np.abs(ts) <= 1], ps[np.abs(ts) <= 1])]), 'b')
    for s_ in (-1, 1):
        S.texte(Q(s_, 0) + [0, 15], '−1' if s_ < 0 else '1', 'b', taille=15)
    S.texte(Q(0, float(_theta(1))) + [10, -14], 'ψ', 'b', ancre='start', taille=17)
    return S


@schema('dr-cocycle')
def dr_cocycle():
    # U = R² ∖ {0}, δ(p) = min(1, ‖p‖∞) ; cubes k = 0 : centres dans (1/16)Z², rayon 1/8,
    # condition 1/4 ≤ δ(p) ≤ 2. Anneau ‖p‖∞ = 6/16, pas 3/16.
    from fractions import Fraction as Fr
    h = Fr(3, 16); c = Fr(6, 16); r = Fr(1, 8)
    def dans_I(p):
        dl = min(Fr(1), max(abs(p[0]), abs(p[1])))
        return Fr(1, 4) <= dl <= 2 and all((16 * q).denominator == 1 for q in p)
    haut = [(c, 0), (c, h), (c, c), (h, c), (0, c), (-h, c), (-c, c), (-c, h)]
    bas = [(c, 0), (c, -h), (c, -c), (h, -c), (0, -c), (-h, -c), (-c, -c), (-c, -h), (-c, 0)]
    tous = set(haut) | set(bas)
    assert len(tous) == 16 and all(dans_I(p) for p in tous)
    for ch in (haut, bas):
        for a, b in zip(ch, ch[1:]):
            assert max(abs(a[0] - b[0]), abs(a[1] - b[1])) < 2 * r        # cubes voisins sécants
    pi_, pj = haut[-1], bas[-1]
    x = (-c + Fr(1, 16), Fr(3, 32))
    for p in (pi_, pj):
        assert max(abs(x[0] - p[0]), abs(x[1] - p[1])) < r                 # x ∈ B_i ∩ B_j
    for p in tous:
        assert max(abs(p[0]), abs(p[1])) - r > 0                           # aucun cube ne contient 0
    # indice du lacet : chaîne haute, [p_i, x], [x, p_j], chaîne basse à rebours
    lacet = [np.array(q, float) for q in haut + [x] + bas[::-1]]
    tour = sum(np.arctan2(u[0] * v[1] - u[1] * v[0], u @ v) for u, v in zip(lacet, lacet[1:]))
    assert abs(tour / (2 * np.pi) - 1) < 1e-12
    S = Schema(480, 440, 'Deux chaînes de cubes autour de l’origine et le lacet qui définit a_ij')
    e = 380.0
    P = lambda q: np.array([240 + float(q[0]) * e, 220 - float(q[1]) * e])
    rr = float(r) * e
    for q in sorted(tous):
        if q in ((c, 0), pi_, pj):
            continue
        S.rect(P(q)[0] - rr, P(q)[1] - rr, 2 * rr, 2 * rr, 'g')
    S.rect(P((c, 0))[0] - rr, P((c, 0))[1] - rr, 2 * rr, 2 * rr, 't', rempli='g')
    S.rect(P(pi_)[0] - rr, P(pi_)[1] - rr, 2 * rr, 2 * rr, 'b', rempli='b')
    S.rect(P(pj)[0] - rr, P(pj)[1] - rr, 2 * rr, 2 * rr, 'v', rempli='v')
    S.poly([P(q) for q in haut], 'b', l=2.2)
    S.poly([P(q) for q in bas], 'v', l=2.2)
    for ch, col in ((haut, 'b'), (bas, 'v')):
        for q in ch:
            S.point(P(q), col, r=3.2)
    S.ligne(P(pi_), P(x), 'r', l=2.4)
    S.ligne(P(pj), P(x), 'r', l=2.4)
    S.point(P(x), 'r', r=4.6)
    S.texte(P(x) + [12, 0], 'x', 'r', ancre='start')
    S.point(P((0, 0)), 'g', r=4.5, creux=True)
    S.texte(P((0, 0)) + [0, 18], '0', 'g')
    S.texte(P((c, 0)) + [12, 16], 'p_b', 't', ancre='start')
    S.texte(P(pi_) + [-rr - 6, -rr + 4], 'B_i', 'b', ancre='end')
    S.texte(P(pj) + [-rr - 6, rr - 4], 'B_j', 'v', ancre='end')
    return S


@schema('dr-homotopie')
def dr_homotopie():
    # carré [0, 1]² découpé en N × N petits carrés ; segments intérieurs en gris, bord en rouge ;
    # un petit carré mis en évidence avec son orientation directe.
    N = 4
    S = Schema(420, 300, 'Découpage du carré : les segments intérieurs se compensent, il reste le bord')
    x0, y0, c = 60, 30, 240
    P = lambda u, v: np.array([x0 + u * c, y0 + (1 - v) * c])
    for k in range(1, N):
        S.ligne(P(k / N, 0), P(k / N, 1), 'g')
        S.ligne(P(0, k / N), P(1, k / N), 'g')
    bord = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]
    S.poly(bord, 'r', ferme=True, l=2.4)
    # flèches d'orientation du bord
    S.pointe(P(0.5, 0), (1, 0), 'r', taille=11, largeur=5)
    S.pointe(P(1, 0.5), (0, -1), 'r', taille=11, largeur=5)
    S.pointe(P(0.5, 1), (-1, 0), 'r', taille=11, largeur=5)
    S.pointe(P(0, 0.5), (0, 1), 'r', taille=11, largeur=5)
    # un petit carré Q_{23}, parcouru dans le sens direct
    j, k = 2, 3
    a, b = (j - 1) / N, (k - 1) / N
    q = [P(a, b), P(a + 1 / N, b), P(a + 1 / N, b + 1 / N), P(a, b + 1 / N)]
    S.poly(q, 'b', ferme=True, rempli='b', l=1.8)
    m = 0.5 / N
    S.pointe(P(a + m, b), (1, 0), 'b', taille=9, largeur=4)
    S.pointe(P(a + 1 / N, b + m), (0, -1), 'b', taille=9, largeur=4)
    S.pointe(P(a + m, b + 1 / N), (-1, 0), 'b', taille=9, largeur=4)
    S.pointe(P(a, b + m), (0, 1), 'b', taille=9, largeur=4)
    S.texte(P(a + m, b + m), 'Q', 'b', taille=16)
    S.texte(P(0.5, 0) + [0, 22], 'β', 'r', taille=17)
    S.texte(P(1, 0.5) + [16, 0], 'ρ', 'r', ancre='start', taille=17)
    S.texte(P(0.5, 1) + [0, -16], 'θ', 'r', taille=17)
    S.texte(P(0, 0.5) + [-16, 0], 'λ', 'r', ancre='end', taille=17)
    S.texte(P(1, 1) + [56, 30], 'H', 't', taille=17)
    S.fleche(P(1, 1) + [24, 40], P(1, 1) + [96, 40], 't', l=1.4)
    S.texte(P(1, 1) + [64, 64], 'vers U', 't', ui=True, taille=13)
    return S


@schema('dr-chaines')
def dr_chaines():
    # H(s, t) = (1 − s, s(1 − t), st) : carré → triangle Δ₂ ; images des côtés.
    def H(s, t):
        return np.array([1 - s, s * (1 - t), s * t])
    for s_ in np.linspace(0, 1, 11):
        for t_ in np.linspace(0, 1, 11):
            v = H(s_, t_)
            assert min(v) >= -1e-12 and abs(sum(v) - 1) < 1e-12
    assert np.allclose(H(0.3, 0), [0.7, 0.3, 0]) and np.allclose(H(1, 0.4), [0, 0.6, 0.4])
    assert np.allclose(H(0.3, 1), [0.7, 0, 0.3]) and np.allclose(H(0, 0.5), [1, 0, 0])
    S = Schema(590, 270, 'Le carré envoyé sur le triangle Δ₂ par (s, t) ↦ (1 − s, s(1 − t), st)')
    x0, y0, c = 70, 40, 170
    P = lambda u, v: np.array([x0 + u * c, y0 + (1 - v) * c])
    cols = {'b': 'v', 'd': 'b', 'h': 'r', 'g': 'o'}
    S.ligne(P(0, 0), P(1, 0), cols['b'], l=3); S.pointe(P(0.55, 0), (1, 0), cols['b'], taille=10, largeur=5)
    S.ligne(P(1, 0), P(1, 1), cols['d'], l=3); S.pointe(P(1, 0.55), (0, -1), cols['d'], taille=10, largeur=5)
    S.ligne(P(0, 1), P(1, 1), cols['h'], l=3); S.pointe(P(0.55, 1), (1, 0), cols['h'], taille=10, largeur=5)
    S.ligne(P(0, 0), P(0, 1), cols['g'], l=3)
    S.texte(P(0.5, 0) + [0, 20], 't = 0', cols['b'], taille=14)
    S.texte(P(1, 0.5) + [10, 0], 's = 1', cols['d'], ancre='start', taille=14)
    S.texte(P(0.5, 1) + [0, -16], 't = 1', cols['h'], taille=14)
    S.texte(P(0, 0.5) + [-10, 0], 's = 0', cols['g'], ancre='end', taille=14)
    # triangle : e0 en bas à gauche, e1 en bas à droite, e2 en haut
    X0, Y0, C = 350, 40, 200
    E = {0: np.array([X0, Y0 + C * 0.85]), 1: np.array([X0 + C, Y0 + C * 0.85]), 2: np.array([X0 + C / 2, Y0])}
    def T(v):
        return v[0] * E[0] + v[1] * E[1] + v[2] * E[2]
    S.ligne(T(H(0, 0)), T(H(1, 0)), cols['b'], l=3); S.pointe((E[0] + E[1]) / 2 + [8, 0], (1, 0), cols['b'], taille=10, largeur=5)
    S.ligne(T(H(1, 0)), T(H(1, 1)), cols['d'], l=3)
    u = (E[2] - E[1]) / np.linalg.norm(E[2] - E[1]); S.pointe((E[1] + E[2]) / 2 + 8 * u, u, cols['d'], taille=10, largeur=5)
    S.ligne(T(H(0, 1)), T(H(1, 1)), cols['h'], l=3)
    w = (E[2] - E[0]) / np.linalg.norm(E[2] - E[0]); S.pointe((E[0] + E[2]) / 2 + 8 * w, w, cols['h'], taille=10, largeur=5)
    S.point(E[0], cols['g'], r=6)
    for i, d in ((0, [-12, 14]), (1, [12, 14]), (2, [0, -16])):
        S.texte(E[i] + d, f'e_{i}', 't', ancre='end' if i == 0 else ('start' if i == 1 else 'middle'), taille=16)
    S.fleche(P(1, 0.5) + [62, 0], [X0 - 16, Y0 + C * 0.45], 't', l=1.4)
    S.texte([(P(1, 0.5)[0] + 62 + X0 - 16) / 2, Y0 + C * 0.45 - 16], 'H', 't', taille=16)
    return S


def _iota(i, eps, t):
    """Insère eps en position i (1 ≤ i ≤ k) dans le (k−1)-uplet t."""
    t = list(t)
    return tuple(t[:i - 1] + [eps] + t[i - 1:])


@schema('dr-cubes')
def dr_cubes():
    # Faces du carré I² : ι_{i,ε}(s) insère ε en position i ; signe (−1)^{i+ε}.
    # Le bord, chaque face parcourue dans son sens (s croissant) ou à rebours selon le signe,
    # doit faire le tour du carré dans le sens direct (aire orientée > 0).
    faces = {}
    for i in (1, 2):
        for e in (0, 1):
            a, b = np.array(_iota(i, e, (0,)), float), np.array(_iota(i, e, (1,)), float)
            sg = (-1) ** (i + e)
            faces[(i, e)] = (a, b, sg)
    aire = 0.0
    for a, b, sg in faces.values():
        p, q = (a, b) if sg > 0 else (b, a)
        aire += p[0] * q[1] - q[0] * p[1]
    assert abs(aire / 2 - 1) < 1e-12                      # contour direct, aire du carré
    assert faces[(2, 0)][2] == 1 and faces[(1, 1)][2] == 1 and faces[(2, 1)][2] == -1 and faces[(1, 0)][2] == -1
    S = Schema(520, 345, 'Bord orienté du carré unité : quatre faces et leurs signes')
    x0, y0, c = 160, 72, 200
    P = lambda u, v: np.array([x0 + u * c, y0 + (1 - v) * c])
    S.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], 'r', ferme=True, rempli='g', l=2.4)
    for (i, e), (a, b, sg) in faces.items():
        m = (a + b) / 2
        d = (b - a) * sg                                    # sens de parcours dans le bord
        S.pointe(P(*m) + 7 * np.array([d[0], -d[1]]), [d[0], -d[1]], 'r', taille=12, largeur=5.5)
        # flèche grise : sens de la paramétrisation de la face (s croissant), décalée vers l'extérieur
        nrm = np.array([0.0, 0.0])
        nrm[i - 1] = 1 if e == 1 else -1                   # normale sortante (coordonnées du carré)
        off = np.array([nrm[0], -nrm[1]]) * 26
        S.fleche(P(*(a + 0.2 * (b - a))) + off, P(*(a + 0.8 * (b - a))) + off, 'g', l=1.4)
        lab = P(*m) + np.array([nrm[0], -nrm[1]]) * 54
        signe = '+' if sg > 0 else '−'
        if i == 1:      # côtés verticaux : étiquette à côté
            S.texte(lab + [0, -12], f'ι_{{{i},{e}}}', 'g', taille=16)
            S.texte(lab + [0, 14], signe, 'r', taille=18)
        else:
            S.texte(lab + [-16, 0], f'ι_{{{i},{e}}}', 'g', taille=16)
            S.texte(lab + [18, 0], signe, 'r', taille=18)
    S.texte(P(0, 0) + [-8, 16], '0', 'g', ancre='end', taille=15)
    S.texte(P(1, 1) + [8, -14], '(1, 1)', 'g', ancre='start', taille=15)
    S.texte(P(0.5, 0.5), 'I^2', 't', taille=18)
    # petit repère
    o = np.array([40.0, 318.0])
    S.fleche(o, o + [34, 0], 'g', l=1.2); S.texte(o + [44, 0], 't_1', 'g', ancre='start', taille=15)
    S.fleche(o, o + [0, -34], 'g', l=1.2); S.texte(o + [0, -46], 't_2', 'g', taille=15)
    return S


def _oblique(x, y, z, O=(150.0, 300.0), vx=(150, 0), vy=(70, -50), vz=(0, -150)):
    """Projection oblique : x vers la droite, y fuyant vers le haut à droite, z vers le haut."""
    return np.array([O[0] + vx[0] * x + vy[0] * y + vz[0] * z, O[1] + vx[1] * x + vy[1] * y + vz[1] * z])


def _visee(vx, vy, vz):
    """Direction de visée (vers l'intérieur de l'image, composante y positive) : noyau de la projection."""
    M = np.array([vx, vy, vz], float).T
    v = np.cross(M[0], M[1])
    return v if v[1] > 0 else -v


@schema('dr-cubes-2')
def dr_cubes_2():
    # Faces {t_i = ε} du cube I³, signe (−1)^{i+ε} ; ce signe est celui de det(ν, ∂_1 φ, ∂_2 φ),
    # où ν est la normale sortante et φ = ι_{i,ε} la paramétrisation de la face.
    E = np.eye(3)
    vis_dir = _visee((150, 0), (70, -50), (0, -150))
    O = (170.0, 330.0)
    P = lambda p: _oblique(*p, O=O)
    # (longueur de la normale, décalage de l'étiquette, ancre)
    place = {(1, 0): (0.5, [-10, 0], 'end'), (1, 1): (0.5, [10, 0], 'start'),
             (2, 0): (1.0, [-14, 14], 'end'), (2, 1): (1.1, [10, -6], 'start'),
             (3, 0): (0.55, [0, 18], 'middle'), (3, 1): (0.55, [0, -16], 'middle')}
    S = Schema(540, 425, 'Le cube unité, ses six faces, leurs normales sortantes et leurs signes')
    V = {k: P(k) for k in np.ndindex(2, 2, 2)}
    # sommet caché : celui dont les trois faces sont invisibles
    cache = None
    for k in V:
        normales = [(1 if k[a] else -1) * E[a] for a in range(3)]
        if all(nv @ vis_dir > 0 for nv in normales):
            cache = k
    assert cache == (0, 1, 0)
    S.surface([V[(0, 0, 0)], V[(1, 0, 0)], V[(1, 0, 1)], V[(0, 0, 1)]], 'g')
    for u in V:
        for w in V:
            if u < w and sum(abs(np.array(u) - np.array(w))) == 1:
                S.ligne(V[u], V[w], 't', d=(cache in (u, w)), l=1.6)
    for i in (1, 2, 3):
        for e in (0, 1):
            nu = (1 if e == 1 else -1) * E[i - 1]
            cols = [E[l] for l in range(3) if l != i - 1]      # ι_{i,ε} envoie e_1, e_2 sur ces vecteurs
            sg = (-1) ** (i + e)
            assert np.sign(np.linalg.det(np.array([nu] + cols).T)) == sg
            centre = np.array(_iota(i, e, (0.5, 0.5)), float)
            vis = nu @ vis_dir < 0
            assert vis == ((i, e) in {(2, 0), (1, 1), (3, 1)})
            col = 'b' if sg > 0 else 'v'
            L, dec, anc = place[(i, e)]
            p, q = P(centre), P(centre + L * nu)
            S.point(p, col, r=3.2)
            S.fleche(p, q, col, d=not vis, l=1.8)
            S.texte(q + dec, f't_{i} = {e}   ' + ('+' if sg > 0 else '−'), col, ancre=anc, taille=15)
    o = (40.0, 405.0)
    for k, nom in ((0, 't_1'), (1, 't_2'), (2, 't_3')):
        a = _oblique(0, 0, 0, O=o)
        b = _oblique(*(0.22 * E[k]), O=o)
        S.fleche(a, b, 'g', l=1.2)
        S.texte(b + (b - a) / np.linalg.norm(b - a) * 12 + [4, 0], nom, 'g', ancre='start', taille=14)
    return S


@schema('dr-stokes')
def dr_stokes():
    # c(u, v, w) = (u, uv, uvw) : image du cube = tétraèdre {0 ≤ z ≤ y ≤ x ≤ 1}.
    import itertools
    c = lambda u, v, w: np.array([u, u * v, u * v * w])
    O, A, B, C = (np.array(p, float) for p in ((0, 0, 0), (1, 0, 0), (1, 1, 0), (1, 1, 1)))
    coins = {tuple(c(*k)) for k in np.ndindex(2, 2, 2)}
    assert coins == {tuple(O), tuple(A), tuple(B), tuple(C)}
    g = np.linspace(0, 1, 7)
    for a in g:
        for b in g:
            assert np.allclose(c(0, a, b), O)                      # face u = 0 : un point
            assert np.allclose(c(a, 0, b), [a, 0, 0])              # face v = 0 : segment [O, A]
            assert abs(c(1, a, b)[0] - 1) < 1e-12                  # face u = 1 : plan x = 1
            p = c(a, 1, b); assert abs(p[0] - p[1]) < 1e-12        # face v = 1 : plan y = x
            p = c(a, b, 1); assert abs(p[1] - p[2]) < 1e-12        # face w = 1 : plan z = y
            p = c(a, b, 0); assert abs(p[2]) < 1e-12               # face w = 0 : plan z = 0
    # volume ∫ u²v = 1/6 ; flux de (x, 0, 0) : +1/2 (face x = 1), −1/3 (face y = x : coefficient u²)
    n = 200
    s = (np.arange(n) + 0.5) / n
    U, W = np.meshgrid(s, s, indexing='ij')
    flux_v1 = (U * U).mean()
    vol = (U ** 2 * W).mean()
    assert abs(flux_v1 - 1 / 3) < 1e-4 and abs(vol - 1 / 6) < 1e-4 and abs(0.5 - flux_v1 - vol) < 1e-4
    # faces w = 0 et w = 1 : (y, z) = (uv, 0) et (uv, uv) ; le jacobien ∂(y, z)/∂(u, v) est nul, donc x dy∧dz aussi
    for w in (0.0, 1.0):
        for uu in g:
            for vv in g:
                Jyz = np.array([[vv, uu], [vv * w, uu * w]])           # lignes y, z ; colonnes ∂u, ∂v
                assert abs(np.linalg.det(Jyz)) < 1e-12
    proj = dict(vx=(170, 25), vy=(95, -45), vz=(0, -160))
    vis_dir = _visee(proj['vx'], proj['vy'], proj['vz'])
    faces = {'x=1': ((A, B, C), np.array([1, 0, 0])), 'y=x': ((O, B, C), np.array([-1, 1, 0])),
             'z=0': ((O, A, B), np.array([0, 0, -1])), 'z=y': ((O, A, C), np.array([0, -1, 1]))}
    centre = (O + A + B + C) / 4
    vis = {}
    for k, (pts, nv) in faces.items():
        assert nv @ (sum(pts) / 3 - centre) > 0                  # normale sortante
        vis[k] = nv @ vis_dir < 0
    assert vis == {'x=1': True, 'y=x': False, 'z=0': False, 'z=y': True}
    Oe = (150.0, 262.0)
    P = lambda p: _oblique(*p, O=Oe, **proj)
    S = Schema(520, 320, 'Le tétraèdre image du cube par (u, v, w) ↦ (u, uv, uvw)')
    S.surface([P(O), P(B), P(C)], 'v')
    S.surface([P(A), P(B), P(C)], 'b')
    for p, q in itertools.combinations((O, A, B, C), 2):
        arete_cachee = not any(vis[k] for k, (pts, _) in faces.items()
                               if any(np.array_equal(p, x) for x in pts) and any(np.array_equal(q, x) for x in pts))
        S.ligne(P(p), P(q), 't', d=arete_cachee, l=1.6)
    S.ligne(P(O), P(A), 'r', l=3.4)
    S.point(P(O), 'r', r=5)
    S.texte(P(O) + [-12, 10], '0', 't', ancre='end', taille=15)
    S.texte(P(A) + [8, 14], '(1, 0, 0)', 't', ancre='start', taille=15)
    S.texte(P(B) + [12, 6], '(1, 1, 0)', 't', ancre='start', taille=15)
    S.texte(P(C) + [12, -4], '(1, 1, 1)', 't', ancre='start', taille=15)
    mBC = (P(B) + P(C)) / 2
    gb = P((A + B + C) / 3)
    S.ligne(gb, mBC + [14, 0], 'b', d=True)
    S.texte(mBC + [20, -10], 'x = 1', 'b', ancre='start', taille=15)
    S.texte(mBC + [20, 12], '+1/2', 'b', ancre='start', taille=16)
    gv = P((O + B + C) / 3)
    lab = gv + [-110, -50]
    S.ligne(lab + [4, 8], gv, 'v', d=True)
    S.texte(lab + [0, -12], 'y = x', 'v', ancre='end', taille=15)
    S.texte(lab + [0, 10], '−1/3', 'v', ancre='end', taille=16)
    o = (40.0, 300.0)
    for k, nom in ((0, 'x'), (1, 'y'), (2, 'z')):
        E = np.eye(3)[k]
        a = _oblique(0, 0, 0, O=o, **proj); b = _oblique(*(0.2 * E), O=o, **proj)
        S.fleche(a, b, 'g', l=1.2)
        S.texte(b + (b - a) / np.linalg.norm(b - a) * 12, nom, 'g', taille=14)
    return S


@schema('dr-green')
def dr_green():
    # c(s, t) = (s, t(1 + s²)) ; aire ∫ det dc = 4/3 ; ∫_{∂c} x dy : droite +2, arc −2/3.
    c = lambda s, t: np.array([s, t * (1 + s ** 2)])
    n = 400
    u = (np.arange(n) + 0.5) / n
    assert abs((1 + u ** 2).mean() - 4 / 3) < 1e-5
    droite = (1 * 2 * np.ones(n)).mean()                           # c(1, t) = (1, 2t) : x dy = 2 dt
    arc_ = (u * 2 * u).mean()                                      # c(s, 1) : x dy = 2s² ds
    assert abs(droite - 2) < 1e-12 and abs(arc_ - 2 / 3) < 1e-5 and abs(droite - arc_ - 4 / 3) < 1e-5
    R = Repere(-0.25, 1.55, -0.25, 2.25, 40, 34, 300, 300)
    S = Schema(520, 350, 'Le domaine image du carré par c(s, t) = (s, t(1 + s²)) et son bord orienté')
    R.axes(S, 'x', 'y')
    ts = np.linspace(0, 1, 120)
    contour = np.vstack([R(*c(ts, 0 * ts)), R(*c(1 + 0 * ts, ts)), R(*c(ts[::-1], 1 + 0 * ts)),
                         R(*c(0 * ts, ts[::-1]))])
    S.surface(contour, 'r')
    for q in (0.25, 0.5, 0.75):
        S.poly(R(*c(q + 0 * ts, ts)), 'g', l=1)
        S.poly(R(*c(ts, q + 0 * ts)), 'g', l=1)
    S.poly(contour, 'r', ferme=True, l=2.4)
    # pointes : sens du bord (bas →, droite ↑, arc ←, gauche ↓)
    for (s0, t0), (ds, dt) in (((0.5, 0), (1, 0)), ((1, 0.5), (0, 1)), ((0.5, 1), (-1, 0)), ((0, 0.5), (0, -1))):
        p = R(*c(s0, t0))
        q = R(*c(s0 + 1e-3 * ds, t0 + 1e-3 * dt))
        d = (q - p) / np.linalg.norm(q - p)
        S.pointe(p + 7 * d, d, 'r', taille=12, largeur=5.5)
    S.texte(R(1, 1) + [12, 0], '+2', 'r', ancre='start', taille=16)
    S.texte(R(*c(0.55, 1)) + [-6, -22], '−2/3', 'r', ancre='end', taille=16)
    S.texte(R(1, 2) + [10, -4], 'y = 1 + x^2', 't', ancre='start', taille=15)
    S.texte(R(*c(0.375, 0.375)), 'D', 't', taille=18)
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=14)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=14)
    S.texte(R(0, 2) + [-8, 0], '2', 'g', ancre='end', taille=14)
    S.ligne(R(1, 2), R(0, 2), 'g', d=True)
    return S


def _cubes_mv_droite():
    # X = R, U = ]−∞, 1[, V = ]0, +∞[ ; δ' = min(1, max(d_U, d_V)) ; cubes (k, p) avec
    # p ∈ 2^{-k-4} Z, 2^{-k-2} ≤ δ'(p) ≤ 2^{1-k}, rayon 2^{-k-3} ; attribués à U si d_U(p) ≥ d_V(p).
    from fractions import Fraction as Fr
    cubes = []
    for k in range(5):
        den = 2 ** (k + 4)
        for m in range(-3 * den, 3 * den + 1):
            p = Fr(m, den)
            dU, dV = max(Fr(0), 1 - p), max(Fr(0), p)
            dl = min(Fr(1), max(dU, dV))
            if Fr(1, 2 ** (k + 2)) <= dl <= Fr(2, 2 ** k):
                cubes.append((k, p, Fr(1, 2 ** (k + 3)), dU >= dV))
    return cubes


@schema('dc-partition')
def dc_partition():
    from fractions import Fraction as Fr
    cubes = _cubes_mv_droite()
    assert {c[0] for c in cubes} == {0, 1, 2}
    assert [c[1] for c in cubes if c[0] == 2] == [Fr(1, 2)]
    # bornes exactes : les cubes de V commencent après 7/16, ceux de U finissent avant 5/8
    assert min(p - r for k, p, r, u in cubes if not u) == Fr(7, 16)
    assert max(p + r for k, p, r, u in cubes if u) == Fr(5, 8)
    xs = np.linspace(-0.5, 1.5, 1601)
    psi = lambda p, r: _theta(float(r) ** 2 - (xs - float(p)) ** 2)
    S_ = sum(psi(p, r) for k, p, r, u in cubes)
    assert S_.min() > 0
    cU = sum(psi(p, r) for k, p, r, u in cubes if u) / S_
    cV = 1 - cU
    assert np.all(cU[xs <= 7 / 16] == 1) and np.all(cU[xs >= 5 / 8] == 0)
    S = Schema(520, 250, 'La partition de l’unité subordonnée à U = ]−∞, 1[ et V = ]0, +∞[')
    R = Repere(-0.5, 1.5, -0.1, 1.25, 40, 60, 440, 150)
    S.fleche(R(-0.5, 0), R(1.5, 0) + [10, 0], 'g'); S.texte(R(1.5, 0) + [18, 0], 'x', 'g', ancre='start')
    S.poly(R(xs, cU), 'b', l=2.2)
    S.poly(R(xs, cV), 'v', l=2.2)
    for x0, lab in ((0, '0'), (7 / 16, '7/16'), (5 / 8, '5/8'), (1, '1')):
        S.ligne(R(x0, 0) + [0, -4], R(x0, 0) + [0, 4], 'g')
        S.texte(R(x0, 0) + [0, 18], lab, 'g', taille=14)
    S.ligne(R(7 / 16, 0), R(7 / 16, 1), 'g', d=True)
    S.ligne(R(5 / 8, 0), R(5 / 8, 1), 'g', d=True)
    S.texte(R(-0.3, 1) + [0, -16], 'χ_U', 'b', taille=17)
    S.texte(R(1.3, 1) + [0, -16], 'χ_V', 'v', taille=17)
    # les deux ouverts, au-dessus
    yU, yV = 18, 36
    S.ligne(R(-0.5, 0)[0:1].tolist() + [yU], [R(1, 0)[0], yU], 'b', l=2)
    S.point([R(1, 0)[0], yU], 'b', r=4, creux=True)
    S.texte([R(-0.5, 0)[0] - 6, yU], 'U', 'b', ancre='end', taille=15)
    S.ligne([R(0, 0)[0], yV], [R(1.5, 0)[0], yV], 'v', l=2)
    S.point([R(0, 0)[0], yV], 'v', r=4, creux=True)
    S.texte([R(1.5, 0)[0] + 6, yV], 'V', 'v', ancre='start', taille=15)
    return S


@schema('dc-epointe')
def dc_epointe():
    e2, me2 = np.array([0.0, 1.0]), np.array([0.0, -1.0])
    cibles_U = [(-1.3, -0.9), (1.3, -0.7), (0.45, -1.45)]
    cibles_V = [(-1.2, 1.1), (1.25, 0.85), (0.35, 1.5)]
    # les segments depuis e_2 évitent L_- = {(0, s) : s ≤ 0}, ceux depuis −e_2 évitent L_+
    for a, cs, signe in ((e2, cibles_U, -1), (me2, cibles_V, 1)):
        for c in cs:
            for t in np.linspace(0, 1, 2001):
                y = a + t * (np.array(c) - a)
                assert not (abs(y[0]) < 1e-12 and signe * y[1] >= 0)
    S = Schema(500, 380, 'Les deux ouverts étoilés qui recouvrent le plan épointé')
    R = Repere(-1.7, 1.7, -1.7, 1.7, 70, 20, 340, 340)
    S.surface([R(0, -1.7), R(1.7, -1.7), R(1.7, 1.7), R(0, 1.7)], 'g')
    S.fleche(R(-1.7, 0), R(1.7, 0) + [8, 0], 'g'); S.texte(R(1.7, 0) + [16, 0], 'x_1', 'g', ancre='start')
    S.ligne(R(0, -1.7), R(0, 1.7), 'g', d=True)
    S.ligne(R(0, 0), R(0, -1.7), 'b', l=3.2)
    S.ligne(R(0, 0), R(0, 1.7), 'v', l=3.2)
    S.texte(R(0, -1.55) + [-10, 0], 'L_−', 'b', ancre='end', taille=16)
    S.texte(R(0, 1.55) + [-10, 0], 'L_+', 'v', ancre='end', taille=16)
    for c in cibles_U:
        S.ligne(R(*e2), R(*c), 'b', d=True); S.point(R(*c), 'b', r=3.2)
    for c in cibles_V:
        S.ligne(R(*me2), R(*c), 'v', d=True); S.point(R(*c), 'v', r=3.2)
    S.point(R(*e2), 'b', r=4.5); S.texte(R(*e2) + [12, -12], 'e_2', 'b', ancre='start', taille=16)
    S.point(R(*me2), 'v', r=4.5); S.texte(R(*me2) + [12, 12], '−e_2', 'v', ancre='start', taille=16)
    S.point(R(0, 0), 't', r=4.5, creux=True); S.texte(R(0, 0) + [-10, 14], '0', 't', ancre='end', taille=15)
    S.texte(R(1.2, 0.35), 'η = 1', 't', taille=16)
    S.texte(R(-1.2, 0.35), 'η = 0', 't', taille=16)
    return S


@schema('dc-chevelue')
def dc_chevelue():
    w = lambda x: np.array([-x[1], x[0]])
    F = lambda x, t: (1 - 2 * t) * x + 2 * t * (1 - t) * w(x)
    ts = np.linspace(0, 1, 401)
    fac = np.sqrt((1 - 2 * ts) ** 2 + 4 * ts ** 2 * (1 - ts) ** 2)
    assert abs(fac.min() - 0.5) < 1e-6 and abs(ts[fac.argmin()] - 0.5) < 1e-9
    a0 = np.pi / 6
    x = np.array([np.cos(a0), np.sin(a0)])
    chem = np.array([F(x, t) for t in ts])
    assert np.allclose(chem[0], x) and np.allclose(chem[-1], -x)
    assert np.min(np.linalg.norm(chem, axis=1)) > 0.49
    S = Schema(480, 380, 'Le chemin t ↦ F(x, t), de x à −x, qui contourne l’origine')
    R = Repere(-1.35, 1.35, -1.35, 1.35, 70, 20, 340, 340)
    S.fleche(R(-1.35, 0), R(1.35, 0) + [8, 0], 'g'); S.fleche(R(0, -1.35), R(0, 1.35) + [0, -8], 'g')
    S.poly(R(np.cos(np.linspace(0, 2 * np.pi, 241)), np.sin(np.linspace(0, 2 * np.pi, 241))), 't', l=1.6)
    for a in np.linspace(0, 2 * np.pi, 8, endpoint=False) + np.pi / 6 + np.pi / 8:
        y = np.array([np.cos(a), np.sin(a)])
        S.poly(R(*np.array([F(y, t) for t in ts]).T), 'g', l=1)
    S.courbe_fleche(R(*chem.T), 'r', l=2.4)
    S.fleche(R(*x), R(*(x + 0.55 * w(x))), 'b', l=2)
    S.point(R(*x), 't', r=4.2); S.texte(R(*x) + [12, 8], 'x', 't', ancre='start', taille=17)
    S.point(R(*(-x)), 't', r=4.2); S.texte(R(*(-x)) + [-12, 8], '−x', 't', ancre='end', taille=17)
    S.texte(R(*(x + 0.55 * w(x))) + [6, -12], 'w(x)', 'b', ancre='start', taille=16)
    S.point(R(0, 0), 't', r=4, creux=True); S.texte(R(0, 0) + [10, 14], '0', 't', ancre='start', taille=15)
    return S


@schema('dt-complexe-double')
def dt_complexe_double():
    n = 3
    diag = [(p, n - p) for p in range(n + 1)]
    assert all(p + q == n for p, q in diag)
    # escalier : x_3 = δy avec y en (2, 0) ; Dy touche (2, 1) ; puis (1, 1), (1, 2), (0, 2), (0, 3)
    esc = [(3, 0), (2, 0), (2, 1), (1, 1), (1, 2), (0, 2), (0, 3)]
    assert all(abs(a[0] - b[0]) + abs(a[1] - b[1]) == 1 for a, b in zip(esc, esc[1:]))
    S = Schema(500, 360, 'La descente en escalier dans un complexe double')
    pas = 70
    O = np.array([150.0, 300.0])
    P = lambda p, q: O + np.array([p * pas, -q * pas])
    for p in range(5):
        for q in range(4):
            if p < 4:
                S.fleche(P(p, q) + [9, 0], P(p + 1, q) - [9, 0], 'g', l=0.9)
            if q < 3:
                S.fleche(P(p, q) - [0, 9], P(p, q + 1) + [0, 9], 'g', l=0.9)
            S.point(P(p, q), 'g', r=3)
    S.poly([P(*a) for a in esc], 'r', d=True, l=2)
    for p, q in diag:
        S.point(P(p, q), 'r', r=5.5)
        S.texte(P(p, q) + [14, -14], f'x_{p}', 'r', ancre='start', taille=16)
    S.point(P(2, 0), 'b', r=4.5); S.texte(P(2, 0) + [0, 22], 'y', 'b', taille=16)
    # colonne A
    for q in range(4):
        S.point(O + [-100, -q * pas], 'b', r=3.4)
    S.texte(O + [-100, -3 * pas - 26], 'A', 'b', taille=17)
    S.fleche(O + [-100, -3 * pas] + [8, 0], P(0, 3) - [10, 0], 'b', l=1.6)
    S.texte((O + [-100, -3 * pas] + P(0, 3)) / 2 + [0, -14], 'r', 'b', taille=16)
    S.texte(P(4, 0) + [0, 24], 'p', 'g', taille=16)
    S.texte(P(0, 3) + [-18, -26], 'q', 'g', taille=16)
    S.texte(P(0.5, 0) + [0, 20], 'δ', 'g', taille=15)
    S.texte(P(4, 2.5) + [14, 0], 'd', 'g', ancre='start', taille=15)
    return S


@schema('dt-cech-de-rham')
def dt_cech_de_rham():
    cubes = {'i': ((0.0, 0.0), 1.0), 'j': ((1.2, 0.3), 0.8), 'l': ((0.45, 1.2), 0.75)}
    def boite(noms):
        a = [max(cubes[c][0][m] - cubes[c][1] for c in noms) for m in (0, 1)]
        b = [min(cubes[c][0][m] + cubes[c][1] for c in noms) for m in (0, 1)]
        return a, b
    for noms in ('ij', 'il', 'jl', 'ijl'):
        a, b = boite(noms)
        assert a[0] < b[0] and a[1] < b[1]
    a, b = boite('ijl')
    assert np.allclose(a, [0.4, 0.45]) and np.allclose(b, [1.0, 1.0])
    ctr = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    S = Schema(480, 380, 'Trois cubes et leur intersection, un pavé convexe')
    R = Repere(-1.2, 2.2, -1.2, 2.0, 50, 20, 380, 340)
    S.surface([R(a[0], a[1]), R(b[0], a[1]), R(b[0], b[1]), R(a[0], b[1])], 'g')
    for nom, coul in (('i', 't'), ('j', 'b'), ('l', 'v')):
        (px, py), r = cubes[nom]
        S.poly([R(px - r, py - r), R(px + r, py - r), R(px + r, py + r), R(px - r, py + r)], coul,
               ferme=True, l=2)
        S.point(R(px, py), coul, r=3.6)
        S.texte(R(px, py) + ([-8, -14] if nom == 'l' else [-8, 14]), f'p_{nom}', coul, ancre='end', taille=16)
    S.point(R(*ctr), 'r', r=4.5)
    S.texte(R(*ctr) + [10, -12], 'b_{ijl}', 'r', ancre='start', taille=16)
    S.texte(R(-0.85, -0.85), 'B_i', 't', taille=16)
    S.texte(R(1.75, -0.3), 'B_j', 'b', taille=16)
    S.texte(R(0.05, 1.6), 'B_l', 'v', taille=16)
    return S


@schema('pc-fibre')
def pc_fibre():
    # e = ψ_{0,1} / ∫ψ (bosse d'intégrale 1) ; f(t) = e(t − 1.5) − e(t + 1.5), d'intégrale nulle.
    ts = np.linspace(-3.5, 3.5, 2801)
    h = ts[1] - ts[0]
    psi = lambda t: _theta(1 - t ** 2)
    c = psi(ts).sum() * h
    e = lambda t: psi(t) / c
    f = e(ts - 1.5) - e(ts + 1.5)
    F = np.cumsum(f) * h
    E = np.cumsum(e(ts)) * h
    assert abs(e(ts).sum() * h - 1) < 1e-9 and abs(f.sum() * h) < 1e-9
    assert np.all(np.abs(F[np.abs(ts) > 2.5]) < 1e-6) and abs(F.min() + 1) < 2e-3
    assert np.all(E[ts < -1] == 0) and np.all(np.abs(E[ts > 1] - 1) < 2e-3)
    S = Schema(520, 400, 'Primitives à support compact, ou non, en dimension 1')
    R1 = Repere(-3.5, 3.5, -1.3, 1.3, 40, 14, 440, 170)
    R2 = Repere(-3.5, 3.5, -0.2, 1.3, 40, 214, 440, 160)
    for R in (R1, R2):
        S.fleche(R(-3.5, 0), R(3.5, 0) + [8, 0], 'g')
        S.texte(R(3.5, 0) + [16, 0], 't', 'g', ancre='start', taille=15)
    S.poly(R1(ts, f), 'b', l=2)
    S.poly(R1(ts, F), 'r', l=2.2)
    S.texte(R1(1.5, float(e(0))) + [14, 0], 'f', 'b', ancre='start', taille=16)
    S.texte(R1(0, -1) + [0, 18], 'g', 'r', taille=16)
    S.poly(R2(ts, e(ts)), 'v', l=2)
    S.poly(R2(ts, E), 'r', l=2.2)
    S.texte(R2(-0.5, float(e(0))) + [-8, -6], 'e', 'v', ancre='end', taille=16)
    S.texte(R2(2.6, 1) + [0, -14], 'E', 'r', taille=16)
    S.ligne(R2(-3.5, 1), R2(3.5, 1), 'g', d=True)
    S.texte(R2(-3.5, 1) + [-6, 0], '1', 'g', ancre='end', taille=14)
    return S

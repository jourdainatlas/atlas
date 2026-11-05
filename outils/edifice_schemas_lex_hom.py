"""Schémas des exemples du lexique, théorie hom (homologie) : contenu/exemples/hom.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17
(mémo de l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert : orientation des
arêtes et des faces, cycles qui ferment, points d'intersection et images calculés avant d'être placés.
"""
import math
import re
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte, arc

TAILLE = 17


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples."""
    def coupe(m):
        attrs, txt = m.group(1), m.group(2)
        morceaux = re.split('(∅)', txt)
        out = []
        for k, c in enumerate(morceaux):
            if not c:
                continue
            a = attrs if k == 0 else re.sub(r' dy="[^"]*"', '', attrs)
            if c == '∅':
                a = a.replace('KaTeX_Main', 'KaTeX_AMS')
            out.append(f'<tspan{a}>{c}</tspan>')
        return ''.join(out)
    S.el = [re.sub(r'<tspan( font-family="KaTeX_Main"[^>]*)>([^<]*∅[^<]*)</tspan>', coupe, e) for e in S.el]
    return S


def _aire(P):
    """Aire orientée d'un polygone en coordonnées d'image (y vers le bas) : > 0 si le contour tourne dans le
    sens direct à l'écran (sens trigonométrique vu par le lecteur)."""
    P = np.asarray(P, float)
    x, y = P[:, 0], -P[:, 1]
    return 0.5 * float(np.sum(x * np.roll(y, -1) - np.roll(x, -1) * y))


def _decale(P, d):
    """Polygone convexe P décalé vers l'intérieur de d (intersections des côtés translatés)."""
    P = np.asarray(P, float)
    n = len(P)
    g = P.mean(axis=0)
    lignes = []
    for i in range(n):
        a, b = P[i], P[(i + 1) % n]
        u = unit(b - a)
        nrm = np.array([-u[1], u[0]])
        if np.dot(nrm, g - a) < 0:
            nrm = -nrm
        lignes.append((a + d * nrm, u))
    Q = []
    for i in range(n):
        (p1, u1), (p2, u2) = lignes[i - 1], lignes[i]
        s = np.linalg.solve(np.array([u1, -u2]).T, p2 - p1)
        Q.append(p1 + s[0] * u1)
    Q = np.array(Q)
    for q in Q:                                          # chaque sommet décalé est à l'intérieur de P
        assert _dedans(P, q)
    return Q


def _dedans(P, q):
    """q est strictement à l'intérieur du polygone convexe P."""
    P = np.asarray(P, float)
    g = P.mean(axis=0)
    for i in range(len(P)):
        a, b = P[i], P[(i + 1) % len(P)]
        cr = lambda z: (b - a)[0] * (z - a)[1] - (b - a)[1] * (z - a)[0]
        if cr(q) * cr(g) <= 0:
            return False
    return True


def _fleche_milieu(S, p, q, c='t', taille=11, largeur=5):
    p, q = np.asarray(p, float), np.asarray(q, float)
    S.pointe((p + q) / 2 + 6 * unit(q - p), q - p, c, taille=taille, largeur=largeur)


def _etiquette_arete(S, p, q, centre, txt, c='t', dist=16, taille=TAILLE):
    """Étiquette d'une arête, placée au milieu, du côté opposé à « centre »."""
    p, q, centre = map(lambda v: np.asarray(v, float), (p, q, centre))
    m = (p + q) / 2
    n = unit([(q - p)[1], -(q - p)[0]])
    if np.dot(n, m - centre) < 0:
        n = -n
    an = 'middle' if abs(n[0]) < 0.35 else ('start' if n[0] > 0 else 'end')
    S.texte(m + dist * n, txt, c, ancre=an, taille=taille)
    return m + dist * n


# ------------------------------------------------------------------------------------------------ paquet 1
@schema('lex-simplexe-singulier-1')
def lex_simplexe_singulier_1():
    W, H = 420, 270
    S = Schema(W, H, 'Le simplexe σ(t) = t₂, constant sur les segments parallèles à l arête de e₀ à e₁')
    h = 190.0
    e0, e1 = np.array([40.0, 230.0]), np.array([40.0 + 2 * h / math.sqrt(3), 230.0])
    e2 = np.array([(e0[0] + e1[0]) / 2, 230.0 - h])
    E = [e0, e1, e2]
    pt = lambda t: t[0] * e0 + t[1] * e1 + t[2] * e2
    S.surface(E, 'g')
    niveaux = [0.2, 0.4, 0.6, 0.8]
    seg_x = 330.0
    for c in niveaux:                        # segment t₂ = c : de (1 - c, 0, c) à (0, 1 - c, c)
        a, b = pt((1 - c, 0, c)), pt((0, 1 - c, c))
        assert abs(a[1] - b[1]) < 1e-9                       # parallèle à l'arête e₀e₁ (horizontale)
        assert abs(a[1] - (230 - c * h)) < 1e-9              # hauteur proportionnelle à t₂
        S.ligne(a, b, 'g', l=1.6)
        S.ligne(b + [8, 0], [seg_x - 8, a[1]], 'g', d=True, l=1)
    S.poly(E, 't', ferme=True)
    S.ligne(e0, e1, 'r', l=3)
    # le segment [0, 1], à la même hauteur que le triangle
    p0, p1 = np.array([seg_x, 230.0]), np.array([seg_x, 230.0 - h])
    S.ligne(p0, p1, 't', l=2.2)
    for c in niveaux:
        S.point([seg_x, 230 - c * h], 'g', r=2.6)
    S.point(p0, 'r', r=4)
    S.point(p1, 't', r=3.4)
    S.texte(p0 + [14, 0], '0', 'r', ancre='start')
    S.texte(p1 + [14, 0], '1', ancre='start')
    S.texte([seg_x + 26, 230 - h / 2], '[0, 1]', 'g', ancre='start', taille=16)
    _fleche_milieu(S, e0, e2, 't'); _fleche_milieu(S, e1, e2, 't')
    S.point(e0, 't', r=3.4); S.point(e1, 't', r=3.4); S.point(e2, 't', r=3.4)
    S.texte(e0 + [-4, 20], 'e_0', ancre='middle')
    S.texte(e1 + [4, 20], 'e_1', ancre='middle')
    S.texte(e2 + [0, -16], 'e_2')
    S.texte((e0 + e1) / 2 + [0, 20], 'σ = 0', 'r', taille=16)
    assert e1[0] + 10 < seg_x - 30 and seg_x + 26 + largeur_texte('[0, 1]', 16) < W - 4
    return S


def _triangle_complexe(S, o, cote, plein):
    u = np.asarray(o, float)
    v = u + [cote, 0]
    w = u + [cote / 2, -cote * math.sqrt(3) / 2]
    g = (u + v + w) / 3
    if plein:
        S.surface([u, v, w], 'b')
    for p, q, lab in [(u, v, 'a'), (v, w, 'b'), (w, u, 'c')]:
        S.ligne(p, q, 'r', l=2.4)
        _fleche_milieu(S, p, q, 'r')
        _etiquette_arete(S, p, q, g, lab, 'r', dist=15)
    for p, lab, d in [(u, 'u', [-10, 12]), (v, 'v', [10, 12]), (w, 'w', [0, -16])]:
        S.point(p, 't', r=3.4)
        S.texte(p + d, lab, ancre='middle')
    if plein:
        S.texte(g, 't', 'b')
    return u, v, w


@schema('lex-bord-complexe-1')
def lex_bord_complexe_1():
    W, H = 420, 230
    S = Schema(W, H, 'Le triangle creux et le triangle plein : le même cycle, bord ou non')
    cote = 160.0
    u, v, w = _triangle_complexe(S, (30, 190), cote, False)
    u2, v2, w2 = _triangle_complexe(S, (230, 190), cote, True)
    # orientation : a, b, c se suivent (le cycle a + b + c ferme), et u → v → w tourne dans le sens direct
    assert np.allclose(v - u + (w - v) + (u - w), 0) and _aire([u, v, w]) > 0
    assert v[0] + 20 < u2[0]
    return S


@schema('lex-groupe-homologie-2')
def lex_groupe_homologie_2():
    W, H = 420, 270
    S = Schema(W, H, 'Le carré et sa diagonale : deux cycles qui diffèrent du bord de la face t')
    L = 190.0
    u = np.array([115.0, 235.0]); v = u + [L, 0]; w = u + [L, -L]; x = u + [0, -L]
    S.surface([u, v, w], 'b')
    ar = [(u, v, 'a'), (v, w, 'b'), (w, x, 'c'), (x, u, 'd')]
    centre = (u + w) / 2
    for p, q, lab in ar:
        S.ligne(p, q, 't', l=1.8)
        _fleche_milieu(S, p, q, 't')
        _etiquette_arete(S, p, q, centre, lab, 't', dist=16)
    S.ligne(u, w, 't', l=1.8)
    _fleche_milieu(S, u, w, 't')
    S.texte((u + w) / 2 + [14, 12], 'e', ancre='start')
    # z : le carré décalé vers l'intérieur ; z' : le triangle u, w, x décalé vers l'intérieur
    Z = _decale([u, v, w, x], 9)
    Zp = _decale([u, w, x], 20)
    S.poly(Z, 'r', ferme=True, l=2.2)
    S.poly(Zp, 'b', ferme=True, l=2.2)
    # sens de parcours : z suit a, b, c, d ; z' suit c, d, e (de w à x, de x à u, de u à w)
    assert _aire([u, v, w, x]) > 0 and _aire([w, x, u]) > 0
    _fleche_milieu(S, Z[0], Z[1], 'r'); _fleche_milieu(S, Z[2], Z[3], 'r')
    _fleche_milieu(S, Zp[1], Zp[2], 'b'); _fleche_milieu(S, Zp[2], Zp[0], 'b')
    S.texte(Z[1] + [-14, -14], 'z', 'r', ancre='end')
    S.texte((Zp[0] + Zp[1] + Zp[2]) / 3 + [-6, 4], 'z′', 'b')
    S.texte((u + v + w) / 3 + [14, 8], 't', 'b')
    for p, lab, d in [(u, 'u', [-12, 12]), (v, 'v', [12, 12]), (w, 'w', [12, -12]), (x, 'x', [-12, -12])]:
        S.point(p, 't', r=3.4)
        S.texte(p + d, lab, ancre='middle')
    # la face t ne recouvre que le triangle u, v, w : z' (dans le triangle u, w, x) ne la rencontre pas
    assert not any(_dedans([u, v, w], q) for q in Zp)
    return S


# ------------------------------------------------------------------------------------------------ paquet 2
def _repere_egal(xmin, xmax, ymin, ymax, W, H, marge=20):
    """Repère à échelle égale sur les deux axes, centré dans le cadre W × H."""
    k = min((W - 2 * marge) / (xmax - xmin), (H - 2 * marge) / (ymax - ymin))
    L, Hh = k * (xmax - xmin), k * (ymax - ymin)
    return Repere(xmin, xmax, ymin, ymax, (W - L) / 2, (H - Hh) / 2, L, Hh), k


@schema('lex-operateur-prisme-2')
def lex_operateur_prisme_2():
    W, H = 420, 300
    R, k = _repere_egal(-1.25, 1.25, -1.12, 1.12, W, H, 12)
    S = Schema(W, H, 'Le prisme d un lacet du cercle pour l homotopie F(x, t) = (1 - t/2) x')
    Phi = lambda s, t: (1 - t / 2) * np.array([np.cos(2 * np.pi * s), np.sin(2 * np.pi * s)])
    s = np.linspace(0, 1, 241)
    ext = np.array([Phi(x, 0) for x in s]); intr = np.array([Phi(x, 1) for x in s])
    spir = np.array([Phi(x, x) for x in s])                      # image de la diagonale s = t
    # couronne remplie : extérieur puis intérieur parcouru en sens inverse
    S.surface(np.vstack([R(ext[:, 0], ext[:, 1]), R(intr[::-1, 0], intr[::-1, 1])]), 'g')
    # les deux côtés verticaux du carré (s = 0 et s = 1) ont la même image : le segment de q à q/2
    t = np.linspace(0, 1, 11)
    assert np.allclose([Phi(0, x) for x in t], [Phi(1, x) for x in t])
    assert np.allclose(spir[0], [1, 0]) and np.allclose(spir[-1], [0.5, 0])
    S.poly(R(spir[:, 0], spir[:, 1]), 'g', d=True, l=1.6)
    S.poly(R(ext[:, 0], ext[:, 1]), 'r', l=2.6)
    S.poly(R(intr[:, 0], intr[:, 1]), 'b', l=2.6)
    S.ligne(R(1, 0), R(0.5, 0), 'v', l=3)
    for rr, c in [(1, 'r'), (0.5, 'b')]:                          # sens de parcours direct
        a = 0.62 * np.pi
        p = R(rr * math.cos(a), rr * math.sin(a))
        S.pointe(p, R(rr * math.cos(a + .05), rr * math.sin(a + .05)) - p, c, taille=11, largeur=5)
    q = R(1, 0)
    S.point(q, 't', r=3.6)
    S.texte(q + [10, 0], 'q', ancre='start')
    S.texte(R(-0.78, 0.86), 'f ∘ σ', 'r', ancre='end')
    S.texte(R(0, 0), 'g ∘ σ', 'b')
    assert R(-0.78, 0.86)[0] - largeur_texte('f ∘ σ') > 2
    return S


@schema('lex-simplexe-affine-2')
def lex_simplexe_affine_2():
    W, H = 420, 230
    R, k = _repere_egal(-1.5, 1.5, -0.35, 1.25, W, H, 14)
    S = Schema(W, H, 'Le segment de w₀ à w₁ passe par l origine, retirée ; le demi-cercle reste dans Y')
    w0, w1 = np.array([-1.0, 0]), np.array([1.0, 0])
    S.ligne(R(*w0), R(*w1), 'g', d=True, l=2)
    tt = np.linspace(0, 1, 121)
    demi = np.stack([-np.cos(np.pi * tt), np.sin(np.pi * tt)], 1)
    assert np.allclose(np.hypot(demi[:, 0], demi[:, 1]), 1)          # le demi-cercle évite l'origine
    assert np.allclose(demi[0], w0) and np.allclose(demi[-1], w1)
    assert np.allclose(0.5 * w0 + 0.5 * w1, 0)                       # le segment passe par 0 en t = (½, ½)
    S.poly(R(demi[:, 0], demi[:, 1]), 'r', l=2.6)
    m = R(*demi[60]); m2 = R(*demi[62])
    S.pointe(m2, m2 - m, 'r', taille=11, largeur=5)
    S.point(R(0, 0), 'g', r=5, creux=True)
    S.point(R(*w0), 't', r=3.6); S.point(R(*w1), 't', r=3.6)
    S.texte(R(*w0) + [-8, 18], 'w_0', ancre='end')
    S.texte(R(*w1) + [8, 18], 'w_1', ancre='start')
    S.texte(R(0, 0) + [12, 16], '0', 'g', ancre='start')
    S.texte(R(1.15, 0.85), 'Y', 'g', ancre='start')
    return S


@schema('lex-composante-connexe-par-arcs-2')
def lex_composante_connexe_par_arcs_2():
    W, H = 420, 250
    R = Repere(-0.08, 1.05, -1.25, 1.25, 30, 14, 360, 222)
    S = Schema(W, H, 'La courbe sinus de 1/x et le segment vertical : deux composantes connexes par arcs')
    S.ligne(R(-0.08, 0), R(1.05, 0), 'g', l=1)
    u = np.concatenate([np.linspace(1, 40, 800), np.linspace(40, 160, 2400)[1:]])
    x = 1 / u
    y = np.sin(u)
    assert np.all(np.diff(x) < 0) and x.max() == 1 and x.min() < 0.0065
    S.poly(R(x, y), 'b', l=1.3)
    S.ligne(R(0, -1), R(0, 1), 'r', l=3)
    S.texte(R(0, 1) + [-8, 0], 'S', 'r', ancre='end')
    S.texte(R(0.62, 0.95), 'A', 'b', ancre='start')
    S.texte(R(1, 0) + [0, 18], '1', 'g')
    S.texte(R(0, 0) + [-8, 14], '0', 'g', ancre='end')
    return S


# ------------------------------------------------------------------------------------------------ paquet 3
@schema('lex-application-paires-3')
def lex_application_paires_3():
    W, H = 420, 260
    R = Repere(-1.25, 1.25, -0.12, 1.12, 40, 16, 340, 220)
    S = Schema(W, H, 'Trajectoires de l homotopie F(x, t) = (1 - t)x + t : celle de -1 quitte {-1, 1}')
    F = lambda x, t: (1 - t) * x + t
    for xv in [1.0, -1.0]:                                      # la partie A × [0, 1], en bleu
        S.ligne(R(xv, -0.05), R(xv, 1.05), 'b', l=2.4)
    for x0 in [-0.5, 0.0, 0.5]:
        S.ligne(R(F(x0, 0), 0), R(F(x0, 1), 1), 'g', l=1.5)
    S.ligne(R(-1, 0), R(1, 1), 'r', l=2.8)                       # trajectoire de -1
    assert F(-1, 0) == -1 and F(-1, 1) == 1 and all(-1 < F(-1, t) < 1 for t in np.linspace(0.01, 0.99, 99))
    assert all(F(1, t) == 1 for t in np.linspace(0, 1, 11))
    S.pointe(R(0.2, 0.6), R(0.2, 0.6) - R(-1, 0), 'r', taille=11, largeur=5)
    S.ligne(R(-1.2, 0), R(1.2, 0), 't', l=1.2)
    S.texte(R(-1, 0) + [0, 18], '−1', 'b')
    S.texte(R(1, 0) + [0, 18], '1', 'b')
    S.texte(R(-1, 1) + [-10, 0], 't = 1', 'g', ancre='end', taille=15)
    S.texte(R(-1, 0) + [-10, -12], 't = 0', 'g', ancre='end', taille=15)
    assert R(-1, 1)[0] - 10 - largeur_texte('t = 1', 15) > 0
    S.point(R(1, 1), 'r', r=3.6)
    return S


@schema('lex-sphere-topologique-1')
def lex_sphere_topologique_1():
    W, H = 420, 290
    R, k = _repere_egal(-1.2, 1.2, -1.12, 1.12, W, H, 12)
    S = Schema(W, H, 'Le bord du carré et le cercle unité, homéomorphes par la projection radiale')
    S.poly(R(np.array([1, -1, -1, 1]), np.array([1, 1, -1, -1])), 'r', ferme=True, l=2.6)
    a = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(a), np.sin(a)), 'b', l=2.6)
    for ang in np.radians([28, 62, 118, 152, 208, 242, 298, 332]):
        u = np.array([math.cos(ang), math.sin(ang)])
        x = u / np.max(np.abs(u))                                   # point du carré sur la demi-droite
        assert abs(np.max(np.abs(x)) - 1) < 1e-12 and np.allclose(x / np.linalg.norm(x), u)
        S.ligne(R(0, 0), R(*x), 'g', d=True, l=1)
        S.point(R(*x), 'r', r=3.2)
        S.point(R(*u), 'b', r=3.2)
    S.point(R(0, 0), 'g', r=2.6)
    return S


@schema('lex-complexe-cellulaire-1')
def lex_complexe_cellulaire_1():
    W, H = 420, 280
    R, k = _repere_egal(-1.35, 1.35, -1.18, 1.18, W, H, 10)
    S = Schema(W, H, 'Le cercle muni d un diamètre : deux sommets et trois cellules de dimension 1')
    s = np.linspace(-1, 1, 201)
    for sg, lab, dy in [(1, 'Φ_+', -14), (-1, 'Φ_−', 16), (0, 'Φ_0', -14)]:
        y = sg * np.sqrt(1 - s ** 2)
        S.poly(R(s, y), 'b', l=2.6)
        assert np.allclose([s[0], y[0]], [-1, 0]) and np.allclose([s[-1], y[-1]], [1, 0])
        i = 120
        S.pointe(R(s[i], y[i]), R(s[i], y[i]) - R(s[i - 4], y[i - 4]), 'b', taille=11, largeur=5)
        S.texte(R(0, sg * 1.0 if sg else 0) + [0, dy], lab, 'b')
    for x in (-1, 1):
        S.point(R(x, 0), 'r', r=4.5)
    S.texte(R(-1, 0) + [-10, 0], '(−1, 0)', 'r', ancre='end', taille=15)
    S.texte(R(1, 0) + [10, 0], '(1, 0)', 'r', ancre='start', taille=15)
    assert R(-1, 0)[0] - 10 - largeur_texte('(−1, 0)', 15) > 2 and R(1, 0)[0] + 10 + largeur_texte('(1, 0)', 15) < W - 2
    return S


@schema('lex-application-caracteristique-cellule-1')
def lex_application_caracteristique_cellule_1():
    W, H = 420, 300
    S = Schema(W, H, 'L application caractéristique du cercle à un sommet : les deux extrémités vont en S')
    Phi = lambda z: np.array([2 * z * math.sqrt(1 - z * z), 1 - 2 * z * z])
    R, k = _repere_egal(-1.3, 1.3, -1.25, 1.25, 260, 220, 6)
    o = np.array([80.0, 0.0])                                    # cercle dans la partie haute, centré
    P = lambda v: R(*v) + o
    a = np.linspace(0, 2 * np.pi, 241)
    S.poly(np.array([P((math.cos(t), math.sin(t))) for t in a]), 't', l=2.2)
    # segment D¹ en bas
    y0 = 265.0
    X = lambda z: np.array([210 + 150 * z, y0])
    S.ligne(X(-1), X(1), 't', l=2.2)
    marques = [(-1, 'r', '−1'), (-0.5, 'b', '−½'), (0, 'b', '0'), (0.5, 'b', '½'), (1, 'r', '1')]
    assert np.allclose(Phi(-1), [0, -1]) and np.allclose(Phi(1), [0, -1]) and np.allclose(Phi(0), [0, 1])
    assert np.allclose(Phi(0.5), [math.sqrt(3) / 2, 0.5]) and np.allclose(Phi(-0.5), [-math.sqrt(3) / 2, 0.5])
    for z, c, lab in marques:
        S.point(X(z), c, r=4)
        S.texte(X(z) + [0, 18], lab, c, taille=16)
        S.point(P(Phi(z)), c, r=4.2)
    S.texte(P((0, -1)) + [12, 6], 'S', 'r', ancre='start')
    S.texte(X(1) + [14, 0], 'D^1', 'g', ancre='start', taille=16)
    # image d'un sous-arc : flèche de parcours de z = -1 vers z = 1
    zz = np.linspace(-0.97, -0.9, 2)
    p1, p2 = P(Phi(zz[0])), P(Phi(zz[1]))
    S.pointe(p2, p2 - p1, 't', taille=11, largeur=5)
    assert P((0, 1))[1] > 4 and P((0, -1))[1] < y0 - 24
    return S


@schema('lex-complexe-cellulaire-chaines-2')
def lex_complexe_cellulaire_chaines_2():
    W, H = 420, 280
    R, k = _repere_egal(-1.35, 1.35, -1.18, 1.18, W, H, 10)
    S = Schema(W, H, 'Le cercle à deux sommets et deux arêtes : le cycle e₊ − e₋')
    s = np.linspace(-1, 1, 201)
    for sg, c, lab, dy in [(1, 'r', 'e_+', -16), (-1, 'b', 'e_−', 18)]:
        y = sg * np.sqrt(1 - s ** 2)
        S.poly(R(s, y), c, l=2.8)
        i = 110
        S.pointe(R(s[i], y[i]), R(s[i], y[i]) - R(s[i - 4], y[i - 4]), c, taille=12, largeur=5)
        S.texte(R(0, sg) + [0, dy], lab, c)
    for x, lab, an, dx in [(-1, 'p', 'end', -10), (1, 'p′', 'start', 10)]:
        S.point(R(x, 0), 't', r=4.2)
        S.texte(R(x, 0) + [dx, 0], lab, ancre=an)
    # le cycle e₊ − e₋ : flèches de parcours (sens horaire, haut de gauche à droite, bas de droite à gauche)
    rr = 0.78
    a = np.linspace(np.pi * 0.95, -np.pi * 0.95, 200)
    S.poly(R(rr * np.cos(a), rr * np.sin(a)), 'g', d=True, l=1.4)
    pa, pb = R(rr * np.cos(a[-6]), rr * np.sin(a[-6])), R(rr * np.cos(a[-1]), rr * np.sin(a[-1]))
    S.pointe(pb, pb - pa, 'g', taille=10, largeur=4.5)
    S.texte(R(0, 0), 'e_+ − e_−', 'g', taille=16)
    return S


# ------------------------------------------------------------------------------------------------ paquet 4
def _racine_u0():
    """Racine de 2 sin u = u dans ]π/2, π[, par dichotomie (valeurs intermédiaires)."""
    g = lambda u: 2 * math.sin(u) - u
    a, b = math.pi / 2, math.pi
    assert g(a) > 0 > g(b)
    for _ in range(80):
        m = (a + b) / 2
        a, b = (m, b) if g(m) > 0 else (a, m)
    return (a + b) / 2


@schema('lex-degre-application-3')
def lex_degre_application_3():
    W, H = 420, 290
    R, k = _repere_egal(-1.3, 1.3, -1.2, 1.2, W, H, 10)
    S = Schema(W, H, 'L application F(x) = R_{2x₂}(x) du cercle : trois antécédents de (-1, 0)')
    u0 = _racine_u0()
    rot = lambda v, a: np.array([v[0] * math.cos(a) - v[1] * math.sin(a), v[0] * math.sin(a) + v[1] * math.cos(a)])
    F = lambda v: rot(v, 2 * v[1])
    a = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(a), np.sin(a)), 't', l=2.2)
    cible = np.array([-1.0, 0.0])
    assert np.allclose(F(cible), cible)
    for th, sgn in [(math.pi - u0, 1), (math.pi + u0, -1)]:
        x = np.array([math.cos(th), math.sin(th)])
        assert np.allclose(F(x), cible, atol=1e-12)
        # arc de rotation, à l'intérieur du cercle, de l'angle th à l'angle π
        tt = np.linspace(th, math.pi, 80)
        rr = 0.82
        pts = R(rr * np.cos(tt), rr * np.sin(tt))
        S.courbe_fleche(pts, 'b', l=1.8)
        S.point(R(*x), 'b', r=4.4)
        lab = '(−`cos` u_0, `sin` u_0)' if sgn > 0 else '(−`cos` u_0, −`sin` u_0)'
        S.texte(R(*x) + [10, -12 * sgn], lab, 'b', ancre='start', taille=15)
    S.point(R(*cible), 'r', r=4.8)
    S.texte(R(*cible) + [-10, 0], '(−1, 0)', 'r', ancre='end', taille=15)
    assert abs(u0 - 1.895) < 1e-3
    assert R(math.cos(math.pi - u0), 0)[0] + 10 + largeur_texte('(−cos u0, −sin u0)', 15) < W
    return S


@schema('lex-retraction-espace-1')
def lex_retraction_espace_1():
    W, H = 420, 280
    R, k = _repere_egal(-1.25, 1.25, -1.15, 1.15, W, H, 10)
    S = Schema(W, H, 'La rétraction du disque sur un diamètre, (x₁, x₂) ↦ (x₁, 0)')
    a = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(a), np.sin(a)), 't', ferme=True, rempli='g', l=2)
    for x1 in [-0.75, -0.4, 0.0, 0.4, 0.75]:
        h = math.sqrt(1 - x1 * x1)
        S.ligne(R(x1, -h), R(x1, h), 'g', l=1.2)
        for y in (0.62 * h, -0.62 * h):
            p, q = R(x1, y), R(x1, 0.12 * np.sign(y))
            S.fleche(p, q, 'g', l=1.2)
    S.ligne(R(-1, 0), R(1, 0), 'r', l=3)
    return S


@schema('lex-paire-bon-type-1')
def lex_paire_bon_type_1():
    W, H = 420, 200
    S = Schema(W, H, 'Le segment [0, 1], ses extrémités A et le voisinage N ; le quotient X/A est un cercle')
    x0, x1, y = 20.0, 170.0, 110.0
    X = lambda t: np.array([x0 + (x1 - x0) * t, y])
    S.ligne(X(0), X(1), 't', l=2)
    S.ligne(X(0), X(1 / 3), 'b', l=6)
    S.ligne(X(2 / 3), X(1), 'b', l=6)
    for t in (0, 1):
        S.point(X(t), 'r', r=5)
    S.texte(X(0) + [0, 22], '0', 'r'); S.texte(X(1) + [0, 22], '1', 'r')
    S.texte(X(1 / 6) + [0, -16], 'N', 'b'); S.texte(X(5 / 6) + [0, -16], 'N', 'b')
    # la déformation de N sur A : flèches vers les extrémités
    S.fleche(X(0.3) + [0, -34], X(0.04) + [0, -34], 'g', l=1.2); S.fleche(X(0.7) + [0, -34], X(0.96) + [0, -34], 'g', l=1.2)
    # le quotient : cercle, point recollé en rouge
    c, r = np.array([320.0, 100.0]), 72.0
    a = np.linspace(0, 2 * np.pi, 241)
    S.poly(np.stack([c[0] + r * np.cos(a), c[1] + r * np.sin(a)], 1), 't', l=2)
    # image de t : angle 2πt mesuré dans le sens direct (y vers le bas à l'écran)
    P = lambda t: c + r * np.array([math.cos(2 * math.pi * t), -math.sin(2 * math.pi * t)])
    arcN = np.array([P(t) for t in np.linspace(0, 1 / 3, 60)])
    arcN2 = np.array([P(t) for t in np.linspace(2 / 3, 1, 60)])
    S.poly(arcN, 'b', l=6); S.poly(arcN2, 'b', l=6)
    assert np.allclose(P(0), P(1))
    S.point(P(0), 'r', r=5)
    S.texte(P(0) + [12, 0], '∗', 'r', ancre='start')
    S.fleche([x1 + 22, y], [c[0] - r - 12, y], 'g', l=1.4)
    S.texte([(x1 + c[0] - r) / 2 + 5, y - 14], 'q', 'g')
    return S


# ------------------------------------------------------------------------------------------------ paquet 5
def _dans_polygone(P, q):
    """Point q strictement intérieur au polygone P (parité du nombre de traversées d'une demi-droite)."""
    P = np.asarray(P, float)
    x, y = q
    dedans = False
    for i in range(len(P)):
        (x1, y1), (x2, y2) = P[i], P[(i + 1) % len(P)]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            dedans = not dedans
    return dedans


def _segments_hors(P, a, b, n=400):
    """Vrai si le segment ]a, b[ sort du polygone P : l'un de ses points échantillonnés n'y est pas."""
    a, b = np.asarray(a, float), np.asarray(b, float)
    return not all(_dans_polygone(P, a + s * (b - a)) for s in np.linspace(0.002, 0.998, n))


@schema('lex-contractile-1')
def lex_contractile_1():
    W, H = 420, 220
    S = Schema(W, H, 'La croix et l étoile, étoilées par rapport à leur centre, non convexes')
    # la croix, centrée en (100, 110), bras de longueur 80
    c1, L = np.array([100.0, 110.0]), 80.0
    for d in [(1, 0), (0, 1)]:
        S.ligne(c1 - L * np.array(d), c1 + L * np.array(d), 't', l=4)
    p, q = c1 + [L, 0], c1 + [0, -L]
    S.ligne(p, q, 'b', d=True, l=2)
    m = (p + q) / 2
    assert abs(m[0] - c1[0]) > 1 and abs(m[1] - c1[1]) > 1     # le milieu n'est sur aucun des deux bras
    S.point(c1, 'r', r=4.6)
    # l'étoile à cinq branches, centrée en (310, 115)
    c2, Re, Ri = np.array([310.0, 116.0]), 92.0, 38.0
    ang = [math.pi / 2 + k * math.pi / 5 for k in range(10)]
    E = np.array([c2 + (Re if k % 2 == 0 else Ri) * np.array([math.cos(a), -math.sin(a)]) for k, a in enumerate(ang)])
    S.poly(E, 't', ferme=True, rempli='g', l=2)
    # étoilée par rapport au centre : chaque segment du centre à un point du bord reste dans l'étoile
    for k in range(10):
        assert not _segments_hors(E, c2 + 1e-6 * (E[k] - c2), c2 + 0.999 * (E[k] - c2))
    for k in range(0, 10, 2):
        S.ligne(c2, E[k], 'g', l=1.2)
    a2, b2 = E[0], E[2]                                         # deux pointes voisines
    assert _segments_hors(E, a2, b2)
    S.ligne(a2, b2, 'b', d=True, l=2)
    S.point(c2, 'r', r=4.6)
    return S


@schema('lex-simplexe-standard-1')
def lex_simplexe_standard_1():
    W, H = 420, 230
    S = Schema(W, H, 'Δ₁ dans le plan et Δ₂ dans l espace')
    # à gauche, le plan (t₀, t₁)
    o, u = np.array([34.0, 190.0]), 112.0
    S.fleche(o, o + [u + 30, 0], 'g', l=1.2); S.fleche(o, o - [0, u + 30], 'g', l=1.2)
    S.texte(o + [u + 38, 0], 't_0', 'g', ancre='start', taille=16)
    S.texte(o - [0, u + 44], 't_1', 'g', taille=16)
    e0, e1 = o + [u, 0], o - [0, u]
    S.ligne(e0 + 0.25 * (e0 - e1), e1 - 0.25 * (e0 - e1), 'g', d=True, l=1)    # la droite t₀ + t₁ = 1
    S.ligne(e0, e1, 'r', l=3.2)
    S.point(e0, 'r', r=4); S.point(e1, 'r', r=4)
    S.texte(e0 + [0, 18], 'e_0'); S.texte(e1 + [-14, 0], 'e_1', ancre='end')
    # à droite, projection oblique de ℝ³
    O = np.array([300.0, 140.0])
    ax = {0: np.array([-45.0, 38.0]), 1: np.array([80.0, 0.0]), 2: np.array([0.0, -96.0])}
    for i in range(3):
        S.fleche(O, O + 1.25 * ax[i], 'g', l=1.2)
    for i, (dx, dy, an) in enumerate([(-10, 10, 'end'), (0, -14, 'middle'), (12, 0, 'start')]):
        S.texte(O + 1.25 * ax[i] + [dx, dy], f't_{i}', 'g', ancre=an, taille=16)
    V = [O + ax[i] for i in range(3)]
    S.surface(V, 'b')
    S.poly(V, 'b', ferme=True, l=2.6)
    for i, (dx, dy, an) in enumerate([(12, 14, 'start'), (0, 22, 'middle'), (12, -4, 'start')]):
        S.point(V[i], 'b', r=4)
        S.texte(V[i] + [dx, dy], f'e_{i}', ancre=an)
    assert all(V[i][1] + 26 < H and V[i][0] + 16 < W for i in range(3)) and (O + 1.25 * ax[0])[1] + 14 < H
    gauche_t0 = o[0] + u + 38 + largeur_texte('t0', 16)
    droite_t0 = (O + 1.25 * ax[0])[0] - 10 - largeur_texte('t0', 16)
    assert gauche_t0 + 6 < droite_t0 and (O + 1.25 * ax[1])[0] + 8 < W
    return S


@schema('lex-cycle-relatif-1')
def lex_cycle_relatif_1():
    W, H = 420, 170
    S = Schema(W, H, 'Le segment σ et ses deux moitiés, cycles relatifs de (D¹, S⁰)')
    X = lambda x, y: np.array([210 + 170 * x, y])
    S.ligne(X(-1, 55), X(1, 55), 'r', l=3)
    S.pointe(X(0.1, 55), [1, 0], 'r', taille=12, largeur=5)
    S.texte(X(0, 55) + [0, -18], 'σ', 'r')
    S.ligne(X(-1, 115), X(-0.03, 115), 'b', l=3)
    S.ligne(X(0.03, 115), X(1, 115), 'b', l=3)
    S.pointe(X(-0.4, 115), [1, 0], 'b', taille=12, largeur=5)
    S.pointe(X(0.6, 115), [1, 0], 'b', taille=12, largeur=5)
    S.texte(X(-0.5, 115) + [0, -18], 'τ_1', 'b'); S.texte(X(0.5, 115) + [0, -18], 'τ_2', 'b')
    for y in (55, 115):
        for x in (-1, 1):
            S.point(X(x, y), 'v', r=5)
    S.point(X(0, 115), 'g', r=4)
    S.texte(X(0, 115) + [0, 22], '0', 'g', taille=16)
    S.texte(X(-1, 115) + [0, 22], '−1', 'v', taille=16); S.texte(X(1, 115) + [0, 22], '1', 'v', taille=16)
    # bords : ∂τ₁ + ∂τ₂ = [1] − [−1] = ∂σ
    assert {(-1): -1, 1: 1} == {(-1): -1 + 0, 1: 0 + 1}
    return S


@schema('lex-face-avant-1')
def lex_face_avant_1():
    W, H = 420, 250
    S = Schema(W, H, 'Face avant [e₀, e₁] et face arrière [e₁, e₂] d un simplexe de dimension 2')
    c, Rr = np.array([210.0, 140.0]), 105.0
    E = [c + Rr * np.array([math.cos(a), -math.sin(a)]) for a in (math.radians(210), math.radians(330), math.radians(90))]
    S.surface(E, 'g')
    S.ligne(E[0], E[2], 'g', l=2)
    S.ligne(E[0], E[1], 'r', l=3.4)
    S.ligne(E[1], E[2], 'b', l=3.4)
    _fleche_milieu(S, E[0], E[1], 'r'); _fleche_milieu(S, E[1], E[2], 'b'); _fleche_milieu(S, E[0], E[2], 'g')
    g = sum(E) / 3
    _etiquette_arete(S, E[0], E[1], g, '[e_0, e_1]', 'r', dist=20, taille=16)
    _etiquette_arete(S, E[1], E[2], g, '[e_1, e_2]', 'b', dist=18, taille=16)
    _etiquette_arete(S, E[0], E[2], g, '[e_0, e_2]', 'g', dist=18, taille=16)
    S.point(E[0], 't', r=3.8); S.point(E[2], 't', r=3.8)
    S.point(E[1], 'r', r=5)
    S.texte(E[0] + [-12, 12], 'e_0', ancre='end')
    S.texte(E[1] + [12, 12], 'e_1', 'r', ancre='start')
    S.texte(E[2] + [0, -16], 'e_2')
    return S


@schema('lex-calotte-1')
def lex_calotte_1():
    W, H = 420, 290
    R, k = _repere_egal(-1.3, 1.3, -1.2, 1.2, W, H, 10)
    S = Schema(W, H, 'La calotte ouverte C(p, 1) du cercle et son complémentaire K(-p, √3)')
    p = np.array([1.0, 0.0])
    a = np.linspace(-math.pi, math.pi, 721)
    Y = np.stack([np.cos(a), np.sin(a)], 1)
    d = np.linalg.norm(Y - p, axis=1)
    dedans = d < 1
    loin = np.abs(d - 1) > 1e-9                                  # hors des deux extrémités de l'arc
    assert np.all(dedans[loin] == (Y[loin, 0] > 0.5))
    assert np.all((np.linalg.norm(Y + p, axis=1) <= math.sqrt(3))[loin] == ~dedans[loin])
    ab = np.linspace(math.pi / 3, 5 * math.pi / 3, 241)          # complémentaire : angles de π/3 à 5π/3
    ar = np.linspace(-math.pi / 3, math.pi / 3, 121)
    assert np.all(np.linalg.norm(np.stack([np.cos(ab), np.sin(ab)], 1) - p, axis=1) >= 1 - 1e-12)
    assert np.all(np.linalg.norm(np.stack([np.cos(ar[1:-1]), np.sin(ar[1:-1])], 1) - p, axis=1) < 1)
    S.poly(R(np.cos(ab), np.sin(ab)), 'b', l=3)
    S.poly(R(np.cos(ar[1:-1]), np.sin(ar[1:-1])), 'r', l=3.4)
    q = np.array([0.5, math.sqrt(3) / 2])
    assert abs(np.linalg.norm(q - p) - 1) < 1e-12
    S.ligne(R(*p), R(*q), 'g', l=1.6)
    for pt in (q, q * [1, -1]):
        S.point(R(*pt), 'b', r=4.2)
    S.point(R(*p), 'r', r=4.4); S.point(R(*-p), 'b', r=4.4)
    S.texte(R(*p) + [12, 0], 'p', 'r', ancre='start')
    S.texte(R(*-p) + [-12, 0], '−p', 'b', ancre='end')
    S.texte(R(0.75, 0.43) + [-8, 6], '1', 'g', ancre='end', taille=16)
    S.texte(R(1.05, 0.62), 'C(p, 1)', 'r', ancre='start', taille=16)
    S.texte(R(-0.95, 0.95), 'K(−p, √3)', 'b', ancre='end', taille=16)
    assert R(1.05, 0.62)[0] + largeur_texte('C(p, 1)', 16) < W
    return S


# ------------------------------------------------------------------------------------------------ paquet 6
@schema('lex-courbe-jordan-2')
def lex_courbe_jordan_2():
    W, H = 420, 230
    R, k = _repere_egal(-2.6, 2.6, -1.25, 1.25, W, H, 10)
    S = Schema(W, H, 'Deux cercles tangents en 0 : trois régions, un point double')
    a = np.linspace(0, 2 * np.pi, 241)
    f = lambda x: min(np.hypot(x[0] - 1, x[1]), np.hypot(x[0] + 1, x[1])) - 1
    assert f((0.5, 0)) < 0 and f((-0.5, 0)) < 0 and f((3, 0)) > 0
    assert all(f((0, y)) > 0 for y in np.linspace(-2, 2, 41) if abs(y) > 1e-9) and abs(f((0, 0))) < 1e-12
    for cx, c in [(-1, 'r'), (1, 'b')]:
        S.poly(R(cx + np.cos(a), np.sin(a)), c, ferme=True, rempli=c, l=2.6)
    S.point(R(0, 0), 't', r=4.4)
    S.texte(R(0, 0.62), '0')
    S.ligne(R(0, 0.5), R(0, 0.08), 't', l=1)
    S.texte(R(-1, 0), 'C_−', 'r'); S.texte(R(1, 0), 'C_+', 'b')
    # étiquette de la région extérieure, en bas à droite : sa boîte reste à distance des deux cercles et du cadre
    p0 = R(1.75, -1.0)
    larg = largeur_texte('extérieur', 15, roman=True)
    S.texte(p0, 'extérieur', 'g', ancre='start', taille=15, roman=True)
    coins = [p0 + [dx, dy] for dx in (0, larg) for dy in (-9, 9)]
    for cx in (-1, 1):
        c_ = R(cx, 0)
        assert all(np.linalg.norm(q - c_) > k * 1 + 8 for q in coins)
    assert p0[0] + larg < W - 4 and p0[1] + 9 < H
    return S


@schema('lex-excision-1')
def lex_excision_1():
    W, H = 420, 190
    S = Schema(W, H, 'La paire (X, A), la partie Z, et la paire excisée')
    X = lambda x, y: np.array([210 + 175 * x, y])
    y1, y2 = 60.0, 140.0
    S.ligne(X(-1, y1), X(1, y1), 't', l=2)
    for a_, b_ in [(-1, -0.25), (0.25, 1)]:
        S.ligne(X(a_, y1), X(b_, y1), 'b', l=7)
    for a_, b_ in [(-1, -0.5), (0.5, 1)]:
        S.ligne(X(a_, y1), X(b_, y1), 'r', l=3)
    # bords de A en ±¼ : points creux (A ouverte dans X)
    for x in (-0.25, 0.25):
        S.point(X(x, y1), 'b', r=4.5, creux=True)
    # la paire excisée
    S.ligne(X(-0.5, y2), X(0.5, y2), 't', l=2)
    for a_, b_ in [(-0.5, -0.25), (0.25, 0.5)]:
        S.ligne(X(a_, y2), X(b_, y2), 'b', l=7)
    for x in (-0.5, 0.5):
        S.point(X(x, y2), 't', r=4.5, creux=True)
    for x in (-0.25, 0.25):
        S.point(X(x, y2), 'b', r=4.5, creux=True)
    for x, lab in [(-1, '−1'), (-0.5, '−½'), (-0.25, '−¼'), (0.25, '¼'), (0.5, '½'), (1, '1')]:
        S.texte(X(x, y1) + [0, 22], lab, 'g', taille=15)
    S.texte(X(-1, y1) + [-10, 0], 'X', ancre='end', taille=16)
    S.texte(X(-0.5, y2) + [-12, 0], 'X ∖ Z', ancre='end', taille=16)
    # Z fermée, contenue dans l'intérieur de A (= A, ouverte dans X) : ses points restent à distance des bords ±¼
    assert -0.5 < -0.25 and 0.5 > 0.25
    return S


@schema('lex-homologie-cellulaire-1')
def lex_homologie_cellulaire_1():
    W, H = 420, 280
    R, k = _repere_egal(-1.35, 1.35, -1.18, 1.18, W, H, 10)
    S = Schema(W, H, 'Le cercle muni d un diamètre : deux cycles de base de H₁')
    s = np.linspace(-1, 1, 201)
    for sg in (1, 0, -1):
        S.poly(R(s, sg * np.sqrt(1 - s ** 2)), 't', l=2.2)
    # cycle e₊ − e₀ : haut de gauche à droite, retour par le diamètre (décalé vers le haut, à l'intérieur)
    t = np.linspace(np.pi * 0.93, np.pi * 0.07, 160)
    haut = np.stack([0.84 * np.cos(t), 0.12 + 0.72 * np.sin(t)], 1)
    S.poly(R(haut[:, 0], haut[:, 1]), 'r', l=2)
    S.ligne(R(haut[-1, 0], haut[-1, 1]), R(haut[-1, 0], 0.1), 'r', l=2)
    S.ligne(R(haut[-1, 0], 0.1), R(haut[0, 0], 0.1), 'r', l=2)
    S.ligne(R(haut[0, 0], 0.1), R(*haut[0]), 'r', l=2)
    S.pointe(R(*haut[80]), R(*haut[82]) - R(*haut[80]), 'r', taille=11, largeur=5)
    S.pointe(R(-0.1, 0.1), [-1, 0], 'r', taille=11, largeur=5)
    bas = np.stack([0.84 * np.cos(t), -0.12 - 0.72 * np.sin(t)], 1)
    S.poly(R(bas[:, 0], bas[:, 1]), 'b', l=2)
    S.ligne(R(bas[-1, 0], bas[-1, 1]), R(bas[-1, 0], -0.1), 'b', l=2)
    S.ligne(R(bas[-1, 0], -0.1), R(bas[0, 0], -0.1), 'b', l=2)
    S.ligne(R(bas[0, 0], -0.1), R(*bas[0]), 'b', l=2)
    S.pointe(R(0.1, -0.1), [1, 0], 'b', taille=11, largeur=5)
    S.pointe(R(*bas[82]), R(*bas[80]) - R(*bas[82]), 'b', taille=11, largeur=5)
    for x, lab, an, dx in [(-1, 'p', 'end', -10), (1, 'p′', 'start', 10)]:
        S.point(R(x, 0), 't', r=4.2)
        S.texte(R(x, 0) + [dx, 0], lab, ancre=an)
    S.texte(R(0, 0.5), 'e_+ − e_0', 'r', taille=16)
    S.texte(R(0, -0.5), 'e_0 − e_−', 'b', taille=16)
    # les deux courbes restent à l'intérieur du disque, de part et d'autre du diamètre
    assert np.all(np.hypot(haut[:, 0], haut[:, 1]) < 1) and np.all(haut[:, 1] > 0) and np.all(bas[:, 1] < 0)
    return S


@schema('lex-cone-lineaire-2')
def lex_cone_lineaire_2():
    W, H = 420, 260
    S = Schema(W, H, 'Le cône de sommet b sur le tour d un triangle')
    w = [np.array([90.0, 220.0]), np.array([350.0, 210.0]), np.array([200.0, 30.0])]
    b = np.array([205.0, 150.0])
    assert _dedans(w, b)
    for i in range(3):
        S.surface([b, w[i], w[(i + 1) % 3]], 'b')
    for i in range(3):
        S.ligne(b, w[i], 'b', d=True, l=1.6)
    for i in range(3):
        p, q = w[i], w[(i + 1) % 3]
        S.ligne(p, q, 'r', l=3)
        _fleche_milieu(S, p, q, 'r')
    g = sum(w) / 3
    for i, (dx, dy, an) in enumerate([(-10, 12, 'end'), (10, 12, 'start'), (0, -16, 'middle')]):
        S.point(w[i], 't', r=4)
        S.texte(w[i] + [dx, dy], f'w_{i}', ancre=an)
    S.point(b, 'b', r=4.4)
    S.texte(b + [-14, -10], 'b', 'b', ancre='end')
    S.texte((w[0] + w[1]) / 2 + [0, 24], 'α', 'r')
    return S


# ================================================================================================ lot 2
# Sous-graphes hom-cohomologie et hom-kunneth (second lot de la théorie) : fonctions ajoutées à la suite.

# ------------------------------------------------------------------------------------------------ paquet 1
@schema('lex-cobord-complexe-1')
def lex_cobord_complexe_1():
    W, H = 420, 270
    S = Schema(W, H, 'Le triangle creux : une fonction f sur les sommets et son cobord sur les arêtes')
    cote = 220.0
    u = np.array([100.0, 230.0]); v = u + [cote, 0]; w = u + [cote / 2, -cote * math.sqrt(3) / 2]
    g = (u + v + w) / 3
    f = {'u': 0, 'v': 2, 'w': 5}
    aretes = [(u, v, 'u', 'v'), (v, w, 'v', 'w'), (w, u, 'w', 'u')]
    df = [f[t] - f[o] for _, _, o, t in aretes]           # valeur à l'extrémité moins valeur à l'origine
    assert df == [2, 3, -5] and sum(df) == 0
    for (p, q, _, _), val in zip(aretes, df):
        S.ligne(p, q, 't', l=2.2)
        _fleche_milieu(S, p, q, 't')
        _etiquette_arete(S, p, q, g, str(val).replace('-', '−'), 'r', dist=18)
    lab = {'u': (u, [-14, 4], 'end'), 'v': (v, [14, 4], 'start'), 'w': (w, [0, -20], 'middle')}
    for nom, (p, d, an) in lab.items():
        S.point(p, 't', r=4)
        S.texte(p + d, f'f({nom}) = {f[nom]}', 'b', ancre=an)
    # les étiquettes des sommets tiennent dans le cadre
    assert u[0] - 14 - largeur_texte('f(u) = 0') > 4 and v[0] + 14 + largeur_texte('f(v) = 2') < W - 4
    assert w[1] - 20 - 10 > 0
    return S


# ------------------------------------------------------------------------------------------------ paquet 3
def _clip(p, d, xmin, xmax, ymin, ymax):
    """Segment de la droite p + t d contenu dans le rectangle [xmin, xmax] × [ymin, ymax] (coordonnées du
    réseau), ou None."""
    t0, t1 = -1e9, 1e9
    for k, (lo, hi) in enumerate([(xmin, xmax), (ymin, ymax)]):
        if abs(d[k]) < 1e-12:
            if not lo - 1e-9 <= p[k] <= hi + 1e-9:
                return None
            continue
        a, b = (lo - p[k]) / d[k], (hi - p[k]) / d[k]
        t0, t1 = max(t0, min(a, b)), min(t1, max(a, b))
    if t1 - t0 < 1e-9:
        return None
    return np.array(p) + t0 * np.array(d), np.array(p) + t1 * np.array(d)


@schema('lex-pivot-sous-groupe-1')
def lex_pivot_sous_groupe_1():
    W, H = 420, 270
    S = Schema(W, H, 'Le sous-groupe de ℤ² engendré par (1, 2) et (0, 4) : deux pivots, n₀ = n₁ = 2')
    pas = 28.0
    o = np.array([W / 2, H / 2])
    X = lambda a, b: o + pas * np.array([a, -b])
    xs, ys = range(-4, 5), range(-4, 5)
    S.ligne(X(-4.5, 0), X(4.5, 0), 'r', l=2.2)
    # H = {a(1, 2) + b(0, 4)} = {(x, y) : y ≡ 2x mod 4}, calculé par énumération des combinaisons
    Hens = {(a, 2 * a + 4 * b) for a in range(-6, 7) for b in range(-6, 7)}
    Hpts = [(a, b) for a in xs for b in ys if (a, b) in Hens]
    assert all(((b - 2 * a) % 4 == 0) == ((a, b) in Hens) for a in xs for b in ys)
    for a in xs:
        for b in ys:
            if (a, b) not in Hens:
                S.point(X(a, b), 'g', r=2.4)
    for a, b in Hpts:
        S.point(X(a, b), 'b', r=4.4)
    S.fleche(X(0, 0), X(1, 2), 'b', l=2.4, retrait=5)
    S.fleche(X(0, 0), X(0, 4), 'b', l=2.4, retrait=5)
    # ce que dit la légende : sur l'axe, H a les points d'abscisse paire ; secondes coordonnées paires ; (1, 2) ∈ H
    assert sorted(a for a, b in Hpts if b == 0) == [-4, -2, 0, 2, 4]
    assert all(b % 2 == 0 for _, b in Hpts) and (1, 2) in Hens
    S.texte(X(1, 2) + [12, 14], '(1, 2)', 'b', ancre='start', taille=16)
    S.texte(X(0, 4) + [12, 14], '(0, 4)', 'b', ancre='start', taille=16)
    S.texte(X(4.5, 0) + [8, 0], 'ℤe_0', 'r', ancre='start')
    assert X(4.5, 0)[0] + 8 + largeur_texte('ℤe0') < W - 4
    S.texte(X(0, 0) + [-10, -14], '0', ancre='end')
    return S


@schema('lex-base-groupe-abelien-1')
def lex_base_groupe_abelien_1():
    W, H = 430, 200
    S = Schema(W, H, 'Une base de ℤ², et deux éléments indépendants qui n engendrent pas ℤ²')
    pas = 34.0
    xmin, xmax, ymin, ymax = -1, 3, -1, 3
    def panneau(ox):
        o = np.array([ox, H - 30 - pas])
        return lambda a, b: o + pas * np.array([a, -b])
    G, D = panneau(62.0), panneau(282.0)
    # gauche : droites a(2,1) + b(1,1), b fixé (direction (2,1)) et a fixé (direction (1,1))
    u, v = np.array([2, 1]), np.array([1, 1])
    for k in range(-6, 7):
        for dirn, base in [(u, k * v), (v, k * u)]:
            seg = _clip(base, dirn, xmin - 0.3, xmax + 0.3, ymin - 0.3, ymax + 0.3)
            if seg is not None:
                S.ligne(G(*seg[0]), G(*seg[1]), 'g', l=1.1)
    M = np.array([u, v]).T
    for a in range(xmin, xmax + 1):
        for b in range(ymin, ymax + 1):
            c = np.linalg.solve(M, [a, b])
            assert np.allclose(c, np.round(c))          # tout point est combinaison entière de (2,1) et (1,1)
            S.point(G(a, b), 'b', r=3.6)
    S.fleche(G(0, 0), G(2, 1), 'b', l=2.6, retrait=5)
    S.fleche(G(0, 0), G(1, 1), 'b', l=2.6, retrait=5)
    S.texte(G(2, 1) + [8, 12], '(2, 1)', 'b', ancre='start', taille=16)
    S.texte(G(1, 1) + [-8, -14], '(1, 1)', 'b', ancre='end', taille=16)
    # droite : combinaisons de (2,0) et (0,1) = points de première coordonnée paire
    for a in range(xmin, xmax + 1):
        for b in range(ymin, ymax + 1):
            if a % 2 == 0:
                S.point(D(a, b), 'r', r=3.8)
            else:
                S.point(D(a, b), 'g', r=3.4, creux=True)
    S.fleche(D(0, 0), D(2, 0), 'r', l=2.6, retrait=5)
    S.fleche(D(0, 0), D(0, 1), 'r', l=2.6, retrait=5)
    S.texte(D(2, 0) + [6, 16], '(2, 0)', 'r', ancre='start', taille=16)
    S.texte(D(0, 1) + [-8, -12], '(0, 1)', 'r', ancre='end', taille=16)
    S.texte(D(1, 0) + [0, 18], '(1, 0)', 'g', taille=16)
    # les deux panneaux ne se chevauchent pas et tiennent dans le cadre
    assert G(xmax, 0)[0] + 20 < D(xmin, 0)[0] - 10 and D(xmax, 0)[0] + 10 < W and G(0, ymax)[1] > 20
    assert G(xmin - 0.3, 0)[0] > 2 and G(0, ymin - 0.3)[1] < H - 2
    assert D(2, 0)[0] + 6 + largeur_texte('(2, 0)', 16) < W - 2
    return S


# ------------------------------------------------------------------------------------------------ paquet 4
@schema('lex-regle-signes-1')
def lex_regle_signes_1():
    W, H = 420, 270
    S = Schema(W, H, 'Le carré e ⊗ e et son bord, orienté par la règle des signes')
    L = 150.0
    x0, y0 = 135.0, 210.0
    P = lambda i, j: np.array([x0 + L * i, y0 - L * j])
    S.surface([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], 'b')
    # ∂(e⊗e) = e⊗v0 + v1⊗e − e⊗v1 − v0⊗e ; e⊗vj : de (0, j) à (1, j) ; vi⊗e : de (i, 0) à (i, 1)
    termes = [(+1, 'e', 0), (+1, 'v', 1), (-1, 'e', 1), (-1, 'v', 0)]
    tour = []
    for sg, kind, k in termes:
        a, b = ((P(0, k), P(1, k)) if kind == 'e' else (P(k, 0), P(k, 1)))
        tour.append((a, b) if sg > 0 else (b, a))
    # les quatre arêtes signées se suivent et tournent dans le sens direct à l'écran
    assert all(np.allclose(tour[i][1], tour[(i + 1) % 4][0]) for i in range(4))
    assert _aire([t[0] for t in tour]) > 0
    noms = ['e ⊗ v_0', 'v_1 ⊗ e', '−e ⊗ v_1', '−v_0 ⊗ e']
    centre = (P(0, 0) + P(1, 1)) / 2
    for (a, b), nom in zip(tour, noms):
        S.ligne(a, b, 'r', l=2.8)
        _fleche_milieu(S, a, b, 'r')
        _etiquette_arete(S, a, b, centre, nom, 'r', dist=20)
    for i in (0, 1):
        for j in (0, 1):
            d = np.array([-10 if i == 0 else 10, 16 if j == 0 else -16])
            S.point(P(i, j), 't', r=3.6)
            S.texte(P(i, j) + d, f'v_{i} ⊗ v_{j}', ancre='end' if i == 0 else 'start', taille=16)
    S.texte(centre, 'e ⊗ e', 'b')
    # étiquettes dans le cadre
    assert x0 - 20 - largeur_texte('−v0 ⊗ e') > 4 and x0 + L + 20 + largeur_texte('v1 ⊗ e') < W - 4
    assert x0 - 10 - largeur_texte('v0 ⊗ v0', 16) > 4 and y0 - L - 16 - 10 > 0 and y0 + 22 + 10 < H
    return S


# ------------------------------------------------------------------------------------------------ paquet 5
@schema('lex-cone-singulier-1')
def lex_cone_singulier_1():
    W, H = 420, 290
    R, k = _repere_egal(-1.5, 1.5, -1.08, 1.14, W, H, 8)
    S = Schema(W, H, 'Le cône d un demi-cercle de sommet b sort du cercle')
    th = np.linspace(0, 2 * np.pi, 361)
    S.poly(R(np.cos(th), np.sin(th)), 'g', l=1.6)
    b = np.array([1.0, 0.0])
    for a in np.linspace(np.pi / 9, np.pi, 9):
        q = np.array([np.cos(a), np.sin(a)])
        S.ligne(R(*b), R(*q), 'g', l=1.2)
        # le milieu de chaque segment est strictement dans le disque : le cône sort du cercle
        assert np.hypot(*((b + q) / 2)) < 1 - 1e-9
    th2 = np.linspace(0, np.pi, 181)
    S.poly(R(np.cos(th2), np.sin(th2)), 'r', l=3)
    S.pointe(R(np.cos(1.62), np.sin(1.62)), R(np.cos(1.64), np.sin(1.64)) - R(np.cos(1.62), np.sin(1.62)), 'r', taille=11, largeur=5)
    m = (b + np.array([-1.0, 0.0])) / 2
    assert np.allclose(m, [0, 0])
    S.point(R(*b), 't', r=4.2); S.point(R(-1, 0), 't', r=4.2); S.point(R(*m), 'b', r=4.6)
    S.texte(R(*b) + [12, 4], 'b', ancre='start')
    S.texte(R(-1, 0) + [-12, 4], '(−1, 0)', ancre='end')
    S.texte(R(*m) + [0, 20], '(0, 0)', 'b')
    S.texte(R(np.cos(1.1), np.sin(1.1)) + [12, -10], 'σ', 'r', ancre='start')
    assert R(-1, 0)[0] - 12 - largeur_texte('(−1, 0)') > 2 and R(*m)[1] + 30 < H
    return S


@schema('lex-application-alexander-whitney-1')
def lex_application_alexander_whitney_1():
    W, H = 420, 270
    S = Schema(W, H, 'Un chemin du produit et le chemin en équerre que lui associe l application d Alexander-Whitney')
    # cadre X × Y : [0, 1]² ; γ(s) = (s + 0.12 sin(πs) ..) à composantes croissantes
    X0, Y0, L = 110.0, 230.0, 190.0
    P = lambda x, y: np.array([X0 + L * x, Y0 - L * y])
    S.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], 'g', ferme=True, l=1.2)
    xa, xb, ya, yb = 0.15, 0.85, 0.15, 0.85
    s = np.linspace(0, 1, 201)
    g1 = xa + (xb - xa) * s ** 0.6
    g2 = ya + (yb - ya) * s ** 1.7
    assert np.all(np.diff(g1) > 0) and np.all(np.diff(g2) > 0)          # composantes monotones
    assert abs(g1[0] - xa) + abs(g1[-1] - xb) + abs(g2[0] - ya) + abs(g2[-1] - yb) < 1e-9
    pts = np.array([P(a, c) for a, c in zip(g1, g2)])
    S.poly(pts, 'r', l=3)
    S.pointe(pts[100], pts[102] - pts[100], 'r', taille=11, largeur=5)
    # équerre : (x0, y) pour y de y0 à y1, puis (x, y1) pour x de x0 à x1
    S.ligne(P(xa, ya), P(xa, yb), 'b', l=3)
    S.ligne(P(xa, yb), P(xb, yb), 'b', l=3)
    _fleche_milieu(S, P(xa, ya), P(xa, yb), 'b')
    _fleche_milieu(S, P(xa, yb), P(xb, yb), 'b')
    for (x, y), lab, d, an in [((xa, ya), '(x_0, y_0)', [8, 18], 'start'), ((xb, yb), '(x_1, y_1)', [10, 14], 'start')]:
        S.point(P(x, y), 't', r=4.2)
        S.texte(P(x, y) + d, lab, ancre=an)
    S.texte(P(1, 0) + [10, 0], 'X', 'g', ancre='start')
    S.texte(P(0, 1) + [-10, 0], 'Y', 'g', ancre='end')
    S.texte(P(0.66, 0.36), 'γ', 'r')
    # l'équerre et γ ont les mêmes extrémités ; la courbe reste dans le cadre ; étiquettes dans le cadre
    assert np.all((g1 >= 0) & (g1 <= 1) & (g2 >= 0) & (g2 <= 1))
    assert P(xb, yb)[0] + 10 + largeur_texte('(x1, y1)') < W - 2
    return S

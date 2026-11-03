"""Schémas du chapitre cal-syntaxe-pa (suites codées et démonstrations dans PA) : la démonstration mise bout à
bout r = aj(conc(p, q), c) du point (iii) de cal-sp-derivabilite, avec les rangs des deux blocs et le modus ponens
final. Les rangs sont vérifiés sur des suites explicites avant d'être dessinés."""
from edifice_schemas import schema
from edifice_svg import Schema, courbe_entre


def bout_a_bout(p, q, c):
    """La suite codée par aj(conc(p, q), c), lue sur les suites."""
    return list(p) + list(q) + [c]


@schema('cal-sp-derivabilite')
def cal_sp_derivabilite():
    # contrôle des rangs sur un exemple : p = (·, ·, b), q = (·, a), c ajouté
    p, q, c = ['p0', 'p1', 'b'], ['q0', 'a'], 'c'
    r = bout_a_bout(p, q, c)
    lp, lq = len(p), len(q)
    k, m = lp - 1, lq - 1
    assert len(r) == lp + lq + 1 and r[lp + lq] == c
    assert r[k] == 'b' and r[lp + m] == 'a'
    assert all(r[j] == p[j] for j in range(lp)) and all(r[lp + s] == q[s] for s in range(lq))
    # un modus ponens interne au second bloc, aux rangs (i, i') < s, est lu aux rangs décalés
    i, s = 0, 1
    assert r[lp + i] == q[i] and lp + i < lp + s

    W, H = 520, 186
    S = Schema(W, H, 'Démonstration mise bout à bout : p, puis q décalée de l_p, puis c')
    dx, hc = 74, 40
    n = len(r)
    x0 = (W - dx * n) / 2
    yc = 96
    X = [x0 + dx * j + dx / 2 for j in range(n)]
    coul = ['b'] * lp + ['v'] * lq + ['r']
    etiq = ['(p)^0', '(p)^1', 'b', '(q)^0', 'a', 'c']
    rangs = ['0', '1', 'k', 'l_p', 'l_p + m', 'l_p + l_q']
    for j in range(n):
        S.rect(x0 + dx * j + 3, yc - hc / 2, dx - 6, hc, coul[j], rempli=coul[j], rx=6)
        S.texte((X[j], yc), etiq[j], coul[j], taille=16)
        S.texte((X[j], yc + hc / 2 + 18), rangs[j], 'g', taille=14)
    # accolades des blocs (traits sous les rangs)
    yb = yc + hc / 2 + 40
    for (a, b, cc, nom) in [(0, lp - 1, 'b', '`suite` p'), (lp, lp + lq - 1, 'v', '`suite` q `décalée de` l_p')]:
        xa, xb = x0 + dx * a + 6, x0 + dx * (b + 1) - 6
        S.ligne((xa, yb), (xb, yb), cc, l=2.2)
        S.ligne((xa, yb - 6), (xa, yb), cc, l=2.2)
        S.ligne((xb, yb - 6), (xb, yb), cc, l=2.2)
        S.texte(((xa + xb) / 2, yb + 18), nom, cc, taille=14)
    # modus ponens final : de b (rang k) et de a (rang l_p + m) vers c
    ytop = yc - hc / 2 - 4
    for j, cour, fin in [(k, -0.36, -12), (lp + m, -0.5, 6)]:
        pts = courbe_entre((X[j], ytop), (X[-1] + fin, ytop), courbure=cour)
        S.courbe_fleche(pts, 'r', l=1.8)
    S.texte((X[-1] + dx / 2 - 4, 18), '`modus ponens`', 'r', ancre='end', taille=14)
    # modus ponens interne au second bloc : rang l_p + i vers l_p + s, en pointillé
    pts = courbe_entre((X[lp + i] + 6, ytop), (X[lp + s] - 14, ytop), courbure=-0.5)
    S.courbe_fleche(pts, 'g', d=True)
    return S

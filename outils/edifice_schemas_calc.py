"""Schémas du graphe calc (calculabilité) : programme de l'addition sur une machine à registres, son
exécution, et diagonale de l'arrêt calculée sur les premiers indices."""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, bezier


# ---------------------------------------------------------------- machine à registres (modèle exact)
def executer(prog, x, pas_max=100000):
    """Calcul de la machine sur x. Rend (résultat ou None si le calcul boucle, trace des configurations).
    Une boucle est détectée par la répétition exacte d'une configuration : le calcul est alors périodique
    et ne s'arrête pas ; aucun calcul n'est déclaré non terminé sans cette preuve."""
    r = {i + 1: v for i, v in enumerate(x)}
    l, vues, trace = 0, set(), []
    for _ in range(pas_max):
        trace.append((l, dict(r)))
        if l >= len(prog):
            return r.get(0, 0), trace
        etat = (l, tuple(sorted((i, v) for i, v in r.items() if v)))
        if etat in vues:
            return None, trace
        vues.add(etat)
        ins = prog[l]
        if ins[0] == 'INC':
            r[ins[1]] = r.get(ins[1], 0) + 1
            l += 1
        elif r.get(ins[1], 0) > 0:
            r[ins[1]] -= 1
            l += 1
        else:
            l = ins[2]
    raise AssertionError('calcul trop long pour être tranché')


def exposant(x, p):
    if x == 0:
        return 0
    k = 0
    while x % p == 0:
        x //= p
        k += 1
    return k


def decoder_suite(N):
    """Suite codée par N (code des mots de hk-temoins : <> = 0, <s, k> = 2^<s> (2k + 1))."""
    s = []
    while N:
        n = exposant(N, 2)
        s.append((N // 2 ** n - 1) // 2)
        N = n
    return s[::-1]


def coder_suite(s):
    c = 0
    for k in s:
        c = 2 ** c * (2 * k + 1)
    return c


def programme(e):
    """Programme P_e (nœud cal-kleene) : code pair 2i → INC(i) ; code impair k → DEC((k−1)_0 ∸ 1, (k−1)_1)."""
    res = []
    for k in decoder_suite(e):
        if k % 2 == 0:
            res.append(('INC', k // 2))
        else:
            res.append(('DEC', max(exposant(k - 1, 2) - 1, 0), exposant(k - 1, 3)))
    return res


ADDITION = [('DEC', 1, 3), ('INC', 0), ('DEC', 3, 0), ('DEC', 2, 6), ('INC', 0), ('DEC', 3, 3)]


def verifier_addition():
    for x in range(6):
        for y in range(6):
            res, trace = executer(ADDITION, (x, y))
            assert res == x + y and len(trace) - 1 == 3 * x + 3 * y + 2
            # R_3 reste nul : DEC(3, j) est un saut inconditionnel
            assert all(r.get(3, 0) == 0 for _, r in trace)


def nom_instr(ins):
    return f'`INC`({ins[1]})' if ins[0] == 'INC' else f'`DEC`({ins[1]}, {ins[2]})'


# ================================================================ cal-machines
@schema('cal-machines')
def cal_machines():
    verifier_addition()
    W, H = 520, 432
    S = Schema(W, H, "Programme de l'addition sur une machine à registres")
    xc, y0, dy = 236, 34, 58
    bw, bh = 168, 34
    ys = [y0 + dy * k for k in range(7)]
    for k, ins in enumerate(ADDITION):
        S.rect(xc - bw / 2, ys[k] - bh / 2, bw, bh, 't', rx=6)
        S.texte((xc - bw / 2 + 10, ys[k]), f'I_{k}', 'g', ancre='start', taille=15)
        S.texte((xc + 14, ys[k]), nom_instr(ins), taille=16)
    S.rect(xc - bw / 2, ys[6] - bh / 2, bw, bh, 'r', rx=17)
    S.texte((xc, ys[6]), 'arrêt', 'r', taille=16, roman=True)
    # passages à l'instruction suivante (registre non nul, ou INC) : gris, vers le bas
    suivants = [0, 1, 3, 4]
    for k in suivants:
        S.fleche((xc, ys[k] + bh / 2), (xc, ys[k + 1] - bh / 2), 'g', retrait=1)
    etiquettes = {0: 'R_1 > 0', 3: 'R_2 > 0'}
    for k, lab in etiquettes.items():
        S.texte((xc + 8, (ys[k] + ys[k + 1]) / 2), lab, 'g', ancre='start', taille=14)
    # sauts sur registre nul : rouge, à droite
    xd = xc + bw / 2
    for a, b, lab in [(0, 3, 'R_1 = 0'), (3, 6, 'R_2 = 0')]:
        assert ADDITION[a][0] == 'DEC' and ADDITION[a][2] == b
        p, q = np.array([xd, ys[a] + 6.0]), np.array([xd, ys[b] - 6.0])
        bombe = 74
        pts = bezier(p, p + [bombe, 0], q + [bombe, 0], q)
        S.courbe_fleche(pts, 'r')
        S.texte((xd + 0.75 * bombe + 8, (ys[a] + ys[b]) / 2), lab, 'r', ancre='start', taille=15)
    # sauts inconditionnels DEC(3, j) : pointillés, à gauche
    xg = xc - bw / 2
    for a, b in [(2, 0), (5, 3)]:
        assert ADDITION[a] == ('DEC', 3, b)
        p, q = np.array([xg, ys[a]]), np.array([xg, ys[b]])
        bombe = 62
        pts = bezier(p, p - [bombe, 0], q - [bombe, 0], q)
        S.courbe_fleche(pts, 't', d=True)
    S.texte((xg - 52, (ys[0] + ys[2]) / 2), 'R_1 → R_0', 'b', ancre='end', taille=15)
    S.texte((xg - 52, (ys[3] + ys[5]) / 2), 'R_2 → R_0', 'b', ancre='end', taille=15)
    return S


# ================================================================ cal-machines-2
@schema('cal-machines-2')
def cal_machines_2():
    res, trace = executer(ADDITION, (2, 1))
    assert res == 3 and len(trace) - 1 == 11
    W = 480
    colx = [70, 160, 250, 330, 410]
    ent = ['t', 'ℓ', 'R_0', 'R_1', 'R_2']
    y0, dy = 30, 27
    H = int(y0 + dy * (len(trace) + 1) + 6)
    S = Schema(W, H, "Exécution du programme de l'addition sur (2, 1)")
    for x, e in zip(colx, ent):
        S.texte((x, y0), e, 'r' if e == 'R_0' else 'g', taille=16)
    S.ligne((30, y0 + dy / 2 + 1), (W - 30, y0 + dy / 2 + 1), 'g')
    S.ligne((115, y0 - dy / 2), (115, y0 + dy * len(trace) + dy / 2 - 4), 'g')
    for t, (l, r) in enumerate(trace):
        y = y0 + dy * (t + 1)
        vals = [t, l, r.get(0, 0), r.get(1, 0), r.get(2, 0)]
        for k, (x, v) in enumerate(zip(colx, vals)):
            c = 'r' if k == 2 else ('g' if k == 0 else 't')
            if k == 1 and l >= len(ADDITION):
                S.texte((x, y), 'arrêt', 'r', taille=15, roman=True)
                continue
            S.texte((x, y), str(v), c, taille=16)
    # contrôle : la dernière ligne est terminale et R_0 = 3
    assert trace[-1][0] == 6 and trace[-1][1].get(0) == 3
    return S


# ================================================================ cal-arret
@schema('cal-arret')
def cal_arret():
    n = 12
    for e in range(40):                      # le décodage inverse le codage
        assert coder_suite(decoder_suite(e)) == e
    table = {}
    for e in range(n):
        for x in range(n):
            res, _ = executer(programme(e), (x,))
            table[e, x] = res is not None
    # quelques valeurs vérifiées à la main : P_0 vide, P_3 = DEC(0, 0) boucle, P_6 = INC(0), DEC(0, 0) s'arrête
    assert programme(3) == [('DEC', 0, 0)] and not any(table[3, x] for x in range(n))
    assert programme(0) == [] and all(table[0, x] for x in range(n))
    assert programme(6) == [('INC', 0), ('DEC', 0, 0)] and table[6, 0]
    g = [not table[e, e] for e in range(n)]
    for e in range(n):
        assert g[e] != table[e, e]          # g diffère de chaque ligne sur la diagonale
    assert not table[11, 0] and all(table[11, x] for x in range(1, n))   # P_11 = DEC(1, 0)
    for e in range(n):                      # la légende : seule la ligne 11 dépend de x
        if e != 11:
            assert len({table[e, x] for x in range(n)}) == 1
    W, H = 500, 528
    S = Schema(W, H, "Diagonale de l'arrêt sur les douze premiers indices")
    x0, y0, c = 100, 72, 34
    cx = [x0 + c * x for x in range(n)]
    cy = [y0 + c * e for e in range(n)]
    S.texte((x0 + c * (n - 1) / 2, 18), 'x', 'g', taille=16)
    S.texte((40, y0 + c * (n - 1) / 2), 'e', 'g', taille=16)
    for x in range(n):
        S.texte((cx[x], 44), str(x), 'g', taille=15)
    for e in range(n):
        S.texte((x0 - 30, cy[e]), str(e), 'g', taille=15)

    def marque(p, arret, coul_ok, coul_non):
        if arret:
            S.point(p, coul_ok, r=5)
        else:
            d = 5
            S.ligne((p[0] - d, p[1] - d), (p[0] + d, p[1] + d), coul_non, l=2)
            S.ligne((p[0] - d, p[1] + d), (p[0] + d, p[1] - d), coul_non, l=2)

    for e in range(n):
        for x in range(n):
            marque((cx[x], cy[e]), table[e, x], 'v', 'g')
        S.rect(cx[e] - c / 2 + 2, cy[e] - c / 2 + 2, c - 4, c - 4, 'r', rx=4)
    yg = y0 + c * n + 22
    S.ligne((x0 - c / 2, yg - c / 2 - 2), (x0 + c * (n - 1) + c / 2, yg - c / 2 - 2), 'g')
    S.texte((x0 - 30, yg + 4), 'g', 'r', taille=17)
    for e in range(n):
        marque((cx[e], yg + 4), g[e], 'r', 'r')
    return S

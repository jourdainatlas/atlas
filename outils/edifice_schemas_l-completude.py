"""Schémas du graphe l-completude (démonstration de Henkin du théorème de complétude)."""
import itertools

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, bezier


# ---------------------------------------------------------------- outils locaux
def largeur(s, taille=16):
    """Largeur approximative d'une étiquette (pour écarter un trait d'un texte, jamais pour placer
    un objet mathématique)."""
    n, i = 0.0, 0
    while i < len(s):
        c = s[i]
        if c in '_^':
            if i + 1 < len(s) and s[i + 1] == '{':
                j = s.index('}', i + 2)
                n += 0.72 * (j - i - 2)
                i = j + 1
            else:
                n += 0.72
                i += 2
            continue
        n += 0.45 if c in ' ,()[]{}.:′' else 1.0
        i += 1
    return n * 0.58 * taille


def fleche_entre(S, p, q, c='t', d=False, marge_p=0, marge_q=0, l=None):
    """Flèche de p vers q, raccourcie de marge_p au départ et de marge_q à l'arrivée."""
    S.fleche(p, q, c, d=d, retrait_debut=marge_p, retrait=marge_q, l=l)


def chapeau(S, x, y, c='t', w=7, h=4):
    """Accent circonflexe dessiné au-dessus d'une lettre centrée en x (y : bas de l'accent)."""
    S.poly([(x - w / 2, y), (x, y - h), (x + w / 2, y)], c)


# ================================================================ hk-temoins
@schema('hk-temoins')
def hk_temoins():
    # Modèle symbolique : formules = listes de symboles ; un symbole a un niveau (0 pour R et les
    # symboles logiques, n + 1 pour le témoin d'un énoncé de niveau n).
    niveau = {}

    def niv(formule):
        return max([niveau.get(a, 0) for a in formule])

    def subst(phi, x, c):
        # φ[c/x] ; aucune des formules traitées ne quantifie x dans φ : toutes les occurrences
        # de x y sont libres
        assert ('∀', x) not in zip(phi, phi[1:])
        return [c if a == x else a for a in phi]

    phi = ['∀', 'y', 'R', 'x', 'y']                 # φ = ∀y R x y
    sigma = ['∃', 'x'] + phi                         # σ = ∃x φ
    assert niv(sigma) == 0                           # σ est écrit dans ℒ_0
    niveau['c_σ'] = niv(sigma) + 1
    h_sigma = sigma + ['→'] + subst(phi, 'x', 'c_σ')
    assert h_sigma[-5:] == ['∀', 'y', 'R', 'c_σ', 'y']
    phi2 = ['¬', 'R', 'c_σ', 'y']                    # φ′ = ¬R c_σ y
    sigma2 = ['∃', 'y'] + phi2                       # σ′ = ∃y φ′
    assert niv(sigma2) == 1                          # σ′ n'est pas un énoncé de ℒ_0
    niveau['c_σ′'] = niv(sigma2) + 1
    assert niveau['c_σ′'] == 2
    h_sigma2 = sigma2 + ['→'] + [('c_σ′' if a == 'y' else a) for a in phi2]
    assert h_sigma2[-4:] == ['¬', 'R', 'c_σ', 'c_σ′']
    # retrait dans l'ordre des niveaux décroissants : la constante de niveau maximal ne figure
    # dans aucun autre axiome
    assert 'c_σ′' not in h_sigma and niv(h_sigma2) == 2 and niv(h_sigma) == 1

    W, H = 520, 318
    S = Schema(W, H, "Étages ℒ_0 ⊂ ℒ_1 ⊂ ℒ_2 de l'extension par témoins, sur une signature à une relation binaire R")
    # bandes : colonne n = symboles de ℒ_n qui ne sont pas dans ℒ_{n-1}
    xg = 14
    col = [xg + 6, 182, 346, W - 14]                 # bords droits successifs : ℒ_0, ℒ_1, ℒ_2
    cx = [(col[0] + col[1]) / 2 + 2, (col[1] + col[2]) / 2, (col[2] + col[3]) / 2]
    hauts = [74, 50, 26]
    bas = [242, 256, 270]
    for k in range(3):
        S.rect(xg + 6 * (2 - k), hauts[k], col[k + 1] - (xg + 6 * (2 - k)), bas[k] - hauts[k],
               'g', rx=10)
        S.texte((col[k + 1] - 12, hauts[k] + 14), f'ℒ_{k}', 'g', ancre='end', taille=15)
    y_sym, y_enon, y_h, y_ax = 112, 166, 206, 230
    # ℒ_0
    S.texte((cx[0], y_sym), 'R', taille=16)
    S.texte((cx[0], y_enon), 'σ = ∃x ∀y R x y', taille=16)
    # ℒ_1
    S.texte((cx[1], y_sym), 'c_σ', 'r', taille=17)
    S.texte((cx[1], y_enon), 'σ′ = ∃y ¬R c_σ y', taille=16)
    S.texte((cx[1], y_h), 'h_σ', 'g', taille=14)
    S.texte((cx[1], y_ax), 'σ → ∀y R c_σ y', taille=15)
    # ℒ_2
    S.texte((cx[2], y_sym), 'c_{σ′}', 'r', taille=17)
    S.texte((cx[2], y_h), 'h_{σ′}', 'g', taille=14)
    S.texte((cx[2], y_ax), 'σ′ → ¬R c_σ c_{σ′}', taille=15)
    # flèches « énoncé → son témoin » (rouge) et « le témoin figure dans σ′ » (gris pointillé)
    for a, b in [((cx[0] + largeur('σ = ∃x ∀y R x y') / 2 - 4, y_enon - 10), (cx[1] - 20, y_sym + 6)),
                 ((cx[1] + largeur('σ′ = ∃y ¬R c_σ y') / 2 - 4, y_enon - 10), (cx[2] - 24, y_sym + 6))]:
        fleche_entre(S, a, b, 'r', marge_p=4, marge_q=4)
    fleche_entre(S, (cx[1], y_sym + 12), (cx[1] + 18, y_enon - 12), 'g', d=True)
    S.texte((W / 2, H - 22), 'ℒ_0 ⊂ ℒ_1 ⊂ ℒ_2 ⊂ ⋯ ⊂ ℒ^+', 'g', taille=15)
    return S


# ================================================================ hk-lindenbaum
@schema('hk-lindenbaum')
def hk_lindenbaum():
    # Signature {P, Q, c} ; T = {∀x P x} ; début d'énumération : P c, Q c, ∃x ¬Q x.
    # Vérification sémantique sur toutes les structures à au plus 3 éléments (sans valeur de
    # preuve ici : la décision « T_n ⊢ σ_n » est justifiée dans la légende ; un contre-modèle
    # justifie, par la correction, chaque « ⊬ »).
    def structures(nmax=3):
        for n in range(1, nmax + 1):
            dom = range(n)
            for P in itertools.product([0, 1], repeat=n):
                for Q in itertools.product([0, 1], repeat=n):
                    for c in dom:
                        yield dom, P, Q, c

    tout_P = lambda m: all(m[1][a] for a in m[0])
    Pc = lambda m: m[1][m[3]]
    Qc = lambda m: m[2][m[3]]
    ex_nonQ = lambda m: any(not m[2][a] for a in m[0])
    enonces = [('P c', Pc), ('Q c', Qc), ('∃x ¬Q x', ex_nonQ)]
    T = [tout_P]
    decisions = []
    for nom, s in enonces:
        modeles = [m for m in structures() if all(f(m) for f in T)]
        assert modeles
        vrai_partout = all(s(m) for m in modeles)
        decisions.append(vrai_partout)
        T = T + [s if vrai_partout else (lambda m, s=s: not s(m))]
    assert decisions == [True, False, True]
    # contre-modèle de T_1 ⊢ Q c : un élément, P plein, Q vide
    m0 = (range(1), (1,), (0,), 0)
    assert tout_P(m0) and Pc(m0) and not Qc(m0)

    W, H = 520, 392
    S = Schema(W, H, 'Construction de Lindenbaum : branche des décisions T_0 ⊂ T_1 ⊂ T_2 ⊂ T_3')
    dx, dy = 84, 82
    y = [40 + dy * n for n in range(4)]
    x = [196]
    for d in decisions:
        x.append(x[-1] - dx if d else x[-1] + dx)
    raisons = ['T_0 ⊢ P c', 'T_1 ⊬ Q c', 'T_2 ⊢ ∃x ¬Q x']
    xr = 372
    for n, (nom, _) in enumerate(enonces):
        p = np.array([x[n], y[n]], float)
        g = np.array([x[n] - dx, y[n + 1]], float)
        d = np.array([x[n] + dx, y[n + 1]], float)
        gauche_prise = decisions[n]
        for q, garde, lab, cote in [(g, gauche_prise, nom, -1), (d, not gauche_prise, '¬' + nom, 1)]:
            c = 'r' if garde else 'g'
            u = (q - p) / np.linalg.norm(q - p)
            S.ligne(p + 15 * u, q - (15 if garde else 7) * u, c, d=not garde, l=2 if garde else None)
            m = (p + q) / 2
            S.texte((m[0] + cote * 12, m[1] - 4), lab, c, ancre='start' if cote > 0 else 'end', taille=15)
            if not garde:
                S.point(q, 'g', r=4, creux=True)
        S.texte((xr, (y[n] + y[n + 1]) / 2 - 4), raisons[n], 'g', ancre='start', taille=15)
    for n in range(4):
        S.texte((x[n], y[n]), f'T_{n}', 'r', taille=17)
    S.texte((x[3], y[3] + 30), '⋮', 'r', taille=17)
    # réunion : T̂ = T_0 ∪ T_1 ∪ T_2 ∪ ⋯ (accent dessiné)
    yb = H - 22
    xt = W / 2 - largeur('T = T_0 ∪ T_1 ∪ T_2 ∪ T_3 ∪ ⋯', 16) / 2 + 6
    S.texte((xt, yb), 'T', 'r', ancre='middle', taille=17)
    chapeau(S, xt + 1.5, yb - 11, 'r')
    S.texte((xt + 10, yb), ' = T_0 ∪ T_1 ∪ T_2 ∪ T_3 ∪ ⋯', 'g', ancre='start', taille=16)
    return S


# ================================================================ hk-modele
@schema('hk-modele')
def hk_modele():
    # Signature {0, S} ; T̂ = énoncés vrais dans la structure à deux éléments {a, b}, 0 ↦ a,
    # S échange a et b. Le terme S^n 0 vaut a si n est pair, b sinon ; (S^n 0 = S^m 0) ∈ T̂
    # si et seulement si n ≡ m (mod 2).
    def valeur(n):
        return 'ab'[n % 2]

    N = 6
    termes = [' '.join(['S'] * n + ['0']) for n in range(N)]
    classe = {n: valeur(n) for n in range(N)}
    for n, m in itertools.product(range(N), repeat=2):
        assert (classe[n] == classe[m]) == ((n - m) % 2 == 0)
    # bonne définition de S^ℳ : les images des termes d'une même classe sont dans une même classe
    for k in 'ab':
        images = {classe[n + 1] for n in range(N - 1) if classe[n] == k}
        assert len(images) == 1 and images != {k}
    assert ('S S 0', '0') == (termes[2], termes[0]) and classe[2] == classe[0]

    W, H = 520, 392
    S = Schema(W, H, 'Modèle des termes clos de la théorie d’une structure à deux éléments sur la signature {0, S}')
    cA, cB = np.array([160.0, 196.0]), np.array([360.0, 196.0])
    rx, ry = 84, 128
    S.ellipse(cA, rx, ry, 'b')
    S.ellipse(cB, rx, ry, 'v')
    S.texte((cA[0] - rx - 12, cA[1]), '[0]', 'b', ancre='end', taille=17)
    S.texte((cB[0] + rx + 12, cB[1]), '[S 0]', 'v', ancre='start', taille=17)
    pos = {}
    for n in range(N):
        cc = cA if classe[n] == 'a' else cB
        pos[n] = np.array([cc[0], 104 + 34 * n])
        S.texte(pos[n], termes[n], 'b' if classe[n] == 'a' else 'v', taille=16)
    for k, cc, c in (('a', cA, 'b'), ('b', cB, 'v')):
        dernier = max(n for n in range(N) if classe[n] == k)
        yp = pos[dernier][1] + 28
        assert yp < cc[1] + ry - 12                    # les points de suspension restent dans la classe
        S.texte((cc[0], yp), '⋮', c, taille=16)
    for n in range(N - 1):
        p, q = pos[n], pos[n + 1]
        sp = np.sign(q[0] - p[0])
        a = p + np.array([sp * (largeur(termes[n]) / 2 + 6), 4])
        b = q - np.array([sp * (largeur(termes[n + 1]) / 2 + 8), 4])
        S.fleche(a, b, 'g')
    # interprétation de S : de [0] vers [S 0] (en haut) et de [S 0] vers [0] (en bas)
    haut = bezier(cA + [30, -ry + 10], [cA[0] + 50, 36], [cB[0] - 50, 36], cB + [-30, -ry + 10])
    bas = bezier(cB + [-30, ry - 10], [cB[0] - 50, H - 36], [cA[0] + 50, H - 36], cA + [30, ry - 10])
    for courbe in (haut, bas):
        S.courbe_fleche(courbe, 'r', l=2)
    S.texte(((cA[0] + cB[0]) / 2, haut[:, 1].min() - 14), 'S', 'r', taille=17)
    S.texte(((cA[0] + cB[0]) / 2, bas[:, 1].max() + 14), 'S', 'r', taille=17)
    assert haut[:, 1].min() - 24 > 0 and bas[:, 1].max() + 24 < H
    return S

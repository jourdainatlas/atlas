"""Schémas des graphes d'analyse (analyse réelle, continuité, analyse complexe, mesure, Fourier, EDO…)."""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


@schema('c-tvi')
def c_tvi():
    # f(x) = y + k (x - r1)(x - r2)(x - r3) sur [a, b] = [0, 4], y = 1 : trois traversées du niveau y,
    # A = {f < y} = [0, r1[ ∪ ]r2, r3[ n'est pas un intervalle, et c = sup A = r3.
    y, k, (r1, r2, r3) = 1.0, 0.35, (0.8, 1.6, 3.2)
    fn = lambda x: y + k * (x - r1) * (x - r2) * (x - r3)
    a, b = 0.0, 4.0
    xs = np.linspace(a, b, 3999)            # pas irrationnel : aucun nœud sur une racine
    assert np.count_nonzero(np.diff(np.sign(fn(xs) - y))) == 3          # trois traversées exactement
    u, v = fn(a), fn(b)                                   # -0.4336 et 3.1504
    S = Schema(520, 340, 'Graphe de f sur [a, b], niveau y, ensemble A et c = sup A')
    R = Repere(-0.35, 4.6, -1.3, 3.3, 40, 22, 450, 280)
    base = -1.05                                          # axe des abscisses, sous le minimum u de f
    # axe horizontal et repères
    S.fleche(R(-0.3, base), R(4.55, base), 'g')
    S.ligne(R(-0.3, y), R(4.45, y), 'b', d=True)
    S.texte(R(4.45, y) + [8, 0], 'y', 'b', ancre='start')
    # A en rouge sur l'axe
    for (p, q) in [(a, r1), (r2, r3)]:
        S.ligne(R(p, base), R(q, base), 'r', l=5)
    S.texte(R((a + r1) / 2, base) + [0, 18], 'A', 'r')
    S.texte(R((r2 + r3) / 2, base) + [0, 18], 'A', 'r')
    # graphe
    R.graphe(S, fn, a, b, 't', l=2)
    # points a, b, c
    for x, nom in [(a, 'a'), (b, 'b')]:
        S.ligne(R(x, base), R(x, fn(x)), 'g', d=True)
        S.point(R(x, fn(x)))
        S.texte(R(x, base) + [0, 18], nom)
    S.texte(R(a, u) + [-10, 0], 'u', ancre='end')
    S.texte(R(b, v) + [10, 0], 'v', ancre='start')
    S.ligne(R(r3, base), R(r3, y), 'r', d=True)
    S.point(R(r3, y), 'r', r=4.2)
    S.point(R(r3, base), 'r', r=4.2)
    S.texte(R(r3, base) + [0, 20], 'c = `sup` A', 'r')
    S.texte(R(2.6, fn(2.6)) + [12, 14], 'f', ancre='start')
    return S

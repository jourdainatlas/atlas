  // dates de l'introduction du cours : Boole et De Morgan 1847, Frege 1879, Peano 1889, Russell 1902, Zermelo 1908
  const histoire = { lettre: N(2, 0.5), frise: N(3, 2), dates: [0, 1, 2, 3, 4].map((i) => ev(L(4, 0) + i * 0.7)), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  const lois = { tab: N(6, 0.5), egal: Cl(8, 2), lois: [N(10, 0.5), N(11, 0), N(12, 0), Cl(13, 0)], leg: G([6, 0.2, 8, 1.6], [8, 2, 9, 3.6], [10, 0.2, 11, 3.6], [12, 0, 13, 3.6]) };
  // P(x, y) : « y > x » (cours). Le point x va de −3 à 0, puis à 2 : le chien se place en x + 1. Enfin x passe à 4,5 et dépasse le chien resté en 3.
  const quantif = { neg: N(14, 0.5), neg2: Cl(15, 1), axe: N(15, 2.5), bond: L(15, 3), chute: [L(16, 0.4), L(16, 1.6)], x1: P(17, 0), y1: [L(17, 0.8), L(17, 2.3)], x2: P(18, 0), y2: [L(18, 0.8), L(18, 2.3)], vrai: Cl(18, 2.6), x3: P(19, 2), faux: N(20, 0.5), sortie: L(21, 2.2),
    leg: G([14, 0.2, 15, 2.2], [15, 2.6, 18, 2.2], [18, 2.6, 19, 1.6], [19, 2, 21, 3.6]) };
  const cas = { enonce: N(22, 0.5), fig: N(22, 2), c: [N(23, 1), N(23, 3), N(24, 1)], concl: Cl(25, 0), leg: G([22, 0.2, 23, 0.6], [23, 1, 24, 3.6], [25, 0, 25, 3.5]) };
  const analyse = { th: N(26, 0.5), an: [N(27, 2), N(28, 1), Cl(29, 0)], syn: [N(30, 0.5), Cl(31, 0.5)], fig: N(32, 0.3), gh: N(32, 2), leg: G([26, 0.2, 27, 1.6], [27, 2, 29, 3.6], [30, 0.2, 31, 3.6], [32, 0.2, 33, 3.5]) };
  const ensembles = { eg: N(34, 0.5), i1: N(35, 0), i2: [N(35, 2.5), Cl(36, 2)], venn: N(38, 0.3), huit: Cl(39, 0), part: N(40, 0.5), russ: N(42, 0.5), r2: P(43, 0.5), zer: N(44, 0.5), dico: N(45, 0),
    leg: G([34, 0.2, 35, 3.6], [36, 0, 37, 3.6], [38, 0.2, 39, 3.6], [40, 0.2, 41, 3.6], [42, 0.2, 43, 3.6], [44, 0.2, 45, 3.5]) };

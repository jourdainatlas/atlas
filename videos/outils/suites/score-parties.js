  // 1. les dominos du cours : le chien pousse le premier
  const recurrence = { dominos: N(2, 0.3), bond: L(2, 0.6), chute: [L(2, 2.0), L(2, 3.2)], pousse: P(3, 1.5), init: N(4, 0.6), hered: Cl(4, 2.6), leg: G([2, 0.3, 3, 3.6], [4, 0.2, 5, 3.5]) };
  // 2. l'exemple du cours : 1 + 2 + … + n = n(n + 1)/2 ; puis l'hérédité sans initialisation (3 divise 4ⁿ + 1)
  const rediger = { enonce: N(6, 0.5), init: [N(7, 2), Cl(8, 0.5)], hered: [N(9, 0), N(10, 0), Cl(10, 2.5)], concl: N(11, 2), piege: [N(12, 0.5), N(12, 2.5), P(13, 1.5)],
    leg: G([6, 0.2, 7, 1.4], [7, 2, 8, 3.6], [9, 0, 11, 1.4], [11, 2, 11, 3.8], [12, 0.2, 13, 3.6]) };
  // 3. u₀ = 1, uₙ₊₁ = uₙ/2 + 3 (cours) : uₙ = 6 − 5/2ⁿ ; bande de demi-largeur 0,5 (rang 4) puis 0,1 (rang 6)
  const limite = { fig: N(14, 0.3), def: N(14, 2), bond: L(14, 1), chute: [L(14, 2.4), L(15, 1.2)], marche: [L(15, 2), L(17, 1)], bande: [N(17, 2), P(19, 0)], rang: [Cl(18, 1), Cl(19, 2.5)], sortie: L(21, 2.2),
    leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 1.4], [17, 2, 18, 3.7], [19, 0, 21, 3.6]) };
  const operations = { ex: N(22, 0.5), fi: P(23, 0), fact: N(23, 2), res: Cl(24, 2.5), leg: G([22, 0.2, 23, 1.6], [23, 2, 25, 3.5]) };
  const theoremes = { gend: N(26, 0.5), fig: N(27, 0), enc: N(27, 2.5), lim: Cl(29, 0), mono: N(30, 0.5), fig2: N(31, 0.5), ell: N(32, 0.5), six: Cl(33, 0),
    leg: G([26, 0.2, 27, 2.1], [27, 2.5, 29, 3.6], [30, 0.2, 31, 3.9], [32, 0.2, 33, 3.5]) };
  const geometriques = { cas: [N(34, 0.5), N(35, 2), N(37, 0), N(38, 2)], prop: N(40, 0.5), bern: N(42, 0), ex: N(43, 2), res: Cl(44, 2), leg: G([34, 0.2, 35, 1.6], [35, 2, 36, 3.6], [37, 0, 38, 1.6], [38, 2, 39, 3.6], [40, 0.2, 41, 3.6], [42, 0, 43, 1.6], [43, 2, 45, 3.5]) };

  const propositions = { def: N(2, 0.5), ex: [N(3, 0), N(3, 1.5)], tab: N(4, 0.3), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  // exemple du cours : « n est un multiple de 4 ⇒ n est pair » ; le chien est l'élément x
  const implication = { tab: N(6, 0.5), faux: P(8, 0), fig: N(9, 0), bond: L(9, 0.3), chute: [L(9, 1.7), L(9, 2.9)], suff: Cl(10, 0), marche: [L(10, 2.5), L(11, 2)], nec: Cl(11, 2), sortie: L(12, 0.4), equiv: N(12, 2), cns: N(13, 0.5),
    leg: G([6, 0.2, 7, 3.6], [8, 0, 8, 3.8], [9, 0, 10, 2.2], [10, 2.5, 12, 0.2], [12, 0.6, 13, 3.6]) };
  const raisonner = { contra: N(14, 0.5), cex: [N(15, 2), N(16, 2), Cl(17, 1)], absurde: N(18, 0.5), abs2: N(19, 0.5), contre: N(20, 0.5), cval: Cl(21, 0),
    leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 3.6], [18, 0.2, 19, 3.6], [20, 0.2, 21, 3.6]) };
  const quantif = { d1: N(22, 0.5), d2: N(22, 2.5), ex: N(23, 2), neg: Cl(24, 2), leg: G([22, 0.2, 23, 1.6], [23, 2, 24, 1.6], [24, 2, 25, 3.5]) };
  const inclusion = { ext: N(26, 0.5), comp: N(27, 2), incl: N(28, 2), fig: N(29, 0.5), dbl: N(30, 0.5), vide: N(32, 0.5), symb: N(32, 2.5), leg: G([26, 0.2, 27, 1.6], [27, 2, 28, 1.6], [28, 2, 29, 3.6], [30, 0.2, 31, 3.6], [32, 0.2, 33, 3.5]) };
  const operations = { fig: N(34, 0.3), bond: L(34, 0.8), chute: [L(34, 2.2), L(35, 0.8)], diff: N(35, 1.2), m1: [L(36, 0.5), L(37, 0)], inter: Cl(37, 0), m2: [L(38, 2), L(39, 2)], union: Cl(39, 2.6), sortie: L(40, 2.4),
    morgan: N(42, 0.5), mfig: N(42, 2), parties: N(44, 0.5), deux: Cl(45, 0), leg: G([34, 0.2, 35, 3.9], [36, 0.2, 38, 1.6], [38, 2, 39, 2.2], [39, 2.6, 41, 3.6], [42, 0.2, 43, 3.6], [44, 0.2, 45, 3.5]) };

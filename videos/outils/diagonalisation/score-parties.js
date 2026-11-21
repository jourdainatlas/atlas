  // Tout vient du cours mp-02 : la matrice (2 1 ; 1 2) de l'introduction, la matrice A de taille 3 (χ = (X − 1)²(X − 4)), la matrice C
  // (χ = (X − 2)³, non diagonalisable), le quart de tour R, la suite de Fibonacci (f₁₀ = 55), la matrice J nilpotente d'indice 3.
  // le chien est le vecteur unitaire x : il parcourt l'arc de 20° à 160°, avec un arrêt à 45° (Ax = 3x) et à 135° (Ax = x)
  const direction = { fig: N(2, 0.3), A: N(2, 1.5), bond: L(3, 0), chute: [L(3, 1.4), L(3, 2.6)], marche: [L(4, 0), L(8, 0)], e3: Cl(4, 3.4), e1: Cl(7, 0.2), sortie: L(8, 1.6), dir: N(8, 2), mot: N(9, 1),
    leg: G([2, 0.3, 3, 3.6], [4, 0, 4, 3.2], [4, 3.4, 5, 2.4], [5, 2.6, 6, 3.8], [7, 0.2, 8, 1.6], [8, 2, 9, 3.5]) };
  const propres = { def: N(10, 0.5), E: N(11, 1), sp: N(12, 0), th: Cl(12, 2), card: N(13, 1.5), leg: G([10, 0.2, 11, 0.6], [11, 1, 12, 1.6], [12, 2, 13, 3.5]) };
  const caract = { def: N(14, 0.5), th: Cl(15, 2), dev: N(16, 2.5), d2: N(18, 0.5), ex: N(19, 0.5), fac: Cl(20, 0), mult: N(20, 2.5), ab: N(21, 1.5),
    leg: G([14, 0.2, 15, 1.6], [15, 2, 16, 2.1], [16, 2.5, 17, 3.6], [18, 0.2, 18, 3.8], [19, 0.2, 20, 2.1], [20, 2.5, 21, 3.6]) };
  const diago = { def: N(22, 0.5), th: Cl(23, 1), cor: N(24, 1.5), A: N(25, 0.3), chi: N(25, 2.5), E1: N(26, 2), E4: N(27, 2), P: N(28, 2), ctrl: Cl(29, 1.5),
    leg: G([22, 0.2, 23, 0.6], [23, 1, 24, 3.6], [25, 0.2, 26, 1.6], [26, 2, 28, 1.6], [28, 2, 29, 3.5]) };
  const issues = { C: N(30, 0.5), chi: N(31, 0), E2: N(31, 2.5), non: Cl(32, 2), R: N(34, 0.5), chiR: N(35, 0), nonR: N(35, 2.5), surC: Cl(36, 2), err: N(37, 1),
    leg: G([30, 0.2, 31, 2.1], [31, 2.5, 33, 3.6], [34, 0.2, 35, 2.1], [35, 2.5, 36, 3.8], [37, 1, 37, 3.6]) };
  // le chien va de 0 à 55 sur la droite graduée ; les nombres de Fibonacci s'allument à son passage
  const puissances = { prop: N(38, 0.5), F: N(39, 1), chi: N(40, 0), axe: N(40, 3), bond: L(41, 0), chute: [L(41, 1.4), L(41, 2.6)], marche: [L(42, 0), L(44, 0)], binet: N(42, 0), f10: Cl(44, 0.2), sortie: L(44, 1),
    leg: G([38, 0.2, 38, 3.8], [39, 1, 40, 2.6], [40, 3, 41, 3.8], [42, 0, 43, 3.8], [44, 0.2, 45, 3.5]) };
  const trigo = { def: N(46, 0.5), th: Cl(47, 1), surC: N(48, 0), tr: N(48, 2), ex: N(49, 1.5), nil: N(50, 0.5), th7: Cl(51, 1), J: N(52, 2), ch: [N(53, 0), N(53, 1), N(53, 2)],
    leg: G([46, 0.2, 47, 0.6], [47, 1, 48, 1.6], [48, 2, 49, 3.6], [50, 0.2, 51, 0.6], [51, 1, 52, 1.6], [52, 2, 53, 3.5]) };

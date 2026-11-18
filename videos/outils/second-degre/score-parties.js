  // Exemples du cours : f(x) = 3x² − 2x − 5 (Δ = 64, α = 1/3, β = −16/3, racines −1 et 5/3) et 2x² − x − 1 (racines 1 et −1/2).
  const trinome = { def: N(2, 0.5), haut: N(3, 0.5), bas: N(4, 0), sommet: N(5, 0), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  const canonique = { th: N(6, 0.5), f: N(7, 2), delta: Cl(8, 1), alpha: N(9, 0), beta: N(9, 2), forme: Cl(10, 1.5), fig: N(11, 0), bond: L(11, 0.5), chute: [L(11, 1.9), L(11, 3.1)], marche: [L(12, 0), L(13, 0)], min: Cl(13, 0.3),
    leg: G([6, 0.2, 7, 1.4], [7, 2, 8, 3.6], [9, 0, 10, 3.6], [11, 0, 11, 3.8], [12, 0, 13, 2.4]) };
  const equation = { cas: [N(14, 0.5), N(15, 0.5), N(16, 0.5)], formules: [N(15, 1.5), N(16, 1.5)], ex: N(18, 0.5), x1: [N(19, 0), Cl(19, 2)], x2: [N(20, 0), Cl(20, 2)], fig: N(21, 0),
    leg: G([14, 0.2, 15, 0.2], [15, 0.5, 16, 0.2], [16, 0.5, 17, 3.6], [18, 0.2, 20, 3.6], [21, 0, 21, 3.6]) };
  const somme = { prop: N(22, 0.5), ex: N(23, 2), evid: N(24, 0.5), autre: Cl(25, 0), leg: G([22, 0.2, 23, 1.4], [23, 2, 25, 3.5]) };
  const facto = { prop: N(26, 0.5), ex1: Cl(28, 0), ex2: Cl(29, 2), nul: N(30, 2), neg: N(32, 0), leg: G([26, 0.2, 27, 3.6], [28, 0, 29, 3.9], [30, 0.2, 31, 3.6], [32, 0, 33, 3.5]) };
  // le chien va de x = −1,4 à x = 1,9 sur l'axe ; il franchit les racines −1/2 et 1
  const signe = { fig: N(34, 0.3), bond: L(34, 1), chute: [L(34, 2.4), L(35, 1.2)], marche: [L(36, 0), L(39, 0)], prop: N(39, 2), sortie: L(41, 2.2), tab: N(42, 0.5), ineq: N(43, 2), sol: Cl(44, 2),
    leg: G([34, 0.2, 35, 3.6], [36, 0, 39, 1.6], [39, 2, 41, 3.6], [42, 0.2, 43, 1.6], [43, 2, 45, 3.5]) };

  // ---------- 1. fractions : A = 3/4 + 5/6 et B = 14/21 × 9/8 (cours) ----------
  const fractions = { a: [N(2, 0.5), N(2, 2.2), Cl(3, 1)], b: [N(4, 0), N(4, 1.7), Cl(5, 0.5)], leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  // ---------- 2. puissances : règles, exemple du cours, deux pièges, écriture scientifique ----------
  const puissances = { def: N(6, 0.5), regles: [N(7, 2), N(8, 0), N(8, 2)], ex: [N(9, 2), N(10, 0.5), Cl(11, 0)], piege: [N(12, 0.5), P(12, 2)], sci: [N(13, 0.5), Cl(13, 2)],
    leg: G([6, 0.2, 7, 1.4], [7, 2, 9, 1.4], [9, 2, 11, 3.6], [12, 0.2, 12, 3.8], [13, 0.2, 13, 3.6]) };
  // ---------- 3. racines carrées ; le chien parcourt la diagonale du carré de côté 1 ----------
  const racines = { def: N(14, 0.5), prop: N(15, 2), contre: [N(16, 2), P(17, 1)], carre: N(18, 0.2), bond: L(18, 0.3), chute: [L(18, 1.7), L(18, 2.9)], marche: [L(19, 0), L(20, 0)], diag: Cl(20, 0), simp: [N(20, 2), Cl(21, 0.8)],
    leg: G([14, 0.2, 15, 1.4], [15, 2, 16, 1.4], [16, 2, 17, 3.6], [18, 0.2, 20, 1.4], [20, 2, 21, 2.4]) };
  // ---------- 4. les cinq ensembles emboîtés ----------
  const ensembles = { boites: [0, 1, 2, 3, 4].map((i) => ev(L(22, 0.5) + i * 0.6)), incl: N(24, 0), ex: [N(24, 2), N(25, 0), N(25, 1.5)], leg: G([22, 0.2, 23, 3.6], [24, 0, 25, 3.5]) };
  // ---------- 5. écriture décimale périodique de 1/7, puis l'irrationalité de √2 par l'absurde ----------
  const irrationnel = { per: [N(26, 0.5), Cl(27, 1)], enonce: N(28, 0.5), etapes: [N(29, 0), N(29, 2.5), N(30, 1), N(30, 3), P(31, 1.5)], absurde: Cl(32, 1.5),
    leg: G([26, 0.2, 27, 3.6], [28, 0.2, 28, 3.7], [29, 0, 31, 1.2], [31, 1.5, 33, 3.5]) };
  // ---------- 6. intervalles : notations, le chien dans [1 ; 4], puis I = [−1 ; 3] et J = ]1 ; 5] du cours ----------
  const intervalles = { tab: [N(34, 0.5), N(35, 0.5), N(36, 0.5), N(37, 0)], axe: N(38, 0.2), bond: L(38, 0.5), chute: [L(38, 1.9), L(39, 0.7)], marche: [L(39, 1.5), L(40, 2.5)], borne: Cl(40, 2.5), sortie: L(41, 2.2),
    I: N(42, 0.5), J: N(42, 2), inter: Cl(43, 2), union: Cl(44, 2.5), leg: G([34, 0.2, 35, 3.6], [36, 0, 37, 3.6], [38, 0.2, 41, 3.6], [42, 0.2, 43, 1.4], [43, 2, 44, 2.2], [44, 2.5, 45, 3.5]) };

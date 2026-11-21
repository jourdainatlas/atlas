  // Exemples du cours ap-02 : x ↦ x² de ℝ dans ℝ ou dans ℝ₊ ; f : x ↦ x + 1 et g : x ↦ x² ; les trois versions du sinus et arcsinus ;
  // f(x) = x², A = [−1 ; 2], B = [1 ; 4], B′ = [−4 ; −1]. Propre à la vidéo : la droite y = 1/2 (le cours prend y = 1 et y = 2).
  const appli = { def: N(2, 0.5), oui: N(3, 1), fl: [N(3, 2), N(3, 3), N(4, 0)], non: N(4, 2), d2: N(4, 3), d0: N(5, 1), leg: G([2, 0.3, 3, 0.6], [3, 1, 4, 1.6], [4, 2, 5, 3.5]) };
  const composer = { eg: N(6, 0.5), a1: N(7, 1), a2: N(7, 3), diff: Cl(8, 1), id: N(9, 0), dia: N(10, 0.3), f: N(10, 2), g: N(11, 0), gf: Cl(11, 2), ex: [N(12, 1), N(12, 3)], asso: N(13, 1),
    leg: G([6, 0.2, 7, 0.6], [7, 1, 8, 3.6], [9, 0, 9, 3.8], [10, 0.2, 11, 3.8], [12, 0.5, 13, 0.6], [13, 1, 13, 3.6]) };
  const inj = { d: [N(14, 0.5), N(15, 2), N(17, 0)], m: [N(19, 0.3), N(20, 2)], leg: G([14, 0.2, 15, 1.6], [15, 2, 16, 3.6], [17, 0, 18, 3.6], [19, 0.2, 20, 1.6], [20, 2, 21, 3.6]) };
  // le chien parcourt la droite y = 1/2 de x = −4,3 à x = 9,5 : elle coupe cinq fois la courbe
  const sinus = { fig: N(22, 0.3), bond: L(22, 1), chute: [L(22, 2.4), L(23, 0.4)], marche: [L(23, 0.8), L(25, 0)], ninj: N(25, 0.3), sortie: L(25, 0.8), deux: N(26, 0.5), b: N(27, 1.5), c: N(28, 3),
    leg: G([22, 0.2, 23, 0.4], [23, 0.8, 25, 3.6], [26, 0.2, 27, 1.1], [27, 1.5, 28, 2.6], [28, 3, 29, 3.6]) };
  const reciproque = { def: N(30, 0.5), eq: N(31, 0.5), prop: N(32, 0), arc: Cl(33, 0), leg: G([30, 0.2, 31, 3.6], [32, 0, 32, 3.8], [33, 0, 33, 3.5]) };
  // le chien est x : il parcourt A = [−1 ; 2] sur l'axe des abscisses, son image x² décrit [0 ; 4] sur l'axe des ordonnées
  const images = { dir: N(34, 0.5), rec: N(35, 2), rem: N(37, 0), fig: N(38, 0.3), A: N(38, 2), bond: L(38, 2.5), chute: [L(39, 0), L(39, 1.2)], marche: [L(39, 1.6), L(41, 1)], fA: Cl(41, 1.5), sortie: L(41, 2), B: N(42, 2), fB: Cl(43, 2), vide: N(45, 0),
    leg: G([34, 0.2, 35, 1.6], [35, 2, 36, 3.6], [37, 0, 37, 3.6], [38, 0.2, 39, 1.2], [39, 1.6, 41, 1.1], [41, 1.5, 42, 1.6], [42, 2, 44, 3.6], [45, 0, 45, 3.5]) };

// PARTITION — « Calcul littéral », Seconde, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
// Source unique des instants, pour la musique (song.js) comme pour l'image (film.js).
// Tempo entendu : 60 à la noire. Une mesure = 4 s ; L(mesure, temps) donne l'instant en secondes.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock } = MU;

  const FPS = 30;
  const STYLE = 'flat';
  const FORMAT = U.pickFormat('16:9');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  // Un intertitre d'une mesure entière (quatre secondes) précède chaque partie et le bilan : toute la partition est
  // décalée d'autant à partir de la mesure où la partie commence. L(b0) est l'instant où le contenu de la partie
  // démarre ; l'intertitre occupe [L(b0) − INTER, L(b0)]. La musique lit la même horloge : elle tient pendant cette
  // mesure l'accord de dominante qui termine la phrase précédente, avant de repartir sur la suivante.
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 22, 26, 34, 46];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 46, FIN = 50;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'expression', nom: "Une expression littérale", b0: 2, b1: 6 },
    { id: 'developper', nom: "Développer", b0: 6, b1: 14 },
    { id: 'identites', nom: "Les identités remarquables", b0: 14, b1: 22 },
    { id: 'commun', nom: "Factoriser : le facteur commun", b0: 22, b1: 26 },
    { id: 'identfact', nom: "Factoriser : les identités", b0: 26, b1: 34 },
    { id: 'rationnelles', nom: "Les expressions rationnelles", b0: 34, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };
  const N = (m, b) => ev(L(m, b)), P = (m, b) => ev(L(m, b), 'pas'), Cl = (m, b) => ev(L(m, b), 'cloche');   // raccourcis
  const G = (...l) => l.map(([a, b, c, d]) => [L(a, b), L(c, d)]);                                          // fenêtres des légendes

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // Exemples du cours s-02 : A(x) = 3x² − 5x + 2 ; (x + 4)(3x − 2) ; (3x − 2)² ; 97 × 103 ; Q(x) = (x + 5)/(x² − 9) ; R et S.
  const expression = { def: N(2, 0.5), v4: N(3, 1), vm: Cl(4, 0), nat: [N(5, 0), N(5, 1.5)], leg: G([2, 0.3, 3, 0.6], [3, 1, 4, 3.6], [5, 0, 5, 3.5]) };
  const developper = { prop: N(6, 0.5), rect: [N(7, 1), N(7, 2.5), N(8, 0), N(8, 1.5)], aire: Cl(9, 0), A: N(10, 0.5), B1: N(11, 0.5), B2: Cl(12, 0), piege: N(12, 2.5), faux: N(13, 1),
    leg: G([6, 0.2, 7, 0.6], [7, 1, 9, 3.6], [10, 0.2, 10, 3.6], [11, 0.2, 12, 2.1], [12, 2.5, 13, 3.5]) };
  // le chien arpente le côté du haut du carré, de 0 à a + b
  const identites = { carre: N(14, 0.3), bond: L(14, 0.5), chute: [L(14, 1.9), L(15, 0.6)], marche: [L(15, 1), L(16, 2.5)], aires: [N(15, 2), N(16, 0), N(16, 2.5)], f1: Cl(17, 0), sortie: L(17, 1.2), tab: N(18, 0.5), E: [N(19, 2), Cl(20, 1)], att: N(20, 2.5), mental: [N(21, 0.5), Cl(21, 2.5)],
    leg: G([14, 0.2, 15, 0.6], [15, 1, 16, 3.6], [17, 0, 17, 3.6], [18, 0.2, 19, 1.6], [19, 2, 20, 3.8], [21, 0.2, 21, 3.6]) };
  const commun = { def: N(22, 0.5), A: N(23, 0.5), C: N(24, 0), D: [N(25, 0), Cl(25, 2)], leg: G([22, 0.2, 23, 3.6], [24, 0, 24, 3.6], [25, 0, 25, 3.5]) };
  const identfact = { tab: N(26, 0.5), E: N(27, 0.5), G: N(28, 0), non: N(28, 2.5), I: N(29, 1.5), prop: N(30, 0.5), e1: [N(31, 0.5), Cl(32, 0)], e2: [N(32, 2), Cl(33, 1)],
    leg: G([26, 0.2, 26, 3.8], [27, 0.2, 28, 2.1], [28, 2.5, 29, 3.8], [30, 0.2, 31, 0.2], [31, 0.5, 33, 3.5]) };
  // le chien va de −5 à 5 sur la droite graduée et saute par-dessus −3 et 3
  const rationnelles = { def: N(34, 0.5), Q: N(35, 0), zero: Cl(35, 2.5), axe: N(35, 3), bond: L(35, 3), chute: [L(36, 0.8), L(36, 2)], marche: [L(36, 2.4), L(38, 1.4)], sortie: L(38, 2), R: N(39, 0.5), fact: N(40, 0.5), res: Cl(41, 1), err: N(42, 0), test: N(42, 2), S: N(43, 0.5), dc: N(44, 0), som: Cl(45, 0),
    leg: G([34, 0.2, 35, 2.1], [35, 2.5, 36, 2], [36, 2.4, 38, 3.6], [39, 0.2, 40, 0.2], [40, 0.5, 41, 3.6], [42, 0, 42, 3.8], [43, 0.2, 43, 3.6], [44, 0, 45, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, expression, developper, identites, commun, identfact, rationnelles, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

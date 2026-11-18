// PARTITION — « Nombres et calculs », Seconde, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'fractions', nom: "Les fractions", b0: 2, b1: 6 },
    { id: 'puissances', nom: "Les puissances", b0: 6, b1: 14 },
    { id: 'racines', nom: "Les racines carrées", b0: 14, b1: 22 },
    { id: 'ensembles', nom: "Les ensembles de nombres", b0: 22, b1: 26 },
    { id: 'irrationnel', nom: "Rationnel ou irrationnel ?", b0: 26, b1: 34 },
    { id: 'intervalles', nom: "Les intervalles", b0: 34, b1: 46 },
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

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, fractions, puissances, racines, ensembles, irrationnel, intervalles, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

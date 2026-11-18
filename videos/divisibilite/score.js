// PARTITION — « Divisibilité et primalité », Terminale Maths expertes, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'divise', nom: "Diviser, être un multiple", b0: 2, b1: 6 },
    { id: 'euclide', nom: "La division euclidienne", b0: 6, b1: 14 },
    { id: 'crible', nom: "Les nombres premiers", b0: 14, b1: 22 },
    { id: 'infinite', nom: "Une infinité de nombres premiers", b0: 22, b1: 26 },
    { id: 'tfa', nom: "La décomposition en facteurs premiers", b0: 26, b1: 34 },
    { id: 'diviseurs', nom: "Compter les diviseurs", b0: 34, b1: 46 },
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

  const divise = { def: N(2, 0.5), ex1: N(3, 1), ex2: N(4, 0), regle: N(5, 0), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  // 47 = 5 × 9 + 2 et −47 = 5 × (−10) + 3 : exemples propres à la vidéo ; le chien fait neuf bonds de 5, puis deux pas
  const euclide = { th: N(6, 0.5), axe: N(7, 1), bond: L(7, 1.2), chute: [L(7, 2.6), L(7, 3.8)], sauts: [L(8, 0.5), L(10, 1.5)], reste: [L(10, 2.2), L(11, 0)], egal: Cl(11, 0.5), sortie: L(12, 0.3), neg: N(12, 2), negr: Cl(13, 1),
    leg: G([6, 0.2, 7, 3.6], [8, 0, 10, 1.6], [10, 2, 11, 3.9], [12, 0.4, 13, 3.6]) };
  for (let i = 1; i <= 9; i++) ev(euclide.sauts[0] + i * (euclide.sauts[1] - euclide.sauts[0]) / 9, 'pas');
  const crible = { grille: N(14, 0.3), def: N(14, 2), raye: [P(15, 2), P(16, 2), P(17, 2), P(18, 2)], premiers: Cl(19, 2), racine: N(20, 2), leg: G([14, 0.2, 15, 1.6], [15, 2, 19, 1.6], [19, 2, 20, 1.6], [20, 2, 21, 3.6]) };
  const infinite = { prop: N(22, 0.5), n1: N(23, 0), r: N(24, 0), n2: Cl(25, 0), leg: G([22, 0.2, 23, 3.6], [24, 0, 25, 3.5]) };
  const tfa = { lemme: N(26, 0.5), th: N(28, 0), arbre: [N(30, 0), N(30, 3), N(31, 2)], dec: Cl(32, 2), leg: G([26, 0.2, 27, 3.6], [28, 0, 29, 3.6], [30, 0, 31, 3.9], [32, 0.2, 33, 3.5]) };
  const diviseurs = { t1: N(34, 0.5), t2: N(37, 0), compte: Cl(39, 0), gen: N(40, 2), frac: [N(42, 0.5), N(43, 2), Cl(44, 2)], leg: G([34, 0.2, 36, 3.6], [37, 0, 38, 3.6], [39, 0, 40, 1.6], [40, 2, 41, 3.6], [42, 0.2, 45, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, divise, euclide, crible, infinite, tfa, diviseurs, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

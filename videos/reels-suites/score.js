// PARTITION — « Nombres réels et suites numériques », MPSI, chapitre 7 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 18, 26, 34, 38, 46];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const FIN = 50;                                         // mesure où commence l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 215 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'trou', nom: 'Un théorème sans démonstration', b0: 2, b1: 6 },
    { id: 'sup', nom: 'La borne supérieure', b0: 6, b1: 14 },
    { id: 'conseq', nom: 'Premières conséquences', b0: 14, b1: 18 },
    { id: 'limite', nom: 'Limite d’une suite', b0: 18, b1: 26 },
    { id: 'monotone', nom: 'Le théorème de la limite monotone', b0: 26, b1: 34 },
    { id: 'adjacentes', nom: 'Suites adjacentes', b0: 34, b1: 38 },
    { id: 'bw', nom: 'Le théorème de Bolzano-Weierstrass', b0: 38, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), 46]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(46), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat),
  // 'titre' (un intertitre commence), 'arbre' (un arbre est planté)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(46) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. Dedekind, 1858 ; puis le trou des rationnels : 1 ; 1,4 ; 1,41 ; 1,414 ----------
  const trou = {
    enonce: ev(L(2, 1)), question: ev(L(3, 0), 'pas'),
    droite: [L(4, 0.2), L(4, 1)], points: [0, 1, 2, 3].map((i) => ev(L(4, 1) + i * 0.5, 'pas')), majorant: ev(L(5, 0)), racine: ev(L(5, 1.5), 'cloche'),
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)]],
  };

  // ---------- 2. la borne supérieure, sur A = [0 ; 1[ ----------
  const sup = {
    droite: [L(6, 0.3), L(6, 1.2)], A: ev(L(6, 1.5)), M: ev(L(7, 0)), majorants: ev(L(7, 2)), def: ev(L(8, 0)), sup: ev(L(8, 2), 'cloche'), piege: ev(L(9, 1)),
    car: [ev(L(10, 0)), ev(L(10, 2))], eps: [L(10, 2), L(11, 3)],
    axiome: ev(L(12, 0), 'cloche'), faux: ev(L(13, 0)),
    leg: [[L(6, 0.3), L(7, 3.6)], [L(8), L(9, 3.6)], [L(10), L(11, 3.6)], [L(12), L(13, 3.6)]],
  };

  // ---------- 3. Archimède, puis la densité ----------
  const conseq = {
    arch: ev(L(14, 0.5)), sauts: [1, 2, 3, 4, 5, 6, 7].map((k) => ev(L(14, 1.5) + (k - 1) * 0.25, 'pas')), preuve: [ev(L(15, 0)), ev(L(15, 1.3)), ev(L(15, 2.6))],
    dens: ev(L(16, 0.5)), centiemes: ev(L(16, 2), 'pas'), d: ev(L(17, 0), 'cloche'), suite: ev(L(17, 1.5)),
    leg: [[L(14, 0.2), L(15, 3.6)], [L(16), L(17, 3.6)]],
  };

  // ---------- 4. la limite : u_n = 2 + (−1)^n · 3/(n + 2), ℓ = 2 ; ε = 0,4 puis 0,2 puis 0,1, soit N = 6, 13, 28 ----------
  const limite = {
    points: [L(18, 0.5), L(19, 1)], ell: ev(L(19, 2)), def: ev(L(20, 0)), bande: ev(L(20, 1)), N: ev(L(20, 3), 'cloche'),
    serre: [[L(22, 0), L(22, 1.5), 0.4, 0.2], [L(23, 0), L(23, 1.5), 0.2, 0.1]], rangs: [ev(L(22, 1.6), 'pas'), ev(L(23, 1.6), 'pas')], unicite: ev(L(25, 0)),
    leg: [[L(18, 0.2), L(19, 3.6)], [L(20), L(21, 3.6)], [L(22), L(23, 3.6)], [L(24), L(25, 3.6)]],
  };

  // ---------- 5. la limite monotone : u_n = 1 + 1/4 + … + 1/n², majorée par 2 ; ε = 0,12, N = 8 ----------
  const monotone = {
    points: [L(26, 0.5), L(27, 0)], majorant: ev(L(27, 2)), th: ev(L(28, 0), 'cloche'),
    p1: ev(L(29, 0)), sup: ev(L(29, 2)), p2: ev(L(30, 0)), bande: ev(L(30, 1)), uN: ev(L(30, 3), 'pas'), p3: ev(L(31, 0)), suivants: ev(L(31, 2)), formule: ev(L(32, 0), 'cloche'), note: L(33, 0),
    leg: [[L(26, 0.2), L(27, 3.6)], [L(28), L(29, 3.6)], [L(30), L(31, 3.6)], [L(32), L(33, 3.6)]],
  };

  // ---------- 6. suites adjacentes : u_n = 1/0! + … + 1/n!, v_n = u_n + 1/(n·n!) ----------
  const adjacentes = {
    suites: ev(L(34, 0.3)), rangs: [1, 2, 3, 4, 5].map((n) => ev(L(34, 1) + (n - 1) * 0.5, 'pas')), def: ev(L(35, 0)), th: ev(L(36, 0), 'cloche'), ell: ev(L(36, 2)), note: ev(L(37, 0)),
    leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(37, 3.6)]],
  };

  // ---------- 7. Bolzano-Weierstrass : u_n = sin n, extraction u_0, u_4, u_5, u_11, u_17 (figure du cours) ----------
  const PHI = [0, 4, 5, 11, 17];
  const bw = {
    PHI, jetons: L(38, 0.3), choisis: PHI.map((p, j) => ev(L(38, 2.5) + j * 0.4, 'pas')), th: ev(L(40, 0), 'cloche'), droite: ev(L(40, 2)),
    etapes: [ev(L(41, 0)), ev(L(42, 0)), ev(L(43, 0)), ev(L(44, 0)), ev(L(45, 0))],
    leg: [[L(38, 0.2), L(39, 3.6)], [L(40), L(41, 3.6)], [L(42), L(43, 3.6)], [L(44), L(45, 3.6)]],
  };

  const bilan = { noeuds: [ev(L(46, 0.5), 'cloche'), ev(L(46, 2)), ev(L(47, 0)), ev(L(47, 2)), ev(L(48, 0)), ev(L(48, 2)), ev(L(49, 0))], leg: [[L(49, 1), L(49, 3.8)]] };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, trou, sup, conseq, limite, monotone, adjacentes, bw, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

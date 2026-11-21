// PARTITION — « Structures algébriques usuelles », MP, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 22, 26, 34, 50];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 50, FIN = 54;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'sunzi', nom: "Un problème de Sunzi", b0: 2, b1: 6 },
    { id: 'znz', nom: "Le groupe ℤ/nℤ et ses générateurs", b0: 6, b1: 14 },
    { id: 'ordre', nom: "L’ordre d’un élément", b0: 14, b1: 22 },
    { id: 'ideaux', nom: "Les idéaux de ℤ", b0: 22, b1: 26 },
    { id: 'inversibles', nom: "Les inversibles de ℤ/nℤ", b0: 26, b1: 34 },
    { id: 'chinois', nom: "Le théorème chinois, le théorème d’Euler", b0: 34, b1: 50 },
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

  // le problème de l'introduction du cours : restes 2, 3, 2 dans les divisions par 3, 5, 7 ; réponse 23
  const sunzi = { enonce: N(2, 0.5), restes: [N(3, 0), N(3, 1), N(3, 2)], rep: Cl(4, 0), regle: N(4, 2), calc: Cl(5, 0.5), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  const znz = { horloge: N(6, 0.3), def: N(6, 2), cinq: [L(8, 0), L(10, 0)], v5: Cl(10, 0.3), quatre: [L(11, 0), L(11, 2)], v4: P(11, 2.5), prop: N(12, 0.5), gens: Cl(13, 0.5), leg: G([6, 0.2, 7, 3.6], [8, 0, 10, 3.6], [11, 0, 11, 3.8], [12, 0.2, 13, 3.6]) };
  const ordre = { def: N(14, 0.5), ex: [N(15, 2), N(16, 2), N(17, 2)], th: N(18, 0.5), cor: Cl(19, 2), mono: N(20, 2), leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 3.6], [18, 0.2, 20, 1.6], [20, 2, 21, 3.6]) };
  // 12ℤ + 18ℤ = 6ℤ (PGCD de 12 et 18, exemple du cours) : le chien avance de 18, recule de 12
  const ideaux = { th: N(22, 0.3), bond: L(22, 0.4), chute: [L(22, 1.8), L(22, 3.0)], m1: [L(23, 0.3), L(23, 2.5)], m2: [L(24, 0), L(24, 2.2)], six: Cl(24, 2.4), pgcd: N(25, 0.3), leg: G([22, 0.2, 23, 3.6], [24, 0, 25, 3.5]) };
  const inversibles = { th: N(26, 0.5), corps: N(27, 2), div: [N(28, 2), N(29, 0.5), N(29, 2.5)], rem: [N(30, 2), N(31, 1)], inv: Cl(32, 0.5), ver: Cl(33, 0), leg: G([26, 0.2, 27, 1.6], [27, 2, 28, 1.6], [28, 2, 30, 1.6], [30, 2, 31, 3.6], [32, 0.2, 33, 3.5]) };
  // partie allongée de quatre mesures : l'exemple de la case 8, puis la fabrication de 70, 21 et 15 (produit des deux autres modules, corrigé pour que le reste vaille 1)
  const chinois = { th: N(34, 0.5), grille: [L(35, 2), L(38, 0)], bij: Cl(38, 0.5), ex: N(39, 0.3), dou: N(40, 0.5), a: [N(40, 2), N(42, 0.5), N(43, 0.5)], b: [N(41, 1), N(42, 2), N(43, 2)], sun: N(44, 0.5), e: [N(44, 2), N(45, 0), N(45, 2)], x: Cl(46, 0.5), phi: N(47, 0.5), euler: Cl(48, 0), fermat: N(49, 0),
    leg: G([34, 0.2, 35, 1.6], [35, 2, 38, 3.8], [39, 0.2, 39, 3.6], [40, 0.2, 41, 3.8], [42, 0.2, 43, 3.6], [44, 0.2, 45, 3.8], [46, 0.2, 46, 3.6], [47, 0.2, 49, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, sunzi, znz, ordre, ideaux, inversibles, chinois, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

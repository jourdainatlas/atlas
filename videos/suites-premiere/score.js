// PARTITION — « Notion de suite », Première spécialité, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 22, 30, 38, 50];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 50, FIN = 54;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'suite', nom: "Une suite de nombres", b0: 2, b1: 6 },
    { id: 'definir', nom: "Deux façons de définir une suite", b0: 6, b1: 14 },
    { id: 'variations', nom: "Le sens de variation", b0: 14, b1: 22 },
    { id: 'arith', nom: "Les suites arithmétiques", b0: 22, b1: 30 },
    { id: 'geom', nom: "Les suites géométriques", b0: 30, b1: 38 },
    { id: 'sommes', nom: "Calculer des sommes", b0: 38, b1: 50 },
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

  // Exemples du cours p-02 : les entiers impairs ; v₁ = 2, vₙ₊₁ = vₙ/(vₙ + 3) ; wₙ = √n/(n² + 1) ; uₙ = (3n − 2)/(n + 1) ;
  // u₀ = 3/4 et r = 1/2 (u₂₀ = 43/4) ; v₀ = 1 et q = 5 ; 1 + … + 15 = 120 ; 1 + 4 + … + 31 = 176 ; 1 + 2 + … + 2⁸ = 511 ; 3 + 6 + … + 384 = 765.
  const suite = { def: N(2, 0.5), termes: [N(3, 0), N(3, 1), N(3, 2), N(3, 3), N(4, 0)], u6: Cl(5, 0), leg: G([2, 0.3, 2, 3.8], [3, 0, 4, 3.6], [5, 0, 5, 3.5]) };
  const definir = { rec: N(6, 0.5), uex: N(7, 0.5), ch: [N(7, 2), N(7, 3), N(8, 0), N(8, 1)], v: N(8, 2.5), v2: N(9, 1), v3: Cl(9, 2.5), exp: N(10, 0.5), un: N(11, 0.5), w: N(12, 0), w9: Cl(12, 2.5), rem: N(13, 1),
    leg: G([6, 0.2, 7, 0.1], [7, 0.5, 8, 2.1], [8, 2.5, 9, 3.8], [10, 0.2, 11, 0.2], [11, 0.5, 12, 2.1], [12, 2.5, 13, 3.5]) };
  const variations = { def: N(14, 0.5), fig: N(15, 1), pts: [L(15, 1.5), L(16, 2.5)], meth: N(16, 3), calc: [N(18, 0.5), N(19, 1), Cl(20, 1)], concl: N(20, 1.5), quot: N(21, 0.3),
    leg: G([14, 0.2, 15, 0.6], [15, 1, 16, 2.6], [16, 3, 17, 3.6], [18, 0.2, 19, 0.6], [19, 1, 20, 3.6], [21, 0, 21, 3.6]) };
  // le chien part de u₀ = 3/4 et avance huit fois de 1/2
  const arith = { def: N(22, 0.5), axe: N(22, 2.5), bond: L(23, 0), chute: [L(23, 1.4), L(23, 2.6)], marche: [L(23, 3), L(25, 1)], sortie: L(25, 1.6), meth: N(26, 0.5), prop: N(27, 1), ex: N(28, 2), u20: Cl(29, 1.5),
    leg: G([22, 0.2, 22, 3.8], [23, 0, 25, 3.6], [26, 0.2, 26, 3.8], [27, 1, 28, 1.6], [28, 2, 29, 3.5]) };
  const geom = { def: N(30, 0.5), ch: [N(31, 1), N(31, 2), N(31, 3), N(32, 0), N(32, 1)], meth: N(32, 2.5), prop: N(34, 0.5), tab: N(35, 2),
    leg: G([30, 0.2, 31, 0.6], [31, 1, 32, 2.1], [32, 2.5, 33, 3.6], [34, 0.2, 35, 1.6], [35, 2, 37, 3.5]) };
  // l'escalier 1 + 2 + … + 6 = 21 : le chien le gravit, puis une copie retournée le complète en un rectangle 6 × 7
  const sommes = { esc: N(38, 0.3), bond: L(38, 1), chute: [L(38, 2.4), L(39, 0.6)], marche: [L(39, 1), L(40, 2.5)], sortie: L(41, 0), copie: [L(41, 2), L(42, 0)], deux: Cl(42, 0.5), prop: Cl(42, 2), ex15: N(43, 0.5), ar: N(44, 0), ar2: Cl(45, 0), gprop: N(46, 0.5), g1: N(47, 1), g2: [N(48, 1), Cl(49, 0)],
    leg: G([38, 0.2, 38, 3.8], [39, 1, 40, 3.8], [41, 0.5, 42, 3.8], [43, 0.2, 43, 3.8], [44, 0, 45, 3.6], [46, 0.2, 47, 0.6], [47, 1, 49, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, suite, definir, variations, arith, geom, sommes, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

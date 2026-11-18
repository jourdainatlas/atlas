// PARTITION — « Polynôme du second degré », Première spécialité, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'trinome', nom: "La fonction trinôme", b0: 2, b1: 6 },
    { id: 'canonique', nom: "La forme canonique", b0: 6, b1: 14 },
    { id: 'equation', nom: "L’équation du second degré", b0: 14, b1: 22 },
    { id: 'somme', nom: "Somme et produit des racines", b0: 22, b1: 26 },
    { id: 'facto', nom: "Factoriser un trinôme", b0: 26, b1: 34 },
    { id: 'signe', nom: "Le signe du trinôme", b0: 34, b1: 46 },
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

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, trinome, canonique, equation, somme, facto, signe, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

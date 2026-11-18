// PARTITION — « Géométrie cartésienne », Première spécialité, chapitre 3 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'vecteurs', nom: 'Les vecteurs', b0: 2, b1: 6 },
    { id: 'colineaires', nom: 'Colinéarité et déterminant', b0: 6, b1: 14 },
    { id: 'cartes', nom: 'L’équation cartésienne d’une droite', b0: 14, b1: 22 },
    { id: 'reduite', nom: 'L’équation réduite', b0: 22, b1: 26 },
    { id: 'secantes', nom: 'Deux droites sécantes', b0: 26, b1: 34 },
    { id: 'systeme', nom: 'Résoudre le système', b0: 34, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. les vecteurs : A(1 ; 1), B(4 ; 3) (exemple propre à la vidéo) ; le chien parcourt le vecteur AB ----------
  const vecteurs = {
    axes: ev(L(2, 0.3)), points: ev(L(2, 1.5)), bond: L(2, 0.9), chute: [L(2, 2.3), L(2, 3.3)], atterrit: ev(L(2, 3.3), 'pas'),
    marche: [L(3, 0.5), L(3, 2.5)], fleche: ev(L(3, 2.5), 'cloche'), coord: ev(L(4, 0)), num: ev(L(4, 2), 'cloche'), norme: ev(L(5, 0)), val: ev(L(5, 1.5), 'cloche'),
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(4, 3.7)], [L(5), L(5, 3.5)]],
  };

  // ---------- 2. colinéarité : u(1 ; −3) et v(3 ; −9) du cours ; w(2 ; 1) est propre à la vidéo ----------
  const colineaires = {
    fig: ev(L(6, 0.3)), def: ev(L(6, 1)), u: ev(L(7, 0)), v: ev(L(7, 2)), ex: ev(L(8, 0.5), 'cloche'),
    det: ev(L(10, 0.5)), calc: ev(L(11, 0)), zero: ev(L(11, 2), 'cloche'), prop: ev(L(12, 0.5)), w: ev(L(13, 0.3)), contre: ev(L(13, 1.5), 'pas'),
    leg: [[L(6, 0.2), L(7, 3.6)], [L(8), L(9, 3.6)], [L(10, 0.2), L(11, 3.6)], [L(12, 0.2), L(12, 3.8)], [L(13, 0.2), L(13, 3.6)]],
  };

  // ---------- 3. l'équation cartésienne : d : 2x + 3y − 8 = 0, A(1 ; 2) et B(2 ; 1) du cours ; le chien est le point M ----------
  const cartes = {
    axes: ev(L(14, 0.3)), droite: ev(L(14, 1.2)), prop: ev(L(14, 2.5)), bond: L(15, 1.0), chute: [L(15, 2.4), L(16, 1.4)], atterrit: ev(L(16, 1.4), 'pas'),
    A: ev(L(16, 2.2), 'cloche'), va: [L(17, 0.5), L(18, 2.5)], B: ev(L(19, 0)), Bcalc: ev(L(19, 1.2), 'pas'), dir: ev(L(20, 0.5)), revient: [L(20, 0.5), L(21, 0.8)],
    leg: [[L(14, 0.3), L(15, 3.6)], [L(16), L(18, 3.6)], [L(19), L(19, 3.8)], [L(20, 0.2), L(21, 2.3)]],
  };

  // ---------- 4. l'équation réduite de la même droite : y = −2/3 x + 8/3 ----------
  const reduite = {
    r1: ev(L(22, 0.4)), r2: ev(L(22, 2)), r3: ev(L(23, 0.5), 'cloche'), gen: ev(L(23, 2.5)), p: ev(L(24, 0.5)), pas: ev(L(24, 2.5)), m: ev(L(25, 0.5), 'cloche'),
    leg: [[L(22, 0.2), L(23, 3.6)], [L(24), L(25, 3.5)]],
  };

  // ---------- 5. deux droites sécantes : le système du cours ----------
  const secantes = {
    d1: ev(L(26, 0.4)), d2: ev(L(27, 0.4)), sys: ev(L(28, 0.5)), vect: ev(L(29, 2)), det: ev(L(30, 2)), verdict: ev(L(31, 1.5), 'cloche'), point: ev(L(32, 0.5)),
    leg: [[L(26, 0.2), L(27, 3.6)], [L(28, 0.2), L(29, 1.4)], [L(29, 2), L(31, 3.6)], [L(32, 0.2), L(33, 3.5)]],
  };

  // ---------- 6. les deux méthodes du cours, sur le même système ; solution (1 ; 3) ----------
  const systeme = {
    sys: ev(L(34, 0.3)), sub: [ev(L(35, 0)), ev(L(36, 0)), ev(L(37, 0)), ev(L(37, 2), 'cloche'), ev(L(38, 2), 'cloche')],
    titre2: ev(L(40, 0.5)), comb: [ev(L(41, 0)), ev(L(41, 2)), ev(L(42, 2), 'cloche'), ev(L(43, 2), 'cloche')], sol: ev(L(44, 2), 'cloche'),
    leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(37, 3.6)], [L(38), L(39, 3.6)], [L(40, 0.2), L(41, 3.6)], [L(42), L(43, 3.6)], [L(44), L(45, 3.5)]],
  };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, vecteurs, colineaires, cartes, reduite, secantes, systeme, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

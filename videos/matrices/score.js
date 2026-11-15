// PARTITION — « Les matrices », Terminale Maths expertes, chapitre 3 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 10, 22, 26, 30, 42];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 42, FIN = 46;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 227 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'vocab', nom: 'Un tableau de nombres', b0: 2, b1: 6 },
    { id: 'somme', nom: 'Additionner, multiplier par un réel', b0: 6, b1: 10 },
    { id: 'produit', nom: 'Le produit de deux matrices', b0: 10, b1: 22 },
    { id: 'ordre', nom: 'Un produit où l’ordre compte', b0: 22, b1: 26 },
    { id: 'puissance', nom: 'Les puissances', b0: 26, b1: 30 },
    { id: 'inverse', nom: 'L’inverse d’une matrice', b0: 30, b1: 42 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. le vocabulaire, sur la matrice 2 × 3 du cours ----------
  const vocab = {
    A: ev(L(2, 0.5)), lignes: ev(L(2, 2)), colonnes: ev(L(2, 3)), dim: ev(L(3, 1)), coef: ev(L(4, 0), 'cloche'),
    types: [ev(L(4, 2)), ev(L(5, 0)), ev(L(5, 2))],
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)]],
  };

  // ---------- 2. somme et produit par un réel (exemples du cours) ----------
  const somme = {
    ab: ev(L(6, 0.5)), inter: ev(L(7, 0)), res: ev(L(7, 2), 'cloche'), ka: ev(L(8, 0.5)), kr: ev(L(9, 1), 'cloche'),
    leg: [[L(6, 0.3), L(7, 3.6)], [L(8, 0.2), L(9, 3.6)]],
  };

  // ---------- 3. le produit : dimensions, définition, puis l'exemple du cours coefficient par coefficient ----------
  // Pour chaque coefficient (deux mesures) : la ligne et la colonne s'éclairent, le calcul s'écrit, son résultat
  // tombe dans la gueule du chien, qui le porte sous sa case et l'y dépose, puis revient attendre le suivant.
  const produit = {
    dim: ev(L(10, 0.5)), cij: ev(L(12, 0.3)), tableau: L(13, 1), entree: L(13, 2.5),
    pas: [0, 1, 2, 3].map((s) => { const T0 = L(14 + 2 * s); return { T0, eclaire: T0 + 0.5, calcul: ev(T0 + 1), res: ev(T0 + 2.5, 'pas'), chute: T0 + 3.25, part: T0 + 3.75, arrive: T0 + 5, pose: ev(T0 + 5.5, 'cloche'), retour: [T0 + 5.75, T0 + 7.25] }; }),
    leg: [[L(10, 0.2), L(11, 3.6)], [L(12), L(13, 3.6)], [L(14), L(15, 3.6)], [L(16), L(17, 3.6)], [L(18), L(21, 3.6)]],
  };

  // ---------- 4. l'ordre compte (contre-exemple du cours) ----------
  const ordre = { ab: ev(L(22, 0.5)), ba: ev(L(23, 1)), ne: ev(L(24, 1), 'pas'), id: ev(L(25, 0)), leg: [[L(22, 0.2), L(23, 3.6)], [L(24), L(25, 3.6)]] };

  // ---------- 5. les puissances ----------
  const puissance = { def: ev(L(26, 0.5)), zero: ev(L(27, 0)), D: [ev(L(27, 2)), ev(L(28, 0)), ev(L(28, 2)), ev(L(29, 0), 'cloche')], leg: [[L(26, 0.2), L(27, 1.6)], [L(27, 2), L(29, 3.6)]] };

  // ---------- 6. l'inverse : définition et exemple, déterminant et critère, application ----------
  const inverse = {
    def: ev(L(30, 0.5)), not: ev(L(31, 0)), ex: ev(L(32, 0.3)), p: [ev(L(32, 2)), ev(L(33, 1)), ev(L(33, 2.5), 'cloche')],
    det: ev(L(34, 0.5)), dex: ev(L(35, 0.5)), prop: ev(L(36, 0.5)), inv: ev(L(37, 0)),
    a: [ev(L(38, 0.5)), ev(L(39, 0)), ev(L(39, 1.5), 'cloche')], z: [ev(L(40, 0.5)), ev(L(40, 2)), ev(L(41, 0), 'pas')],
    leg: [[L(30, 0.2), L(31, 3.6)], [L(32), L(33, 3.6)], [L(34, 0.2), L(35, 3.6)], [L(36, 0.2), L(37, 3.6)], [L(38, 0.2), L(39, 3.6)], [L(40, 0.2), L(41, 3.6)]],
  };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, vocab, somme, produit, ordre, puissance, inverse, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

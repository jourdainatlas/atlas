// PARTITION — « Les probabilités », Seconde, chapitre 3 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'hasard', nom: 'Une expérience aléatoire', b0: 2, b1: 6 },
    { id: 'operations', nom: 'Contraire, intersection, réunion', b0: 6, b1: 14 },
    { id: 'loi', nom: 'La loi de probabilité', b0: 14, b1: 22 },
    { id: 'formules', nom: 'Deux formules de calcul', b0: 22, b1: 26 },
    { id: 'arbre', nom: 'Les arbres pondérés', b0: 26, b1: 34 },
    { id: 'sachant', nom: 'Les probabilités conditionnelles', b0: 34, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. l'expérience aléatoire : le chien pousse le dé, qui roule et s'arrête sur 4 ----------
  const hasard = {
    table: ev(L(2, 0.3)), entree: [L(2, 0.5), L(2, 2.5)], pousse: ev(L(3, 0), 'pas'), roule: [L(3, 0), L(3, 2)], arret: ev(L(3, 2), 'cloche'),
    omega: ev(L(3, 3)), A: ev(L(4, 2)), B: ev(L(5, 1)), sortie: L(5, 2.5),
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)]],
  };

  // ---------- 2. les opérations, sur les événements A = {2 ; 4 ; 6} et B = {5 ; 6} du cours ----------
  const operations = {
    fig: ev(L(6, 0.5)), contraire: [ev(L(7, 2)), L(9, 1.3)], inter: [ev(L(9, 2)), L(11, 1.3)], reunion: [ev(L(11, 2)), L(12, 3.6)], incompatibles: ev(L(13, 0.5), 'cloche'),
    leg: [[L(6, 0.2), L(7, 1.4)], [L(7, 2), L(9, 1.4)], [L(9, 2), L(11, 1.4)], [L(11, 2), L(12, 3.6)], [L(13), L(13, 3.7)]],
  };

  // ---------- 3. la loi de probabilité (dé truqué du cours), puis l'équiprobabilité (jeu de 32 cartes) ----------
  const loi = {
    barres: [0, 1, 2, 3, 4, 5].map((i) => ev(L(14, 0.5) + i * 0.5)), def: ev(L(15, 2)), somme: ev(L(16, 2)), PA: ev(L(17, 1), 'cloche'),
    cartes: ev(L(18, 0.5)), formule: ev(L(19, 0)), coeur: ev(L(20, 0)), pc: ev(L(20, 1), 'cloche'), roi: ev(L(21, 0)), pr: ev(L(21, 1), 'cloche'),
    leg: [[L(14, 0.2), L(15, 3.6)], [L(16), L(17, 3.6)], [L(18, 0.2), L(19, 3.6)], [L(20), L(21, 3.6)]],
  };

  // ---------- 4. contraire et réunion, sur le même jeu de cartes ----------
  const formules = {
    fc: ev(L(22, 0.5)), ac: ev(L(23, 0), 'cloche'), fu: ev(L(23, 2)), au: ev(L(24, 2)), ru: ev(L(25, 0), 'cloche'),
    leg: [[L(22, 0.2), L(23, 1.4)], [L(23, 2), L(25, 3.6)]],
  };

  // ---------- 5. l'arbre pondéré (urne du cours) : le chien parcourt un chemin, puis l'autre ----------
  const arbre = {
    urne: ev(L(26, 0.5)), n1: ev(L(27, 2)), n2: ev(L(28, 2)), feuilles: ev(L(29, 1)),
    entree: [L(29, 2.5), L(30, 0)], aller: [L(30, 0), L(31, 1.5)], regle1: ev(L(30, 0.5)), p1: ev(L(31, 1.5), 'cloche'), saut: [L(31, 2.5), L(32, 0)],
    retour: [L(32, 0), L(33, 1.5)], regle2: ev(L(32, 0.5)), p2: ev(L(33, 1.5), 'pas'), total: ev(L(33, 2.5), 'cloche'), sortie: L(33, 3),
    leg: [[L(26, 0.2), L(27, 1.4)], [L(27, 2), L(29, 3.6)], [L(30), L(31, 3.6)], [L(32), L(33, 3.6)]],
  };

  // ---------- 6. les probabilités conditionnelles : le tableau du lycée, la définition, l'indépendance ----------
  const sachant = {
    tableau: ev(L(34, 0.5)), PM: ev(L(35, 2)), colonne: ev(L(36, 2), 'pas'), PS: ev(L(37, 1), 'cloche'),
    def: ev(L(38, 0.5)), verif: ev(L(39, 2)), prod: ev(L(40, 2), 'cloche'),
    indep: ev(L(42, 0.5)), ipro: ev(L(43, 2)), lycee: ev(L(44, 2), 'cloche'), piege: ev(L(45, 1.5), 'pas'),
    leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(37, 3.6)], [L(38, 0.2), L(39, 3.6)], [L(40), L(41, 3.6)], [L(42, 0.2), L(43, 3.6)], [L(44), L(45, 3.6)]],
  };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, hasard, operations, loi, formules, arbre, sachant, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

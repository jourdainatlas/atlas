// PARTITION — « La géométrie dans l'espace », Terminale spécialité, chapitre 4 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'repere', nom: 'Un repère de l’espace', b0: 2, b1: 6 },
    { id: 'scalaire', nom: 'Le produit scalaire', b0: 6, b1: 14 },
    { id: 'plan', nom: 'Le plan et son vecteur normal', b0: 14, b1: 22 },
    { id: 'droite', nom: 'La droite et son paramètre', b0: 22, b1: 26 },
    { id: 'positions', nom: 'Positions relatives', b0: 26, b1: 34 },
    { id: 'projete', nom: 'Le projeté orthogonal', b0: 34, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. le repère : le chien marche 2 le long de l'axe des x, 3 parallèlement à l'axe des y ; M monte de 2 ----------
  const repere = {
    axes: ev(L(2, 0.3)), entree: [L(2, 0.5), L(2, 3)], x: [ev(L(3, 0), 'pas'), L(3, 3)], y: [ev(L(4, 0), 'pas'), L(4, 3)], z: [ev(L(5, 0), 'pas'), L(5, 1)], M: ev(L(5, 1), 'cloche'), OM: ev(L(5, 2)), sortie: L(5, 3),
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)]],
  };

  // ---------- 2. le produit scalaire : formules, orthogonalité, puis l'exemple du cours ----------
  const scalaire = {
    uv: ev(L(6, 0.5)), ps: ev(L(7, 0)), no: ev(L(7, 2)), or: ev(L(8, 0.5), 'cloche'),
    fig: ev(L(10, 0.3)), v: ev(L(10, 2)), c: ev(L(11, 1)), non: ev(L(12, 0.5), 'pas'), cos: ev(L(12, 3)), ang: ev(L(13, 1.5), 'cloche'),
    leg: [[L(6, 0.2), L(7, 3.6)], [L(8), L(9, 3.6)], [L(10, 0.2), L(11, 3.6)], [L(12), L(13, 3.6)]],
  };

  // ---------- 3. le plan : le chien retombe sur le plan et s'y promène ; où qu'il aille, AM reste orthogonal à n ----------
  const plan = {
    fig: ev(L(14, 0.3)), n: ev(L(14, 2)), bond: L(15, 0.5), chute: [L(15, 2), L(16, 0)], atterrit: ev(L(16, 0), 'pas'), promenade: [L(16, 0.5), L(21, 2)], eq: ev(L(16, 2)),
    dev: ev(L(18, 0.5)), car: ev(L(19, 0), 'cloche'), ex: ev(L(20, 0.3)), e: [ev(L(20, 1.5)), ev(L(20, 3)), ev(L(21, 0.5)), ev(L(21, 1.5), 'cloche')],
    leg: [[L(14, 0.2), L(15, 3.6)], [L(16), L(17, 3.6)], [L(18, 0.2), L(19, 3.6)], [L(20, 0.2), L(21, 3.6)]],
  };

  // ---------- 4. la droite : le chien est le point de paramètre t ----------
  const droite = {
    fig: ev(L(22, 0.3)), entree: [L(22, 0.5), L(23, 0)], va: [L(23, 0), L(24, 2)], revient: [L(24, 3), L(25, 0)], deux: ev(L(25, 0), 'cloche'), sortie: L(25, 2.5),
    eq: ev(L(22, 2)), sys: ev(L(23, 1)), ex: ev(L(24, 0.5)), s2: ev(L(24, 2)),
    leg: [[L(22, 0.2), L(23, 3.6)], [L(24), L(25, 3.6)]],
  };

  // ---------- 5. positions relatives : droite et plan (exemple du cours), puis deux droites non coplanaires ----------
  const positions = {
    cas: [ev(L(26, 0.5)), ev(L(26, 2)), ev(L(26, 3.5))], cr: ev(L(28, 0.3), 'cloche'), ex: ev(L(28, 2)), un: ev(L(29, 0)), tI: ev(L(29, 1.5)), I: ev(L(29, 3), 'cloche'),
    cube: ev(L(30, 0.3)), ab: ev(L(30, 2)), cg: ev(L(31, 0)), non: ev(L(32, 0.5), 'pas'),
    leg: [[L(26, 0.2), L(27, 3.6)], [L(28), L(29, 3.6)], [L(30, 0.2), L(31, 3.6)], [L(32), L(33, 3.6)]],
  };

  // ---------- 6. le projeté orthogonal : le chien, perché en M, saute sur H ----------
  const projete = {
    fig: ev(L(34, 0.3)), bond: L(34, 0.2), chute: [L(34, 1.2), L(34, 2.2)], perche: ev(L(34, 2.2), 'pas'), H: ev(L(35, 1)), N: ev(L(36, 0.3)), py: ev(L(36, 2)), ineg: ev(L(37, 0)), saut: [L(37, 2), L(37, 3)], surH: ev(L(37, 3), 'cloche'),
    ex: ev(L(38, 0.3)), m: [ev(L(38, 2)), ev(L(39, 1)), ev(L(40, 0.5)), ev(L(40, 2.5)), ev(L(41, 1.5), 'cloche')],
    MH: ev(L(42, 0.5)), f: ev(L(43, 1.5)), v: ev(L(44, 2), 'cloche'),
    leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(37, 3.6)], [L(38, 0.2), L(39, 3.6)], [L(40), L(41, 3.6)], [L(42, 0.2), L(43, 1)], [L(43, 1.4), L(45, 3.6)]],
  };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, repere, scalaire, plan, droite, positions, projete, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

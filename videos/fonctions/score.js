// PARTITION — « Fonctions numériques », Terminale spécialité, chapitre 3 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'limite', nom: 'Une limite en l’infini', b0: 2, b1: 6 },
    { id: 'asymptotes', nom: 'Limites infinies et asymptotes', b0: 6, b1: 14 },
    { id: 'indet', nom: 'Lever une indétermination', b0: 14, b1: 22 },
    { id: 'composee', nom: 'Dériver une fonction composée', b0: 22, b1: 26 },
    { id: 'convexe', nom: 'La convexité', b0: 26, b1: 34 },
    { id: 'tvi', nom: 'Continuité et valeurs intermédiaires', b0: 34, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. limite finie en +∞ : f(x) = 2 + 3/(x − 1) du cours, sur ]1 ; +∞[ ; le chien court sur la courbe ----------
  // La bande ]1,5 ; 2,5[ contient f(x) dès que x > 7 ; le chien, parti de x = 2, passe en x = 7 à l'instant « seuil ».
  const limite = {
    axes: ev(L(2, 0.3)), courbe: ev(L(2, 1)), bond: L(2, 1.3), chute: [L(2, 2.7), L(3, 1.2)], atterrit: ev(L(3, 1.2), 'pas'), bande: ev(L(3, 2)),
    course: [L(4, 0), L(5, 2.5)], seuil: ev(L(4, 0) + 6.5 * 5 / 13.6, 'pas'), lim: ev(L(5, 0.5), 'cloche'),
    leg: [[L(2, 0.3), L(3, 1.6)], [L(3, 2), L(4, 2.1)], [L(4, 2.4), L(5, 3.5)]],
  };

  // ---------- 2. limites infinies en 1, asymptotes de la courbe de f(x) = (2x + 1)/(x − 1) ----------
  const asymptotes = {
    fig: ev(L(6, 0.3)), courbe: ev(L(6, 1)), droite: ev(L(7, 2)), gauche: ev(L(8, 2)), av: ev(L(9, 2), 'cloche'),
    autre: ev(L(10, 0.5)), inf: ev(L(11, 0.5)), ah: ev(L(12, 0), 'cloche'), pos: ev(L(13, 0)),
    leg: [[L(6, 0.2), L(7, 1.4)], [L(7, 2), L(9, 1.4)], [L(9, 2), L(9, 3.9)], [L(10, 0.2), L(11, 3.6)], [L(12), L(12, 3.8)], [L(13), L(13, 3.6)]],
  };

  // ---------- 3. les quatre formes indéterminées, l'exemple de factorisation du cours, puis les gendarmes sur sin x / x ----------
  const indet = {
    fi: [0, 1, 2, 3].map((i) => ev(L(14, 0.5) + i * 0.5)), ex: ev(L(15, 2)), fact: ev(L(16, 1)), res: ev(L(17, 1), 'cloche'),
    fig: ev(L(18, 0.3)), gend: ev(L(18, 1.5)), sinc: ev(L(19, 0)), enc: ev(L(19, 2)), lim: ev(L(21, 0), 'cloche'),
    leg: [[L(14, 0.2), L(15, 1.4)], [L(15, 2), L(17, 3.6)], [L(18, 0.2), L(19, 1.4)], [L(19, 2), L(21, 3.5)]],
  };

  // ---------- 4. la dérivée d'une composée, deux exemples du cours ----------
  const composee = {
    th: ev(L(22, 0.5)), ex1: ev(L(23, 1.5)), r1: ev(L(24, 0.5), 'cloche'), ex2: ev(L(24, 2.5)), r2: ev(L(25, 0.8), 'cloche'),
    leg: [[L(22, 0.2), L(23, 1.2)], [L(23, 1.5), L(25, 3.5)]],
  };

  // ---------- 5. la convexité de f(x) = x³ − 3x² + 2 (cours) : le chien va de x = −0,9 à x = 2,9 à vitesse constante ----------
  // Il passe au point d'inflexion (1 ; 0) au milieu exact de sa course.
  const convexe = {
    axes: ev(L(26, 0.3)), courbe: ev(L(26, 0.8)), bond: L(26, 1.0), chute: [L(26, 2.4), L(27, 1.2)], atterrit: ev(L(27, 1.2), 'pas'),
    d1: ev(L(27, 0.5)), d2: ev(L(27, 2.5)), course: [L(28, 0), L(31, 2)], concave: ev(L(28, 0.5)), inflexion: ev(L(29, 3), 'cloche'), convexe: ev(L(30, 2)), th: ev(L(32, 0.5)),
    leg: [[L(26, 0.2), L(27, 3.6)], [L(28), L(29, 2.6)], [L(29, 3), L(30, 1.6)], [L(30, 2), L(31, 3.6)], [L(32, 0.2), L(33, 2.4)]],
  };

  // ---------- 6. continuité (partie entière), valeurs intermédiaires (trois solutions), corollaire et x³ + x − 1 = 0 du cours ----------
  const tvi = {
    def: ev(L(34, 0.5)), esc: ev(L(35, 2)), sauts: ev(L(36, 2), 'pas'),
    fig: ev(L(38, 0.3)), k: ev(L(39, 0)), th: ev(L(39, 2)), c: [ev(L(40, 2)), ev(L(40, 3)), ev(L(41, 0), 'cloche')],
    fig3: ev(L(42, 0.3)), der: ev(L(42, 2)), unique: ev(L(43, 1), 'cloche'), b1: ev(L(44, 0)), b2: ev(L(44, 1.5)), enc: ev(L(45, 0), 'cloche'),
    leg: [[L(34, 0.2), L(35, 1.4)], [L(35, 2), L(37, 3.6)], [L(38, 0.2), L(39, 3.6)], [L(40), L(41, 3.6)], [L(42, 0.2), L(43, 3.6)], [L(44), L(45, 3.5)]],
  };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, limite, asymptotes, indet, composee, convexe, tvi, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();

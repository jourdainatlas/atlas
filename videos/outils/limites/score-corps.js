  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'histoire', nom: 'Ce que l’œil ne démontre pas', b0: 2, b1: 6 },
    { id: 'limite', nom: 'La limite en un point', b0: 6, b1: 14 },
    { id: 'suites', nom: 'Le pont avec les suites', b0: 14, b1: 18 },
    { id: 'continu', nom: 'La continuité en un point', b0: 18, b1: 26 },
    { id: 'tvi', nom: 'Le théorème des valeurs intermédiaires', b0: 26, b1: 34 },
    { id: 'bornes', nom: 'Le théorème des bornes atteintes', b0: 34, b1: 38 },
    { id: 'heine', nom: 'Continuité uniforme et théorème de Heine', b0: 38, b1: 46 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. l'histoire (dates de l'introduction du cours) : Bolzano 1817, Cauchy 1821, Weierstrass années 1860, Heine 1872 ----------
  const histoire = {
    courbe: ev(L(2, 0.5)), point: ev(L(3, 0.5), 'pas'), frise: ev(L(4, 0)), dates: [0, 1, 2, 3].map((i) => ev(L(4, 0.6) + i * 0.9)),
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.5)]],
  };

  // ---------- 2. la limite en un point : f(x) = 1/x en 2 (exemple du cours), δ = min(1, 2ε) ; ε = 0,2 puis 0,1 puis 0,05 ----------
  const limite = {
    fig: ev(L(6, 0.3)), courbe: ev(L(6, 1)), def: ev(L(6, 2)), eps: [ev(L(7, 2)), ev(L(9, 0), 'pas'), ev(L(9, 3), 'pas')], bandeV: ev(L(8, 0.8)),
    maj: ev(L(10, 2)), delta: ev(L(11, 2), 'cloche'), piege: ev(L(12, 2), 'pas'),
    leg: [[L(6, 0.2), L(7, 1.4)], [L(7, 2), L(8, 3.7)], [L(9), L(10, 1.6)], [L(10, 2), L(11, 3.7)], [L(12, 0.2), L(13, 3.5)]],
  };

  // ---------- 3. la caractérisation séquentielle, et sin(1/x) qui n'a pas de limite en 0 (suites du cours) ----------
  const suites = {
    th: ev(L(14, 0.5)), fig: ev(L(14, 2)), xn: ev(L(15, 2)), yn: ev(L(16, 2)), verdict: ev(L(17, 1.5), 'cloche'),
    leg: [[L(14, 0.2), L(15, 1.6)], [L(15, 2), L(17, 3.5)]],
  };

  // ---------- 4. continuité en un point : la partie entière en 2, puis le prolongement de x sin(1/x) en 0 ----------
  const continu = {
    def: ev(L(18, 0.5)), esc: ev(L(19, 2)), gauche: ev(L(20, 2), 'pas'),
    fig2: ev(L(22, 0.3)), enc: ev(L(23, 2)), pro: ev(L(24, 2), 'cloche'), contre: ev(L(25, 1)),
    leg: [[L(18, 0.2), L(19, 1.6)], [L(19, 2), L(21, 3.6)], [L(22, 0.2), L(23, 1.6)], [L(23, 2), L(25, 3.5)]],
  };

  // ---------- 5. valeurs intermédiaires : la dichotomie du cours sur x² − 2, [0 ; 2] ; le chien est le milieu du segment ----------
  // milieux successifs : 1 ; 1,5 ; 1,25 ; 1,375 — segments : [0 ; 2], [1 ; 2], [1 ; 1,5], [1,25 ; 1,5], [1,375 ; 1,5]
  const tvi = {
    th: ev(L(26, 0.5)), fig: ev(L(27, 0)), bond: L(27, 1), chute: [L(27, 2.4), L(28, 1.2)], atterrit: ev(L(28, 1.2), 'pas'),
    etapes: [ev(L(28, 1.7)), ev(L(29, 1.5)), ev(L(30, 1)), ev(L(31, 0))], marches: [[L(28, 3), L(29, 1)], [L(29, 3), L(30, 0.6)], [L(30, 2.4), L(30, 3.6)]],
    adj: ev(L(31, 2.5)), concl: ev(L(32, 2), 'cloche'),
    leg: [[L(26, 0.2), L(27, 3.6)], [L(28), L(31, 2.2)], [L(31, 2.5), L(33, 2.4)]],
  };

  // ---------- 6. bornes atteintes : le chien va s'asseoir au point où le maximum est atteint ----------
  const bornes = {
    fig: ev(L(34, 0.3)), th: ev(L(34, 2)), bond: L(34, 1.2), chute: [L(34, 2.6), L(35, 1.2)], atterrit: ev(L(35, 1.2), 'pas'), marche: [L(35, 1.6), L(36, 0)],
    max: ev(L(36, 0), 'cloche'), min: ev(L(36, 1.5)), image: ev(L(37, 0), 'cloche'),
    leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(36, 3.8)], [L(37), L(37, 2.4)]],
  };

  // ---------- 7. continuité uniforme : la place du quantificateur, la fonction carré (figure du cours), puis Heine ----------
  const heine = {
    c1: ev(L(38, 0.5)), c2: ev(L(39, 2)), quant: ev(L(40, 2), 'pas'),
    fig: ev(L(42, 0.3)), b1: ev(L(42, 1.5)), b2: ev(L(43, 0.5)), suites: ev(L(43, 2)), heine: ev(L(44, 2), 'cloche'),
    leg: [[L(38, 0.2), L(39, 1.6)], [L(39, 2), L(41, 3.6)], [L(42, 0.2), L(43, 3.7)], [L(44), L(45, 3.5)]],
  };

  const bilan = { noeuds: [ev(L(BILAN, 0.5)), ev(L(BILAN, 2)), ev(L(BILAN, 2.5)), ev(L(BILAN + 1, 1), 'cloche'), ev(L(BILAN + 1, 2.5), 'cloche'), ev(L(BILAN + 2, 0), 'cloche'), ev(L(BILAN + 2, 2)), ev(L(BILAN + 2, 3))], leg: [[L(BILAN + 1), L(BILAN + 3, 3.5)]] };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };


// LE FILM — « Les probabilités », Seconde, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y lance le dé de la première expérience, puis parcourt les chemins de l'arbre pondéré.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Les probabilités', NIVEAU = 'SECONDE', LONG = 'SECONDE · CHAPITRE 3', NB_EXERCICES = 30;

  // coche (vrai) ou croix (faux)
  function marque(ctx, x, y, r, ok, k) {
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2); ctx.translate(x, y); ctx.scale(ressort(k), ressort(k)); ctx.strokeStyle = ok ? VRAI : FAUX; ctx.lineWidth = r * 0.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); if (ok) { ctx.moveTo(-r * 0.8, 0); ctx.lineTo(-r * 0.2, r * 0.6); ctx.lineTo(r * 0.9, -r * 0.7); } else { ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.7); ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(-r * 0.7, r * 0.7); }
    ctx.stroke(); ctx.restore();
  }
  // carte de définition (filet rouge, comme sur le site) ou de propriété (filet turquoise)
  function carte(ctx, x, y, w, h, genre, a) {
    if (a <= 0) return; const c = genre === 'DÉFINITION' ? C.rouge : C.cours;
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fillStyle = C.surface; ctx.fill(); ctx.fillStyle = c; ctx.fillRect(x, y, 5, h);
    txt(ctx, genre, x + 32, y + 42, { fam: F.mono, w: 700, size: 20, ls: 3, c, align: 'left' }); ctx.restore();
  }

  // ---------- intertitre : avant chaque partie, une mesure (quatre secondes) où son titre occupe seul l'écran. ----------
  // Trois temps qui ne se recouvrent pas : la scène précédente s'efface (0 à 0,5 s), le titre paraît, tient, puis
  // s'efface (0,6 à 3,5 s), et la scène suivante se découvre (3,6 à 4 s). Le jardin reste visible tout du long.
  function intertitre(ctx, t) {
    for (const it of S.intertitres) { const u = t - it.t; if (u <= 0 || u >= S.INTER) continue;
      const voile = Math.min(doux(pr(u, 0, 0.5)), 1 - doux(pr(u, S.INTER - 0.4, 0.4))), k = Math.min(sortie(pr(u, 0.6, 0.5)), 1 - doux(pr(u, S.INTER - 0.9, 0.4)));
      ctx.save(); ctx.globalAlpha = voile; ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, 884); ctx.restore();
      if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha = k;
      if (it.rang) txt(ctx, it.rang, CX, 372, { fam: F.mono, w: 500, size: 28, ls: 6, c: C.encre3 });
      txt(ctx, it.nom, CX, 478 + (1 - sortie(pr(u, 0.6, 0.6))) * 22, { size: 84, w: 800 });
      ctx.restore(); }
  }

  // ---------- en-tête ----------
  function entete(ctx, t) {
    const a = fen(t, L(2) + 0.2, L(S.FIN) - 0.1, 0.5); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.logo(ctx, 78, 74, 60);
    txt(ctx, `${TITRE.toUpperCase()} · ${NIVEAU}`, 126, 62, { fam: F.mono, w: 500, size: 20, ls: 3, c: C.encre3, align: 'left' });
    for (const [nom, t0, t1] of [...S.CH.map((c) => [c.nom, c.t0, c.t1]), ['En résumé', L(S.BILAN), L(S.FIN)]]) { const k = fen(t, t0 + 0.1, t1, 0.35); if (k > 0) txt(ctx, nom, 126, 104, { size: 36, w: 600, align: 'left', a: k }); }
    ctx.restore();
  }

  // ---------- ouverture ----------
  function ouverture(ctx, t) {
    const O = S.ouverture, out = 1 - pr(t, L(2) - 0.6, 0.5); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out;
    const [l0, l1, l2] = O.logo;
    K.logo(ctx, CX, 300, 210, [pr(t, l0, 0.35), pr(t, l0 + 0.25, 0.4), pr(t, l1, 0.35), pr(t, l1 + 0.25, 0.5), pr(t, l2, 0.35)], sortie(pr(t, l0 - 0.3, 0.4)));
    const k1 = ap(t, O.titre), k2 = ap(t, O.sous);
    txt(ctx, LONG, CX, 478, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 124, w: 800, a: k1 });
    ligne(ctx, 'Mesurer le {hasard}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- outils de figure ----------
  const ROUGE_B = '#e2553b', VERT_B = '#7fc65a', VIOLET = '#b58cff';   // boules de l'urne ; le rouge du site reste aux définitions
  function seg(ctx, p, q, o = {}) { const k = o.k ?? 1; if (k <= 0 || (o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.gm; ctx.lineWidth = o.lw || 3; ctx.lineCap = 'round'; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], k), lerp(p[1], q[1], k)); ctx.stroke(); ctx.restore(); }
  function pt(ctx, p, o = {}) { if ((o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.c || C.encre; ctx.beginPath(); ctx.arc(p[0], p[1], o.r || 7, 0, 6.3); ctx.fill(); ctx.restore(); }
  const trot = (t, x, ech) => ({ t, allure: 'trot', phase: x / ech * 0.33 }), assisP = (t, k, tete = -0.2) => ({ t, assis: k, tete, queue: { a: -0.35, amp: 0.4, f: 8, courbe: -0.12 } });
  const etiq = (ctx, s, x, y, a, o = {}) => txt(ctx, s, x, y, { fam: F.ui, w: 500, size: 28, c: C.encre2, a, ...o });

  // ---------- 1. l'expérience aléatoire ----------
  const DE = { x0: 690, x1: 1000, sol: 640, c: 104, ech: 3.4 }, POINTS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  function de(ctx, cx, cy, s, n, rot = 0, a = 1) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.fillStyle = C.encre; ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.18); ctx.fill();
    ctx.fillStyle = C.papier; for (const [u, v] of POINTS[n]) { ctx.beginPath(); ctx.arc(u * s * 0.26, v * s * 0.26, s * 0.085, 0, 6.3); ctx.fill(); }
    ctx.restore(); }
  // le dé pendant son roulé : position, rotation et face visible ; il s'arrête sur 4
  function etatDe(t) { const [a, b] = S.hasard.roule, k = pr(t, a, b - a), e = 1 - (1 - k) * (1 - k), rot = e * 4 * Math.PI, q = Math.min(7, Math.floor(rot / (Math.PI / 2) + 1e-6));
    return { x: lerp(DE.x0, DE.x1, e), y: DE.sol - DE.c / 2 - 70 * Math.abs(Math.sin(3 * Math.PI * k)) * (1 - k), rot: k >= 1 ? 0 : rot, n: k >= 1 ? 4 : [2, 6, 3, 5, 1, 2, 6, 3][q] }; }
  function hasard(ctx, t) {
    const V = S.hasard, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kt = ap(t, V.table, 0.6); seg(ctx, [100, DE.sol], [1150, DE.sol], { c: C.gl, lw: 3, k: kt });
    const d = etatDe(t); de(ctx, d.x, d.y, DE.c, d.n, d.rot, kt);
    const ka = ap(t, V.arret); ligne(ctx, 'une [issue] : $4$', DE.x1, DE.sol + 62, { size: 36, w: 600, a: ka });
    const ko = ap(t, V.omega); etiq(ctx, 'l’univers : toutes les issues', 1500, 196, ko); formule(ctx, 'o_om', 1500, 262, { fs: 54, mil: 1, a: ko, monte: 1 });
    const kA = ap(t, V.A); etiq(ctx, 'A : « obtenir un nombre pair »', 1500, 388, kA); formule(ctx, 'o_A', 1500, 452, { fs: 54, mil: 1, a: kA, monte: 1 });
    const kB = ap(t, V.B); etiq(ctx, 'B : « obtenir un nombre supérieur ou égal à 5 »', 1500, 580, kB, { size: 25 }); formule(ctx, 'o_B', 1500, 644, { fs: 54, mil: 1, a: kB, monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une [expérience aléatoire] : on connaît tous les résultats possibles,', 'sans pouvoir prévoir lequel se produira.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Chaque résultat est une [issue] ; leur ensemble est l’[univers].', 'Un [événement] est une partie de l’univers.'], { size: 40 });
  }

  // ---------- 2. contraire, intersection, réunion ----------
  const VE = { r: [150, 190, 780, 500], A: [440, 440, 165], B: [650, 440, 165], n: { 2: [365, 372], 4: [358, 512], 6: [545, 440], 5: [738, 440], 1: [232, 268], 3: [852, 632] } };
  function venn(ctx, a, ombre = [0, 0, 0]) {
    if (a <= 0) return; const [x, y, w, h] = VE.r, cer = (c) => { ctx.moveTo(c[0] + c[2], c[1]); ctx.arc(c[0], c[1], c[2], 0, 2 * Math.PI); };
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = C.surface; ctx.fillRect(x, y, w, h);
    if (ombre[0] > 0) { ctx.save(); ctx.globalAlpha *= ombre[0]; ctx.fillStyle = 'rgba(255,162,74,0.22)'; ctx.beginPath(); ctx.rect(x, y, w, h); cer(VE.A); ctx.fill('evenodd'); ctx.restore(); }           // le contraire de A
    if (ombre[1] > 0) { ctx.save(); ctx.globalAlpha *= ombre[1]; ctx.beginPath(); cer(VE.A); ctx.clip(); ctx.fillStyle = 'rgba(181,140,255,0.55)'; ctx.beginPath(); cer(VE.B); ctx.fill(); ctx.restore(); }           // l'intersection
    if (ombre[2] > 0) { ctx.save(); ctx.globalAlpha *= ombre[2]; ctx.fillStyle = 'rgba(181,140,255,0.38)'; ctx.beginPath(); cer(VE.A); cer(VE.B); ctx.fill('nonzero'); ctx.restore(); }                                  // la réunion
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.gm; ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 4; ctx.strokeStyle = C.bleu; ctx.beginPath(); cer(VE.A); ctx.stroke(); ctx.strokeStyle = C.cours; ctx.beginPath(); cer(VE.B); ctx.stroke();
    formule(ctx, 'l_A', 322, 262, { fs: 44, mil: 1 }); formule(ctx, 'l_B', 772, 262, { fs: 44, mil: 1 }); formule(ctx, 'l_O', x + w - 42, y + 38, { fs: 40, mil: 1 });
    for (const [n, p] of Object.entries(VE.n)) formule(ctx, 'n' + n, p[0], p[1], { fs: 46, mil: 1 });
    ctx.restore(); }
  function operations(ctx, t) {
    const V = S.operations, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    venn(ctx, ap(t, V.fig, 0.6), [fen(t, V.contraire[0], V.contraire[1], 0.35), fen(t, V.inter[0], V.inter[1], 0.35), fen(t, V.reunion[0], V.reunion[1], 0.35)]);
    [['le contraire de A', 'e_c', V.contraire[0]], ['l’intersection : « A et B »', 'e_i', V.inter[0]], ['la réunion : « A ou B »', 'e_u', V.reunion[0]]].forEach(([nom, id, tt], i) => { const k = ap(t, tt); etiq(ctx, nom, 1440, 212 + i * 150, k); formule(ctx, id, 1440, 272 + i * 150, { fs: 52, mil: 1, a: k, monte: 1 }); });
    const ki = ap(t, V.incompatibles); formule(ctx, 'e_v', 1290, 690, { fs: 46, mil: 1, a: ki, monte: 1 }); txt(ctx, 'incompatibles', 1640, 702, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ki });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['On représente l’univers par un rectangle, et chaque événement par un disque.']);
    legende(ctx, t, V.leg[1], ['Le [contraire] de $A$ contient toutes les issues qui ne sont pas dans $A$.']);
    legende(ctx, t, V.leg[2], ['L’[intersection] : les issues qui sont à la fois dans $A$ et dans $B$.']);
    legende(ctx, t, V.leg[3], ['La [réunion] : les issues qui sont dans $A$, dans $B$, ou dans les deux.']);
    legende(ctx, t, V.leg[4], ['Deux événements sans aucune issue commune sont [incompatibles].']);
  }

  // ---------- 3. la loi de probabilité ----------
  const PROBA = [0.1, 0.1, 0.2, 0.2, 0.1, 0.3], RANGS = ['7', '8', '9', '10', 'V', 'D', 'R', 'A'], COULEURS = ['pique', 'cœur', 'carreau', 'trèfle'];
  // le jeu de 32 cartes en tableau : une ligne par couleur, une colonne par valeur ; kc éclaire les cœurs, kr les rois
  function grille(ctx, a, kc = 0, kr = 0) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    COULEURS.forEach((nom, i) => { txt(ctx, nom, 262, 318 + i * 100, { fam: F.ui, w: i === 1 && kc > 0.5 ? 600 : 500, size: 27, c: i === 1 && kc > 0.5 ? C.bleu : C.encre2, align: 'right' });
      RANGS.forEach((r, j) => { const x = 322 + j * 84, y = 308 + i * 100, c = i === 1 ? kc : 0, o = j === 6 ? kr : 0;
        ctx.save(); ctx.beginPath(); ctx.roundRect(x - 33, y - 43, 66, 86, 9); ctx.fillStyle = C.surface; ctx.fill();
        if (c > 0) { ctx.globalAlpha *= c; ctx.fillStyle = 'rgba(85,170,255,0.30)'; ctx.fill(); ctx.globalAlpha /= c; }
        if (o > 0) { ctx.globalAlpha *= o; ctx.fillStyle = 'rgba(255,162,74,0.34)'; ctx.fill(); ctx.globalAlpha /= o; }
        ctx.lineWidth = c > 0.5 || o > 0.5 ? 3 : 2; ctx.strokeStyle = c > 0.5 && o > 0.5 ? VIOLET : c > 0.5 ? C.bleu : o > 0.5 ? C.orange : C.filet; ctx.stroke(); ctx.restore();
        txt(ctx, r, x, y + 10, { fam: F.ui, w: 600, size: 28, c: C.encre }); }); });
    ctx.restore(); }
  function loi(ctx, t) {
    const V = S.loi, a = fen(t, L(14) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(14) + 0.1, L(18), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      etiq(ctx, 'Un dé truqué : sa loi de probabilité', 520, 212, ap(t, V.barres[0]), { size: 30 }); seg(ctx, [170, 652], [870, 652], { c: C.gm, lw: 3, k: ap(t, V.barres[0], 0.5) });
      const kA = ap(t, V.PA);
      PROBA.forEach((p, i) => { const kb = ap(t, V.barres[i], 0.45), x = 245 + i * 110, h = p * 880 * doux(kb), pair = i % 2 === 1; if (kb <= 0) return;
        ctx.fillStyle = C.gm; ctx.fillRect(x - 36, 650 - h, 72, h); if (pair && kA > 0) { ctx.save(); ctx.globalAlpha *= kA; ctx.fillStyle = C.bleu; ctx.fillRect(x - 36, 650 - h, 72, h); ctx.restore(); }
        formule(ctx, 'n' + (i + 1), x, 690, { fs: 38, mil: 1, a: kb }); formule(ctx, 'v' + Math.round(p * 10), x, 650 - p * 880 - 30, { fs: 32, mil: 1, a: kb }); });
      const kd = ap(t, V.def); carte(ctx, 1010, 175, 800, 230, 'DÉFINITION', kd); formule(ctx, 'p_01', 1410, 280, { fs: 42, mil: 1, a: kd }); formule(ctx, 'p_s', 1410, 350, { fs: 42, mil: 1, a: kd });
      formule(ctx, 'p_v', 1410, 505, { fs: 38, mil: 1, a: ap(t, V.somme), monte: 1 }); formule(ctx, 'p_A', 1410, 640, { fs: 46, mil: 1, a: kA, monte: 1 }); ctx.restore(); }
    k = fen(t, L(18) + 0.1, L(22), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      grille(ctx, ap(t, V.cartes, 0.6), ap(t, V.coeur, 0.4), ap(t, V.roi, 0.4));
      const kf = ap(t, V.formule); carte(ctx, 1040, 175, 800, 215, 'PROPRIÉTÉ', kf); formule(ctx, 'q_P', 1150, 296, { fs: 44, mil: 1, a: kf });
      txt(ctx, 'nombre d’issues favorables à A', 1510, 278, { fam: F.ui, w: 500, size: 27, a: kf }); seg(ctx, [1300, 296], [1720, 296], { c: C.encre, lw: 2.5, a: kf }); txt(ctx, 'nombre d’issues possibles', 1510, 336, { fam: F.ui, w: 500, size: 27, a: kf });
      txt(ctx, 'A : « tirer un cœur »', 1440, 458, { fam: F.ui, w: 600, size: 28, c: C.bleu, a: ap(t, V.coeur) }); formule(ctx, 'q_c', 1440, 528, { fs: 44, mil: 1, a: ap(t, V.pc), monte: 1 });
      txt(ctx, 'B : « tirer un roi »', 1440, 638, { fam: F.ui, w: 600, size: 28, c: C.orange, a: ap(t, V.roi) }); formule(ctx, 'q_r', 1440, 706, { fs: 44, mil: 1, a: ap(t, V.pr), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une [loi de probabilité] associe à chaque issue un nombre entre 0 et 1 ;', 'la somme de ces nombres vaut 1.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['La probabilité d’un événement est la somme des probabilités de ses issues.']);
    legende(ctx, t, V.leg[2], ['Quand toutes les issues ont la même probabilité, on parle d’[équiprobabilité].']);
    legende(ctx, t, V.leg[3], ['Dans un jeu de 32 cartes bien mélangé, chaque carte a une chance sur 32 d’être tirée.']);
  }

  // ---------- 4. contraire et réunion ----------
  function formules(ctx, t) {
    const V = S.formules, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    grille(ctx, 1, 1, 1);
    const kc = ap(t, V.fc), ku = ap(t, V.fu); carte(ctx, 1040, 170, 820, 250, 'PROPRIÉTÉ', kc); formule(ctx, 'c_f', 1450, 270, { fs: 44, mil: 1, a: kc }); formule(ctx, 'u_f', 1450, 356, { fs: 38, mil: 1, a: ku });
    formule(ctx, 'c_a', 1450, 506, { fs: 42, mil: 1, a: ap(t, V.ac), monte: 1 });
    const w = formule(ctx, 'u_a', 1090, 660, { fs: 38, mil: 1, align: 'left', a: ap(t, V.au), monte: 1 }); formule(ctx, 'u_r', 1090 + w + 16, 660, { fs: 46, mil: 1, align: 'left', a: ap(t, V.ru), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Un événement et son contraire se partagent l’univers :', 'leurs probabilités ont pour somme 1.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Le roi de cœur est compté deux fois, comme cœur et comme roi :', 'on le retranche une fois.'], { size: 40 });
  }

  // ---------- 5. l'arbre pondéré ----------
  const AR = { O: [250, 455], R: [580, 305], V: [580, 605], RR: [910, 230], RV: [910, 380], VR: [910, 530], VV: [910, 680], ech: 2.4 };
  const BRANCHES = [['O', 'R', 'r', 0], ['O', 'V', 'v', 0], ['R', 'RR', 'r', 1], ['R', 'RV', 'v', 1], ['V', 'VR', 'r', 1], ['V', 'VV', 'v', 1]];
  function arbreP(ctx, k1, k2, kf, eclaire = {}) {
    for (const [p, q, c, niv] of BRANCHES) { const k = niv ? k2 : k1; if (k <= 0) continue; const P = AR[p], Q = AR[q], haut = Q[1] < P[1];
      seg(ctx, P, Q, { c: c === 'r' ? ROUGE_B : VERT_B, lw: 5, k: doux(k) }); pt(ctx, Q, { r: 7, a: k }); formule(ctx, 'a_' + c, (P[0] + Q[0]) / 2 - 8, (P[1] + Q[1]) / 2 + (haut ? -34 : 36), { fs: 38, mil: 1, a: k }); }
    pt(ctx, AR.O, { r: 8, a: Math.max(k1, 0.0001) > 0.001 ? k1 : 0 });
    formule(ctx, 'a_R', AR.R[0], AR.R[1] - 34, { fs: 38, mil: 1, a: k1 }); formule(ctx, 'a_V', AR.V[0], AR.V[1] + 36, { fs: 38, mil: 1, a: k1 });
    for (const f of ['RR', 'RV', 'VR', 'VV']) { const e = eclaire[f] || 0; formule(ctx, 'a_' + f, AR[f][0] + 28, AR[f][1], { fs: 36, mil: 1, align: 'left', a: kf });
      if (e > 0) cadre(ctx, AR[f][0] + 258, AR[f][1], 226, 62, { stroke: C.cours, fill: 'rgba(53,202,164,0.12)', lw: 2.5, a: e });
      formule(ctx, 'a_p' + f, AR[f][0] + 160, AR[f][1], { fs: 36, mil: 1, align: 'left', a: kf }); } }
  function urne(ctx, cx, cy, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gm; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(cx - 70, cy - 52); ctx.lineTo(cx - 70, cy + 40); ctx.quadraticCurveTo(cx - 70, cy + 62, cx - 48, cy + 62); ctx.lineTo(cx + 48, cy + 62); ctx.quadraticCurveTo(cx + 70, cy + 62, cx + 70, cy + 40); ctx.lineTo(cx + 70, cy - 52); ctx.stroke();
    [[-40, 40, 1], [0, 40, 0], [40, 40, 1], [-20, 6, 1], [20, 6, 0]].forEach(([dx, dy, r]) => pt(ctx, [cx + dx, cy + dy], { r: 18, c: r ? ROUGE_B : VERT_B })); ctx.restore(); }
  // le chemin du chien sur l'arbre : racine → R → (R ; V), un petit saut vers (V ; R), puis (V ; R) → V → racine
  function cheminChien(t) { const V = S.arbre, mi = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)], pente = (p, q) => Math.atan((q[1] - p[1]) / (q[0] - p[0]));
    const KS = 0.76, H1 = mi(AR.R, AR.RV, KS), H2 = mi(AR.V, AR.VR, KS);                    // il s'arrête avant la feuille, pour ne pas masquer l'issue
    if (t < V.aller[0]) return { p: [lerp(-140, AR.O[0], doux(pr(t, V.entree[0], V.entree[1] - V.entree[0]))), AR.O[1]], an: 0, face: 1, marche: t < V.entree[1] };
    if (t < V.aller[1]) { const k = pr(t, V.aller[0], V.aller[1] - V.aller[0]) * 2; return k < 1 ? { p: mi(AR.O, AR.R, k), an: pente(AR.O, AR.R), face: 1, marche: 1 } : { p: mi(AR.R, H1, k - 1), an: pente(AR.R, AR.RV), face: 1, marche: 1 }; }
    if (t < V.saut[0] - 0.25) return { p: H1, an: pente(AR.R, AR.RV), face: 1, assis: doux(pr(t, V.aller[1], 0.4)) };
    if (t < V.saut[1]) { const k = pr(t, V.saut[0], V.saut[1] - V.saut[0]); return { p: [H1[0], lerp(H1[1], H2[1], k * k) - 24 * Math.sin(Math.PI * Math.min(1, k * 3)) * (k < 0.34 ? 1 : 0)], an: 0, face: -1, saut: k, prep: pr(t, V.saut[0] - 0.25, 0.25) }; }
    if (t < V.retour[1]) { const k = pr(t, V.retour[0], V.retour[1] - V.retour[0]) * 2; return k < 1 ? { p: mi(H2, AR.V, k), an: pente(AR.V, AR.VR), face: -1, marche: 1 } : { p: mi(AR.V, AR.O, k - 1), an: pente(AR.O, AR.V), face: -1, marche: 1 }; }
    if (t < V.sortie) return { p: AR.O, an: 0, face: -1, assis: doux(pr(t, V.retour[1], 0.4)) };
    return { p: [lerp(AR.O[0], -160, doux(pr(t, V.sortie, 1.0))), AR.O[1]], an: 0, face: -1, marche: 1 }; }
  function arbre(ctx, t) {
    const V = S.arbre, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    urne(ctx, 150, 235, ap(t, V.urne, 0.6));
    arbreP(ctx, ap(t, V.n1, 0.7), ap(t, V.n2, 0.7), ap(t, V.feuilles), { RV: ap(t, V.p1), VR: ap(t, V.p2) });
    const k1 = ap(t, V.regle1), k2 = ap(t, V.regle2); carte(ctx, 1330, 195, 520, 290, 'MÉTHODE', k1);
    txt(ctx, 'Le long d’un chemin,', 1590, 290, { fam: F.ui, w: 500, size: 28, a: k1 }); txt(ctx, 'on multiplie.', 1590, 328, { fam: F.ui, w: 600, size: 30, c: C.cours, a: k1 });
    txt(ctx, 'Entre plusieurs chemins,', 1590, 400, { fam: F.ui, w: 500, size: 28, a: k2 }); txt(ctx, 'on additionne.', 1590, 438, { fam: F.ui, w: 600, size: 30, c: C.cours, a: k2 });
    formule(ctx, 'a_t', 1590, 620, { fs: 36, mil: 1, a: ap(t, V.total), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une urne contient 3 boules rouges et 2 vertes : on tire une boule,', 'on la remet, puis on en tire une seconde.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Un [arbre pondéré] : chaque étape est un niveau, chaque chemin est une issue.']);
    legende(ctx, t, V.leg[2], ['La probabilité d’un chemin est le {produit} des probabilités rencontrées.']);
    legende(ctx, t, V.leg[3], ['Deux boules de couleurs différentes : on {additionne} les deux chemins qui conviennent.']);
  }

  // ---------- 6. les probabilités conditionnelles ----------
  const TB = { x: [110, 370, 540, 760, 910], y: [240, 326, 412, 498, 584], col: ['', 'Sport', 'Pas de sport', 'Total'], lig: ['Musique', 'Pas de musique', 'Total'], v: [[90, 60, 150], [210, 140, 350], [300, 200, 500]] };
  function tableau(ctx, a, kl, kcol, kc) {                                                   // kl : ligne « Musique » ; kcol : colonne « Sport » ; kc : les cases 90 et 300
    if (a <= 0) return; const X = TB.x, Y = TB.y, cx = (j) => (X[j] + X[j + 1]) / 2, cy = (i) => (Y[i] + Y[i + 1]) / 2 + 10;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = C.surface; ctx.fillRect(X[0], Y[0], X[4] - X[0], Y[4] - Y[0]); ctx.fillStyle = C.trame; ctx.fillRect(X[0], Y[0], X[4] - X[0], Y[1] - Y[0]); ctx.fillRect(X[0], Y[0], X[1] - X[0], Y[4] - Y[0]);
    if (kcol > 0) { ctx.save(); ctx.globalAlpha *= kcol; ctx.fillStyle = 'rgba(53,202,164,0.22)'; ctx.fillRect(X[1], Y[0], X[2] - X[1], Y[4] - Y[0]); ctx.restore(); }
    ctx.strokeStyle = C.filet; ctx.lineWidth = 2; ctx.beginPath(); for (const x of X) { ctx.moveTo(x, Y[0]); ctx.lineTo(x, Y[4]); } for (const y of Y) { ctx.moveTo(X[0], y); ctx.lineTo(X[4], y); } ctx.stroke();
    const pale = (j) => 1 - 0.62 * kcol * (j === 1 || j === 0 ? 0 : 1);
    TB.col.forEach((s, j) => s && txt(ctx, s, cx(j), cy(0), { fam: F.ui, w: 600, size: 27, c: j === 1 && kcol > 0.5 ? C.cours : C.encre, a: pale(j) }));
    TB.lig.forEach((s, i) => txt(ctx, s, cx(0), cy(i + 1), { fam: F.ui, w: 600, size: 27 }));
    TB.v.forEach((r, i) => r.forEach((n, j) => txt(ctx, String(n), cx(j + 1), cy(i + 1), { fam: F.ui, w: i === 2 || j === 2 ? 600 : 500, size: 30, a: pale(j + 1) })));
    const entoure = (i, j, c, k) => { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(X[j] + 6, Y[i] + 6, X[j + 1] - X[j] - 12, Y[i + 1] - Y[i] - 12, 10); ctx.stroke(); ctx.restore(); };
    entoure(1, 3, C.bleu, kl * (1 - kcol)); entoure(3, 3, C.bleu, kl * (1 - kcol)); entoure(1, 1, C.cours, kc); entoure(3, 1, C.cours, kc);
    ctx.restore(); }
  function sachant(ctx, t) {
    const V = S.sachant, a = fen(t, L(34) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kt = ap(t, V.tableau, 0.6); tableau(ctx, kt, ap(t, V.PM, 0.4), ap(t, V.colonne, 0.5), ap(t, V.PS, 0.4));
    etiq(ctx, 'M : « l’élève fait de la musique »        S : « l’élève fait du sport »', 510, 640, kt, { size: 25 });
    let k = fen(t, L(34) + 0.1, L(38), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 's_PM', 1420, 290, { fs: 52, mil: 1, a: ap(t, V.PM), monte: 1 });
      txt(ctx, 'Sachant que l’élève fait du sport :', 1420, 478, { fam: F.ui, w: 600, size: 30, c: C.cours, a: ap(t, V.colonne) }); formule(ctx, 's_PS', 1420, 580, { fs: 58, mil: 1, a: ap(t, V.PS), monte: 1 }); ctx.restore(); }
    k = fen(t, L(38) + 0.1, L(42), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.def); carte(ctx, 990, 170, 860, 230, 'DÉFINITION', kd); formule(ctx, 's_def', 1420, 298, { fs: 52, mil: 1, a: kd });
      formule(ctx, 's_ver', 1420, 500, { fs: 40, mil: 1, a: ap(t, V.verif), monte: 1 });
      const kp = ap(t, V.prod); cadre(ctx, 1420, 672, 720, 96, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kp }); formule(ctx, 's_pro', 1420, 672, { fs: 44, mil: 1, a: kp }); ctx.restore(); }
    k = fen(t, L(42) + 0.1, L(46), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.indep); carte(ctx, 990, 165, 860, 170, 'DÉFINITION', kd); formule(ctx, 'i_def', 1420, 262, { fs: 50, mil: 1, a: kd });
      const kp = ap(t, V.ipro); carte(ctx, 990, 365, 860, 170, 'PROPRIÉTÉ', kp); formule(ctx, 'i_pro', 1420, 462, { fs: 46, mil: 1, a: kp });
      const kl = ap(t, V.lycee); formule(ctx, 'i_lyc', 1420, 620, { fs: 48, mil: 1, a: kl, monte: 1 }); txt(ctx, 'S et M sont indépendants.', 1420, 700, { fam: F.ui, w: 600, size: 30, c: C.cours, a: kl });
      txt(ctx, 'Attention : « indépendants » ne veut pas dire « incompatibles ».', 510, 708, { fam: F.ui, w: 600, size: 26, c: FAUX, a: ap(t, V.piege) }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Dans un lycée de 500 élèves, on choisit un élève au hasard.']);
    legende(ctx, t, V.leg[1], ['Si l’on sait qu’il fait du sport, l’univers se réduit à la colonne « Sport ».']);
    legende(ctx, t, V.leg[2], ['La [probabilité de $B$ sachant $A$] : celle que $B$ se réalise', 'quand on sait déjà que $A$ est réalisé.'], { size: 40 });
    legende(ctx, t, V.leg[3], ['On retrouve la règle des arbres : le long d’un chemin, on multiplie.']);
    legende(ctx, t, V.leg[4], ['Deux événements sont [indépendants] quand savoir l’un réalisé', 'ne change pas la probabilité de l’autre.'], { size: 40 });
    legende(ctx, t, V.leg[5], ['Dans ce lycée, faire du sport ne change pas la probabilité de faire de la musique.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    const B = S.bilan, a = fen(t, L(S.BILAN) + 0.1, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    txt(ctx, 'Trois formules', CX, 215, { size: 56, w: 700, a: ap(t, B.titre) });
    const XC = [370, 960, 1550], LC = [500, 600, 500], ID = ['b_c', 'b_u', 'b_s'], FS = [38, 32, 32], TX = [['Le contraire :', 'les deux probabilités ont pour somme 1.'], ['La réunion : on retranche', 'ce qui a été compté deux fois.'], ['L’intersection : on multiplie,', 'comme le long d’un chemin de l’arbre.']];
    B.cartes.forEach((tc, i) => { const k = ap(t, tc); if (k <= 0) return; const cx = XC[i];
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, LC[i], 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      formule(ctx, ID[i], cx, 395, { fs: FS[i], mil: 1 });
      txt(ctx, TX[i][0], cx, 560, { size: 26, w: 600 }); txt(ctx, TX[i][1], cx, 600, { size: 25, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, 'Une probabilité est toujours comprise entre {0 et 1}.', CX, 745 + (1 - kp) * 20, { size: 50, w: 700, a: kp });
    ctx.restore();
  }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 100, w: 800, a: k1 });
    ligne(ctx, `Le cours complet et ${NB_EXERCICES} exercices corrigés : {atlasjourdain.fr}`, CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const NP = S.CH.length, XS = S.CH.map((c, k) => (300 + 250 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[NP - 1] + 36], DS = [...XS.map((x) => x + 30), XS[NP - 1] + 76], J = S.jardin;
  const melange = (dom, g) => { const r = alea(g); return K.FEUILLES.map(() => (r() < 0.6 ? dom : RUBC[Math.floor(r() * 5)])); };
  const ARBRES = S.CH.map((c, k) => ({ x: XS[k], ne: c.plante, ech: 2.05, miroir: k % 2 ? -1 : 1, coul: melange(C.cours, 57 + k) }));
  function jardinierA(t) {
    const fd = (a, b) => Math.min(doux(pr(t, a, 0.15)), 1 - doux(pr(t, b - 0.15, 0.15)));
    let x = lerp(-40, STAND[0], doux(pr(t, J.entree[0], J.entree[1] - J.entree[0]))), marche = fd(...J.entree), arrose = 0, verse = false;
    J.marche.forEach(([a, b], k) => { x += (STAND[k + 1] - STAND[k]) * doux(pr(t, a, b - a)); marche = Math.max(marche, fd(a, b)); });
    for (const [a, b] of J.arrose) { arrose = Math.max(arrose, Math.min(doux(pr(t, a, 0.3)), 1 - doux(pr(t, b - 0.3, 0.3)))); if (t > a + 0.25 && t < b - 0.25) verse = true; }
    const libre = (1 - marche) * (1 - arrose) * doux(pr(t, J.entree[1], 0.5)) * (1 - doux(pr(t, S.fin.t0 - 0.5, 0.5)));      // il regarde la leçon
    return { x, t, marche, phase: x * globalThis.JARDINIER.PAS_MARCHE, elan: 0, arrose, verse, tete: 0.1 * arrose - 0.3 * libre, geste: { nom: 'regard', k: libre }, chapeau: Math.sin(Math.PI * pr(t, S.fin.chapeau, 1.4)) };
  }
  // le chien : il arrive par la droite pendant l'ouverture, puis suit le jardinier d'arbre en arbre
  const DEHORS = LU + 34;
  // Le chien est l'acteur de deux scènes (voir acteur), et chaque déplacement a une raison que l'on voit :
  // 1. l'expérience aléatoire — il sort du jardin par la gauche pendant l'intertitre, entre par la gauche le long de
  //    la table, pousse le dé du museau, le regarde rouler, puis repart par la gauche et rentre au jardin par la gauche ;
  // 5. l'arbre — il sort du jardin par la gauche, entre par la gauche jusqu'à la racine, suit le chemin (R ; V), saute
  //    d'un petit bond vertical sur l'issue (V ; R), remonte ce chemin jusqu'à la racine, et repart par la gauche.
  const AH = S.hasard, AB = S.arbre, T1 = S.CH.map((c) => c.t1), EN_SCENE = [];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], [L(2) - S.INTER + 0.6, L(2) - S.INTER + 2.4, DS[0], -45],
    ...J.marche.map(([a, b], k) => k === 0 ? [T1[0] + 1.0, T1[0] + 2.8, -45, DS[1]] : k === 4 ? [T1[4] + 1.0, T1[4] + 2.8, -45, DS[5]] : [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [AB.feuilles + 0.2, AB.entree[0], DS[4], -45]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 1. le dé
    if (t >= AH.entree[0] && t < AH.sortie + 1.7) { const e = DE.ech, xd = DE.x0 - 122; let x = xd, face = 1, pose;
      if (t < AH.pousse - 0.3) { const k = doux(pr(t, AH.entree[0], AH.entree[1] - AH.entree[0])); x = lerp(-140, xd, k); pose = k < 1 ? trot(t, x, e) : { t, tete: 0.1 }; }
      else if (t < AH.pousse + 0.5) { const k = Math.sin(Math.PI * pr(t, AH.pousse - 0.3, 0.8)); x = xd + 26 * k; pose = { t, tete: 0.1 + 0.5 * k, bas: 0.8 * k }; }                // le coup de museau
      else if (t < AH.sortie) pose = assisP(t, doux(pr(t, AH.pousse + 0.5, 0.4)), -0.1);
      else { x = lerp(xd, -170, doux(pr(t, AH.sortie, 1.6))); face = -1; pose = trot(t, x, e); }
      K.chienSur(ctx, x, DE.sol, 0, e, { ...pose, face }); }
    // 5. l'arbre
    if (t >= AB.entree[0] && t < AB.sortie + 1.1) { const c = cheminChien(t), e = AR.ech;
      const pose = c.saut !== undefined ? (c.saut <= 0 ? { t, bas: 2.2 * c.prep } : c.saut < 0.3 ? { t, allure: 'vol', vol: c.saut / 0.3, tang: 0.3 } : c.saut < 1 ? K.poseChute(t) : { t }) : c.marche ? trot(t, c.p[0] * 1.15, e) : assisP(t, c.assis || 0);
      K.chienSur(ctx, c.p[0], c.p[1] - 2, c.an, e, { ...pose, face: c.face }); }
  }
  function chienA(t) {
    let x = DEHORS, bouge = 0, face = -1;
    for (const [a, b, xa, xb] of TRAJETS) { if (t >= a) x = lerp(xa, xb, doux(pr(t, a, b - a))); bouge = Math.max(bouge, Math.min(pr(t, a - 0.35, 0.3), 1 - pr(t, b, 0.3))); if (xb > xa) face += 2 * (doux(pr(t, a - 0.3, 0.3)) - doux(pr(t, b, 0.3))); }
    face = borne(face, -1, 1);                                                // deux trajets vers la droite qui se suivent ne doivent pas s'additionner
    const assis = 1 - doux(bouge), trotte = TRAJETS.some(([a, b]) => t > a && t < b);
    const P = { x, face, t, assis, tang: 0, tete: 0, cou: 0, bas: 0, saut: 0, vol: 0, phase: 0, allure: 'pose', queue: { a: lerp(-1.15, -0.35, assis), amp: lerp(0.06, 0.4, assis), f: 8, courbe: lerp(0.1, -0.12, assis) } };
    if (trotte) { P.allure = 'trot'; P.phase = x * 0.33; P.queue = { a: -0.35, amp: 0.25, f: 8, courbe: 0.06 }; }
    if (t > S.fin.t0) P.queue.amp = 0.7;
    return P;
  }
  function jardin(ctx, t) {
    const j = jardinierA(t), ch = chienA(t);
    ctx.save(); ctx.translate(0, SOLPX); ctx.scale(SC, SC);
    const pieds = [j.x - 1.5, j.x + 2, ch.x - 7, ch.x + 7];
    K.dessinerPrairie(ctx, t, 0, [0, 1], pieds);
    for (const a of ARBRES) K.dessinerArbre(ctx, t, a);
    if (!VIGNETTE && ch.x < LU + 28 && ch.x > -32 && !EN_SCENE.some(([a, b]) => t >= a && t < b)) globalThis.CHIEN.dessiner(ctx, ch);
    const { bec } = globalThis.JARDINIER.dessiner(ctx, j);
    if (j.verse) { ctx.save(); ctx.fillStyle = C.edifice;                                       // l'arrosoir verse des symboles
      G.decor(() => { ctx.font = `700 8.5px ${F.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let i = 0; i < 5; i++) { const ph = (t * 1.15 + i / 5) % 1, ec = (i % 3 - 1) * 3.2; ctx.globalAlpha = 0.95 - ph * 0.4; ctx.fillText('+×π=∑'[(i + Math.floor(t * 1.15 + i / 5)) % 5], bec[0] + 1.5 + ec + ph * (1.5 + ec * 0.4), bec[1] + 2 + ph * ph * (-bec[1] - 5)); } });
      ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.ellipse(bec[0] + 2, 0.5, 9, 1.8, 0, 0, 6.3); ctx.fill(); ctx.restore(); }
    K.dessinerPrairie(ctx, t, 0, [2], pieds);
    ctx.restore();
  }

  // ---------- la vignette (image d'attente du lecteur, miniature YouTube) ----------
  // Elle n'appartient pas au film : `node engine/render.js stills 1000` la dessine (tout instant au-delà de la durée
  // plus 100 s). Le titre, le chien devant le dé qu'il vient de lancer, l'univers, le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, TITRE, 76, 400, { size: 180, w: 800, align: 'left' });
    seg(ctx, [90, 760], [1830, 760], { c: C.gl, lw: 4 });
    K.chienSur(ctx, 380, 760, 0, 5.2, { t: 0.4, tete: 0.15, queue: { a: -0.35, amp: 0.45, f: 8, courbe: 0.06 } });
    de(ctx, 700, 760 - 84, 168, 4, 0); de(ctx, 915, 760 - 60, 120, 6, 0.0);
    formule(ctx, 'o_om', 1400, 660, { fs: 70, mil: 1 });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    hasard(ctx, ts); operations(ctx, ts); loi(ctx, ts); formules(ctx, ts); arbre(ctx, ts); sachant(ctx, ts); bilan(ctx, ts); fin(ctx, t);
    intertitre(ctx, t);
    jardin(ctx, t);
    acteur(ctx, t);
    // éclair bref sur les deux temps forts (l'oméga du logo, la fin) : l'image frappe à l'instant où le son frappe
    for (const [te, c, f] of [[S.ouverture.logo[2], '255,109,125', 0.13], [S.fin.t0, '231,233,237', 0.14]]) { const u = t - te; if (u >= 0 && u < 0.3) { ctx.fillStyle = `rgba(${c},${f * (1 - u / 0.3)})`; ctx.fillRect(0, 0, W, H); } }
    const f = pr(t, S.DURATION - 0.9, 0.8); if (f > 0) { ctx.fillStyle = `rgba(18,20,24,${f})`; ctx.fillRect(0, 0, W, H); }
  }

  Studio.film({
    draw, fadeOut: 0, post: { paper: 0, grain: 0, vignette: 0 },
    init: async () => {
      const charge = async (fam, f, weight, style = 'normal') => { const ff = new FontFace(fam, `url(fonts/${f})`, { weight, style }); document.fonts.add(ff); await ff.load(); };
      for (const w of [400, 500, 600, 700, 800]) await charge('Spectral', `spectral-latin-${w}-normal.woff2`, String(w));
      await charge('GFS Didot', 'gfs-didot-greek-400-normal.woff2', '400'); await charge('Spectral', 'spectral-latin-700-italic.woff2', '700', 'italic'); await charge('Spectral', 'spectral-latin-500-italic.woff2', '500', 'italic');
      for (const w of [400, 500, 600]) await charge('IBM Plex Sans', `ibm-plex-sans-latin-${w}-normal.woff2`, String(w));
      await charge('KaTeX_Main', 'KaTeX_Main-Regular.woff2', '400'); await charge('KaTeX_Math', 'KaTeX_Math-Italic.woff2', '400', 'italic'); await charge('KaTeX_AMS', 'KaTeX_AMS-Regular.woff2', '400');
      for (const w of [500, 700]) await charge('IBM Plex Mono', `ibm-plex-mono-latin-${w}-normal.woff2`, String(w));
      await K.chargerFormules();
    },
  });
})();

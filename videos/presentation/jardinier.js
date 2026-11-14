// LE JARDINIER — redessiné pour la vidéo : un professeur en costume trois pièces, cheveux châtains, petites lunettes
// rondes, chapeau de paille en courbe en cloche. Squelette posé par cinématique inverse, aplats par-dessus.
// Unités du jardin : le sol est en y = 0, il regarde vers la droite.
//   JARDINIER.dessiner(ctx, { x, t, marche, phase, elan, arrose, tete, geste: { nom, k }, chapeau })  ->  { bec: [x, y] }
(function () {
  const borne = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k, mix = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  // costume bleu nuit (les bleus sombres du symbole de l'édifice), gilet un ton plus clair ; cravate et chapeau orange,
  // arrosoir en zinc, pour ne pas se confondre avec le costume
  const T = { costume: '#1d5e96', ombre: '#0f416d', gilet: '#2f7cc4', revers: '#0f416d', chemise: '#eef0f3', cravate: '#ffa24a', peau: '#e9bd9b', peauOmbre: '#d3a280', cheveux: '#8a5a3a', meche: '#754a2e',
    soulier: '#6b4433', lunettes: '#1b1e24', verre: '#cfe3f7', chapeau: '#ffa24a', ruban: '#d26d00', arrosoir: '#d6d9de', craie: '#3f4550' };
  const CUISSE = 8.1, JAMBE = 8.1, BRAS = 6.3, AVANT = 6.1, DOS = 12;
  function plier(a, b, l1, l2, sens) {
    let dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1e-6; const m = l1 + l2 - 0.02;
    if (d > m) { b = [a[0] + dx / d * m, a[1] + dy / d * m]; d = m; }
    const a1 = Math.atan2(b[1] - a[1], b[0] - a[0]), A = Math.acos(borne((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    return { j: [a[0] + l1 * Math.cos(a1 + sens * A), a[1] + l1 * Math.sin(a1 + sens * A)], b };
  }
  function dessiner(ctx, p) {
    const t = p.t || 0, m = p.marche || 0, ph = p.phase || 0, el = p.elan || 0, ar = p.arrose || 0, g = p.geste || { nom: '', k: 0 };
    const pas = lerp(4.6, 6.6, el), penche = 0.05 * m + 0.14 * el * m + 0.2 * ar, rebond = m * (0.5 + 0.5 * el) * Math.abs(Math.cos(ph)) * 0.9 + 0.5 * ar;
    const H = [1.6 * ar, -(CUISSE + JAMBE + 1.9) + rebond + 0.12 * Math.sin(t * 1.7) * (1 - m)];                       // hanche ; il respire quand il est immobile
    const co = Math.cos(penche), si = Math.sin(penche), buste = (lx, ly) => [H[0] + lx * co - ly * si, H[1] + lx * si + ly * co];   // repère du buste : y vers le bas
    const E = buste(0.5, -DOS), cou = buste(0.9, -DOS - 0.9), tete = [cou[0] + 0.5, cou[1] - 3.4];
    ctx.save(); ctx.translate(p.x, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const trait = (pts, lw, c) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };
    const disque = (c, x, y, r) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); };
    // ----- jambes : le pied avance levé, recule posé (il ne glisse pas quand la phase suit le chemin parcouru) -----
    const jambe = (loin) => {
      const f = ph + (loin ? Math.PI : 0), c = loin ? T.ombre : T.costume;
      let P = [(loin ? -1.3 : 1.5) + 2.2 * ar * (loin ? -1 : 1), 0];
      if (m > 0) P = mix(P, [-pas * Math.cos(f), -Math.max(0, Math.sin(f)) * lerp(2.2, 4.2, el)], m);
      // la cheville est au-dessus du soulier : la jambe s'arrête dedans, elle ne le traverse plus
      const o = [H[0] + (loin ? 0.5 : 0), H[1]], r = plier(o, [P[0], P[1] - 2.3], CUISSE, JAMBE, -1), leve = m * Math.max(0, Math.sin(f));
      trait([o, r.j], 4.3, c); trait([r.j, r.b], 3.4, c);
      ctx.save(); ctx.translate(r.b[0], r.b[1]); ctx.rotate(leve * (Math.cos(f) > 0 ? 0.55 : -0.3)); ctx.fillStyle = T.soulier;       // pointe basse quand le pied quitte le sol, relevée quand il va se poser
      ctx.beginPath(); ctx.moveTo(-1.95, -0.9); ctx.quadraticCurveTo(-2.2, 2.3, -1.6, 2.3); ctx.lineTo(3.7, 2.3); ctx.quadraticCurveTo(4.5, 2.2, 4.1, 1.3); ctx.quadraticCurveTo(2.9, -0.1, 1.9, -0.7); ctx.lineTo(1.9, -0.9); ctx.closePath(); ctx.fill();
      ctx.fillStyle = c; ctx.fillRect(-1.95, -1.6, 3.85, 1.0); ctx.restore();                                                          // le bas du pantalon
    };
    // ----- bras libre (le gauche, derrière le buste) : il balance, se pose sur la hanche, s'essuie le front, salue, lève le chapeau -----
    const ch = p.chapeau || 0, chap = [tete[0] - 0.3 - ch * 2.6, tete[1] - 2.5 - ch * 6.2], rotChap = -0.03 - ch * 0.5;
    let main = [E[0] + 0.4 + m * 4.4 * Math.cos(ph), E[1] + BRAS + AVANT - 0.5 - m * 0.8 * Math.abs(Math.cos(ph))];
    const but = { front: [tete[0] + 3.2 + 0.7 * Math.sin(t * 9), tete[1] - 1.2], salut: [E[0] + 8.2 + 1.6 * Math.sin(t * 10), E[1] - 7.2], regard: [tete[0] + 5.0, tete[1] - 2.4] }[g.nom];
    if (but && g.k > 0) main = mix(main, but, g.k);
    if (ch > 0) main = mix(main, [chap[0] + 6.8 * Math.cos(rotChap), chap[1] + 6.8 * Math.sin(rotChap) + 0.4], borne(ch * 2.2));
    const bras = (o, cible, c, lw) => { const r = plier(o, cible, BRAS, AVANT, 1); trait([o, r.j], lw, c); trait([r.j, r.b], lw - 0.6, c); disque(T.peau, r.b[0], r.b[1], 1.25); return r.b; };
    const devant = !!(but && g.k > 0.35);                                    // levé, le bras passe devant la tête
    if (!devant) bras([E[0] + 0.6, E[1] + 0.9], main, T.ombre, 3.3);
    jambe(true); jambe(false);
    // ----- buste : veste ouverte sur le gilet, chemise, cravate, craie dans la pochette -----
    ctx.save(); ctx.translate(H[0], H[1]); ctx.rotate(penche);
    ctx.fillStyle = T.costume; ctx.beginPath(); ctx.moveTo(-3.3, 2.3); ctx.quadraticCurveTo(-3.9, -6, -2.7, -11.4); ctx.quadraticCurveTo(-1.6, -13.2, 0.9, -13.1); ctx.quadraticCurveTo(3.3, -12.6, 3.7, -10.6); ctx.quadraticCurveTo(4.3, -4, 3.5, 2.7); ctx.quadraticCurveTo(0, 3.4, -3.3, 2.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = T.gilet; ctx.beginPath(); ctx.moveTo(1.5, -11.6); ctx.lineTo(3.7, -10.3); ctx.quadraticCurveTo(4.2, -5, 3.7, 0.6); ctx.lineTo(1.9, 1.2); ctx.quadraticCurveTo(2.4, -5, 1.5, -11.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = T.chemise; ctx.beginPath(); ctx.moveTo(1.2, -13); ctx.lineTo(3.6, -10.6); ctx.lineTo(3.0, -8.2); ctx.lineTo(1.7, -10.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = T.cravate; ctx.lineWidth = 1.05; ctx.beginPath(); ctx.moveTo(2.9, -11.2); ctx.lineTo(3.25, -8.4); ctx.stroke();
    ctx.strokeStyle = T.revers; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(1.1, -12.6); ctx.quadraticCurveTo(2.6, -8, 1.9, -3.4); ctx.stroke();                 // revers de la veste
    ctx.fillStyle = T.chemise; ctx.save(); ctx.translate(-0.1, -8.6); ctx.rotate(-0.25); ctx.fillRect(-0.9, -0.5, 1.9, 1.0); ctx.restore();                          // la craie
    ctx.fillStyle = T.cravate; for (const y of [-6.4, -4.3, -2.2]) { ctx.beginPath(); ctx.arc(3.25, y, 0.33, 0, 6.3); ctx.fill(); }                               // boutons du gilet
    ctx.restore();
    // ----- cou et tête : pas de visage, les lunettes suffisent -----
    trait([buste(0.9, -DOS + 0.6), [tete[0] - 0.2, tete[1] + 1.2]], 2.5, T.peauOmbre);
    ctx.save(); ctx.translate(tete[0], tete[1]); ctx.rotate(p.tete || 0);
    disque(T.peau, 0, 0, 3.35); ctx.fillStyle = T.peau; ctx.beginPath(); ctx.moveTo(2.9, -1.0); ctx.quadraticCurveTo(4.25, 0.2, 3.0, 0.9); ctx.closePath(); ctx.fill();                 // le nez, à peine
    // cheveux mi-longs : trois mèches sur la nuque, qui suivent le pas avec un temps de retard, et une houppe que le chapeau libère
    { const bal = m * 0.22 * Math.sin(ph * 2 - 0.9) + 0.05 * Math.sin(t * 2.1) + 0.5 * ch * Math.sin(t * 7) * (1 - ch) + 0.18 * el * m, hop = ch;
      ctx.fillStyle = T.meche; [[-2.5, 0.6, 3.2, 1.45, 0.5], [-1.9, 1.4, 2.75, 1.3, 0.3], [-3.0, -0.6, 3.0, 1.35, 0.7]].forEach(([x, y, lg, ep, a0], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a0 + bal * (1 + 0.35 * i)); ctx.beginPath(); ctx.moveTo(-ep, 0); ctx.quadraticCurveTo(-ep * 1.1, lg * 0.7, 0.2, lg); ctx.quadraticCurveTo(ep * 1.1, lg * 0.6, ep, 0); ctx.closePath(); ctx.fill(); ctx.restore(); });
      ctx.fillStyle = T.cheveux; ctx.beginPath(); ctx.moveTo(2.5, -2.5); ctx.quadraticCurveTo(1.6, -4.6 - 1.1 * hop, -0.6, -4.3 - 0.9 * hop); ctx.quadraticCurveTo(-3.6, -3.9 - 0.4 * hop, -4.0, -0.9); ctx.quadraticCurveTo(-4.2, 1.2, -3.2, 2.2); ctx.quadraticCurveTo(-2.4, 2.4, -1.7, 1.6); ctx.quadraticCurveTo(-1.5, 0.3, -0.5, -0.7); ctx.quadraticCurveTo(0.8, -1.7, 2.5, -2.5); ctx.closePath(); ctx.fill();
      if (hop > 0.05) { ctx.save(); ctx.translate(0.6, -4.1 - hop); ctx.rotate(-0.5 + 0.35 * Math.sin(t * 8) * (1 - hop * 0.5)); ctx.beginPath(); ctx.moveTo(-1.1, 0.4); ctx.quadraticCurveTo(-0.6, -2.2 * hop, 1.3, -1.6 * hop); ctx.quadraticCurveTo(0.9, -0.2, 1.1, 0.5); ctx.closePath(); ctx.fill(); ctx.restore(); } }
    disque(T.peauOmbre, -0.7, 0.5, 0.75);                                                                                              // l'oreille
    ctx.fillStyle = T.verre; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(1.75, -0.35, 1.02, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = T.lunettes; ctx.lineWidth = 0.36; ctx.beginPath(); ctx.arc(1.75, -0.35, 1.02, 0, 6.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0.73, -0.45); ctx.lineTo(-0.7, -0.05); ctx.moveTo(2.77, -0.4); ctx.lineTo(3.2, -0.5); ctx.stroke();
    ctx.restore();
    // ----- chapeau : la courbe en cloche -----
    ctx.save(); ctx.translate(chap[0], chap[1]); ctx.rotate(rotChap + (p.tete || 0) * 0.8);
    const gz = (u) => Math.exp(-u * u / 14) * 6.6; ctx.fillStyle = T.chapeau; ctx.beginPath(); ctx.moveTo(-8.4, 0); for (let u = -8.4; u <= 8.4; u += 0.6) ctx.lineTo(u, -gz(u)); ctx.lineTo(8.4, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = T.chapeau; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(-9.2, 0); ctx.lineTo(9.2, 0); ctx.stroke();
    ctx.strokeStyle = T.ruban; ctx.lineWidth = 1.1; ctx.lineCap = 'butt'; ctx.beginPath(); for (let u = -3.5; u <= 3.5; u += 0.5) ctx[u === -3.5 ? 'moveTo' : 'lineTo'](u, -gz(u) * 0.33 - 0.9); ctx.stroke();
    ctx.restore(); ctx.lineCap = 'round';
    if (devant) bras([E[0] + 0.6, E[1] + 0.9], main, T.ombre, 3.3);
    // ----- bras droit et arrosoir -----
    const incl = ar, mainD = [E[0] + lerp(5.6, 8.4, ar) + m * 0.6 * Math.cos(ph + 1), E[1] + lerp(9.6, 7.4, ar) + m * 0.5 * Math.sin(ph * 2)], md = bras([E[0] - 0.2, E[1] + 1], mainD, T.costume, 3.5);
    const rot = incl * 0.62, KA = 0.74;
    ctx.save(); ctx.translate(md[0], md[1]); ctx.rotate(rot); ctx.scale(KA, KA); ctx.translate(1.2, 8.2); ctx.strokeStyle = T.arrosoir; ctx.fillStyle = T.arrosoir; ctx.lineWidth = 1.7;
    ctx.beginPath(); ctx.arc(-1.2, -4.2, 4.2, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.beginPath(); ctx.roundRect(-5, -4, 9.5, 8.5, 1.6); ctx.fill();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(3.5, 2.5); ctx.lineTo(10.5, -3.2); ctx.stroke(); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(9.4, -5); ctx.lineTo(11.8, -1.6); ctx.stroke();
    ctx.strokeStyle = T.craie; ctx.lineWidth = 0.85; ctx.beginPath(); ctx.moveTo(-2.9, -1.7); ctx.lineTo(2.3, -1.7); ctx.moveTo(-1.5, -1.7); ctx.lineTo(-1.9, 2.6); ctx.moveTo(0.9, -1.7); ctx.quadraticCurveTo(0.8, 2.3, 2.0, 2.5); ctx.stroke();     // le π, à la craie sur l'arrosoir
    ctx.restore();
    disque(T.peau, md[0], md[1], 1.25);
    ctx.restore();
    const bx = (1.2 + 11.2) * KA, by = (8.2 - 3) * KA;                                                                                         // la pomme de l'arrosoir, dans le repère de la main
    return { bec: [p.x + md[0] + bx * Math.cos(rot) - by * Math.sin(rot), md[1] + bx * Math.sin(rot) + by * Math.cos(rot)] };
  }
  globalThis.JARDINIER = { dessiner, TEINTES: T, PAS_MARCHE: Math.PI * 2 / (4 * 4.6) };
})();

// LE LABRADOR — redessiné pour la vidéo : un squelette (hanche, épaule, genou, jarret, coude) posé par cinématique
// inverse, et des aplats par-dessus. Unités du jardin : le sol est en y = 0, le chien regarde vers la droite.
//   CHIEN.dessiner(ctx, { x, face, t, assis, tang, saut, bas, tete, queue: { a, amp, f }, allure, phase, vol })
(function () {
  const borne = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k;
  // labrador chocolat : la robe est éclaircie par rapport à la photo de référence, pour rester lisible sur le fond sombre
  const TEINTES = { robe: '#7d5140', cuisse: '#6f4636', ombre: '#553529', clair: '#93634e', oreille: '#5e3b2d', truffe: '#8d6557', oeil: '#c8893c', noir: '#1b1e24', collier: '#ffa24a' };
  const HANCHE = [-6.2, -11.7], EPAULE = [7.0, -11.3];
  // le tronc, hanche à l'origine : croupe, dos légèrement creusé, garrot, poitrail profond, ventre relevé, cuisse
  const TRONC = new Path2D('M-3 -3.2 C2 -3.8 8 -3.5 12.4 -4 C14.2 -4.2 15.8 -3.9 16.5 -2.8 C17.6 -1 17.5 2 16.6 3.6 C15.6 5.2 13.8 5.7 12.2 5.5 C9 5.2 5.6 4.5 2.2 4.2 C-0.6 4 -3 3.9 -3.9 1 C-4.4 -0.8 -4 -2.7 -3 -3.2 Z');
  // tête large, museau court et carré, oreille tombante attachée haut et en arrière
  const MUSEAU = new Path2D('M1.2 -3 C3.4 -3.1 5.4 -2.7 6.8 -2.3 C7.8 -2 8.1 -1 8 0.3 C7.9 1.8 7 2.7 5.4 2.8 C3.8 2.9 2.2 2.8 1.2 2.6 Z');
  const OREILLE = new Path2D('M-2.6 -3.4 C-0.4 -4.3 1.7 -3.4 1.9 -1.2 C2.1 1.2 1.3 3.6 -0.3 4.9 C-1.9 4.4 -3.3 2 -3.5 -0.4 C-3.6 -1.8 -3.3 -2.9 -2.6 -3.4 Z');
  // articulation entre a et b pour deux os de longueurs l1 et l2 ; sens = +1 : elle plie vers l'avant
  function plier(a, b, l1, l2, sens) {
    let dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1e-6; const m = l1 + l2 - 0.02;
    if (d > m) { b = [a[0] + dx / d * m, a[1] + dy / d * m]; d = m; }
    const a1 = Math.atan2(b[1] - a[1], b[0] - a[0]), A = Math.acos(borne((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    return { j: [a[0] + l1 * Math.cos(a1 + sens * A), a[1] + l1 * Math.sin(a1 + sens * A)], b };
  }
  function dessiner(ctx, p) {
    const C = TEINTES, s = p.assis || 0, t = p.t || 0, allure = p.allure || 'pose', ph = p.phase || 0;
    let saut = p.saut || 0, tang = (p.tang || 0) + 0.74 * s, bas = p.bas || 0;
    if (allure === 'trot') saut += 0.35 * Math.abs(Math.sin(ph));
    if (allure === 'galop') { tang += 0.13 * Math.sin(ph + 0.4); saut += 0.9 + 0.9 * Math.sin(ph - 1.3); }
    const dir = Math.abs(p.face) < 0.18 ? 0.18 * (p.face < 0 ? -1 : 1) : p.face;
    // la hanche descend quand il s'assoit ; le tronc pivote autour d'elle
    const H = [lerp(HANCHE[0], -5.4, s), lerp(HANCHE[1], -3.7, s) - saut + bas * (1 - s)], co = Math.cos(tang), si = Math.sin(tang);
    const corps = (lx, ly) => [H[0] + lx * co + ly * si, H[1] - lx * si + ly * co];            // repère du tronc → monde
    const E = corps(EPAULE[0] - HANCHE[0], EPAULE[1] - HANCHE[1] + bas * 0.5 * (1 - s));
    // ----- pieds -----
    const pied = (avant, loin) => {
      const x0 = avant ? 7.3 : -7.5, d = loin ? 0.9 : 0;
      if (allure === 'trot') { const f = ph + ((avant ? 0 : Math.PI) + (loin ? Math.PI : 0)); return [x0 + d + 3.3 * Math.sin(f), -Math.max(0, Math.cos(f)) * 2]; }
      if (allure === 'galop') { const f = ph + (avant ? 0 : 2.5) + (loin ? 0.45 : 0); return [x0 + d + (avant ? 1 : -0.5) + 5.4 * Math.sin(f), -saut * 0.55 - Math.max(0, Math.cos(f)) * 3.4]; }
      if (allure === 'vol') { const u = p.vol || 0; return avant ? [E[0] + lerp(3.4, 5.6, u), Math.min(0, E[1] + lerp(7.5, 9.6, u))] : [H[0] - lerp(6.5, 2.4, u) + d * 0.5, Math.min(0, H[1] + lerp(8.6, 9.8, u))]; }
      if (avant) return [lerp(x0, E[0] + 0.3, s) + d * (1 - s), 0];
      return [lerp(x0, H[0] + 5.3, s) + d, 0];
    };
    ctx.save(); ctx.translate(p.x, 0); ctx.scale(dir, 1); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const trait = (pts, lw, c) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };
    const patte = (avant, loin) => {
      const c = loin ? C.ombre : C.robe, ch = loin ? C.ombre : C.cuisse, P = pied(avant, loin);
      if (avant) { const o = loin ? [E[0] + 0.8, E[1] + 0.2] : E, r = plier(o, [P[0], P[1] - 0.9], 5.2, 5.3, 1);
        trait([o, r.j], 3.9, c); trait([r.j, r.b], 3.0, c); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(r.b[0] + 0.7, r.b[1] + 0.05, 1.85, 1.05, 0, 0, 6.3); ctx.fill(); return; }
      // patte arrière : cuisse, jambe, puis le canon du jarret au pied
      const o = loin ? [H[0] + 0.8, H[1] + 0.3] : H, couche = s > 0.5 && allure !== 'vol', jar = couche ? [P[0] - 3.3, P[1] - 1.5] : [P[0] - 1.2, P[1] - 3.8], r = plier(o, jar, 5.1, 5.1, -1);
      trait([o, r.j], loin ? 4.8 : 5.8, ch); trait([r.j, r.b], 3.1, c); trait([r.b, [P[0], P[1] - 0.9]], 2.6, c);
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(P[0] + 0.7, P[1] - 0.8, 1.85, 1.05, 0, 0, 6.3); ctx.fill();
    };
    patte(false, true); patte(true, true);
    // ----- queue : épaisse à l'attache, effilée ; elle part de la croupe et prolonge la ligne du dos -----
    { const q = p.queue || {}, b = corps(-3.3, -1.4), a0 = (q.a ?? -1.15) + tang * 0.7, amp = q.amp ?? 0.05, f = q.f ?? 8, cb = q.courbe ?? 0.1, L = [2.5, 2.4, 2.3, 2.1], Wd = [3.5, 3.0, 2.4, 1.7, 0.8];
      const pts = [b]; for (let i = 0; i < 4; i++) { const a = a0 + amp * Math.sin(t * f - i * 0.75) * (0.45 + 0.3 * i) + i * cb, d = pts[i]; pts.push([d[0] - L[i] * Math.cos(a), Math.min(-0.5, d[1] - L[i] * Math.sin(a))]); }
      const g = [], dr = []; for (let i = 0; i < 5; i++) { const u = pts[Math.min(4, i + 1)], v = pts[Math.max(0, i - 1)], dx = u[0] - v[0], dy = u[1] - v[1], n = Math.hypot(dx, dy) || 1, w = Wd[i] / 2; g.push([pts[i][0] - dy / n * w, pts[i][1] + dx / n * w]); dr.push([pts[i][0] + dy / n * w, pts[i][1] - dx / n * w]); }
      ctx.fillStyle = C.robe; ctx.beginPath(); ctx.moveTo(g[0][0], g[0][1]); for (let i = 1; i < 5; i++) ctx.lineTo(g[i][0], g[i][1]);
      ctx.quadraticCurveTo(pts[4][0] + (pts[4][0] - pts[3][0]) * 0.35, pts[4][1] + (pts[4][1] - pts[3][1]) * 0.35, dr[4][0], dr[4][1]); for (let i = 3; i >= 0; i--) ctx.lineTo(dr[i][0], dr[i][1]); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(b[0], b[1], 1.85, 0, 6.3); ctx.fill(); }
    // ----- tronc -----
    ctx.save(); ctx.translate(H[0], H[1]); ctx.rotate(-tang); ctx.fillStyle = C.robe; ctx.fill(TRONC); ctx.restore();
    patte(false, false);
    // ----- encolure et tête -----
    const n0 = corps(14.4, -0.7), an = 0.8 + 0.34 * s + (p.cou || 0) - (allure === 'galop' ? 0.3 : 0), T0 = [n0[0] + 5.2 * Math.cos(an), n0[1] - 5.2 * Math.sin(an)];
    { const nx = -Math.sin(an), ny = -Math.cos(an); ctx.fillStyle = C.robe; ctx.beginPath(); ctx.moveTo(n0[0] + nx * 3.5 - 1.6 * Math.cos(an), n0[1] + ny * 3.5 + 1.6 * Math.sin(an)); ctx.lineTo(T0[0] + nx * 3.0, T0[1] + ny * 3.0); ctx.lineTo(T0[0] - nx * 3.3, T0[1] - ny * 3.3); ctx.lineTo(n0[0] - nx * 4.2 - 2.2 * Math.cos(an), n0[1] - ny * 4.2 + 2.2 * Math.sin(an)); ctx.closePath(); ctx.fill();
      const c0 = [lerp(n0[0], T0[0], 0.6), lerp(n0[1], T0[1], 0.6)]; trait([[c0[0] + nx * 3.1, c0[1] + ny * 3.1], [c0[0] - nx * 3.55, c0[1] - ny * 3.55]], 1.3, C.collier); }
    patte(true, false);
    ctx.translate(T0[0], T0[1]); ctx.rotate((p.tete || 0) + (allure === 'trot' ? 0.04 * Math.sin(ph * 2) : 0));
    ctx.fillStyle = C.robe; ctx.beginPath(); ctx.ellipse(0.2, -0.8, 4.1, 3.9, 0, 0, 6.3); ctx.fill(); ctx.fill(MUSEAU);
    ctx.fillStyle = C.clair; ctx.beginPath(); ctx.ellipse(5.3, -1.5, 1.9, 0.7, 0.12, 0, 6.3); ctx.fill();                              // chanfrein, un ton plus clair
    ctx.strokeStyle = C.ombre; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(7.7, 1.0); ctx.quadraticCurveTo(5.8, 1.5, 3.9, 1.0); ctx.stroke();           // la babine
    ctx.fillStyle = C.truffe; ctx.beginPath(); ctx.ellipse(7.45, -1.3, 0.85, 0.95, 0, 0, 6.3); ctx.fill();                              // truffe brun rosé du labrador chocolat
    ctx.fillStyle = C.ombre; ctx.beginPath(); ctx.arc(7.75, -1.1, 0.28, 0, 6.3); ctx.fill();
    ctx.fillStyle = C.oeil; ctx.beginPath(); ctx.arc(2.9, -1.7, 0.74, 0, 6.3); ctx.fill(); ctx.fillStyle = C.noir; ctx.beginPath(); ctx.arc(3.0, -1.7, 0.5, 0, 6.3); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(3.18, -1.92, 0.17, 0, 6.3); ctx.fill();
    ctx.fillStyle = C.clair; ctx.beginPath(); ctx.ellipse(2.7, -3.05, 0.95, 0.42, -0.5, 0, 6.3); ctx.fill();                          // le sourcil : une touche claire, relevée vers l'arrière
    ctx.save(); ctx.translate(-1, -3); ctx.rotate((allure === 'trot' || allure === 'galop' ? 0.2 * Math.sin(ph * 2) : 0) + (allure === 'vol' ? -0.45 : 0) + 0.25 * (p.tete || 0)); ctx.scale(0.84, 0.86); ctx.translate(1.3, 3.2); ctx.fillStyle = C.oreille; ctx.fill(OREILLE); ctx.restore();
    ctx.restore();
  }
  globalThis.CHIEN = { dessiner, TEINTES };
})();

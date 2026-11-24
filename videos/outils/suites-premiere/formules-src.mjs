// Les formules de la vidéo « Notion de suite », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Termes en bleu ; raison r en orange, raison q en violet ; résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#c793e6';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, r = o('r'), q = v('q');
export default [
  ['s_def', `(u_n):\\ n\\longmapsto u_n`], ...[0, 1, 2, 3, 4].map((i) => [`s_u${i}`, `u_${i}`]), ...[1, 3, 5, 7, 9].map((x, i) => [`s_v${i}`, String(x), 'bleu']), ['s_pts', '\\cdots'], ['s_u6', `u_6=${t(13)}`],
  ['r_def', `u_{n+1}=f(u_n)`], ['r_u', `u_0=${b(1)}\\qquad u_{n+1}=u_n+2`], ['r_1', '1', 'bleu'], ['r_3', '3', 'bleu'], ['r_5', '5', 'bleu'], ['r_7', '7', 'bleu'], ['r_p2', '+2', 'orange'],
  ['r_v', `v_1=${b(2)}\\qquad v_{n+1}=${f('v_n', 'v_n+3')}`], ['r_v2', `v_2=${f(b(2), `${b(2)}+3`)}=${t(f(2, 5))}`], ['r_v3', `v_3=${f(`\\frac25`, `\\frac25+3`)}=${t(f(2, 17))}`],
  ['x_def', `u_n=f(n)`], ['x_u', `u_n=2n+1`], ['x_w', `w_n=${f('\\sqrt{n}', 'n^2+1')}`], ['x_w9', `w_9=${f('\\sqrt{9}', '9^2+1')}=${t(f(3, 82))}`],
  ['v_c', `u_{n+1}\\geqslant u_n`], ['v_d', `u_{n+1}\\leqslant u_n`], ['v_m', `\\text{signe de }\\ u_{n+1}-u_n`], ['v_u', `u_n=${f('3n-2', 'n+1')}`, 'bleu'],
  ['v_1', `u_{n+1}-u_n=${f('3n+1', 'n+2')}-${f('3n-2', 'n+1')}`], ['v_2', `=${f('(3n+1)(n+1)-(3n-2)(n+2)', '(n+2)(n+1)')}`], ['v_3', `=${t(f(5, '(n+1)(n+2)'))}>0`],
  ['v_q', `v_n=${f('2^{3n}', '3^{2n}')}>0\\qquad ${f('v_{n+1}', 'v_n')}=${f('2^3', '3^2')}=${t(f(8, 9))}<1`],
  ['a_def', `u_{n+1}=u_n+${r}`], ['a_p', `+\\frac12`, 'orange'], ['a_u0', `u_0=\\frac34`, 'bleu'],
  ['a_m', `u_n=2n+3\\qquad u_{n+1}-u_n=2(n+1)+3-(2n+3)=${o(2)}`], ['a_f1', `u_n=u_0+n${r}`], ['a_f2', `u_n=u_p+(n-p)${r}`],
  ['a_e', `u_0=${f(3, 4)},\\ ${r}=${o(f(1, 2))}\\qquad u_n=${f(3, 4)}+${f('n', 2)}=${f('3+2n', 4)}`], ['a_20', `u_{20}=${f('3+2\\times20', 4)}=${t(f(43, 4))}`],
  ['g_def', `v_{n+1}=v_n\\times ${q}`], ...[1, 5, 25, 125, 625].map((x, i) => [`g_c${i}`, String(x), 'bleu']), ['g_x5', '\\times5', 'exercices'], ['g_v0', `v_0=${b(1)},\\quad ${q}=${v(5)}`],
  ['g_m', `v_n=2\\times3^n\\qquad ${f('v_{n+1}', 'v_n')}=${f('2\\times3^{n+1}', '2\\times3^n')}=${v(3)}`], ['g_f1', `v_n=v_0\\times ${q}^{\\,n}`], ['g_f2', `v_n=v_p\\times ${q}^{\\,n-p}`],
  ['t_a1', `u_{n+1}=u_n+${r}`], ['t_g1', `v_{n+1}=v_n\\times ${q}`], ['t_a2', `u_n=u_0+n${r}`], ['t_g2', `v_n=v_0\\times ${q}^{\\,n}`],
  ['m_S', `S=1+2+3+4+5+6`], ['m_2S', `2S=6\\times7=42`], ['m_21', `S=${t(21)}`], ['m_p', `1+2+3+\\cdots+n=${f('n(n+1)', 2)}`],
  ['m_15', `1+2+3+\\cdots+15=${f('15\\times16', 2)}=${t(120)}`], ['m_ar', `1+4+7+10+\\cdots+31`], ['m_ar2', `=11\\times${f('1+31', 2)}=${t(176)}`],
  ['m_g', `1+${q}+${q}^2+\\cdots+${q}^{\\,n}=${f(`1-${q}^{\\,n+1}`, `1-${q}`)}\\qquad(${q}\\neq1)`], ['m_g1', `1+2+2^2+\\cdots+2^8=${f('1-2^9', '1-2')}=2^9-1=${t(511)}`],
  ['m_g2', `3+6+12+\\cdots+384=3\\times(1+2+\\cdots+2^7)`], ['m_g3', `=3\\times${f('1-2^8', '1-2')}=${t(765)}`],
  ['b_sg', `1+${q}+\\cdots+${q}^{\\,n}=${f(`1-${q}^{\\,n+1}`, `1-${q}`)}`],
  ['b_a', `u_n=u_0+n${r}`], ['b_g', `v_n=v_0\\times ${q}^{\\,n}`], ['b_s', `1+2+\\cdots+n=${f('n(n+1)', 2)}`],
];

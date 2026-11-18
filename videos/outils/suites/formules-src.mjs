// Les formules de la vidéo « Les suites numériques », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Points de la suite en bleu ; limite et résultats en turquoise ; bande et hypothèse de récurrence en orange ; gendarmes en violet.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`, lim = '\\lim\\limits_{n\\to+\\infty}';
export default [
  ['r_P', `P_n:\\quad 1+2+3+\\cdots+n=${f('n(n+1)', 2)}`], ['r_i', `n=1:\\qquad 1=${f('1\\times2', 2)}`], ['r_h1', `1+2+\\cdots+k+(k+1)=${o(f('k(k+1)', 2))}+(k+1)`], ['r_h2', `=(k+1)\\left(${f('k', 2)}+1\\right)`], ['r_h3', `=${t(f('(k+1)(k+2)', 2))}`],
  ['r_p1', `P_n:\\quad 3\\ \\text{divise}\\ 4^n+1`], ['r_p2', `4^{n+1}+1=4\\,(4^n+1)-3`], ['r_p3', `4^0+1=${o(2)}`],
  ['l_u', `${b('u_0')}=1,\\qquad ${b('u_{n+1}')}=${tf(1, 2)}u_n+3`], ['l_def', `\\forall\\varepsilon>0,\\ \\ \\exists N,\\ \\ \\forall n\\geqslant N,\\quad u_n\\in\\,]\\ell-${o('\\varepsilon')}\\,;\\ell+${o('\\varepsilon')}[`], ['l_6', 'y=6', 'cours'], ['l_lim', `${lim}u_n=${t(6)}`],
  ['o_e', `u_n=${f('3n^2-n+1', 'n^2+5')}`], ['o_fi', f('\\infty', '\\infty'), 'orange'], ['o_f', `u_n=${f(`n^2\\left(3-${tf(1, 'n')}+${tf(1, 'n^2')}\\right)`, `n^2\\left(1+${tf(5, 'n^2')}\\right)`)}=${f(`3-${tf(1, 'n')}+${tf(1, 'n^2')}`, `1+${tf(5, 'n^2')}`)}`], ['o_r', `${lim}u_n=${f(3, 1)}=${t(3)}`],
  ['g_th', `u_n\\leqslant v_n\\leqslant w_n\\qquad\\text{et}\\qquad ${lim}u_n=${lim}w_n=\\ell`], ['g_c', `${lim}v_n=\\ell`, 'cours'], ['g_enc', `${v('-' + f(1, 'n'))}\\leqslant${b(f('\\sin n', 'n'))}\\leqslant${v(f(1, 'n'))}`], ['g_lim', `${lim}${f('\\sin n', 'n')}=${t(0)}`],
  ['m_ell', `\\ell=${tf(1, 2)}\\ell+3\\iff${tf(1, 2)}\\ell=3\\iff${t('\\ell=6')}`],
  ['q_1', 'q>1'], ['q_2', '0<q<1'], ['q_3', '-1<q<0'], ['q_4', 'q\\leqslant-1'], ['q_m', '-1<q<1'], ['q_r1', `${lim}q^n=+\\infty`], ['q_r2', `${lim}q^n=${t(0)}`],
  ['q_b', `(1+a)^n\\geqslant1+na\\qquad(a\\geqslant0)`], ['q_e', `u_n=5\\times0{,}8^{\\,n}`], ['q_er', `-1<0{,}8<1\\qquad\\text{donc}\\qquad ${lim}u_n=${t(0)}`],
  ['b_r', `P_n\\Longrightarrow P_{n+1}`], ['b_l', `${lim}u_n=\\ell`], ['b_q', `-1<q<1:\\quad ${lim}q^n=0`],
];

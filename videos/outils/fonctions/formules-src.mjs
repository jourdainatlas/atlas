// Les formules de la vidéo « Fonctions numériques », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
// Courbe de f en bleu ; tangente, asymptote horizontale et résultats en turquoise ; asymptote verticale et facteur u′ en orange.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`, lim = (v) => `\\lim\\limits_{x\\to ${v}}`, inf = '+\\infty';
export default [
  ['l_a', 'a'], ['l_b', 'b'], ['l_k', 'k', 'cours'], ['l_c1', 'c_1', 'cours'], ['l_c2', 'c_2', 'cours'], ['l_c3', 'c_3', 'cours'], ['l_al', '\\alpha', 'cours'], ['l_2', '2', 'cours'], ['l_7', '7', 'orange'],
  // 1. limite en +∞
  ['m_f', `${b('f(x)')}=2+${f(3, 'x-1')}`], ['m_lim', `${lim(inf)}f(x)=${t('2')}`], ['m_y', 'y=2', 'cours'],
  // 2. asymptotes
  ['a_f', `${b('f(x)')}=${f('2x+1', 'x-1')}`], ['a_d', `${lim('1^+')}f(x)=${o(inf)}`], ['a_g', `${lim('1^-')}f(x)=${o('-\\infty')}`], ['a_x1', 'x=1', 'orange'], ['a_y2', 'y=2', 'cours'],
  ['a_f2', `${b('f(x)')}=2+${f(3, 'x-1')}`], ['a_inf', `${lim('\\pm\\infty')}f(x)=${t('2')}`], ['a_pos', `f(x)-2=${f(3, 'x-1')}>0\\quad\\text{pour}\\ x>1`],
  // 3. formes indéterminées, gendarmes
  ['i_1', `(+\\infty)+(-\\infty)`, 'orange'], ['i_2', `0\\times\\infty`, 'orange'], ['i_3', f('\\infty', '\\infty'), 'orange'], ['i_4', f(0, 0), 'orange'],
  ['i_ex', `${lim(inf)}${f('2x^2-3x+1', 'x^2+5')}`], ['i_fact', `${f('2x^2-3x+1', 'x^2+5')}=${f(`x^2\\left(2-${tf(3, 'x')}+${tf(1, 'x^2')}\\right)`, `x^2\\left(1+${tf(5, 'x^2')}\\right)`)}`],
  ['i_res', `=${f(`2-${tf(3, 'x')}+${tf(1, 'x^2')}`, `1+${tf(5, 'x^2')}`)}\\ \\xrightarrow[x\\to+\\infty]{}\\ ${f(2, 1)}=${t('2')}`],
  ['g_enc', `${c(Vi, '-' + f(1, 'x'))}\\leqslant${b(f('\\sin x', 'x'))}\\leqslant${c(Vi, f(1, 'x'))}`], ['g_lim', `${lim(inf)}${f('\\sin x', 'x')}=${t('0')}`], ['g_h', `y=${f(1, 'x')}`, Vi], ['g_b', `y=-${f(1, 'x')}`, Vi],
  // 4. composée
  ['k_th', `(f\\circ u)'(x)=${o("u'(x)")}\\times f'\\big(u(x)\\big)`], ['k_e1', `\\big((3x^2-5)^4\\big)'=4\\times${o('6x')}\\times(3x^2-5)^3`], ['k_r1', `=24x\\,(3x^2-5)^3`, 'cours'],
  ['k_e2', `\\big(\\mathrm{e}^{-2x+3}\\big)'=`], ['k_r2', `${o('-2')}\\,\\mathrm{e}^{-2x+3}`],
  // 5. convexité
  ['x_f', `${b('f(x)')}=x^3-3x^2+2`], ['x_d1', `f'(x)=3x^2-6x`], ['x_d2', `f''(x)=6x-6=6(x-1)`], ['x_neg', `f''(x)\\leqslant0\\ \\text{sur}\\ ]-\\infty\\,;1]`], ['x_pos', `f''(x)\\geqslant0\\ \\text{sur}\\ [1\\,;+\\infty[`],
  ['x_th1', `f\\ \\text{convexe}\\iff f''\\geqslant0`], ['x_th2', `f\\ \\text{concave}\\iff f''\\leqslant0`],
  // 6. continuité
  ['t_def', `${lim('a')}f(x)=f(a)`], ['t_th1', `f\\ \\text{continue sur}\\ [a\\,;b],\\quad k\\ \\text{entre}\\ f(a)\\ \\text{et}\\ f(b)`], ['t_th2', `\\text{il existe}\\ c\\in[a\\,;b]\\ \\text{tel que}\\ f(c)=${t('k')}`],
  ['t_f', `${b('f(x)')}=x^3+x-1`], ['t_der', `f'(x)=3x^2+1>0`], ['t_b1', `f(0{,}6)\\approx-0{,}18<0`], ['t_b2', `f(0{,}7)\\approx0{,}04>0`], ['t_enc', `0{,}6<\\alpha<0{,}7`, 'cours'], ['t_eq', `f(x)=0`],
  // bilan
  ['b_l', `${lim(inf)}f(x)=\\ell`], ['b_x', `f''\\geqslant0`], ['b_t', `f(c)=k`],
];

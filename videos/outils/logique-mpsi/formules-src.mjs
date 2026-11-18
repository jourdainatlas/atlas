// Les formules de la vidéo « Logique et ensembles » (MPSI), en LaTeX : [identifiant, source, couleur (clé de la palette)].
// P en bleu, Q en orange ; x en orange, y (le chien) en turquoise ; partie paire en turquoise, impaire en orange.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, non = '\\text{non}\\ ', R = '\\mathbb{R}', Z = '\\mathbb{Z}', P = b('P'), Q = o('Q'), ov = (s) => `\\overline{${s}}`;
export default [
  ['h_P', 'P', 'bleu'], ['h_Q', 'Q', 'orange'], ['h_imp', `${P}\\Rightarrow${Q}`], ['h_nou', `(${non}${P})\\ \\text{ou}\\ ${Q}`],
  ['l_m1', `${non}(${P}\\ \\text{et}\\ ${Q})\\iff(${non}${P})\\ \\text{ou}\\ (${non}${Q})`], ['l_m2', `${non}(${P}\\ \\text{ou}\\ ${Q})\\iff(${non}${P})\\ \\text{et}\\ (${non}${Q})`],
  ['l_ni', `${non}(${P}\\Rightarrow${Q})\\iff ${P}\\ \\text{et}\\ (${non}${Q})`], ['l_c', `(${P}\\Rightarrow${Q})\\iff(${non}${Q}\\Rightarrow${non}${P})`],
  ['q_a', `\\forall ${o('x')}\\in${R},\\ \\ \\exists ${t('y')}\\in${R},\\quad ${t('y')}>${o('x')}`], ['q_na', `\\exists ${o('x')}\\in${R},\\ \\ \\forall ${t('y')}\\in${R},\\quad ${t('y')}\\leqslant${o('x')}`],
  ['q_b', `\\exists ${t('y')}\\in${R},\\ \\ \\forall ${o('x')}\\in${R},\\quad ${t('y')}>${o('x')}`], ['q_yx', `${t('y')}=${o('x')}+1`], ['q_x', 'x', 'orange'], ['q_y', 'y', 'cours'],
  ['c_e', `\\forall x\\in${R},\\qquad|x-1|+|x+1|\\geqslant2`], ['c_1', `x\\leqslant-1:\\quad(1-x)+(-x-1)=-2x\\geqslant2`], ['c_2', `-1\\leqslant x\\leqslant1:\\quad(1-x)+(x+1)=${t(2)}`], ['c_3', `x\\geqslant1:\\quad(x-1)+(x+1)=2x\\geqslant2`],
  ['a_th', `f=${t('g')}+${o('h')}\\qquad ${t('g')}\\ \\text{paire},\\quad ${o('h')}\\ \\text{impaire}`], ['a_1', `f(x)=${t('g(x)')}+${o('h(x)')}`], ['a_2', `f(-x)=${t('g(x)')}-${o('h(x)')}`],
  ['a_g', `${t('g(x)')}=${f('f(x)+f(-x)', 2)}\\qquad\\quad${o('h(x)')}=${f('f(x)-f(-x)', 2)}`], ['a_s', `${t('g(-x)=g(x)')}\\qquad ${o('h(-x)=-h(x)')}\\qquad g(x)+h(x)=f(x)`],
  ['a_f', 'y=\\mathrm{e}^x', 'bleu'], ['a_lg', `y=${f('\\mathrm{e}^x+\\mathrm{e}^{-x}', 2)}`, 'cours'], ['a_lh', `y=${f('\\mathrm{e}^x-\\mathrm{e}^{-x}', 2)}`, 'orange'],
  ['e_eg', `\\{2a+3b\\mid(a,b)\\in${Z}^2\\}=${Z}`], ['e_i1', `2a+3b\\in${Z}`], ['e_i2', `n=2\\times(-n)+3\\times n`], ['e_dbl', `A=B\\iff(A\\subset B\\ \\ \\text{et}\\ \\ B\\subset A)`],
  ['e_A', 'A', 'bleu'], ['e_B', 'B', 'orange'], ['e_C', 'C', 'cours'], ['e_E', 'E', 'encre2'], ['e_m', `${ov('\\bigcup\\limits_{i\\in I}A_i')}=\\bigcap\\limits_{i\\in I}${ov('A_i')}`], ['e_p', `${Z}=2${Z}\\ \\sqcup\\ (2${Z}+1)`],
  ['e_r', `R=\\{x\\mid x\\notin x\\}`], ['e_r2', `R\\in R\\iff R\\notin R`], ['e_z', `\\{x\\in E\\mid P(x)\\}`],
  ['b_i', `${non}(P\\Rightarrow Q)\\iff P\\ \\text{et}\\ (${non}Q)`], ['b_q', `(\\exists y,\\ \\forall x,\\ P)\\ \\Longrightarrow\\ (\\forall x,\\ \\exists y,\\ P)`], ['b_e', `A=B\\iff A\\subset B\\ \\text{et}\\ B\\subset A`],
];

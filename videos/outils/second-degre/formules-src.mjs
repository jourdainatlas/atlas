// Les formules de la vidéo « Le second degré », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Courbe en bleu ; sommet, racines et résultats en turquoise ; discriminant en orange ; positif en vert, négatif en orange.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff', Ve = '#b6ca4c';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`, D = o('\\Delta');
export default [
  ['t_def', `${b('f(x)')}=ax^2+bx+c\\qquad(a\\neq0)`], ['t_ap', 'a>0'], ['t_an', 'a<0'],
  ['k_th', `f(x)=a(x-${t('\\alpha')})^2+${t('\\beta')}\\qquad\\quad${t('\\alpha')}=-${f('b', '2a')}\\qquad${t('\\beta')}=-${f(D, '4a')}`], ['k_f', `${b('f(x)')}=3x^2-2x-5`],
  ['k_d', `${D}=b^2-4ac=(-2)^2-4\\times3\\times(-5)=${o(64)}`], ['k_a', `${t('\\alpha')}=-${f(-2, '2\\times3')}=${t(f(1, 3))}`], ['k_b', `${t('\\beta')}=-${f(o(64), '4\\times3')}=${t('-' + f(16, 3))}`],
  ['k_c', `${b('f(x)')}=3\\left(x-${t(f(1, 3))}\\right)^2${t('-' + f(16, 3))}`], ['l_S', `S\\left(${tf(1, 3)}\\,;-${tf(16, 3)}\\right)`, 'cours'],
  ['q_1', `${D}<0`], ['q_2', `${D}=0`], ['q_3', `${D}>0`], ['q_x0', `x_0=-${f('b', '2a')}`], ['q_x12', `x_1=${f(`-b-\\sqrt{${D}}`, '2a')}\\qquad x_2=${f(`-b+\\sqrt{${D}}`, '2a')}`],
  ['q_e', `3x^2-2x-5=0\\qquad\\quad${D}=${o(64)}>0`], ['q_a1', `x_1=${f(`2-\\sqrt{${o(64)}}`, '2\\times3')}=${f('2-8', 6)}`], ['q_a2', '=-1', 'cours'], ['q_b1', `x_2=${f(`2+\\sqrt{${o(64)}}`, '2\\times3')}=${f('2+8', 6)}`], ['q_b2', `=${f(5, 3)}`, 'cours'],
  ['l_x1', 'x_1', 'cours'], ['l_x2', 'x_2', 'cours'],
  ['s_p', `x_1+x_2=-${f('b', 'a')}\\qquad\\qquad x_1\\times x_2=${f('c', 'a')}`], ['s_e', '2x^2-x-1=0'], ['s_1', `2\\times1^2-1-1=0\\qquad\\text{donc}\\qquad ${t('x_1=1')}`], ['s_2', `1\\times x_2=${f(-1, 2)}\\qquad\\text{donc}\\qquad ${t('x_2=-' + f(1, 2))}`],
  ['c_p', `${D}>0:\\qquad f(x)=a(x-${t('x_1')})(x-${t('x_2')})`], ['c_1', `3x^2-2x-5=3\\,(x+1)\\left(x-${f(5, 3)}\\right)`], ['c_2', `2x^2-x-1=2\\,(x-1)\\left(x+${f(1, 2)}\\right)`], ['c_0', `${D}=0:\\qquad f(x)=a(x-${t('x_0')})^2`], ['c_n', `${D}<0:`],
  ['g_f', `${b('f(x)')}=2x^2-x-1`], ['g_in', '2x^2-x-1\\geqslant0'], ['g_S', `S=\\left]-\\infty\\,;-${tf(1, 2)}\\right]\\cup[1\\,;+\\infty[`, 'cours'],
  ['g_x', 'x'], ['g_fx', 'f(x)'], ['g_mi', '-\\infty'], ['g_pi', '+\\infty'], ['g_r1', `-${tf(1, 2)}`, 'cours'], ['g_r2', '1', 'cours'], ['g_p', '+', Ve], ['g_m', '-', 'orange'], ['g_0', '0'],
  ['b_d', `${D}=b^2-4ac`], ['b_x', `x=${f(`-b\\pm\\sqrt{${D}}`, '2a')}`], ['b_f', 'a(x-x_1)(x-x_2)'],
];

// Les formules de la vidéo « Géométrie cartésienne », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
// Résultat en turquoise ; vecteur u et droite d1 en bleu, vecteur v en turquoise, w et droite d2 en orange.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s);
const col = (x, y) => `\\begin{pmatrix}${x}\\\\${y}\\end{pmatrix}`, f = (a, d) => `\\dfrac{${a}}{${d}}`, vec = (s) => `\\overrightarrow{${s}}`, v = (s) => `\\vec{${s}}`;
const vi = (s) => c(Vi, s);
const SYS = `\\begin{cases}${b('x-2y+5=0')}\\\\${o('-2x+3y-7=0')}\\end{cases}`;   // (E1) en bleu, (E2) en orange, comme les droites d1 et d2
export default [
  ['l_A', 'A'], ['l_B', 'B'], ['l_Bo', 'B', 'orange'], ['l_M', 'M', 'cours'], ['l_I', 'I', 'cours'], ['l_d', 'd', 'bleu'], ['l_d1', 'd_1', 'bleu'], ['l_d2', 'd_2', 'orange'], ['l_p', 'p', 'cours'], ['l_m', 'm', Vi], ['l_1', '+1', 'orange'],
  ['l_u', v('u'), 'bleu'], ['l_v', v('v'), 'cours'], ['l_w', v('w'), 'orange'], ['l_ud', v('u'), 'cours'], ['n2', '2', 'orange'], ['n3', '3', 'orange'],
  // 1. vecteurs
  ['v_nom', b(vec('AB'))], ['v_AB', `${b(vec('AB'))}${col('x_B-x_A', 'y_B-y_A')}`], ['v_num', `${b(vec('AB'))}${col('4-1', '3-1')}=${t(col(3, 2))}`],
  ['v_ng', `\\|${v('u')}\\|=\\sqrt{x^2+y^2}`], ['v_norme', `\\|${b(vec('AB'))}\\|=\\sqrt{3^2+2^2}=${t('\\sqrt{13}')}`],
  // 2. colinéarité
  ['c_def', `${v('u')}=\\lambda\\,${v('v')}`], ['c_u', `${b(v('u') + col(1, -3))}`], ['c_v', `${t(v('v') + col(3, -9))}`], ['c_ex', `${t(v('v'))}=${col(3, -9)}=3${col(1, -3)}=3\\,${b(v('u'))}`],
  ['c_det', `\\det(${v('u')},${v('v')})=xy'-x'y`], ['c_calc', `\\det(${b(v('u'))},${t(v('v'))})=1\\times(-9)-3\\times(-3)=-9+9`], ['c_zero', '=0', 'cours'],
  ['c_uv', `${v('u')}\\ \\text{et}\\ ${v('v')}`], ['c_ssi', `\\iff\\quad\\det(${v('u')},${v('v')})=0`],
  ['c_w', `${o(v('w') + col(2, 1))}\\qquad\\det(${b(v('u'))},${o(v('w'))})=1\\times1-2\\times(-3)=${o('7')}\\neq0`],
  // 3. équation cartésienne
  ['e_gen', 'ax+by+c=0'], ['e_d', `${b('d')}:\\ 2x+3y-8=0`], ['e_A', `A(1\\,;2):\\quad 2\\times1+3\\times2-8=${t('0')}`], ['e_M', `2x+3y-8=${t('0')}`],
  ['e_B', `${o('B')}(2\\,;1):\\quad 2\\times2+3\\times1-8=${o('-1')}\\neq0`], ['e_u', `${t(v('u'))}${col('-b', 'a')}=${t(col(-3, 2))}`],
  // 4. équation réduite
  ['r1', '2x+3y-8=0'], ['r2', '3y=-2x+8'], ['r3', `y=${c(Vi, '-' + f(2, 3))}\\,x+${t(f(8, 3))}`], ['r_gen', `y=${c(Vi, 'm')}x+${t('p')}`], ['r_m', `${c(Vi, 'm=-' + f(2, 3))}`], ['r_p', `${t('p=' + f(8, 3))}`],
  // 5. deux droites sécantes
  ['sys', SYS], ['d_e1', `${b('d_1')}:\\ x-2y+5=0`], ['d_e2', `${o('d_2')}:\\ -2x+3y-7=0`], ['d_u', `${b('\\vec{u_1}' + col(2, 1))}\\qquad${o('\\vec{u_2}' + col(-3, -2))}`],
  ['d_det', `\\det(${b('\\vec{u_1}')},${o('\\vec{u_2}')})=2\\times(-2)-(-3)\\times1=-1\\neq0`],
  // 6. résolution
  ['E1', '(E_1)', 'bleu'], ['E2', '(E_2)', 'orange'],
  ['s1', `${b('x')}=${vi('2y-5')}`], ['s2', `${o('-2')}(${vi('2y-5')})${o('{}+3y-7=0')}`], ['s3', '-y+3=0'], ['s4', 'y=3', 'cours'], ['s5', `x=${vi(`2\\times${t('3')}-5`)}=${t('1')}`],
  ['k1', `${o('(E_2)')}+2\\times${b('(E_1)')}`], ['k2', `${o('-2x+3y-7')}+2(${b('x-2y+5')})=0`], ['k3', `-y+3=0\\qquad${t('y=3')}`], ['k4', `${b(`x-2\\times${t('3')}+5=0`)}\\qquad${t('x=1')}`], ['sol', `I\\,(1\\,;3)`, 'cours'],
  // bilan
  ['b_d', `\\det(${v('u')},${v('v')})=xy'-x'y`], ['b_c', 'ax+by+c=0'], ['b_r', 'y=mx+p'],
];

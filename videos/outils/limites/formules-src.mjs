// Les formules de la vidéo « Limites et continuité », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
// ε et la bande horizontale en orange ; δ et la bande verticale en turquoise ; courbe en bleu ; encadrements en violet.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`, E = o('\\varepsilon'), De = t('\\delta'), abs = (s) => `|${s}|`;
export default [
  ['l_l', `\\ell=${tf(1, 2)}`, 'orange'], ['l_a2', 'a=2', 'cours'], ['l_a', 'a'], ['l_b', 'b'], ['l_c', 'c', 'cours'], ['l_d', 'd', 'cours'], ['l_M', 'M', 'activites'], ['l_m', 'm', 'activites'], ['l_r2', '\\sqrt2', 'cours'], ['l_fx', `y=${tf(1, 'x')}`, 'bleu'],
  // 2. limite
  ['d_lim', `\\forall${E}>0,\\ \\ \\exists${De}>0,\\ \\ \\forall x\\in I,\\quad ${abs('x-a')}\\leqslant${De}\\implies ${abs('f(x)-\\ell')}\\leqslant${E}`],
  ['d_maj', `\\left|${f(1, 'x')}-${f(1, 2)}\\right|=${f(abs('x-2'), '2x')}\\leqslant${f(abs('x-2'), 2)}\\quad\\text{pour}\\ x\\in[1\\,;3]`], ['d_del', `${De}=\\min(1,\\,2${E})`],
  // 3. suites
  ['s_g', `f(x)\\xrightarrow[x\\to a]{}\\ell`], ['s_ssi', '\\iff'], ['s_d', `\\text{pour toute suite}\\ (x_n)\\ \\text{de limite}\\ a,\\quad f(x_n)\\xrightarrow[n\\to+\\infty]{}\\ell`],
  ['s_x', `${t(`x_n=${f(1, '2n\\pi+\\frac{\\pi}{2}')}`)}\\to0,\\qquad\\sin${f(1, 'x_n')}=${t('1')}`], ['s_y', `${o(`y_n=${f(1, 'n\\pi')}`)}\\to0,\\qquad\\sin${f(1, 'y_n')}=${o('0')}`], ['s_f', `y=\\sin${tf(1, 'x')}`, 'bleu'],
  // 4. continuité
  ['c_def', `\\forall${E}>0,\\ \\ \\exists${De}>0,\\ \\ \\forall x\\in I,\\quad ${abs('x-a')}\\leqslant${De}\\implies ${abs('f(x)-f(a)')}\\leqslant${E}`],
  ['c_g', `\\lim\\limits_{x\\to2^-}\\lfloor x\\rfloor=1\\ \\neq\\ 2=\\lfloor2\\rfloor`], ['c_dr', `\\lim\\limits_{x\\to2^+}\\lfloor x\\rfloor=2=\\lfloor2\\rfloor`],
  ['c_f', `${b('f(x)')}=x\\sin${f(1, 'x')}`], ['c_enc', `\\left|x\\sin${f(1, 'x')}\\right|\\leqslant${c(Vi, abs('x'))}\\xrightarrow[x\\to0]{}0`], ['c_pro', `\\tilde f(0)=0`, 'cours'], ['c_h', 'y=|x|', Vi], ['c_b', 'y=-|x|', Vi],
  // 5. valeurs intermédiaires
  ['v_th1', `f\\ \\text{continue sur}\\ [a\\,,b],\\qquad y\\ \\text{entre}\\ f(a)\\ \\text{et}\\ f(b)`], ['v_th2', `\\exists\\,c\\in[a\\,,b],\\quad f(c)=y`], ['v_f', `${b('f(x)')}=x^2-2`],
  ['v_e0', `f(1)=-1\\leqslant0`], ['v_e1', `f(1{,}5)=0{,}25>0`], ['v_e2', `f(1{,}25)\\approx-0{,}44\\leqslant0`], ['v_e3', `f(1{,}375)\\approx-0{,}11\\leqslant0`],
  ['v_adj', `a_n\\leqslant c\\leqslant b_n,\\qquad b_n-a_n=${f(2, '2^n')}\\to0`], ['v_c', `f(c)\\leqslant0\\leqslant f(c)\\quad\\text{donc}\\quad f(c)=0`], ['v_r', `c=\\sqrt2`, 'cours'],
  // 6. bornes atteintes
  ['m_th1', `f\\ \\text{continue sur le segment}\\ [a\\,,b]`], ['m_th2', `\\exists\\,c,d\\in[a\\,,b],\\quad f(c)=\\min\\limits_{[a,b]}f,\\quad f(d)=\\max\\limits_{[a,b]}f`], ['m_im', `f([a\\,,b])=[m\\,,M]`, 'activites'],
  // 7. continuité uniforme
  ['u_c', `${o('\\forall y\\in I')},\\ \\ \\forall\\varepsilon>0,\\ \\ \\exists\\delta>0,\\ \\ \\forall x\\in I,\\quad ${abs('x-y')}\\leqslant\\delta\\implies ${abs('f(x)-f(y)')}\\leqslant\\varepsilon`],
  ['u_u', `\\forall\\varepsilon>0,\\ \\ \\exists\\delta>0,\\ \\ ${o('\\forall(x,y)\\in I^2')},\\quad ${abs('x-y')}\\leqslant\\delta\\implies ${abs('f(x)-f(y)')}\\leqslant\\varepsilon`],
  ['u_f', 'y=x^2', 'bleu'], ['u_s1', `x_n=n+${f(1, 'n')},\\qquad y_n=n`], ['u_s2', `x_n-y_n\\to0\\qquad\\text{mais}\\qquad x_n^2-y_n^2=2+${f(1, 'n^2')}\\geqslant2`], ['u_h1', `f\\ \\text{continue sur le segment}\\ [a\\,,b]`], ['u_h2', `\\implies`], ['u_e', '2\\varepsilon=1', 'orange'],
];

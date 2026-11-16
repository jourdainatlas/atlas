// Les formules de la vidéo « La géométrie dans l'espace », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff';         // résultat en turquoise ; vecteur normal en orange ; vecteur directeur en bleu
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), o = (s) => c(O, s), b = (s) => c(B, s);
const col = (...v) => `\\begin{pmatrix}${v.join('\\\\')}\\end{pmatrix}`, vec = (s) => `\\overrightarrow{${s}}`, sys = (...l) => `\\left\\{\\begin{array}{l}${l.join('\\\\[2pt]')}\\end{array}\\right.`;
const u = b('\\vec{u}'), n = o('\\vec{n}');
export default [
  ['eg', '='],
  // lettres des figures
  ...['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'M', 'N', 'O', 'x', 'y', 'z'].map((l) => ['l_' + l, l]), ['l_P', '\\mathcal{P}', 'cours'], ['l_Dr', '\\mathcal{D}', 'bleu'],
  ['l_i', '\\vec{\\imath}', 'encre2'], ['l_j', '\\vec{\\jmath}', 'encre2'], ['l_k', '\\vec{k}', 'encre2'], ['l_u', '\\vec{u}', 'bleu'], ['l_n', '\\vec{n}', 'orange'],
  // 1. repère
  ['r_M', 'M(2\\,;3\\,;2)'], ['r_OM', `${vec('OM')}=2\\,\\vec{\\imath}+3\\,\\vec{\\jmath}+2\\,\\vec{k}`],
  // 2. produit scalaire
  ['s_uv', `\\vec{u}${col('x', 'y', 'z')}\\qquad\\vec{v}${col("x'", "y'", "z'")}`],
  ['s_ps', "\\vec{u}\\cdot\\vec{v}=xx'+yy'+zz'"], ['s_no', '\\|\\vec{u}\\|=\\sqrt{x^2+y^2+z^2}'], ['s_or', `\\vec{u}\\perp\\vec{v}\\quad\\Longleftrightarrow\\quad\\vec{u}\\cdot\\vec{v}=${t('0')}`],
  ['s_pts', 'A(1\\,;0\\,;2)\\quad B(3\\,;1\\,;-1)\\quad C(2\\,;4\\,;3)', 'encre2'],
  ['s_v', `${b(vec('AB'))}${col(2, 1, -3)}\\qquad${o(vec('AC'))}${col(1, 4, 1)}`],
  ['s_c', `${b(vec('AB'))}\\cdot${o(vec('AC'))}=2\\times 1+1\\times 4+(-3)\\times 1=${t('3')}`],
  ['s_cos', `\\cos\\widehat{BAC}=\\dfrac{3}{\\sqrt{14}\\times\\sqrt{18}}\\approx 0{,}189`], ['s_ang', '\\widehat{BAC}\\approx 79^\\circ', 'cours'],
  // 3. plan
  ['p_eq', `M\\in\\mathcal{P}\\quad\\Longleftrightarrow\\quad${b(vec('AM'))}\\cdot${n}=0`],
  ['p_M', `M(x\\,;y\\,;z)\\qquad${b(vec('AM'))}${b(col('x-x_A', 'y-y_A', 'z-z_A'))}`], ['p_dev', `${o('a')}${b('(x-x_A)')}+${o('b')}${b('(y-y_A)')}+${o('c')}${b('(z-z_A)')}=0`], ['p_car', `${o('a')}x+${o('b')}y+${o('c')}z+d=0`], ['p_n', `${n}${col('a', 'b', 'c')}`],
  ['p_ex', `A(2\\,;-1\\,;3)\\qquad${n}${col(1, 4, -2)}`], ['p_e1', `x+${o('4')}y-${o('2')}z+d=0`], ['p_e2', '2+4\\times(-1)-2\\times 3+d=0'], ['p_e3', 'd=8'], ['p_e4', 'x+4y-2z+8=0', 'cours'],
  // 4. droite
  ['d_eq', `${vec('AM')}=t\\,${u}`], ['d_sys', sys(`x=x_A+${b('\\alpha')}\\,t`, `y=y_A+${b('\\beta')}\\,t`, `z=z_A+${b('\\gamma')}\\,t`)], ['d_u', `${u}${col('\\alpha', '\\beta', '\\gamma')}`],
  ['d_ex', `A(1\\,;0\\,;-2)\\qquad${u}${col(3, -1, 2)}`], ['d_s2', sys(`x=1+${b('3')}t`, `y=${b('-')}t`, `z=-2+${b('2')}t`)], ['d_t2', `t=2\\ :\\quad(7\\,;-2\\,;2)`, 'cours'], ['d_t', 't='],
  // 5. positions relatives
  ['q_cr', `${u}\\cdot${n}=0`],
  ['q_P', '\\mathcal{P}:\\ 2x-y+z-4=0'], ['q_D', `\\mathcal{D}:\\ ${sys('x=1+t', 'y=2-t', 'z=3t')}`], ['q_un', `${u}\\cdot${n}=1\\times 2+(-1)\\times(-1)+3\\times 1=6\\neq 0`],
  ['q_t', '2(1+t)-(2-t)+3t-4=0\\quad\\Longleftrightarrow\\quad t=\\dfrac{2}{3}'], ['q_I', 'I\\left(\\dfrac{5}{3}\\,;\\dfrac{4}{3}\\,;2\\right)', 'cours'],
  ['q_AB', '(AB)', 'bleu'], ['q_CG', '(CG)', 'orange'],
  // 6. projeté orthogonal
  ['h_py', 'MN^2=MH^2+HN^2'], ['h_in', 'MH<MN', 'cours'],
  ['h_M', 'M(4\\,;1\\,;2)\\qquad\\mathcal{P}:\\ x+2y-z+3=0'], ['h_n', `${n}${col(1, 2, -1)}`], ['h_d', sys('x=4+t', 'y=1+2t', 'z=2-t')],
  ['h_e', '(4+t)+2(1+2t)-(2-t)+3=0'], ['h_t', `6t+7=0\\quad\\Longleftrightarrow\\quad t=${t('-\\dfrac{7}{6}')}`], ['h_H', 'H\\left(\\dfrac{17}{6}\\,;-\\dfrac{4}{3}\\,;\\dfrac{19}{6}\\right)', 'cours'],
  ['h_MH', `MH=|t|\\times\\|${n}\\|=\\dfrac{7}{6}\\sqrt{6}\\approx 2{,}86`],
  ['h_f', 'd(M,\\mathcal{P})=\\dfrac{|a\\,x_M+b\\,y_M+c\\,z_M+d|}{\\sqrt{a^2+b^2+c^2}}'], ['h_v', `\\dfrac{|4+2\\times 1-2+3|}{\\sqrt{1+4+1}}=\\dfrac{7}{\\sqrt{6}}=${t('\\dfrac{7\\sqrt{6}}{6}')}`],
  // bilan
  ['b_ps', "xx'+yy'+zz'"], ['b_pl', 'ax+by+cz+d=0'], ['b_dr', `${vec('AM')}=t\\,\\vec{u}`],
];

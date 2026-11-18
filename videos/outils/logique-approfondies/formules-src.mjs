// Les formules de la vidéo « Ensembles et logique », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// A et E en bleu, B et F en orange ; résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, non = '\\text{non}\\ ', R = '\\mathbb{R}', Z = '\\mathbb{Z}', ov = (s) => `\\overline{${s}}`;
export default [
  ['l_A', 'A', 'bleu'], ['l_B', 'B', 'orange'], ['l_E', 'E', 'bleu'], ['l_F', 'F', 'orange'], ['l_x', 'x', 'cours'], ['l_Fb', 'F', 'bleu'], ['l_G', 'G', 'orange'],
  ['p_et', `${b('A')}\\ \\text{et}\\ ${o('B')}`], ['p_ou', `${b('A')}\\ \\text{ou}\\ ${o('B')}`], ['p_imp', `${b('A')}\\Rightarrow${o('B')}`],
  ['i_eq', `${b('A')}\\iff${o('B')}`], ['i_eq2', `(${b('A')}\\Rightarrow${o('B')})\\quad\\text{et}\\quad(${o('B')}\\Rightarrow${b('A')})`],
  ['r_c', `(A\\Rightarrow B)\\iff(${non}B\\Rightarrow${non}A)`], ['r_1', `${non}B:\\quad x>0`], ['r_2', `\\varepsilon=${f('x', 2)}>0`], ['r_3', `x>${f('x', 2)}=\\varepsilon`], ['r_a', `\\sqrt2=${f('p', 'q')}`], ['r_f', `f(-3)=2\\times(-3)+1=${o(-5)}<0`],
  ['q_1', `\\forall x\\in E,\\ P(x)`], ['q_2', `\\exists x\\in E,\\ P(x)`], ['q_v', `\\forall x\\in${R},\\ x^2\\geqslant0`], ['q_f', `\\forall x\\in${Z},\\ x>0`], ['q_n', `${non}\\big(\\forall x\\in E,\\ A(x)\\big)\\iff\\exists x\\in E,\\ ${non}A(x)`],
  ['e_ext', `\\{-2\\,;-1\\,;0\\,;1\\,;2\\}`], ['e_comp', `\\{x\\in${Z}\\mid|x|\\leqslant2\\}`], ['e_incl', `${b('A')}\\subset${o('B')}\\iff\\forall x\\in${b('A')},\\ x\\in${o('B')}`], ['e_dbl', `A=B\\iff(A\\subset B\\ \\ \\text{et}\\ \\ B\\subset A)`],
  ['e_vide', `\\varnothing\\subset E`], ['e_s1', `a\\in E`], ['e_s2', `\\{a\\}\\subset E`], ['e_E', `E=\\{a\\,;b\\}`],
  ['o_d', `x\\in${b('E')}\\setminus${o('F')}\\iff x\\in${b('E')}\\ \\text{et}\\ x\\notin${o('F')}`], ['o_i', `x\\in${b('E')}\\cap${o('F')}\\iff x\\in${b('E')}\\ \\text{et}\\ x\\in${o('F')}`], ['o_u', `x\\in${b('E')}\\cup${o('F')}\\iff x\\in${b('E')}\\ \\text{ou}\\ x\\in${o('F')}`],
  ['o_m1', `${ov('F\\cup G')}=${ov('F')}\\cap${ov('G')}`], ['o_m2', `${ov('F\\cap G')}=${ov('F')}\\cup${ov('G')}`], ['o_p', `\\mathcal P(E)=\\big\\{\\varnothing\\,;\\{a\\}\\,;\\{b\\}\\,;\\{a\\,;b\\}\\big\\}`], ['o_2n', '2^n', 'cours'],
  ['b_c', `(A\\Rightarrow B)\\iff(${non}B\\Rightarrow${non}A)`], ['b_n', `${non}(\\forall x,\\ A(x))\\iff\\exists x,\\ ${non}A(x)`], ['b_m', `${ov('F\\cup G')}=${ov('F')}\\cap${ov('G')}`],
];

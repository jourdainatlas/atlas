// Les formules de la vidéo « Applications », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// f en bleu, g en orange, la composée et les images réciproques en violet ; les résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#c793e6';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, R = '\\mathbb{R}', pi2 = '\\tfrac{\\pi}{2}', inv = (s) => `${s}^{-1}`;
export default [
  ['a_def', `\\forall x\\in E,\\quad\\exists!\\,y\\in F,\\quad(x\\,;y)\\in G`], ['l_E', 'E'], ['l_F', 'F'], ['l_G', 'G'], ['l_f', 'f', 'bleu'], ['l_g', 'g', 'orange'], ['l_gf', 'g\\circ f', 'exercices'],
  ['l_x', 'x'], ['l_fx', 'f(x)'], ['l_gfx', 'g\\big(f(x)\\big)'],
  ['c_1', `${R}\\longrightarrow${R},\\quad x\\longmapsto x^2`], ['c_2', `${R}\\longrightarrow${R}_+,\\quad x\\longmapsto x^2`], ['c_ne', '\\neq', 'orange'], ['c_id', `\\mathrm{Id}_E:E\\longrightarrow E,\\quad x\\longmapsto x`],
  ['c_gf', `${v('g\\circ f')}:E\\longrightarrow G,\\quad x\\longmapsto ${o('g')}\\big(${b('f')}(x)\\big)`], ['c_e1', `${b('f')}:x\\mapsto x+1\\qquad ${o('g')}:x\\mapsto x^2`],
  ['c_e2', `${o('g')}\\circ${b('f')}:x\\mapsto(x+1)^2\\qquad ${b('f')}\\circ${o('g')}:x\\mapsto x^2+1`], ['c_as', `h\\circ(g\\circ f)=(h\\circ g)\\circ f`],
  ['i_r1', `\\text{Soit }(x\\,;x')\\in E^2\\text{ tel que }f(x)=f(x').`], ['i_r2', `\\ldots\\quad\\text{Donc }x=x'.`], ['i_s1', `\\text{Soit }y\\in F.\\quad\\text{Posons }x=\\ldots`], ['i_s2', `\\text{Alors }x\\in E\\text{ et }f(x)=y.`],
  ['s_f', 'y=\\sin x', 'bleu'], ['s_12', 'y=\\tfrac12', 'cours'], ['s_2', 'y=2', 'orange'], ['s_a', `f:${R}\\longrightarrow${R}`], ['s_b', `g:${R}\\longrightarrow[-1\\,;1]`], ['s_c', `h:\\left[-${pi2}\\,;${pi2}\\right]\\longrightarrow[-1\\,;1]`],
  ['r_def', `${inv('f')}:F\\longrightarrow E`], ['r_eq', `y=f(x)\\iff x=${inv('f')}(y)`], ['r_p', `${inv('f')}\\circ f=\\mathrm{Id}_E\\qquad f\\circ ${inv('f')}=\\mathrm{Id}_F`], ['r_arc', `\\arcsin:[-1\\,;1]\\longrightarrow\\left[-${pi2}\\,;${pi2}\\right]`],
  ['m_d', `f(${b('A')})=\\{\\,y\\in F\\mid\\exists\\,x\\in ${b('A')},\\ f(x)=y\\,\\}`], ['m_r', `${inv('f')}(${o('B')})=\\{\\,x\\in E\\mid f(x)\\in ${o('B')}\\,\\}`],
  ['m_f', 'y=x^2', 'gd'], ['m_A', `${b('A')}=[-1\\,;2]`], ['m_fA', `f(${b('A')})=${t('[0\\,;4]')}`], ['m_B', `${o('B')}=[1\\,;4]`], ['m_fB', `${inv('f')}(${o('B')})=${v('[-2\\,;-1]\\cup[1\\,;2]')}`], ['m_v', `${inv('f')}\\big([-4\\,;-1]\\big)=\\varnothing`],
  ['b_1', `\\forall x\\in E,\\ \\exists!\\,y\\in F,\\ y=f(x)`], ['b_2', `f(x)=f(x')\\Rightarrow x=x'`], ['b_3', `\\forall y\\in F,\\ \\exists\\,x\\in E,\\ y=f(x)`],
];

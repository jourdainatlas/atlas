// Les formules de la vidéo « Applications et relations binaires » (MPSI), en LaTeX : [identifiant, source, couleur (clé de la palette)].
// f et A en bleu, g et B en orange, les images réciproques et la partie D en violet ; les résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#c793e6';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const fi = 'f^{-1}', P = '\\mathcal{P}', N = '\\mathbb{N}', Z = '\\mathbb{Z}', id = (E) => `\\mathrm{id}_{${E}}`, cl = (x) => `\\overline{${x}}`, le = '\\preccurlyeq ', et = '\\ \\text{ et }\\ ';
export default [
  ['l_E', 'E'], ['l_F', 'F'], ['l_G', 'G'], ['l_A', 'A', 'bleu'], ['l_fA', 'f(A)', 'cours'], ['l_B', 'B', 'orange'], ['l_fB', `${fi}(B)`, 'exercices'], ['l_f', 'f', 'bleu'], ['l_g', 'g', 'orange'],
  ['m_d', `f(${b('A')})=\\{\\,f(x)\\mid x\\in ${b('A')}\\,\\}`], ['m_r', `${fi}(${o('B')})=\\{\\,x\\in E\\mid f(x)\\in ${o('B')}\\,\\}`],
  ['p_1', `${fi}(B\\cup B')=${fi}(B)\\cup ${fi}(B')`], ['p_2', `${fi}(B\\cap B')=${fi}(B)\\cap ${fi}(B')`], ['p_3', `${fi}(F\\setminus B)=E\\setminus ${fi}(B)`],
  ['p_4', `f(A\\cup A')=f(A)\\cup f(A')`], ['p_5', `f(A\\cap A')\\ ${o('\\subset')}\\ f(A)\\cap f(A')`],
  ['p_c1', `f:x\\mapsto x^2\\qquad A=[-2\\,,-1]\\qquad A'=[1\\,,2]`], ['p_c2', `f(A\\cap A')=f(\\varnothing)=${o('\\varnothing')}`], ['p_c3', `f(A)\\cap f(A')=${t('[1\\,,4]')}`],
  ['t_1', `g\\circ f\\ \\text{injective}\\ \\Longrightarrow\\ ${b('f')}\\ \\text{injective}`], ['t_2', `g\\circ f\\ \\text{surjective}\\ \\Longrightarrow\\ ${o('g')}\\ \\text{surjective}`],
  ['t_pr', `f(x)=f(x')\\ \\Longrightarrow\\ g\\big(f(x)\\big)=g\\big(f(x')\\big)\\ \\Longrightarrow\\ x=x'`],
  ['j_th', `g\\circ f=${id('E')}${et}f\\circ g=${id('F')}`], ['j_f', `${b('f')}:${N}\\to${N},\\quad n\\mapsto n+1`], ['j_g', `${o('g')}:${N}\\to${N},\\quad 0\\mapsto0,\\quad n\\mapsto n-1`],
  ['j_gf', `${o('g')}\\circ${b('f')}=${id(N)}`], ['j_fg', `${b('f')}\\big(${o('g')}(0)\\big)=1\\neq0`], ['j_2', `n=p:\\qquad f\\ \\text{injective}\\iff f\\ \\text{surjective}\\iff f\\ \\text{bijective}`], ['j_np', 'n>p', 'orange'],
  ...[0, 1, 2, 3, 4].map((i) => [`k_f${i}`, `f(${i})`]), ...[0, 1, 2, 3, 4].map((i) => [`k_c${i}`, String(i)]), ['k_D', 'D', 'exercices'], ['k_pts', '\\vdots'],
  ['k_def', `${v('D')}=\\{\\,x\\in E\\mid x\\notin f(x)\\,\\}`], ['k_abs', `${v('D')}=f(a)\\ ?`], ['k_c', `a\\in ${v('D')}\\iff a\\notin f(a)=${v('D')}`],
  ['e_1', 'x\\sim x'], ['e_2', 'x\\sim y\\Rightarrow y\\sim x'], ['e_3', `(x\\sim y${et}y\\sim z)\\Rightarrow x\\sim z`],
  ['e_c0', `${cl(0)}=3${Z}`, 'bleu'], ['e_c1', `${cl(1)}=1+3${Z}`, 'orange'], ['e_c2', `${cl(2)}=2+3${Z}`, 'exercices'], ['e_th', `x\\sim y\\iff ${cl('x')}=${cl('y')}\\qquad\\quad x\\not\\sim y\\iff ${cl('x')}\\cap${cl('y')}=\\varnothing`],
  ['o_1', `x${le}x`], ['o_2', `(x${le}y${et}y${le}x)\\Rightarrow x=y`], ['o_3', `(x${le}y${et}y${le}z)\\Rightarrow x${le}z`],
  ['b_1', `g\\circ f=${id('E')}${et}f\\circ g=${id('F')}`], ['b_2', `\\nexists\\ f:E\\to${P}(E)\\ \\text{surjective}`], ['b_3', `x\\sim y\\iff ${cl('x')}=${cl('y')}`],
];

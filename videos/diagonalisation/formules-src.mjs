// Les formules de la vidéo « Éléments propres et diagonalisation » (MP), en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Le vecteur x en bleu, son image Ax en orange ; les valeurs propres en violet ; les résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#c793e6';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, mat = (L) => `\\begin{pmatrix}${L.map((l) => l.join('&')).join('\\\\')}\\end{pmatrix}`, l = v('\\lambda'), chi = (M) => `\\chi_{${M}}`, R = '\\mathbb{R}', Cc = '\\mathbb{C}';
const tr = '\\mathrm{tr}', E = (k, M) => `E_{${v(k)}}(${M})`;
export default [
  ['d_A', `A=${mat([[2, 1], [1, 2]])}`], ['d_3', `${o('A')}${b('x')}=${v(3)}\\,${b('x')}`], ['d_1', `${o('A')}${b('x')}=${v(1)}\\,${b('x')}`], ['d_x', 'x', 'bleu'], ['d_Ax', 'Ax', 'orange'],
  ['p_def', `u(x)=${l}\\,x\\qquad(x\\neq0)`], ['p_E', `E_{${l}}(u)=\\mathrm{Ker}(u-${l}\\,\\mathrm{id}_E)`], ['p_sp', `\\mathrm{Sp}(u)`], ['p_th', `E_{${v('\\lambda_1')}}(u)\\oplus E_{${v('\\lambda_2')}}(u)\\oplus\\cdots\\oplus E_{${v('\\lambda_p')}}(u)`], ['p_card', `\\mathrm{card}\\,\\mathrm{Sp}(u)\\leqslant n`],
  ['c_def', `${chi('M')}=\\det(XI_n-M)`], ['c_th', `${l}\\in\\mathrm{Sp}(M)\\iff ${chi('M')}(${l})=0`], ['c_dev', `${chi('M')}=X^n-${tr}(M)\\,X^{n-1}+\\cdots+(-1)^n\\det(M)`],
  ['c_2', `n=2:\\qquad ${chi('M')}=X^2-${tr}(M)\\,X+\\det(M)`], ['c_ex', `A=${mat([[2, 1], [1, 2]])}\\qquad ${chi('A')}=X^2-4X+3`], ['c_fac', `=(X-${v(1)})(X-${v(3)})`],
  ['c_m', `1\\leqslant\\dim E_{${l}}(u)\\leqslant m_{${l}}`], ['c_ab', `${chi('AB')}=${chi('BA')}`],
  ['g_th', `${chi('u')}\\ \\text{scind\\'e sur }\\mathbb{K}\\qquad\\text{et}\\qquad\\dim E_{${l}}(u)=m_{${l}}\\ \\text{ pour tout }${l}\\in\\mathrm{Sp}(u)`],
  ['g_A', `A=${mat([[2, 1, 1], [1, 2, 1], [1, 1, 2]])}`], ['g_chi', `${chi('A')}=(X-${v(1)})^2(X-${v(4)})`], ['g_E1', `${E(1, 'A')}:\\ x+y+z=0`], ['g_E4', `${E(4, 'A')}=${R}\\,(1,1,1)`],
  ['g_P', `P=${mat([[1, 1, 1], [-1, 0, 1], [0, -1, 1]])}\\qquad D=${mat([[v(1), 0, 0], [0, v(1), 0], [0, 0, v(4)]])}`], ['g_c', `AP=PD\\qquad A=PDP^{-1}`, 'cours'],
  ['i_C', `C=${mat([[3, 1, 0], [-1, 1, 0], [1, 1, 2]])}`], ['i_chi', `${chi('C')}=(X-${v(2)})^3`], ['i_E', `${E(2, 'C')}=\\mathrm{Vect}\\big((1,-1,0),\\,(0,0,1)\\big)`], ['i_non', `\\dim ${E(2, 'C')}=2<3=m_{${v(2)}}`],
  ['i_R', `R=${mat([[0, -1], [1, 0]])}`], ['i_chiR', `${chi('R')}=X^2+1`], ['i_C2', `${chi('R')}=(X-${v('i')})(X+${v('i')})`], ['i_e1', 'e_1', 'bleu'], ['i_Re1', 'Re_1', 'orange'],
  ['u_p', `M=PDP^{-1}\\quad\\Longrightarrow\\quad M^k=PD^kP^{-1}`], ['u_F', `${mat([['f_{k+1}'], ['f_k']])}=F^k${mat([[1], [0]])}\\qquad F=${mat([[1, 1], [1, 0]])}`],
  ['u_chi', `${chi('F')}=X^2-X-1\\qquad ${v('\\varphi')}=${f('1+\\sqrt5', 2)}\\qquad ${v('\\psi')}=${f('1-\\sqrt5', 2)}`], ['u_b', `f_k=${f(`${v('\\varphi')}^k-${v('\\psi')}^k`, '\\sqrt5')}`], ['u_10', `f_{10}=${t(55)}`],
  ['t_th', `u\\ \\text{trigonalisable}\\iff ${chi('u')}\\ \\text{scind\\'e sur }\\mathbb{K}`], ['t_tr', `${tr}(M)=${v('\\lambda_1')}+${v('\\lambda_2')}+\\cdots+${v('\\lambda_n')}\\qquad\\det(M)=${v('\\lambda_1')}${v('\\lambda_2')}\\cdots${v('\\lambda_n')}`],
  ['t_ex', `${tr}(A)=6=${v(1)}+${v(1)}+${v(4)}\\qquad\\det(A)=4=${v(1)}\\times${v(1)}\\times${v(4)}`], ['t_nil', `u^k=0`], ['t_7', `u\\ \\text{nilpotent}\\iff ${chi('u')}=X^n`], ['t_n', `u^n=0`],
  ['t_J', `J=${mat([[0, 1, 0], [0, 0, 1], [0, 0, 0]])}`], ['t_e3', 'e_3'], ['t_e2', 'e_2'], ['t_e1', 'e_1'], ['t_0', '0', 'cours'], ['t_Jf', 'J', 'orange'],
  ['b_1', `${l}\\in\\mathrm{Sp}(M)\\iff ${chi('M')}(${l})=0`], ['b_2', `\\dim E_{${l}}(u)=m_{${l}}`], ['b_3', `M^k=PD^kP^{-1}`],
];

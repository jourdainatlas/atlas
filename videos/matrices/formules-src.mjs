// Les formules de la vidéo « Les matrices », en LaTeX : [identifiant, source, couleur (clé de la palette, encre par défaut)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff';         // résultat en turquoise ; colonne (et ce qui est faux) en orange ; ligne en bleu
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), o = (s) => c(O, s), b = (s) => c(B, s);
const M = (...l) => `\\begin{pmatrix}${l.map((r) => r.join('&')).join('\\\\')}\\end{pmatrix}`;
const A = [[1, 2, -3], [0, 4, 1]], Bm = [[0, 5], [1, 2], [3, 1]], f = '\\phantom{-7}';
export default [
  ['eg', '='],
  // 1. vocabulaire
  ['v_A', `A=${M([2, 0, -1], [3, -4, -2])}`], ['v_A12', `A=${M([2, t('0'), -1], [3, -4, -2])}`], ['v_a12', 'a_{12}=0', 'cours'],
  ['v_dim', '2\\times 3'], ['v_l', M([1, 3, -2])], ['v_c', M([4], [-3], [0])], ['v_i', `I_3=${M([1, 0, 0], [0, 1, 0], [0, 0, 1])}`],
  // 2. somme et produit par un réel
  ['s_ab', `${M([1, 2, -3], [0, 4, 1])}+${M([0, -1, 2], [1, 2, 5])}`], ['s_i', `=${M(['1+0', '2+(-1)', '-3+2'], ['0+1', '4+2', '1+5'])}`], ['s_r', `=${M([1, 1, -1], [1, 6, 6])}`, 'cours'],
  ['k_a', `${t('2')}\\times${M([1, 3, -4], [0, 2, 1], [-5, 3, 1])}`], ['k_r', `=${M([2, 6, -8], [0, 4, 2], [-10, 6, 2])}`, 'cours'],
  // 3. le produit
  ['p_dim', `\\underset{2\\,\\times\\,${t('3')}}{A}\\ \\times\\ \\underset{${t('3')}\\,\\times\\,2}{B}\\ =\\ \\underset{2\\,\\times\\,2}{AB}`],
  ['p_cij', `c_{ij}=\\sum_{k=1}^{p}${b('a_{ik}')}\\,${o('b_{kj}')}`],
  ['p_A', M(...A)], ['p_A1', M(A[0].map(b), A[1])], ['p_A2', M(A[0], A[1].map(b))],
  ['p_B', M(...Bm)], ['p_B1', M(...Bm.map((r) => [o(r[0]), r[1]]))], ['p_B2', M(...Bm.map((r) => [r[0], o(r[1])]))],
  ['p_C', M([f, f], [f, f])], ['p_nA', 'A=', 'encre2'], ['p_nB', 'B=', 'encre2'], ['p_nC', 'AB=', 'encre2'],
  ...[['11', [1, 2, -3], [0, 1, 3], -7], ['12', [1, 2, -3], [5, 2, 1], 6], ['21', [0, 4, 1], [0, 1, 3], 7], ['22', [0, 4, 1], [5, 2, 1], 9]].flatMap(([k, l, col, r]) => {
    const p = (x) => (x < 0 ? `(${x})` : `${x}`);
    return [[`p_k${k}`, l.map((x, i) => `${b(p(x))}\\times${o(p(col[i]))}`).join('+')], [`p_e${k}`, `=${r}`, 'cours'], [`p_r${k}`, `${r}`, 'cours']];
  }),
  // 4. non-commutativité
  ['n_ab', `${M([1, 1], [2, 1])}${M([0, 1], [2, 3])}=${t(M([2, 4], [2, 5]))}`], ['n_ba', `${M([0, 1], [2, 3])}${M([1, 1], [2, 1])}=${o(M([2, 1], [8, 5]))}`],
  ['n_AB', 'AB', 'encre2'], ['n_BA', 'BA', 'encre2'], ['n_ne', 'AB\\neq BA', 'orange'], ['n_id', 'I_n\\,A=A\\,I_n=A'],
  // 5. puissances
  ['u_def', 'A^k=\\underbrace{A\\times A\\times\\cdots\\times A}_{k\\ \\text{fois}}'], ['u_0', 'A^0=I_n', 'encre2'],
  ['u_D', `D=${M([2, 0], [0, 3])}`], ['u_D2', `D^2=${M([4, 0], [0, 9])}`], ['u_D3', `D^3=${M([8, 0], [0, 27])}`], ['u_Dk', `D^k=${M(['2^k', 0], [0, '3^k'])}`, 'cours'],
  // 6. inverse
  ['i_def', 'AB=BA=I_n'], ['i_not', 'B=A^{-1}', 'cours'],
  ['i_A', `A=${M([4, 3], [2, 1])}`], ['i_B', `B=\\dfrac{1}{2}${M([-1, 3], [2, -4])}`],
  ['i_p1', `AB=\\dfrac{1}{2}${M([4, 3], [2, 1])}${M([-1, 3], [2, -4])}`], ['i_p2', `=\\dfrac{1}{2}${M([2, 0], [0, 2])}`], ['i_p3', '=I_2', 'cours'],
  ['d_def', '\\det(A)=\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc'], ['d_ex', `\\begin{vmatrix}4&3\\\\2&1\\end{vmatrix}=4\\times 1-3\\times 2=${t('-2')}`],
  ['d_prop', 'A\\ \\text{inversible}\\quad\\Longleftrightarrow\\quad\\det(A)\\neq 0'], ['d_inv', `A^{-1}=\\dfrac{1}{\\det(A)}${M(['d', '-b'], ['-c', 'a'])}`],
  ['a_1', `A^{-1}=\\dfrac{1}{${t('-2')}}${M([1, -3], [-2, 4])}`], ['a_2', `=\\dfrac{1}{2}${M([-1, 3], [2, -4])}`, 'cours'], ['a_3', '=B', 'cours'],
  ['z_1', `${M([2, 4], [1, 2])}`], ['z_2', `2\\times 2-4\\times 1=${o('0')}`],
  // bilan
  ['b_s', 'A+B'], ['b_p', 'AB\\neq BA'], ['b_i', '\\det(A)\\neq 0'],
  // vignette
  ['g_p', `${M(A[0].map(b), A[1])}${M(...Bm.map((r) => [o(r[0]), r[1]]))}=${M([t('-7'), 6], [7, 9])}`],
];

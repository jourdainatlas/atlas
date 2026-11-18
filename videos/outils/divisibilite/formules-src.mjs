// Les formules de la vidéo « Divisibilité et primalité », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Quotient et résultats en turquoise ; reste en orange ; facteur 2 en bleu, 3 en orange, 7 en violet.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, Z = '\\mathbb{Z}';
export default [
  ['d_def', `a\\mid b\\iff\\exists\\,k\\in${Z},\\quad b=k\\,a`], ['d_1', `7\\mid63\\qquad\\text{car}\\qquad63=7\\times${t(9)}`], ['d_2', `3\\mid6n+9n^2\\qquad\\text{car}\\qquad6n+9n^2=3\\times${t('(2n+3n^2)')}`], ['d_r', `a\\mid b\\quad\\text{et}\\quad a\\mid c\\quad\\Longrightarrow\\quad a\\mid ub+vc`],
  ['e_th', `a=b\\,${t('q')}+${o('r')}\\qquad\\text{avec}\\qquad0\\leqslant${o('r')}<b`], ['e_47', `47=5\\times${t(9)}+${o(2)}`], ['e_n', `-47=5\\times${t('(-10)')}+${o(3)}`], ['e_n2', `0\\leqslant${o(3)}<5`],
  ['k_r', '\\sqrt{100}=10'], ['i_1', `N=2\\times3\\times5\\times7+1=${t(211)}`], ['i_2', `211=2\\times105+${o(1)}=3\\times70+${o(1)}=5\\times42+${o(1)}=7\\times30+${o(1)}`], ['i_3', `2\\times3\\times5\\times7\\times11\\times13+1=30\\,031=${t('59\\times509')}`],
  ['t_l', `p\\ \\text{premier},\\qquad p\\mid ab\\quad\\Longrightarrow\\quad p\\mid a\\ \\ \\text{ou}\\ \\ p\\mid b`], ['t_g', `n=p_1^{\\alpha_1}\\times p_2^{\\alpha_2}\\times\\cdots\\times p_k^{\\alpha_k}`], ['t_84', `84=${b('2^2')}\\times${o(3)}\\times${v(7)}`],
  ...[['h20', b('2^0')], ['h21', b('2^1')], ['h22', b('2^2')], ['h30', o('3^0')], ['h31', o('3^1')], ['h70', `\\times${v('7^0')}`], ['h71', `\\times${v('7^1')}`]],
  ['v_c', `(${b(2)}+1)\\times(${o(1)}+1)\\times(${v(1)}+1)=${t(12)}`], ['v_g2', `(\\alpha_1+1)\\times(\\alpha_2+1)\\times\\cdots\\times(\\alpha_k+1)`],
  ['v_f1', f(84, 126)], ['v_f2', `=${f(`${b('2^2')}\\times${o(3)}\\times${v(7)}`, `${b(2)}\\times${o('3^2')}\\times${v(7)}`)}`], ['v_f3', `=${f(2, 3)}`, 'cours'],
  ['b_d', `a=bq+r,\\quad 0\\leqslant r<b`], ['b_e', `p\\mid ab\\ \\Longrightarrow\\ p\\mid a\\ \\text{ou}\\ p\\mid b`], ['b_t', `n=p_1^{\\alpha_1}\\times\\cdots\\times p_k^{\\alpha_k}`],
];

// Les formules de la vidéo « Nombres et calculs », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Résultats en turquoise ; ce que l'on simplifie ou ce qui est faux en orange ; l'intervalle I en bleu, J en orange.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`, bb = (s) => `\\mathbb{${s}}`;
export default [
  ['f_a1', `A=${f(3, 4)}+${f(5, 6)}`], ['f_a2', `=${f(`3\\times${o(3)}`, `4\\times${o(3)}`)}+${f(`5\\times${o(2)}`, `6\\times${o(2)}`)}=${f(9, 12)}+${f(10, 12)}`], ['f_a3', `=${f(19, 12)}`, 'cours'],
  ['f_b1', `B=${f(14, 21)}\\times${f(9, 8)}`], ['f_b2', `=${f(`2\\times${o(7)}`, `3\\times${o(7)}`)}\\times${f(9, 8)}=${f(2, 3)}\\times${f(9, 8)}=${f(18, 24)}`], ['f_b3', `=${f(3, 4)}`, 'cours'],
  ['p_def', `a^n=\\underbrace{a\\times a\\times\\cdots\\times a}_{n\\ \\text{facteurs}}\\qquad a^0=1\\qquad a^{-n}=${f(1, 'a^n')}`],
  ['p_r1', `a^m\\times a^n=a^{${t('m+n')}}`], ['p_r2', `${f('a^m', 'a^n')}=a^{${t('m-n')}}`], ['p_r3', `(a^m)^n=a^{${t('m\\times n')}}`],
  ['p_e1', f('2^5\\times2^{-3}', '2^{-4}')], ['p_e2', `=${f('2^{5+(-3)}', '2^{-4}')}=${f('2^2', '2^{-4}')}=2^{2-(-4)}`], ['p_e3', '=2^6=64', 'cours'],
  ['p_p1', `(-3)^2=${t(9)}`], ['p_p2', `-3^2=${o(-9)}`], ['p_s1', `43\\,000\\,000=${t('4{,}3\\times10^{7}')}`], ['p_s2', `0{,}000\\,29=${t('2{,}9\\times10^{-4}')}`],
  ['r_def', `\\sqrt a\\geqslant0\\qquad\\text{et}\\qquad\\big(\\sqrt a\\big)^2=a`], ['r_p', `\\sqrt{a\\times b}=\\sqrt a\\times\\sqrt b\\qquad\\qquad\\sqrt{${f('a', 'b')}}=${f('\\sqrt a', '\\sqrt b')}`],
  ['r_c1', `\\sqrt{9+16}=\\sqrt{25}=${t(5)}`], ['r_c2', `\\sqrt9+\\sqrt{16}=3+4=${o(7)}`], ['r_s1', `\\sqrt{72}=\\sqrt{36\\times2}=${t('6\\sqrt2')}`], ['r_s2', `\\sqrt{72}-\\sqrt{50}+\\sqrt2=6\\sqrt2-5\\sqrt2+\\sqrt2=${t('2\\sqrt2')}`],
  ['r_d', '\\sqrt2', 'cours'], ['r_py', '1^2+1^2=2'], ['l_1', '1'],
  ...['N', 'Z', 'D', 'Q', 'R'].map((x) => ['e_' + x, bb(x)]), ['e_incl', ['N', 'Z', 'D', 'Q', 'R'].map(bb).join('\\subset')],
  ...[['0', '0'], ['17', '17'], ['m3', '-3'], ['m125', '-125'], ['025', '0{,}25'], ['m175', '-1{,}75'], ['13', tf(1, 3)], ['227', tf(22, 7)], ['r2', '\\sqrt2'], ['pi', '\\pi']].map(([i, s]) => ['x_' + i, s, 'encre2']),
  ['e_x1', `-5\\in${bb('Z')}\\quad\\text{mais}\\quad-5\\notin${bb('N')}`], ['e_x2', `${f(3, 4)}=0{,}75\\in${bb('D')}`], ['e_x3', `${f(1, 3)}=0{,}333\\ldots\\in${bb('Q')}\\quad\\text{mais}\\quad${f(1, 3)}\\notin${bb('D')}`],
  ['i_p', `${f(1, 7)}=0{,}\\,${t('142857')}\\,${v('142857')}\\,${t('142857')}\\ldots`], ['i_th', `\\sqrt2\\notin${bb('Q')}`], ['i_1', `\\sqrt2=${f('a', 'b')}`], ['i_2', 'a^2=2b^2'], ['i_3', 'a=2k'], ['i_4', 'b^2=2k^2'],
  ...[['1', '[a\\,;b]', 'a\\leqslant x\\leqslant b'], ['2', ']a\\,;b[', 'a<x<b'], ['3', '[a\\,;b[', 'a\\leqslant x<b'], ['4', '[a\\,;+\\infty[', 'x\\geqslant a']].flatMap(([i, n, e]) => [['v_n' + i, n], ['v_e' + i, e]]),
  ['v_x', `1\\leqslant ${t('x')}\\leqslant4`], ['v_14', '[1\\,;4]', 'bleu'], ['v_I', `I=[-1\\,;3]`, 'bleu'], ['v_J', `J=\\,]1\\,;5]`, 'orange'], ['v_in', `I\\cap J=\\,]1\\,;3]`, 'cours'], ['v_un', `I\\cup J=[-1\\,;5]`, Vi],
  ['b_r', `\\sqrt{a\\times b}=\\sqrt a\\times\\sqrt b`], ['b_i', `[a\\,;b]:\\ \\ a\\leqslant x\\leqslant b`],
];

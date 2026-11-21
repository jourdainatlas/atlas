// Les formules de la vidéo « Probabilités » (Terminale), en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Succès et probabilité p en bleu, échec en orange ; le coefficient binomial en violet ; les résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#c793e6';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`, bin = (n, k) => `\\dbinom{${n}}{${k}}`, Sb = '\\overline{S}';
const ch = (s) => [...s].map((x) => (x === 'S' ? b('S') : o(Sb))).join('');
export default [
  ['x_def', `X:\\Omega\\longrightarrow\\mathbb{R}`], ['x_m2', '-2', 'orange'], ['x_0', '0'], ['x_6', '6', 'cours'], ['x_xi', 'x_i'], ['x_P', 'P(X=x_i)'], ['x_12', f(1, 2)], ['x_13', f(1, 3)], ['x_16', f(1, 6)],
  ['e_def', `E(X)=p_1x_1+p_2x_2+\\cdots+p_nx_n`], ['e_c', `E(X)=${f(1, 2)}\\times(${o(-2)})+${f(1, 3)}\\times0+${f(1, 6)}\\times${t(6)}=-1+0+1`], ['e_0', `E(X)=${t(0)}`],
  ['v_def', `V(X)=\\sum p_i\\big(x_i-E(X)\\big)^2\\qquad\\sigma(X)=\\sqrt{V(X)}`], ['v_kh', `V(X)=E(X^2)-E(X)^2`], ['v_e2', `E(X^2)=${f(1, 2)}\\times(-2)^2+${f(1, 3)}\\times0^2+${f(1, 6)}\\times6^2=2+0+6=8`],
  ['v_v', `V(X)=8-0^2=${t(8)}`], ['v_s', `\\sigma(X)=\\sqrt{8}=2\\sqrt{2}\\approx${t('2{,}83')}`],
  ['l_1', `E(${v('a')}X+${o('b')})=${v('a')}E(X)+${o('b')}`], ['l_2', `V(${v('a')}X+${o('b')})=${v('a')}^2V(X)`], ['l_3', `\\sigma(${v('a')}X+${o('b')})=|${v('a')}|\\,\\sigma(X)`],
  ['l_Y', `Y=${v(2)}X${o('-1')}`], ['l_e', `E(Y)=${v(2)}\\times0${o('-1')}=${t(-1)}`], ['l_v', `V(Y)=${v(2)}^2\\times8=${t(32)}`], ['l_s', `\\sigma(Y)=${v(2)}\\times2\\sqrt{2}=${t('4\\sqrt{2}')}`],
  ['n_S', 'S', 'bleu'], ['n_E', Sb, 'orange'], ['n_p', 'p', 'bleu'], ['n_q', '1-p', 'orange'], ['n_ev', `E(X)=p\\qquad V(X)=p(1-p)`],
  ...['SSS', 'SSE', 'SES', 'SEE', 'ESS', 'ESE', 'EES', 'EEE'].map((s, i) => [`n_f${i}`, ch(s.replace(/E/g, 'X'))]),
  ['n_un', `${b('p')}\\times${b('p')}\\times(${o('1-p')})=p^2(1-p)`], ['n_3', `P(X=2)=${t('3\\,p^2(1-p)')}`],
  ['c_def', `${v(bin('n', 'k'))}`], ['c_53', `${v(bin(5, 3))}=${t(10)}`], ['c_sym', `${bin('n', 'k')}=${bin('n', 'n-k')}`], ['c_pas', `${bin('n', 'k')}+${bin('n', 'k+1')}=${bin('n+1', 'k+1')}`],
  ['c_ex', `${bin(4, 1)}+${bin(4, 2)}=${o(4)}+${o(6)}=${t(10)}=${bin(5, 2)}`], ['c_f', `${bin(10, 3)}=${f('10\\times9\\times8', '3\\times2\\times1')}=${t(120)}`],
  ['b_th', `P(X=k)=${v(bin('n', 'k'))}\\,${b('p^k')}\\,${o('(1-p)^{n-k}')}`], ['b_n', `X\\sim\\mathcal{B}(n\\,;p)`],
  ['b_X', `X\\sim\\mathcal{B}(50\\,;0{,}03)`], ['b_0', `P(X=0)=${v(bin(50, 0))}\\times${b('0{,}03^0')}\\times${o('0{,}97^{50}')}\\approx${t('0{,}218')}`],
  ['b_1', `P(X=1)=${v(bin(50, 1))}\\times${b('0{,}03^1')}\\times${o('0{,}97^{49}')}\\approx${t('0{,}337')}`], ['b_2', `P(X=2)=${v(bin(50, 2))}\\times${b('0{,}03^2')}\\times${o('0{,}97^{48}')}\\approx${t('0{,}256')}`],
  ['b_c', `P(X\\leqslant2)\\approx0{,}218+0{,}337+0{,}256=${t('0{,}811')}`], ['b_p', `E(X)=np\\qquad V(X)=np(1-p)`],
  ['b_E', `E(X)=50\\times0{,}03=${t('1{,}5')}`], ['b_S', `\\sigma(X)=\\sqrt{50\\times0{,}03\\times0{,}97}\\approx${t('1{,}21')}`], ['b_l', 'E(X)=1{,}5', 'cours'], ['e_l', 'E(X)=0', 'cours'],
  ['b_e', `E(X)=\\sum p_ix_i`], ['b_v', `V(X)=E(X^2)-E(X)^2`], ['b_b', `P(X=k)=${bin('n', 'k')}p^k(1-p)^{n-k}`],
];

// Les formules de la vidéo « Les probabilités », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
// Résultat en turquoise ; événement A en bleu, B en turquoise (comme sur les diagrammes du cours) ; boule rouge et
// boule verte de l'urne dans deux teintes propres à cette vidéo (le rouge du site reste aux définitions).
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', R = '#e2553b', V = '#7fc65a';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s);
const ens = (...v) => `\\{${v.join('\\,;')}\\}`, f = (a, d) => `\\dfrac{${a}}{${d}}`, tf = (a, d) => `\\tfrac{${a}}{${d}}`;
export default [
  ['eg', '='],
  // 1. vocabulaire
  ['o_om', `\\Omega=${ens(1, 2, 3, 4, 5, 6)}`], ['o_A', `${b('A')}=${ens(2, 4, 6)}`], ['o_B', `${t('B')}=${ens(5, 6)}`],
  // 2. opérations
  ['l_A', 'A', 'bleu'], ['l_B', 'B', 'cours'], ['l_O', '\\Omega', 'encre2'], ...[1, 2, 3, 4, 5, 6].map((n) => ['n' + n, String(n)]),
  ['e_c', `\\overline{A}=${ens(1, 3, 5)}`], ['e_i', `A\\cap B=${ens(6)}`], ['e_u', `A\\cup B=${ens(2, 4, 5, 6)}`], ['e_v', 'A\\cap\\overline{A}=\\varnothing'],
  // 3. loi de probabilité
  ['p_01', '0\\leqslant p_i\\leqslant 1'], ['p_s', 'p_1+p_2+\\cdots+p_n=1'], ['p_v', `0{,}1+0{,}1+0{,}2+0{,}2+0{,}1+0{,}3=${t('1')}`],
  ['p_A', `P(${b('A')})=${b('0{,}1')}+${b('0{,}2')}+${b('0{,}3')}=${t('0{,}6')}`], ...['0{,}1', '0{,}2', '0{,}3'].map((v, i) => ['v' + (i + 1), v, 'encre2']),
  ['q_P', 'P(A)='], ['q_c', `P(${b('A')})=${f(8, 32)}=${f(1, 4)}=${t('0{,}25')}`], ['q_r', `P(${c(O, 'B')})=${f(4, 32)}=${t(f(1, 8))}`],
  // 4. contraire et réunion
  ['c_f', 'P(\\overline{A})=1-P(A)'], ['c_a', `P(\\overline{A})=1-${f(1, 4)}=${t(f(3, 4))}`],
  ['u_f', 'P(A\\cup B)=P(A)+P(B)-P(A\\cap B)'], ['u_a', `P(A\\cup B)=${f(8, 32)}+${f(4, 32)}-${f(1, 32)}`], ['u_r', `=${f(11, 32)}`, 'cours'],
  // 5. arbre pondéré
  ['a_r', c(R, tf(3, 5))], ['a_v', c(V, tf(2, 5))], ['a_R', c(R, '\\mathrm{R}')], ['a_V', c(V, '\\mathrm{V}')],
  ...[['RR', 3, 3, 9], ['RV', 3, 2, 6], ['VR', 2, 3, 6], ['VV', 2, 2, 4]].flatMap(([k, x, y, r]) => [[`a_${k}`, `(\\mathrm{${k[0]}}\\,;\\mathrm{${k[1]}})`], [`a_p${k}`, `${tf(x, 5)}\\times${tf(y, 5)}=${tf(r, 25)}`]]),
  ['a_t', `P=${f(6, 25)}+${f(6, 25)}=${f(12, 25)}=${t('0{,}48')}`],
  // 6. probabilités conditionnelles
  ['s_PM', `P(M)=${f(150, 500)}=${t('0{,}3')}`], ['s_PS', `${f(90, 300)}=${t('0{,}3')}`],
  ['s_def', `P_A(B)=${f('P(A\\cap B)', 'P(A)')}`], ['s_ver', `P_S(M)=${f('P(S\\cap M)', 'P(S)')}=${f('0{,}18', '0{,}6')}=${t('0{,}3')}`], ['s_pro', 'P(A\\cap B)=P(A)\\times P_A(B)'],
  ['i_def', 'P_A(B)=P(B)'], ['i_pro', 'P(A\\cap B)=P(A)\\times P(B)'], ['i_lyc', 'P_S(M)=0{,}3=P(M)', 'cours'],
  // bilan
  ['b_c', 'P(\\overline{A})=1-P(A)'], ['b_u', 'P(A\\cup B)=P(A)+P(B)-P(A\\cap B)'], ['b_s', 'P(A\\cap B)=P(A)\\times P_A(B)'],
];

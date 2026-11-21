// Les formules de la vidéo « Structures algébriques usuelles », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Restes en orange ; résultats en turquoise ; module en bleu.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#b58cff';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const Z = '\\mathbb{Z}', Zn = (n) => `${Z}/${n}${Z}`, cl = (k) => `\\overline{${k}}`;
export default [
  ['s_r1', `23=3\\times7+${o(2)}`], ['s_r2', `23=5\\times4+${o(3)}`], ['s_r3', `23=7\\times3+${o(2)}`], ['s_reg', `${o(2)}\\times70+${o(3)}\\times21+${o(2)}\\times15=233=2\\times105+${t(23)}`],
  ['z_def', `${Zn(12)}=\\{${cl(0)},${cl(1)},\\ldots,${cl(11)}\\}`], ['z_5', `\\langle${cl(5)}\\rangle=${Zn(12)}`, 'cours'], ['z_4', `\\langle${cl(4)}\\rangle=\\{${cl(0)},${cl(4)},${cl(8)}\\}`, 'orange'],
  ['z_p', `${cl('k')}\\ \\text{engendre}\\ ${Zn('n')}\\iff k\\wedge n=1`], ['z_g', `${cl(1)},\\quad${cl(5)},\\quad${cl(7)},\\quad${cl(11)}`, 'cours'],
  ['o_def', `x^n=e`], ['o_1', `3\\times${cl(4)}=${cl(0)}`], ['o_2', `4\\times${cl(9)}=${cl(0)}`], ['o_3', `12\\times${cl(5)}=${cl(0)}`], ['o_c', `x^{|G|}=e`, 'cours'], ['o_m', `G=\\langle x\\rangle\\ \\simeq\\ ${Z}\\quad\\text{ou}\\quad ${Zn('n')}`],
  ['i_n', `n${Z}`], ['i_f', `12${Z}+18${Z}=${t('6' + Z)}`], ['i_c', `18-12=${t(6)}`], ['i_p', `12\\wedge18=${t(6)}`],
  ['n_th', `${cl('k')}\\ \\text{inversible dans}\\ ${Zn('n')}\\iff k\\wedge n=1`], ['n_c', `${Zn('n')}\\ \\text{est un corps}\\iff n\\ \\text{est premier}`],
  ['n_d1', `60=3\\times17+9`], ['n_d2', `17=1\\times9+8`], ['n_d3', `9=1\\times8+${t(1)}`], ['n_r1', `${t(1)}=9-8=2\\times9-17`], ['n_r2', `${t(1)}=2\\times60${o('-7')}\\times17`],
  ['n_i', `${cl(17)}^{\\,-1}=${cl(o('-7'))}=${t(cl(53))}`], ['n_v', `17\\times53=901=15\\times60+1`],
  ['c_th', `${Zn('mn')}\\ \\simeq\\ ${Zn('m')}\\times${Zn('n')}\\qquad(m\\wedge n=1)`], ['c_t', `[k]_{15}\\longmapsto\\big([k]_3\\,,[k]_5\\big)`],
  ['c_s', `x\\equiv${b(2)}\\ [3]\\ \\text{ et }\\ x\\equiv${o(3)}\\ [5]\\iff x\\equiv${t(8)}\\ [15]`],
  ['c_a1', `5\\times7=35\\equiv2\\ [3]`], ['c_b1', `${v(2)}\\times35=${b(70)}\\equiv4\\equiv1\\ [3]`], ['c_a2', `3\\times7=${b(21)}\\equiv1\\ [5]`], ['c_a3', `3\\times5=${b(15)}\\equiv1\\ [7]`],
  ['c_e1', `${b(70)}\\equiv1\\ [3],\\quad0\\ [5],\\quad0\\ [7]`], ['c_e2', `${b(21)}\\equiv0\\ [3],\\quad1\\ [5],\\quad0\\ [7]`], ['c_e3', `${b(15)}\\equiv0\\ [3],\\quad0\\ [5],\\quad1\\ [7]`],
  ['c_x', `x\\equiv${o(2)}\\times${b(70)}+${o(3)}\\times${b(21)}+${o(2)}\\times${b(15)}=233\\equiv${t(23)}\\ [105]`],
  ['c_phi', `\\varphi(n)=\\mathrm{Card}\\,\\{k\\in\\{1,\\ldots,n\\}\\mid k\\wedge n=1\\}`], ['c_eu', `a\\wedge n=1\\quad\\Longrightarrow\\quad a^{\\varphi(n)}\\equiv1\\ [n]`], ['c_fe', `a^{p-1}\\equiv1\\ [p]`],
  ['b_g', `${cl('k')}\\ \\text{engendre}\\ ${Zn('n')}\\iff k\\wedge n=1`], ['b_c', `${Zn('mn')}\\simeq${Zn('m')}\\times${Zn('n')}`], ['b_e', `a^{\\varphi(n)}\\equiv1\\ [n]`],
];

// Les formules de la vidéo « Nombres complexes », en LaTeX : [identifiant, source, couleur (clé de la palette)].
// Partie réelle en bleu, partie imaginaire en orange ; i² et ce qui le remplace en violet ; résultats en turquoise.
const T = '#35caa4', O = '#ffa24a', B = '#55aaff', Vi = '#c793e6';
const c = (k, s) => `{\\color{${k}}{${s}}}`, t = (s) => c(T, s), b = (s) => c(B, s), o = (s) => c(O, s), v = (s) => c(Vi, s);
const f = (a, d) => `\\dfrac{${a}}{${d}}`, zb = '\\overline{z}', bar = (s) => `\\overline{${s}}`, C = '\\mathbb{C}', R = '\\mathbb{R}', et = '\\ \\text{ et }\\ ';
export default [
  ['m_i', `i^2=-1`], ['e_1', `${R}\\subset${C}`], ['e_2', `i\\in${C},\\quad i^2=-1`], ['e_3', `+\\quad\\times`], ['e_4', `z=${b('a')}+i${o('b')}`],
  ['e_def', `z=${b('a')}+i${o('b')}\\qquad(${b('a')},${o('b')}\\in${R})`], ['e_re', `\\mathrm{Re}(z)=${b('a')}`], ['e_im', `\\mathrm{Im}(z)=${o('b')}`],
  ['e_ex', `z=${b(2)}+${o(3)}i\\qquad\\mathrm{Re}(z)=${b(2)}\\qquad\\mathrm{Im}(z)=${o(3)}`], ['e_eg', `z=z'\\iff\\mathrm{Re}(z)=\\mathrm{Re}(z')${et}\\mathrm{Im}(z)=\\mathrm{Im}(z')`],
  ['c_p1', `(2+3i)(1-2i)=2-4i+3i-6${v('i^2')}`], ['c_p2', `=2-i${v('+6')}=${t('8-i')}`],
  ['c_i1', `(a+ib)^2=a^2-b^2+2iab`], ['c_i2', `(a+ib)(a-ib)=a^2+b^2`],
  ['c_n', `(u+v)^n=\\sum_{k=0}^{n}\\dbinom{n}{k}u^kv^{n-k}`], ['c_c1', `(1+i)^3=1+3i+3${v('i^2')}+${v('i^3')}`], ['c_c2', `=1+3i${v('-3')}${v('-i')}`], ['c_c3', `=${t('-2+2i')}`],
  ['j_def', `${zb}=${b('a')}-i${o('b')}`], ['j_ex', `z=2+3i\\qquad ${zb}=2-3i`], ['j_1', `z+${zb}=2\\,\\mathrm{Re}(z)`], ['j_2', `z-${zb}=2i\\,\\mathrm{Im}(z)`], ['j_3', `z${zb}=a^2+b^2`], ['j_4', `z\\in${R}\\iff z=${zb}`],
  ['q_0', f('2+3i', '1+2i')], ['q_1', `=${f(`(2+3i)${v('(1-2i)')}`, `(1+2i)${v('(1-2i)')}`)}`], ['q_2', `=${f(`2-4i+3i-6i^2`, '1^2+2^2')}`], ['q_3', `=${f('8-i', 5)}`], ['q_4', `=${t(`${f(8, 5)}-${f(1, 5)}i`)}`],
  ['q_a', `${bar("z+z'")}=${zb}+${bar("z'")}`], ['q_b', `${bar("z\\times z'")}=${zb}\\times${bar("z'")}`], ['q_c', `${bar('z^n')}=${zb}^{\\,n}`], ['q_d', `${bar(`\\left(${f("z'", 'z')}\\right)`)}=${f(bar("z'"), zb)}`],
  ['x_eq', `az^2+bz+c=0\\qquad(a,b,c\\in${R},\\ a\\neq0)`], ['x_cas', `\\Delta<0:\\qquad z_1=${f('-b-i\\sqrt{-\\Delta}', '2a')}\\qquad z_2=${f('-b+i\\sqrt{-\\Delta}', '2a')}=${bar('z_1')}`],
  ['x_e', `z^2-4z+5=0`], ['x_d', `\\Delta=(-4)^2-4\\times1\\times5=${o(-4)}<0`], ['x_z1', `z_1=${f(`4-i\\sqrt{4}`, 2)}=${f('4-2i', 2)}=${t('2-i')}`], ['x_z2', `z_2=${bar('z_1')}=${t('2+i')}`], ['x_f', 'y=x^2-4x+5', 'bleu'], ['x_S', 'S(2\\,;1)', 'cours'],
  ['p_th', `P(${v('a')})=0\\quad\\Longrightarrow\\quad P(z)=(z-${v('a')})\\,Q(z)`], ['p_zn', `z^n-1=(z-1)(z^{n-1}+z^{n-2}+\\cdots+z+1)`],
  ['p_e', `z^3-4z^2+2z+1=0`], ['p_f', `z^3-4z^2+2z+1=(z-${v(1)})(z^2-3z-1)`],
  ['b_i', `i^2=-1`], ['b_c', `z${zb}=a^2+b^2`], ['b_d', `z=${f('-b\\pm i\\sqrt{-\\Delta}', '2a')}`],
];

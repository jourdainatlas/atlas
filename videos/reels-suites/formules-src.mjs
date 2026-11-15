// Les formules de la vidéo « Nombres réels et suites numériques », en LaTeX : [identifiant, source, couleur].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
const T = '#35caa4', O = '#ffa24a', V = '#c793e6', B = '#55aaff';
const c = (k, s) => `{\\color{${k}}{${s}}}`;
export default [
  // le trou des rationnels
  ['racine', '\\sqrt{2}'], ['racine_q', '\\sqrt{2}\\notin\\mathbb{Q}'],
  // la borne supérieure
  ['A01', 'A=[0\\,;1[', 'activites'], ['supA', '\\sup A=1', 'rouge'], ['M', 'M', 'orange'], ['eps', '\\varepsilon', 'violet'], ['a', 'a', 'activites'],
  ['sup_c1', '\\forall a\\in A,\\quad a\\leqslant M'], ['sup_c2', `\\forall ${c(V, '\\varepsilon')}>0,\\ \\exists a\\in A,\\quad M-${c(V, '\\varepsilon')}<a`],
  // Archimède et la densité
  ['arch', '\\forall a>0,\\ \\ \\forall x\\in\\mathbb{R},\\ \\ \\exists n\\in\\mathbb{N},\\quad na>x'], ['x', 'x', 'orange'], ['na', 'na', 'cours'],
  ['dens_n', '10^{-n}<b-a'], ['dens', `a<${c(T, 'd')}\\leqslant a+10^{-n}<b`], ['la', 'a', 'orange'], ['lb', 'b', 'orange'], ['ld', 'd', 'cours'],
  // la limite
  ['suite_u', 'u_n=2+(-1)^n\\,\\dfrac{3}{n+2}', 'bleu'],
  ['lim_def', `\\forall ${c(O, '\\varepsilon')}>0,\\ \\exists ${c(T, 'N')}\\in\\mathbb{N},\\ \\forall n\\geqslant ${c(T, 'N')},\\quad |u_n-\\ell|\\leqslant ${c(O, '\\varepsilon')}`],
  ['ell', '\\ell'], ['ellp', '\\ell+\\varepsilon', 'orange'], ['ellm', '\\ell-\\varepsilon', 'orange'], ['n', 'n', 'encre3'],
  // la limite monotone
  ['mono_u', 'u_n=\\sum_{k=1}^{n}\\dfrac{1}{k^2}', 'bleu'], ['mono_th', '\\lim_{n\\to+\\infty}u_n=\\sup\\,\\{u_n\\mid n\\in\\mathbb{N}\\}'],
  ['mono_sup', '\\ell=\\sup\\,\\{u_n\\}', 'rouge'], ['mono_ellm', '\\ell-\\varepsilon', 'violet'], ['mono_uN', 'u_N', 'cours'],
  ['mono_pr', `\\ell-\\varepsilon<${c(T, 'u_N')}\\leqslant u_n\\leqslant\\ell`],
  // suites adjacentes
  ['adj_u', 'u_n=\\sum_{k=0}^{n}\\dfrac{1}{k!}', 'bleu'], ['adj_v', 'v_n=u_n+\\dfrac{1}{n\\cdot n!}', 'orange'], ['adj_th', `\\forall n,\\quad ${c(B, 'u_n')}\\leqslant\\ell\\leqslant ${c(O, 'v_n')}`],
  ['un', 'u_n', 'bleu'], ['vn', 'v_n', 'orange'],
  // Bolzano-Weierstrass
  ['sinn', 'u_n=\\sin n', 'bleu'],
  ...Array.from({ length: 18 }, (_, i) => [`c${i}`, `u_{${i}}`]),
  ...[0, 4, 5, 11, 17].map((p, k) => [`bw${k}`, `u_{${p}}`, 'violet']),
  ...[0, 1, 2, 3, 4].map((k) => [`sg${k}`, `[a_${k},b_${k}]`, 'orange']),
];

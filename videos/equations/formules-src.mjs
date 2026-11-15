// Les formules de la vidéo « Les équations », en LaTeX : [identifiant, source, couleur (clé de la palette, encre par défaut)].
// ../derivation/gen-formules.mjs les compose avec MathJax et écrit formules.js.
const T = '#35caa4', O = '#ffa24a';                        // l'opération faite aux deux membres en turquoise ; ce qui est faux ou interdit en orange
const t = (s) => `{\\color{${T}}{${s}}}`;
export default [
  ['eg', '='], ['sx', 'x', 'violet'], ['un', '1', 'encre2'],
  // vocabulaire
  ['v_l', '5x-3'], ['v_r', '2x+9'],
  ['t1l', '5\\times 1-3=2'], ['t1r', '2\\times 1+9=11'], ['t4l', '5\\times 4-3=17'], ['t4r', '2\\times 4+9=17'],
  // la balance
  ['b0l', '3x+2'], ['b0r', 'x+10'], ['b1l', '2x+2'], ['b1r', '10'], ['b2l', '2x'], ['b2r', '8'], ['b3l', 'x'], ['b3r', '4', 'cours'],
  // la méthode
  ['m1l', `5x-3${t('-2x')}`], ['m1r', `2x+9${t('-2x')}`], ['m2l', '3x-3'], ['m2r', '9'], ['m3l', `3x-3${t('+3')}`], ['m3r', `9${t('+3')}`],
  ['m4l', '3x'], ['m4r', '12'], ['m5l', `\\dfrac{3x}{${t('3')}}`], ['m5r', `\\dfrac{12}{${t('3')}}`], ['m6l', 'x'], ['m6r', '4', 'cours'],
  // cas particuliers
  ['c1l', '2x+5'], ['c1r', '2x+1'], ['c5', '5'], ['c1', '1'], ['c2l', '3(x+2)'], ['c2r', '3x+6'], ['c0', '0'],
  // équations produit
  ['p_prop', `A\\times B=0\\quad\\Longleftrightarrow\\quad A=0\\ \\ \\text{ou}\\ \\ B=0`],
  ['p_n1', `3\\times ${t('0')}=0`], ['p_n2', `${t('0')}\\times 7=0`],
  ['p_12a', '12=2\\times 6'], ['p_12b', '=3\\times 4'], ['p_12c', '=24\\times\\dfrac{1}{2}'], ['p_12d', '=\\ \\dots'],
  ['p_e', '(2x-6)(x+5)=0'], ['p_a1', '2x-6=0'], ['p_a2', '2x=6'], ['p_a3', 'x=3', 'cours'], ['p_b1', 'x+5=0'], ['p_b3', 'x=-5', 'cours'],
  ['p_dev', '2x^2+4x-30=0', 'orange'],
  ['q0', 'x^2=9'], ['q1', 'x^2-9=0'], ['q2', '(x+3)(x-3)=0'], ['qa', 'x=-3', 'cours'], ['qb', 'x=3', 'cours'], ['ident', 'a^2-b^2=(a+b)(a-b)', 'encre3'],
  // équations quotient
  ['r_def', '\\dfrac{A}{B}=0'], ['r_prop', `\\dfrac{A}{B}=0\\quad\\Longleftrightarrow\\quad A=0\\ \\ \\text{et}\\ \\ B\\neq 0`],
  ['r_e', '\\dfrac{x^2-4}{x-2}=0'], ['r_v1', 'x-2=0'], ['r_v2', 'x=2', 'orange'],
  ['r_n1', 'x^2-4=0'], ['r_n2', '(x+2)(x-2)=0'], ['r_na', 'x=-2'], ['r_nb', 'x=2'], ['r_sol', 'x=-2', 'cours'],
  // bilan
  ['bl', '2x+3'], ['br', '11'], ['bp', 'A\\times B=0'], ['bq', '\\dfrac{A}{B}=0'],
];

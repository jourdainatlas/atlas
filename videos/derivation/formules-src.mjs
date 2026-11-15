// Les formules de la vidéo, en LaTeX : [identifiant, source, couleur (clé de la palette de film.js, encre par défaut)].
// gen-formules.mjs les compose avec MathJax (sortie SVG, tracés seuls) et écrit formules.js.
const V = '#c793e6', O = '#ffa24a', T = '#35caa4';        // h en violet, taux de variation en orange, dérivée en turquoise
const h = `{\\color{${V}}{h}}`;
export default [
  // repères des figures
  ['A', 'A'], ['B', 'B', 'orange'], ['la', 'a'], ['lah', `a+${h}`], ['lfa', 'f(a)'], ['lfah', `f(a+${h})`], ['lh', 'h', 'violet'], ['ldf', 'f(a+h)-f(a)', 'orange'],
  ['x', 'x'], ['y', 'y'], ['cf2', 'y=x^2', 'bleu'], ['cd2', 'y=2x', 'cours'], ['cf', '\\mathcal{C}_f', 'bleu'], ['cfp', "\\mathcal{C}_{f'}", 'cours'],
  // taux de variation
  ['fx2', 'f(x)=x^2'],
  ['taux_gen', `\\dfrac{f(a+${h})-f(a)}{${h}}`],
  ['taux_num', `\\dfrac{f(2)-f(1)}{{\\color{${V}}{1}}}=\\dfrac{4-1}{{\\color{${V}}{1}}}={\\color{${O}}{3}}`],
  // nombre dérivé
  ['def', `f'(a)=\\lim_{${h}\\to 0}\\dfrac{f(a+${h})-f(a)}{${h}}`],
  ['calc1', `\\dfrac{f(1+${h})-f(1)}{${h}}=\\dfrac{(1+${h})^2-1^2}{${h}}`],
  ['calc2', `=\\dfrac{2${h}+${h}^2}{${h}}`],
  ['calc3', `=2+${h}`],
  ['res1', `f'(1)={\\color{${T}}{2}}`],
  // fonction dérivée
  ['fd_calc', `\\dfrac{(x+${h})^2-x^2}{${h}}=\\dfrac{2x${h}+${h}^2}{${h}}=2x+${h}`],
  ['fd_res', `f(x)=x^2\\quad\\Longrightarrow\\quad f'(x)={\\color{${T}}{2x}}`],
  // dérivées usuelles : fonction, dérivée, condition
  ['u0l', 'k'], ['u0r', '0', 'cours'], ['u0c', 'k\\in\\mathbb{R}', 'encre3'],
  ['u1l', 'x'], ['u1r', '1', 'cours'],
  ['u2l', 'x^2'], ['u2r', '2x', 'cours'],
  ['u3l', 'x^n'], ['u3r', 'n\\,x^{n-1}', 'cours'], ['u3c', 'n\\in\\mathbb{N}^*', 'encre3'],
  ['u4l', '\\dfrac{1}{x}'], ['u4r', '-\\dfrac{1}{x^2}', 'cours'], ['u4c', 'x\\neq 0', 'encre3'],
  ['u5l', '\\sqrt{x}'], ['u5r', '\\dfrac{1}{2\\sqrt{x}}', 'cours'], ['u5c', 'x>0', 'encre3'],
  ['tf', 'f(x)', 'encre2'], ['tfp', "f'(x)", 'encre2'],
  // opérations
  ['o0', `(u+v)'={\\color{${T}}{u'+v'}}`], ['o1', `(k\\,u)'={\\color{${T}}{k\\,u'}}`], ['o2', `(u\\,v)'={\\color{${T}}{u'v+u\\,v'}}`],
  ['o3', `\\left(\\dfrac{1}{v}\\right)'={\\color{${T}}{-\\dfrac{v'}{v^2}}}`], ['o4', `\\left(\\dfrac{u}{v}\\right)'={\\color{${T}}{\\dfrac{u'v-u\\,v'}{v^2}}}`],
  ['o5', `\\big(g(ax+b)\\big)'={\\color{${T}}{a\\,g'(ax+b)}}`],
  ['piege', `(u\\,v)'\\neq u'\\,v'`, 'orange'],
  // exemple : un polynôme, terme à terme
  ['e_f', 'f(x)='], ['e_1', '-x^3'], ['e_2', '+\\,3x^2'], ['e_3', '+\\,2'],
  ['e_fp', "f'(x)="], ['e_d1', '-3x^2', 'cours'], ['e_d2', '+\\,6x', 'cours'], ['e_d3', '+\\,0', 'cours'],
  ['e_res', `f'(x)={\\color{${T}}{-3x^2+6x}}`],
  // tangente
  ['tan_gen', "y=f'(a)\\,(x-a)+f(a)"], ['tan_a', `y={\\color{${T}}{2}}\\,(x-1)+1`], ['tan_res', 'y=2x-1', 'cours'], ['tan_T', 'T', 'cours'],
  // variations
  ['var_f', 'f(x)=-x^3+3x^2+2'], ['var_d', `f'(x)={\\color{${T}}{-3x^2+6x}}`], ['var_fact', `f'(x)={\\color{${T}}{3x\\,(2-x)}}`],
  ['minf', '-\\infty'], ['pinf', '+\\infty'], ['n0', '0'], ['n2', '2'], ['n6', '6'], ['plus', '+', 'activites'], ['moins', '-', 'orange'], ['zero', '0'],
  ['f0', 'f(0)=2'], ['f2', 'f(2)=6'],
  // bilan
  ['vit', "v(t)=x'(t)"],
];

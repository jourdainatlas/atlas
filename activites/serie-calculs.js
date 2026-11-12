// « Dix calculs » : fabrique des questions de calcul mental par niveau et par famille (MEMO_atlas_activites.md §151).
// Chaque question : { q : énoncé (HTML, formules en <span class="kx">), choix : quatre réponses, bon : rang de la bonne }.
const K = t => '<span class="kx">' + t + '</span>';
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick = a => a[Math.floor(Math.random() * a.length)];
const melanger = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pgcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
// Fraction réduite en LaTeX, signe devant.
export const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = pgcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}'; };
// Nombre décimal à la française (arrondi à 10⁻⁶ pour effacer les erreurs d'arrondi binaire).
const dec = x => String(Math.round(x * 1e6) / 1e6).replace('.', '{,}');
const nb = x => x < 0 ? '(' + x + ')' : String(x);
const cplx = (a, b) => b === 0 ? String(a) : (a === 0 ? '' : a) + (b === 1 ? (a === 0 ? '' : '+') + 'i' : b === -1 ? '-i' : (b > 0 && a !== 0 ? '+' : '') + b + 'i');
// Assemble une question : la bonne réponse et trois réponses fausses distinctes, prises dans l'ordre parmi les candidates.
function question(q, bon, faux) { bon = String(bon); const F = []; for (const f of faux.map(String)) if (f !== bon && !F.includes(f)) F.push(f);
  if (/^-?\d+$/.test(bon)) for (const d of [1, -1, 2, -2, 10, -10, 3, 5]) { if (F.length >= 3) break; const f = String(+bon + d); if (!F.includes(f)) F.push(f); }
  if (F.length < 3) return null; const C = melanger([bon].concat(F.slice(0, 3))); return { q, choix: C.map(K), bon: C.indexOf(bon) }; }
const table = L => () => { const [q, bon, faux] = pick(L); return question(q, bon, faux); };
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const fact = n => n <= 1 ? 1 : n * fact(n - 1);
const modpow = (a, k, m) => { let r = 1; a %= m; while (k > 0) { if (k & 1) r = r * a % m; a = a * a % m; k >>= 1; } return r; };

// ---------- Première ----------
const carres = () => { const n = R(11, 25), c = n * n; return question(`Calculez ${K(n + '^2')}.`, c, melanger([c + 10, c - 10, c + 20, c - 20, c + n, c - n])); };
const pourcentages = () => { const t = pick([5, 10, 15, 20, 25, 30, 50]), type = R(0, 3);
  if (type === 2) return question(`Quel est le coefficient multiplicateur associé à une hausse de ${K(t + '\\,\\%')} ?`, dec(1 + t / 100), [dec(t / 100), dec(1 - t / 100), dec(1 + t / 10), dec(t)]);
  if (type === 3) { const u = pick([10, 20, 50]); return question(`Un prix augmente de ${K(u + '\\,\\%')}, puis baisse de ${K(u + '\\,\\%')}. Par combien a-t-il été multiplié au total ?`, dec(1 - u * u / 1e4), ['1', dec(1 - u / 100), dec(1 + u * u / 1e4), dec(1 + u / 100)]); }
  let B; do { B = pick([40, 60, 80, 120, 150, 200, 240, 300]); } while (B * t % 100); const v = B * t / 100;
  return type === 0 ? question(`Augmentez ${K(B)} de ${K(t + '\\,\\%')}.`, B + v, [B + t, B - v, v, B + 2 * v]) : question(`Diminuez ${K(B)} de ${K(t + '\\,\\%')}.`, B - v, [B - t, B + v, v, B - 2 * v > 0 ? B - 2 * v : B + 2 * v]); };
const fractions = () => { let a, b, c, d; do { b = R(2, 6); d = R(2, 6); } while (b === d); do { a = R(1, b - 1); } while (pgcd(a, b) !== 1); do { c = R(1, d - 1); } while (pgcd(c, d) !== 1); const n = a * d + c * b, m = b * d;
  return question(`Calculez ${K('\\dfrac{' + a + '}{' + b + '} + \\dfrac{' + c + '}{' + d + '}')}.`, fr(n, m), [fr(a + c, b + d), fr(a + c, m), fr(a * c, m), fr(n + 1, m), fr(n - 1, m), fr(n, m + 1)]); };
const tri = (a, b, c) => (a === 1 ? '' : a === -1 ? '-' : a) + 'x^2' + (b ? (b > 0 ? '+' : '-') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x' : '') + (c ? (c > 0 ? '+' : '') + c : '');
const nombreDerive = () => { const a = R(1, 4), b = R(-5, 5), c = R(-5, 5), k = R(-2, 3);
  return question(`Soit ${K('f(x) = ' + tri(a, b, c))}. Calculez ${K("f'(" + k + ')')}.`, 2 * a * k + b, [a * k * k + b * k + c, 2 * a * k + b + c, 2 * a + b, a * k + b, 2 * a * k]); };
const discriminant = () => { const a = pick([1, 2, 3, -1]), b = R(-6, 6), c = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  return question(`Calculez le discriminant de ${K(tri(a, b, c))}.`, b * b - 4 * a * c, [b * b + 4 * a * c, b * b - a * c, b - 4 * a * c, -b * b - 4 * a * c, b * b - 4 * a * c + 4]); };
const puissances = () => { const g = pick([2, 3, 5, 10]); let a, b; do { a = R(3, 7); b = R(2, 5); } while (a < b + 2); const type = R(0, 2), P = e => g + '^{' + e + '}';
  const [q, bon] = type === 0 ? [P(a) + ' \\times ' + P(b), a + b] : type === 1 ? ['\\left(' + P(a) + '\\right)^{' + b + '}', a * b] : ['\\dfrac{' + P(a) + '}{' + P(b) + '}', a - b];
  return question(`Écrivez ${K(q)} sous la forme d'une seule puissance.`, P(bon), melanger([a + b, a * b, a - b, a + b + 1, a - b + 1, a + b - 1].filter(e => e !== bon)).map(P)); };
const suites1 = () => { if (R(0, 1)) { const u = R(-5, 10), r = pick([-4, -3, -2, 2, 3, 4, 5, 6]), n = pick([5, 10, 20]);
    return question(`La suite ${K('(u_n)')} est arithmétique, avec ${K('u_0 = ' + u)} et de raison ${K(r)}. Calculez ${K('u_{' + n + '}')}.`, u + n * r, [u + (n - 1) * r, u + n + r, (u + r) * n, u + (n + 1) * r, u * n + r]); }
  const u = R(1, 5), q = pick([2, 3, -2, 10]), n = R(3, 5); return question(`La suite ${K('(u_n)')} est géométrique, avec ${K('u_0 = ' + u)} et de raison ${K(q)}. Calculez ${K('u_{' + n + '}')}.`, u * q ** n, [u * q ** (n - 1), u * q * n, u * q ** (n + 1), u + q * n, (u * q) ** 2]); };
const VT = [['0', '1', '0'], ['\\dfrac{\\pi}{6}', '\\dfrac{\\sqrt3}{2}', '\\dfrac12'], ['\\dfrac{\\pi}{4}', '\\dfrac{\\sqrt2}{2}', '\\dfrac{\\sqrt2}{2}'], ['\\dfrac{\\pi}{3}', '\\dfrac12', '\\dfrac{\\sqrt3}{2}'], ['\\dfrac{\\pi}{2}', '0', '1'],
  ['\\dfrac{2\\pi}{3}', '-\\dfrac12', '\\dfrac{\\sqrt3}{2}'], ['\\dfrac{3\\pi}{4}', '-\\dfrac{\\sqrt2}{2}', '\\dfrac{\\sqrt2}{2}'], ['\\dfrac{5\\pi}{6}', '-\\dfrac{\\sqrt3}{2}', '\\dfrac12'], ['\\pi', '-1', '0'], ['-\\dfrac{\\pi}{6}', '\\dfrac{\\sqrt3}{2}', '-\\dfrac12'], ['-\\dfrac{\\pi}{3}', '\\dfrac12', '-\\dfrac{\\sqrt3}{2}']];
const VALEURS = ['0', '1', '-1', '\\dfrac12', '-\\dfrac12', '\\dfrac{\\sqrt2}{2}', '-\\dfrac{\\sqrt2}{2}', '\\dfrac{\\sqrt3}{2}', '-\\dfrac{\\sqrt3}{2}'];
const trigo = () => { const [x, c, s] = pick(VT), cos = R(0, 1); return question(`Que vaut ${K((cos ? '\\cos' : '\\sin') + '\\left(' + x + '\\right)')} ?`, cos ? c : s, melanger(VALEURS)); };

// ---------- Terminale ----------
const logexp = () => { const type = R(0, 5), a = R(2, 9), k = R(2, 6);
  if (type === 0) { const m = pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]); return question(`Simplifiez ${K('\\ln\\left(e^{' + m + '}\\right)')}.`, m, ['e^{' + m + '}', -m, m + 1, '\\dfrac{1}{' + Math.abs(m) + '}']); }
  if (type === 1) return question(`Simplifiez ${K('e^{\\ln ' + a + '}')}.`, a, ['\\ln ' + a, 'e^{' + a + '}', '\\dfrac{1}{' + a + '}']);
  if (type === 2) { const b = pick([2, 3, 5]); return question(`Simplifiez ${K('\\dfrac{\\ln\\left(' + b + '^{' + k + '}\\right)}{\\ln ' + b + '}')}.`, k, [b ** k, b, k - 1, b ** (k - 1)]); }
  if (type === 3) { const b = pick([2, 3]), e = pick([2, 3]); return question(`Simplifiez ${K('e^{' + e + '\\ln ' + b + '}')}.`, b ** e, [e * b, b + e, 'e^{' + e * b + '}', e ** b + 1]); }
  if (type === 4) return question(`Simplifiez ${K('\\ln\\left(\\dfrac{1}{e^{' + k + '}}\\right)')}.`, -k, [k, '\\dfrac{1}{' + k + '}', '-\\dfrac{1}{' + k + '}']);
  const p = R(2, 6), r = R(2, 6); return question(`Simplifiez ${K('\\ln\\left(e^{' + p + '}\\right) + \\ln\\left(e^{' + r + '}\\right)')}.`, p + r, [p * r, 'e^{' + (p + r) + '}', p + r + 1, Math.abs(p - r) + 1]); };
const derivees2 = () => { const type = R(0, 2);
  if (type === 0) { const a = pick([-4, -3, -2, 2, 3, 4, 5]); return question(`Soit ${K('f(x) = e^{' + a + 'x}')}. Calculez ${K("f'(0)")}.`, a, ['1', '0', 'e^{' + a + '}', -a]); }
  if (type === 1) { const a = R(1, 3), b = R(-2, 2), k = R(0, 1), u = a * k + b; if (u === 0 || Math.abs(u) === 1 && a === 1) return null; return question(`Soit ${K('f(x) = (' + (a === 1 ? '' : a) + 'x' + (b ? (b > 0 ? '+' : '') + b : '') + ')^3')}. Calculez ${K("f'(" + k + ')')}.`, 3 * a * u * u, [3 * u * u, u ** 3, 3 * a * u, 3 * a * u * u + a, a * u * u]); }
  const a = R(2, 5), b = R(1, 4), k = R(0, 2), u = a * k + b; return question(`Soit ${K('f(x) = \\ln(' + a + 'x+' + b + ')')}. Calculez ${K("f'(" + k + ')')}.`, fr(a, u), [fr(1, u), fr(u, a), String(a), fr(a, u + 1), fr(1, a)]); };
const integrales2 = () => { const type = R(0, 3);
  if (type === 0) { const n = R(1, 3), m = R(1, 3), a = (n + 1) * m, k = R(1, 3); return question(`Calculez ${K('\\displaystyle\\int_0^{' + k + '} ' + a + 'x' + (n > 1 ? '^' + n : '') + '\\,dx')}.`, m * k ** (n + 1), [a * k ** n, a * k ** (n + 1), m * k ** n, n * a * k ** (n - 1), m * k ** (n + 1) + m]); }
  if (type === 1) { const k = R(2, 9); return question(`Calculez ${K('\\displaystyle\\int_0^{\\ln ' + k + '} e^x\\,dx')}.`, k - 1, [k, '\\ln ' + k, 'e^{' + k + '}-1', k + 1]); }
  if (type === 2) { const k = R(2, 5); return question(`Calculez ${K('\\displaystyle\\int_1^{e^{' + k + '}} \\dfrac{dx}{x}')}.`, k, ['e^{' + k + '}', 'e^{' + k + '}-1', '\\dfrac{1}{' + k + '}', k - 1]); }
  const a = R(-2, 2), b = a + R(2, 5), c = R(2, 6); return question(`Calculez ${K('\\displaystyle\\int_{' + a + '}^{' + b + '} ' + c + '\\,dx')}.`, c * (b - a), [c * (b + a), c * b, c + b - a, c * (b - a) + c]); };
const binomiaux = () => { const n = R(4, 8), k = R(2, n - 2), b = binom(n, k); return question(`Calculez ${K('\\displaystyle\\binom{' + n + '}{' + k + '}')}.`, b, [n * k, fact(n) / fact(n - k), binom(n, k - 1), b + n, n * (n - 1)]); };
const INF = '+\\infty', MINF = '-\\infty';
const LIM2 = [['\\displaystyle\\lim_{x \\to +\\infty} \\dfrac{e^x}{x}', INF, ['0', '1', 'e']], ['\\displaystyle\\lim_{x \\to +\\infty} x\\,e^{-x}', '0', [INF, '1', MINF]], ['\\displaystyle\\lim_{x \\to +\\infty} \\dfrac{\\ln x}{x}', '0', [INF, '1', MINF]],
  ['\\displaystyle\\lim_{x \\to 0^+} x\\ln x', '0', [MINF, '1', INF]], ['\\displaystyle\\lim_{x \\to 0^+} \\ln x', MINF, ['0', INF, '1']], ['\\displaystyle\\lim_{x \\to -\\infty} e^x', '0', [MINF, INF, '1']],
  ['\\displaystyle\\lim_{n \\to +\\infty} \\left(n^2 - n\\right)', INF, ['0', '1', MINF]], ['\\displaystyle\\lim_{n \\to +\\infty} \\left(\\dfrac12\\right)^n', '0', [INF, '\\dfrac12', '1']], ['\\displaystyle\\lim_{n \\to +\\infty} \\dfrac{2n+1}{n^2}', '0', ['2', INF, '1']],
  ['\\displaystyle\\lim_{n \\to +\\infty} \\left(\\sqrt{n+1} - \\sqrt n\\right)', '0', ['1', INF, '\\dfrac12']], ['\\displaystyle\\lim_{x \\to +\\infty} \\left(\\ln x - x\\right)', MINF, ['0', INF, '1']], ['\\displaystyle\\lim_{n \\to +\\infty} \\dfrac{3^n}{2^n}', INF, ['\\dfrac32', '0', '1']]];
const limites2 = () => { if (R(0, 1)) { const [q, bon, faux] = pick(LIM2); return question(`Que vaut ${K(q)} ?`, bon, faux); }
  let a, d; do { a = R(1, 6); d = R(1, 6); } while (a === d); const b = R(1, 9), c = R(1, 9); return question(`Que vaut ${K('\\displaystyle\\lim_{n \\to +\\infty} \\dfrac{' + (a === 1 ? '' : a) + 'n^2+' + b + '}{' + (d === 1 ? '' : d) + 'n^2+' + (c === 1 ? '' : c) + 'n}')} ?`, fr(a, d), [INF, '0', fr(d, a), fr(b, c), '1']); };
const sommes2 = () => { if (R(0, 1)) { const n = pick([10, 20, 30, 50, 100]); return question(`Calculez ${K('1 + 2 + 3 + \\dots + ' + n)}.`, n * (n + 1) / 2, [n * n, n * (n - 1) / 2, n * (n + 1), n * n / 2]); }
  const n = R(3, 9); return question(`Calculez ${K('1 + 2 + 4 + \\dots + 2^{' + n + '}')}.`, 2 ** (n + 1) - 1, [2 ** (n + 1), 2 ** n - 1, 2 ** (n + 1) + 1, 2 ** n, 2 * (n + 1)]); };
const binomiale = () => { const n = pick([10, 20, 40, 50, 100]), [pn, pd, pt] = pick([[1, 10, '0{,}1'], [1, 5, '0{,}2'], [1, 4, '0{,}25'], [1, 2, '0{,}5'], [2, 5, '0{,}4']]), p = pn / pd, E = n * p, V = n * p * (1 - p);
  return R(0, 1) ? question(`${K('X')} suit la loi binomiale de paramètres ${K(n)} et ${K(pt)}. Calculez ${K('E(X)')}.`, dec(E), [dec(V), dec(n * (1 - p)), dec(n / (pd / pn) / 2), dec(E + 1), dec(p)])
    : question(`${K('X')} suit la loi binomiale de paramètres ${K(n)} et ${K(pt)}. Calculez ${K('V(X)')}.`, dec(V), [dec(E), dec(n * (1 - p)), dec(V * V), dec(n * p * p), dec(Math.sqrt(V) === Math.round(Math.sqrt(V)) ? V + 1 : V / 2)]); };

// ---------- Maths Sup ----------
const complexes = () => { const type = R(0, 3);
  if (type === 0) { const [a, b, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5], [12, 5, 13]]), sa = pick([1, -1]), sb = pick([1, -1]); return question(`Calculez ${K('|' + cplx(sa * a, sb * b) + '|')}.`, h, [a + b, a * a + b * b, Math.abs(a - b), h + 1, h - 1]); }
  if (type === 1) { const n = R(2, 19); return question(`Calculez ${K('i^{' + n + '}')}.`, ['1', 'i', '-1', '-i'][n % 4], ['1', 'i', '-1', '-i']); }
  if (type === 2) { const a = pick([-3, -2, -1, 1, 2, 3]), b = pick([-3, -2, -1, 1, 2, 3]), c = pick([-2, -1, 1, 2, 3]), d = pick([-2, -1, 1, 2, 3]);
    return question(`Calculez ${K('(' + cplx(a, b) + ')(' + cplx(c, d) + ')')}.`, cplx(a * c - b * d, a * d + b * c), [cplx(a * c + b * d, a * d + b * c), cplx(a * c, b * d), cplx(a * c - b * d, a * d - b * c), cplx(a * c + b * d, a * d - b * c), cplx(a + c, b + d), cplx(a * c - b * d + 1, a * d + b * c)]); }
  return table([['(1+i)^2', '2i', ['2', '1+2i', '-2i']], ['(1-i)^2', '-2i', ['2', '2i', '-2']], ['(1+i)(1-i)', '2', ['0', '2i', '1']], ['\\dfrac1i', '-i', ['i', '1', '-1']], ['\\left|1+i\\right|', '\\sqrt2', ['2', '1', '0']], ['\\left|e^{i\\pi/3}\\right|', '1', ['\\dfrac12', '\\dfrac{\\pi}{3}', '\\dfrac{\\sqrt3}{2}']], ['e^{i\\pi}', '-1', ['1', 'i', '-i']], ['e^{i\\pi/2}', 'i', ['1', '-1', '-i']]].map(([q, b, f]) => [`Calculez ${K(q)}.`, b, f]))(); };
const determinantDe = barres => () => { const a = R(-4, 5), b = R(-4, 5), c = R(-4, 5), d = R(-4, 5), M = m => '\\begin{' + m + '} ' + a + ' & ' + b + ' \\\\ ' + c + ' & ' + d + ' \\end{' + m + '}'; return question(barres ? `Calculez ${K(M('vmatrix'))}.` : `Calculez le déterminant de la matrice ${K(M('pmatrix'))}.`, a * d - b * c, [a * d + b * c, a * b - c * d, b * c - a * d, a + d, a * c - b * d]); };
const congruences = () => { const m = pick([5, 7, 11, 13]), a = R(2, 9), k = pick([2, 3, 4, 5, 6, 10, 12]); if (a % m === 0) return null; const r = modpow(a, k, m);
  return question(`Quel est le reste de ${K(a + '^{' + k + '}')} dans la division par ${K(m)} ?`, r, melanger([...Array(m).keys()].filter(x => x !== r))); };
const sommes3 = () => { const type = R(0, 4);
  if (type === 0) { const n = R(3, 9); return question(`Calculez ${K('\\displaystyle\\sum_{k=0}^{' + n + '} 2^k')}.`, 2 ** (n + 1) - 1, [2 ** (n + 1), 2 ** n - 1, 2 ** (n + 1) + 1, 2 ** n]); }
  if (type === 1) { const n = pick([10, 20, 30, 100]); return question(`Calculez ${K('\\displaystyle\\sum_{k=1}^{' + n + '} k')}.`, n * (n + 1) / 2, [n * n, n * (n - 1) / 2, n * (n + 1), n * n / 2]); }
  if (type === 2) { const n = R(3, 9); return question(`Calculez ${K('\\displaystyle\\sum_{k=0}^{' + n + '} \\binom{' + n + '}{k}')}.`, 2 ** n, [2 ** n - 1, n * n, 2 * n, 2 ** (n + 1), fact(Math.min(n, 5))]); }
  if (type === 3) { const n = R(4, 12); return question(`Calculez ${K('\\displaystyle\\sum_{k=1}^{' + n + '} (2k - 1)')}.`, n * n, [n * (n + 1), n * n - 1, 2 * n - 1, n * (n + 1) / 2, n * n + n - 1]); }
  const n = R(3, 6), s = n * (n + 1) * (2 * n + 1) / 6; return question(`Calculez ${K('\\displaystyle\\sum_{k=1}^{' + n + '} k^2')}.`, s, [(n * (n + 1) / 2) ** 2, n * n, s - n * n, s + (n + 1) ** 2, n * (n + 1) / 2]); };
const L0 = q => '\\displaystyle\\lim_{x \\to 0} ' + q;
const limites3 = () => { const type = R(0, 4), a = R(2, 6);
  if (type === 0) { let b; do { b = R(2, 6); } while (b === a); return question(`Que vaut ${K(L0('\\dfrac{\\sin(' + a + 'x)}{' + b + 'x}'))} ?`, fr(a, b), [fr(b, a), '1', '0', INF]); }
  if (type === 1) return question(`Que vaut ${K(L0('\\dfrac{e^{' + a + 'x} - 1}{x}'))} ?`, a, ['1', '0', 'e^{' + a + '}', fr(1, a)]);
  if (type === 2) return question(`Que vaut ${K(L0('\\dfrac{\\ln(1 + ' + a + 'x)}{x}'))} ?`, a, ['1', '0', fr(1, a), '\\ln ' + a]);
  if (type === 3) return question(`Que vaut ${K('\\displaystyle\\lim_{n \\to +\\infty} \\left(1 + \\dfrac{' + a + '}{n}\\right)^n')} ?`, 'e^{' + a + '}', ['1', INF, 'e', String(a)]);
  return table([[L0('\\dfrac{1 - \\cos x}{x^2}'), '\\dfrac12', ['0', '1', '2']], ['\\displaystyle\\lim_{n \\to +\\infty} n\\sin\\dfrac1n', '1', ['0', INF, '\\dfrac12']], [L0('\\dfrac{e^x - 1 - x}{x^2}'), '\\dfrac12', ['0', '1', INF]],
    [L0('\\dfrac{\\sqrt{1+x} - 1}{x}'), '\\dfrac12', ['0', '1', '2']], [L0('\\dfrac{\\tan x}{x}'), '1', ['0', INF, '\\dfrac12']], ['\\displaystyle\\lim_{x \\to 0^+} x^x', '1', ['0', 'e', INF]], [L0('\\dfrac{\\arctan x}{x}'), '1', ['0', '\\dfrac{\\pi}{2}', '\\dfrac{\\pi}{4}']],
    [L0('\\dfrac{x - \\sin x}{x^3}'), '\\dfrac16', ['0', '\\dfrac13', '\\dfrac12']]].map(([q, b, f]) => [`Que vaut ${K(q)} ?`, b, f]))(); };
const derivees3 = () => { const a = R(2, 6), [f, bon] = pick([['\\sin(' + a + 'x)', String(a)], ['\\arctan(' + a + 'x)', String(a)], ['\\ln(1+' + a + 'x)', String(a)], ['(1+x)^{' + a + '}', String(a)], ['\\cos(' + a + 'x)', '0'], ['\\dfrac{1}{1+' + a + 'x}', String(-a)], ['\\sqrt{1+' + a + 'x}', fr(a, 2)], ['e^{' + a + 'x^2}', '0'], ['\\tan(' + a + 'x)', String(a)], ['e^{' + a + 'x}\\cos x', String(a)]]);
  return question(`Soit ${K('f(x) = ' + f)}. Calculez ${K("f'(0)")}.`, bon, melanger([String(a), '0', String(-a), fr(a, 2), '1', String(2 * a)])); };
const integrales3 = () => { if (R(0, 2) === 0) { const n = R(2, 6); return question(`Calculez ${K('\\displaystyle\\int_0^1 x^{' + n + '}\\,dx')}.`, fr(1, n + 1), [fr(1, n), String(n), fr(1, n + 2), '1']); }
  return table([['\\displaystyle\\int_0^{\\pi} \\sin x\\,dx', '2', ['0', '1', '\\pi']], ['\\displaystyle\\int_0^{\\pi/2} \\cos x\\,dx', '1', ['0', '\\dfrac{\\pi}{2}', '2']], ['\\displaystyle\\int_0^1 \\dfrac{dx}{1+x^2}', '\\dfrac{\\pi}{4}', ['\\dfrac{\\pi}{2}', '1', '\\ln 2']],
    ['\\displaystyle\\int_1^e \\ln x\\,dx', '1', ['e', 'e-1', '0']], ['\\displaystyle\\int_0^1 e^x\\,dx', 'e-1', ['e', '1', 'e+1']], ['\\displaystyle\\int_0^1 \\dfrac{dx}{1+x}', '\\ln 2', ['1', '\\dfrac12', '\\dfrac{\\pi}{4}']],
    ['\\displaystyle\\int_0^{2\\pi} \\cos^2 x\\,dx', '\\pi', ['2\\pi', '0', '1']], ['\\displaystyle\\int_{-1}^{1} x^3\\,dx', '0', ['\\dfrac12', '2', '\\dfrac14']], ['\\displaystyle\\int_0^1 x\\,e^x\\,dx', '1', ['e', 'e-1', '\\dfrac12']],
    ['\\displaystyle\\int_0^{\\pi} \\cos x\\,dx', '0', ['2', '1', '-2']]].map(([q, b, f]) => [`Calculez ${K(q)}.`, b, f]))(); };

// ---------- Maths expertes (classe « Terminale + Maths expertes ») ----------
const pgcdQ = () => { const g = R(2, 12); let m, n; do { m = R(2, 9); n = R(2, 9); } while (m === n || pgcd(m, n) !== 1); const a = g * m, b = g * n;
  // Les réponses fausses sont des diviseurs de l'un des deux nombres, au plus égaux au plus petit : aucune n'est absurde.
  const F = []; for (let x = 1; x <= Math.min(a, b); x++) if (x !== g && (a % x === 0 || b % x === 0)) F.push(x);
  return F.length < 3 ? null : question(`Calculez le PGCD de ${K(a)} et ${K(b)}.`, g, melanger(F)); };
const restes = () => { const b = pick([7, 9, 11, 13]), q = R(3, 12), r = R(1, b - 1), a = b * q + r; return question(`Quel est le reste de la division euclidienne de ${K(a)} par ${K(b)} ?`, r, [b - r, q % b, r + 1, r - 1, r + 2, r - 2].filter(x => x >= 0 && x < b)); };
const complexesExp = () => { const type = R(0, 2);
  if (type === 0) { const [a, b, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5]]), sa = pick([1, -1]), sb = pick([1, -1]); return question(`Calculez ${K('|' + cplx(sa * a, sb * b) + '|')}.`, h, [a + b, a * a + b * b, Math.abs(a - b), h + 1, h - 1]); }
  if (type === 1) { const n = R(2, 15); return question(`Calculez ${K('i^{' + n + '}')}.`, ['1', 'i', '-1', '-i'][n % 4], ['1', 'i', '-1', '-i']); }
  const a = pick([-3, -2, -1, 1, 2, 3]), b = pick([-3, -2, -1, 1, 2, 3]); return R(0, 1) ? question(`Calculez ${K('(' + cplx(a, b) + ')\\,\\overline{(' + cplx(a, b) + ')}')}.`, a * a + b * b, [a * a - b * b, 2 * a, a * a + b * b + 1, Math.abs(a) + Math.abs(b), a * a])
    : question(`Quel est le conjugué de ${K(cplx(a, b))} ?`, cplx(a, -b), [cplx(-a, b), cplx(-a, -b), cplx(b, a), cplx(a, b)]); };

// ---------- Calcul littéral (§155) : développer, factoriser, simplifier ; dériver et primitiver à vue ; développements limités, équivalents ----------
// Polynôme en x, coefficients entiers donnés du terme constant au terme dominant : une seule écriture par polynôme.
const poly = c => { let s = ''; for (let p = c.length - 1; p >= 0; p--) { const k = c[p]; if (!k) continue; const a = Math.abs(k);
    s += (k < 0 ? '-' : s ? '+' : '') + (p === 0 ? a : (a === 1 ? '' : a) + 'x' + (p > 1 ? '^{' + p + '}' : '')); } return s || '0'; };
const lin = (a, b) => poly([b, a]), par = s => '(' + s + ')', mono = (c, e) => poly(Array(e).fill(0).concat([c]));
const NZ = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
const developper = () => { const t = R(0, 2), a = R(1, 3), b = pick(NZ);
  if (t === 0) { const c = R(1, 3), d = pick(NZ); if (a === c && Math.abs(b) === Math.abs(d)) return null;
    return question(`Développez et réduisez ${K(par(lin(a, b)) + par(lin(c, d)))}.`, poly([b * d, a * d + b * c, a * c]), [poly([b * d, 0, a * c]), poly([b * d, a * d - b * c, a * c]), poly([-b * d, a * d + b * c, a * c]), poly([b + d, a * d + b * c, a * c]), poly([b * d, b + d, a * c])]); }
  if (t === 1) return question(`Développez et réduisez ${K(par(lin(a, b)) + '^2')}.`, poly([b * b, 2 * a * b, a * a]), [poly([b * b, 0, a * a]), poly([b * b, a * b, a * a]), poly([b * b, -2 * a * b, a * a]), poly([-b * b, 2 * a * b, a * a]), poly([b * b, 2 * a * b, a])]);
  const B = Math.abs(b); return question(`Développez et réduisez ${K(par(lin(a, -B)) + par(lin(a, B)))}.`, poly([-B * B, 0, a * a]), [poly([B * B, 0, a * a]), poly([B * B, -2 * a * B, a * a]), poly([-B * B, -2 * a * B, a * a]), poly([-B, 0, a * a]), poly([-B * B, 0, a])]); };
const factoriser = () => { const t = R(0, 3);
  if (t === 0) { const a = R(1, 3), B = R(1, 6); if (pgcd(a, B) !== 1) return null;
    return question(`Factorisez ${K(poly([-B * B, 0, a * a]))}.`, par(lin(a, -B)) + par(lin(a, B)), [par(lin(a, -B)) + '^2', par(lin(a, B)) + '^2', par(lin(a, -B * B)) + par(lin(a, 1)), par(lin(a * a, -B)) + par(lin(1, B)), 'x' + par(lin(a * a, -B * B))]); }
  if (t === 1) { const s = pick([1, -1]), B = R(1, 6);
    return question(`Factorisez ${K(poly([B * B, 2 * s * B, 1]))}.`, par(lin(1, s * B)) + '^2', [par(lin(1, -s * B)) + '^2', par(lin(1, -B)) + par(lin(1, B)), par(lin(1, 2 * s * B)) + '^2', 'x' + par(lin(1, 2 * s * B)), par(lin(1, s * B * B)) + '^2']); }
  if (t === 2) { let r1, r2; do { r1 = R(-6, 6); r2 = R(-6, 6); } while (!r1 || !r2 || r1 >= r2 || r1 === -r2);
    return question(`Factorisez ${K(poly([r1 * r2, -(r1 + r2), 1]))}.`, par(lin(1, -r1)) + par(lin(1, -r2)), [par(lin(1, r1)) + par(lin(1, r2)), par(lin(1, -r1)) + par(lin(1, r2)), par(lin(1, r1)) + par(lin(1, -r2))]); }
  const k = R(2, 5), m = R(1, 4), n = pick(NZ); if (pgcd(m, n) !== 1) return null;
  return question(`Factorisez ${K(poly([0, k * n, k * m]))}.`, k + 'x' + par(lin(m, n)), ['x' + par(lin(k * m, n)), k + 'x' + par(lin(m, k * n)), k + par(lin(m, n)), 'x' + par(lin(m, n)), k + 'x' + par(lin(m, -n))]); };
const simplifier = () => { const t = R(0, 3);
  if (t === 0) { const B = R(2, 4), k = R(2, 5), n = R(1, 3), m = n + R(1, 4);
    return question(`Simplifiez ${K('\\dfrac{' + mono(k * B, m) + '}{' + mono(B, n) + '}')}, pour ${K('x \\neq 0')}.`, mono(k, m - n), [mono(k, m + n), mono(k * B - B, m - n), mono(k * B, m - n), mono(k, m * n), mono(k, m - n + 1)]); }
  if (t === 1) { const a = R(2, 5), m = R(2, 4);
    return question(`Simplifiez ${K('\\left(' + mono(a, m) + '\\right)^2')}.`, mono(a * a, 2 * m), [mono(a, 2 * m), mono(a * a, m + 2), mono(2 * a, 2 * m), mono(a * a, m * m), mono(a * a, m), mono(a, m + 2), mono(a * a, 2 * m + 1)]); }
  if (t === 2) { const b = R(1, 6);
    return question(`Simplifiez ${K('\\dfrac{' + poly([-b * b, 0, 1]) + '}{' + lin(1, -b) + '}')}, pour ${K('x \\neq ' + b)}.`, lin(1, b), [lin(1, -b), lin(1, b * b), poly([b, 0, 1]), 'x', lin(1, -b * b)]); }
  const a = R(2, 6), b = pick(NZ); return question(`Simplifiez ${K('\\dfrac{' + lin(a, a * b) + '}{' + a + '}')}.`, lin(1, b), [lin(1, a * b), lin(a, b), lin(1, a + b), 'x', lin(a, a * b)]); };

const deriver = () => { const a = R(2, 5), b = R(1, 6), n = R(3, 5), E = 'e^{' + a + 'x}', u = lin(a, b), [f, bon, faux] = pick([
    ['x\\,' + E, '(1+' + a + 'x)' + E, [a + E, a + 'x\\,' + E, '(1+x)' + E, E]],
    ['\\ln(x^2+' + b + ')', '\\dfrac{2x}{x^2+' + b + '}', ['\\dfrac{1}{x^2+' + b + '}', '\\dfrac{1}{2x}', '2x\\ln(x^2+' + b + ')', '\\dfrac{x^2}{x^2+' + b + '}']],
    ['e^{' + a + 'x^2}', 2 * a + 'x\\,e^{' + a + 'x^2}', ['e^{' + a + 'x^2}', a + 'x\\,e^{' + a + 'x^2}', 2 * a + 'x\\,e^{' + 2 * a + 'x}', a + 'x^2e^{' + a + 'x^2}']],
    ['(' + u + ')^{' + n + '}', n * a + '(' + u + ')^{' + (n - 1) + '}', [n + '(' + u + ')^{' + (n - 1) + '}', a + '(' + u + ')^{' + (n - 1) + '}', n * a + '(' + u + ')^{' + n + '}', n * a + 'x^{' + (n - 1) + '}']],
    ['\\dfrac{1}{' + u + '}', '-\\dfrac{' + a + '}{(' + u + ')^2}', ['\\dfrac{' + a + '}{(' + u + ')^2}', '-\\dfrac{1}{(' + u + ')^2}', '-\\dfrac{' + a + '}{' + u + '}', '\\ln(' + u + ')']],
    ['x\\ln x', '\\ln x+1', ['\\dfrac{1}{x}', '\\ln x', '1', '\\dfrac{\\ln x}{x}']],
    ['\\sqrt{' + u + '}', '\\dfrac{' + a + '}{2\\sqrt{' + u + '}}', ['\\dfrac{1}{2\\sqrt{' + u + '}}', '\\dfrac{' + a + '}{\\sqrt{' + u + '}}', '\\dfrac{' + a + '}{2}\\sqrt{' + u + '}', '\\dfrac{1}{\\sqrt{' + u + '}}']],
    ['\\cos(' + a + 'x)', '-' + a + '\\sin(' + a + 'x)', [a + '\\sin(' + a + 'x)', '-\\sin(' + a + 'x)', '-' + a + '\\cos(' + a + 'x)', a + '\\cos(' + a + 'x)']],
    ['\\sin(' + a + 'x)', a + '\\cos(' + a + 'x)', ['-' + a + '\\cos(' + a + 'x)', '\\cos(' + a + 'x)', a + '\\sin(' + a + 'x)', '-' + a + '\\sin(' + a + 'x)']],
    ['\\dfrac{\\ln x}{x}', '\\dfrac{1-\\ln x}{x^2}', ['\\dfrac{1}{x^2}', '\\dfrac{\\ln x-1}{x^2}', '\\dfrac{1}{x}', '\\dfrac{1+\\ln x}{x^2}']]]);
  return question(`Soit ${K('f(x) = ' + f)}. Quelle est l'expression de ${K("f'(x)")} ?`, bon, faux); };
const primitives = () => { const a = R(2, 5), b = R(1, 6), n = R(2, 5), k = R(2, 4), E = 'e^{' + a + 'x}', inv = '\\dfrac{1}{' + a + '}', u = lin(a, b), [f, bon, faux, pos] = pick([
    [E, inv + E, [a + E, E, 'x\\,' + E, '\\dfrac{e^{' + a + 'x+1}}{' + a + 'x+1}']],
    ['x^{' + n + '}', '\\dfrac{x^{' + (n + 1) + '}}{' + (n + 1) + '}', [n + 'x' + (n > 2 ? '^{' + (n - 1) + '}' : ''), 'x^{' + (n + 1) + '}', '\\dfrac{x^{' + (n + 1) + '}}{' + n + '}', (n + 1) + 'x^{' + (n + 1) + '}']],
    ['\\dfrac{2x}{x^2+' + b + '}', '\\ln(x^2+' + b + ')', ['\\dfrac{1}{x^2+' + b + '}', '2\\ln(x^2+' + b + ')', '\\ln(2x)', '\\dfrac{x^2}{x^2+' + b + '}'], 1],
    [2 * k + 'x\\,e^{x^2}', k + 'e^{x^2}', [2 * k + 'e^{x^2}', k + 'x^2e^{x^2}', 'e^{x^2}', 4 * k + 'x^2e^{x^2}']],
    ['\\cos(' + a + 'x)', inv + '\\sin(' + a + 'x)', [a + '\\sin(' + a + 'x)', '-' + inv + '\\sin(' + a + 'x)', '-' + a + '\\sin(' + a + 'x)', '\\sin(' + a + 'x)']],
    ['\\sin(' + a + 'x)', '-' + inv + '\\cos(' + a + 'x)', [inv + '\\cos(' + a + 'x)', a + '\\cos(' + a + 'x)', '-' + a + '\\cos(' + a + 'x)', '-\\cos(' + a + 'x)']],
    ['\\dfrac{1}{x^2}', '-\\dfrac{1}{x}', ['\\dfrac{1}{x}', '-\\dfrac{2}{x^3}', '\\ln(x^2)', '\\dfrac{1}{x^3}'], 1],
    ['\\dfrac{1}{\\sqrt{x}}', '2\\sqrt{x}', ['\\sqrt{x}', '\\dfrac{1}{2\\sqrt{x}}', '-\\dfrac{1}{2x\\sqrt{x}}', '\\ln(\\sqrt{x})'], 1],
    ['\\dfrac{1}{' + u + '}', inv + '\\ln(' + u + ')', ['\\ln(' + u + ')', a + '\\ln(' + u + ')', '-\\dfrac{' + a + '}{(' + u + ')^2}', '-\\dfrac{1}{(' + u + ')^2}'], 1]]);
  return question(`Laquelle de ces fonctions est une primitive de ${K('x \\mapsto ' + f)}` + (pos ? ` sur ${K(']0, +\\infty[')}` : '') + ' ?', bon, faux); };

// Terme (n/d)·v^p sans son signe, puis somme de termes [n, d, p] et reste o(x^ordre).
const terme = (n, d, p, v = 'x') => { const g = pgcd(n, d), a = Math.abs(n) / g, e = d / g, x = p === 0 ? '' : v + (p > 1 ? '^{' + p + '}' : '');
  return e === 1 ? (a === 1 && p > 0 ? '' : a) + x : '\\dfrac{' + a + '}{' + e + '}' + x; };
const signe = (n, d, p, v) => (n * d < 0 ? '-' : '') + terme(n, Math.abs(d), p, v);
const dlS = (T, o) => T.filter(t => t[0]).map((t, i) => (t[0] < 0 ? '-' : i ? '+' : '') + terme(t[0], t[1], t[2])).join('') + '+o(' + (o > 1 ? 'x^{' + o + '}' : 'x') + ')';
const dl = () => { const a = R(2, 4), c = R(3, 6), U = [1, 1, 0], [f, o, bon, faux] = pick([
    ['e^{' + a + 'x}', 2, [U, [a, 1, 1], [a * a, 2, 2]], [[U, [a, 1, 1], [a * a, 1, 2]], [U, [a, 1, 1], [a, 2, 2]], [U, [1, 1, 1], [1, 2, 2]], [U, [a, 1, 1], [-a * a, 2, 2]]]],
    ['\\ln(1+' + a + 'x)', 2, [[a, 1, 1], [-a * a, 2, 2]], [[[a, 1, 1], [a * a, 2, 2]], [[a, 1, 1], [-a, 2, 2]], [[a, 1, 1], [-a * a, 1, 2]], [U, [a, 1, 1], [-a * a, 2, 2]]]],
    ['\\dfrac{1}{1+' + a + 'x}', 2, [U, [-a, 1, 1], [a * a, 1, 2]], [[U, [a, 1, 1], [a * a, 1, 2]], [U, [-a, 1, 1], [-a * a, 1, 2]], [U, [-a, 1, 1], [a, 1, 2]], [U, [-a, 1, 1], [a * a, 2, 2]]]],
    ['\\dfrac{1}{1-' + a + 'x}', 2, [U, [a, 1, 1], [a * a, 1, 2]], [[U, [-a, 1, 1], [a * a, 1, 2]], [U, [a, 1, 1], [a * a, 2, 2]], [U, [a, 1, 1], [-a * a, 1, 2]], [U, [a, 1, 1], [a, 1, 2]]]],
    ['\\sqrt{1+' + a + 'x}', 2, [U, [a, 2, 1], [-a * a, 8, 2]], [[U, [a, 2, 1], [a * a, 8, 2]], [U, [a, 2, 1], [-a * a, 4, 2]], [U, [a, 1, 1], [-a * a, 2, 2]], [U, [a, 2, 1], [-a, 8, 2]]]],
    ['\\cos(' + a + 'x)', 2, [U, [-a * a, 2, 2]], [[U, [-a, 2, 2]], [U, [a * a, 2, 2]], [U, [-a * a, 1, 2]], [U, [-1, 2, 2]]]],
    ['\\sin(' + a + 'x)', 3, [[a, 1, 1], [-(a ** 3), 6, 3]], [[[a, 1, 1], [-a, 6, 3]], [[a, 1, 1], [a ** 3, 6, 3]], [[a, 1, 1], [-(a ** 3), 3, 3]], [[a, 1, 1], [-(a ** 3), 2, 3]]]],
    ['(1+x)^{' + c + '}', 2, [U, [c, 1, 1], [c * (c - 1), 2, 2]], [[U, [c, 1, 1], [c * c, 2, 2]], [U, [c, 1, 1], [c * (c + 1), 2, 2]], [U, [c, 1, 1], [c, 2, 2]], [U, [c, 1, 1], [c * (c - 1), 1, 2]]]],
    ['\\tan x', 3, [[1, 1, 1], [1, 3, 3]], [[[1, 1, 1], [-1, 3, 3]], [[1, 1, 1], [1, 6, 3]], [[1, 1, 1], [1, 2, 3]], [[1, 1, 1], [-1, 6, 3]]]],
    ['\\arctan x', 3, [[1, 1, 1], [-1, 3, 3]], [[[1, 1, 1], [1, 3, 3]], [[1, 1, 1], [-1, 6, 3]], [[1, 1, 1], [-1, 2, 3]], [[1, 1, 1], [1, 6, 3]]]],
    ['\\dfrac{1}{1+x^2}', 4, [U, [-1, 1, 2], [1, 1, 4]], [[U, [1, 1, 2], [1, 1, 4]], [U, [-1, 1, 2], [1, 2, 4]], [U, [-1, 1, 2], [-1, 1, 4]], [U, [-2, 1, 2], [1, 1, 4]]]],
    ['\\ln(1+x)', 3, [[1, 1, 1], [-1, 2, 2], [1, 3, 3]], [[[1, 1, 1], [-1, 2, 2], [1, 6, 3]], [[1, 1, 1], [1, 2, 2], [1, 3, 3]], [[1, 1, 1], [-1, 1, 2], [1, 1, 3]], [[1, 1, 1], [-1, 2, 2], [-1, 3, 3]]]]]);
  return question(`Quel est le développement limité à l'ordre ${K(o)} en 0 de ${K(f)} ?`, dlS(bon, o), faux.map(t => dlS(t, o))); };
const equivalents = () => { const a = R(2, 5), c = R(1, 4), s = (n, d, p, v) => signe(n, d, p, v);
  if (R(0, 2)) { const [f, bon, faux] = pick([
      ['\\sin(' + a + 'x)', s(a, 1, 1), [s(1, 1, 1), s(a, 1, 0), s(a, 1, 2), s(a, 2, 1)]],
      ['1-\\cos(' + (c === 1 ? '' : c) + 'x)', s(c * c, 2, 2), [s(c, 2, 2), s(c * c, 1, 2), s(c * c, 2, 1), s(-c * c, 2, 2), s(c, 1, 1)]],
      ['\\ln(1+' + a + 'x)', s(a, 1, 1), [s(1, 1, 1), s(a, 1, 2), s(-a * a, 2, 2), s(a, 1, 0)]],
      ['e^{' + a + 'x}-1', s(a, 1, 1), [s(1, 1, 1), s(a, 1, 2), s(a * a, 2, 2), s(1, 1, 0)]],
      ['\\sqrt{1+' + a + 'x}-1', s(a, 2, 1), [s(a, 1, 1), s(1, 2, 1), s(a, 2, 2), s(-a * a, 8, 2)]],
      ['e^{x}-1-x', s(1, 2, 2), [s(1, 1, 1), s(1, 1, 2), s(1, 6, 3), s(-1, 2, 2)]],
      ['\\sin x-x', s(-1, 6, 3), [s(1, 6, 3), s(-1, 3, 3), s(-1, 2, 2), s(1, 1, 1)]],
      ['\\ln(\\cos x)', s(-1, 2, 2), [s(1, 2, 2), s(-1, 1, 2), s(-1, 1, 1), s(-1, 2, 1)]],
      ['\\tan x-x', s(1, 3, 3), [s(-1, 3, 3), s(1, 6, 3), s(1, 1, 2), s(1, 2, 3)]],
      ['\\sqrt{1+x}-\\sqrt{1-x}', s(1, 1, 1), [s(1, 2, 1), s(2, 1, 1), s(1, 1, 2), s(-1, 4, 2)]]]);
    return question(`Quel est un équivalent de ${K(f)} quand ${K('x')} tend vers 0 ?`, bon, faux); }
  const b = R(1, 9), d = R(1, 9), p = R(2, 5), q = R(2, 5), [f, bon, faux] = pick([
    ['\\dfrac{' + p + 'n^2+' + b + 'n}{' + q + 'n+' + d + '}', p === q ? 'n' : s(p, q, 1, 'n'), [s(p, q, 2, 'n'), fr(p, q), s(b, d, 1, 'n'), s(p, 1, 1, 'n'), s(p, q * q, 1, 'n')]],
    ['\\ln(n^2+1)', '2\\ln n', ['\\ln n', 'n^2', '2n']],
    ['\\sqrt{n^2+n}-n', '\\dfrac{1}{2}', ['0', '\\dfrac{n}{2}', '1', '\\sqrt{n}']],
    ['\\ln\\left(1+\\dfrac{' + a + '}{n}\\right)', '\\dfrac{' + a + '}{n}', ['\\dfrac{1}{n}', String(a), '\\dfrac{' + a + '}{n^2}', '\\ln ' + a]],
    ['n\\sin\\left(\\dfrac{1}{n}\\right)', '1', ['n', '\\dfrac{1}{n}', '0', '\\sin 1']],
    ['\\displaystyle\\binom{n}{2}', '\\dfrac{n^2}{2}', ['n^2', '\\dfrac{n}{2}', '2n', 'n']],
    ['e^{1/n}-1', '\\dfrac{1}{n}', ['1', '0', 'e', '\\dfrac{1}{n^2}']],
    ['\\sqrt{n+1}-\\sqrt{n}', '\\dfrac{1}{2\\sqrt{n}}', ['0', '\\dfrac{1}{\\sqrt{n}}', '\\dfrac{1}{2}', '\\dfrac{1}{2n}']]]);
  return question(`Quel est un équivalent de ${K('u_n = ' + f)} quand ${K('n')} tend vers ${K('+\\infty')} ?`, bon, faux); };

export const FAMILLES = {
  premiere: [['carres', 'Carrés de 11 à 25', carres], ['pourcentages', 'Pourcentages', pourcentages], ['fractions', 'Sommes de fractions', fractions], ['puissances', 'Puissances', puissances], ['discriminant', 'Discriminants', discriminant], ['derive', 'Nombres dérivés', nombreDerive], ['suites', 'Suites arithmétiques et géométriques', suites1], ['trigo', 'Valeurs de cosinus et de sinus', trigo], ['developper', 'Développer', developper], ['factoriser', 'Factoriser', factoriser], ['simplifier', 'Simplifier', simplifier]],
  terminale: [['logexp', 'Logarithmes et exponentielles', logexp], ['derivees', 'Dérivées en un point', derivees2], ['deriver', 'Fonctions dérivées', deriver], ['integrales', 'Intégrales', integrales2], ['primitives', 'Primitives', primitives], ['limites', 'Limites', limites2], ['binomiaux', 'Coefficients binomiaux', binomiaux], ['sommes', 'Sommes', sommes2], ['binomiale', 'Loi binomiale', binomiale]],
  expertes: [],
  sup: [['complexes', 'Nombres complexes', complexes], ['determinants', 'Déterminants d\'ordre 2', determinantDe(true)], ['congruences', 'Congruences', congruences], ['sommes', 'Sommes', sommes3], ['limites', 'Limites usuelles', limites3], ['derivees', 'Dérivées en 0', derivees3], ['integrales', 'Intégrales usuelles', integrales3], ['dl', 'Développements limités', dl], ['equivalents', 'Équivalents', equivalents]],
};
// Une série de n questions toutes différentes, dans une famille ou en mélange.
export function serie(niveau, famille, n = 10) { const F = FAMILLES[niveau], G = famille === 'melange' ? F : F.filter(f => f[0] === famille), S = [], vus = new Set(); let garde = 0;
  while (S.length < n && garde++ < 4000) { const g = famille === 'melange' ? G[(S.length + garde) % G.length] : G[0], x = g[2](); if (!x || vus.has(x.q)) continue; vus.add(x.q); S.push(x); }
  return famille === 'melange' ? melanger(S) : S; }
// La classe « Terminale + Maths expertes » reprend les thèmes de Terminale et y ajoute ceux de l'option.
FAMILLES.expertes = FAMILLES.terminale.concat([['complexes', 'Nombres complexes', complexesExp], ['pgcd', 'PGCD', pgcdQ], ['restes', 'Divisions euclidiennes', restes], ['congruences', 'Congruences', congruences], ['determinants', 'Déterminants d\'ordre 2', determinantDe(false)]]);

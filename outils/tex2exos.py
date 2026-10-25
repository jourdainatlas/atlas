#!/usr/bin/env python3
"""Convertit une feuille d'exercices LaTeX (énoncé + corrigé) en données pour ATLAS.

Usage : python3 outils/tex2exos.py ENONCE.tex CORRIGE.tex ENONCE.pdf CORRIGE.pdf FEUILLE PREFIXE > sortie.yaml
  FEUILLE : identifiant de la feuille (f-t-02) ; PREFIXE : préfixe des exercices (t-02).
Les figures TikZ sont compilées en SVG dans documents/figures/ (nom = empreinte du code).
Les métadonnées (mots-clés, nœuds…) sont proposées par outils/meta_<PREFIXE>.py s'il existe, à relire."""
import re, sys, os, hashlib, subprocess, tempfile, json, importlib.util

# ------------------------------------------------------------------ lecture et macros
def lire(p): return open(p, encoding='utf-8').read()

def accolade(s, i):
    """s[i] == '{' : renvoie l'indice juste après l'accolade fermante correspondante."""
    assert s[i] == '{', s[i:i+30]
    d = 0
    for j in range(i, len(s)):
        c = s[j]
        if c == '\\': continue
        if s[j-1] == '\\' and j > 0 and s[j-2:j] != '\\\\': continue
        if c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: return j + 1
    raise ValueError('accolade non fermée : ' + s[i:i+60])

def arg(s, i):
    """Lit un argument {…} à partir de i (espaces sautés). Renvoie (contenu, fin)."""
    while i < len(s) and s[i] in ' \t\n': i += 1
    if i < len(s) and s[i] == '{':
        f = accolade(s, i); return s[i+1:f-1], f
    if i < len(s) and s[i] == '\\':
        m = re.match(r'\\[A-Za-z]+|\\.', s[i:]); return m.group(0), i + len(m.group(0))
    return s[i], i + 1

def sans_commentaires(t):
    return '\n'.join(re.sub(r'(?<!\\)%.*$', '', l) for l in t.split('\n'))

STRUCTURELLES = {'exo', 'partie', 'etoile', 'etoiles', 'etoilesss', 'etoilesv'}
def lire_macros(pre):
    M = {}
    for m in re.finditer(r'\\(?:re)?newcommand\*?\s*\{?\\([A-Za-z]+)\}?\s*(?:\[(\d)\])?', pre):
        nom, n = m.group(1), int(m.group(2) or 0)
        i = m.end()
        while pre[i] in ' \n': i += 1
        if pre[i] != '{': continue
        f = accolade(pre, i)
        if nom not in STRUCTURELLES: M[nom] = (n, pre[i+1:f-1])
    for m in re.finditer(r'\\DeclareMathOperator\{\\([A-Za-z]+)\}\{([^}]*)\}', pre):
        M[m.group(1)] = (0, r'\mathrm{%s}' % m.group(2))
    M['gui'] = (1, r'«\,#1\,»')            # \guillemotleft inconnu de KaTeX
    return M

def developper(t, M):
    for _ in range(6):
        avant = t
        for nom, (n, corps) in M.items():
            motif = re.compile(r'\\' + nom + r'(?![A-Za-z])')
            out, i = [], 0
            for m in list(motif.finditer(t)):
                if m.start() < i: continue
                out.append(t[i:m.start()]); j = m.end(); args = []
                ok = True
                for _k in range(n):
                    try: a, j = arg(t, j)
                    except Exception: ok = False; break
                    args.append(a)
                if not ok: out.append(m.group(0)); i = m.end(); continue
                r = corps
                for k, a in enumerate(args): r = r.replace('#%d' % (k + 1), a)
                if n == 0 and j < len(t) and t[j].isalpha(): r = r + ' '
                if r[:1].isalpha() and re.search(r'\\[A-Za-z]+$', t[max(0, m.start() - 40):m.start()]): r = ' ' + r
                out.append(r); i = j
            out.append(t[i:]); t = ''.join(out)
        if t == avant: break
    return t

# ------------------------------------------------------------------ figures TikZ
DOSSIER_FIG = 'documents/figures'
def compiler_figure(code, pre):
    h = hashlib.sha256((pre + code).encode()).hexdigest()[:16]
    cible = f'{DOSSIER_FIG}/{h}.svg'
    if os.path.exists(cible): return cible
    os.makedirs(DOSSIER_FIG, exist_ok=True)
    garde = [l for l in pre.split('\n') if not re.match(r'\s*\\(documentclass|usepackage(\[[^]]*\])?\{(geometry|fancyhdr|lmodern)\}|pagestyle|fancyhf|fancyfoot|fancyhead|geometry)', l)
             and 'headrulewidth' not in l and 'footrulewidth' not in l]
    doc = '\\documentclass[border=4pt]{standalone}\n' + '\n'.join(garde) + '\n\\begin{document}\n' + code + '\n\\end{document}\n'
    with tempfile.TemporaryDirectory() as d:
        open(f'{d}/f.tex', 'w').write(doc)
        r = subprocess.run(['pdflatex', '-interaction=nonstopmode', 'f.tex'], cwd=d, capture_output=True, text=True)
        if not os.path.exists(f'{d}/f.pdf'):
            sys.stderr.write('ÉCHEC figure :\n' + r.stdout[-1500:] + '\n'); return None
        subprocess.run(['pdftocairo', '-svg', 'f.pdf', os.path.abspath(cible)], cwd=d, check=True)
    return cible

# ------------------------------------------------------------------ conversion d'un fragment
class Conv:
    def __init__(s, pre): s.pre = pre; s.ph = {}; s.n = 0
    def jeton(s, genre, val):
        s.n += 1; k = f'@@{genre}{s.n}@@'; s.ph[k] = (genre, val); return k

    def tableau(s, spec, corps):
        spec = re.sub(r'>\{[^}]*\}', '', spec); spec = re.sub(r'[pmb]\{[^}]*\}', 'l', spec)
        spec = spec.replace('Q', 'c').replace('@{}', '')
        corps = re.sub(r'\\(rowcolor|cellcolor)(\[[^]]*\])?\{[^}]*\}', '', corps)
        corps = re.sub(r'\\(renewcommand|arraystretch)[^\n]*', '', corps)
        lignes = s.couper_lignes(corps)
        out = []
        for li in lignes:
            hl = []
            li = li.strip()
            while li.startswith('\\hline'): hl.append('\\hline'); li = li[6:].strip()
            if not li: out.append(' '.join(hl)); continue
            cells = s.couper_cellules(li)
            out.append(' '.join(hl) + ' ' + ' & '.join(s.cellule(c) for c in cells))
        return '\\begin{array}{%s} %s \\end{array}' % (spec, ' \\\\ '.join(x for x in out if x is not None))

    def tableau_texte(s, spec, corps):
        """Tableau à rendre en HTML (le texte doit pouvoir passer à la ligne) : colonne p{…}
        ou cellule de texte longue. Les tableaux numériques restent des array KaTeX."""
        if re.search(r'[pmb]\{', spec): return True
        for li in s.couper_lignes(corps):
            for c in s.couper_cellules(li):
                if len(re.sub(r'\$[^$]*\$', '', c).strip()) > 40: return True
        return False

    def tableau_html(s, corps):
        """Bloc ```tableau : une ligne par rangée, cellules séparées par « ¦ », texte et $formules$."""
        corps = re.sub(r'\\(rowcolor|cellcolor)(\[[^]]*\])?\{[^}]*\}', '', corps)
        corps = re.sub(r'\\(renewcommand|arraystretch)[^\n]*', '', corps)
        rangs = []
        for li in s.couper_lignes(corps):
            li = li.replace('\\hline', '').strip()
            if not li: continue
            cells = []
            for c in s.couper_cellules(li):
                c = re.sub(r'\\phantom\{(?:[^{}]|\{[^{}]*\})*\}', '', c).strip()
                parts = re.split(r'(\$[^$]*\$)', c); r = ''
                for q in parts:
                    if q.startswith('$'): r += '$' + s.tex_math(q[1:-1]) + '$'
                    else:
                        q = re.sub(r'\\textbf\{([^}]*)\}', r'**\1**', q); q = re.sub(r'\\emph\{([^}]*)\}', r'*\1*', q)
                        q = q.replace('\\og', '«').replace('\\fg{}', '»').replace('\\fg', '»').replace('~', ' ')
                        r += q
                cells.append(re.sub(r'\s+', ' ', r).strip().replace('¦', '|'))
            rangs.append(' ¦ '.join(cells))
        return '\n'.join(rangs)

    def couper_lignes(s, corps):
        """Coupe aux \\\\ de niveau 0 (hors accolades et hors environnements imbriqués, ex. pmatrix)."""
        out, cur, d, env, i = [], '', 0, 0, 0
        while i < len(corps):
            if corps.startswith('\\begin{', i): env += 1
            elif corps.startswith('\\end{', i): env -= 1
            c = corps[i]
            if c == '{': d += 1
            elif c == '}': d -= 1
            if corps.startswith('\\\\', i) and d == 0 and env == 0:
                out.append(cur); cur = ''; i += 2
                m = re.match(r'\[[^]]*\]', corps[i:])
                if m: i += m.end()
                continue
            if c == '\\' and i + 1 < len(corps): cur += corps[i:i + 2]; i += 2; continue
            cur += c; i += 1
        out.append(cur); return out

    def couper_cellules(s, li):
        cells, d, cur, dollar = [], 0, '', False
        for i, c in enumerate(li):
            if c == '$' and (i == 0 or li[i-1] != '\\'): dollar = not dollar
            if c == '{': d += 1
            if c == '}': d -= 1
            if c == '&' and d == 0 and not dollar and (i == 0 or li[i-1] != '\\'): cells.append(cur); cur = ''
            else: cur += c
        cells.append(cur); return cells

    def cellule(s, c):
        c = c.strip().replace('\\hline', '')
        c = re.sub(r'\\phantom\{(?:[^{}]|\{[^{}]*\})*\}', '', c).strip()
        if not c: return ''
        parts = [p for p in re.split(r'(\$[^$]*\$)', c) if p]
        r = ''
        for k, p in enumerate(parts):
            if p.startswith('$'): r += p[1:-1]
            elif p.strip():
                q = s.texte_simple(p).replace('{', '').replace('}', '')
                if not q: continue
                if k > 0 and p[0].isspace(): q = ' ' + q
                if k < len(parts) - 1 and p[-1].isspace(): q = q + ' '
                r += '\\text{%s}' % q
        return r

    def texte_simple(s, p):
        p = re.sub(r'\\textbf\{([^}]*)\}', r'\1', p); p = re.sub(r'\\emph\{([^}]*)\}', r'\1', p)
        p = p.replace('\\og', '«').replace('\\fg{}', '»').replace('\\fg', '»').replace('~', ' ')
        p = re.sub(r'\\(phantom)\{[^}]*\}', '', p)
        return p.strip()

    def maths(s, t):
        """Extrait les formules et blocs spéciaux en jetons. Ordre : code, figures, tableaux, alignements, display, inline."""
        def rempl_env(t, nom, f):
            motif = re.compile(r'\\begin\{' + re.escape(nom) + r'\}')
            while True:
                m = motif.search(t)
                if not m: return t
                fin = t.index('\\end{%s}' % nom, m.end())
                t = t[:m.start()] + f(t[m.end():fin], t[m.start():fin + len('\\end{%s}' % nom)]) + t[fin + len('\\end{%s}' % nom):]
        t = rempl_env(t, 'lstlisting', lambda c, tout: s.jeton('CODE', re.sub(r'^\[[^]]*\]', '', c).strip('\n')))
        t = rempl_env(t, 'tikzpicture', lambda c, tout: s.jeton('FIG', tout))
        def tab(c, tout):
            spec, j = arg(c, 0)
            if s.tableau_texte(spec, c[j:]): return s.jeton('TABH', s.tableau_html(c[j:]))
            return s.jeton('TAB', s.tableau(spec, c[j:]))
        t = rempl_env(t, 'tabular', tab)
        for env in ('align*', 'align', 'eqnarray*', 'equation*', 'equation', 'gather*'):
            cible = 'gathered' if env.startswith('gather') else 'aligned'
            if env.startswith('equation'):
                t = rempl_env(t, env, lambda c, tout: s.jeton('MD', c.strip()))
            else:
                t = rempl_env(t, env, lambda c, tout, cible=cible: s.jeton('MD', '\\begin{%s} %s \\end{%s}' % (cible, c.strip(), cible)))
        t = re.sub(r'\\\[([\s\S]*?)\\\]', lambda m: s.jeton('MD', m.group(1).strip()), t)
        t = re.sub(r'\$\$([\s\S]*?)\$\$', lambda m: s.jeton('MD', m.group(1).strip()), t)
        t = re.sub(r'\\\(([\s\S]*?)\\\)', lambda m: s.jeton('MI', m.group(1)), t)
        # formules en ligne : un $ fermant n'est reconnu qu'au niveau 0 des accolades ($ imbriqués dans \text{…})
        out, i = [], 0
        while True:
            j = t.find('$', i)
            while j > 0 and t[j-1] == '\\': j = t.find('$', j + 1)
            if j < 0: out.append(t[i:]); break
            d, k = 0, j + 1
            while k < len(t):
                c = t[k]
                if c == '\\': k += 2; continue
                if c == '{': d += 1
                elif c == '}': d -= 1
                elif c == '$' and d == 0: break
                k += 1
            out.append(t[i:j]); out.append(s.jeton('MI', t[j+1:k])); i = k + 1
        return ''.join(out)

    def tex_math(s, m):
        m = re.sub(r'@@TAB\d+@@', lambda x: s.ph[x.group(0)][1], m)
        m = m.replace('\\textrm', '\\text')
        # \text{… $x$ …} : les $ imbriqués sont sortis du texte (le site découpe les formules sur $)
        def sortir(mm):
            debut = mm.start(); j = debut + len(mm.group(0)) - 1
            f = accolade(m2[0], j); contenu = m2[0][j+1:f-1]
            if '$' not in contenu: return None
            morceaux = contenu.split('$')
            r = ''.join(('\\text{%s}' % x if x else '') if k % 2 == 0 else '{' + x + '}' for k, x in enumerate(morceaux))
            m2[0] = m2[0][:debut] + r + m2[0][f:]; return True
        m2 = [m]
        while True:
            for mm in re.finditer(r'\\(text|mbox)\{', m2[0]):
                if sortir(mm): break
            else: break
        m = m2[0]
        m = re.sub(r'\\(medskip|smallskip|bigskip|noindent)\b', '', m)
        m = m.replace('\\og', '«').replace('\\fg{}', '»').replace('\\fg', '»')
        m = re.sub(r'\\(rowcolor|cellcolor)\{[^}]*\}', '', m)
        return re.sub(r'\s+', ' ', m).strip()

    def listes(s, t):
        """Remplace enumerate/itemize par des paragraphes étiquetés."""
        jet = re.compile(r'\\begin\{(enumerate|itemize)\}(\[[^\]]*\])?|\\end\{(enumerate|itemize)\}|\\item(\[[^\]]*\])?')
        pile, out, i, dernier = [], [], 0, {}
        for m in jet.finditer(t):
            out.append(t[i:m.start()]); i = m.end()
            if m.group(1):
                opts = (m.group(2) or '')[1:-1]
                niveau = sum(1 for x in pile if x['type'] == 'enumerate') + (1 if m.group(1) == 'enumerate' else 0)
                style = 'puce'
                if m.group(1) == 'enumerate':
                    style = 'alpha)' if re.search(r'label\s*=\s*\\alph\*\)', opts) else ('(alpha)' if (niveau >= 2 or re.search(r'\(\\alph', opts)) else 'num')
                c = 0
                ms = re.search(r'start\s*=\s*(\d+)', opts)
                if ms: c = int(ms.group(1)) - 1
                if 'resume' in opts: c = dernier.get(niveau, 0)
                pile.append({'type': m.group(1), 'style': style, 'c': c, 'niveau': niveau})
            elif m.group(3):
                if pile:
                    p = pile.pop(); dernier[p['niveau']] = p['c']
                out.append('\n\n')
            else:
                if not pile: continue
                p = pile[-1]; p['c'] += 1
                if m.group(4):
                    lab = m.group(4)[1:-1].strip()
                    if 'bullet' in lab: lab = '•'
                    else: lab = re.sub(r'\\textbf\{([^}]*)\}', r'\1', lab)
                    out.append('\n\n' + (lab + ' ' if lab == '•' else f'**{lab}** '))
                elif p['type'] == 'itemize': out.append('\n\n• ')
                elif p['style'] == 'num': out.append(f'\n\n**{p["c"]}.** ')
                elif p['style'] == 'alpha)': out.append(f'\n\n**{chr(96 + p["c"])})** ')
                else: out.append(f'\n\n**({chr(96 + p["c"])})** ')
        out.append(t[i:])
        r = ''.join(out)
        # « **1.** » suivi directement d'une sous-question : fusion sur un même paragraphe
        r = re.sub(r'(\*\*[^*\n]{1,6}\*\* )\s*\n\n(\*\*\(?[a-z]\)\*\* )', r'\1\2', r)
        return r

    def texte(s, t):
        t = s.listes(t)
        rep = [(r'\\textbf\{\\itshape\s*([^}]*)\}', r'**\1**'), (r'\{\\itshape\s*([^}]*)\}', r'*\1*'),
               (r'\\textsuperscript\{(e|ème|eme)\}', 'ᵉ'), (r'\\textsuperscript\{(ère|re)\}', 'ʳᵉ'),
               (r'\\textsuperscript\{([^}]*)\}', r'\1'), (r'\\underline\{([^{}]*)\}', r'\1'),
               (r'\\textcolor\{[^}]*\}\{([^{}]*)\}', r'\1'), (r'\\texttt\{([^{}]*)\}', r'`\1`'),
               (r'\\textbf\{([^{}]*)\}', r'**\1**'), (r'\\(emph|textit)\{([^{}]*)\}', r'*\2*'),
               (r'\\(phantom|hspace|vspace|needspace)\{[^{}]*\}', ''), (r'\\renewcommand\{\\arraystretch\}\{[^}]*\}', ''),
               (r'\\(medskip|smallskip|bigskip|medbreak|noindent|newpage|centering|hfill|par|raggedright|Large|large|small)\b', ' '),
               (r'\\begin\{(center|quote|multicols|flushleft|tcolorbox)\}(\{\d+\})?(\[[^\]]*\])?', '\n\n'), (r'\\end\{(center|quote|multicols|flushleft|tcolorbox)\}', '\n\n'),
               (r'\\og\s*', '« '), (r'\s*\\fg\{\}', ' »'), (r'\s*\\fg\b', ' »'), (r'\\oe\b\s?', 'œ'), (r'\\textbackslash', '\\\\'),
               (r'\\checkmark', '✓'), (r'\\quad|\\qquad', ' '), (r'\\[,;:]', ' '), (r'\\ ', ' '), (r'~', ' '), (r'\\\\(\[[^\]]*\])?', '\n\n'),
               (r'\\dots|\\ldots', '…'), (r'\\%', '%'), (r'\\&', '&'), (r"\\'", "'")]
        for a, b in rep:
            for _ in range(3): t = re.sub(a, b, t)
        t = re.sub(r'(?<!\\)[{}]', '', t)
        t = re.sub(r'\\[A-Za-z]+\*?', '', t)               # commandes résiduelles (mise en page)
        paras = [re.sub(r'[ \t]*\n[ \t]*', ' ', p).strip() for p in re.split(r'\n\s*\n', t)]
        paras = [re.sub(r' {2,}', ' ', p) for p in paras if p.strip()]
        return paras

    def restaurer(s, paras):
        out = []
        for p in paras:
            p = re.sub(r'@@MI\d+@@', lambda x: '$' + s.tex_math(s.ph[x.group(0)][1]) + '$', p)
            p = re.sub(r'@@MD\d+@@', lambda x: '\n$$' + s.tex_math(s.ph[x.group(0)][1]) + '$$\n', p)
            p = re.sub(r'@@TAB\d+@@', lambda x: '\n$$' + s.ph[x.group(0)][1] + '$$\n', p)
            p = re.sub(r'@@TABH\d+@@', lambda x: '\n\n```tableau\n' + s.ph[x.group(0)][1] + '\n```\n\n', p)
            def code(x): return '\n\n```python\n' + s.ph[x.group(0)][1] + '\n```\n\n'
            p = re.sub(r'@@CODE\d+@@', code, p)
            def fig(x):
                f = compiler_figure(s.ph[x.group(0)][1], s.pre)
                return f'\n\n![Figure]({f})\n\n' if f else '\n\n*La figure est dans le PDF de la feuille.*\n\n'
            p = re.sub(r'@@FIG\d+@@', fig, p)
            p = re.sub(r'\n{3,}', '\n\n', p).strip()
            p = re.sub(r'^\s*\n', '', p)
            out.append(p)
        return '\n\n'.join(x for x in out if x.strip())

    def convertir(s, t):
        t = s.maths(t)
        return s.restaurer(s.texte(t))

# ------------------------------------------------------------------ découpage en exercices
ENTETE = re.compile(r'\\exo\{(?P<a>[^}]*)\}\{\\(?P<et>etoile|etoiles|etoilesss|etoilesv)\}'
                    r'|\\noindent\\textbf\{\\underline\{Exercice (?P<b>[^}]*)\}\}\s*(?P<st>\$[^$]*\$)')
PARTIE = re.compile(r'\\partie\{([^}]*)\}|\\subsection\*\{\\textcolor\{blue\}\{([^}]*)\}\}')
ETOILES = {'etoile': 1, 'etoiles': 2, 'etoilesss': 3, 'etoilesv': 4}

def decouper(t):
    evts = sorted([(m.start(), 'P', m) for m in PARTIE.finditer(t)] + [(m.start(), 'E', m) for m in ENTETE.finditer(t)], key=lambda x: x[0])
    exos, partie = [], None
    for k, (pos, genre, m) in enumerate(evts):
        if genre == 'P': partie = (m.group(1) or m.group(2)).strip(); continue
        fin = evts[k + 1][0] if k + 1 < len(evts) else t.index('\\end{document}')
        tete = (m.group('a') or m.group('b')).strip()
        mn = re.match(r'(\d+)\s*(?:[-:–]\s*(.*))?$', tete)
        num, titre = int(mn.group(1)), (mn.group(2) or '').strip()
        et = ETOILES[m.group('et')] if m.group('et') else m.group('st').count('\\star')
        corps = t[m.end():fin]
        source = re.findall(r'%\s*Sources?\s*:\s*(.*)', t[evts[k-1][0] if k else 0:pos]) if False else []
        exos.append({'numero': num, 'titre': titre[:1].upper() + titre[1:] if titre else '', 'partie': partie, 'etoiles': et, 'corps': corps, 'pos': pos})
    return exos

def sources(t_brut):
    """Sources indiquées en commentaire juste avant un exercice : « % Source : … » → {numéro: texte}."""
    r = {}
    for m in re.finditer(r'%\s*Sources?\s*:\s*(.*)\n(?:%[^\n]*\n|\s*\n|\\newpage\s*\n)*\\exo\{(\d+)', t_brut):
        r[int(m.group(2))] = m.group(1).strip()
    return r

def pages(pdf):
    n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
    r = {}
    for p in range(1, n + 1):
        txt = subprocess.run(['pdftotext', '-f', str(p), '-l', str(p), pdf, '-'], capture_output=True, text=True).stdout
        for m in re.finditer(r'^Exercice (\d+)\b', txt, re.M): r.setdefault(int(m.group(1)), p)
    return r

def feuille(tex):
    brut = lire(tex)
    pre, corps = brut.split('\\begin{document}', 1)
    M = lire_macros(sans_commentaires(pre))
    corps_sc = sans_commentaires(corps)
    corps_sc = re.sub(r'\\(?:euro|texteuro)(?:\{\})?', '€', corps_sc)
    return pre, developper(corps_sc, M), sources(brut)

def main():
    en_tex, co_tex, en_pdf, co_pdf, fid, pref = sys.argv[1:7]
    pre_e, t_e, src = feuille(en_tex); pre_c, t_c, _ = feuille(co_tex)
    E, C = decouper(t_e), {x['numero']: x for x in decouper(t_c)}
    pe, pc = pages(en_pdf), pages(co_pdf)
    meta = None
    chemin_meta = os.path.join(os.path.dirname(__file__), f'meta_{pref.replace("-", "_")}.py')
    if os.path.exists(chemin_meta):
        spec = importlib.util.spec_from_file_location('meta', chemin_meta); meta = importlib.util.module_from_spec(spec); spec.loader.exec_module(meta)
    sortie = []
    for x in E:
        c = C.get(x['numero'])
        if not c: sys.stderr.write(f"exercice {x['numero']} : pas de corrigé\n")
        if c and c['etoiles'] != x['etoiles']: sys.stderr.write(f"exercice {x['numero']} : étoiles différentes\n")
        enonce = Conv(pre_e).convertir(x['corps'])
        corrige = Conv(pre_c).convertir(c['corps']) if c else ''
        e = {'id': f"{pref}-{x['numero']:02d}", 'feuille': fid, 'numero': x['numero']}
        if x['titre']: e['titre'] = x['titre']
        e.update({'partie': x['partie'], 'etoiles': x['etoiles']})
        if meta: e.update(meta.meta(x['numero'], x['titre'], enonce, corrige, x['etoiles']))
        if x['numero'] in src: e['source'] = src[x['numero']]
        e.update({'page_enonce': pe.get(x['numero']), 'page_corrige': pc.get(x['numero']), 'enonce': enonce, 'corrige': corrige})
        sortie.append(e)
    print(vers_yaml(sortie))

def vers_yaml(L):
    def bloc(v): return '|\n' + '\n'.join(('    ' + l) if l.strip() else '' for l in v.split('\n'))
    def sc(v):
        if isinstance(v, list): return '[' + ', '.join(json.dumps(x, ensure_ascii=False) if re.search(r"[:,#'\[\]{}]", str(x)) else str(x) for x in v) + ']'
        if isinstance(v, int): return str(v)
        if v is None: return 'null'
        return json.dumps(v, ensure_ascii=False)
    out = []
    for e in L:
        first = True
        for k, v in e.items():
            pre = '- ' if first else '  '; first = False
            out.append(f'{pre}{k}: ' + (bloc(v) if k in ('enonce', 'corrige') else sc(v)))
    return '\n'.join(out) + '\n'

if __name__ == '__main__': main()

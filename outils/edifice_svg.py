"""Outils de dessin des schémas de l'édifice (contenu/schemas/*.svg).

Les schémas sont insérés tels quels dans la page (bloc ```schema nom … ``` d'une fiche) : ils n'ont
donc aucune couleur écrite en dur, seulement des classes, que la feuille de style du gabarit relie
aux couleurs du thème clair ou sombre. Toute position est calculée ici (numpy), jamais estimée.

Code couleur (constant dans tout l'atlas) :
  t  trait principal, encre         g  auxiliaire, gris (axes, constructions, grilles)
  r  objet mis en évidence, rouge (celui que la fiche définit ou étudie)
  b  second objet, bleu             v  troisième objet, vert
  o  choix (axiome du choix), or    — comme l'étoile ⋆ des fiches
Classes : trait « s-X », trait pointillé « s-X d », remplissage léger « f-X », point plein « p-X »,
texte « x-X » (X parmi t, g, r, b, v, o).
"""
import math
import re
import numpy as np

COULEURS = 'tgrbvo'
BB = {'ℕ': 'N', 'ℤ': 'Z', 'ℚ': 'Q', 'ℝ': 'R', 'ℂ': 'C', '𝔽': 'F'}
CAL = {'𝒫': 'P', '𝒰': 'U', '𝒯': 'T', '𝒪': 'O', '𝒜': 'A', 'ℬ': 'B', '𝒞': 'C', 'ℱ': 'F', 'ℒ': 'L',
       '𝒱': 'V', '𝒲': 'W', '𝒮': 'S', 'ℋ': 'H', '𝒩': 'N', '𝒢': 'G'}
FRAK = {'𝔖': 'S', '𝔤': 'g', '𝔭': 'p', '𝔪': 'm', '𝔞': 'a'}
ITALIQUE = re.compile(r'[A-Za-zα-ωϕϑϵ]')


def f(x):
    """Nombre court pour les attributs."""
    x = float(x)
    if abs(x - round(x)) < 5e-3:
        return str(int(round(x)))
    return f'{x:.2f}'.rstrip('0').rstrip('.')


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def _morceaux(s):
    """Découpe une étiquette en (texte, police) : lettres latines et grecques minuscules en
    italique mathématique, chiffres et ponctuation en romain, ℝ… en ajouré, 𝒫… en calligraphique."""
    out = []
    for ch in s:
        if ch in BB:
            fam, c = 'KaTeX_AMS', BB[ch]
        elif ch in CAL:
            fam, c = 'KaTeX_Caligraphic', CAL[ch]
        elif ch in FRAK:
            fam, c = 'KaTeX_Fraktur', FRAK[ch]
        elif ITALIQUE.fullmatch(ch):
            fam, c = 'KaTeX_Math', ch
        else:
            fam, c = 'KaTeX_Main', ch
        if out and out[-1][1] == fam:
            out[-1][0] += c
        else:
            out.append([c, fam])
    return out


def _tspans(s, roman=False, taille=17):
    """Étiquette avec indices (_x, _{xy}) et exposants (^x, ^{xy}) ; « \\ » protège un caractère.
    Avec roman=True, tout le texte est en romain (mots français). Les indices sont placés par des
    décalages dy explicites (Firefox ignore baseline-shift)."""
    res = []
    etat = {'dy': 0.0}

    def ajoute(txt, niv):
        if not txt:
            return
        parts = [[txt, 'KaTeX_Main']] if roman else _morceaux(txt)
        cible = {0: 0.0, -1: 0.28 * taille, 1: -0.38 * taille}[niv]
        for k, (c, fam) in enumerate(parts):
            attrs = f' font-family="{fam}"'
            if fam == 'KaTeX_Math':
                attrs += ' font-style="italic"'
            if niv:
                attrs += ' font-size="72%"'
            if k == 0 and abs(cible - etat['dy']) > 1e-9:
                attrs += f' dy="{f(cible - etat["dy"])}"'
                etat['dy'] = cible
            res.append(f'<tspan{attrs}>{esc(c)}</tspan>')

    tampon = ''
    i = 0
    while i < len(s):
        c = s[i]
        if c == '`':                    # `sup` : opérateur ou mot en romain
            ajoute(tampon, 0); tampon = ''
            j = s.index('`', i + 1)
            r0 = roman
            roman = True
            ajoute(s[i + 1:j], 0)
            roman = r0
            i = j + 1
            continue
        if c == '\\' and i + 1 < len(s):
            tampon += s[i + 1]; i += 2; continue
        if c in '_^':
            ajoute(tampon, 0); tampon = ''
            niv = -1 if c == '_' else 1
            if i + 1 < len(s) and s[i + 1] == '{':
                j = s.index('}', i + 2)
                ajoute(s[i + 2:j], niv); i = j + 1
            else:
                ajoute(s[i + 1], niv); i += 2
            continue
        tampon += c; i += 1
    ajoute(tampon, 0)
    if etat['dy'] and res:      # rien après l'indice : ligne de base inchangée pour la suite
        pass
    return ''.join(res)


class Schema:
    def __init__(self, largeur, hauteur, titre):
        self.w, self.h, self.titre = largeur, hauteur, titre
        self.el = []

    # -- primitives
    def ligne(self, p, q, c='t', d=False, l=None):
        cls = f's-{c}' + (' d' if d else '')
        lw = f' stroke-width="{f(l)}"' if l else ''
        self.el.append(f'<line class="{cls}" x1="{f(p[0])}" y1="{f(p[1])}" x2="{f(q[0])}" y2="{f(q[1])}"{lw}/>')

    def poly(self, pts, c='t', d=False, ferme=False, rempli=None, l=None):
        pts = np.asarray(pts, float)
        cls = f's-{c}' + (' d' if d else '') + (f' f-{rempli}' if rempli else '')
        lw = f' stroke-width="{f(l)}"' if l else ''
        tag = 'polygon' if ferme else 'polyline'
        self.el.append(f'<{tag} class="{cls}"{lw} points="{" ".join(f(x) + "," + f(y) for x, y in pts)}"/>')

    def surface(self, pts, c='r'):
        """Région remplie sans contour."""
        pts = np.asarray(pts, float)
        self.el.append(f'<polygon class="f-{c}" points="{" ".join(f(x) + "," + f(y) for x, y in pts)}"/>')

    def chemin(self, d, c='t', pointille=False, rempli=None, l=None):
        cls = f's-{c}' + (' d' if pointille else '') + (f' f-{rempli}' if rempli else '')
        lw = f' stroke-width="{f(l)}"' if l else ''
        self.el.append(f'<path class="{cls}"{lw} d="{d}"/>')

    def cercle(self, centre, r, c='t', d=False, rempli=None):
        cls = f's-{c}' + (' d' if d else '') + (f' f-{rempli}' if rempli else '')
        self.el.append(f'<circle class="{cls}" cx="{f(centre[0])}" cy="{f(centre[1])}" r="{f(r)}"/>')

    def ellipse(self, centre, rx, ry, c='t', d=False, rempli=None):
        cls = f's-{c}' + (' d' if d else '') + (f' f-{rempli}' if rempli else '')
        self.el.append(f'<ellipse class="{cls}" cx="{f(centre[0])}" cy="{f(centre[1])}" rx="{f(rx)}" ry="{f(ry)}"/>')

    def rect(self, x, y, w, h, c='t', d=False, rempli=None, rx=0):
        cls = f's-{c}' + (' d' if d else '') + (f' f-{rempli}' if rempli else '')
        self.el.append(f'<rect class="{cls}" x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{f(rx)}"/>')

    def point(self, p, c='t', r=3.2, creux=False):
        if creux:
            self.el.append(f'<circle class="s-{c} p-fond" cx="{f(p[0])}" cy="{f(p[1])}" r="{f(r)}"/>')
        else:
            self.el.append(f'<circle class="p-{c}" cx="{f(p[0])}" cy="{f(p[1])}" r="{f(r)}"/>')

    def pointe(self, bout, direction, c='t', taille=9, largeur=4):
        """Pointe de flèche (triangle plein) au point « bout », orientée selon « direction »."""
        d = np.asarray(direction, float)
        d = d / np.linalg.norm(d)
        n = np.array([-d[1], d[0]])
        b = np.asarray(bout, float)
        pts = [b, b - taille * d + largeur * n, b - taille * d - largeur * n]
        self.el.append(f'<polygon class="p-{c}" points="{" ".join(f(x) + "," + f(y) for x, y in pts)}"/>')

    def fleche(self, p, q, c='t', d=False, retrait=0, retrait_debut=0, l=None, double=False):
        p, q = np.asarray(p, float), np.asarray(q, float)
        u = (q - p) / np.linalg.norm(q - p)
        p2, q2 = p + retrait_debut * u, q - retrait * u
        self.ligne(p2, q2 - 6 * u, c, d, l)
        self.pointe(q2, u, c)
        if double:
            self.pointe(p2, -u, c)

    def courbe_fleche(self, pts, c='t', d=False, l=None):
        """Ligne brisée fine (courbe échantillonnée) terminée par une pointe."""
        pts = np.asarray(pts, float)
        u = pts[-1] - pts[-2]
        bout = pts[-1]
        k = len(pts) - 1
        # raccourcir la courbe de la longueur de la pointe
        while k > 0 and np.linalg.norm(pts[k] - bout) < 6:
            k -= 1
        self.poly(np.vstack([pts[:k + 1], bout - 6 * u / np.linalg.norm(u)]), c, d, l=l)
        self.pointe(bout, pts[-1] - pts[k], c)

    def texte(self, p, s, c='t', ancre='middle', taille=None, roman=False, ui=False, base='central'):
        """Étiquette. « ancre » : start, middle, end. ui=True : police d'interface (mots)."""
        t = f' font-size="{f(taille)}"' if taille else ''
        cls = f'x-{c}' + (' ui' if ui else '')
        corps = esc(s) if ui else _tspans(s, roman, taille or 17)
        self.el.append(f'<text class="{cls}" x="{f(p[0])}" y="{f(p[1])}" text-anchor="{ancre}" '
                       f'dominant-baseline="{base}"{t}>{corps}</text>')

    def brut(self, s):
        self.el.append(s)

    def svg(self):
        return (f'<svg class="schema" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(self.w)} {f(self.h)}" '
                f'width="{f(self.w)}" height="{f(self.h)}" role="img" aria-label="{esc(self.titre)}">\n'
                + '\n'.join(self.el) + '\n</svg>\n')

    def ecrire(self, nom, dossier='contenu/schemas'):
        import os
        os.makedirs(dossier, exist_ok=True)
        with open(os.path.join(dossier, nom + '.svg'), 'w', encoding='utf-8') as fh:
            fh.write(self.svg())


class Repere:
    """Passage des coordonnées mathématiques (x, y) aux coordonnées de l'image (y vers le bas)."""

    def __init__(self, xmin, xmax, ymin, ymax, x0, y0, largeur, hauteur):
        self.xmin, self.xmax, self.ymin, self.ymax = xmin, xmax, ymin, ymax
        self.x0, self.y0, self.L, self.H = x0, y0, largeur, hauteur

    def __call__(self, x, y):
        X = self.x0 + (np.asarray(x, float) - self.xmin) / (self.xmax - self.xmin) * self.L
        Y = self.y0 + self.H - (np.asarray(y, float) - self.ymin) / (self.ymax - self.ymin) * self.H
        return np.stack([X, Y], axis=-1) if np.ndim(X) else np.array([X, Y])

    def axes(self, S, nx='x', ny='y', c='g', origine=(0, 0)):
        ox, oy = origine
        a, b = self(self.xmin, oy), self(self.xmax, oy)
        S.fleche(a, b + [8, 0], c)
        S.texte(b + [14, 0], nx, c, ancre='start')
        a, b = self(ox, self.ymin), self(ox, self.ymax)
        S.fleche(a, b - [0, 8], c)
        S.texte(b - [0, 18], ny, c)

    def graphe(self, S, fn, a=None, b=None, c='t', n=400, d=False, l=None):
        a = self.xmin if a is None else a
        b = self.xmax if b is None else b
        xs = np.linspace(a, b, n)
        S.poly(self(xs, fn(xs)), c, d, l=l)
        return xs


def arc(centre, r, t0, t1, n=60):
    """Points d'un arc de cercle (angles en radians, sens trigonométrique de l'image : y vers le bas
    déjà pris en compte par l'appelant)."""
    t = np.linspace(t0, t1, n)
    return np.stack([centre[0] + r * np.cos(t), centre[1] + r * np.sin(t)], axis=-1)


def bezier(p0, p1, p2, p3=None, n=50):
    t = np.linspace(0, 1, n)[:, None]
    p0, p1, p2 = map(lambda p: np.asarray(p, float), (p0, p1, p2))
    if p3 is None:
        return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2
    p3 = np.asarray(p3, float)
    return (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3


def courbe_entre(p, q, courbure=0.25, n=50):
    """Arc de Bézier quadratique de p à q, bombé perpendiculairement (courbure relative)."""
    p, q = np.asarray(p, float), np.asarray(q, float)
    m = (p + q) / 2
    d = q - p
    nrm = np.array([-d[1], d[0]])
    return bezier(p, m + courbure * nrm, q, n=n)


def blob(centre, rx, ry, graine=0, amplitude=0.08, n=120):
    """Contour fermé lisse et irrégulier (« patate » des diagrammes ensemblistes), déterministe."""
    rng = np.random.default_rng(graine)
    k = np.arange(2, 5)
    a = rng.normal(0, amplitude, size=3)
    ph = rng.uniform(0, 2 * math.pi, size=3)
    t = np.linspace(0, 2 * math.pi, n, endpoint=False)
    r = 1 + sum(a[i] * np.cos(k[i] * t + ph[i]) for i in range(3))
    return np.stack([centre[0] + rx * r * np.cos(t), centre[1] + ry * r * np.sin(t)], axis=-1)

#!/usr/bin/env python3
"""Conversion des formules de l'index des annales en LaTeX ($…$), par remplacements contrôlés.

  python3 outils/annales_formules.py extraire AAAA > champs.json
      Champs à convertir d'une session : pour chaque sujet (clé = URL du sujet), le titre (nom), l'aperçu, le nom
      et les mots-clés de chaque partie, avec leur chemin (apercu, blocs.3.nom, blocs.3.mots.2).

  python3 outils/annales_formules.py appliquer AAAA remplacements.json [--essai]
      Applique une liste de remplacements produite par un agent :
        {"<url du sujet>": [{"champ": "apercu", "avant": "R1[X]", "apres": "$\\mathbb{R}_1[X]$",
                             "tous": false}, ...], ...}
      Chaque « avant » doit figurer tel quel dans le champ, hors des formules déjà posées, une seule
      fois (ou plusieurs avec "tous": true) ; « apres » doit être une formule ou une suite de formules
      $…$, éventuellement entourées du texte de « avant ». Le texte hors formules ne peut donc changer
      que par les passages remplacés : la vérification finale le contrôle sur tout le fichier.
      --essai : contrôle sans écrire ; --montrer : idem, en affichant chaque champ avant et après.

  python3 outils/annales_formules.py controler AAAA
      Signale, dans les champs déjà convertis, les restes probables de notation linéaire hors $…$
      (^, _, Σ, ∫, √, lettres grecques collées à des indices…).
"""
import json
import re
import sys

import yaml

ENTETE = '# Sujets de la session {a}, étiquetés partie par partie (voir rubriques/annales-index.yaml).\n'
RE_F = re.compile(r'\$[^$]+?\$')


def chemin(a):
    return f'rubriques/annales-index/{a}.yaml'


def charger(a):
    return yaml.safe_load(open(chemin(a), encoding='utf-8'))


def ecrire(a, d):
    t = open(chemin(a), encoding='utf-8').read()
    tete = t[:t.index('\n') + 1] if t.startswith('#') else ''
    with open(chemin(a), 'w', encoding='utf-8') as f:
        f.write(tete + yaml.dump(d, allow_unicode=True, sort_keys=False, width=200))


def champs(s):
    yield 'nom', s.get('nom', '')
    yield 'apercu', s.get('apercu', '')
    for i, b in enumerate(s.get('blocs', [])):
        yield f'blocs.{i}.nom', b.get('nom', '')
        for j, m in enumerate(b.get('mots', [])):
            yield f'blocs.{i}.mots.{j}', m


def lire(s, ch):
    p = ch.split('.')
    if p[0] in ('apercu', 'nom') and len(p) == 1:
        return s[p[0]]
    b = s['blocs'][int(p[1])]
    return b['nom'] if p[2] == 'nom' else b['mots'][int(p[3])]


def poser(s, ch, v):
    p = ch.split('.')
    if p[0] in ('apercu', 'nom') and len(p) == 1:
        s[p[0]] = v
        return
    b = s['blocs'][int(p[1])]
    if p[2] == 'nom':
        b['nom'] = v
    else:
        b['mots'][int(p[3])] = v


def hors_formules(t):
    """Positions de t qui ne sont pas dans une formule $…$."""
    dedans = [False] * len(t)
    for m in RE_F.finditer(t):
        for k in range(m.start(), m.end()):
            dedans[k] = True
    return dedans


def occurrences(t, avant):
    dedans = hors_formules(t)
    res, k = [], t.find(avant)
    while k >= 0:
        if not any(dedans[k:k + len(avant)]):
            res.append(k)
        k = t.find(avant, k + 1)
    return res


def squelette(t):
    return RE_F.sub('░', t)


def extraire(a):
    out = {}
    for s in charger(a):
        out[s['sujet']] = {'nom': s.get('nom', ''), 'champs': dict(champs(s))}
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)


def appliquer(a, fichier, essai, montrer=False):
    d = charger(a)
    par = {s['sujet']: s for s in d}
    R = json.load(open(fichier, encoding='utf-8'))
    erreurs, n = [], 0
    for url, liste in R.items():
        if url.startswith('_'):
            continue  # _signalements : notes pour la relecture
        if url not in par:
            erreurs.append(f'sujet inconnu : {url}')
            continue
        s = par[url]
        for r in liste:
            ch, av, ap = r.get('champ'), r.get('avant'), r.get('apres')
            ou = f'{url} [{ch}] « {av} »'
            try:
                t = lire(s, ch)
            except (KeyError, IndexError, ValueError):
                erreurs.append(f'{ou} : champ inexistant')
                continue
            if not av or not ap or '$' not in ap or ap.count('$') % 2:
                erreurs.append(f'{ou} : « apres » doit contenir des formules $…$ complètes')
                continue
            if '$' in av:
                erreurs.append(f'{ou} : « avant » contient déjà une formule')
                continue
            # le texte de « apres » hors formules doit être un sous-texte de « avant » (pas de réécriture)
            reste = [x for x in RE_F.split(ap) if x.strip()]
            pos = 0
            for x in reste:
                k = av.find(x, pos)
                if k < 0:
                    erreurs.append(f'{ou} : le texte « {x} » hors formule ne vient pas de « avant »')
                    break
                pos = k + len(x)
            occ = occurrences(t, av)
            if not occ:
                erreurs.append(f'{ou} : introuvable hors formules')
                continue
            if len(occ) > 1 and not r.get('tous'):
                erreurs.append(f'{ou} : {len(occ)} occurrences (préciser "tous": true ou allonger « avant »)')
                continue
            for k in reversed(occ if r.get('tous') else occ[:1]):
                t = t[:k] + ap + t[k + len(av):]
                n += 1
            poser(s, ch, t)
    if erreurs:
        print('ERREURS :\n  - ' + '\n  - '.join(erreurs))
        sys.exit(1)
    if montrer:
        for s0, s in zip(charger(a), d):
            for (ch, t0), (_, t) in zip(champs(s0), champs(s)):
                if t0 != t:
                    print(f'### {s["sujet"]} [{ch}]\nAVANT : {t0}\nAPRÈS : {t}\n')
    print(f'{n} remplacements appliqués' + (' (essai, rien n\'est écrit)' if essai else ''))
    if not essai:
        ecrire(a, d)


SUSPECTS = re.compile(r'[\^_∫Σ∑√∏∼≤≥≠∈∉⊂⊃∪∩→↦∞ℝℂℕℤℚ𝕂αβγδεζηθικλμνξπρστυφχψωΓΔΘΛΞΠΣΦΨΩ]|\b[A-Za-z]\d\b|\b[a-z]\([a-z]\)')


def controler(a):
    k = 0
    for s in charger(a):
        for ch, t in champs(s):
            if '$' not in t and ch != 'apercu':
                continue
            nu = RE_F.sub(' ', t)
            for m in SUSPECTS.finditer(nu):
                k += 1
                deb = max(0, m.start() - 25)
                print(f'{s["sujet"]} [{ch}] …{nu[deb:m.end() + 25]}…')
    print(f'{k} restes possibles', file=sys.stderr)


if __name__ == '__main__':
    c = sys.argv[1]
    if c == 'extraire':
        extraire(sys.argv[2])
    elif c == 'appliquer':
        appliquer(sys.argv[2], sys.argv[3], '--essai' in sys.argv or '--montrer' in sys.argv, '--montrer' in sys.argv)
    elif c == 'controler':
        controler(sys.argv[2])
    else:
        print(__doc__)

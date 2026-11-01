#!/usr/bin/env python3
"""Page de début de chaque partie du sommaire d'un cours (champ `sommaire_pages` de rubriques/cours.yaml).

Usage : python3 outils/pages_sommaire.py [ID ...]      (sans argument : tous les cours qui ont un PDF)
        python3 outils/pages_sommaire.py --ecrire [ID ...]

Pour chaque titre du sommaire, on cherche dans le texte du PDF (pdftotext -layout), à partir de la page
de la partie précédente, la première ligne qui reproduit ce titre, numérotation ôtée. Les titres sur deux
lignes sont reconnus (lignes consécutives jointes). Les ligatures (ff, fi, ffi, fl) que pdftotext perd
parfois sont neutralisées en ignorant les lettres f, i et l dans la comparaison. À défaut, un titre du
sommaire qui prolonge un titre de section (« Anneaux et sous-anneaux » pour « 5.1 Anneaux »), puis le
titre de section numéroté le plus proche (ressemblance au moins 0,5) sont acceptés et signalés.
Avec --ecrire, la ligne `sommaire_pages: [...]` est insérée ou remplacée juste après la liste
`sommaire:` du cours, sans toucher au reste du fichier. Toujours relire les lignes signalées « ~ ».
"""
import difflib, re, subprocess, sys, unicodedata
import yaml

FICHIER = 'rubriques/cours.yaml'


def norm(t):
    t = unicodedata.normalize('NFD', t)
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    t = t.lower().replace('’', "'").replace('œ', 'oe').replace('ﬁ', 'fi').replace('ﬀ', 'ff').replace('ﬂ', 'fl')
    t = t.replace('ﬃ', 'ffi').replace('ﬄ', 'ffl')
    for a, b in [('ℂ', 'c'), ('ℝ', 'r'), ('ℤ', 'z'), ('ℕ', 'n'), ('ℚ', 'q'), ('𝕌', 'u')]:
        t = t.replace(a, b)
    t = re.sub(r'\\(mathbb|mathrm|mathbf)\{(.)\}', r'\2', t)
    t = re.sub(r'\\[a-z]+', ' ', t).replace('$', ' ')
    t = re.sub(r"[^a-z0-9' ]", ' ', t)
    return re.sub(r'\s+', ' ', t).strip()


def serre(t):
    """Comparaison insensible aux ligatures perdues et aux espaces."""
    return re.sub(r"[fil ']", '', t)


NUM = re.compile(r'^((chapitre )?[0-9ivx]+( [0-9]+)*|[a-h]) ')
SECTION = re.compile(r'^[0-9]+ [0-9]+ (.*)')


def pages_du_sommaire(c, bavard=True):
    texte = subprocess.run(['pdftotext', '-layout', c['pdf'], '-'], capture_output=True, text=True,
                           errors='replace').stdout
    pages = texte.split('\f')
    lignes = []
    for p in pages:
        L = [norm(l) for l in p.splitlines() if l.strip()]
        lignes.append(L + [a + ' ' + b for a, b in zip(L, L[1:])])
    res, prec = [], 1
    for s in c['sommaire']:
        n, trouve = norm(s), None
        for i in range(prec - 1, len(pages)):
            for l in lignes[i]:
                l2 = NUM.sub('', l)
                if serre(l2) == serre(n) or serre(l) == serre(n) or (len(n) > 12 and l2.startswith(n)):
                    trouve = i + 1
                    break
            if trouve:
                break
        if not trouve:
            for i in range(prec - 1, len(pages)):
                for l in lignes[i]:
                    m = SECTION.match(l)
                    if m and len(m.group(1)) >= 6 and n.startswith(m.group(1) + ' '):
                        trouve = i + 1
                        if bavard:
                            print(f'   ~ {c["id"]} « {s} » → p. {trouve} (section « {m.group(1)} »)')
                        break
                if trouve:
                    break
        if not trouve:
            meilleur = (0, None, '')
            for i in range(prec - 1, len(pages)):
                for l in lignes[i]:
                    m = SECTION.match(l)
                    if m:
                        r = difflib.SequenceMatcher(None, n, m.group(1)).ratio()
                        if r > meilleur[0]:
                            meilleur = (r, i + 1, m.group(1))
            if meilleur[0] >= 0.5:
                trouve = meilleur[1]
                if bavard:
                    print(f'   ~ {c["id"]} « {s} » → p. {trouve} (section « {meilleur[2]} », {meilleur[0]:.2f})')
        res.append(trouve)
        if trouve:
            prec = trouve
    return res


def ecrire(ident, valeurs):
    lignes = open(FICHIER, encoding='utf-8').read().split('\n')
    debut = next(i for i, l in enumerate(lignes) if l == f'  - id: {ident}')
    fin = next((i for i in range(debut + 1, len(lignes)) if lignes[i].startswith('  - id: ')), len(lignes))
    bloc = lignes[debut:fin]
    bloc = [l for l in bloc if not l.startswith('    sommaire_pages:')]
    k = next(i for i, l in enumerate(bloc) if l.startswith('    sommaire:'))
    k += 1
    while k < len(bloc) and re.match(r'^ {4,6}- ', bloc[k]):   # listes indentées de 4 ou de 6 espaces
        k += 1
    bloc.insert(k, f'    sommaire_pages: [{", ".join(map(str, valeurs))}]')
    lignes[debut:fin] = bloc
    open(FICHIER, 'w', encoding='utf-8').write('\n'.join(lignes))


def main():
    args = sys.argv[1:]
    ecrit = '--ecrire' in args
    ids = [a for a in args if not a.startswith('--')]
    d = yaml.safe_load(open(FICHIER, encoding='utf-8'))
    manque = 0
    for c in d['cours']:
        if not c.get('pdf') or not c.get('sommaire') or (ids and c['id'] not in ids):
            continue
        res = pages_du_sommaire(c)
        complet = all(res)
        print(('   ' if complet else '?? ') + c['id'], res)
        if complet and ecrit:
            ecrire(c['id'], res)
        manque += not complet
    if manque:
        print(f'{manque} cours incomplets : compléter `sommaire_pages` à la main, en lisant le PDF.')


if __name__ == '__main__':
    main()

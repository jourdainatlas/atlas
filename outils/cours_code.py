#!/usr/bin/env python3
"""Blocs de code Python des cours (niveau Python – Lycée) : position sur les pages du PDF et code exact.

Usage : python3 outils/cours_code.py            (tous les cours de SOURCES)
        python3 outils/cours_code.py ID ...

Les sources LaTeX ne sont pas publiées : elles sont rangées dans outils/sources-cours/ (table SOURCES).

Pour chaque cours, on lit dans le .tex les environnements `python` (code exécutable ; les blocs `sortie`,
affichages, sont écartés), et dans le PDF les fonds gris des blocs de code (couleur `fondcode`,
RGB 245, 245, 245 : une bande par ligne, regroupées en zones). Chaque zone est rattachée au bloc du .tex
dont elle reproduit le texte (comparaison sans espaces), dans l'ordre du document ; un bloc coupé par un
saut de page donne deux zones pour le même code. Le résultat, `outils/cours-code.json`, donne pour chaque
cours la liste des zones (page, rectangle en fractions de la page, numéro du bloc) et la liste des codes.
La visionneuse du site pose sur chaque zone un bouton « Essayer » qui ouvre l'atelier Python.
Le fichier est versionné ; il n'est recalculé que si le PDF ou le .tex a changé (empreinte sha256).
"""
import hashlib, json, re, sys
import pdfplumber, yaml

SORTIE = 'outils/cours-code.json'
FOND = (0.961, 0.961, 0.961)
SOURCES = {'py-01': 'outils/sources-cours/python_chap01.tex'}


def blocs_tex(chemin):
    t = open(chemin, encoding='utf-8').read()
    t = t[re.search(r'(?m)^\\begin\{document\}', t).end():]
    return [re.sub(r'^\[[^\]]*\]', '', m.group(1)).strip('\n') for m in re.finditer(r'\\begin\{python\}(.*?)\\end\{python\}', t, re.S)]


def zones_pdf(chemin):
    out = []
    with pdfplumber.open(chemin) as pdf:
        for i, p in enumerate(pdf.pages):
            bandes = []
            for r in p.rects:
                c = r.get('non_stroking_color')
                if isinstance(c, (list, tuple)) and len(c) == 3 and tuple(round(x, 3) for x in c) == FOND and r['width'] > 50:
                    bandes.append(r)
            bandes.sort(key=lambda r: r['top'])
            cur = None
            for r in bandes:
                if cur and r['top'] - cur['bottom'] < 2.5:
                    cur['bottom'] = max(cur['bottom'], r['bottom']); cur['x0'] = min(cur['x0'], r['x0']); cur['x1'] = max(cur['x1'], r['x1'])
                else:
                    if cur: out.append(cur)
                    cur = {'page': i + 1, 'top': r['top'], 'bottom': r['bottom'], 'x0': r['x0'], 'x1': r['x1'], 'W': p.width, 'H': p.height}
            if cur: out.append(cur)
        for z in out:
            p = pdf.pages[z['page'] - 1]
            z['texte'] = p.crop((z['x0'], z['top'], z['x1'], z['bottom'])).extract_text() or ''
    return out


def sans_blanc(s):
    s = s.replace('’', "'").replace('‘', "'").replace('−', '-').replace('“', '"').replace('”', '"')
    return re.sub(r'\s+', '', s)


def traiter(c):
    codes = blocs_tex(c['tex'])
    normes = [sans_blanc(x) for x in codes]
    zones, k, rest = [], 0, ''
    for z in zones_pdf(c['pdf']):
        t = sans_blanc(z['texte'])
        if not t or z['page'] == 1: continue      # page de titre : le code y est un décor
        trouve = None
        # suite d'un bloc coupé par la page : le texte prolonge ce qui restait du bloc précédent
        if rest and rest.startswith(t[:30]):
            trouve = k - 1; rest = rest[len(t):] if rest.startswith(t) else ''
        else:
            for j in range(k, len(codes)):
                if normes[j].startswith(t[:40]) or t[:40] in normes[j]:
                    trouve = j; k = j + 1
                    rest = normes[j][len(t):] if normes[j].startswith(t) else ''
                    break
        if trouve is None:
            print(f"  {c['id']} p. {z['page']} : zone sans bloc correspondant ({z['texte'][:50]!r})", file=sys.stderr)
            continue
        zones.append({'p': z['page'], 'b': trouve,
                      'x': round(z['x0'] / z['W'], 4), 'y': round(z['top'] / z['H'], 4),
                      'w': round((z['x1'] - z['x0']) / z['W'], 4), 'h': round((z['bottom'] - z['top']) / z['H'], 4)})
    vus = {z['b'] for z in zones}
    manquants = [j for j in range(len(codes)) if j not in vus]
    if manquants: print(f"  {c['id']} : blocs du .tex sans zone dans le PDF : {manquants}", file=sys.stderr)
    return {'zones': zones, 'codes': codes}


def empreinte(*chemins):
    h = hashlib.sha256()
    for p in chemins: h.update(open(p, 'rb').read())
    return h.hexdigest()


def main():
    ids = set(sys.argv[1:])
    cours = [dict(c, tex=SOURCES[c['id']]) for c in yaml.safe_load(open('rubriques/cours.yaml', encoding='utf-8'))['cours'] if c['id'] in SOURCES and c.get('pdf')]
    try: res = json.load(open(SORTIE, encoding='utf-8'))
    except FileNotFoundError: res = {}
    for c in cours:
        if ids and c['id'] not in ids: continue
        sha = empreinte(c['pdf'], c['tex'])
        if not ids and res.get(c['id'], {}).get('sha') == sha: continue
        r = traiter(c); r['sha'] = sha; res[c['id']] = r
        print(f"{c['id']} : {len(r['codes'])} blocs, {len(r['zones'])} zones")
    json.dump(res, open(SORTIE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)


if __name__ == '__main__':
    main()

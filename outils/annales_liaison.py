#!/usr/bin/env python3
"""Outils de liaison des programmes officiels aux cours et exercices (rubrique Annales, MEMO_atlas_annales.md §45).

Les règles des agents de liaison et de relecture sont dans outils/annales_liaison_consignes.md.
Lancer depuis la racine du dépôt.

  python3 outils/annales_liaison.py catalogue <niveau> [préfixes…]   > catalogue.txt
      sections de cours (avec page) et exercices (partie, étoiles, mots-clés, début d'énoncé) d'un niveau
  python3 outils/annales_liaison.py themes                          > themes.txt
      vocabulaire des thèmes d'annales (id, titre, parent, synonymes, nombre de sujets hors bac)
  python3 outils/annales_liaison.py points <prog> <smin> <smax>      > points.json
      texte des points (s, b, p, contenu, precisions, demo) des sections smin..smax (indices à partir de 0)
  python3 outils/annales_liaison.py exporter <prog> <smin> <smax> <sortie.json>
      liens actuels des points, au format des agents
  python3 outils/annales_liaison.py valider <prog> <liens.json> <smin> <smax>
      contrôle d'un fichier de liens (tous les points, dans l'ordre ; renvois existants ; limites)
  python3 outils/annales_liaison.py appliquer <prog> <liens.json>…
      reporte des liens relus dans rubriques/annales-programmes/<prog>.yaml (points concernés seulement)
  python3 outils/annales_liaison.py notes
      rend lisibles les identifiants internes des notes (« mp-05:4 » → « Maths Spé – MP, ch. 5, section 4 »,
      « l3-in-04-05 » → « exercice 4.5 (Licence 3 – Intégration) ») et corrige la grammaire qui en résulte

Format d'un fichier de liens : liste, un objet par point, dans l'ordre du programme :
  {"s": 9, "b": 0, "p": 2, "cours": [{"chap": "l3-in-03", "sec": 6}], "ex": ["l3-in-03-15"],
   "themes": ["convergence-dominee"], "note": "…"}
"""
import glob, json, os, re, sys
import yaml

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
A = 'rubriques/annales-programmes/'
LIM_COURS, LIM_EX, LIM_TH = 3, 6, 3


def charger_cours():
    C = yaml.safe_load(open('rubriques/cours.yaml', encoding='utf-8'))
    return C, {c['id']: c for c in C['cours']}


def charger_exercices():
    E = yaml.safe_load(open('rubriques/exercices.yaml', encoding='utf-8'))
    fe = {f['id']: f for f in E['feuilles']}
    ex = {}
    for f in glob.glob('rubriques/exercices/*.yaml'):
        for e in yaml.safe_load(open(f, encoding='utf-8')) or []: ex[e['id']] = e
    return fe, ex


def charger_themes():
    T = yaml.safe_load(open('rubriques/annales-themes.yaml', encoding='utf-8'))
    return {t['id']: t for t in T['themes']}, T


def prog(pid):
    f = A + pid + '.yaml'
    return f, open(f, encoding='utf-8').read()


def court(s, n): return re.sub(r'\s+', ' ', str(s or ''))[:n]


def cmd_catalogue(niv, *pref):
    C, cours = charger_cours(); fe, ex = charger_exercices()
    nomniv = {n['id']: n['titre'] for n in C['niveaux']}
    ue = {u['id']: u['titre'] for u in C.get('ues', [])}
    parf = {}
    for e in ex.values(): parf.setdefault(e['feuille'], []).append(e)
    for c in C['cours']:
        if c.get('niveau') != niv or not c['id'].startswith(tuple(pref) or ('',)): continue
        lieu = nomniv.get(niv, niv) + (f" – {ue[c['ue']]}" if c.get('ue') in ue else '')
        print(f"### CHAPITRE {c['id']} — {lieu}, ch. {c.get('chapitre')} : {c['titre']}  [PDF : {c.get('pdf', '')}]")
        pg = c.get('sommaire_pages') or []
        for i, s in enumerate(c.get('sommaire') or []):
            print(f"  section {c['id']}:{i + 1}" + (f" (p. {pg[i]})" if i < len(pg) else '') + f" {s}")
        if c.get('annales_themes'): print("  thèmes d'annales du chapitre : " + ', '.join(c['annales_themes']))
        for e in sorted(parf.get(c.get('exercices') or '', []), key=lambda e: int(re.sub(r'\D', '', str(e['numero'])) or 0)):
            print(f"  EX {e['id']} (n° {e['numero']}) [{e.get('partie', '')}] {'*' * int(e.get('etoiles') or 1)} "
                  f"mots: {', '.join(e.get('mots_cles') or [])} | {court(e.get('enonce'), 260)}")


def cmd_themes():
    th, _ = charger_themes()
    n = {}
    for f in glob.glob('rubriques/annales-index/*.yaml'):
        if os.path.basename(f).startswith('bac'): continue
        for s in yaml.safe_load(open(f, encoding='utf-8')) or []:
            vus = set()
            for b in s.get('blocs') or []:
                for t in (b.get('themes') or []) + (b.get('secondaires') or []):
                    vus.add(t); p = th.get(t, {}).get('parent')
                    if p: vus.add(p)
            for t in vus: n[t] = n.get(t, 0) + 1
    for t in th.values():
        if t.get('vocabulaire') == 'lycee' or t['id'].startswith('ly-'): continue
        print(f"{t['id']} — {t['titre']}" + (f" (parent : {t['parent']})" if t.get('parent') else '')
              + f" — {n.get(t['id'], 0)} sujets hors bac" + (f" — synonymes : {', '.join(t.get('synonymes') or [])}" if t.get('synonymes') else ''))


def points(d, a, b):
    for s, S in enumerate(d['sections']):
        if not a <= s <= b: continue
        for bi, B in enumerate(S['blocs']):
            for p, P in enumerate(B['points']):
                yield s, bi, p, S, B, P


def cmd_points(pid, a, b):
    d = yaml.safe_load(prog(pid)[1])
    L = [{'s': s, 'b': bi, 'p': p, 'section': S['intitule'], 'bloc': B.get('intitule', ''), 'contenu': P['contenu'],
          **({'precisions': P['precisions']} if P.get('precisions') else {}), **({'demo': P['demo']} if P.get('demo') else {})}
         for s, bi, p, S, B, P in points(d, int(a), int(b))]
    print(json.dumps(L, ensure_ascii=False, indent=1))


def cmd_exporter(pid, a, b, sortie):
    d = yaml.safe_load(prog(pid)[1]); L = []
    for s, bi, p, S, B, P in points(d, int(a), int(b)):
        x = {'s': s, 'b': bi, 'p': p, 'cours': [{'chap': c.split(':')[0], 'sec': int(c.split(':')[1])} for c in P.get('cours', [])],
             'ex': P.get('ex', []), 'themes': P.get('themes', [])}
        if P.get('note'): x['note'] = P['note']
        if P.get('sans_lien'): x['sans_lien'] = True
        L.append(x)
    json.dump(L, open(sortie, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(sortie, len(L), 'points')


def cmd_valider(pid, fichier, a, b):
    d = yaml.safe_load(prog(pid)[1]); _, cours = charger_cours(); _, ex = charger_exercices(); th, _ = charger_themes()
    attendus = [(s, bi, p) for s, bi, p, *_ in points(d, int(a), int(b))]
    L = json.load(open(fichier, encoding='utf-8')); err = []
    if [(x['s'], x['b'], x['p']) for x in L] != attendus:
        err.append(f"points : {len(L)} reçus, {len(attendus)} attendus, ou ordre différent")
    av = 0
    for x in L:
        k = f"{x.get('s')}/{x.get('b')}/{x.get('p')}"
        cs, es, ts = x.get('cours', []), x.get('ex', []), x.get('themes', [])
        if len(cs) > LIM_COURS: err.append(f"{k} : plus de {LIM_COURS} sections")
        if len(es) > LIM_EX: err.append(f"{k} : plus de {LIM_EX} exercices")
        if len(ts) > LIM_TH: err.append(f"{k} : plus de {LIM_TH} thèmes")
        if len(set(es)) != len(es): err.append(f"{k} : exercice en double")
        for c in cs:
            ch = cours.get(c.get('chap'))
            if not ch: err.append(f"{k} : chapitre inconnu {c.get('chap')}")
            elif not 1 <= int(c.get('sec', 0)) <= len(ch.get('sommaire') or []): err.append(f"{k} : section {c['chap']}:{c.get('sec')} hors sommaire")
        for e in es:
            if e not in ex: err.append(f"{k} : exercice inconnu {e}")
        for t in ts:
            if t not in th: err.append(f"{k} : thème inconnu {t}")
        if re.search(r"\b(aucun exercice|pas d'exercice|sans exercice)\b", x.get('note', ''), re.I) and len(x.get('note', '')) < 80:
            err.append(f"{k} : note qui ne dit que l'absence d'exercice")
        if not cs and not es and not x.get('sans_lien'): av += 1
    print('\n'.join(err) if err else f"OK : {len(L)} points, dont {av} « à venir »")
    sys.exit(1 if err else 0)


def ecrire(f, tete, d):
    class D(yaml.SafeDumper): pass
    D.add_representer(str, lambda dd, s: dd.represent_scalar('tag:yaml.org,2002:str', s,
                      style='"' if any(c in s for c in ':#\'"{}[]&*!|>%@`') or s != s.strip() else None))
    open(f, 'w', encoding='utf-8').write(tete + yaml.dump(d, Dumper=D, allow_unicode=True, sort_keys=False, width=200))


def cmd_appliquer(pid, *fichiers):
    f, txt = prog(pid); tete = ''.join(l + '\n' for l in txt.split('\n') if l.startswith('#'))
    d = yaml.safe_load(txt); n = 0
    ORDRE = ['contenu', 'precisions', 'demo', 'filieres', 'cours', 'ex', 'themes', 'note', 'sans_lien']
    for lf in fichiers:
        for x in json.load(open(lf, encoding='utf-8')):
            P = d['sections'][x['s']]['blocs'][x['b']]['points'][x['p']]; av = dict(P)
            P['cours'] = [f"{c['chap']}:{c['sec']}" for c in x.get('cours', [])]
            P['ex'] = list(x.get('ex', [])); P['themes'] = list(x.get('themes', [])); P['note'] = x.get('note', '')
            for k in ('cours', 'ex', 'themes', 'note'):
                if not P[k]: del P[k]
            nv = {k: P[k] for k in ORDRE if k in P}; nv.update({k: v for k, v in P.items() if k not in nv})
            P.clear(); P.update(nv)
            if P != av: n += 1
    ecrire(f, tete, d)
    print(pid, ':', n, 'points modifiés')


def cmd_notes():
    C, cours = charger_cours(); fe, ex = charger_exercices()
    niv = {n['id']: n['titre'] for n in C['niveaux']}; ue = {u['id']: u['titre'] for u in C.get('ues', [])}
    def nomniv(c): return niv.get(c['niveau'], c['niveau']) + (f" – {ue[c['ue']]}" if c.get('ue') in ue else '')
    def lieu(c): return f"{nomniv(c)}, ch. {c['chapitre']}" if c.get('chapitre') else nomniv(c)
    def lab_ex(i):
        e = ex[i]; f = fe.get(e['feuille'], {}); c = cours.get(f.get('cours'), {'niveau': f.get('niveau')})
        if not f.get('chapitre'): return f"exercice {e['numero']} de la feuille « {f.get('titre', '')} » ({nomniv(c)})"
        return f"exercice {f['chapitre']}.{e['numero']}" + (f" ({nomniv(c)})" if f.get('niveau') not in ('ma', 'mp') else '')
    alt = lambda ids: '|'.join(map(re.escape, sorted(ids, key=len, reverse=True)))
    RX_EX = re.compile(r"(?:l'exercice |exercice )?\b(" + alt(ex) + r")\b")
    RX_SEC = re.compile(r"\b(" + alt(cours) + r"):(\d+)\b")
    RX_CH = re.compile(r"\b(?:le |du |au )?(?:même )?chapitre (" + alt(cours) + r")\b|\b(" + alt(cours) + r")\b")
    def ch(m):
        cid = m.group(1) or m.group(2)
        if not m.group(1): return lieu(cours[cid])
        avant = m.group(0)[:m.group(0).find(cid)]
        return f"{avant.replace('chapitre ', '').rstrip()} {lieu(cours[cid])}".strip()
    GRAM = [(r" (au|le) (Maths |Python |Licence|Master|Première|Terminale|Seconde)", r" dans \2"),
            (r" (de|dans|à|et) exercice (\d)", r" \1 l'exercice \2"), (r"les exercices exercice ", "les exercices "),
            (r"([:;]) exercice (\d)", r"\1 l'exercice \2"), (r"^exercice (\d)", r"L'exercice \1"),
            (r"((?:Licence 3 – [^,()]+|Maths S[a-zé]+ – [A-Z]+|Master[^,()]*), ch\. \d+), section (\d+),? (?:et )?\1, section (\d+)", r"\1, sections \2 et \3")]
    def fix(t):
        t = RX_EX.sub(lambda m: ("l'" if m.group(0).startswith("l'") else '') + lab_ex(m.group(1)), t)
        t = RX_SEC.sub(lambda m: f"{lieu(cours[m.group(1)])}, section {m.group(2)}", t)
        t = RX_CH.sub(ch, t)
        for a, b in GRAM: t = re.sub(a, b, t)
        return t
    n = 0
    for f in sorted(glob.glob(A + '*.yaml')):
        txt = open(f, encoding='utf-8').read(); tete = ''.join(l + '\n' for l in txt.split('\n') if l.startswith('#'))
        d = yaml.safe_load(txt); chg = False
        for s in d['sections']:
            for b in s['blocs']:
                for p in b['points']:
                    if p.get('note') and fix(p['note']) != p['note']: p['note'] = fix(p['note']); chg = True; n += 1
        if chg: ecrire(f, tete, d)
    print(n, 'notes réécrites')


if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__); sys.exit(0)
    {'catalogue': cmd_catalogue, 'themes': cmd_themes, 'points': cmd_points, 'exporter': cmd_exporter,
     'valider': cmd_valider, 'appliquer': cmd_appliquer, 'notes': cmd_notes}[sys.argv[1]](*sys.argv[2:])

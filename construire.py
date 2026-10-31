#!/usr/bin/env python3
"""Construction de l'atlas, étape 1 : lecture et vérification du contenu, mise en page des graphes.

Lit contenu/*.yaml, vérifie la cohérence de l'ensemble, calcule la disposition de chaque
graphe et écrit construction/donnees.json, que rendu.mjs transforme ensuite en page HTML.

Vérifications bloquantes (le script s'arrête sur erreur) :
  - identifiants uniques, natures et familles connues ;
  - arêtes entre nœuds existants d'un même graphe, graphes sans cycle ;
  - chaque nœud « sous » renvoie à un graphe dont il est le conteneur, et réciproquement ;
  - cohérence entre niveaux : chaque entrée d'un sous-graphe est un ancêtre du conteneur
    dans le graphe parent, et chaque parent direct du conteneur figure parmi les entrées ;
  - tout terme [[id]] et tout lien {{id|...}} renvoie à une entrée existante ;
  - un lien {{id|...}} dans un texte, un énoncé ou une démonstration renvoie à un nœud antérieur ;
  - aucune arête tracée ne traverse un nœud ;
  - résultats admis : chaque mention est déclarée dans le champ « admis » de sa fiche (ci-dessous).
Avertissements : termes du lexique jamais employés, arêtes redondantes non tracées, admis hors cadre
dans un énoncé, une démonstration ou un texte.

Champ « admis » d'une fiche (31 oct. 2026) : liste facultative d'entrées
    - lieu: texte | enonce | preuve | choix | remarque     champ où figure la mention
      statut: aval | ailleurs | hors-cadre | a-faire | cite
      objet: courte phrase (formules et liens permis) qui dit ce qui est admis
      renvoi: <id de fiche>                              obligatoire pour aval, ailleurs, cite ; interdit sinon
      employe: false                                     facultatif, cite seulement : l'admis cité est
                                                         nommé sans être employé (« non employé »)
  aval        démontré plus loin, en aval dans l'ordre global (ORDRE), faute d'ingrédients en amont ;
              la fiche de renvoi n'a elle-même aucun admis (hors citations) en énoncé, preuve ou texte ;
  ailleurs    démontré dans une branche parallèle, ni en amont ni en aval (même condition sur le renvoi) ;
  hors-cadre  résultat que l'atlas ne démontrera pas (permis partout ; avertissement en énoncé, preuve, texte) ;
  a-faire     lacune réelle, à combler ;
  cite        la mention rappelle un admis porté par la fiche de renvoi, qui doit avoir une entrée d'un autre
              statut (renvoi à la fiche elle-même permis : rappel d'un admis déclaré à un autre lieu).
Une mention est un mot entier « admis », « admise » ou « admises », sans égard à la casse, dans texte,
enonce, preuve, choix ou une remarque. Chaque lieu porte au moins autant d'entrées que de mentions, et
toute entrée doit répondre à une mention de son lieu. Un admis formulé autrement (« n'est pas démontré
ici », « on admet ») est récrit avec le mot « admis ». Une citation est périmée (erreur) si l'admis cité
est démontré en amont du citant. Un lien {{x|…}} d'un énoncé ou d'une preuve vers une fiche x qui admet
un résultat dans son énoncé ou sa preuve exige une entrée de lieu enonce ou preuve dans la fiche citante,
sauf si celle-ci est la démonstration de l'admis, la contient, ou vient après elle. Il n'y a pas de statut « historique » :
une phrase qui relate un admis levé est récrite en renvoi à la démonstration, sans le mot « admis ».
L'inventaire (sortie['admis']) alimente la page « État de l'édifice » (gabarit : etatEdifice).
Signe † (graphes intérieurs et titre de fiche) : une fiche le porte si son résultat n'est pas entièrement
démontré à cet endroit, c'est-à-dire si l'une de ses entrées de lieu texte, enonce ou preuve est d'un statut
autre que cite, ou bien est une citation employée (sans employe: false) d'une fiche qui porte elle-même le
signe pour un admis que la fiche citante ne démontre pas (elle n'est ni sa démonstration ni son conteneur).
Les théories du graphe principal ne le portent pas. Les entrées retenues sont marquées 'signe' dans
l'inventaire ; le nœud porte le booléen 'admis' (comme 'choix' pour ⋆).
"""
import os, glob, json, re, sys
from collections import defaultdict
import networkx as nx
import yaml
import random

NATURES = {'théorie', 'chapitre', 'axiome', 'définition', 'théorème',
           'proposition', 'lemme', 'corollaire'}
NUMEROTEES = ['définition', 'proposition', 'lemme', 'théorème', 'corollaire']
FAMILLES = {'fond', 'ord', 'alg', 'top', 'ana', 'geo', 'ari', 'mix', 'n', 'z', 'q', 'r', 'c'}
NOMBRES = {'n', 'z', 'q', 'r', 'c'}
CHAMPS_TEXTE = ['texte', 'enonce', 'preuve', 'choix']

erreurs, avertissements = [], []
def erreur(m): erreurs.append(m)
def avert(m): avertissements.append(m)

# ------------------------------------------------------------------ lecture
lexique = yaml.safe_load(open('contenu/lexique.yaml', encoding='utf-8'))
graphes = [yaml.safe_load(open(f, encoding='utf-8'))
           for f in sorted(glob.glob('contenu/*.yaml')) if not f.endswith('lexique.yaml')]

lex = {}
for e in lexique:
    if e['id'] in lex: erreur(f"lexique : id en double « {e['id']} »")
    lex[e['id']] = e

noeuds, G = {}, {}
for g in graphes:
    G[g['graphe']] = g
    g.setdefault('entrees', {})
    for n in g['noeuds']:
        if n['id'] in noeuds: erreur(f"nœud en double « {n['id']} »")
        n['graphe'] = g['graphe']
        n.setdefault('famille', 'mix')
        n.setdefault('titre', n['etiquette'])
        n.setdefault('remarques', [])
        if n['nature'] not in NATURES: erreur(f"{n['id']} : nature inconnue « {n['nature']} »")
        if n['famille'] not in FAMILLES: erreur(f"{n['id']} : famille inconnue « {n['famille']} »")
        noeuds[n['id']] = n

racines = [g for g in graphes if g['conteneur'] is None]
if len(racines) != 1: erreur("il faut exactement un graphe sans conteneur")

# ------------------------------------------------------------------ graphes
D, R = {}, {}   # graphe déclaré, réduction transitive
for g in graphes:
    gid, ids = g['graphe'], [n['id'] for n in g['noeuds']]
    d = nx.DiGraph(); d.add_nodes_from(ids)
    for a, b in g['aretes']:
        for x in (a, b):
            if x not in ids: erreur(f"[{gid}] arête {a}->{b} : « {x} » n'est pas un nœud de ce graphe")
        d.add_edge(a, b)
    if not nx.is_directed_acyclic_graph(d):
        erreur(f"[{gid}] cycle : {nx.find_cycle(d)}"); continue
    D[gid] = d
    R[gid] = nx.transitive_reduction(d); R[gid].add_nodes_from(ids)
    retirees = sorted(set(d.edges()) - set(R[gid].edges()))
    if retirees: avert(f"[{gid}] arêtes redondantes non tracées : {retirees}")

# ------------------------------------------------------------------ niveaux
for n in noeuds.values():
    if 'sous' in n:
        s = n['sous']
        if s not in G: erreur(f"{n['id']} : sous-graphe « {s} » introuvable")
        elif G[s]['conteneur'] != n['id']: erreur(f"{n['id']} : le graphe « {s} » a pour conteneur {G[s]['conteneur']}")
for g in graphes:
    k = g['conteneur']
    if k is None: continue
    if k not in noeuds: erreur(f"[{g['graphe']}] conteneur « {k} » inconnu"); continue
    if noeuds[k].get('sous') != g['graphe']: erreur(f"[{g['graphe']}] le nœud {k} ne pointe pas vers ce graphe")
    P = noeuds[k]['graphe']; g['parent'] = P
    if P not in D: continue
    anc = nx.ancestors(D[P], k)
    for e, cibles in g['entrees'].items():
        if e not in noeuds or noeuds[e]['graphe'] != P:
            erreur(f"[{g['graphe']}] entrée « {e} » absente du graphe parent {P}")
        elif e not in anc:
            erreur(f"[{g['graphe']}] entrée « {e} » : ce n'est pas un ancêtre de {k} dans {P}")
        for c in cibles:
            if c not in D[g['graphe']]: erreur(f"[{g['graphe']}] entrée {e} -> {c} : cible inconnue")
    for p in D[P].predecessors(k):
        if p not in g['entrees']:
            erreur(f"[{g['graphe']}] {p} est un parent direct de {k} dans {P} mais n'est pas une entrée")

# ------------------------------------------------------------------ références
RE_TERME = re.compile(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]')
RE_LIEN = re.compile(r'\{\{([^}|]+)\|[^}]*\}\}')
RE_LEX = re.compile(r'\\lex\{([^}]+)\}')          # notation du lexique dans une formule

def termes(texte):
    """Termes du lexique employés : [[id]] dans le texte, \\lex{id}{...} dans les formules."""
    return RE_TERME.findall(texte) + RE_LEX.findall(texte)

def mentionne(texte, t):
    return f'[[{t}]' in texte or f'[[{t}|' in texte or f'\\lex{{{t}}}' in texte
emplois = defaultdict(set)

def textes(n):
    for c in CHAMPS_TEXTE:
        if n.get(c): yield n[c]
    yield from n['remarques']

RE_MATHS = re.compile(r'\$\$(.+?)\$\$|\$([^$]+)\$', re.S)
RE_INTERVALLE = re.compile(r'(?:^|[\s(,;]|\\[,;!]|\\in)\]-')

def verifie_typo(texte, ou):
    # Intervalle ouvert à gauche dont la borne commence par un moins : « ]{-1}, 1[ » et non « ]-1, 1[ »,
    # que KaTeX lit comme « ] − 1 » (moins binaire, espacé). Convention d'aération, mémo §34.
    for a, b in RE_MATHS.findall(texte):
        if RE_INTERVALLE.search(a or b):
            erreur(f"{ou} : intervalle « ]-… » dans « {(a or b).strip()[:40]} » : écrire « ]{{-…}} »")

def verifie_refs(texte, ou, lieu=None):
    for t in termes(texte):
        if t not in lex: erreur(f"{ou} : terme inconnu [[{t}]]")
        elif lieu: emplois[t].add(lieu)
    for t in RE_LIEN.findall(texte):
        if t not in noeuds: erreur(f"{ou} : lien vers un nœud inconnu {{{{{t}}}}}")

for n in noeuds.values():
    for t in textes(n): verifie_refs(t, n['id'], n['id']); verifie_typo(t, n['id'])
for e in lex.values():
    verifie_refs(e['definition'], f"lexique/{e['id']}"); verifie_typo(e['definition'], f"lexique/{e['id']}")
for t in lex:
    if not emplois[t]:
        cites = [e['id'] for e in lex.values() if mentionne(e['definition'], t)]
        if not cites: avert(f"lexique : « {t} » n'est employé nulle part")

# ------------------------------------------------------------------ ordre d'apparition des notions
# Ordre global de l'atlas : arêtes de chaque graphe, entrées des sous-graphes ; chaque nœud
# intérieur vient après les parents de son conteneur et avant le conteneur lui-même (ce qui
# dépend d'une théorie dépend de tout son contenu).
# Un terme du lexique est défini au nœud indiqué par « defini_dans » ; on ne peut l'employer,
# dans un texte, un énoncé ou une démonstration, qu'en ce nœud ou après lui. Les remarques et
# les notes sur le choix peuvent renvoyer en avant : ces renvois sont seulement signalés.
ORDRE = nx.DiGraph(); ORDRE.add_nodes_from(noeuds)
for d in D.values(): ORDRE.add_edges_from(d.edges())
for g in graphes:
    for e, cibles in g['entrees'].items():
        for c in cibles: ORDRE.add_edge(e, c)
    if g['conteneur']:
        k = g['conteneur']
        P = noeuds[k]['graphe']
        # Parents du conteneur : ses prédécesseurs dans son graphe, et les entrées de ce graphe qui le visent
        # (30 oct. 2026 : un chapitre peut n'être alimenté que par des entrées, comme galois-representations).
        amont = list(D[P].predecessors(k)) + [e for e, cs in G[P].get('entrees', {}).items() if k in cs]
        for n in g['noeuds']:
            ORDRE.add_edge(n['id'], k)                 # le contenu précède son conteneur...
            for p in amont:
                ORDRE.add_edge(p, n['id'])             # ...et suit les parents de ce conteneur
if not nx.is_directed_acyclic_graph(ORDRE):
    erreur(f"ordre global : cycle {nx.find_cycle(ORDRE)}")
avant = {v: nx.ancestors(ORDRE, v) | {v} for v in noeuds} if not erreurs else {}
renvois = []
for t, e in lex.items():
    if e.get('defini_dans') not in noeuds:
        erreur(f"lexique/{t} : « defini_dans » absent ou inconnu ({e.get('defini_dans')})")
    for v in e.get('voir', []):
        if v not in lex: erreur(f"lexique/{t} : « voir » renvoie au terme inconnu {v}")
if avant and not erreurs:
    for n in noeuds.values():
        for champ in ['texte', 'enonce', 'preuve']:
            for t in termes(n.get(champ) or ''):
                d = lex[t]['defini_dans']
                if d not in avant[n['id']]:
                    erreur(f"{n['id']}/{champ} emploie « {t} », défini plus loin, au nœud {d}")
            for t in RE_LIEN.findall(n.get(champ) or ''):
                if t in noeuds and t not in avant[n['id']]:
                    erreur(f"{n['id']}/{champ} renvoie au nœud {t}, qui vient plus loin ou ailleurs")
        for txt in n['remarques'] + ([n['choix']] if n.get('choix') else []):
            for t in termes(txt):
                if lex[t]['defini_dans'] not in avant[n['id']]:
                    renvois.append(f"{n['id']} → {t}")
    for t, e in lex.items():
        d = e['defini_dans']
        for t2 in termes(e['definition']):
            d2 = lex[t2]['defini_dans']
            if d2 not in avant[d]:
                erreur(f"lexique/{t} (défini au nœud {d}) emploie « {t2} », défini plus loin, au nœud {d2}")
        if not any(mentionne(x, t) for x in textes(noeuds[d])):
            avert(f"lexique/{t} : le nœud {d}, où il est défini, ne le mentionne pas")
    if renvois: avert(f"renvois en avant dans les remarques ({len(renvois)}) : " + ', '.join(sorted(renvois)))

# ------------------------------------------------------------------ résultats admis
# Schéma et règles : voir l'en-tête. Le lieu « remarque » couvre toutes les remarques de la fiche.
RE_ADMIS = re.compile(r'\b(?:admis|admise|admises)\b', re.I)
LIEUX_ADMIS = ['texte', 'enonce', 'preuve', 'choix', 'remarque']
PRINCIPAUX = {'texte', 'enonce', 'preuve'}
STATUTS_ADMIS = {'aval', 'ailleurs', 'hors-cadre', 'a-faire', 'cite'}
def mentions_admis(n):
    """Nombre de mentions par lieu."""
    compte = defaultdict(int)
    for c in ['texte', 'enonce', 'preuve', 'choix']:
        compte[c] += len(RE_ADMIS.findall(n.get(c) or ''))
    compte['remarque'] = sum(len(RE_ADMIS.findall(r)) for r in n['remarques'])
    return {c: k for c, k in compte.items() if k}
def propres(n, lieux=None):
    """Entrées qui portent un admis (toutes sauf les citations), éventuellement restreintes à des lieux."""
    return [a for a in n.get('admis') or [] if a.get('statut') != 'cite' and (lieux is None or a.get('lieu') in lieux)]
def contenants(v):
    """Conteneurs successifs de la fiche v (chapitre, théorie…), jusqu'au graphe racine."""
    c, g = [], noeuds[v]['graphe']
    while G[g]['conteneur']: c.append(G[g]['conteneur']); g = noeuds[G[g]['conteneur']]['graphe']
    return c
def demontre_par(v, r):
    """v est la fiche de démonstration r, ou l'un de ses conteneurs."""
    return v == r or v in contenants(r)
for n in noeuds.values():
    v, ent = n['id'], n.get('admis') or []
    if not isinstance(ent, list): erreur(f"{v} : « admis » doit être une liste"); continue
    vus = mentions_admis(n)
    for k, a in enumerate(ent):
        ou = f"{v}/admis {k + 1}"
        if not isinstance(a, dict): erreur(f"{ou} : entrée mal formée"); continue
        for cle in set(a) - {'lieu', 'statut', 'objet', 'renvoi', 'employe'}: erreur(f"{ou} : clé inconnue « {cle} »")
        lieu, st, r = a.get('lieu'), a.get('statut'), a.get('renvoi')
        if 'employe' in a and (a['employe'] is not False or st != 'cite'):
            erreur(f"{ou} : « employe » ne prend que la valeur false, pour une citation")
        if lieu not in LIEUX_ADMIS: erreur(f"{ou} : lieu inconnu « {lieu} » ({', '.join(LIEUX_ADMIS)})"); continue
        if st not in STATUTS_ADMIS: erreur(f"{ou} : statut inconnu « {st} » ({', '.join(sorted(STATUTS_ADMIS))})"); continue
        if not isinstance(a.get('objet'), str) or not a['objet'].strip(): erreur(f"{ou} : objet absent")
        else: verifie_refs(a['objet'], ou); verifie_typo(a['objet'], ou)
        if lieu not in vus: erreur(f"{ou} : aucune mention « admis » dans le lieu « {lieu} » de la fiche")
        if st in ('aval', 'ailleurs', 'cite'):
            if r not in noeuds: erreur(f"{ou} : statut {st}, renvoi absent ou inconnu ({r})"); continue
        elif r is not None: erreur(f"{ou} : statut {st}, renvoi interdit ({r})"); continue
        if st == 'hors-cadre' and lieu in PRINCIPAUX:
            avert(f"{ou} : admis hors cadre dans « {lieu} » ({a.get('objet', '')[:60]})")
        if r is None: continue
        if st == 'cite':
            if r == v:
                if not [b for b in propres(n) if b.get('lieu') != lieu]:
                    erreur(f"{ou} : rappel d'un admis de la fiche elle-même, mais aucun autre lieu n'en déclare")
            elif not propres(noeuds[r]):
                erreur(f"{ou} : cite {r}, qui ne déclare aucun admis (périmé ? écrire un renvoi à la démonstration)")
            elif avant:
                # Citation périmée : l'admis cité est démontré en amont du citant (sauf si le citant est cette
                # démonstration ou la contient).
                for d_ in sorted({b.get('renvoi') for b in propres(noeuds[r]) if b.get('statut') in ('aval', 'ailleurs')} - {None}):
                    if d_ in noeuds and d_ in avant[v] and not demontre_par(v, d_):
                        erreur(f"{ou} : cite {r}, dont l'admis est démontré à {d_}, en amont de {v} : écrire un renvoi à la démonstration")
            continue
        if r == v: erreur(f"{ou} : renvoi à la fiche elle-même"); continue
        if avant:
            if v in avant[r] and st == 'ailleurs': erreur(f"{ou} : {r} est en aval de {v} : statut aval")
            if r in avant[v]: erreur(f"{ou} : {r} est en amont de {v} : l'admis est périmé, écrire un renvoi à la démonstration")
            elif st == 'aval' and v not in avant[r]: erreur(f"{ou} : {r} n'est pas en aval de {v} (statut ailleurs ?)")
        if propres(noeuds[r], PRINCIPAUX):
            erreur(f"{ou} : la fiche de renvoi {r} admet elle-même un résultat dans son énoncé, sa preuve ou son texte")
    declares = defaultdict(int)
    for a in ent:
        if isinstance(a, dict): declares[a.get('lieu')] += 1
    for lieu, k in sorted(vus.items()):
        if declares[lieu] < k:
            erreur(f"{v} : {k} mention(s) « admis » dans « {lieu} », mais {declares[lieu]} entrée(s) de ce lieu dans le champ admis")
# Signe † : entrées de lieu principal qui font que le résultat de la fiche n'est pas entièrement démontré à
# cet endroit (voir l'en-tête). Chaque entrée retenue est accompagnée de ses origines : les entrées propres
# (non citées) d'où vient l'admis, au bout de la chaîne des citations, avec leur renvoi. Une citation compte
# s'il lui reste une origine que la fiche citante ne démontre pas (elle n'en est ni la démonstration ni le
# conteneur) ; les rappels d'un admis de la fiche elle-même ne comptent pas (l'entrée propre décide).
def entrees_signe(v, pile=()):
    n, res = noeuds[v], []
    for a in n.get('admis') or []:
        if not isinstance(a, dict) or a.get('lieu') not in PRINCIPAUX: continue
        if a.get('statut') != 'cite': res.append((a, [a])); continue
        r = a.get('renvoi')
        if a.get('employe') is False or r == v or r not in noeuds or r in pile: continue
        orig = [b for _, os_ in entrees_signe(r, pile + (v,)) for b in os_
                if not (b.get('statut') in ('aval', 'ailleurs') and demontre_par(v, b.get('renvoi')))]
        if orig: res.append((a, list({id(b): b for b in orig}.values())))
    return res
for n in noeuds.values():
    n['_signe_brut'] = entrees_signe(n['id'])
    n['_signe'] = [a for a, _ in n['_signe_brut']] if n['graphe'] != racines[0]['graphe'] else []

# Transmission : un lien {{x|…}} dans un énoncé ou une preuve vers une fiche x qui admet un résultat dans son
# énoncé ou sa preuve, directement ou par une citation (x porte alors le signe † par cet énoncé ou cette
# preuve), exige dans la fiche citante une entrée de lieu enonce ou preuve (cite, aval, ailleurs…).
# Exceptions : la fiche citante est la démonstration de cet admis ou la contient, ou cette démonstration est
# en amont de la fiche citante (l'admis y est alors levé). Les admis à faire ou hors cadre n'ont pas d'exception.
if avant:
    for n in noeuds.values():
        v = n['id']
        if any(a.get('lieu') in ('enonce', 'preuve') for a in n.get('admis') or [] if isinstance(a, dict)): continue
        for x in sorted({t for c in ('enonce', 'preuve') for t in RE_LIEN.findall(n.get(c) or '')}):
            if x == v or x not in noeuds: continue
            origines = propres(noeuds[x], {'enonce', 'preuve'}) + [
                b for a, os_ in noeuds[x]['_signe_brut'] if a.get('lieu') in ('enonce', 'preuve') for b in os_]
            for b in origines:
                d_ = b.get('renvoi')
                if d_ in noeuds and (demontre_par(v, d_) or d_ in avant[v]): continue
                erreur(f"{v} : son énoncé ou sa preuve renvoie à {x}, qui admet « {b.get('objet', '')[:50]} » ; "
                       f"déclarer l'admis transmis (entrée de lieu enonce ou preuve)")
                break

# ------------------------------------------------------------------ rangs et numéros
for gid, d in D.items():
    for v in nx.topological_sort(d):
        noeuds[v]['rang'] = max((noeuds[p]['rang'] + 1 for p in d.predecessors(v)), default=0)
    compteur = defaultdict(int)
    ordre = list(nx.lexicographical_topological_sort(
        d, key=lambda v: [n['id'] for n in G[gid]['noeuds']].index(v)))
    for v in ordre:
        nat = noeuds[v]['nature']
        if nat in NUMEROTEES:
            compteur[nat] += 1; noeuds[v]['numero'] = compteur[nat]

if erreurs:
    print("ERREURS :"); [print("  -", e) for e in erreurs]; sys.exit(1)

# ------------------------------------------------------------------ mise en page
ECART_Y, MARGE = 108, 36
SEP_NOEUDS, SEP_FICTIF = 30, 18

def taille(n, entree=False):
    if n['famille'] in NOMBRES and not entree: return 48, 48
    lab = n['etiquette'] + (' ⋆' if n.get('choix') else '') + (' †' if n.get('_signe') else '')
    larg = len(lab) * 7.1 + 30
    if larg <= 176: return max(larg, 92), 44
    return 176, 60

def disposer(gid):
    g = G[gid]
    # Graphe reconstruit dans l'ordre des fichiers de contenu : sans cela, l'ordre de parcours
    # des ensembles, propre à chaque exécution de Python, changeait la disposition d'une fois à l'autre.
    rang_yaml = {n['id']: k for k, n in enumerate(g['noeuds'])}
    r = nx.DiGraph()
    r.add_nodes_from(sorted(R[gid].nodes, key=rang_yaml.get))
    r.add_edges_from(sorted(R[gid].edges, key=lambda e: (rang_yaml[e[0]], rang_yaml[e[1]])))
    entrees = list(g['entrees'])
    for e, cibles in g['entrees'].items():
        r.add_node('↑' + e)
        for c in cibles: r.add_edge('↑' + e, c)
    # rangs : plus long chemin depuis les sources
    # dans le graphe racine, il n'y a pas d'entrées ; ailleurs, elles occupent seules le rang 0
    plancher = 1 if entrees else 0
    rang = {}
    for v in nx.topological_sort(r):
        base = 0 if v.startswith('↑') else plancher
        rang[v] = max([base] + [rang[p] + 1 for p in r.predecessors(v)])
    def essai(rang):
        rang = dict(rang)
        # nœuds fictifs sur les arêtes longues
        chaines, couches = [], defaultdict(list)
        for v in r.nodes: couches[rang[v]].append(v)
        k = 0
        for a, b in r.edges():
            ch = [a]
            for t in range(rang[a] + 1, rang[b]):
                f = f'·{k}'; k += 1; rang[f] = t; couches[t].append(f); ch.append(f)
            ch.append(b); chaines.append(ch)
        nmax = max(rang.values())
        voisins_bas, voisins_haut = defaultdict(list), defaultdict(list)
        for ch in chaines:
            for u, v in zip(ch, ch[1:]): voisins_haut[u].append(v); voisins_bas[v].append(u)

        # Ordre des nœuds dans chaque rang : on minimise les croisements d'arêtes.
        # Heuristique de Sugiyama : balayages par barycentres, puis échanges de voisins (transposition),
        # le tout à partir de plusieurs ordres de départ déterministes ; on garde le meilleur.
        def croisements_entre(ordre, t):
            bas = {v: i for i, v in enumerate(ordre[t])}
            haut = {v: i for i, v in enumerate(ordre[t + 1])}
            segs = [(bas[u], haut[v]) for u in ordre[t] for v in voisins_haut[u]]
            return sum(1 for i in range(len(segs)) for j in range(i + 1, len(segs))
                       if (segs[i][0] - segs[j][0]) * (segs[i][1] - segs[j][1]) < 0)
        def croisements(ordre):
            return sum(croisements_entre(ordre, t) for t in range(nmax))
        def autour(ordre, t):
            return (croisements_entre(ordre, t - 1) if t > 0 else 0) + (croisements_entre(ordre, t) if t < nmax else 0)
        def transposer(ordre):
            for _ in range(30):
                ameliore = False
                for t in range(nmax + 1):
                    c = ordre[t]
                    for i in range(len(c) - 1):
                        avant = autour(ordre, t)
                        c[i], c[i + 1] = c[i + 1], c[i]
                        if autour(ordre, t) < avant: ameliore = True
                        else: c[i], c[i + 1] = c[i + 1], c[i]
                if not ameliore: return
        def balayer(ordre):
            meilleur, score = {t: list(c) for t, c in ordre.items()}, croisements(ordre)
            for it in range(24):
                montee = it % 2 == 0
                rng = range(1, nmax + 1) if montee else range(nmax - 1, -1, -1)
                for t in rng:
                    ref = {v: i for i, v in enumerate(ordre[t - 1 if montee else t + 1])}
                    def bary(v, i):
                        vs = [ref[w] for w in (voisins_bas[v] if montee else voisins_haut[v]) if w in ref]
                        return (sum(vs) / len(vs), i) if vs else (i, i)
                    ordre[t] = [v for i, v in sorted(enumerate(ordre[t]), key=lambda iv: bary(iv[1], iv[0]))]
                transposer(ordre)
                s = croisements(ordre)
                if s < score: meilleur, score = {t: list(c) for t, c in ordre.items()}, s
                if score == 0: break
            return meilleur, score
        departs = [{t: list(couches[t]) for t in range(nmax + 1)},
                   {t: list(reversed(couches[t])) for t in range(nmax + 1)}]
        # Six ordres aléatoires suffisent : une résolution exacte par programmation en nombres entiers
        # (29 oct. 2026, CP-SAT, rangement fixé) donne le même minimum pour chaque graphe intérieur, et
        # 15 pour l'édifice, contre 16 ici, que 300 départs n'améliorent pas.
        for graine in range(6):
            hasard = random.Random(graine)
            departs.append({t: hasard.sample(couches[t], len(couches[t])) for t in range(nmax + 1)})
        ordre, score = None, None
        for d in departs:
            o, s = balayer(d)
            if score is None or s < score: ordre, score = o, s
            if score == 0: break


        return rang, couches, chaines, nmax, voisins_bas, voisins_haut, ordre, score

    # Autres rangements possibles (29 oct. 2026) : au plus tard, et un rangement qui raccourcit les
    # arêtes (chaque nœud libre va à la médiane des rangs que lui imposent ses voisins). On garde celui
    # qui donne le moins de croisements ; à égalité, celui dont les arêtes sont les plus courtes, puis le
    # rangement au plus tôt d'origine.
    def fixe(v): return v.startswith('↑')
    def bornes(rg, v):
        lo = max([0 if fixe(v) else plancher] + [rg[p] + 1 for p in r.predecessors(v)])
        hi = min([rg[s_] - 1 for s_ in r.successors(v)] or [max(rg.values())])
        return lo, hi
    candidats = [rang]
    tard = dict(rang)
    for v in reversed(list(nx.topological_sort(r))):
        if fixe(v): continue
        lo, hi = bornes(tard, v)
        if list(r.successors(v)): tard[v] = hi
    candidats.append(tard)
    court = dict(rang)
    for _ in range(20):
        bouge = False
        for v in nx.topological_sort(r):
            if fixe(v): continue
            lo, hi = bornes(court, v)
            cibles = sorted([court[p] + 1 for p in r.predecessors(v)] + [court[s_] - 1 for s_ in r.successors(v)])
            if not cibles or lo > hi: continue
            m = min(max(cibles[(len(cibles) - 1) // 2], lo), hi)
            if m != court[v]: court[v] = m; bouge = True
        if not bouge: break
    candidats.append(court)
    # Dans le graphe de l'édifice, le rang affiché est la longueur du plus long chemin depuis la logique
    # (texte d'accueil) : seul le rangement au plus tôt le respecte.
    if gid == racines[0]['graphe']: candidats = [rang]
    def longueur(rg): return sum(rg[b] - rg[a] - 1 for a, b in r.edges())
    def placer(e_):
        rang, couches, chaines, nmax, voisins_bas, voisins_haut, ordre, score = e_
        dims = {}
        for v in rang:
            if v.startswith('·'): dims[v] = (0, 0)
            elif v.startswith('↑'): dims[v] = taille(noeuds[v[1:]], entree=True)
            else: dims[v] = taille(noeuds[v])
        def sep(a, b):
            fict = a.startswith('·') or b.startswith('·')
            return (dims[a][0] + dims[b][0]) / 2 + (SEP_FICTIF if fict else SEP_NOEUDS)
        x = {}
        for t, c in ordre.items():
            cur = 0
            for i, v in enumerate(c):
                if i: cur += sep(c[i - 1], v)
                x[v] = cur
        for it in range(60):
            rng = range(nmax + 1) if it % 2 == 0 else range(nmax, -1, -1)
            for t in rng:
                c = ordre[t]
                voulu = []
                for v in c:
                    vs = voisins_bas[v] + voisins_haut[v]
                    poids = [3 if (w.startswith('·') or v.startswith('·')) else 1 for w in vs]
                    # Une feuille posée au-dessus (nœud sans successeur) suit son parent sans l'attirer :
                    # sinon chaque embranchement décale la chaîne principale, et les décalages s'accumulent.
                    poids = [p * (0.2 if (w in voisins_haut[v] and not voisins_haut[w] and len(vs) > 1) else 1)
                             for w, p in zip(vs, poids)]
                    voulu.append(sum(x[w] * p for w, p in zip(vs, poids)) / sum(poids) if vs else x[v])
                # placement au plus près des positions voulues, ordre et écarts respectés
                g_ = list(voulu)
                for i in range(1, len(c)): g_[i] = max(g_[i], g_[i - 1] + sep(c[i - 1], c[i]))
                d_ = list(voulu)
                for i in range(len(c) - 2, -1, -1): d_[i] = min(d_[i], d_[i + 1] - sep(c[i], c[i + 1]))
                moy = [(a + b) / 2 for a, b in zip(g_, d_)]
                for i in range(1, len(c)): moy[i] = max(moy[i], moy[i - 1] + sep(c[i - 1], c[i]))
                for i, v in enumerate(c): x[v] = moy[i]
        # Redressement : une couche réduite à un seul nœud, de parent unique, est alignée sur ce parent,
        # et tout ce qui est au-dessus suit. Toute arête qui traverse la couche passe par ce nœud
        # (les arêtes longues y auraient un nœud fictif), donc aucune autre arête n'est déformée.
        for t in range(1, nmax + 1):
            c = ordre[t]
            if len(c) == 1 and len(voisins_bas[c[0]]) == 1:
                d = x[voisins_bas[c[0]][0]] - x[c[0]]
                for v in x:
                    if rang[v] >= t: x[v] += d
        # Centrage de l'édifice (demande de l'auteur, 28 oct. 2026) : chaque couche est translatée pour que
        # le milieu de ses bulles soit à l'aplomb de la source (la logique). Une translation d'une couche
        # entière, nœuds fictifs compris, garde l'ordre dans chaque couche, donc le nombre de croisements ;
        # la vérification « aucune arête ne traverse un nœud », plus bas, porte sur le tracé obtenu.
        if gid == racines[0]['graphe']:
            sources = [v for v in ordre[0] if not v.startswith('·')]
            axe = (min(x[v] - dims[v][0] / 2 for v in sources) + max(x[v] + dims[v][0] / 2 for v in sources)) / 2
            for t in range(1, nmax + 1):
                vrais = [v for v in ordre[t] if not v.startswith('·')]
                if not vrais: continue
                milieu = (min(x[v] - dims[v][0] / 2 for v in vrais) + max(x[v] + dims[v][0] / 2 for v in vrais)) / 2
                for v in ordre[t]: x[v] += axe - milieu
        # Routage des arêtes en pistes (28 oct. 2026, demande de l'auteur : pouvoir suivre chaque flèche).
        # 1. Redressement des arêtes longues : leurs nœuds fictifs sont alignés à la verticale aussi longtemps
        #    que les voisins de couche le permettent (ordre et écarts gardés, donc croisements inchangés).
        # 2. Ports : chaque arête part d'un point distinct du haut de sa bulle et arrive en un point distinct
        #    du bas de sa cible, rangés de gauche à droite comme leurs destinations.
        # 3. Pistes : entre deux couches, chaque changement d'abscisse se fait sur une horizontale qui lui
        #    est propre (coins arrondis) ; deux horizontales qui se recouvrent sont sur deux pistes
        #    différentes, ordonnées pour ne pas se croiser sans nécessité ; la bande s'élargit au besoin.
        #    Deux arêtes ne se superposent donc jamais : elles ne peuvent que se croiser à angle droit.
        pos = {v: i for t_ in range(nmax + 1) for i, v in enumerate(ordre[t_])}
        def intervalle(f):
            c = ordre[rang[f]]; i = pos[f]
            lo = x[c[i - 1]] + sep(c[i - 1], f) if i > 0 else -1e9
            hi = x[c[i + 1]] - sep(f, c[i + 1]) if i < len(c) - 1 else 1e9
            return lo, hi
        for _ in range(4):
            for ch in sorted(chaines, key=lambda ch: -len(ch)):
                fs = ch[1:-1]
                if not fs: continue
                a_, b_ = ch[0], ch[-1]
                i, prec = 0, x[a_]
                while i < len(fs):
                    lo, hi = intervalle(fs[i]); j = i + 1
                    while j < len(fs):
                        l2, h2 = intervalle(fs[j])
                        if max(lo, l2) <= min(hi, h2): lo, hi = max(lo, l2), min(hi, h2); j += 1
                        else: break
                    if i == 0 and lo <= x[a_] <= hi: val = x[a_]
                    elif j == len(fs) and lo <= x[b_] <= hi: val = x[b_]
                    else: val = min(max(prec, lo), hi)
                    for k in range(i, j): x[fs[k]] = val
                    prec, i = val, j
        return rang, couches, chaines, nmax, voisins_bas, voisins_haut, ordre, score, dims, sep, x, pos, intervalle
    # Parmi les rangements de moindre nombre de croisements, on garde celui dont la disposition finale est
    # la moins large, puis celui dont les arêtes sont les plus courtes (moins de nœuds fictifs), puis le
    # rangement au plus tôt (30 oct. 2026 : une source isolée descendait au rang le plus bas et étirait le
    # graphe ar-topo sur 1745 px).
    essais = [(essai(rg), longueur(rg), k_) for k_, rg in enumerate(candidats)]
    mini = min(e_[-1] for e_, _, _ in essais)
    meilleure_cle, place = None, None
    for e_, lg, k_ in essais:
        if e_[-1] != mini: continue
        pl = placer(e_)
        xs, ds = pl[10], pl[8]
        larg = max(xs[v] + ds[v][0] / 2 for v in xs) - min(xs[v] - ds[v][0] / 2 for v in xs)
        cle = (round(larg), lg, k_)
        if meilleure_cle is None or cle < meilleure_cle: meilleure_cle, place = cle, pl
    rang, couches, chaines, nmax, voisins_bas, voisins_haut, ordre, score, dims, sep, x, pos, intervalle = place
    xmin = min(x[v] - dims[v][0] / 2 for v in x)
    xmax = max(x[v] + dims[v][0] / 2 for v in x)
    decal = MARGE - xmin
    if gid == racines[0]['graphe']: decal += 64   # place des étiquettes de rang
    for v in x: x[v] += decal
    largeur = xmax - xmin + 2 * MARGE + (64 if gid == racines[0]['graphe'] else 0)
    HMAX = max(h for w, h in dims.values())
    rond = lambda v: not v.startswith('·') and not v.startswith('↑') and noeuds[v]['famille'] in NOMBRES

    # ports
    sorties, arrivees = defaultdict(list), defaultdict(list)
    for k, ch in enumerate(chaines):
        sorties[ch[0]].append(k); arrivees[ch[-1]].append(k)
    port_dep, port_arr = {}, {}
    def repartir(v, ks, cle):
        ks = sorted(ks, key=cle)
        w = dims[v][0]
        utile = max(0.0, w / 2 - (14 if rond(v) else 22))
        ecart = min(14.0, 2 * utile / (len(ks) - 1)) if len(ks) > 1 else 0
        return {k: x[v] + (i - (len(ks) - 1) / 2) * ecart for i, k in enumerate(ks)}
    def caler(v, ports, voisin):
        """Glisse en bloc les ports de v (sans changer leur écart ni sortir de la bulle) pour aligner
        exactement sur la verticale voisine les flèches qui feraient sinon un crochet de quelques pixels."""
        if not ports: return ports
        utile = max(0.0, dims[v][0] / 2 - (14 if rond(v) else 22))
        lo = x[v] - utile - min(ports.values()); hi = x[v] + utile - max(ports.values())
        def crochets(dl):
            return sum(1 for k, px in ports.items() if 0.5 < abs(voisin(k) - (px + dl)) < 16)
        cands = [0.0] + [voisin(k) - px for k, px in ports.items() if lo - 1e-9 <= voisin(k) - px <= hi + 1e-9]
        meilleur = min(cands, key=lambda dl: (crochets(dl), abs(dl)))
        return {k: px + meilleur for k, px in ports.items()}
    for v, ks in sorties.items():
        pd = repartir(v, ks, lambda k: (x[chaines[k][1]], x[chaines[k][-1]]))
        port_dep.update(caler(v, pd, lambda k: x[chaines[k][1]]))
    for v, ks in arrivees.items():
        pa = repartir(v, ks, lambda k: (x[chaines[k][-2]], x[chaines[k][0]]))
        port_arr.update(caler(v, pa, lambda k: x[chaines[k][-2]] if len(chaines[k]) > 2 else port_dep[k]))
    def abscisse(k, i):
        ch = chaines[k]
        if i == 0: return port_dep[k]
        if i == len(ch) - 1: return port_arr[k]
        return x[ch[i]]

    # pistes, couche par couche
    PISTE = 8
    piste, npistes = {}, {}
    for t in range(nmax):
        segs = []
        for k, ch in enumerate(chaines):
            for i in range(len(ch) - 1):
                if rang[ch[i]] == t:
                    x0, x1 = abscisse(k, i), abscisse(k, i + 1)
                    if abs(x1 - x0) >= 0.5: segs.append((k, i, x0, x1))
        def recouvre(s, u):
            m = 10
            return min(s[2], s[3]) - m < max(u[2], u[3]) and min(u[2], u[3]) - m < max(s[2], s[3])
        # « s au-dessus de u » quand l'ordre est conservé : vers la droite, celui de gauche ; vers la
        # gauche, celui de droite (sinon l'horizontale de l'un couperait la verticale de l'autre).
        def dessus(s, u):
            if not recouvre(s, u): return False
            ds, du = s[3] > s[2], u[3] > u[2]
            if ds != du: return False
            inverse = (s[2] - u[2]) * (s[3] - u[3]) < 0
            if inverse: return False
            return s[2] < u[2] if ds else s[2] > u[2]
        # ordre de traitement compatible : vers la droite par abscisse de départ croissante, vers la gauche
        # décroissante ; on alterne les deux familles, qui ne se contraignent pas entre elles.
        segs.sort(key=lambda s: (0, s[2]) if s[3] > s[2] else (1, -s[2]))
        attribue = {}
        for s in segs:
            mini = max([attribue[u] + 1 for u in attribue if dessus(u, s)], default=0)
            pris = {attribue[u] for u in attribue if recouvre(u, s)}
            p_ = mini
            while p_ in pris: p_ += 1
            attribue[s] = p_
        for s, p_ in attribue.items(): piste[(s[0], s[1])] = p_
        npistes[t] = max(attribue.values(), default=-1) + 1
    # ordonnées des couches : la bande entre t et t + 1 contient ses pistes
    # DEGAGE : marge sous la couche supérieure, avant la première piste, pour que le dernier segment
    # vertical d'une flèche soit plus long que sa pointe (6 px) et monte toujours vers la bulle.
    DEGAGE = 10
    bande = {t: max(ECART_Y - HMAX, (npistes[t] + 1) * PISTE + DEGAGE) for t in range(nmax)}
    ycouche = {nmax: MARGE + 10}
    for t in range(nmax - 1, -1, -1): ycouche[t] = ycouche[t + 1] + HMAX + bande[t]
    y = {v: ycouche[rang[v]] for v in rang}
    hauteur = ycouche[0] + MARGE + 10

    places = []
    for v in rang:
        if v.startswith('·'): continue
        w, h = dims[v]
        places.append({'id': v[1:] if v.startswith('↑') else v, 'entree': v.startswith('↑'),
                       'x': round(x[v], 1), 'y': round(y[v], 1), 'w': round(w, 1), 'h': h})
    def bord(v, px, haut):
        """Ordonnée du bord haut (ou bas) de la bulle v à l'abscisse px."""
        h = dims[v][1]
        if rond(v):
            r_ = h / 2; d_ = min(abs(px - x[v]), r_ - 1)
            e_ = (r_ * r_ - d_ * d_) ** 0.5
        else: e_ = h / 2
        return y[v] - e_ if haut else y[v] + e_
    aretes, morceaux = [], []
    for k, ch in enumerate(chaines):
        a, b = ch[0], ch[-1]
        cx, cy = port_dep[k], bord(a, port_dep[k], True) - (7 if a.startswith('↑') else 0)   # au-dessus de « niveau supérieur »
        d = f'M{cx:.1f},{cy:.1f}'; poly = [(cx, cy)]
        dernier_y = cy                     # ordonnée d'où part le dernier segment vertical
        for i in range(len(ch) - 1):
            t = rang[ch[i]]
            x0, x1 = abscisse(k, i), abscisse(k, i + 1)
            if (k, i) in piste:
                haut_bande = ycouche[t + 1] + HMAX / 2 + DEGAGE
                pas = (bande[t] - DEGAGE) / (npistes[t] + 1)
                yk = haut_bande + (piste[(k, i)] + 1) * pas
                s_ = 1 if x1 > x0 else -1
                rc = min(8.0, abs(x1 - x0) / 2, pas * 0.9)
                d += f' L{x0:.1f},{yk + rc:.1f} Q{x0:.1f},{yk:.1f} {x0 + s_ * rc:.1f},{yk:.1f}'
                d += f' L{x1 - s_ * rc:.1f},{yk:.1f} Q{x1:.1f},{yk:.1f} {x1:.1f},{yk - rc:.1f}'
                poly += [(x0, yk), (x1, yk)]
                dernier_y = yk - rc
        fx = port_arr[k]; fy = bord(b, fx, False) + 6
        if dernier_y - fy < 3:
            erreur(f"[{gid}] la flèche {a}->{b} arrive par un segment trop court ({dernier_y - fy:.1f} px) : sa pointe serait mal orientée")
        d += f' L{fx:.1f},{fy:.1f}'; poly.append((fx, fy))
        for p0, p1 in zip(poly, poly[1:]): morceaux.append((a, b, 'L', p0, p1))
        aretes.append({'de': a[1:] if a.startswith('↑') else a, 'vers': b,
                       'entree': a.startswith('↑'), 'd': d})
    # vérification : aucun tracé ne traverse un nœud autre que ses extrémités
    for m in morceaux:
        a, b, typ, pts_ = m[0], m[1], m[2], m[3:]
        for i in range(0, 61):
            t = i / 60
            if typ == 'L':
                (x0, y0), (x1, y1) = pts_
                px, py = x0 + t * (x1 - x0), y0 + t * (y1 - y0)
            else:
                (x0, y0), (c1x, c1y), (c2x, c2y), (x1, y1) = pts_
                u = 1 - t
                px = u**3 * x0 + 3 * u**2 * t * c1x + 3 * u * t**2 * c2x + t**3 * x1
                py = u**3 * y0 + 3 * u**2 * t * c1y + 3 * u * t**2 * c2y + t**3 * y1
            for v in rang:
                if v in (a, b) or v.startswith('·'): continue
                w, h = dims[v]
                if abs(px - x[v]) < w / 2 + 4 and abs(py - y[v]) < h / 2 + 4:
                    msg = f"[{gid}] l'arête {a}->{b} traverse {v}"
                    if msg not in erreurs: erreur(msg)
                    break
    rangs = []
    if gid == racines[0]['graphe']:
        rangs = [{'rang': t, 'y': ycouche[t]} for t in range(nmax + 1)]
    return {'largeur': round(largeur), 'hauteur': round(hauteur), 'noeuds': places,
            'aretes': aretes, 'rangs': rangs, 'croisements': score}

sortie = {'racine': racines[0]['graphe'], 'graphes': {}, 'noeuds': {}, 'lexique': {}}
for g in graphes:
    lay = disposer(g['graphe'])
    sortie['graphes'][g['graphe']] = {'id': g['graphe'], 'titre': g['titre'],
        'conteneur': g['conteneur'], 'parent': g.get('parent'), **lay}
    print(f"[{g['graphe']}] {len(g['noeuds'])} nœuds, {lay['largeur']}×{lay['hauteur']} px, "
          f"{lay['croisements']} croisement(s)")
if erreurs:
    print("ERREURS :"); [print("  -", e) for e in erreurs]; sys.exit(1)

for gid, d in D.items():
    g = G[gid]
    for n in g['noeuds']:
        v = n['id']
        amont = [e for e, cs in g['entrees'].items() if v in cs]
        sortie['noeuds'][v] = {k: n.get(k) for k in
            ['id', 'graphe', 'etiquette', 'titre', 'nature', 'famille', 'numero', 'rang',
             'texte', 'enonce', 'preuve', 'choix', 'remarques', 'sous', 'documents']}
        # documents à télécharger (fiche) : le fichier doit exister dans documents/
        for doc in n.get('documents') or []:
            if not os.path.exists(doc.get('fichier', '')):
                erreur(f"[{gid}] {v} : document introuvable {doc.get('fichier')}")
        sortie['noeuds'][v].update(parents=list(d.predecessors(v)), enfants=list(d.successors(v)),
                                   amont=amont, admis=bool(n.get('_signe')))
for t, e in lex.items():
    sortie['lexique'][t] = {'id': t, 'terme': e['terme'], 'definition': e['definition'],
                            'emplois': sorted(emplois[t]), 'defini': e['defini_dans'],
                            'voir': e.get('voir', []), 'notation': e.get('notation')}
# Inventaire des admis et des fiches ⋆ (page « État de l'édifice ») : il reste dans la page même quand
# les textes des branches sont chargés à la demande. Trié par rang de la théorie racine, puis dans l'ordre
# des fichiers de contenu.
def theorie_racine(v):
    n = noeuds[v]
    while n['graphe'] != racines[0]['graphe']: n = noeuds[G[n['graphe']]['conteneur']]
    return n['id']
rang_fichier = {n['id']: k for k, n in enumerate(n_ for g in graphes for n_ in g['noeuds'])}
def situe(v):
    return {'id': v, 'theorie': theorie_racine(v)}
cle_inv = lambda e: (noeuds[e['theorie']]['rang'], rang_fichier[e['theorie']], rang_fichier[e['id']])
sortie['admis'] = {
    'entrees': sorted(({**situe(n['id']), 'lieu': a['lieu'], 'statut': a['statut'], 'objet': a['objet'],
                        'renvoi': a.get('renvoi'), 'signe': any(a is b for b in n['_signe']),
                        # démonstrations d'origine (aval, ailleurs) d'une citation retenue pour le signe †
                        'demo': sorted({b['renvoi'] for a_, os_ in n['_signe_brut'] if a_ is a for b in os_
                                        if b.get('statut') in ('aval', 'ailleurs') and b is not a})}
                       for n in noeuds.values() for a in n.get('admis') or []),
                      key=cle_inv),
    'choix': sorted((situe(n['id']) for n in noeuds.values() if n.get('choix')), key=cle_inv)}

# ------------------------------------------------------------------ rubriques (cours, exercices…)
# Fichiers rubriques/*.yaml : chaque rubrique est passée telle quelle à la page ; on vérifie
# seulement que les renvois vers l'atlas (nœuds, termes) et entre rubriques existent.
rubriques = {}
for f in sorted(glob.glob('rubriques/*.yaml')):
    rubriques[os.path.basename(f)[:-5]] = yaml.safe_load(open(f, encoding='utf-8')) or {}
def verifie_rubrique(nom, objet, ou):
    if isinstance(objet, dict):
        for cle, v in objet.items():
            if cle in ('theories', 'noeuds'):
                for t in v or []:
                    if t not in noeuds: erreur(f"rubriques/{nom} {ou} : nœud inconnu {t}")
            elif cle == 'notions':
                for t in v or []:
                    if t not in lex: erreur(f"rubriques/{nom} {ou} : terme inconnu {t}")
            else:
                verifie_rubrique(nom, v, f"{ou}/{objet.get('id', cle)}")
    elif isinstance(objet, list):
        for x in objet: verifie_rubrique(nom, x, ou)
    elif isinstance(objet, str):
        verifie_refs(objet, f"rubriques/{nom} {ou}")
# Les exercices d'une feuille peuvent être rangés dans rubriques/exercices/<feuille>.yaml (une liste).
# L'index du moteur des annales est rangé par session dans rubriques/annales-index/AAAA.yaml.
if 'annales-index' in rubriques:
    AI = rubriques['annales-index']; AI['sujets'] = AI.get('sujets') or []
    for f in sorted(glob.glob('rubriques/annales-index/*.yaml')):
        AI['sujets'] += yaml.safe_load(open(f, encoding='utf-8')) or []
    urls = [x['sujet'] for x in AI['sujets']]
    for u in set(x for x in urls if urls.count(x) > 1): erreur(f"rubriques/annales-index : sujet en double {u}")
if 'exercices' in rubriques:
    E = rubriques['exercices']; E.setdefault('exercices', [])
    for f in sorted(glob.glob('rubriques/exercices/*.yaml')):
        E['exercices'] += yaml.safe_load(open(f, encoding='utf-8')) or []
    ids = [e['id'] for e in E['exercices']]
    for i in set(x for x in ids if ids.count(x) > 1): erreur(f"rubriques/exercices : id en double {i}")
    for fe in E.get('feuilles', []):
        les = [e for e in E['exercices'] if e['feuille'] == fe['id']]
        if les:
            fe['nombre'] = len(les)
            fe['etoiles'] = [sum(1 for e in les if e['etoiles'] == k) for k in (1, 2, 3, 4)]
            fe['parties'] = list(dict.fromkeys(e['partie'] for e in les))
        for champ in ('pdf_enonce', 'pdf_corrige'):
            if fe.get(champ) and not os.path.isfile(fe[champ]):
                erreur(f"rubriques/exercices {fe['id']} : fichier introuvable {fe[champ]}")
    for e in E['exercices']:
        e['mots_cles'] = [m.strip().lower() if m.strip() != 'Python' else m for m in e.get('mots_cles', [])]
for nom, r in rubriques.items(): verifie_rubrique(nom, r, '')
if 'exercices' in rubriques and 'cours' in rubriques:
    ids_cours = {c['id'] for c in rubriques['cours'].get('cours', [])}
    ids_feuilles = {f['id'] for f in rubriques['exercices'].get('feuilles', [])}
    for c in rubriques['cours'].get('cours', []):
        if c.get('exercices') and c['exercices'] not in ids_feuilles:
            erreur(f"rubriques/cours {c['id']} : feuille inconnue {c['exercices']}")
    for fe in rubriques['exercices'].get('feuilles', []):
        if fe.get('cours') and fe['cours'] not in ids_cours:
            erreur(f"rubriques/exercices {fe['id']} : cours inconnu {fe['cours']}")
    for e in rubriques['exercices'].get('exercices', []):
        if e['feuille'] not in ids_feuilles:
            erreur(f"rubriques/exercices {e['id']} : feuille inconnue {e['feuille']}")
for c in rubriques.get('cours', {}).get('cours', []):
    for champ in ('pdf', 'tex'):
        if c.get(champ) and not os.path.isfile(c[champ]):
            erreur(f"rubriques/cours {c['id']} : fichier introuvable {c[champ]}")
# Cours : identifiants uniques, niveau déclaré, chapitres liés existants, numéros distincts par niveau.
if 'cours' in rubriques:
    Cr = rubriques['cours']
    ids_c = [c['id'] for c in Cr.get('cours', [])]
    for i in sorted(set(x for x in ids_c if ids_c.count(x) > 1)): erreur(f"rubriques/cours : id en double {i}")
    ids_niv = {n['id'] for n in Cr.get('niveaux', [])}
    vus = set()
    for c in Cr.get('cours', []):
        if c.get('niveau') not in ids_niv: erreur(f"rubriques/cours {c['id']} : niveau inconnu {c.get('niveau')}")
        for l in c.get('liens') or []:
            if l not in ids_c or l == c['id']: erreur(f"rubriques/cours {c['id']} : lien invalide {l}")
        if c.get('chapitre'):
            if (c['niveau'], c['chapitre']) in vus: erreur(f"rubriques/cours {c['id']} : chapitre {c['chapitre']} déjà pris au niveau {c['niveau']}")
            vus.add((c['niveau'], c['chapitre']))
# Nouveautés (domaine À propos – Contact) : forme des entrées, et filet de sécurité contre les ajouts
# non annoncés. Est « annonçable » : une théorie de l'édifice, un cours ou une feuille déposés, une session
# d'annales. Un tel élément doit figurer dans le socle (rubriques/nouveautes/socle.yaml : ce qui était en
# ligne à l'ouverture de la rubrique), ou être couvert par une entrée (champ couvre, ou un de ses liens).
# Un oubli n'est qu'un avertissement ; une correction ne crée aucun identifiant, donc ne déclenche rien.
if 'nouveautes' in rubriques:
    NV = rubriques['nouveautes']; NV.setdefault('entrees', [])
    RUBS = {'edifice', 'cours', 'exercices', 'annales', 'site'}
    cours_ids = {c['id'] for c in rubriques.get('cours', {}).get('cours', [])}
    feuil_ids = {f['id'] for f in rubriques.get('exercices', {}).get('feuilles', [])}
    racine_ids = {n['id'] for n in yaml.safe_load(open('contenu/edifice.yaml', encoding='utf-8'))['noeuds']}
    couverts, prec = set(), '9999'
    for k, e in enumerate(NV['entrees']):
        ou = f"rubriques/nouveautes entrée {k + 1} ({e.get('titre', '?')})"
        d = str(e.get('date', ''))
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', d): erreur(f"{ou} : date absente ou mal écrite (\"AAAA-MM-JJ\", entre guillemets)")
        elif d > prec: erreur(f"{ou} : les entrées vont de la plus récente à la plus ancienne")
        else: prec = d
        if e.get('rubrique') not in RUBS: erreur(f"{ou} : rubrique inconnue {e.get('rubrique')}")
        if not e.get('titre') or not e.get('texte'): erreur(f"{ou} : titre et texte sont obligatoires")
        couverts.update(e.get('couvre') or [])
        for l in e.get('liens') or []:
            a = str(l.get('ancre', '')); m = a.split('/')
            if not l.get('nom'): erreur(f"{ou} : lien sans nom ({a})")
            if a in ('accueil', 'edifice', 'edifice/etat', 'cours', 'exercices', 'annales', 'nouveautes', 'a-propos'): pass
            elif m[0] == 'cours' and len(m) == 2:
                if m[1] not in cours_ids: erreur(f"{ou} : cours inconnu {m[1]}")
                couverts.add(m[1])
            elif m[:2] == ['exercices', 'feuille'] and len(m) == 3:
                if m[2] not in feuil_ids: erreur(f"{ou} : feuille inconnue {m[2]}")
                couverts.add(m[2])
            elif m[0] in ('exercices', 'annales'): pass
            elif a.split('.')[0] in G or a in noeuds:
                couverts.add(a.split('.')[-1])
            else: erreur(f"{ou} : ancre inconnue {a}")
    socle_f = 'rubriques/nouveautes/socle.yaml'
    socle = set((yaml.safe_load(open(socle_f, encoding='utf-8')) or {}).get('ids') or []) if os.path.isfile(socle_f) else set()
    annoncables = set(racine_ids)
    annoncables |= {c['id'] for c in rubriques.get('cours', {}).get('cours', []) if c.get('statut') == 'depose'}
    annoncables |= {f['id'] for f in rubriques.get('exercices', {}).get('feuilles', []) if f.get('statut') == 'depose'}
    annoncables |= {f"annales-{x['annee']}" for x in rubriques.get('annales', {}).get('sujets', []) if x.get('annee')}
    oublis = sorted(annoncables - socle - couverts)
    if oublis: avert(f"nouveautés non annoncées (rubriques/nouveautes.yaml, champ couvre) : {', '.join(oublis)}")
if erreurs:
    print("ERREURS :"); [print("  -", e) for e in erreurs]; sys.exit(1)
sortie['rubriques'] = rubriques

import os; os.makedirs('construction', exist_ok=True)
json.dump(sortie, open('construction/donnees.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for a in avertissements: print("avertissement :", a)
print(f"OK : {len(noeuds)} nœuds, {len(lex)} termes, {len(G)} graphes.")

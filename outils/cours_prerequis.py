# Proposition des chapitres « À revoir avant » de chaque cours (domaine À propos – apparence, 9 nov. 2026 ;
# MEMO_atlas_apropos.md §61). Écrit rubriques/cours-prerequis.yaml, que la conversation Cours relit et corrige à la
# main ensuite : ce script ne sert qu'à la proposition initiale et ne l'écrase pas sans --forcer.
#
# Règles (choix de l'auteur et choix pédagogiques) :
# - seulement le niveau scolaire juste en dessous : Seconde pour la Première ; Première pour la Terminale, les Maths
#   expertes et les Maths approfondies ; Terminale, Maths expertes et Maths approfondies pour la Maths Sup ; Maths Sup
#   pour le Master. Jamais le même niveau, jamais un niveau supérieur. La Seconde n'a pas de renvoi.
# - un chapitre A est proposé pour B si une théorie propre à A (fiche intérieure de l'édifice, pas une théorie
#   entière) est égale à une théorie de B ou est l'un de ses ancêtres dans l'édifice ;
# - les fiches très générales (citées par plus du quart des chapitres : nombres réels, ensembles…) ne comptent pas,
#   sinon un chapitre comme « Équations » de Seconde serait proposé presque partout ;
# - les candidats sont classés par force du lien (fiches rares pesant plus), et on garde les trois premiers.
import json, math, os, sys, yaml
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, 'rubriques', 'cours-prerequis.yaml')
PRECEDENT = {'premiere': ['seconde'], 'terminale': ['premiere'], 'expertes': ['premiere'], 'approfondies': ['premiere'],
             'ma': ['terminale', 'expertes', 'approfondies'], 'mp': ['ma'], 'master': ['ma', 'mp']}
if os.path.exists(SORTIE) and '--forcer' not in sys.argv:
    sys.exit('rubriques/cours-prerequis.yaml existe déjà (corrigé à la main) : relancer avec --forcer pour l\'écraser')
d = json.load(open(os.path.join(RACINE, 'construction', 'donnees.json'), encoding='utf-8'))
N, racine = d['noeuds'], d['racine']
cours = [c for c in d['rubriques']['cours']['cours'] if c.get('statut') == 'depose']
def ancetres(i, vus=None):
    vus = set() if vus is None else vus
    for p in N.get(i, {}).get('parents', []):
        if p not in vus:
            vus.add(p); ancetres(p, vus)
    return vus
T = {c['id']: {t for t in c.get('theories', []) if t in N and N[t]['graphe'] != racine} for c in cours}
A = {c['id']: set().union(T[c['id']], *[ancetres(t) for t in T[c['id']]]) for c in cours}
freq = {}
for c in cours:
    for t in A[c['id']]: freq[t] = freq.get(t, 0) + 1
generique = {t for t, k in freq.items() if k > len(cours) / 4}
prop = {}
for c in cours:
    cand = []
    for x in cours:
        if x['niveau'] not in PRECEDENT.get(c['niveau'], []): continue
        commun = (T[x['id']] - generique) & A[c['id']]
        if not commun: continue
        cand.append((sum(1 / math.log(1 + freq[t]) for t in commun), x))
    cand.sort(key=lambda s: -s[0])
    if cand: prop[c['id']] = [x['id'] for _, x in cand[:3]]
entete = ('# Chapitres à revoir avant chaque cours (carte « À revoir avant » de la page du chapitre).\n'
          '# Clé : identifiant du chapitre ; valeur : jusqu\'à trois chapitres du niveau scolaire juste en dessous.\n'
          '# Proposition calculée le 9 nov. 2026 (outils/cours_prerequis.py), à corriger à la main : ce fichier fait foi.\n'
          '# Domaine de la conversation Cours.\n')
with open(SORTIE, 'w', encoding='utf-8') as f:
    f.write(entete + yaml.safe_dump({'a_revoir': prop}, allow_unicode=True, sort_keys=False, default_flow_style=None, width=200))
print(f'{len(prop)} chapitres avec des renvois, {sum(map(len, prop.values()))} renvois')

# Contrôle des liens externes des annales (domaine À propos – apparence, MEMO_atlas_apropos.md §58).
#
# Lit rubriques/annales.yaml, essaie chaque adresse http(s) de sujet, de rapport ou de source (requête HEAD, puis GET
# des premiers octets si le serveur refuse HEAD), et écrit un rapport Markdown des liens qui ne répondent pas (code
# 4xx ou 5xx, délai dépassé, nom inconnu). Un lien n'est déclaré cassé qu'après deux échecs espacés, pour ne pas
# signaler un serveur momentanément lent. Lancé chaque lundi par .github/workflows/liens.yml, qui ouvre ou met à jour
# un ticket « Liens cassés des annales » sur le dépôt (GitHub en prévient l'auteur par courriel).
# Usage : python3 outils/verifier_liens.py rapport.md      (code de sortie 0 dans tous les cas)
import concurrent.futures, os, sys, time, urllib.error, urllib.request
import yaml

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENT = 'Mozilla/5.0 (compatible; ATLAS-liens/1.0; +https://www.atlasjourdain.fr/)'


def adresses():
    d = yaml.safe_load(open(os.path.join(RACINE, 'rubriques', 'annales.yaml'), encoding='utf-8'))
    vus = {}
    for s in d.get('sujets', []):
        lieu = f"{s.get('concours', '')} {s.get('filiere', '') or ''} {s.get('annee', '')} {s.get('epreuve', '')}".replace('  ', ' ').strip()
        for cle in ('sujet', 'rapport'):
            u = s.get(cle)
            if isinstance(u, str) and u.startswith('http'):
                vus.setdefault(u, []).append(f'{lieu} ({cle})')
        src = s.get('source') or {}
        if isinstance(src, dict) and str(src.get('url', '')).startswith('http'):
            vus.setdefault(src['url'], []).append(f'{lieu} (source)')
    return vus


def essai(u):
    for methode in ('HEAD', 'GET'):
        req = urllib.request.Request(u, method=methode, headers={'User-Agent': AGENT, 'Range': 'bytes=0-1023'})
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                return r.status, ''
        except urllib.error.HTTPError as e:
            if methode == 'HEAD' and e.code in (403, 405, 400, 501):
                continue
            return e.code, e.reason
        except Exception as e:  # délai, nom inconnu, connexion refusée
            if methode == 'HEAD':
                continue
            return 0, type(e).__name__ + ' : ' + str(e)[:120]
    return 0, 'sans réponse'


def verifier(u):
    code, motif = essai(u)
    if code and code < 400:
        return u, code, ''
    time.sleep(20)
    code, motif = essai(u)
    return u, code, ('' if code and code < 400 else motif or str(code))


def main():
    sortie = sys.argv[1] if len(sys.argv) > 1 else 'rapport-liens.md'
    A = adresses()
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        res = list(ex.map(verifier, A))
    # Connexion refusée sans code HTTP sur un site qui répond par ailleurs : limitation du nombre de requêtes (cas de
    # devenirenseignant.gouv.fr). Ces liens sont réessayés un par un, à 8 s d'intervalle.
    for i, (u, c, m) in enumerate(res):
        if m and not c:
            time.sleep(8)
            c2, m2 = essai(u)
            if c2 and c2 < 400: res[i] = (u, c2, '')
    echecs = [(u, c, m) for u, c, m in res if m]
    # Un site dont aucune adresse ne répond, sans même un code HTTP (connexion refusée, délai), refuse en général les
    # serveurs de GitHub (cas de devenirenseignant.gouv.fr) : ses liens sont signalés à part, comme non vérifiés.
    dom = lambda u: u.split('/')[2]
    par_dom = {}
    for u, c, m in res: par_dom.setdefault(dom(u), []).append((c, m))
    injoignables = {d for d, l in par_dom.items() if all(m and not c for c, m in l)}
    # Sans code HTTP (refus, délai) sur un site qui répond par ailleurs : limitation des requêtes, pas un lien cassé.
    # Seuls les vrais codes d'erreur (404, 410, 500…) comptent ; les autres sont listés à part, à revoir s'ils durent.
    casses = [x for x in echecs if dom(x[0]) not in injoignables and x[1]]
    douteux = [x for x in echecs if dom(x[0]) not in injoignables and not x[1]]
    l = [f'Contrôle du {time.strftime("%d/%m/%Y")} : {len(A)} adresses des annales, {len(casses)} lien(s) cassé(s) '
         f'après deux essais.', '']
    if injoignables:
        n_inj = sum(len(par_dom[d]) for d in injoignables)
        l += [f"Non vérifiés : {n_inj} lien(s) de {', '.join(sorted(injoignables))}, site qui refuse les connexions des "
              "serveurs de GitHub (il faut les vérifier à la main, depuis un navigateur).", '']
    if douteux:
        l += [f"À revoir s'ils reviennent : {len(douteux)} lien(s) sans réponse (refus ou délai) sur des sites qui répondent "
              f"par ailleurs, sans doute une limitation des requêtes : " + ', '.join(sorted({dom(u) for u, _, _ in douteux})) + '.', '']
    if casses:
        l += ['| Sujet | Lien | Erreur |', '|---|---|---|']
        for u, c, m in sorted(casses, key=lambda x: A[x[0]][0]):
            l.append(f"| {'<br>'.join(A[u][:3])} | {u} | {('HTTP ' + str(c) + ' ') if c else ''}{m.replace('|', '/')} |")
        l += ['', 'Les corrections relèvent de la conversation Annales (rubriques/annales.yaml).']
    open(sortie, 'w', encoding='utf-8').write('\n'.join(l) + '\n')
    print(l[0])
    with open(os.environ.get('GITHUB_OUTPUT', os.devnull), 'a') as g:
        g.write(f'casses={len(casses)}\n')


if __name__ == '__main__':
    main()

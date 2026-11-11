# Signale à IndexNow (Bing, Yandex, Seznam, Naver…) les adresses nouvelles ou modifiées par une publication
# (domaine À propos – apparence, MEMO_atlas_apropos.md §68). Lancé par le job ovh de .github/workflows/publier.yml,
# une fois le site en ligne. La liste vient de rendu.mjs (site/indexnow-a-signaler.json) ; la clé, publique par
# nature, est dans identite/indexnow-cle.txt et publiée à la racine du site (<clé>.txt). Google n'utilise pas IndexNow.
# Usage : python3 outils/indexnow.py site/indexnow-a-signaler.json [--tout]   (code de sortie 0 dans tous les cas)
#   --tout : toutes les adresses de site/sitemap.xml (lancement à la main de publier.yml, case « indexnow_tout »)
import json, os, re, sys, urllib.request

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOTE = 'www.atlasjourdain.fr'


def main():
    args = [a for a in sys.argv[1:] if a != '--tout']
    f = args[0] if args else os.path.join(RACINE, 'site', 'indexnow-a-signaler.json')
    if '--tout' in sys.argv:
        urls = re.findall(r'<loc>([^<]+)</loc>', open(os.path.join(os.path.dirname(f), 'sitemap.xml'), encoding='utf-8').read())
        urls = [u.replace('&amp;', '&') for u in urls]
    elif not os.path.exists(f):
        print('IndexNow : rien à signaler'); return
    else:
        urls = json.load(open(f, encoding='utf-8'))
    cle = open(os.path.join(RACINE, 'identite', 'indexnow-cle.txt'), encoding='utf-8').read().strip()
    for i in range(0, len(urls), 10000):
        corps = json.dumps({'host': HOTE, 'key': cle, 'keyLocation': f'https://{HOTE}/{cle}.txt', 'urlList': urls[i:i + 10000]}).encode()
        req = urllib.request.Request('https://api.indexnow.org/indexnow', data=corps, method='POST',
                                     headers={'Content-Type': 'application/json; charset=utf-8'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                print(f'IndexNow : {len(urls[i:i + 10000])} adresse(s) signalée(s), réponse {r.status}')
        except Exception as e:  # 422, 429… : sans conséquence pour la publication
            print(f'IndexNow : échec ({e})')


if __name__ == '__main__':
    main()

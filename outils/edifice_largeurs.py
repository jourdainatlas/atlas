"""Mesure, dans Chromium, les débordements horizontaux des fiches de l'édifice sur un téléphone.

Usage (après `sh construire.sh`) :
    python3 outils/edifice_largeurs.py               # toutes les fiches
    python3 outils/edifice_largeurs.py gf ac         # les fiches de ces graphes
    python3 outils/edifice_largeurs.py --largeur 360 # autre largeur d'écran (390 par défaut)

Sert le dossier site/ sur un port libre, ouvre chaque fiche (preuves dépliées), et signale tout display,
paragraphe, schéma ou tableau plus large que sa colonne. Un dépassement de 2 px au plus est ignoré : c'est la
cellule vide que KaTeX ajoute après un indice en fin de ligne, invisible à l'écran. Code de sortie 1 s'il
reste un débordement. Convention d'aération : MEMO_atlas_edifice.md, §34. Demande Playwright et Chromium.
"""
import asyncio, glob, http.server, json, os, socket, sys, threading
import yaml
from playwright.async_api import async_playwright

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOLERANCE = 2
JS = """(tol) => {
  const out = [];
  for (const e of document.querySelectorAll('.fiche .katex-display, .fiche figure.schema, .fiche p, .fiche table')) {
    if (e.offsetParent && e.scrollWidth > e.clientWidth + tol)
      out.push(`${e.scrollWidth} > ${e.clientWidth} px, ${e.classList.contains('katex-display') ? 'display' : e.tagName.toLowerCase()} : ${e.textContent.slice(0, 60)}`);
  }
  return out;
}"""


def fiches(graphes):
    ids = []
    for f in sorted(glob.glob(os.path.join(RACINE, 'contenu', '*.yaml'))):
        g = os.path.basename(f)[:-5]
        if g in ('lexique', 'edifice') or (graphes and g not in graphes):
            continue
        for n in yaml.safe_load(open(f, encoding='utf-8'))['noeuds']:
            if not n.get('sous'):
                ids.append(f"{g}.{n['id']}")
    return ids


def serveur():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]
    gest_silencieux = type('G', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None})
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port),
                                          lambda *a, **k: gest_silencieux(*a, directory=os.path.join(RACINE, 'site'), **k))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, port


async def mesurer(ids, port, largeur):
    res = {}
    file = list(reversed(ids))
    async with async_playwright() as p:
        nav = await p.chromium.launch()

        async def ouvrier():
            pg = await nav.new_page(viewport={'width': largeur, 'height': 844})
            while file:
                h = file.pop()
                await pg.goto(f'http://127.0.0.1:{port}/#{h}')
                await pg.wait_for_timeout(500)
                await pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)")
                await pg.wait_for_timeout(150)
                r = await pg.evaluate(JS, TOLERANCE)
                if r:
                    res[h] = r
        await asyncio.gather(*[ouvrier() for _ in range(6)])
        await nav.close()
    return res


def main():
    args = sys.argv[1:]
    largeur = 390
    if '--largeur' in args:
        i = args.index('--largeur'); largeur = int(args[i + 1]); del args[i:i + 2]
    ids = fiches(set(args))
    if not os.path.exists(os.path.join(RACINE, 'site', 'index.html')):
        sys.exit('site/index.html absent : lancer d\'abord sh construire.sh')
    srv, port = serveur()
    try:
        res = asyncio.run(mesurer(ids, port, largeur))
    finally:
        srv.shutdown()
    for h in sorted(res):
        for ligne in res[h]:
            print(f'{h} : {ligne}')
    print(f'{len(ids)} fiches mesurées à {largeur} px, {len(res)} avec débordement', file=sys.stderr)
    sys.exit(1 if res else 0)


if __name__ == '__main__':
    main()

# Publication du site construit (site/) sur l'hébergement web OVHcloud, par SFTP (domaine À propos – apparence,
# MEMO_atlas_apropos.md §64).
#
# Lancé par .github/workflows/publier.yml après la construction, seulement si les secrets OVH_HOTE,
# OVH_UTILISATEUR et OVH_MOT_DE_PASSE sont enregistrés dans le dépôt. Le site est déposé dans le dossier
# OVH_DOSSIER (par défaut « atlas ») du compte FTP, déclaré comme dossier racine dans l'onglet Multisite.
#
# Envoi différentiel : le serveur garde la liste des empreintes SHA-256 des fichiers publiés (.manifeste-atlas.json).
# Seuls les fichiers nouveaux ou modifiés partent ; ceux qui ont disparu du site sont supprimés ; la liste n'est
# réécrite qu'à la fin, si bien qu'un envoi interrompu est simplement repris au suivant. Ordre d'envoi : les
# ressources d'abord, les pages HTML ensuite, index.html et sw.js en dernier, pour qu'une page en ligne ne désigne
# jamais un fichier pas encore arrivé. Les réglages du serveur Apache viennent de identite/htaccess-ovh.
#
# Usage : OVH_HOTE=… OVH_UTILISATEUR=… OVH_MOT_DE_PASSE=… python3 outils/publier_ovh.py site
#         (OVH_PORT, 22 par défaut ; OVH_DOSSIER, « atlas » par défaut)
import concurrent.futures, hashlib, json, os, posixpath, stat, sys, threading, time
import paramiko

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFESTE = '.manifeste-atlas.json'
FILS = 8


def connexion():
    hote, util, mdp = (os.environ[k].strip() for k in ('OVH_HOTE', 'OVH_UTILISATEUR', 'OVH_MOT_DE_PASSE'))
    t = paramiko.Transport((hote, int(os.environ.get('OVH_PORT') or 22)))
    t.start_client(timeout=30)
    try:
        t.auth_password(util, mdp)
    except paramiko.AuthenticationException:
        # certains serveurs n'acceptent le mot de passe que par la méthode « keyboard-interactive »
        t.auth_interactive(util, lambda titre, instr, invites: [mdp for _ in invites])
    return t, paramiko.SFTPClient.from_transport(t)


def empreinte(f):
    h = hashlib.sha256()
    with open(f, 'rb') as x:
        for b in iter(lambda: x.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def local(dossier):
    fichiers = {}
    for d, _, l in os.walk(dossier):
        for n in l:
            p = os.path.join(d, n)
            fichiers[os.path.relpath(p, dossier).replace(os.sep, '/')] = p
    fichiers['.htaccess'] = os.path.join(RACINE, 'identite', 'htaccess-ovh')
    for nom in ('CNAME', '.nojekyll'):      # propres à GitHub Pages
        fichiers.pop(nom, None)
    return fichiers


def rang(chemin):
    if chemin in ('index.html', 'sw.js'): return 3
    if chemin.endswith('.html'): return 2
    if chemin == '.htaccess': return 0
    return 1


def main():
    site = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RACINE, 'site')
    base = os.environ.get('OVH_DOSSIER') or 'atlas'
    t0 = time.time()
    F = local(site)
    E = {c: empreinte(p) for c, p in F.items()}
    t, sftp = connexion()
    print(f'Connecté à {os.environ["OVH_HOTE"]} (clé du serveur : {t.get_remote_server_key().get_name()} '
          f'{t.get_remote_server_key().get_fingerprint().hex()})')
    try:
        sftp.stat(base)
    except FileNotFoundError:
        sftp.mkdir(base)
    try:
        with sftp.open(posixpath.join(base, MANIFESTE)) as m:
            ancien = json.loads(m.read().decode('utf-8'))
    except (FileNotFoundError, IOError, ValueError):
        ancien = {}
    a_envoyer = sorted((c for c in F if ancien.get(c) != E[c]), key=lambda c: (rang(c), c))
    a_suppr = sorted(c for c in ancien if c not in F)
    taille = sum(os.path.getsize(F[c]) for c in a_envoyer)
    print(f'{len(F)} fichiers, {len(a_envoyer)} à envoyer ({taille / 1e6:.1f} Mo), {len(a_suppr)} à supprimer')

    # dossiers nécessaires, créés une fois
    dossiers = sorted({posixpath.dirname(c) for c in a_envoyer if '/' in c}, key=lambda d: d.count('/'))
    vus = set()
    for d in dossiers:
        parts = d.split('/')
        for i in range(1, len(parts) + 1):
            s = '/'.join(parts[:i])
            if s in vus: continue
            vus.add(s)
            try:
                sftp.stat(posixpath.join(base, s))
            except FileNotFoundError:
                sftp.mkdir(posixpath.join(base, s))

    # envoi en parallèle, rang par rang (ressources, puis pages, puis index.html et sw.js)
    local_fil = threading.local()
    clients = []

    def client():
        if not hasattr(local_fil, 's'):
            local_fil.t, local_fil.s = connexion()
            clients.append(local_fil.t)
        return local_fil.s

    def envoie(c):
        for essai in range(3):
            try:
                client().put(F[c], posixpath.join(base, c))
                return
            except Exception:
                if essai == 2: raise
                time.sleep(5)
                local_fil.__dict__.pop('s', None)

    # La liste du serveur est réécrite tous les 400 fichiers : un envoi interrompu (publication annulée, coupure)
    # reprend au suivant là où il s'était arrêté.
    publie = dict(ancien)

    def ecrire_liste():
        with sftp.open(posixpath.join(base, MANIFESTE + '.tmp'), 'w') as m:
            m.write(json.dumps(publie, sort_keys=True).encode('utf-8'))
        sftp.posix_rename(posixpath.join(base, MANIFESTE + '.tmp'), posixpath.join(base, MANIFESTE))

    fait = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=FILS) as ex:
        for r in range(4):
            lot = [c for c in a_envoyer if rang(c) == r]
            for i in range(0, len(lot), 400):
                morceau = lot[i:i + 400]
                list(ex.map(envoie, morceau))
                for c in morceau: publie[c] = E[c]
                fait += len(morceau)
                ecrire_liste()
                print(f'  {fait} / {len(a_envoyer)} ({time.time() - t0:.0f} s)', flush=True)
    for c in a_suppr:
        try:
            sftp.remove(posixpath.join(base, c))
        except FileNotFoundError:
            pass
        publie.pop(c, None)
    # dossiers devenus vides
    for d in sorted({posixpath.dirname(c) for c in a_suppr if '/' in c}, key=lambda d: -d.count('/')):
        try:
            if not sftp.listdir(posixpath.join(base, d)): sftp.rmdir(posixpath.join(base, d))
        except (FileNotFoundError, IOError):
            pass
    publie = dict(E)
    ecrire_liste()
    for x in clients: x.close()
    t.close()
    print(f'Publication OVH terminée en {time.time() - t0:.0f} s')


if __name__ == '__main__':
    main()

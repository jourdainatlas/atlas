// Rubrique « Activités » : ce que partagent toutes les activités (MEMO_atlas_activites.md).
// Chaque activité est un module de ce dossier, chargé à la demande par activitesMonter (gabarit.html) ;
// il exporte html (texte et cadres des figures) et monter(racine), qui lance les figures et rend
// la fonction qui les arrête.

// Les figures viennent de prototypes autonomes, dont le code est repris tel quel. Ce code s'abonne à la
// fenêtre (clavier, thème, redimensionnement) sans jamais se désabonner : dans un site à une seule page,
// il faut pouvoir tout défaire en quittant l'activité. bac() fournit donc des doublures de window,
// MutationObserver et ResizeObserver qui retiennent chaque abonnement, et demonter() qui les annule.
export function bac() {
  const defaire = [], vraie = globalThis.window;
  class MO extends vraie.MutationObserver { constructor(f) { super(f); defaire.push(() => this.disconnect()); } }
  class RO extends vraie.ResizeObserver { constructor(f) { super(f); defaire.push(() => this.disconnect()); } }
  const fenetre = {
    get devicePixelRatio() { return vraie.devicePixelRatio; },
    matchMedia(q) {
      const m = vraie.matchMedia(q);
      return { get matches() { return m.matches; },
        addEventListener(t, f) { m.addEventListener(t, f); defaire.push(() => m.removeEventListener(t, f)); } };
    },
    addEventListener(t, f, o) { vraie.addEventListener(t, f, o); defaire.push(() => vraie.removeEventListener(t, f, o)); },
    ResizeObserver: RO,
  };
  return { window: fenetre, MutationObserver: MO, ResizeObserver: RO, demonter: () => defaire.splice(0).forEach(f => f()) };
}

// Styles communs. Les figures (canvas) lisent leurs couleurs dans des variables de :root : elles sont
// branchées ici sur celles du site, si bien que le clair et le sombre suivent le bouton du site.
// Orange = ce qui varie (sécante, terme hors de la bande, point libre) ; vert = ce qui est acquis
// (tangente, bande, propriété vérifiée) ; bleu = les mesures. Le rouge du site reste réservé.
export const css = `
:root { --sheet: var(--surface); --ink: var(--encre); --ink-soft: var(--encre-3); --rule: var(--trame); --rule-strong: var(--filet);
  --sec: #ad5900; --tan: var(--c-ana); --mark: var(--c-nb); --free: #ad5900; --semi: var(--c-geo); --ok: var(--c-ana);
  --hl: #dbe9f8; --hl-ink: #0b3a63; --font-display: var(--f-ui); }
:root[data-theme="dark"] { --sec: var(--c-alg); --free: var(--c-alg); --hl: #1e3550; --hl-ink: #cfe4fb; }
.activites-act { font-family: var(--f-texte); font-size: 17.5px; line-height: 1.6; color: var(--encre); }
.activites-act *, .activites-act *::before { box-sizing: border-box; }
/* Le texte occupe toute la largeur de la page, comme les figures (demande de l'auteur, 11 nov. 2026 ; il était limité à 46rem). */
.activites-act .col { max-width: none; }
.activites-act .eyebrow { font-family: var(--f-ui); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--encre-3); margin: 0 0 6px; }
.activites-act h3 { font-family: var(--f-titre); font-weight: 600; font-size: clamp(26px, 4.4vw, 34px); line-height: 1.12; margin: 0 0 12px; text-wrap: balance; }
.activites-act .lede { font-size: 19px; line-height: 1.5; margin: 0; }
.activites-act section { margin-top: 44px; }
.activites-act h4 { font-family: var(--f-titre); font-weight: 600; font-size: 23px; line-height: 1.2; margin: 0 0 10px; text-wrap: balance; }
.activites-act h4 .n { font-family: var(--f-mono); font-size: 14px; font-weight: 500; color: var(--encre-3); margin-right: 10px; }
.activites-act p { margin: 0 0 12px; }
.activites-act a { color: inherit; text-underline-offset: 3px; text-decoration-color: var(--encre-3); }
.activites-act .fig { margin: 20px 0 24px; background: var(--surface); border: 1px solid var(--filet); border-radius: 8px; overflow: hidden; }
.activites-act .fig canvas { display: block; width: 100%; touch-action: pan-y; cursor: grab; }
.activites-act .fig canvas.draw { touch-action: none; cursor: crosshair; }
/* Aucune figure ne dépasse la hauteur de l'écran (11 nov. 2026) : une figure seule est limitée à 70 % de la fenêtre,
   et deux figures superposées qui se lisent ensemble (classe paire, ou repères ci-dessous) tiennent à deux dans la fenêtre.
   Le dessin s'adapte de lui-même : chaque figure lit la taille réelle de sa toile. */
.activites-act .fig canvas { max-height: 70vh; }
.activites-act .fig canvas.paire, .activites-act #cv3t, .activites-act #cv3b, .activites-act #cv4t, .activites-act #cv4b { aspect-ratio: auto !important; height: clamp(150px, 31vh, 330px); }
/* … et le cadre qui les contient est rétréci et centré, pour que ces figures basses ne soient pas étirées en largeur
   (courbes aplaties, variations illisibles) : largeur = 2,1 fois la hauteur d'une figure. */
.activites-act .fig:has(canvas.paire, #cv3t, #cv4t) { max-width: calc(clamp(150px, 31vh, 330px) * 2.1); margin-left: auto; margin-right: auto; }
.activites-act .split { display: grid; grid-template-columns: minmax(0, 1fr) 270px; }
.activites-act .split .side { border-left: 1px solid var(--filet); padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
@media (max-width: 820px) { .activites-act .split { grid-template-columns: 1fr; } .activites-act .split .side { border-left: 0; border-top: 1px solid var(--filet); } }
.activites-act .bar { display: flex; flex-wrap: wrap; gap: 8px 10px; align-items: center; padding: 12px 16px; border-top: 1px solid var(--filet); font-family: var(--f-ui); font-size: 14px; }
.activites-act .bar.top { border-top: 0; border-bottom: 1px solid var(--filet); }
.activites-act .bar label { display: flex; align-items: center; gap: 8px; color: var(--encre-2); }
.activites-act button, .activites-act .chip { font: 500 14px/1.3 var(--f-ui); color: var(--encre); background: var(--surface); border: 1px solid var(--encre-3); border-radius: 999px; padding: 5px 13px; cursor: pointer; }
.activites-act button:hover, .activites-act .chip:hover { background: var(--trame); }
.activites-act button.primary { background: var(--encre); border-color: var(--encre); color: var(--surface); }
.activites-act button.primary:hover { opacity: .88; background: var(--encre); }
.activites-act .chip[aria-pressed="true"] { background: var(--encre); border-color: var(--encre); color: var(--surface); }
.activites-act button:disabled { opacity: .4; cursor: default; }
.activites-act button:focus-visible, .activites-act .scrub:focus-visible, .activites-act input:focus-visible, .activites-act summary:focus-visible { outline: 2px solid var(--encre); outline-offset: 2px; }
.activites-act .chips { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.activites-act .chip { font-family: var(--f-mono); font-size: 13px; padding: 4px 11px; }
.activites-act input[type=range] { accent-color: var(--sec); width: min(320px, 60vw); }
.activites-act input[type=checkbox] { accent-color: var(--tan); width: 16px; height: 16px; }
.activites-act input[type=number] { font: 14px var(--f-mono); width: 92px; padding: 4px 8px; color: var(--encre); background: var(--surface); border: 1px solid var(--encre-3); border-radius: 6px; }
.activites-act .scrub { font-family: var(--f-mono); font-size: .86em; background: var(--hl); color: var(--hl-ink); padding: 1px 6px; border-radius: 4px; border-bottom: 2px dotted currentColor; cursor: ew-resize; touch-action: none; user-select: none; -webkit-user-select: none; white-space: nowrap; }
.activites-act .live { font-family: var(--f-mono); font-size: .86em; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
.activites-act .c-sec { color: var(--sec); } .activites-act .c-tan { color: var(--tan); } .activites-act .c-mark { color: var(--mark); }
.activites-act .readout { font-family: var(--f-mono); font-size: 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.activites-act .frac { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.25; }
.activites-act .frac > span:first-child { border-bottom: 1.5px solid currentColor; padding: 0 4px 1px; }
.activites-act .frac > span:last-child { padding: 1px 4px 0; }
.activites-act .readout b { color: var(--sec); font-size: 17px; }
.activites-act table { border-collapse: collapse; width: 100%; font-family: var(--f-mono); font-size: 13px; font-variant-numeric: tabular-nums; }
.activites-act th, .activites-act td { padding: 4px 6px; text-align: right; border-bottom: 1px solid var(--trame); }
.activites-act th { font-family: var(--f-ui); font-weight: 500; color: var(--encre-3); font-size: 12px; }
.activites-act th:first-child, .activites-act td:first-child { text-align: left; }
.activites-act tr.now td { background: var(--hl); color: var(--hl-ink); }
.activites-act .verdict { font: 14.5px/1.45 var(--f-ui); margin: 0; }
.activites-act .side h5 { font: 500 12px var(--f-ui); letter-spacing: .06em; text-transform: uppercase; color: var(--encre-3); margin: 0; }
.activites-act .cap { font: 12px var(--f-ui); color: var(--encre-3); padding: 6px 16px 0; display: flex; justify-content: space-between; gap: 12px; }
.activites-act .feedback { padding: 12px 16px; border-top: 1px solid var(--filet); font: 15px/1.45 var(--f-ui); min-height: 48px; }
.activites-act .feedback strong { color: var(--tan); } .activites-act .feedback strong.c-sec { color: var(--sec); }
.activites-act .def { font-size: 19px; line-height: 1.5; padding: 14px 18px; background: var(--surface); border: 1px solid var(--filet); border-left: 4px solid var(--rouge); border-radius: 0 8px 8px 0; }
.activites-act .def span, .activites-act .col p > span[class^="c-"] { font-weight: 600; }
/* Formules composées par le site (span.kx, span.kx.kxd) dans un encadré : graisse normale, défilement si trop larges. */
.activites-act .def .katex, .activites-act .def .katex span, .activites-act .def .katex-display, .activites-act .def span.kx { font-weight: 400; }
.activites-act div.def { overflow-x: auto; overflow-y: hidden; }
.activites-act div.def > p { margin: 0; }
.activites-act .def .katex-display { margin: .45em 0 .2em; overflow-x: auto; overflow-y: hidden; padding: 2px 0; }
@media (max-width: 560px) { .activites-act .def .katex-display { font-size: .7em; } }
.activites-act sub { font-size: .7em; }
.activites-act .suite { margin-top: 48px; padding-top: 18px; border-top: 1px solid var(--filet); font-size: 16px; color: var(--encre-2); }
.activites-act .suite h4 { font-size: 17px; color: var(--encre); margin-bottom: 6px; }
.activites-act .suite h4:not(:first-child) { margin-top: 18px; }
`;

# Onazi’s Import

Buildless website for Onazi’s Import in FCT Abuja. HTML, shared CSS and plain JavaScript; no package dependencies or build step. GitHub Pages serves the repository root at https://onazioj179-lab.github.io/OnaziImport/.

Use Node.js 20 or later:

```sh
npm run dev
npm run check
```

The preview runs at http://127.0.0.1:4173/OnaziImport/. Set `PORT` to change the preview port. Checks validate syntax, local links and fragments, page landmarks, duplicate IDs and font assets.

## Customer features

- Collection cards select a category in the enquiry form. The form prepares a WhatsApp link; visitors review and send messages in WhatsApp themselves. There is no checkout, payment processing, live stock system, account system or website form backend.
- The enquiry form has accessible quantity controls, inline validation, collection-specific hints and an optional details counter. A direct call/WhatsApp link remains available if JavaScript cannot initialise the form.
- The privacy notice stores only `onazi:privacy-choice` in browser local storage. Its choice is recognised for 180 days. Both choices leave optional tracking off; no analytics or advertising is installed. Footer settings reopen the notice. Browsing still works if storage or JavaScript is unavailable.
- Motion follows the system’s reduced-motion preference and can be paused with the button above the collection marquee. Offscreen reveals are progressive enhancements; content remains visible without JavaScript.
- Content stays visible while waiting for scroll animation. Media-query listeners support older Safari/browser APIs as well as current browsers.
- Responsive layouts cover narrow phones, landscape screens, tablets and wide desktops. The mobile menu and privacy notice scroll within the available screen height; navigation and footer controls have larger touch targets on smaller screens.
- Archivo and Inter are self-hosted Latin variable fonts. Their SIL Open Font Licenses are included under `assets/fonts/`.

## Content maintenance

Keep contact details, stock descriptions, hours, policy dates and policy text aligned with actual store practices. Prices, availability and delivery arrangements are confirmed directly with the store. The policy pages preserve applicable consumer rights and link to Nigeria’s NDPC and FCCPC; they do not claim regulatory certification. Revisit privacy wording and consent controls before adding external embeds, analytics, payments or new data collection.

Policies and the home page share `styles.css` and `site.js`. Update `sitemap.xml` when adding or removing public pages. The custom `404.html` uses the GitHub Pages project base path for its assets and navigation.

When releasing shared CSS or JavaScript changes, update their `?v=` suffix consistently across HTML pages so browsers fetch the matching files instead of using an earlier cached release.

# Onazi’s Import

Five ready-to-serve static HTML pages for Onazi’s Import in FCT Abuja. Each document includes its styles and optional JavaScript enhancements. There is no application server, framework, client routing or hydration, and no separate stylesheet/script request is needed to display the page. GitHub Pages serves the repository root at https://onazioj179-lab.github.io/OnaziImport/; `.nojekyll` makes it serve the committed static files directly.

Use Node.js 20 or later:

```sh
npm run dev
npm run sync
npm run check
```

The preview runs at http://127.0.0.1:4173/OnaziImport/. Set `PORT` to change the preview port. Add `?nojs=1` for a local-only preview with optional JavaScript removed. Checks validate inline asset synchronisation, the native form/menu, syntax, local links and fragments, page landmarks, duplicate IDs and font assets.

## Customer features

- Without JavaScript, the visible HTML enquiry form sends the written message to WhatsApp for review; its helper asks visitors to include the collection and quantity. The native mobile menu and FAQ disclosures also work without JavaScript. Direct call and WhatsApp links are always available.
- Optional JavaScript adds collection selection, quantity controls, validation, hints, character counts and a combined enquiry draft. The extra fields begin disabled so they cannot block the basic form if scripts are unavailable. There is no checkout, payment processing, live inventory, account system or website form backend.
- The privacy notice stores only `onazi:privacy-choice` in browser local storage. Its choice is recognised for 180 days. Both choices leave optional tracking off; no analytics or advertising is installed. Footer settings reopen the notice. Browsing still works if storage or JavaScript is unavailable.
- Motion follows the system’s reduced-motion preference and can be paused with the button above the collection marquee. Offscreen reveals are progressive enhancements; content remains visible without JavaScript.
- Content stays visible while waiting for scroll animation. Media-query listeners support older Safari/browser APIs as well as current browsers.
- Responsive layouts cover narrow phones, landscape screens, tablets and wide desktops. The mobile menu and privacy notice scroll within the available screen height; navigation and footer controls have larger touch targets on smaller screens.
- Archivo and Inter are self-hosted Latin variable fonts. Their SIL Open Font Licenses are included under `assets/fonts/`.

## Content maintenance

Keep contact details, stock descriptions, hours, policy dates and policy text aligned with actual store practices. Prices, availability and delivery arrangements are confirmed directly with the store. The policy pages preserve applicable consumer rights and link to Nigeria’s NDPC and FCCPC; they do not claim regulatory certification. Revisit privacy wording and consent controls before adding external embeds, analytics, payments or new data collection.

Edit `styles.css` and `site.js` as the shared sources, then run `npm run sync` to update their inline copies in the HTML before committing. The committed pages can be deployed directly; no build runs on a visitor’s device. Update `sitemap.xml` when adding or removing public pages. The custom `404.html` uses the GitHub Pages project base path for its font assets and navigation.

Inline styles and enhancements arrive with their matching HTML; visitors cannot receive a new document with an old cached external stylesheet or script. Fonts are optional, self-hosted, and use `font-display: swap` with system-font fallbacks.

Keep interface copy free of emoji and decorative Unicode arrows. Use clear text labels for links and buttons.

## Public access verification

The shared link is the public GitHub Pages address above. Visitors do not need an account or access to the store’s Wi-Fi. Local preview addresses are for development only and must not appear in published pages or browser assets.

After deploying, run the **Public website availability** workflow from the repository’s Actions tab. It checks the home page, policy pages, scripts, styles and fonts from a GitHub-hosted runner without authentication. This verifies access outside the developer’s local network; it does not guarantee that every mobile provider or network permits GitHub Pages traffic. If a specific connection fails, retain the exact browser error to distinguish DNS, filtering and connectivity problems.

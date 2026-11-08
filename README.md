# main_portfolio
Product Experience Design Portfolio

#I'm going to try and upload something tonight on May 6, 2026


## Prototype archive

- `repository.html`: responsive list/grid archive with category filters.
- `piece.html?id=1`: detail page with swipeable image sets, a vertical quick gallery, and browser-local comments.
- `repository.js`: sample piece data and interactions; replace sample categories and metadata when real content is ready.

Run `python3 -m http.server 8000` from this directory and open `http://localhost:8000/repository.html`.

Invite requests prepare an email draft. Comments are saved locally in the current browser, not published to a server. Photos come from `images/ecommerce/images`; responsive WebP copies and mini-map thumbnails live in `images/ecommerce/web`. Each archive tile has three photos; tapping a PDP image opens its full five-photo gallery. Swipe horizontally in tiles and vertically in the gallery, or use the bars, thumbnails, and arrow keys. Video and 3D assets have not been supplied.


The mobile PDP uses `pdp.css` and `pdp.js` for its fixed logo/breadcrumb header and bottom action panel. The panel compacts when the inline title enters the usable viewport; both Leave a Note states focus the existing note form. Add to Bag stores a prototype selection in browser-local storage (`keoneo-bag`). Titles, categories, and dimensions still use sample wireframe metadata.

## Single-item PDP preview

`piece.html?id=1` previews the revised Challace 1892 design through `pdp-preview.js` and `pdp-preview.css`. It uses the supplied five-slide Figma carousel, editorial content, FAQ cards, related objects, and a personalized signup sheet. Other piece IDs retain the original PDP. The archive keeps its original sample data. Signup validates an email and previews a confirmation in memory; it does not send, store, or subscribe the email. Existing comments and bag selections remain browser-local. Preview artwork is stored in `images/pdp-preview`.

# Sidama Civic Gazette

The site uses a civic-editorial visual language rather than a generic campaign landing page. Warm paper surfaces, Sidama green, harvest-gold accents, restrained clay-red notices, and serif headlines frame the region's public information without changing its identity or routes.

## Foundations

- **Canvas:** `--paper` (`#f5f6ef`) for the page and `--paper-light` (`#fffdf8`) for masthead and publication surfaces. The pale green cast keeps the uncoated-paper reference out of generic beige.
- **Color:** `--green` (`#174838`) and `--green-dark` (`#10382d`) for navigation, headings, and primary actions; `--gold` (`#bd8f3c`) and `--gold-light` (`#e8c778`) for emphasis; `--clay` (`#9e4638`) for sample-content notices.
- **Typography:** Roman Georgia headlines with harvest-gold emphasis; a system sans-serif stack with Noto Sans Ethiopic fallbacks for body copy and controls.
- **Spacing and rules:** generous section spacing, thin warm-gray dividers, and clear column alignment in place of repeated floating cards.

## Page patterns

- The masthead keeps the existing Sidama mark and name, official-state context, primary navigation, language selector, and contact route.
- The home page pairs the welcome headline and existing actions with a regional introduction, then places the service directory before the news index.
- Service listings use category, title, description, and a direct route as a readable directory row.
- News listings use category and publication date metadata, a linked headline, summary, and story route.
- Information pages use a numbered editorial sequence, regional context, and readable tables for administrative data.
- Contact and chatbot controls retain their existing behavior and visible success/error feedback.

## Responsive and accessible behavior

- Navigation becomes a keyboard-operable menu below 1120px; the content columns collapse at narrower widths.
- Service and zone directories reduce columns progressively, and population tables remain horizontally scrollable on small screens.
- A skip link, semantic landmarks, active-route `aria-current`, visible focus rings, reduced-motion handling, and touch-sized controls support keyboard and mobile use.
- English, Amharic, and Sidaamu Afoo remain available. Translation fallbacks are identified in the utility line.

## Content integrity

Starter services and news remain explicitly labeled as illustrative. API failures retain the latest available sample content and show a visible status message. Existing informational text and image assets remain in the routed pages; no new raster assets were introduced.

# Eduardo & Laura — Wedding Site

Single-page wedding website for **Eduardo & Laura**, wedding on **12 August 2026, 18h30**, Campo Grande/MS, Brazil.

Live at: **https://etorres1974.github.io/noivos/**

---

## Project Structure

```
noivos/
│
├── index.html                          ← MAIN SOURCE FILE — edit this directly
├── gifts.json                          ← Gift list data — edit to add/remove/change gifts
├── assets/
│   └── gifts/                          ← Gift images — drop files here and reference in gifts.json
│       └── netflix.png
│
├── Wireframes Eduardo e Laura.html     ← Original lo-fi wireframe deck (reference only)
├── Wireframes Eduardo e Laura.html.srcmap.json
├── deck_stage.js                       ← Runtime for the wireframe viewer (not used in prod)
│
├── design_handoff_wedding_site_eduardo_laura/
│   ├── README.md                       ← Full design spec & handoff document (key reference)
│   ├── Wireframes Eduardo e Laura.html ← Wireframe copy
│   ├── deck_stage.js
│   └── assets/
│       ├── couple_kiss.png             ← Couple photo used in hero section
│       ├── couple_rings.png            ← Rings photo (available, not yet used)
│       ├── monograph.jfif              ← Couple monogram/logo
│       ├── monograph.svg.svg           ← SVG version of monogram
│       └── monograph3x4.jpg            ← Monogram variant
│
├── reference/                          ← Archived reference files, safe to ignore
│   ├── project/
│   │   └── Wireframes Eduardo e Laura.html
│   └── wedding-site-me/
│       └── assets/                     ← Cached CSS/HTML from an unrelated site
│
└── CLAUDE.md                           ← AI assistant context & session handoff guide
```

---

## The Main File

**`index.html`** is a fully self-contained single-page application. No build step, no framework, no npm. Pure HTML + CSS + vanilla JS in one file. It is also the GitHub Pages entry point.

**Edit `index.html` directly and commit it.**

```bash
git add index.html
git commit -m "your message"
git push origin dev-genspark
```

---

## Editing the Gift List

The gift list is driven by **`gifts.json`** at the repo root — no HTML or JS changes needed.

Each item has these fields:

```json
{
  "id":    "g10",
  "cat":   "Entretenimento",
  "name":  "Netflix do Casal",
  "desc":  "Um ano de Netflix para maratonar juntos no sofá.",
  "price": 296,
  "image": "assets/gifts/netflix.png"
}
```

### To add a new gift
1. Drop an image into `assets/gifts/` (jpg, png or webp — square crops look best)
2. Add a new entry to `gifts.json` with a unique `id` and set `"image"` to the file path
3. Commit both files — no HTML or JS changes needed

- **Remove** an item → delete its object from the array
- **Change** details → edit the relevant fields inline

> The `id` field is used by `localStorage` to remember which gifts have been marked as given — never reuse an ID once it has been live. If an image is missing, the card shows the first letter of the gift name as a fallback.

---

## Page Sections

| Section ID   | Description                                      |
|--------------|--------------------------------------------------|
| `#top`       | Hero — names, date, location, couple photo       |
| (no id)      | Countdown — live timer to wedding datetime       |
| `#evento`    | Event details — date, times, address, map embed  |
| `#dresscode` | Dress code — attire guide + colour palette       |
| `#rsvp`      | RSVP form — name, attendance, companions, notes  |
| `#presentes` | Gift list — 9 items with Pix modal               |

---

## Tech Stack

| Concern       | Solution                                                |
|---------------|---------------------------------------------------------|
| Fonts         | Google Fonts: Cormorant Garamond, Inter, JetBrains Mono |
| Styling       | Vanilla CSS custom properties (design tokens in `:root`)|
| Interactivity | Vanilla JS — no libraries                               |
| RSVP storage  | `localStorage` (no backend yet)                         |
| Gift state    | `localStorage` (no backend yet)                         |
| Map           | Google Maps iframe embed                                |
| Hosting       | GitHub Pages (`dev-genspark` branch, `/ root`)          |

---

## Design Tokens (CSS variables)

Defined in `:root` at the top of `index.html`:

```css
--paper         #f7f5ef    /* main background, off-white     */
--paper-2       #efece4    /* alternate section background    */
--eucalypt      oklch(0.52 0.035 155)   /* mid green, links  */
--eucalypt-2    oklch(0.42 0.035 152)   /* darker green      */
--eucalypt-3    oklch(0.32 0.030 150)   /* darkest green, CTAs */
--eucalypt-pale oklch(0.94 0.012 150)   /* pale green bg     */
--ink           #2a2e2a    /* primary text                   */
--ink-2         #4a504a    /* secondary text                 */
--ink-3         #7a807a    /* muted text, hints              */
--serif         'Cormorant Garamond'
--sans          'Inter'
--mono          'JetBrains Mono'
```

---

## Key Behaviours (JS)

- **Countdown** — updates every 1 s targeting `2026-08-12T18:30:00-04:00` (UTC−4, Campo Grande)
- **RSVP form** — validates name + phone, stores to `localStorage`, shows success state; "send for another person" reloads
- **Companion fields** — dynamically adds/removes name inputs (max 4) via +/− counter
- **Gift modal** — opens on "Presentear" click, shows pseudo-QR + Pix key copy button; "mark as given" persists to `localStorage`
- **Nav active state** — `IntersectionObserver` highlights the current section link as user scrolls
- **Fade-in** — section headers animate in via a second `IntersectionObserver` (fires once per element)
- **Hamburger menu** — animated 3-line → ✕ toggle below 800 px, full-screen overlay with large serif links

---

## Pending / Backlog

- [ ] **Real Pix key** — replace placeholder `eduardo.laura@noivos.com.br` in the modal HTML
- [ ] **Real QR code** — replace the procedurally-generated pseudo-QR with actual Pix QR image
- [ ] **RSVP backend** — currently saves to `localStorage` only; needs Formspree / Supabase / Google Forms
- [ ] **couple_rings.png** — asset exists but is not yet placed in any section
- [ ] **Monogram in nav/footer** — `monograph.svg.svg` asset exists; could replace the text "E & L" logo
- [ ] **Dress code confirmation** — exact dress code text to be confirmed with the couple
- [ ] **Custom domain** — `edulaura.com.br` referenced in footer; DNS to be configured

---

## Branches

| Branch        | Purpose                                      |
|---------------|----------------------------------------------|
| `main`        | Stable baseline (original handoff)           |
| `dev-genspark`| Active development branch → GitHub Pages     |

GitHub Pages is served from `dev-genspark` / root.

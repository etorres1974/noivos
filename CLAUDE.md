# AI Session Handoff — Eduardo & Laura Wedding Site

This file gives an AI assistant everything needed to pick up this project
immediately without re-reading every file from scratch.

---

## What This Project Is

A **single-page wedding website** for Eduardo & Laura.
- **Wedding date/time**: 12 August 2026, 18h30 (UTC−4, Campo Grande/MS, Brazil)
- **Venue**: R. Fox, S/N — Vila Base Aérea, Campo Grande/MS, CEP 79090-350
- **Live URL**: https://etorres1974.github.io/noivos/
- **GitHub repo**: https://github.com/etorres1974/noivos
- **Active branch**: `dev-genspark` → served by GitHub Pages

---

## The One File That Matters

```
Eduardo e Laura.html   ← THE source file. Self-contained HTML/CSS/JS.
index.html             ← Exact copy of above. Required for GitHub Pages.
```

**Always edit `Eduardo e Laura.html`, then copy to `index.html`, then commit both.**

```bash
cp "Eduardo e Laura.html" index.html
git add "Eduardo e Laura.html" index.html
git commit -m "feat/fix: description"
git push origin dev-genspark
```

Everything else in the repo is reference material or original wireframe files — do not edit them.

---

## Project Stack

- **No framework, no build tool, no npm.** Pure HTML + CSS + vanilla JS.
- **Fonts**: Google Fonts CDN — Cormorant Garamond (serif), Inter (sans), JetBrains Mono (mono)
- **Storage**: `localStorage` only — no backend is currently wired up
- **Hosting**: GitHub Pages, branch `dev-genspark`, path `/`

---

## File Layout (what's relevant)

```
Eduardo e Laura.html                          ← EDIT THIS
index.html                                    ← KEEP IN SYNC WITH ABOVE
design_handoff_wedding_site_eduardo_laura/
    README.md                                 ← Full design spec (good reference)
    assets/
        couple_kiss.png                       ← Used: hero right panel
        couple_rings.png                      ← Available, not yet placed
        monograph.svg.svg                     ← Couple monogram SVG, not yet placed
        monograph.jfif / monograph3x4.jpg     ← Monogram image variants
```

Reference paths inside the HTML always start from the repo root, e.g.:
`design_handoff_wedding_site_eduardo_laura/assets/couple_kiss.png`

---

## HTML Structure (section order)

```
<nav class="nav">                     sticky top nav, hamburger on mobile
<section class="hero" id="top">       hero: names, date, couple photo
<section class="countdown">           live countdown timer (no id — not in nav)
<section id="evento">                 event details + Google Maps iframe
<section id="dresscode" class="dresscode">  attire guide + colour swatches
<section id="rsvp" class="rsvp">      RSVP form
<section id="presentes">              gift list grid (rendered by JS)
<footer>                              names, date, tagline
<div class="modal-backdrop" id="gift-modal">   Pix payment modal
<div class="nav-mobile-overlay">      full-screen mobile nav overlay
```

---

## CSS Architecture

All styles are in a single `<style>` block inside the `<head>`.
Sections are clearly delimited with comments like:
```css
/* ─── Hero ─────────────────────────────────────────────── */
```

**Design tokens** live in `:root` at the very top:
- `--paper`, `--paper-2` — background shades (off-white)
- `--eucalypt`, `--eucalypt-2`, `--eucalypt-3` — green scale (oklch)
- `--eucalypt-pale`, `--eucalypt-pale-2` — light green tints
- `--ink`, `--ink-2`, `--ink-3`, `--ink-4` — text scale
- `--serif`, `--sans`, `--mono` — font stacks
- `--line`, `--line-2` — border colours

**Responsive breakpoints**:
- `≤ 1000px` — hero stacks vertically
- `≤ 900px` — event/dresscode/gifts grid collapses
- `≤ 800px` — hamburger menu appears, nav links hidden
- `≤ 700px` — RSVP field-row collapses, countdown goes 2×2
- `≤ 600px` — gifts grid goes single column

---

## JavaScript Architecture

All JS is in a single `<script>` block at the bottom of `<body>`.
Sections are delimited with comments like:
```js
/* ─── Countdown ──────────────────────────────────────── */
```

**Key globals / state:**
```js
WEDDING_DATE        // new Date('2026-08-12T18:30:00-04:00')
attendVal           // 'yes' | 'no'  — RSVP radio selection
compCount           // number of companions (0–4)
givenGifts          // array of gift IDs from localStorage
activeGiftId        // ID of gift currently open in modal
GIFTS               // array of 9 gift objects {id, cat, name, desc, price, icon}
ICONS               // SVG path map keyed by icon name
```

**Key DOM IDs:**
```
cd-days / cd-hours / cd-mins / cd-secs   countdown displays
attend-radio                              RSVP yes/no radio row
attend-yes-fields                         companion + restrictions section
comp-count / comp-minus / comp-plus       companion counter
companionsList                            dynamic companion name inputs
rsvp-form / rsvp-form-wrap               form and its container
gifts-grid                               gift cards container
gift-modal                               modal backdrop
modal-gift-name / modal-gift-price       modal header
qr-svg                                   pseudo-QR SVG element
pix-key                                  Pix key text
pix-copy-btn                             copy button
mark-given-btn                           "mark as given" button
nav-hamburger                            hamburger toggle button
nav-mobile-overlay                       mobile full-screen nav
```

**Observers:**
- `navObserver` — `IntersectionObserver` on every `section[id]`, rootMargin `-40% 0px -55% 0px`, adds `.active` to matching `.nav-link[data-section]`
- `fadeObserver` — `IntersectionObserver` on every `.fade-in`, threshold 0.12, adds `.visible` class once

---

## Known Pending Items (Backlog)

| Priority | Item | Detail |
|----------|------|--------|
| HIGH | Real Pix key | Replace `eduardo.laura@noivos.com.br` in `#pix-key` element |
| HIGH | Real QR code | Replace `drawQR()` pseudo-QR with actual `<img>` of the Pix QR |
| HIGH | RSVP backend | `localStorage` only now; integrate Formspree / Supabase / Google Forms |
| MED  | Rings photo | `couple_rings.png` exists — good for dresscode or gifts section |
| MED  | Monogram in nav | Replace text "E & L" with `monograph.svg.svg` image |
| LOW  | Custom domain | `edulaura.com.br` in footer — configure DNS + GitHub Pages custom domain |
| LOW  | Dress code exact text | Confirm wording with couple |

---

## Session History

| Session | What was done |
|---------|---------------|
| Initial | Design handoff received: lo-fi wireframe HTML + assets + design spec README |
| Session 1 | Implemented full site in `Eduardo e Laura.html`: hero, countdown, event details, dress code, RSVP form, gift list with Pix modal, footer |
| Session 2 (AI) | Fixed hero image (was placeholder → now `couple_kiss.png`), fixed modal animation, added mobile hamburger menu, added IntersectionObserver nav active state, added fade-in scroll animations; created `dev-genspark` branch; added `index.html` for GitHub Pages |
| Session 3 (AI) | Added `README.md` (project docs) and `CLAUDE.md` (this file, AI handoff context) |

---

## How to Run Locally

```bash
# Any static file server works. Simplest:
python3 -m http.server 8080
# Then open: http://localhost:8080/index.html
```

No install, no build, no env vars needed.

---

## Git Workflow for This Project

```bash
# 1. Make sure you're on the right branch
git checkout dev-genspark

# 2. Edit Eduardo e Laura.html

# 3. Sync index.html
cp "Eduardo e Laura.html" index.html

# 4. Commit both
git add "Eduardo e Laura.html" index.html
git commit -m "type(scope): description"

# 5. Push
git push origin dev-genspark
```

Commit types: `feat` (new feature), `fix` (bug fix), `style` (CSS/visual only),
`content` (copy/text change), `chore` (tooling/config).

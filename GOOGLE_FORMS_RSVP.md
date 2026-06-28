# RSVP via Google Forms — Implementation Plan

This document describes exactly how to wire up the existing RSVP form in
`index.html` to Google Forms so every submission lands in a Google Sheet,
with zero backend and zero monthly cost.

---

## Sensitive data audit

Before implementing, it is important to understand what data in this project
is sensitive and how to keep it out of the public repository.

### What is sensitive and must NOT be committed

| Data | Where it currently lives | Risk if exposed |
|------|--------------------------|-----------------|
| **Real Pix key** (email, CPF or phone) | `index.html` line 1327 — placeholder `eduardo.laura@noivos.com.br` | Anyone can use it to receive Pix transfers impersonating the couple, or spam it |
| **Google Forms Form ID** | Will be added to `index.html` in Step 3 | Anyone with the ID can flood the Google Sheet with fake RSVPs |
| **Google Forms entry IDs** | Will be added to `index.html` in Step 3 | Same — enables automated spam submissions |

### What is NOT sensitive (no action needed)

| Data | Why it is safe |
|------|---------------|
| `edulaura.com.br` domain in footer | A domain name is public by definition |
| `localStorage` key names (`rsvp_eduardo_laura`, `given_gifts_el`) | Client-side identifiers only, no credentials |
| Google Maps iframe embed | Uses no API key — the basic embed is public |
| Couple names, date, venue address | Already public — guests need this information |

---

## The `.env` problem for pure static sites

> **This is the most important section to understand before implementing.**

In Node.js or Python apps, a `.env` file is read by the server at startup
and injected into the app as environment variables — the secrets never reach
the browser.

**This project has no server and no build step.** Every file is served
as-is by GitHub Pages. That means:

- A `.env` file on your machine **cannot be automatically injected** into
  `index.html` at deploy time.
- If you hardcode secrets directly into `index.html`, they become public
  the moment you push.

The solution is a **`config.js` file that is gitignored** — it plays the
same role as `.env` but works in a pure static context. The pattern is:

```
.gitignore         ← lists config.js so it is never committed
config.js          ← your machine only; holds real secrets
config.example.js  ← committed; shows the shape with placeholder values
index.html         ← loads config.js via <script src="config.js">
```

When you deploy to GitHub Pages you upload `config.js` **once** via the
GitHub UI (or via `git add --force config.js` for a one-time push, then
immediately remove it from tracking). Details in Step 0 below.

---

## Step 0 — Set up the secrets pattern

### 0a — Create `.gitignore`

Create a `.gitignore` file at the repo root with:

```
# Local config — contains real secrets, never commit
config.js
```

### 0b — Create `config.example.js`

Create `config.example.js` at the repo root. This file **is committed** —
it documents the shape without real values:

```js
// config.example.js
// Copy this file to config.js and fill in the real values.
// config.js is gitignored and must never be committed.
const CONFIG = {
  // Pix key shown in the gift modal (email, CPF, phone, or random key)
  PIX_KEY: 'your-real-pix-key-here',

  // Google Forms — obtained in Steps 1 and 2 of this plan
  GF_FORM_ID:          '1FAIpQLSe_XXXXXXXXXXXX',
  GF_ENTRY_NAME:       'entry.000000001',
  GF_ENTRY_PHONE:      'entry.000000002',
  GF_ENTRY_ATTENDING:  'entry.000000003',
  GF_ENTRY_COMPANIONS: 'entry.000000004',
  GF_ENTRY_RESTRICT:   'entry.000000005',
  GF_ENTRY_MESSAGE:    'entry.000000006',
};
```

### 0c — Create your local `config.js`

On your machine only, copy the example and fill in real values:

```bash
cp config.example.js config.js
# Now open config.js and fill in the real Pix key
# (leave Google Forms fields as placeholders until Steps 1–2)
```

### 0d — Load `config.js` in `index.html`

Add this line in `index.html` **before the closing `</head>` tag**,
before any other `<script>`:

```html
<script src="config.js"></script>
```

This makes `CONFIG` available as a global variable to all subsequent scripts.

### 0e — Replace the hardcoded Pix key in `index.html`

**Current code (line 1327):**
```html
<div class="key-val" id="pix-key">eduardo.laura@noivos.com.br</div>
```

**Replace with:**
```html
<div class="key-val" id="pix-key"></div>
```

Then in the `<script>` block at the bottom, after `CONFIG` is available,
add one line to populate it at runtime:

```js
// Inject Pix key from config (never hardcoded in HTML)
const pixKeyEl = document.getElementById('pix-key');
if (pixKeyEl && typeof CONFIG !== 'undefined') {
  pixKeyEl.textContent = CONFIG.PIX_KEY;
}
```

### 0f — Deploy `config.js` to GitHub Pages

GitHub Pages serves everything in the branch. Since `config.js` is
gitignored, you need to push it **once** outside the normal workflow:

```bash
# One-time: force-add config.js, push, then immediately untrack it
git add --force config.js
git commit -m "chore: deploy config (will be removed from tracking)"
git push origin dev-genspark

# Immediately remove from git tracking (keeps the file on disk)
git rm --cached config.js
git commit -m "chore: remove config.js from git tracking"
git push origin dev-genspark
```

After these two commits, `config.js` lives on GitHub Pages (served to
browsers) but is no longer in the git history going forward.

> **Important:** The two commits above will briefly expose `config.js`
> in git history. For a wedding site with 100 guests this is acceptable.
> If you need zero exposure, the alternative is to use a paid GitHub
> Pages plan with a proper CI/CD pipeline that injects secrets at build time.

> **Alternative — manual upload via GitHub UI:**
> Go to your repo on github.com → `dev-genspark` branch → "Add file" →
> "Upload files" → upload `config.js` directly. It will be served by
> GitHub Pages without appearing in a commit alongside your source code.
> This is the cleanest approach.

---

## Step 1 — Create the Google Form

1. Go to https://forms.google.com and create a **new blank form**.
2. Set the title to **"RSVP — Eduardo & Laura"** (internal only, guests never see it).
3. Add the following questions **in this exact order**:

| # | Question text | Type | Required |
|---|---------------|------|----------|
| 1 | Nome completo | Short answer | Yes |
| 2 | WhatsApp | Short answer | Yes |
| 3 | Você poderá comparecer? | Multiple choice: `Sim` / `Não` | Yes |
| 4 | Acompanhantes | Short answer | No |
| 5 | Restrições alimentares | Short answer | No |
| 6 | Mensagem aos noivos | Paragraph | No |

4. Click **Responses → Link to Sheets** → create a new spreadsheet called
   **"RSVP Eduardo e Laura"**. This is where all submissions will appear.

5. Click **Send** → **link icon** → copy the full URL:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSe_XXXXXXXXXXXX/viewform
   ```
   The form ID is the `1FAIpQLSe_XXXXXXXXXXXX` part.

---

## Step 2 — Extract the field entry IDs

Google Forms identifies each question with an `entry.XXXXXXXXX` parameter.

**How to find them:**

1. Open your Google Form's preview URL:
   ```
   https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform
   ```
2. Right-click → **View Page Source**.
3. Search for `entry.` — you will see blocks like:
   ```html
   <input name="entry.123456789" type="hidden" ...>
   ```
4. Match each `entry.XXXXXXXXX` to its question by reading the surrounding HTML.
5. Fill in your local `config.js` with the real values:

```js
const CONFIG = {
  PIX_KEY:             'your-real-pix-key',
  GF_FORM_ID:          '1FAIpQLSe_...',      // ← paste real form ID
  GF_ENTRY_NAME:       'entry.123456781',    // ← paste real entry IDs
  GF_ENTRY_PHONE:      'entry.123456782',
  GF_ENTRY_ATTENDING:  'entry.123456783',
  GF_ENTRY_COMPANIONS: 'entry.123456784',
  GF_ENTRY_RESTRICT:   'entry.123456785',
  GF_ENTRY_MESSAGE:    'entry.123456786',
};
```

---

## Step 3 — Update index.html

### 3a — Load config.js (from Step 0d, if not done yet)

```html
<!-- in <head>, before any other <script> -->
<script src="config.js"></script>
```

### 3b — Add the Google Forms config block

Near the top of the main `<script>` block, before `/* ─── Countdown ─── */`,
add:

```js
/* ─── Google Forms RSVP config ──────────────────────── */
// All values come from config.js — never hardcode them here.
const GF_ENDPOINT =
  `https://docs.google.com/forms/d/e/${CONFIG.GF_FORM_ID}/formResponse`;
const GF_FIELDS = {
  name:         CONFIG.GF_ENTRY_NAME,
  phone:        CONFIG.GF_ENTRY_PHONE,
  attending:    CONFIG.GF_ENTRY_ATTENDING,
  companions:   CONFIG.GF_ENTRY_COMPANIONS,
  restrictions: CONFIG.GF_ENTRY_RESTRICT,
  message:      CONFIG.GF_ENTRY_MESSAGE,
};
```

### 3c — Replace the submit handler

Find the current `form.addEventListener('submit', ...)` block (around line 1426)
and replace it with:

```js
form.addEventListener('submit', async e => {
  e.preventDefault();

  const name  = document.getElementById('rsvp-name').value.trim();
  const phone = document.getElementById('rsvp-phone').value.trim();

  if (!name || !phone) {
    if (!name) document.getElementById('rsvp-name').focus();
    else       document.getElementById('rsvp-phone').focus();
    return;
  }

  const companions = Array.from(document.querySelectorAll('.companion-name'))
    .map(i => i.value.trim()).filter(Boolean);

  const data = {
    name, phone,
    attending:    attendVal,
    companions,
    restrictions: document.getElementById('rsvp-restr').value.trim(),
    message:      document.getElementById('rsvp-msg').value.trim(),
    ts:           Date.now(),
  };

  const submitBtn = form.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';

  // Build the Google Forms POST body — field names come from CONFIG
  const body = new URLSearchParams();
  body.append(GF_FIELDS.name,         data.name);
  body.append(GF_FIELDS.phone,        data.phone);
  body.append(GF_FIELDS.attending,    data.attending === 'yes' ? 'Sim' : 'Não');
  body.append(GF_FIELDS.companions,   companions.join(', '));
  body.append(GF_FIELDS.restrictions, data.restrictions);
  body.append(GF_FIELDS.message,      data.message);

  try {
    // Google Forms does not support CORS — no-cors sends the request
    // without reading the response. Submission goes through on Google's side.
    await fetch(GF_ENDPOINT, { method: 'POST', mode: 'no-cors', body });
  } catch (err) {
    console.warn('Google Forms submit failed:', err);
  }

  localStorage.setItem('rsvp_eduardo_laura', JSON.stringify(data));
  showSuccess(name);
});
```

---

## Step 4 — Test end-to-end

1. Make sure your local `config.js` has real values.
2. Run the site:
   ```bash
   python3 -m http.server 8080
   # open http://localhost:8080
   ```
3. Fill in the RSVP form and submit.
4. Open your Google Sheet — the new row should appear within a few seconds.

**What to check:**

| Column | Expected value |
|--------|---------------|
| Timestamp | Auto-filled by Google |
| Nome completo | The name you typed |
| WhatsApp | The phone you typed |
| Você poderá comparecer? | `Sim` or `Não` |
| Acompanhantes | Comma-separated names, or empty |
| Restrições alimentares | Text, or empty |
| Mensagem aos noivos | Text, or empty |

> The fetch uses `mode: 'no-cors'`, so DevTools shows the request as
> `(opaque)` with status 0. This is normal. Confirm success in the Sheet,
> not in the network tab.

---

## Step 5 — Deploy `config.js` to GitHub Pages

See Step 0f above. Use the **GitHub UI upload** (cleanest) or the
force-add / rm-cached two-commit approach.

---

## Step 6 — (Optional) Email notifications

1. Open the Google Sheet.
2. **Tools → Notification rules**.
3. Set: *"Any changes are made"* → *"Email — right away"*.
4. Both Eduardo and Laura can add their own rule from their own Google account.

---

## Step 7 — View and manage responses

- **Filter column D** ("Você poderá comparecer?") = `Sim` → confirmed guest list.
- **Count total guests** with: `=COUNTIF(D:D,"Sim")`.
- **Share the sheet** read-only with your wedding planner.
- **Export** via File → Download → CSV or Excel at any time.

---

## Important caveats

### CORS and `no-cors`
We cannot read Google's response. The submission goes through; we just
can't confirm it programmatically. The `localStorage` fallback ensures
the user always sees the success screen.

### Google may change the endpoint
Google does not officially support this technique. The `formResponse`
endpoint has been stable for many years, but monitor the Sheet after
launch to confirm submissions are arriving.

### `config.js` is public on GitHub Pages
Even though `config.js` is gitignored and not in the repo source, once
deployed it is **publicly accessible** at
`https://etorres1974.github.io/noivos/config.js`. This means:

- The **Pix key** will be readable by anyone who knows the URL.
  This is unavoidable in a pure static site — the browser must receive
  the key to display it. The pattern prevents the key from being
  **searchable in the git history**, which is the main risk.
- The **Google Forms entry IDs** will also be readable. Anyone could
  use them to submit fake RSVPs. For 100 guests this risk is low;
  Google Forms has its own spam protection.
- If you need stronger protection (e.g. for the Pix key), the only real
  solution is a backend that serves the key after authenticating the user.
  That is out of scope for this project.

### Never commit `config.js`
Verify `.gitignore` is working before every push:
```bash
git status   # config.js must NOT appear in the list
```

---

## Files changed / created

| File | Action | Committed? |
|------|--------|-----------|
| `.gitignore` | Created | ✅ Yes |
| `config.example.js` | Created | ✅ Yes |
| `config.js` | Created locally | ❌ No — gitignored |
| `index.html` | `<script src="config.js">` added; Pix key element emptied; Google Forms constants + new submit handler added | ✅ Yes |
| `GOOGLE_FORMS_RSVP.md` | This file | ✅ Yes |
| `CLAUDE.md` | Update session history after implementation | ✅ Yes |

---

## Effort estimate

| Task | Time |
|------|------|
| Step 0 — secrets pattern setup | 10 min |
| Step 1 — create Google Form | 10 min |
| Step 2 — extract entry IDs | 10 min |
| Step 3 — update index.html | 15 min |
| Step 4 — test end-to-end | 10 min |
| Step 5 — deploy config.js | 5 min |
| Step 6 — email notifications | 5 min |
| **Total** | **~65 min** |

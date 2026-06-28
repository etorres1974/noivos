# RSVP via Google Forms — Implementation Plan

This document describes exactly how to wire up the existing RSVP form in
`index.html` to Google Forms so every submission lands in a Google Sheet,
with zero backend and zero monthly cost.

---

## Sensitive data audit

Before implementing, it is important to understand what data in this project
is sensitive and how to keep it out of the public repository.

### What is sensitive and must NOT be committed

| Data | Where it lives | Risk if exposed |
|------|----------------|-----------------|
| **Real Pix key** (email, CPF or phone) | `secrets.PIX_KEY` GitHub secret → injected into `config.js` by CI | Anyone can use it to receive Pix transfers impersonating the couple, or spam it |
| **Google Forms Form ID** | `vars.GF_FORM_ID` GitHub variable → injected into `config.js` by CI | Anyone with the ID can flood the Google Sheet with fake RSVPs |
| **Google Forms entry IDs** | `vars.GF_ENTRY_*` GitHub variables → injected into `config.js` by CI | Same — enables automated spam submissions |

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

`config.js` is **never committed or uploaded manually**. Instead, the
GitHub Actions workflow (`.github/workflows/deploy.yml`) generates it at
deploy time from repository variables and secrets. Details in Step 0f below.

---

## Step 0 — Set up the secrets pattern

> **✅ Steps 0a–0e are already implemented.** The following is a record
> of what was done, for reference.

### 0a — `.gitignore` ✅

`.gitignore` exists at the repo root and excludes `config.js`.

### 0b — `config.example.js` ✅

`config.example.js` is committed. It contains the real Google Forms entry
IDs (not secrets) and a placeholder for `PIX_KEY`.

### 0c — Local `config.js` ✅

For local development, copy the example and fill in the real Pix key:

```bash
cp config.example.js config.js
# Edit config.js — set PIX_KEY to the real value
```

### 0d — `config.js` loaded in `index.html` ✅

`<script src="config.js">` is already in the `<head>` of `index.html`,
before any other scripts.

### 0e — Pix key injected at runtime ✅

The `#pix-key` element in `index.html` is empty. The key is injected
from `CONFIG.PIX_KEY` by JS at runtime — it is never hardcoded in HTML.

### 0f — Deploy `config.js` via GitHub Actions (automated)

`config.js` is **never committed or uploaded manually**. Instead, a
GitHub Actions workflow generates it at deploy time from repository
variables and secrets, then publishes the whole site to GitHub Pages.

**One-time setup — add your values in the GitHub repo UI:**

1. Go to your repo on github.com → **Settings → Secrets and variables →
   Actions**.
2. **Variables tab** — add each of these (non-sensitive):

   | Variable name | Value |
   |---------------|-------|
   | `GF_FORM_ID` | `1FAIpQLSe…` (your form ID) |
   | `GF_ENTRY_NAME` | `entry.XXXXXXXXX` |
   | `GF_ENTRY_PHONE` | `entry.XXXXXXXXX` |
   | `GF_ENTRY_ATTENDING` | `entry.XXXXXXXXX` |
   | `GF_ENTRY_COMPANIONS` | `entry.XXXXXXXXX` |
   | `GF_ENTRY_RESTRICT` | `entry.XXXXXXXXX` |
   | `GF_ENTRY_MESSAGE` | `entry.XXXXXXXXX` |

3. **Secrets tab** — add the sensitive value:

   | Secret name | Value |
   |-------------|-------|
   | `PIX_KEY` | your real Pix key |

4. **Settings → Pages** — set Source to **"GitHub Actions"**.

After that, every push to `main` triggers `.github/workflows/deploy.yml`,
which generates `config.js` on the runner and deploys the full site.
`config.js` is never in the git history.

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

## Step 5 — Deploy to GitHub Pages (automated)

No manual action needed. Push to `main` — the GitHub Actions workflow
(`.github/workflows/deploy.yml`) will:

1. Check out the repository.
2. Generate `config.js` from repository variables (`vars.*`) and secrets (`secrets.PIX_KEY`).
3. Upload the full site (including the generated `config.js`) as a Pages artifact.
4. Deploy it to GitHub Pages.

You can watch the run in the **Actions** tab of your repo.

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
| `config.js` | Generated at deploy time by CI — never on disk in repo | ❌ No — gitignored |
| `.github/workflows/deploy.yml` | Created — generates config.js from vars/secrets, deploys to Pages | ✅ Yes |
| `index.html` | `<script src="config.js">` added; Pix key element emptied; Google Forms constants + new submit handler added | ✅ Yes |
| `GOOGLE_FORMS_RSVP.md` | This file | ✅ Yes |
| `CLAUDE.md` | Update session history after implementation | ✅ Yes |

---

## Effort estimate

| Task | Time |
|------|------|
| Step 0 — secrets pattern setup + Actions workflow | 15 min |
| Step 1 — create Google Form | 10 min |
| Step 2 — extract entry IDs | 10 min |
| Step 3 — update index.html | 15 min |
| Step 4 — test end-to-end locally | 10 min |
| Step 5 — add vars/secrets in GitHub UI + push to main | 10 min |
| Step 6 — email notifications | 5 min |
| **Total** | **~75 min** |

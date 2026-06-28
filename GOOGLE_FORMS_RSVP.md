# RSVP via Google Forms — Implementation Plan

This document describes exactly how to wire up the existing RSVP form in
`index.html` to Google Forms so every submission lands in a Google Sheet,
with zero backend and zero monthly cost.

---

## How the technique works

Google Forms exposes a hidden POST endpoint for every form it creates.
When a browser submits to that endpoint, Google silently records the
response in the linked Google Sheet — even if the request comes from a
completely different page.

We keep our own styled form in `index.html` exactly as it is. On submit,
instead of only saving to `localStorage`, the JS handler also fires a
`fetch` POST to the Google Forms endpoint in the background. The user
never sees the Google Form or leaves the page.

```
User fills our form
       │
       ▼
JS submit handler (index.html)
       │
       ├─► POST to Google Forms endpoint  ──► Google Sheet row added
       │         (background, no redirect)
       └─► showSuccess() — same UX as today
```

---

## Step 1 — Create the Google Form

1. Go to https://forms.google.com and create a **new blank form**.
2. Set the title to **"RSVP — Eduardo & Laura"** (internal only, guests never see it).
3. Add the following questions **in this exact order** — the order matters because
   we will match them by field name, not position:

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

5. Click **Send** (the paper-plane icon) → **link icon** → copy the full URL.
   It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSe_XXXXXXXXXXXX/viewform
   ```
   Save this URL — we need the form ID from it (`1FAIpQLSe_XXXXXXXXXXXX`).

---

## Step 2 — Extract the field entry IDs

Google Forms identifies each question internally with an `entry.XXXXXXXXX`
parameter. We need to find the entry ID for each of our 6 fields.

**How to find them:**

1. Open your Google Form's **preview URL**:
   ```
   https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform
   ```
2. Right-click the page → **View Page Source** (or Inspect).
3. Search for `entry.` — you will see blocks like:
   ```html
   <input name="entry.123456789" type="hidden" ...>
   ```
4. Match each `entry.XXXXXXXXX` to its question by reading the surrounding HTML.
5. Record all 6 entry IDs in this table:

| Field | Entry ID (fill in) |
|-------|-------------------|
| Nome completo | `entry.` |
| WhatsApp | `entry.` |
| Você poderá comparecer? | `entry.` |
| Acompanhantes | `entry.` |
| Restrições alimentares | `entry.` |
| Mensagem aos noivos | `entry.` |

---

## Step 3 — Update index.html

### 3a — Add a helper constant near the top of the `<script>` block

Find the `/* ─── Countdown ─── */` comment and add this block just before it:

```js
/* ─── Google Forms RSVP config ──────────────────────── */
const GF_ENDPOINT = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
const GF_FIELDS = {
  name:         'entry.XXXXXXXXX',   // Nome completo
  phone:        'entry.XXXXXXXXX',   // WhatsApp
  attending:    'entry.XXXXXXXXX',   // Você poderá comparecer?
  companions:   'entry.XXXXXXXXX',   // Acompanhantes
  restrictions: 'entry.XXXXXXXXX',   // Restrições alimentares
  message:      'entry.XXXXXXXXX',   // Mensagem aos noivos
};
```

Replace `YOUR_FORM_ID` and each `entry.XXXXXXXXX` with the real values from Step 2.

### 3b — Replace the submit handler

Find the current `form.addEventListener('submit', ...)` block (around line 1426)
and replace it with this:

```js
form.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = document.getElementById('rsvp-name').value.trim();
  const phone   = document.getElementById('rsvp-phone').value.trim();

  // Client-side validation — same as before
  if (!name || !phone) {
    if (!name) document.getElementById('rsvp-name').focus();
    else       document.getElementById('rsvp-phone').focus();
    return;
  }

  const companions = Array.from(document.querySelectorAll('.companion-name'))
    .map(i => i.value.trim()).filter(Boolean);

  const data = {
    name,
    phone,
    attending:    attendVal,
    companions,
    restrictions: document.getElementById('rsvp-restr').value.trim(),
    message:      document.getElementById('rsvp-msg').value.trim(),
    ts:           Date.now(),
  };

  // Disable button and show loading state
  const submitBtn = form.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';

  // Build the Google Forms POST body
  const body = new URLSearchParams();
  body.append(GF_FIELDS.name,         data.name);
  body.append(GF_FIELDS.phone,        data.phone);
  body.append(GF_FIELDS.attending,    data.attending === 'yes' ? 'Sim' : 'Não');
  body.append(GF_FIELDS.companions,   companions.join(', '));
  body.append(GF_FIELDS.restrictions, data.restrictions);
  body.append(GF_FIELDS.message,      data.message);

  try {
    // Google Forms does not support CORS — we use no-cors so the browser
    // sends the request without reading the response. This is expected;
    // the submission still goes through on Google's side.
    await fetch(GF_ENDPOINT, {
      method: 'POST',
      mode:   'no-cors',
      body,
    });
  } catch (err) {
    // Network failure — still save locally and show success.
    // Optionally log the error for debugging.
    console.warn('Google Forms submit failed:', err);
  }

  // Always save locally as a fallback and show the success screen
  localStorage.setItem('rsvp_eduardo_laura', JSON.stringify(data));
  showSuccess(name);
});
```

---

## Step 4 — Test end-to-end

1. Run the site locally:
   ```bash
   python3 -m http.server 8080
   # open http://localhost:8080
   ```
2. Fill in the RSVP form and submit.
3. Open your Google Sheet — the new row should appear within a few seconds.
4. Verify all 6 columns are populated correctly.

**What to check in the sheet:**

| Column | Expected value |
|--------|---------------|
| Nome completo | The name you typed |
| WhatsApp | The phone you typed |
| Você poderá comparecer? | `Sim` or `Não` |
| Acompanhantes | Comma-separated names, or empty |
| Restrições alimentares | Text, or empty |
| Mensagem aos noivos | Text, or empty |

> **Note on the network tab:** The fetch uses `mode: 'no-cors'`, so the
> browser will show the request as `(opaque)` with status 0 in DevTools.
> This is normal — it does not mean the submission failed.
> Confirm success by checking the Google Sheet, not the network tab.

---

## Step 5 — (Optional) Email notifications

To get an email every time someone submits:

1. Open the Google Sheet.
2. **Tools → Notification rules**.
3. Set: *"Any changes are made"* → *"Email — right away"*.
4. Both Eduardo and Laura can add their own notification rule by opening
   the sheet from their own Google account.

---

## Step 6 — View and manage responses

All responses live in the Google Sheet. Useful things to do there:

- **Filter column C** ("Você poderá comparecer?") = `Sim` to get the confirmed guest list.
- **Add a column** "Total na mesa" with formula `=1 + LEN(D2) - LEN(SUBSTITUTE(D2,",",""))` to count companions automatically (adjust D2 to the companions column).
- **Share the sheet** with your wedding planner or family members via Google Sheets' share button — read-only access is fine.
- **Export to CSV/Excel** via File → Download at any time.

---

## Important caveats

### CORS and `no-cors`
Google Forms does not set CORS headers, so we cannot read the response
from `fetch`. We use `mode: 'no-cors'` which tells the browser to send
the request anyway and discard the response. The submission goes through;
we just can't confirm it programmatically. This is the standard technique
for this approach and is used widely.

**Implication:** if Google Forms is down or changes its endpoint format,
submissions will silently fail. The localStorage fallback means the user
always sees the success screen, but the data won't be in the sheet.
For 100 guests this risk is acceptable. If you want guaranteed delivery,
use Formspree (Option 1) or Supabase (Option 3).

### Google may change the endpoint
Google does not officially support this technique. The `formResponse`
endpoint has been stable for many years, but Google could change it
without notice. Monitor the Google Sheet in the days after launch to
confirm submissions are arriving.

### Companions field
The current form collects companion names as individual inputs and we
join them with commas into a single string (e.g. `"Maria, João"`).
This keeps the Google Form simple (one field instead of four).
If you need each companion in a separate column, add up to 4 companion
questions in the Google Form and update `GF_FIELDS` and the `body.append`
calls accordingly.

### Timestamp
Google Forms automatically adds a "Timestamp" column (column A) with the
submission time in the sheet's timezone. You do not need to send it manually.

---

## Files to change

| File | Change |
|------|--------|
| `index.html` | Add `GF_ENDPOINT` + `GF_FIELDS` constants; replace submit handler |
| `GOOGLE_FORMS_RSVP.md` | This file — keep as reference |
| `CLAUDE.md` | Update session history once implemented |

No new files, no new dependencies, no build step.

---

## Effort estimate

| Task | Time |
|------|------|
| Create Google Form (Step 1) | 10 min |
| Extract entry IDs (Step 2) | 10 min |
| Update index.html (Step 3) | 15 min |
| Test end-to-end (Step 4) | 10 min |
| Set up email notifications (Step 5) | 5 min |
| **Total** | **~50 min** |

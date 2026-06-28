// config.example.js
// ─────────────────────────────────────────────────────────────────────────────
// This file is committed and shows the shape of the config with placeholder
// values. It is safe to share publicly.
//
// To set up locally:
//   cp config.example.js config.js
//   # Open config.js and fill in the real values (see GOOGLE_FORMS_RSVP.md)
//
// config.js is listed in .gitignore and must NEVER be committed.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // Pix key displayed in the gift modal.
  // Can be an email, CPF, phone number, or random key — whatever the couple's
  // bank generated. Replace with the real value in config.js.
  PIX_KEY: 'your-real-pix-key-here',

  // Google Forms integration — obtained by following Steps 1 and 2 in
  // GOOGLE_FORMS_RSVP.md. Leave as placeholders until you have the real values.
  GF_FORM_ID:          '1FAIpQLSe_XXXXXXXXXXXX',  // from the form's URL
  GF_ENTRY_NAME:       'entry.000000001',          // Nome completo
  GF_ENTRY_PHONE:      'entry.000000002',          // WhatsApp
  GF_ENTRY_ATTENDING:  'entry.000000003',          // Você poderá comparecer?
  GF_ENTRY_COMPANIONS: 'entry.000000004',          // Acompanhantes
  GF_ENTRY_RESTRICT:   'entry.000000005',          // Restrições alimentares
  GF_ENTRY_MESSAGE:    'entry.000000006',          // Mensagem aos noivos
};

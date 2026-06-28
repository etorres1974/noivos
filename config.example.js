// config.example.js
// ─────────────────────────────────────────────────────────────────────────────
// This file is committed and shows the shape of the config.
// Google Forms entry IDs are included here — they are not secrets (they are
// visible in the public form's page source).
//
// The ONLY value that must stay out of git is PIX_KEY.
//
// To set up locally:
//   cp config.example.js config.js
//   # Open config.js and replace PIX_KEY with the real Pix key
//
// config.js is listed in .gitignore and must NEVER be committed.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // Pix key displayed in the gift modal.
  // Can be an email, CPF, phone number, or random key.
  // ⚠️  Replace with the real value in config.js — never commit the real key.
  PIX_KEY: 'your-real-pix-key-here',

  // Google Forms — form ID and entry IDs extracted from the form's page source.
  // These are not secrets; they are visible to anyone who views the form HTML.
  GF_FORM_ID:          '1FAIpQLSeEunc6bGtryKSCcc54YK_wKuczb77OdFLBH8ZjM6q_JLP_2g',
  GF_ENTRY_NAME:       'entry.597007119',    // Nome completo
  GF_ENTRY_PHONE:      'entry.1485679251',   // WhatsApp
  GF_ENTRY_ATTENDING:  'entry.1512332169',   // Você poderá comparecer? (Sim / Não)
  GF_ENTRY_COMPANIONS: 'entry.46354235',     // Acompanhantes
  GF_ENTRY_RESTRICT:   'entry.429132216',    // Restrições alimentares
  GF_ENTRY_MESSAGE:    'entry.1245964475',   // Mensagem aos noivos
};

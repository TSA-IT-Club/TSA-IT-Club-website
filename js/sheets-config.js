/*
 * ============================================================
 *  sheets-config.js  —  TSA IT Club Google Sheets Connection
 * ============================================================
 *
 *  SETUP INSTRUCTIONS (one-time, ~10 minutes):
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete any existing code and paste the script from SETUP_GUIDE.md
 *  3. Save (Ctrl+S), then click Deploy → New Deployment
 *  4. Type = Web App
 *     "Execute as" = Me
 *     "Who has access" = Anyone
 *  5. Click Deploy → Authorize → Deploy again
 *  6. Copy the Web App URL that appears
 *  7. Paste it as scriptUrl below, then set enabled: true
 *  8. Save this file
 *
 *  ⚡ QUICK TOGGLE:
 *  - enabled: false  →  site uses only data.js (offline/safe mode)
 *  - enabled: true   →  site reads live data from Google Sheets
 *
 *  ONE URL covers ALL tabs (Events, Blog, Projects, Resources, Team)
 * ============================================================
 */

const SHEETS_CONFIG = {
  // ── Change to true after pasting your URL below ──
  enabled: true,

  // ── Paste your Google Apps Script Web App URL here ──
  // It looks like: https://script.google.com/macros/s/AKfycb.../exec
  scriptUrl: "https://script.google.com/macros/s/AKfycbxkdSPWgei1gOS_fyTl4zx-5N9i_YSgGDQ7BZJ13CGTiNI2esJZTX-TQtB9uNFsp1UXkg/exec",
};

const CHATBOT_CONFIG = {
  // ── Toggle Chatbot ON/OFF site-wide ──
  enabled: true,
};

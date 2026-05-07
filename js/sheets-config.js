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

// AKfycbyDAgQQBeiRQckSjb3EpSprlNiIhG7PjPAQJkQJmXbPxZNdvMQClQRbKjDkfDmzwM9Fnw

const SHEETS_CONFIG = {
  // ── Change to true after pasting your URL below ──
  enabled: true,

  // ── Paste your Google Apps Script Web App URL here ──
  // It looks like: https://script.google.com/macros/s/AKfycb.../exec
  scriptUrl:
    "https://script.google.com/macros/s/AKfycbyDAgQQBeiRQckSjb3EpSprlNiIhG7PjPAQJkQJmXbPxZNdvMQClQRbKjDkfDmzwM9Fnw/exec",

  // ── Toggle for Resources Page Approval ──
  // - false → Resources page loads normally without login
  // - true  → Users must log in via Google and be approved in Google Sheets
  requireApproval: true,

  // ── Google OAuth Client ID ──
  // Required if requireApproval is true. Create one at console.cloud.google.com
  googleClientId:
    "104711217148-7tqvgjvaq2sg86gem5h8tsn29kqv2jp0.apps.googleusercontent.com",
};

// {
//   "timeZone": "Asia/Kathmandu",
//   "dependencies": {},
//   "exceptionLogging": "STACKDRIVER",
//   "runtimeVersion": "V8",
//   "webapp": {
//     "executeAs": "USER_DEPLOYING",
//     "access": "ANYONE_ANONYMOUS"
//   }
// }

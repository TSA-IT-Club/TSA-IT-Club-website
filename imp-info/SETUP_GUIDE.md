# 📋 TSA IT Club Website — CMS Setup Guide (Google Apps Script)

> Connect your website to Google Sheets — **free, no limits, owned by Google forever.**

---

## What Was Added

| File                  | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `sheets-config.js`    | Paste your Apps Script URL here + toggle on/off        |
| `sheets-sync.js`      | Fetches live data from Sheets, falls back to `data.js` |
| `push-to-sheets.html` | Developer tool: push `data.js` data → Google Sheets    |

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Create new blank spreadsheet**
2. Name it anything — e.g. **TSA IT Club CMS**
3. At the bottom, rename `Sheet1` → `Events` (right-click the tab → Rename)
4. Click **+** four more times and name the tabs:

| Tab Name    | Must match exactly |
| ----------- | ------------------ |
| `Events`    | ✅                 |
| `Blog`      | ✅                 |
| `Projects`  | ✅                 |
| `Resources` | ✅                 |
| `Team`      | ✅                 |

### Add column headers — Row 1 of each tab:

**Events:**

```
title	month	day	date	description	time	location	registerLink
```

**Blog:**

```
title	date	category	excerpt	image	link
```

**Projects:**

```
title	category	description	image	tags	techStack	githubLink	modalIcon	modalDescription
```

> `tags`: comma-separated — e.g. `Web App, Node.js`  
> `category`: one of `web`, `app`, `cyber`

**Resources:**

```
title	description	icon	downloadLink
```

> `icon`: FontAwesome class — e.g. `fa-solid fa-file-pdf`

**Team:**

```
name	role	type	avatarInitial	gradient	image	linkedin	github	email	about	skills
```

> `type`: exactly `exec` or `board`

---

## Step 2 — Add the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all the existing code in the editor
3. Paste this entire script:

```javascript
function doGet(e) {
  var sheetName = e.parameter.sheet;
  if (!sheetName) {
    return respond({ error: "Missing ?sheet= parameter" });
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return respond([]);
  }
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return respond([]);
  var headers = rows.shift();
  var data = rows
    .map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = row[i];
      });
      return obj;
    })
    .filter(function (obj) {
      // Skip completely empty rows
      return headers.some(function (h) {
        return obj[h] !== "" && obj[h] !== null && obj[h] !== undefined;
      });
    });
  return respond(data);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheetName = payload.sheet;
    var data = payload.data;
    if (!sheetName || !data) return respond({ error: "Bad payload" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return respond({ error: "Sheet not found: " + sheetName });

    // Clear all rows below header
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);

    if (data.length > 0) {
      var headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];
      var rows = data.map(function (item) {
        return headers.map(function (h) {
          return item[h] !== undefined ? item[h] : "";
        });
      });
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    return respond({ success: true, written: data.length });
  } catch (err) {
    return respond({ error: err.toString() });
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

4. Click **Save** (Ctrl+S) — name the project anything, e.g. `TSA CMS API`

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the ⚙️ gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Description**: `TSA IT Club CMS v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. A pop-up asks you to **Authorize** — click "Authorize", choose your Google account, click "Allow"
6. You'll see a **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbXXXXXXXX.../exec
   ```
7. **Copy that URL**

---

## Step 4 — Configure the Website

1. Open `sheets-config.js` in your project
2. Paste the URL and set `enabled: true`:

```js
const SHEETS_CONFIG = {
  enabled: true,
  scriptUrl: "https://script.google.com/macros/s/YOUR_ACTUAL_ID_HERE/exec",
};
```

3. Save the file — done! ✅

---

## Step 5 — Seed the Sheet from data.js (First Time)

1. Open `push-to-sheets.html` in your browser (double-click the file)
2. Click **"Push All to Google Sheets"**
3. All 5 sections will show ✓ Done in the log

> **Note:** The push uses `no-cors` mode which means you'll always see ✓ Done — even if something went wrong silently. To verify: open your Google Sheet and check that the data has appeared in each tab.

---

## How Non-Technical Members Update Content

1. Open the Google Sheet
2. Click the correct tab (Events, Blog, etc.)
3. Add or edit a row
4. Website updates automatically on every page load ✅

---

## How Developers Update Content

### Option A — Edit data.js → Push to Sheets

1. Edit `data.js` as usual
2. Open `push-to-sheets.html` → click Push

### Option B — Edit the Sheet directly

Non-technical members do this.

---

## How the System Works

```
Page loads
    ↓
sheets-sync.js checks: SHEETS_CONFIG.enabled?
    ↓
  YES → fetch(scriptUrl + "?sheet=Events")
           ↓ success → show sheet data
           ↓ failure → fall back to data.js (site never breaks)
    ↓
  NO  → use data.js directly
```

---

## Turning Off Live Sheets (Offline / Emergency Mode)

Open `sheets-config.js` → change `enabled: true` → `enabled: false` → save.

---

## Re-deploying After Editing the Script

If you ever change the Apps Script code:

1. Extensions → Apps Script → make your changes
2. Deploy → **Manage Deployments**
3. Click the ✏️ pencil on your existing deployment → **Version: New version** → Save

> ⚠️ Do NOT create a new deployment each time — that gives you a new URL. Always update the existing one.

---

## Troubleshooting

| Problem                              | Fix                                                                |
| ------------------------------------ | ------------------------------------------------------------------ |
| Content not updating                 | Check `enabled: true` in `sheets-config.js`                        |
| All sections show empty              | Verify tab names in the sheet match exactly (capital first letter) |
| Push shows ✓ Done but sheet is empty | Check the Apps Script editor — View → Executions — for errors      |
| "Authorization required" on deploy   | Click Authorize and allow access                                   |
| Want to revoke access                | Google Account → Security → Third-party apps → remove              |

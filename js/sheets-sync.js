/*
 * ============================================================
 *  sheets-sync.js  —  TSA IT Club CMS Engine (Google Apps Script)
 * ============================================================
 *
 *  This file powers the Google Sheets integration.
 *  It is loaded on every updatable page AFTER sheets-config.js
 *  and data.js. You never need to edit this file.
 *
 *  HOW IT WORKS:
 *  1. Page loads → this script runs.
 *  2. If SHEETS_CONFIG.enabled is true:
 *       → Fetches live data from your Google Apps Script web app.
 *       → On success → shows Sheet data.
 *       → On failure → falls back to data.js automatically.
 *  3. If SHEETS_CONFIG.enabled is false:
 *       → Uses data.js directly (no internet needed).
 *
 *  API:
 *  - window.SheetSync.load(section, callback)
 *      Loads data for a section, calls callback(dataArray).
 *      section: 'events' | 'blog' | 'projects' | 'resources' | 'team'
 *
 *  - window.SheetSync.pushSection(section, dataArray, onDone, onError)
 *      Writes data back to Google Sheets (used by push-to-sheets.html).
 *
 * ============================================================
 */

(function () {
  "use strict";

  // ── Helpers ──────────────────────────────────────────────

  /** Get local fallback data from data.js */
  function getLocalData(section) {
    if (typeof siteData !== "undefined" && Array.isArray(siteData[section])) {
      return siteData[section];
    }
    return [];
  }

  /** Capitalise first letter: 'events' → 'Events' */
  function tabName(section) {
    return section.charAt(0).toUpperCase() + section.slice(1);
  }

  /**
   * Normalise a row returned from Apps Script.
   * All values come back as strings/numbers; we fix types here.
   */
  function normaliseRow(section, row) {
    var out = {};
    for (var key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        // Trim whitespace from string values
        out[key] = typeof row[key] === "string" ? row[key].trim() : row[key];
      }
    }

    // Section-specific fixes
    if (section === "projects") {
      // tags comes as "Web App, Node.js" → ["Web App","Node.js"]
      if (typeof out.tags === "string") {
        out.tags = out.tags
          ? out.tags.split(",").map(function (t) { return t.trim(); })
          : [];
      }
    }
    if (section === "team" || section === "legacy" || section === "members") {
      if (out.type) out.type = out.type.toLowerCase().trim();
    }
    return out;
  }

  /** Filter out empty rows (where the title/name column is blank) */
  function filterEmpty(section, rows) {
    var titleKey = (section === "team" || section === "legacy" || section === "members") ? "name" : "title";
    return rows.filter(function (r) {
      return r[titleKey] && String(r[titleKey]).trim() !== "";
    });
  }

  // ── Core: Load data ──────────────────────────────────────

  /**
   * SheetSync.load(section, callback)
   * @param {string}   section  - 'events'|'blog'|'projects'|'resources'|'team'
   * @param {Function} callback - called with (dataArray)
   */
  function load(section, callback) {
    var originalCallback = callback;
    callback = function(data) {
      originalCallback(data);
      if (typeof window.refreshReveals === 'function') {
        setTimeout(window.refreshReveals, 50);
      }
    };

    var cfg = (typeof SHEETS_CONFIG !== "undefined") ? SHEETS_CONFIG : { enabled: false };

    if (!cfg.enabled || !cfg.scriptUrl || cfg.scriptUrl === "YOUR-SCRIPT-URL") {
      callback(getLocalData(section));
      return;
    }

    var url = cfg.scriptUrl + "?sheet=" + tabName(section);
    if (section === "resources" && cfg.requireApproval) {
      var sid = localStorage.getItem("club_session");
      if (sid) url += "&sid=" + encodeURIComponent(sid);
    }
    var cacheKey = "tsa_sheets_cache_" + section;

    // 1. Immediately fire callback with cached data if it exists
    var cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        var parsedCache = JSON.parse(cachedData);
        if (Array.isArray(parsedCache)) {
          console.log("[SheetSync] Loaded '" + section + "' from cache.");
          callback(parsedCache);
        }
      } catch (e) {
        console.warn("[SheetSync] Cache parse error for '" + section + "':", e);
      }
    }

    // 2. Fetch fresh data in the background
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
          // If no remote data, fallback to local data.js
          var fbData = getLocalData(section);
          localStorage.setItem(cacheKey, JSON.stringify(fbData));
          callback(fbData);
          return;
        }

        var cleaned = filterEmpty(section, rows).map(function (r) {
          return normaliseRow(section, r);
        });

        // 3. Compare with cache to avoid unnecessary re-renders
        var newStr = JSON.stringify(cleaned);
        if (cachedData !== newStr) {
          console.log("[SheetSync] Updated cache for '" + section + "'.");
          localStorage.setItem(cacheKey, newStr);
          // Fire callback again to update UI with fresh data
          callback(cleaned);
        }
      })
      .catch(function (err) {
        console.warn("[SheetSync] Failed to fetch '" + section + "'. Falling back to cache or data.js.", err);
        if (!cachedData) callback(getLocalData(section));
      });
  }

  // ── Push data back to Sheets (developer tool) ────────────

  /**
   * SheetSync.pushSection(section, dataArray, onDone, onError)
   *
   * Posts section data to the Apps Script doPost() handler.
   * Uses no-cors so the browser won't block it — the write
   * succeeds silently even if we can't read the response.
   *
   * @param {string}   section
   * @param {Array}    dataArray
   * @param {Function} onDone
   * @param {Function} onError
   */
  function pushSection(section, dataArray, onDone, onError) {
    var cfg = (typeof SHEETS_CONFIG !== "undefined") ? SHEETS_CONFIG : { enabled: false };

    if (!cfg.enabled || !cfg.scriptUrl || cfg.scriptUrl === "YOUR-SCRIPT-URL") {
      var msg = "[SheetSync] Push skipped: not configured or disabled.";
      console.warn(msg);
      if (onError) onError(new Error(msg));
      return;
    }

    // Prepare rows — convert arrays to comma-joined strings for the sheet
    var rows = dataArray.map(function (item) {
      var row = {};
      for (var key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          row[key] = Array.isArray(item[key]) ? item[key].join(", ") : item[key];
        }
      }
      return row;
    });

    var payload = JSON.stringify({
      action: "write",
      sheet: tabName(section),
      data: rows,
    });

    // Use no-cors with text/plain body — avoids CORS preflight.
    // The data IS written to the sheet; we just can't read the response.
    fetch(cfg.scriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: payload,
    })
      .then(function () {
        // With no-cors the response is opaque (type==='opaque'),
        // so we optimistically treat completion as success.
        if (onDone) onDone();
      })
      .catch(function (err) {
        console.error("[SheetSync] Push failed for '" + section + "':", err);
        if (onError) onError(err);
      });
  }

  // ── Public API ───────────────────────────────────────────
  window.SheetSync = {
    load: load,
    pushSection: pushSection,
  };
})();

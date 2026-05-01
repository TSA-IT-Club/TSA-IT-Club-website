TSA IT Club Website - Successor Guide & Changelog
This document serves as both a changelog for recent feature integrations and a comprehensive guide to understanding the club website's architecture. It is designed so that future presidents, board members, and developers can easily pick up where Mr. Uttam Shrestha left off.

1. Changelog (Version 2.0 - Legacy Integration)
   Features Additions & UI Matching:

Legacy Dashboard: Built legacy.html to catalog past executives and board members dynamically. It introduces localized UI tools like the AD/BS Date Toggle and Oldest/Newest Sort Toggle.
Google Sheets Integration (Legacy): Configured the js/sheets-sync.js engine and the local data.js database to fetch and cache a new legacy array natively.
Social Media Extension: Added future-proof integrations for X (Twitter), Facebook, Instagram, YouTube, and TikTok links to both Team and Legacy profiles. Upgraded the centralized FontAwesome library from 6.4.0 to 6.5.1 to correctly render the modern X-Twitter logo.
Dynamic CSS UI Wrap: Hardened .social-links-modal logic to ensure a perfect flex grid wrap. Links naturally cap at 4 per row and perfectly center the 5th+ elements on the row beneath them to prevent any mobile screen overflow.
Enhanced Glassmorphism UI: Enhanced the website's CSS. Profile cards now elegantly float up with an intensified blue-glow border upon hover. Nicknames (aka ...) pop distinctly using a modern primary gradient, and the primary modal background applies an intensified 12px blur overlay.
Developer Tools Moved & Paths Fixed:

The Google Sheets dev tools (push-to-sheets.html and update-data.html) were successfully moved into the private /key/ directory. All internal paths (CSS, images, JS dependencies) were dynamically repathed to point one layer up (../) so the tools remain completely operational in their new isolated location. 2. Code Architecture & Data Flow
How does the TSA website render its continuous content without needing a complex backend/database server?

The Data Engine (js/sheets-sync.js)
This website is driven entirely by a lightweight browser-caching data fetcher (js/sheets-sync.js) which acts as the "backend".

Google Sheets Syncing: When a user visits team.html or legacy.html, the script checks if SHEETS_CONFIG.enabled is true. If it is, it pings the configured Apps Script URL.
Tab Routing: It dynamically calls the respective Google Sheets tab logic (?sheet=Team, ?sheet=Legacy).
Data Protection: It applies normaliseRow to trim extra white spaces injected by board members maintaining the sheet, and sanitizes strings. It runs filterEmpty to automatically drop any empty rows in the spreadsheet.
Caching: To avoid exhausting API limits and to make the site lightning fast, it writes the API payload to localStorage. Returning visitors automatically load from Cache first, making page transitions instant.
The Local Fallback (js/data.js)
If the Google Sheets integration is disabled, deleted, or fails due to lack of an internet connection, the site immediately falls back to the hardcoded js/data.js arrays.

3. UI/UX Design System
   The platform relies on a sleek, modern "Glassmorphism" interface over a dark space-grade background.

Core CSS Variables (css/style.css)
We maintain strict CSS tokens at the very top of css/style.css:

--bg-color / --surface: Primary dark mode depths (#0f172a, #1e293b).
--primary / --accent: Brand identity colors (#3b82f6 blue, #8b5cf6 purple).
--glass-bg: rgba(30, 41, 59, 0.7) with backdrop-filter: blur(12px). This is the secret sauce to the translucent overlapping cards.
Reusable Components
.glass-panel: Used across team.html and legacy.html. Wraps data elements in glowing frosted glass.
.reveal: The Scroll-Reveal hook. Applied dynamically to items as they enter the browser viewport.
.gradient-text: For all H1/H2 header impacts. Animates a 4-color gradient loop continuously. 4. Maintenance Guide for Successors
Updating the Team or Legacy Board
Open the connected TSA IT Club CMS Google Sheet.
Navigate to the Team or Legacy tab.
Every person must have a name. If name is blank, the site skips the row.
The type field defines the visual layout wrapper on the frontend:
Setting type to exec renders the person into the wide horizontal list row (useful for Presidents/VPs).
Setting type to board (or anything else) groups them into standard 3-column square grid lists.
In the Legacy tab, ensure that the En-year (English) and Np-year (Nepali) fields are provided. The website's engine automatically scans these numbers, groups the generations seamlessly by year, and orders them dynamically via the sort controllers.
Using Private Developer Tools
If you navigate to key/update-data.html, you can auto-generate the raw code for data.js using your currently live Google Sheets info. If you navigate to key/push-to-sheets.html, you can push locally-coded changes from data.js straight UP to Google sheets and overwrite them automatically.

If you add new developer or private scripts into the /key/ directory natively, simply ensure any <link> tags or <script src="..."> tags that load resources start with ../ instead of simply js/ or css/ so they successfully map outwards into the root directory of the site ecosystem!

where is the mobile interface for the legacy page and lets design the cards for the it club members to be different than the

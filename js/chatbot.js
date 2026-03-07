/* ============================================================
 *  chatbot.js — TSA IT Club Assistant Bot
 * ============================================================
 *
 *  HOW IT WORKS:
 *  - Reads 'siteData' from data.js (READ-ONLY, never modifies it).
 *  - Matches user messages against keyword groups and returns
 *    a helpful, friendly reply.
 *  - Offers clickable redirect buttons to the relevant page.
 *
 *  TO CUSTOMISE / ADD INTENTS:
 *  - Find the INTENTS array below.
 *  - Add a new object following the existing pattern.
 *  - keywords[] — words that trigger this intent.
 *  - reply()    — function that returns an HTML string.
 *  - page       — (optional) page to redirect to.
 *  - pageLabel  — (optional) label for the redirect button.
 *
 * ============================================================ */

(function () {
    'use strict';

    /* ── Helpers ──────────────────────────────────────────────── */

    /** Escape HTML to prevent any XSS. */
    function esc(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /** Build a "Go to page" anchor button rendered inside a bubble. */
    function redirectBtn(url, label) {
        return `<a href="${url}" class="chatbot-redirect-btn">
              <i class="fa-solid fa-arrow-right"></i> ${esc(label)}
            </a>`;
    }

    /** Safely get siteData — returns empty structure if not loaded yet. */
    function getData() {
        if (typeof siteData !== 'undefined') return siteData;
        return { events: [], blog: [], projects: [], team: [], resources: [] };
    }

    // URL of our local backend (later this will be the Render URL)
    const BACKEND_URL = 'http://localhost:3000/chat';

    /* ── DOM References ───────────────────────────────────────── */

    var toggleBtn = document.getElementById('chatbot-toggle');
    var window_ = document.getElementById('chatbot-window');
    var closeBtn = document.getElementById('chatbot-close');
    var messages = document.getElementById('chatbot-messages');
    var input = document.getElementById('chatbot-input');
    var sendBtn = document.getElementById('chatbot-send');

    if (!toggleBtn || !window_ || !messages || !input) {
        // Chatbot HTML not present on this page — silently exit.
        return;
    }

    /* ── State ────────────────────────────────────────────────── */
    var isOpen = false;

    /* ── Smart Positioning: slide away from back-to-top ──────── */
    /*
     *  back-to-top appears at scrollY > 400 (same threshold as script.js).
     *  When it appears, we add .chatbot-shifted so the bot slides left.
     *  When it disappears, we remove it so the bot returns to the corner.
     */
    function updateBotPosition() {
        if (window.scrollY > 400) {
            toggleBtn.classList.add('chatbot-shifted');
        } else {
            toggleBtn.classList.remove('chatbot-shifted');
        }
    }
    window.addEventListener('scroll', updateBotPosition, { passive: true });
    updateBotPosition(); // run once on load in case page is already scrolled

    /* ── Open / Close ─────────────────────────────────────────── */

    function openChat() {
        isOpen = true;
        window_.classList.add('chatbot-open');
        toggleBtn.style.display = 'none'; // hide button while chat is open
        input.focus();
    }

    function closeChat() {
        isOpen = false;
        window_.classList.remove('chatbot-open');
        toggleBtn.style.display = 'flex'; // restore button when chat is closed
    }

    toggleBtn.addEventListener('click', function () {
        isOpen ? closeChat() : openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    /* ── Message Rendering ────────────────────────────────────── */

    /**
     * Append a message bubble to the chat window.
     * @param {string} html    — Inner HTML content for the bubble
     * @param {'bot'|'user'} sender
     */
    function appendMessage(html, sender) {
        var msgEl = document.createElement('div');
        msgEl.className = 'chatbot-msg ' + sender;

        if (sender === 'bot') {
            msgEl.innerHTML =
                '<div class="chatbot-msg-avatar"><i class="fa-solid fa-robot"></i></div>' +
                '<div class="chatbot-bubble">' + html + '</div>';
        } else {
            msgEl.innerHTML =
                '<div class="chatbot-bubble">' + html + '</div>';
        }

        messages.appendChild(msgEl);
        messages.scrollTop = messages.scrollHeight;
        return msgEl;
    }

    /**
     * Show the three-dot typing indicator, then remove it after `delay` ms.
     * Returns a Promise that resolves when the indicator is removed.
     */
    function showTyping(delay) {
        var indicator = document.createElement('div');
        indicator.className = 'chatbot-msg bot';
        indicator.innerHTML =
            '<div class="chatbot-msg-avatar"><i class="fa-solid fa-robot"></i></div>' +
            '<div class="chatbot-typing"><span></span><span></span><span></span></div>';
        messages.appendChild(indicator);
        messages.scrollTop = messages.scrollHeight;

        return new Promise(function (resolve) {
            setTimeout(function () {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
                resolve();
            }, delay);
        });
    }

    /**
     * Show quick-reply suggestion chips below the latest bot message.
     */
    function appendSuggestions(suggestions) {
        var chipEl = document.createElement('div');
        chipEl.className = 'chatbot-msg bot';
        chipEl.style.maxWidth = '100%';

        var inner = '<div class="chatbot-suggestions">';
        suggestions.forEach(function (s) {
            inner += '<button class="chatbot-chip">' + esc(s) + '</button>';
        });
        inner += '</div>';
        chipEl.innerHTML = inner;

        messages.appendChild(chipEl);
        messages.scrollTop = messages.scrollHeight;

        // Clicking a chip fires the same logic as typing
        chipEl.querySelectorAll('.chatbot-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                handleUserMessage(chip.textContent.trim());
                // Remove all remaining chip rows to avoid clutter
                var chips = messages.querySelectorAll('.chatbot-suggestions');
                chips.forEach(function (c) { if (c.parentNode) c.parentNode.parentNode.removeChild(c.parentNode); });
            });
        });
    }

    /* ── Response Logic ───────────────────────────────────────── */

    /**
     * Main entry: process a user message via the Gemini API backend
     */
    function handleUserMessage(text) {
        text = text.trim();
        if (!text) return;

        // Show user bubble
        appendMessage(esc(text), 'user');

        // Minimum delay indicator so it feels natural
        var indicatorPromise = showTyping(300); // just to show it immediately

        // Disable input while waiting
        input.disabled = true;

        fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })
            .then(response => response.json())
            .then(data => {
                indicatorPromise.then(() => {
                    if (data.error) {
                        appendMessage(`<p class="chatbot-error">${esc(data.error)}</p>`, 'bot');
                    } else {
                        // Make sure reply from AI is parsed correctly — it may contain markdown, 
                        // but we asked for simple HTML in the system prompt.
                        // To be safe against basic XSS, we rely on the backend, but we'll print as HTML.
                        appendMessage(data.reply, 'bot');
                    }
                    input.disabled = false;
                    input.focus();
                });
            })
            .catch(err => {
                indicatorPromise.then(() => {
                    console.error("Chatbot Error:", err);
                    appendMessage("<p>Oops! I couldn't connect to my brain. Please try again later. 🔌</p>", 'bot');
                    input.disabled = false;
                    input.focus();
                });
            });
    }

    /* ── Input Handling ───────────────────────────────────────── */

    sendBtn.addEventListener('click', function () {
        handleUserMessage(input.value);
        input.value = '';
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage(input.value);
            input.value = '';
        }
    });

    /* ── Greeting Message on First Open ──────────────────────── */

    var greeted = false;

    toggleBtn.addEventListener('click', function () {
        if (!greeted && isOpen) {
            greeted = true;
            setTimeout(function () {
                appendMessage(
                    '<p>Hi! 👋 I\'m <strong>TSA Bot</strong>, your club assistant.</p>' +
                    '<p>Ask me anything about our events, team, projects, or how to join!</p>',
                    'bot'
                );
                appendSuggestions(['Upcoming events', 'Meet the team', 'How to join', 'Our projects']);
            }, 350);
        }
    });

})();

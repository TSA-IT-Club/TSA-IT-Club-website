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

    /* ── Intent Definitions ───────────────────────────────────── */
    /*
     *  Each intent has:
     *    keywords  : array of lowercase strings to match against user input
     *    reply()   : function returning an HTML string (the bot's answer)
     *    page      : (optional) href for a "Take me there" button
     *    pageLabel : (optional) label text for that button
     */

    var INTENTS = [

        /* ── Greeting ─────────────────────────────────────────── */
        {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'namaste', 'good morning', 'good evening'],
            reply: function () {
                return '<p>Hey there! 👋 I\'m <strong>TSA Bot</strong>, your guide to the TSA IT Club.</p>' +
                    '<p>I can tell you about our <strong>events, team, projects, blog, resources</strong>, or how to <strong>join</strong> the club. What would you like to know?</p>';
            }
        },

        /* ── Events ───────────────────────────────────────────── */
        {
            keywords: ['event', 'events', 'happening', 'upcoming', 'schedule', 'hackathon', 'workshop', 'seminar', 'ctf', 'calendar'],
            page: 'events.html',
            pageLabel: 'View All Events',
            reply: function () {
                var data = getData();
                var events = data.events || [];

                if (events.length === 0) {
                    return '<p>There are <strong>no scheduled events</strong> at the moment, but stay tuned — exciting things are coming soon! 🚀</p>' +
                        '<p>Head over to the Events page and check back later.</p>';
                }

                var lines = events.slice(0, 3).map(function (ev) {
                    var line = '<strong>' + esc(ev.title) + '</strong>';
                    if (ev.date) line += ' — ' + esc(ev.date);
                    if (ev.time) line += ' at ' + esc(ev.time);
                    if (ev.location) line += ' 📍 ' + esc(ev.location);
                    return '<p>' + line + '</p>';
                });

                return '<p>Here are our upcoming events:</p>' + lines.join('') +
                    (events.length > 3 ? '<p>...and more on the Events page!</p>' : '');
            }
        },

        /* ── Team ─────────────────────────────────────────────── */
        {
            keywords: ['team', 'member', 'members', 'president', 'vice president', 'secretary', 'treasurer', 'lead', 'executive', 'board', 'who', 'faculty', 'advisor', 'committee', 'leadership'],
            page: 'team.html',
            pageLabel: 'Meet the Team',
            reply: function () {
                var data = getData();
                var team = data.team || [];
                var execs = team.filter(function (m) { return m.type === 'exec'; });

                if (team.length === 0) {
                    return '<p>Team info is being updated — check the Team page for the latest details.</p>';
                }

                var lines = execs.slice(0, 4).map(function (m) {
                    return '<p><strong>' + esc(m.name) + '</strong> — ' + esc(m.role) + '</p>';
                });

                return '<p>Here\'s a snapshot of our executive team:</p>' +
                    lines.join('') +
                    (team.length > execs.length
                        ? '<p>There are also ' + (team.length - execs.length) + ' board members. Check the full team page for everyone!</p>'
                        : '');
            }
        },

        /* ── Projects ─────────────────────────────────────────── */
        {
            keywords: ['project', 'projects', 'build', 'built', 'portfolio', 'app', 'application', 'software', 'github', 'work'],
            page: 'projects.html',
            pageLabel: 'See All Projects',
            reply: function () {
                var data = getData();
                var projects = data.projects || [];

                if (projects.length === 0) {
                    return '<p>We\'re finalising our project showcase — come back soon to see what we\'ve built! 🛠️</p>';
                }

                var lines = projects.slice(0, 3).map(function (p) {
                    return '<p><strong>' + esc(p.title) + '</strong> ' +
                        (p.description ? '— ' + esc(p.description) : '') + '</p>';
                });

                return '<p>We\'ve built some cool stuff! Here\'s a quick look:</p>' + lines.join('');
            }
        },

        /* ── Blog ─────────────────────────────────────────────── */
        {
            keywords: ['blog', 'article', 'post', 'read', 'write', 'insight', 'tutorial', 'news', 'tech', 'writing'],
            page: 'blog.html',
            pageLabel: 'Read our Blog',
            reply: function () {
                var data = getData();
                var blogs = data.blog || [];

                if (blogs.length === 0) {
                    return '<p>No blog posts are up yet — our writers are cooking something great! ✍️</p>';
                }

                var lines = blogs.slice(0, 3).map(function (b) {
                    return '<p><strong>' + esc(b.title) + '</strong>' +
                        (b.date ? ' <em>(' + esc(b.date) + ')</em>' : '') + '</p>';
                });

                return '<p>Check out our latest posts:</p>' + lines.join('');
            }
        },

        /* ── Resources ────────────────────────────────────────── */
        {
            keywords: ['resource', 'resources', 'material', 'download', 'pdf', 'guide', 'handbook', 'starter', 'kit', 'learn', 'learning'],
            page: 'resources.html',
            pageLabel: 'Browse Resources',
            reply: function () {
                var data = getData();
                var resources = data.resources || [];

                if (resources.length === 0) {
                    return '<p>Resources are being uploaded — check back soon! 📚</p>';
                }

                var lines = resources.slice(0, 3).map(function (r) {
                    return '<p><strong>' + esc(r.title) + '</strong>' +
                        (r.description ? ' — ' + esc(r.description) : '') + '</p>';
                });

                return '<p>Here are some free resources we\'ve shared:</p>' + lines.join('');
            }
        },

        /* ── Join / Membership ────────────────────────────────── */
        {
            keywords: ['join', 'member', 'membership', 'apply', 'register', 'sign up', 'signup', 'enroll', 'enrol', 'how to join', 'registration', 'fee', 'free'],
            page: 'index.html#contact',
            pageLabel: 'Apply Now',
            reply: function () {
                return '<p>Joining the TSA IT Club is <strong>free</strong> for all TSA College students! 🎉</p>' +
                    '<p>We welcome every skill level — from complete beginners to seasoned developers. Just fill out the short membership form and you\'re in.</p>';
            }
        },

        /* ── About / Mission / Vision ─────────────────────────── */
        {
            keywords: ['about', 'mission', 'vision', 'goal', 'purpose', 'what is', 'tsa', 'it club', 'club', 'who are you', 'what do you do'],
            page: 'index.html#about',
            pageLabel: 'Learn More About Us',
            reply: function () {
                return '<p><strong>TSA IT Club</strong> is the official technology club of TSA College. 💻</p>' +
                    '<p>Our <strong>mission</strong> is to empower students with practical, industry-relevant tech skills through hands-on projects and collaborative learning.</p>' +
                    '<p>Our <strong>vision</strong> is to be the leading hub for tech innovation on campus and beyond.</p>';
            }
        },

        /* ── Contact / Location ───────────────────────────────── */
        {
            keywords: ['contact', 'email', 'reach', 'location', 'address', 'where', 'office', 'social', 'instagram', 'discord', 'twitter'],
            page: 'index.html#contact',
            pageLabel: 'Go to Contact',
            reply: function () {
                return '<p>You can reach us at:</p>' +
                    '<p>📧 <strong>contact@tsaitclub.edu</strong></p>' +
                    '<p>📍 <strong>TSA College, Tech Block B</strong></p>' +
                    '<p>We\'re also on Instagram, Discord, and Twitter. Check the footer for our social links!</p>';
            }
        },

        /* ── FAQ ──────────────────────────────────────────────── */
        {
            keywords: ['faq', 'question', 'questions', 'common', 'beginner', 'code', 'coding', 'experience', 'need'],
            page: 'index.html#faq',
            pageLabel: 'View FAQs',
            reply: function () {
                return '<p>Great question! Here are some quick answers:</p>' +
                    '<p>🔹 <strong>Who can join?</strong> Any TSA College student!</p>' +
                    '<p>🔹 <strong>Do I need to code?</strong> Not at all — we have design, video, and management roles too.</p>' +
                    '<p>🔹 <strong>Is it free?</strong> Yes, membership is completely free.</p>' +
                    '<p>🔹 <strong>How many events per year?</strong> At least 5 major events!</p>';
            }
        },

        /* ── Help / What can you do ───────────────────────────── */
        {
            keywords: ['help', 'what can you do', 'options', 'menu', 'commands', 'list'],
            reply: function () {
                return '<p>I can answer questions about:</p>' +
                    '<p>📅 <strong>Events</strong> — upcoming workshops, hackathons</p>' +
                    '<p>👥 <strong>Team</strong> — executive & board members</p>' +
                    '<p>🛠️ <strong>Projects</strong> — our built applications</p>' +
                    '<p>📖 <strong>Blog</strong> — tech articles & tutorials</p>' +
                    '<p>📚 <strong>Resources</strong> — free downloadable guides</p>' +
                    '<p>🚀 <strong>Joining</strong> — how to become a member</p>' +
                    '<p>Just ask me anything!</p>';
            }
        }

    ]; /* END INTENTS */

    /* ── Intent Matcher ───────────────────────────────────────── */

    /**
     * Find the best matching intent for a given user message.
     * Returns the matched intent object, or null if no match.
     */
    function matchIntent(input) {
        var lower = input.toLowerCase().trim();
        var best = null;
        var bestScore = 0;

        INTENTS.forEach(function (intent) {
            var score = 0;
            intent.keywords.forEach(function (kw) {
                if (lower.indexOf(kw) !== -1) {
                    // Longer matches score higher (more specific)
                    score += kw.length;
                }
            });
            if (score > bestScore) {
                bestScore = score;
                best = intent;
            }
        });

        return bestScore > 0 ? best : null;
    }

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
     * Build and display the bot's response for a matched intent.
     */
    function respond(intent) {
        var html = intent.reply();

        // Append page redirect button if this intent has one
        if (intent.page) {
            html += redirectBtn(intent.page, intent.pageLabel || 'Take me there');
        }

        appendMessage(html, 'bot');
    }

    /**
     * Main entry: process a user message end-to-end.
     */
    function handleUserMessage(text) {
        text = text.trim();
        if (!text) return;

        // Show user bubble
        appendMessage(esc(text), 'user');

        // Simulate a short "thinking" delay
        var delay = 600 + Math.random() * 400; // 600–1000 ms

        showTyping(delay).then(function () {
            var intent = matchIntent(text);

            if (intent) {
                respond(intent);
            } else {
                // Fallback when no keyword matched
                appendMessage(
                    '<p>I\'m not sure I understand that. 🤔 Here\'s what I <em>can</em> help with:</p>' +
                    '<p>Try asking about <strong>events, team, projects, blog, resources,</strong> or <strong>how to join</strong>.</p>',
                    'bot'
                );
                appendSuggestions(['Upcoming events', 'Meet the team', 'Our projects', 'How to join']);
            }
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

/* ============================================================
 *  TSA IT Club — Chatbot Engine
 *  File: js/chatbot.js
 *
 *  ┌────────────────────────────────────────────────────────┐
 *  │  HOW TO UPDATE THIS FILE (for team members)           │
 *  │                                                        │
 *  │  ▶ Change bot name, subtitle, or greeting             │
 *  │    → Edit BOT_CONFIG in SECTION 1                     │
 *  │                                                        │
 *  │  ▶ Change the quick suggestion chips                  │
 *  │    → Edit suggestions[] in BOT_CONFIG                 │
 *  │                                                        │
 *  │  ▶ Add a new question & answer                        │
 *  │    → Add a new object to BOT_RESPONSES in SECTION 2  │
 *  │    → Each object needs:                               │
 *  │        keywords : ['word1', 'phrase2', ...]           │
 *  │        reply    : 'text' OR function() { return ''; } │
 *  │        buttons  : [{ label: '...', url: '...' }]      │
 *  │                   (optional — adds redirect button)   │
 *  │                                                        │
 *  │  ▶ Formatting in reply text:                          │
 *  │        **bold text**   → renders as bold              │
 *  │        _italic text_   → renders as italic            │
 *  │        \n              → new line                     │
 *  │                                                        │
 *  │  ✅ DO NOT edit SECTION 3 (Engine) unless you know JS │
 *  └────────────────────────────────────────────────────────┘
 * ============================================================ */

(function () {
  'use strict';

  // ════════════════════════════════════════════════════════════
  //  SECTION 1 — BOT CONFIG
  //  Edit the bot's name, greeting message, and quick-reply chips
  // ════════════════════════════════════════════════════════════

  var extConfig = (typeof CHATBOT_CONFIG !== "undefined") ? CHATBOT_CONFIG : { enabled: true };
  var BOT_CONFIG = {
    enabled    : extConfig.enabled,  // Checks the global sheets-config variable
    name       : 'TSA Assistant',
    subtitle   : 'Official TSA IT Club Bot',
    typingDelay: 900,   // milliseconds before bot reply appears (feels natural)
    greeting   : "👋 Hi there! I'm the official **TSA IT Club** assistant.\n\nI can help you with:\n• 📅 Upcoming **Events**\n• 👥 Our **Team**\n• 🛠️ Club **Projects**\n• 🙋 How to **Join**\n• 📝 **Blog** & 📚 **Resources**\n\nWhat would you like to know?",
    fallback   : "🤔 I'm not sure about that yet!\n\nTry asking me about: **events**, **team**, **projects**, **joining**, **blog**, or **resources**.",
    suggestions: ['Upcoming Events', 'Our Team', 'Projects', 'How to Join', 'Blog', 'Resources'],
  };


  // ════════════════════════════════════════════════════════════
  //  SECTION 2 — KNOWLEDGE BASE
  //
  //  Add new Q&A entries here. Each entry is an object with:
  //    keywords : array of trigger words/phrases (lowercase)
  //    reply    : string with the answer,
  //               OR a function() { return '...'; } for dynamic answers
  //    buttons  : (optional) array of { label: '...', url: '...' }
  //               → these become clickable redirect buttons
  // ════════════════════════════════════════════════════════════

  var BOT_RESPONSES = [

    // ── Greetings ──────────────────────────────────────────────
    {
      keywords: ['hello', 'hi', 'hey', 'hii', 'helo', 'hellow', 'namaste', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'],
      reply   : "👋 Hello! Great to have you here.\n\nI can answer anything about the **TSA IT Club** — events, team, projects, joining, and more.\n\nWhat would you like to know?",
    },

    // ── Upcoming Events ────────────────────────────────────────
    {
      keywords: ['event', 'upcoming', 'schedule', 'workshop', 'hackathon', 'seminar', 'when', 'next event', 'any event', 'what event', 'programme', 'program'],
      reply: function () {
        if (typeof siteData === 'undefined' || !siteData.events) {
          return '📅 Events data is still loading. Please try again in a moment!';
        }
        var events = siteData.events.filter(function (e) { return e && e.title; });
        if (events.length === 0) {
          return "📅 No upcoming events are scheduled right now.\n\nWe're always planning something exciting — check the Events page and come back soon!";
        }
        var text = '📅 **Upcoming Events:**\n\n';
        events.forEach(function (e) {
          text += '• **' + e.title + '**\n';
          text += '  📆 ' + (e.date || 'Date TBA') + ' | ' + (e.time || 'Time TBA') + '\n';
          text += '  📍 ' + (e.location || 'Location TBA') + '\n\n';
        });
        return text.trim();
      },
      buttons: [{ label: '📅 View All Events', url: 'events.html' }],
    },

    // ── Team Members ───────────────────────────────────────────
    {
      keywords: ['team', 'member', 'president', 'executive', 'board', 'staff', 'leader', 'who run', 'committee', 'club head', 'who is'],
      reply: function () {
        if (typeof siteData === 'undefined' || !siteData.team) {
          return '👥 Team data is loading. Please try again!';
        }
        var execs = siteData.team.filter(function (m) { return m.type === 'exec'; });
        if (execs.length === 0) {
          return '👥 Team info is being updated. Visit the Team page to see the latest!';
        }
        var text = '👥 **Executive Team:**\n\n';
        execs.forEach(function (m) {
          text += '• **' + m.name + '** — ' + m.role + '\n';
        });
        return text.trim();
      },
      buttons: [{ label: '👥 Meet the Full Team', url: 'team.html' }],
    },

    // ── Projects ───────────────────────────────────────────────
    {
      keywords: ['project', 'build', 'portfolio', 'work', 'develop', 'made', 'app', 'tool', 'created', 'website'],
      reply: function () {
        if (typeof siteData === 'undefined' || !siteData.projects) {
          return '🛠️ Projects data is loading. Please try again!';
        }
        var projects = siteData.projects.filter(function (p) { return p && p.title; });
        if (projects.length === 0) {
          return '🛠️ Project details are being updated. Check the Projects page!';
        }
        var text = '🛠️ **Club Projects:**\n\n';
        projects.forEach(function (p) {
          text += '• **' + p.title + '**\n  ' + (p.description || '') + '\n\n';
        });
        return text.trim();
      },
      buttons: [{ label: '🛠️ View All Projects', url: 'projects.html' }],
    },

    // ── How to Join ────────────────────────────────────────────
    {
      keywords: ['join', 'apply', 'register', 'sign up', 'enroll', 'how to join', 'become member', 'want to join', 'can i join', 'membership'],
      reply   : "🎉 Joining the TSA IT Club is **free** for all TSA College students!\n\nWe welcome **all skill levels** — from complete beginners to advanced developers. Just click below to fill out our quick 3-step application form!",
      buttons : [{ label: '🎉 Apply Now', url: 'index.html#contact' }],
    },

    // ── Membership Fee ─────────────────────────────────────────
    {
      keywords: ['fee', 'cost', 'paid', 'pay', 'price', 'charge', 'money', 'free', 'subscription'],
      reply   : "💸 Club membership is completely **free** for all TSA College students!\n\nSome external hackathons or specialized workshops may have a small registration fee, but joining the club itself costs nothing.",
    },

    // ── Blog Posts ─────────────────────────────────────────────
    {
      keywords: ['blog', 'article', 'post', 'news', 'read', 'insight', 'tutorial', 'written', 'write'],
      reply: function () {
        if (typeof siteData === 'undefined' || !siteData.blog) {
          return '📝 Blog data is loading!';
        }
        var posts = siteData.blog.filter(function (p) { return p && p.title; });
        if (posts.length === 0) {
          return "📝 No blog posts have been published yet.\n\nOur members are busy writing — check back soon!";
        }
        var text = '📝 **Latest Blog Posts:**\n\n';
        posts.forEach(function (p) {
          text += '• **' + p.title + '**';
          if (p.date) text += ' (' + p.date + ')';
          if (p.category) text += ' — _' + p.category + '_';
          text += '\n';
        });
        return text.trim();
      },
      buttons: [{ label: '📝 Read the Blog', url: 'blog.html' }],
    },

    // ── Resources ──────────────────────────────────────────────
    {
      keywords: ['resource', 'download', 'material', 'pdf', 'kit', 'handbook', 'guide', 'file', 'document', 'notes'],
      reply: function () {
        if (typeof siteData === 'undefined' || !siteData.resources) {
          return '📚 Resources data is loading!';
        }
        var items = siteData.resources.filter(function (r) { return r && r.title; });
        if (items.length === 0) {
          return '📚 Resources are being uploaded. Check the Resources page for updates!';
        }
        var text = '📚 **Available Resources:**\n\n';
        items.forEach(function (r) {
          text += '• **' + r.title + '** — ' + (r.description || '') + '\n';
        });
        return text.trim();
      },
      buttons: [{ label: '📚 Download Resources', url: 'resources.html' }],
    },

    // ── About the Club ─────────────────────────────────────────
    {
      keywords: ['about', 'what is', 'tell me', 'mission', 'vision', 'purpose', 'goal', 'what do you do', 'tsa it club', 'tsait', 'club info', 'club detail'],
      reply   : "🏫 **TSA IT Club** is the official tech community of TSA College.\n\nWe bring together passionate developers, designers & tech enthusiasts to:\n• Build real-world **projects**\n• Host **workshops** & **hackathons**\n• **Learn**, grow, and innovate together\n\n**Mission:** Empower students with practical, industry-relevant tech skills.",
      buttons : [{ label: 'ℹ️ Learn More', url: 'index.html#about' }],
    },

    // ── Contact / Location ─────────────────────────────────────
    {
      keywords: ['contact', 'email', 'reach', 'location', 'address', 'find you', 'where are', 'office'],
      reply   : "📬 **Contact TSA IT Club:**\n\n📧 **contact@tsaitclub.edu**\n📍 **TSA College, Tech Block B**\n\nOr fill out our membership form and we'll get back to you!",
      buttons : [{ label: '📬 Contact Us', url: 'index.html#contact' }],
    },

    // ── FAQ ────────────────────────────────────────────────────
    {
      keywords: ['faq', 'frequently asked', 'common question', 'beginner', 'experience', 'coding required', 'how many events', 'requirement'],
      reply   : "❓ **Frequently Asked Questions:**\n\n**Who can join?** → Any TSA College student!\n**Need coding experience?** → No — all levels are welcome!\n**Is membership free?** → Yes, completely free!\n**Events per year?** → At least 5 major events.",
      buttons : [{ label: '❓ See All FAQs', url: 'index.html#faq' }],
    },

    // ── Social Media ───────────────────────────────────────────
    {
      keywords: ['social', 'instagram', 'discord', 'twitter', 'follow', 'media', 'platform', 'online'],
      reply   : "📱 Follow TSA IT Club on social media to stay updated on events, projects & club life!\n\nYou can find all our social media links in the **footer** of every page. 👇",
    },

    // ── Positive / Thanks ──────────────────────────────────────
    {
      keywords: ['thank', 'thanks', 'thx', 'ty', 'great', 'awesome', 'cool', 'nice', 'perfect', 'helpful', 'good bot', 'amazing', 'excellent'],
      reply   : "😊 You're very welcome! Happy to help.\n\nIs there anything else you'd like to know about the **TSA IT Club**?",
    },

    // ── Goodbye ────────────────────────────────────────────────
    {
      keywords: ['bye', 'goodbye', 'see you', 'cya', 'later', 'good night', 'ok bye', 'ok thanks', 'take care'],
      reply   : "👋 Goodbye! It was great chatting with you.\n\nFeel free to come back anytime — see you around the club! 🚀",
    },

  ];


  // ════════════════════════════════════════════════════════════
  //  SECTION 3 — ENGINE
  //  Core logic: matching, rendering, event handling.
  //  ✅ No need to edit this section.
  // ════════════════════════════════════════════════════════════

  // ── Text Formatter ──────────────────────────────────────────
  // Converts **bold**, _italic_, and \n in reply text to HTML
  function formatText(text) {
    // Escape any raw HTML first to prevent XSS
    var escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Apply markdown-like formatting
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g,       '<em>$1</em>')
      .replace(/\n/g,            '<br>');
  }

  // ── Reply Resolver ──────────────────────────────────────────
  // Calls the function if reply is dynamic, otherwise returns string
  function resolveReply(reply) {
    try {
      return typeof reply === 'function' ? reply() : reply;
    } catch (err) {
      return "⚠️ Sorry, I couldn't load that information right now. Please try again!";
    }
  }

  // ── Response Matcher ────────────────────────────────────────
  // Finds the best matching BOT_RESPONSE for a user's message
  function matchResponse(input) {
    var lower     = input.toLowerCase().trim();
    var best      = null;
    var bestScore = 0;

    BOT_RESPONSES.forEach(function (item) {
      var score = 0;
      item.keywords.forEach(function (kw) {
        if (lower.indexOf(kw.toLowerCase()) !== -1) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });

    return bestScore > 0 ? best : null;
  }

  // ── DOM Builders ────────────────────────────────────────────

  function buildBotMessage(htmlContent, buttons) {
    var wrapper = document.createElement('div');
    wrapper.className = 'chatbot-msg bot';

    // Bot avatar icon
    var avatar = document.createElement('div');
    avatar.className = 'chatbot-msg-avatar';
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

    // Message bubble
    var bubble = document.createElement('div');
    bubble.className = 'chatbot-msg-bubble';
    bubble.innerHTML = htmlContent;

    // Redirect buttons (if any)
    if (buttons && buttons.length > 0) {
      var btnGroup = document.createElement('div');
      btnGroup.className = 'chatbot-btn-group';
      buttons.forEach(function (b) {
        var a = document.createElement('a');
        a.href      = b.url;
        a.className = 'chatbot-redirect-btn';
        a.innerHTML = b.label + ' <i class="fa-solid fa-arrow-right"></i>';
        btnGroup.appendChild(a);
      });
      bubble.appendChild(btnGroup);
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    return wrapper;
  }

  function buildUserMessage(text) {
    var wrapper = document.createElement('div');
    wrapper.className = 'chatbot-msg user';

    var bubble = document.createElement('div');
    bubble.className = 'chatbot-msg-bubble';
    bubble.textContent = text; // textContent = safe from XSS

    wrapper.appendChild(bubble);
    return wrapper;
  }

  function buildTypingIndicator() {
    var wrapper = document.createElement('div');
    wrapper.className = 'chatbot-typing';
    wrapper.id = 'chatbot-typing-indicator';

    var avatar = document.createElement('div');
    avatar.className = 'chatbot-msg-avatar';
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

    var dots = document.createElement('div');
    dots.className = 'chatbot-typing-bubbles';
    dots.innerHTML =
      '<div class="chatbot-typing-dot"></div>' +
      '<div class="chatbot-typing-dot"></div>' +
      '<div class="chatbot-typing-dot"></div>';

    wrapper.appendChild(avatar);
    wrapper.appendChild(dots);
    return wrapper;
  }

  // ── Core Functions ──────────────────────────────────────────

  var el = {};   // cached DOM elements
  var isOpen = false;

  function scrollToBottom() {
    if (el.messages) el.messages.scrollTop = el.messages.scrollHeight;
  }

  function appendNode(node) {
    if (el.messages) {
      el.messages.appendChild(node);
      scrollToBottom();
    }
  }

  function sendMessage(rawText) {
    var text = rawText.trim();
    if (!text) return;

    // Clear input & disable send while processing
    el.input.value = '';
    el.send.disabled = true;

    // Render user's message
    appendNode(buildUserMessage(text));

    // Hide suggestion chips after first interaction
    if (el.suggestions) el.suggestions.style.display = 'none';

    // Show typing indicator
    var typingNode = buildTypingIndicator();
    appendNode(typingNode);

    // After delay, show bot's reply
    setTimeout(function () {
      var indicator = document.getElementById('chatbot-typing-indicator');
      if (indicator) indicator.remove();

      var match = matchResponse(text);
      var replyText, buttons;

      if (match) {
        replyText = resolveReply(match.reply);
        buttons   = match.buttons || [];
      } else {
        replyText = BOT_CONFIG.fallback;
        buttons   = [];
      }

      appendNode(buildBotMessage(formatText(replyText), buttons));
      el.send.disabled = false;
      el.input.focus();
    }, BOT_CONFIG.typingDelay);
  }

  function openChat() {
    isOpen = true;
    el.root.classList.add('open');
    el.input.focus();
    // Prevent background scrolling while chat is active
    document.body.style.overflow = "hidden";
  }

  function closeChat() {
    isOpen = false;
    el.root.classList.remove('open');
    // Restore background scrolling
    document.body.style.overflow = "";
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  // ── Initialization ──────────────────────────────────────────

  function init() {
    el.root        = document.getElementById('tsa-chatbot');
    el.messages    = document.getElementById('chatbot-messages');
    el.input       = document.getElementById('chatbot-input');
    el.send        = document.getElementById('chatbot-send');
    el.suggestions = document.getElementById('chatbot-suggestions');

    // Safety check — don't run if widget isn't in the page
    if (!el.root || !el.messages || !el.input || !el.send) return;

    // Check if user has disabled the bot
    if (!BOT_CONFIG.enabled) {
      el.root.style.display = 'none';
      return;
    }

    // Set bot name from config
    var nameEl = document.getElementById('chatbot-name');
    if (nameEl) nameEl.textContent = BOT_CONFIG.name;

    // Toggle open/close
    var toggleBtn = document.getElementById('chatbot-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleChat();
    });

    // Close button inside window
    var closeBtn = document.getElementById('chatbot-close');
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    // Send button
    el.send.addEventListener('click', function () {
      sendMessage(el.input.value);
    });

    // Enter key to send
    el.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage(el.input.value);
    });

    // Click outside chat window to close
    document.addEventListener('click', function (e) {
      if (isOpen && el.root && !el.root.contains(e.target)) {
        closeChat();
      }
    });

    // Build quick-reply suggestion chips
    if (el.suggestions) {
      BOT_CONFIG.suggestions.forEach(function (label) {
        var chip = document.createElement('button');
        chip.className   = 'chatbot-chip';
        chip.textContent = label;
        chip.addEventListener('click', function () {
          sendMessage(label);
        });
        el.suggestions.appendChild(chip);
      });
    }

    // Show greeting message
    appendNode(buildBotMessage(formatText(BOT_CONFIG.greeting), []));
  }

  // Run after the DOM is fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

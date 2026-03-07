const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Topic → redirect mapping ─────────────────────────────────────────────
// We detect the topic in code and append the link ourselves (AI won't do it reliably)
const TOPIC_LINKS = [
    { keywords: ['event', 'events', 'hackathon', 'workshop', 'upcoming', 'schedule'], url: 'events.html', label: 'View Events' },
    { keywords: ['team', 'member', 'president', 'executive', 'board', 'faculty'], url: 'team.html', label: 'Meet the Team' },
    { keywords: ['project', 'projects', 'built', 'build', 'app', 'portfolio'], url: 'projects.html', label: 'See Projects' },
    { keywords: ['blog', 'article', 'post', 'read', 'writing'], url: 'blog.html', label: 'Read Blog' },
    { keywords: ['resource', 'resources', 'guide', 'download', 'material'], url: 'resources.html', label: 'Browse Resources' },
    { keywords: ['join', 'apply', 'membership', 'register', 'signup', 'sign up'], url: 'index.html#contact', label: 'Join Us' },
    { keywords: ['contact', 'email', 'reach', 'location'], url: 'index.html#contact', label: 'Contact Us' },
    { keywords: ['about', 'mission', 'vision', 'goal', 'who are you'], url: 'index.html#about', label: 'Learn More' },
];

function getRedirectLink(message) {
    const lower = message.toLowerCase();
    for (const topic of TOPIC_LINKS) {
        if (topic.keywords.some(kw => lower.includes(kw))) {
            return `<a href="${topic.url}" class="chatbot-redirect-btn"><i class="fa-solid fa-arrow-right"></i> ${topic.label}</a>`;
        }
    }
    return null;
}

// Take AI plain text reply and force it to be 2 sentences max
function shortenReply(text) {
    // Strip any HTML or markdown the AI generated
    const plain = text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\*\*/g, '')
        .replace(/#+\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    // Take first 2 sentences only
    const sentences = plain.match(/[^.!?]+[.!?]+/g) || [plain];
    return '<p>' + sentences.slice(0, 2).join(' ').trim() + '</p>';
}

// ── System prompt ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = 'You are TSA Bot, assistant for TSA IT Club at TSA College. ' +
    'Answer ONLY club questions in 1-2 plain sentences (no markdown, no HTML, no bullet points). ' +
    'For off-topic questions say: I only answer questions about the TSA IT Club. ' +
    'Club facts: free membership for TSA students, events include workshops and hackathons, ' +
    'mission is empowering students with tech skills, email contact@tsaitclub.edu';

// ── Chat endpoint ────────────────────────────────────────────────────────
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.2,
            max_tokens: 60,
        });

        // Shorten the AI text and append a redirect link based on the topic
        const aiText = response.choices[0].message.content.trim();
        let reply = shortenReply(aiText);
        const link = getRedirectLink(userMessage);
        if (link) reply += link;

        res.json({ reply });

    } catch (error) {
        console.error('=== GROQ ERROR ===');
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        res.status(500).json({ error: 'Sorry, something went wrong. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('TSA Bot Backend running on port ' + PORT);
});

require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq();

groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
        { role: 'system', content: require('./server').SYSTEM_PROMPT || 'test' },
        { role: 'user', content: 'tell me about events' }
    ],
    max_tokens: 200,
    temperature: 0.2
}).then(r => console.log('REPLY:', r.choices[0].message.content)).catch(console.error);

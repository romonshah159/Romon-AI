const fetch = require('node-fetch');

exports.handler = async (event) => {
    // শুধুমাত্র POST রিকোয়েস্ট গ্রহণ করবে
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const userMessage = body.message;

        // ১ থেকে ২০ এর মধ্যে একটি র‍্যান্ডম নম্বর
        const randomKeyNum = Math.floor(Math.random() * 20) + 1;
        const apiKey = process.env[`API_KEY_${randomKeyNum}`];

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: `API_KEY_${randomKeyNum} not found in Netlify.` }) };
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiText })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

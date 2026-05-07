const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// ─── CHART SUMMARY ───────────────────────────────────────────────────────────
export const chartSummary = async (req, reply) => {
    const { symbol, timeframe, context } = req.body;
    if (!OPENAI_API_KEY) {
        // Graceful fallback when no API key configured
        return reply.send({
            summary: `${symbol} is currently trading in a ${timeframe} timeframe. This is a placeholder AI summary. Configure OPENAI_API_KEY to enable real AI analysis.`,
            sentiment: 'NEUTRAL',
            keyLevels: [],
            patterns: []
        });
    }
    try {
        const prompt = `You are a professional financial analyst. Analyze the trading chart for ${symbol} on the ${timeframe} timeframe.
${context ? `Additional context: ${context}` : ''}

Provide:
1. A concise 2-3 sentence market summary
2. Overall sentiment: BULLISH, BEARISH, or NEUTRAL
3. Up to 3 key price levels (support/resistance)
4. Any recognizable chart patterns

Respond in JSON format: { "summary": string, "sentiment": "BULLISH"|"BEARISH"|"NEUTRAL", "keyLevels": [{"type":"support"|"resistance","price":number,"label":string}], "patterns": [string] }`;
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
                max_tokens: 500
            })
        });
        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);
        return reply.send(result);
    }
    catch (error) {
        return reply.status(500).send({ error: 'AI analysis unavailable' });
    }
};
// ─── AI ASK (SSE STREAMING) ──────────────────────────────────────────────────
export const aiAsk = async (req, reply) => {
    const { question, symbol, chartContext } = req.body;
    if (!OPENAI_API_KEY) {
        return reply.send({
            answer: `AI assistant requires an OpenAI API key. Question received: "${question}". Configure OPENAI_API_KEY in your environment to enable this feature.`
        });
    }
    const systemPrompt = `You are FinChart AI, a professional financial markets assistant embedded in a trading platform. You help traders understand charts, indicators, and market dynamics. Always include a disclaimer that this is not financial advice.${symbol ? ` The user is currently viewing ${symbol}.` : ''}`;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ],
                max_tokens: 800
            })
        });
        const data = await response.json();
        return reply.send({ answer: data.choices[0].message.content });
    }
    catch (error) {
        return reply.status(500).send({ error: 'AI service unavailable' });
    }
};
// ─── PATTERN DETECTION ───────────────────────────────────────────────────────
export const detectPatterns = async (req, reply) => {
    // Placeholder — in production this would run an ML model
    return reply.send({
        symbol: req.body.symbol,
        timeframe: req.body.timeframe,
        patterns: [],
        signalScore: 50,
        note: 'Pattern detection ML model not yet configured. Score is neutral.'
    });
};
//# sourceMappingURL=ai.controller.js.map
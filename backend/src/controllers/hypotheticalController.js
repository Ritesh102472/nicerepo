'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genai = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * POST /api/hypothetical-hit
 * Body: { name, diameterKm, velocityKmh, missDistanceKm, riskScore, isHazardous }
 * Returns an AI-generated hypothetical Earth impact scenario via Gemini.
 */
exports.hypotheticalHit = async (req, res, next) => {
  try {
    if (!genai) {
      return res.status(503).json({
        success: false,
        message: 'AI feature is not configured. Add GEMINI_API_KEY to your .env file.',
      });
    }

    const { name, diameterKm, velocityKmh, missDistanceKm, riskScore, isHazardous } = req.body;
    const diamKm = typeof diameterKm === 'number' ? diameterKm : 0;
    const diameterM = diamKm * 1000;

    const prompt = `You are an expert planetary scientist. Given an asteroid with these characteristics:
- Name: ${name || 'Unknown'}
- Diameter: ${diamKm > 0 ? diamKm.toFixed(2) : '?'} km (${diameterM > 0 ? diameterM.toFixed(0) : '?'} meters)
- Velocity: ${velocityKmh != null ? Number(velocityKmh).toLocaleString() : '?'} km/h
- Miss distance (if it were to hit): ${missDistanceKm != null ? (missDistanceKm / 1e6).toFixed(2) : '?'} million km
- Risk level: ${riskScore || 'unknown'}
- Potentially hazardous: ${isHazardous ? 'Yes' : 'No'}

Write a concise, scientifically-informed paragraph (3-5 sentences) describing what would happen if this asteroid actually hit Earth. Consider: impact energy, crater size, blast radius, regional vs global effects, tsunamis if ocean impact, climate effects. Be realistic but engaging. Use plain language.`;

    const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text()?.trim();

    if (!text) {
      return res.status(500).json({ success: false, message: 'No response from AI' });
    }

    return res.status(200).json({ success: true, scenario: text });
  } catch (error) {
    const status = error?.status === 429 ? 429 : 500;
    return res.status(status).json({
      success: false,
      message: error?.message || 'Failed to generate hypothetical impact scenario',
    });
  }
};

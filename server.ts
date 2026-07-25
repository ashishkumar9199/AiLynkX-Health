import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  let aiClient: GoogleGenAI | null = null;
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Prescription Analyzer Endpoint
  app.post('/api/analyze-prescription', async (req, res) => {
    try {
      const { textContent, imageBase64, mimeType, language } = req.body;

      if (!aiClient) {
        // Fallback simulated intelligent response if API key is missing or not provided
        return res.json({
          analysis: {
            medications: [
              { name: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily after meals', duration: '7 days', purpose: 'Antibiotic for bacterial infection' },
              { name: 'Paracetamol 650mg', dosage: '1 tablet as needed every 6 hours', duration: '3 days', purpose: 'Fever and pain relief' },
              { name: 'Pantoprazole 40mg', dosage: '1 tablet once daily before breakfast', duration: '7 days', purpose: 'Gastro-protection' }
            ],
            diagnosisNote: 'Acute upper respiratory tract infection with mild systemic inflammation.',
            instructions: [
              'Complete the full 7-day antibiotic course even if feeling better.',
              'Take Pantoprazole on an empty stomach 30 minutes before food.',
              'Stay well hydrated with warm water and rest.'
            ],
            warnings: [
              'Do not consume alcohol while taking antibiotics.',
              'Discontinue and notify doctor immediately if you develop skin rash or difficulty breathing.'
            ],
            dietaryAdvice: 'Soft, non-spicy diet. Increase warm fluids, citrus fruits for Vitamin C, and clear soups.',
            questionsForDoctor: [
              'Should I repeat a blood CBC test after completing the antibiotics?',
              'Can I take my regular daily multivitamin alongside these medications?'
            ],
            languageUsed: language || 'en',
            isSimulated: true
          }
        });
      }

      const promptText = `
You are an expert AI Clinical Pharmacist and Medical Analyzer. 
Analyze the provided prescription or medical record document.
Respond in the language specified: "${language || 'English'}".

Provide a detailed, safe, structured json response containing:
1. "diagnosisNote": Brief clinical impression or summary of what this prescription is treating.
2. "medications": Array of objects [{ "name", "dosage", "duration", "purpose" }] listing all medications identified.
3. "instructions": Array of strings for specific usage rules (timing, food, storage).
4. "warnings": Array of safety warnings, side effects, or drug interaction alerts.
5. "dietaryAdvice": Lifestyle and dietary recommendations relevant to these medications.
6. "questionsForDoctor": 2-3 important questions the patient should ask their doctor during a consultation.

Format your output STRICTLY as raw valid JSON without markdown code block formatting (or plain json object string).
`;

      const contents: any[] = [];

      if (imageBase64 && mimeType) {
        // Clean up base64 string if it contains data prefix
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: cleanBase64
          }
        });
      }

      if (textContent) {
        contents.push({ text: `Prescription content provided by patient:\n"${textContent}"\n` });
      }

      contents.push({ text: promptText });

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents
      });

      const responseText = response.text || '';
      // Clean JSON delimiters if present
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({ analysis: parsed });
      } else {
        return res.json({
          analysis: {
            rawText: responseText,
            medications: [],
            diagnosisNote: 'Analysis complete. Please review the detailed response.',
            instructions: [responseText],
            warnings: ['Always consult your prescribing physician before changing your medication regimen.'],
            dietaryAdvice: 'Follow standard dietary advice provided by your care team.',
            questionsForDoctor: ['Is my medication dosage optimal for my current condition?']
          }
        });
      }

    } catch (error: any) {
      console.error('Error analyzing prescription:', error);
      res.status(500).json({
        error: 'Failed to analyze prescription',
        details: error?.message || 'Server error during analysis'
      });
    }
  });

  // Vite middleware for development vs Production build serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Medicare Plus server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please define it in your Secrets panel or .env file.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate Questions
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const { role, skillLevel } = req.body;
      if (!role || !skillLevel) {
        return res.status(400).json({ error: "Missing required fields: role and skillLevel" });
      }

      const ai = getGeminiClient();
      const prompt = `Generate exactly 5 relevant, diverse, and realistic interview questions for a candidate interviewed for the role of ${role} with skill level or seniority of "${skillLevel}".
Provide a balanced set of questions including:
- Behavioral questions (testing company culture fit, teamwork, handling conflict, or leadership using the STAR approach)
- Technical questions (probability, specialized domain knowledge, or coding concepts depending on what's expected for this exact role)
- Scenario-based questions (analyzing a complex professional scenario or project tradeoff)
Ensure questions feel real and professional, mapped precisely to the specified role. Avoid generic high-level questions without substance.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite, highly experienced technical recruiter and engineering leader who conducts interviews. You generate high-quality questions mapped precisely to the specified role and skill level.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique id like 'q1', 'q2', 'q3', 'q4', 'q5'" },
                question: { type: Type.STRING, description: "The realistic question text." },
                type: { type: Type.STRING, description: "The type of the question: 'technical', 'behavioral', or 'scenario'" },
                rationale: { type: Type.STRING, description: "Why we ask this (interviewer's hidden agenda)." },
                tips: { type: Type.STRING, description: "What to focus on in a great answer." }
              },
              required: ["id", "question", "type", "rationale", "tips"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const questions = JSON.parse(text);
      res.json({ questions });
    } catch (error: any) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: error.message || "Failed to generate interview questions." });
    }
  });

  // API Route: Evaluate Answer
  app.post("/api/evaluate-answer", async (req, res) => {
    try {
      const { role, skillLevel, questionText, userAnswer } = req.body;
      if (!role || !skillLevel || !questionText || userAnswer === undefined) {
        return res.status(400).json({ error: "Missing required evaluation payload fields." });
      }

      const ai = getGeminiClient();
      const prompt = `Evaluate the candidate's answer to the following interview question for a "${role}" position (Skill Level: ${skillLevel}).

Question: "${questionText}"
Candidate's Answer: "${userAnswer || '[No Answer Provided / Skipped]'}"

Analyze the response's content, completeness, correct terminology, communication style, and structural strength (e.g., STAR framework for behavioral, conceptual clarity and trade-off analysis for technical).
Provide a fair, constructive evaluation score out of 100, specific lists of strengths and weaknesses, clear actionable improvement suggestions, a brief overall feedback text, and an exemplary professional model answer.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite talent coach and principal reviewer. Analyze the user's answer and give actionable, deep, yet polite feedback. Rate the answer critically but encouragingly, simulating actual corporate interview assessment panels.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "An evaluation score between 0 and 100." },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific bulleted strengths." },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detailed areas of omission or weakness." },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable concrete steps to turn this into a stellar answer." },
              feedback: { type: Type.STRING, description: "Paragraph-by-paragraph constructive feedback assessment." },
              modelAnswer: { type: Type.STRING, description: "A perfect exemplary full and detailed response. It should serve as a reference standard for the candidate." }
            },
            required: ["score", "strengths", "weaknesses", "suggestions", "feedback", "modelAnswer"]
          }
        }
      });

      const text = response.text || "{}";
      const evaluation = JSON.parse(text);
      res.json({ evaluation });
    } catch (error: any) {
      console.error("Error evaluating answer:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate answer." });
    }
  });

  // API Route: Evaluate Entire Session
  app.post("/api/evaluate-session", async (req, res) => {
    try {
      const { role, skillLevel, results } = req.body;
      if (!role || !skillLevel || !results || !Array.isArray(results)) {
        return res.status(400).json({ error: "Missing required session evaluation payload fields." });
      }

      const ai = getGeminiClient();
      
      const resultsText = results.map((r: any, idx: number) => `
--- Question ${idx + 1} (${r.type || 'General'}) ---
Question: ${r.question}
User Answer: ${r.userAnswer || "[Skipped]"}
Individual Score: ${r.score ?? 0}/100
Strengths: ${(r.strengths || []).join(", ")}
Weaknesses: ${(r.weaknesses || []).join(", ")}
`).join("\n");

      const prompt = `Perform a high-level aggregate evaluation of a candidate's completed interview session for a "${role}" position (Skill level: ${skillLevel}).
Here are the evaluated questions, responses, individual scores, strengths and weaknesses identified:
${resultsText}

Calculate an overall score across all interactions, summarize their holistic communication and role-specific readiness, and synthesize overall master strengths, critical gaps (weaknesses), and overall development plan (suggestions).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a Chief Talent Officer and senior assessor. Analyze the aggregated performance and provide high-level constructive feedback, strategic advice, and summary matrices.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER, description: "Normalized average overall rating (0-100)." },
              overallSummary: { type: Type.STRING, description: "High-level visual summary paragraph of professional readiness." },
              strengthsSummary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Major overarching themes of strength." },
              weaknessesSummary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Major aggregate gaps to address." },
              suggestionsSummary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strategic action playbooks or study topics." }
            },
            required: ["overallScore", "overallSummary", "strengthsSummary", "weaknessesSummary", "suggestionsSummary"]
          }
        }
      });

      const text = response.text || "{}";
      const aggregateEvaluation = JSON.parse(text);
      res.json({ aggregateEvaluation });
    } catch (error: any) {
      console.error("Error evaluating session:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate entire session." });
    }
  });

  // Vite middleware or static server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}

startServer();

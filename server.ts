import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Chatbot endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, canteenContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful informative fallback if API key is not configured yet
      return res.json({
        reply:
          "I am your Canteen AI Operations Assistant. The Gemini API key is currently not detected in the environment settings. Please configure `GEMINI_API_KEY` in the AI Studio Secrets panel to enable live model reasoning.\n\nIn the meantime, you can explore task tracking, project milestones, shift priorities, and progress analytics!",
      });
    }

    const systemInstruction = `You are "CanteenAI", an expert operations manager and AI copilot for modern dining facilities, university cafeterias, corporate canteens, and institutional kitchens.
You assist canteen supervisors, head chefs, and kitchen coordinators with:
- Meal rush scheduling and station balancing (Breakfast, Lunch, High Tea, Dinner)
- Task prioritization based on food safety (HACCP), timing urgency, allergen protocols, and customer queue dynamics
- Project progress monitoring (e.g., zero-waste audits, contactless kiosk rollout, seasonal menu updates)
- Shift handovers and kitchen progress summaries
- Inventory warnings and supplier reordering advice

Current Canteen State provided:
${canteenContext ? JSON.stringify(canteenContext, null, 2) : "No context provided"}

Provide clear, professional, structured, and operational advice. Use bullet points and bold highlights where appropriate. Keep answers practical for busy kitchen and floor staff.`;

    // Convert messages for chat
    const userPrompt =
      messages && messages.length > 0
        ? messages[messages.length - 1].content
        : "Hello";

    // Build context history
    const historyText = (messages || [])
      .slice(0, -1)
      .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = historyText
      ? `Previous conversation:\n${historyText}\n\nCurrent User Request: ${userPrompt}`
      : userPrompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Gemini Chat error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message || String(error),
    });
  }
});

// AI Prioritize Tasks endpoint
app.post("/api/gemini/prioritize", async (req, res) => {
  try {
    const { tasks, currentShift, mealRushTime } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Heuristic fallback ranking
      const prioritized = [...(tasks || [])].sort((a, b) => {
        const priorityWeight: Record<string, number> = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      });
      return res.json({
        prioritizedTasks: prioritized,
        summary:
          "Tasks ordered based on urgency level (Critical > High > Medium > Low). Connect Gemini API key for dynamic kitchen context reasoning.",
      });
    }

    const prompt = `You are a Head Kitchen & Canteen Operations Specialist.
Analyze these canteen operational tasks for the current shift: "${currentShift || "Lunch Shift"}" (Peak Rush in: ${mealRushTime || "35 minutes"}).

Tasks:
${JSON.stringify(tasks, null, 2)}

Re-prioritize these tasks based on:
1. Critical Food Safety & HACCP compliance (hot/cold holding temperatures, allergen segregation)
2. Immediate pre-rush bottleneck prevention (line prep, cutlery, register readiness)
3. Ongoing shift maintenance & restocking
4. Post-rush sanitation and deferred admin work

Respond in valid JSON with this exact schema:
{
  "rankedTaskIds": ["id1", "id2", ...],
  "rationale": "High-level 2-3 sentence strategic rationale for this shift ordering",
  "criticalAlert": "Any urgent warning or bottleneck to immediately address, or null"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Prioritize error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Shift Summary endpoint
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { tasks, projects, stats, shiftName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const completedCount = (tasks || []).filter((t: any) => t.status === "completed").length;
      const totalCount = (tasks || []).length;
      return res.json({
        summary: `### Shift Progress Handover (${shiftName || "Current Shift"})\n\n- **Task Velocity**: ${completedCount}/${totalCount} operational tasks completed (${Math.round((completedCount / (totalCount || 1)) * 100)}%).\n- **Service Health**: Meals served: ${stats?.mealsServed || 420}, Food Waste: ${stats?.wasteKg || 12.4}kg (Within target bounds).\n- **Pending Watchlist**: Please review remaining In-Progress items before line changeover.\n\n*(Add Gemini API key in Secrets panel for live deep-dive analysis)*`,
      });
    }

    const prompt = `Generate a concise, professional, executive Canteen Shift Progress & Handover Report.
Shift: ${shiftName || "Current Shift"}
Stats: ${JSON.stringify(stats || {})}
Tasks: ${JSON.stringify(tasks || [])}
Projects: ${JSON.stringify(projects || [])}

Structure the handover report using clean markdown:
1. Executive Snapshot (3 bullet points: completion percentage, peak rush performance, food safety compliance)
2. Key Operational Wins this Shift
3. Handover Items for Next Shift (blockers, pending defrost/marination, low stock items)
4. AI Efficiency Recommendation (food waste reduction or counter flow tip)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Task Decomposer endpoint
app.post("/api/gemini/decompose-task", async (req, res) => {
  try {
    const { objective, station } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        tasks: [
          {
            title: `Audit checklist for: ${objective}`,
            description: "Review current station SOPs and verify all staff are prepped",
            priority: "high",
            station: station || "Kitchen Prep",
            estimatedMinutes: 20,
            checklist: ["Check station cleanliness", "Verify raw ingredients", "Brief team on duties"],
          },
          {
            title: `Execute main prep steps for: ${objective}`,
            description: "Cook and batch items according to standard portioning recipe guidelines",
            priority: "critical",
            station: station || "Main Cooking Line",
            estimatedMinutes: 45,
            checklist: ["Preheat warmers", "Batch cook primary protein", "Monitor internal temp to 74C"],
          },
          {
            title: `Quality control & line handoff for: ${objective}`,
            description: "Conduct taste test, allergen check, and supply serving counters",
            priority: "medium",
            station: station || "Counter Service",
            estimatedMinutes: 15,
            checklist: ["Verify allergen labels", "Check sneeze guards", "Confirm serving utensils in place"],
          },
        ],
      });
    }

    const prompt = `You are an expert Executive Chef & Canteen Operations Planner.
The canteen supervisor wants to organize the following project or high-level objective into 3 to 5 actionable kitchen/floor tasks:
Objective: "${objective}"
Target Station/Category: "${station || "General Canteen Operations"}"

Break this down into practical, actionable canteen tasks with estimated times, station assignments, and checklist items.
Respond in valid JSON with this format:
{
  "tasks": [
    {
      "title": "Clear action title",
      "description": "Brief operational instruction",
      "priority": "critical" | "high" | "medium" | "low",
      "station": "Kitchen Prep" | "Main Cooking Line" | "Bakery & Dessert" | "Beverage & Coffee" | "Counter Service" | "Hygiene & Sanitation" | "Inventory & Storage",
      "estimatedMinutes": 30,
      "checklist": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Decompose error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Canteen Management Server running on port ${PORT}`);
  });
}

startServer();

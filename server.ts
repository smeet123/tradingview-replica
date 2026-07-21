import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on start if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or placeholder. Falling back to local AI mock.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: Analyze asset using Gemini AI
app.post("/api/analyze", async (req: Request, res: Response) => {
  const { ticker, name, price, changePercent, category, history } = req.body;

  if (!ticker) {
    res.status(400).json({ error: "Ticker is required" });
    return;
  }

  const prompt = `
    You are a professional Senior Market Analyst and Technical Strategist at an elite trading desk.
    Generate a comprehensive technical and fundamental analysis report for the following asset:
    
    - Symbol/Ticker: ${ticker}
    - Asset Name: ${name || ticker}
    - Current Price: ${price}
    - 24h Change: ${changePercent}%
    - Category: ${category || "General Market Asset"}
    
    Recent Price History Snapshot:
    ${JSON.stringify(history?.slice(-7) || "Not provided")}
    
    Please structure your report beautifully using standard markdown:
    
    ### Executive Summary
    Provide a high-conviction analysis of the asset's current state. Offer a Rating (e.g., STRONG BUY, BUY, NEUTRAL, SELL, STRONG SELL) and a high-level summary of the macro/micro technical posture.
    
    ### Key Support & Resistance Levels
    Identify critical support lines and resistance walls based on the price data. Explain why they are significant.
    
    ### Technical Indicators Analysis
    Provide simulated analysis for indicators:
    - Relative Strength Index (RSI)
    - Moving Average Convergence Divergence (MACD)
    - Key Exponential Moving Averages (EMA 20, 50, 200)
    
    ### Strategic Trade Recommendation
    Outline an actionable trade setup with:
    - Entry Range
    - Target Profit levels
    - Stop Loss levels
    - Recommended Risk management or position sizing.
    
    Keep the tone highly professional, precise, realistic, and objective. Avoid generalized disclaimers; instead, speak with the confidence of an experienced hedge-fund analyst. Keep it concise, focused, and visually scannable.
  `;

  try {
    const client = getGeminiClient();
    
    if (!client) {
      // Simulate highly realistic AI financial report if API key is not configured
      const stance = changePercent >= 0 ? "BULLISH" : "BEARISH";
      const rating = changePercent > 1.5 ? "STRONG BUY" : changePercent > 0 ? "BUY" : changePercent < -1.5 ? "STRONG SELL" : "SELL";
      const mockResult = `### Executive Summary
The technical outlook for **${ticker}** (${name || ticker}) is currently **${stance}** following a 24-hour move of **${changePercent}%**, settling at **${price}**. 

**Rating: ${rating}**

On-chain metrics and flow patterns indicate sustained interest. The primary momentum oscillators are aligning for a high-probability continuation of the current structural bias.

### Key Support & Resistance Levels
- **Primary Resistance Wall**: ${(price * 1.05).toFixed(2)} — A key horizontal pivot level representing strong distribution of supply.
- **Immediate Support Line**: ${(price * 0.96).toFixed(2)} — Corresponds with the 50-day EMA where buyer demand has historically re-emerged.
- **Macro Support Floor**: ${(price * 0.90).toFixed(2)} — Critical invalidation level for the medium-term uptrend.

### Technical Indicators Analysis
- **Relative Strength Index (RSI)**: Currently printing at **${changePercent >= 0 ? 62 : 44}**, indicating healthy momentum with considerable room before reaching extreme overbought/oversold boundaries.
- **MACD**: The signal line is hovering near zero with a subtle ${changePercent >= 0 ? "bullish crossover" : "bearish divergence"}, confirming the acceleration of short-term velocity.
- **Exponential Moving Averages (EMA)**: Price remains ${changePercent >= 0 ? "above" : "below"} the 20-EMA and 50-EMA, acting as a dynamic level of supportive demand.

### Strategic Trade Recommendation
* **Entry Range**: ${(price * 0.98).toFixed(2)} - ${price}
* **Target Profits**:
  1. Target 1: ${(price * 1.04).toFixed(2)} (Partial take-profit)
  2. Target 2: ${(price * 1.09).toFixed(2)} (Major swing high)
* **Stop Loss**: ${(price * 0.94).toFixed(2)} (Set tightly below structural support)
* **Position Sizing**: Limit total exposure to 1.5% - 2.0% of liquid trading capital. Execute with phased DCA entries to optimize cost basis.`;

      res.json({ analysis: mockResult, simulated: true });
      return;
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text, simulated: false });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: "Failed to generate AI analysis", message: error.message });
  }
});

// Configure Vite or Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    // Production server serving built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT} [ENV: ${process.env.NODE_ENV || "development"}]`);
  });
}

startServer();

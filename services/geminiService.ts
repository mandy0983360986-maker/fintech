
import { GoogleGenAI, Type } from "@google/genai";
import { StockHolding, StockPriceUpdate } from "../types";

// Always use process.env.API_KEY directly as per guidelines.
// Removed global getAiClient to ensure fresh instances with the correct key.

export const fetchStockPrices = async (stocks: StockHolding[]): Promise<StockPriceUpdate[]> => {
  if (stocks.length === 0) return [];
  
  // Initialize right before the API call using the mandatory process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const symbols = stocks.map(s => s.symbol).join(', ');
  
  const prompt = `Provide the approximate current market price for the following stock symbols: ${symbols}. 
  Return the data as a JSON array of objects with 'symbol' and 'price' (number) properties. 
  Output ONLY the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Selection for complex data extraction tasks
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              price: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    // Directly access the .text property from GenerateContentResponse
    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text.trim()) as StockPriceUpdate[];
  } catch (error) {
    console.error("Gemini failed to fetch prices:", error);
    return [];
  }
};

export const getFinancialAdvice = async (summary: string): Promise<string> => {
  // Initialize right before the API call using the mandatory process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Selection for advanced reasoning tasks
      contents: `身為一位資深財務顧問，請根據以下財務狀況摘要，提供一段專業且具備洞察力的理財建議（請使用繁體中文）： ${summary}`,
    });
    // Use the .text property to extract the result string
    return response.text || "目前無法產生建議。";
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "分析服務暫時不可用，請稍後再試。";
  }
};

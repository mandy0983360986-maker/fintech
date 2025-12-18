import { GoogleGenAI, Type } from "@google/genai";
import { StockHolding, StockPriceUpdate } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "") {
    console.warn("Gemini API Key is missing. Using fallback response.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchStockPrices = async (stocks: StockHolding[]): Promise<StockPriceUpdate[]> => {
  const ai = getAiClient();
  if (!ai) return [];

  const symbols = stocks.map(s => s.symbol).join(', ');
  
  const prompt = `Provide the approximate current market price for the following stock symbols: ${symbols}. 
  Return the data as a JSON array of objects with 'symbol' and 'price' (number) properties. 
  Output ONLY the JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // 升級為更強大的模型
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

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as StockPriceUpdate[];
  } catch (error) {
    console.error("Gemini failed to fetch prices:", error);
    return [];
  }
};

export const getFinancialAdvice = async (summary: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI 顧問目前處於離線狀態，請檢查 API Key 設定。";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // 升級為更強大的模型
      contents: `身為一位資深財務顧問，請根據以下財務狀況摘要，提供一段專業且具備洞察力的理財建議（請使用繁體中文）： ${summary}`,
    });
    return response.text || "目前無法產生建議。";
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "分析服務暫時不可用，請稍後再試。";
  }
};
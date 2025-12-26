
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

export const sendMessageToGemini = async (
  history: ChatMessage[],
  currentMessage: string
): Promise<ChatMessage> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview as per the latest senior engineer guidelines for text/search tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `Context: You are an expert AI Assistant for the International Jr Hockey World Cup. You help TLO managers, tournament officials, and volunteers.
        
        User Query: ${currentMessage}` }] }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a professional hockey tournament coordinator. Provide concise, high-accuracy answers. Use search to verify current event details if needed.",
      }
    });

    const text = response.text || "I couldn't generate a response.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { uri: string; title: string }[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri
          });
        }
      });
    }

    return {
      id: Date.now().toString(),
      role: 'model',
      text: text,
      sources: sources.length > 0 ? sources : undefined
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      id: Date.now().toString(),
      role: 'model',
      text: "Operational Intelligence Offline. Please verify your connection to the Command Center."
    };
  }
};

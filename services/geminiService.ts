import { GoogleGenAI, Type } from "@google/genai";
import { TRANSACTION_CATEGORIES, TransactionCategory } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const suggestCategory = async (description: string): Promise<TransactionCategory | null> => {
    if (!process.env.API_KEY) {
        console.error("Gemini API key is not configured.");
        await new Promise(resolve => setTimeout(resolve, 500)); 
        return 'Other'; 
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following transaction description, what is the most likely bookkeeping category? The description is: "${description}". Please choose exactly one category from this list: ${TRANSACTION_CATEGORIES.join(', ')}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: {
                            type: Type.STRING,
                            enum: [...TRANSACTION_CATEGORIES],
                            description: 'The suggested bookkeeping category.'
                        },
                    },
                    required: ['category'],
                },
                temperature: 0.2
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && TRANSACTION_CATEGORIES.includes(result.category)) {
            return result.category as TransactionCategory;
        }
        
        return null;

    } catch (error) {
        console.error("Error suggesting category with Gemini API:", error);
        return null;
    }
};

export const analyzeReceipt = async (mimeType: string, base64Data: string): Promise<{description: string; amount: number} | null> => {
    if (!process.env.API_KEY) {
        console.error("Gemini API key is not configured.");
        return null;
    }
     try {
        const imagePart = {
            inlineData: {
                mimeType,
                data: base64Data,
            },
        };
        const textPart = {
            text: 'Analyze this receipt and extract a short description (e.g., vendor name or main item) and the final total amount.'
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: {
                            type: Type.STRING,
                            description: 'A short description of the transaction from the receipt.'
                        },
                        amount: {
                            type: Type.NUMBER,
                            description: 'The total amount from the receipt.'
                        }
                    },
                    required: ['description', 'amount'],
                },
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error analyzing receipt with Gemini API:", error);
        return null;
    }
}

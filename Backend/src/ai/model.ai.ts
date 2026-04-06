import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";

// 'gemini-pro' is universally available via v1beta and highly stable.
export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview", 
    apiKey: config.GOOGLE_API_KEY,
});

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.MISTRALAI_API_KEY,
});

// Based on the error log, 'command-r' was removed.
// Switching to 'command-r-08-2024' which is the current long-term-support model.
export const cohereModel = new ChatCohere({
    model: "command-r-08-2024",
    apiKey: config.COHERE_API_KEY,
});
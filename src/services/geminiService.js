import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../config';

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are MelodyMind, a passionate and knowledgeable AI music expert.
Your goal is to provide accurate, engaging, and insightful information about songs, singers, bands, albums, and music history.

Guidelines:
1. **Scope**: Focus strictly on music-related topics (lyrics meanings, artist biographies, discographies, release dates, charts, production details).
2. **Tone**: Enthusiastic, polite, and professional. Use formatting (bolding, lists) to make answers easy to read.
3. **Grounding**: You have access to Google Search. Use it to verify release dates, latest hits, or obscure facts. 
4. **Limits**: If asked about non-music topics, politely steer the conversation back to music.
5. **Safety**: Do not generate harmful content.

When explaining lyrics, analyze the themes and emotions rather than just reciting them.
Based on the user's prompt, determine if they need to use a tool to get information about songs or artists. 
Respond with a JSON object if a tool is needed, otherwise, respond with a normal text-based answer. 
Available tools: 
- getAllSongs: Get a list of all songs. 
- getSongsByArtist: Get all songs by a specific artist. 
- getAllArtists: Get a list of all artists. 
- getArtistById: Get an artist by their ID. 
- search: Search for a song or artist. 
Example responses: 
- { "useTool": "getAllSongs" } 
- { "useTool": "getSongsByArtist", "query": "artistId" } 
- { "useTool": "search", "query": "sontung" }
`;

export const sendMessageToGemini = async (messages, newMessage) => {
    try {
        const chatHistory = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const chat = genAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }],
            },
            history: chatHistory
        });

        const result = await chat.sendMessage({
            message: newMessage
        });

        const text = result.text || "I couldn't find an answer to that, but I'm ready to try again!";
        
        // Extract grounding chunks if available
        const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { text, groundingChunks };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to get response from MelodyMind.");
    }
};


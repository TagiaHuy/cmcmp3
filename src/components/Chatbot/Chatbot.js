import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { sendMessageToGemini } from '../../services/geminiService';
import { getAllSongs2, getSongsByArtist } from '../../services/songService';
import { getAllArtists, getArtistById } from '../../services/artistService';
import { search } from '../../services/searchService';
import './Chatbot.css';

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        const newUserMessage = { sender: 'user', text };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setLoading(true);

        try {
            // First call to Gemini
            const { text: geminiText, groundingChunks } = await sendMessageToGemini(updatedMessages, text);

            let finalResponse = geminiText;
            let finalGroundingChunks = groundingChunks;

            try {
                const parsed = JSON.parse(geminiText);
                if (parsed.useTool) {
                    let toolResult = [];
                    switch (parsed.useTool) {
                        case 'getAllSongs':
                            toolResult = await getAllSongs2();
                            console.log("Tool Result from getAllSongs:", toolResult);
                            break;
                        case 'getSongsByArtist':
                            toolResult = await getSongsByArtist(parsed.query);
                            break;
                        case 'getAllArtists':
                            toolResult = await getAllArtists();
                            break;
                        case 'getArtistById':
                            toolResult = await getArtistById(parsed.query);
                            break;
                        case 'search':
                            toolResult = await search(parsed.query);
                            break;
                        default:
                            toolResult = "I'm not sure how to use that tool.";
                    }

                    // --- START OF FIX: Consolidate data extraction and stringification ---

                    // 1. Safely extract the data payload (handles Axios .data wrapper)
                    const actualData = toolResult.data || toolResult;
                    
                    // 2. Convert the clean payload into a single string
                    const toolResponseString = JSON.stringify(actualData);
                    
                    // 3. Log the clean data for debugging (instead of the full toolResult object)
                    console.log("Tool Result Data Payload:", actualData); 
                    
                    // Add AI's tool request and the tool's response to the history
                    const toolRequestMessage = { sender: 'ai', text: geminiText };
                    
                    // 4. Use the consolidated string for the tool response message
                    const toolResponseMessage = { sender: 'user', text: `Tool response: ${toolResponseString}` };
                    
                    const messagesForNextCall = [...updatedMessages, toolRequestMessage, toolResponseMessage];
                    
                    // Second call to Gemini with the tool's output
                    // 5. Use the consolidated string for the second API call to Gemini
                    const { text: finalGeminiText, groundingChunks: finalGeminiGroundingChunks } = await sendMessageToGemini(messagesForNextCall, `Tool response: ${toolResponseString}`);
                    
                    // --- END OF FIX ---

                    finalResponse = finalGeminiText;
                    finalGeminiGroundingChunks = finalGeminiGroundingChunks;
                }
            } catch (e) {
                // Not a JSON response, so treat as plain text
                // console.error("Error parsing Gemini response as JSON:", e); // Optional: Re-enable for debugging
            }

            const newAiMessage = { sender: 'ai', text: finalResponse, groundingChunks: finalGroundingChunks || [] };
            setMessages((prevMessages) => [...prevMessages, newAiMessage]);

        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>MelodyMind Chatbot</h3>
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="chatbot-messages">
                {messages.length === 0 && (
                    <div className="chatbot-welcome">
                        <p>Hello! I'm MelodyMind, your AI music encyclopedia. Ask me anything about music!</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {loading && <MessageBubble message={{ sender: 'ai', text: '...' }} />}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} loading={loading} />
        </div>
    );
};

export default Chatbot;
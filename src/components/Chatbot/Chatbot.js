import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { sendMessageToGemini } from '../../services/geminiService';
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
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setLoading(true);

        try {
            // Pass the raw messages array. The service will handle the mapping.
            const { text: geminiText, groundingChunks } = await sendMessageToGemini(messages, text);
            const newAiMessage = { sender: 'ai', text: geminiText, groundingChunks: groundingChunks || [] };
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

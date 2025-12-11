    import React, { useState, useEffect, useRef } from 'react';
    import Draggable from 'react-draggable';
    import ChatInput from './ChatInput';
    import MessageBubble from './MessageBubble';
    import { sendMessageToGemini } from '../../services/geminiService';
    import { 
        getSongsByArtistName, 
        getSongDetails, 
        getSimilarSongs, 
        getRecommendedSongs,
        getSimilarSongsByTitle,
        searchSongsByLyric
    } from '../../services/songService';
    import { getArtistBySongTitle } from '../../services/artistService';
    import { getSummary } from '../../services/statsService';
    import { useMediaActions } from '../../hooks/useMediaActions';
    import './Chatbot.css';
    
    const Chatbot = ({ onClose, initialPos }) => {
        const [messages, setMessages] = useState([]);
        const [loading, setLoading] = useState(false);
        const messagesEndRef = useRef(null);
        const { play } = useMediaActions();
        const nodeRef = useRef(null);
    
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
    
                let jsonString = geminiText;
                const match = /```json\s*([\s\S]*?)\s*```/.exec(geminiText);
                if (match) {
                    jsonString = match[1];
                }
    
                try {
                    const parsed = JSON.parse(jsonString);
                    if (parsed.useEndpoint) {
                        let toolResult = [];
                        switch (parsed.useEndpoint) {
                            case '/api/songs/by-artist':
                                toolResult = await getSongsByArtistName(parsed.params.artistName);
                                break;
                            case '/api/artists/by-song':
                                toolResult = await getArtistBySongTitle(parsed.params.songTitle);
                                break;
                            case '/api/songs/details':
                                toolResult = await getSongDetails(parsed.params.title);
                                break;
                            case '/api/songs/{songId}/similar':
                                toolResult = await getSimilarSongs(parsed.params.songId);
                                break;
                            case '/api/recommendations/songs':
                                toolResult = await getRecommendedSongs(parsed.params.mood);
                                break;
                            case '/api/songs/similar-by-title':
                                toolResult = await getSimilarSongsByTitle(parsed.params.title);
                                break;
                            case '/api/songs/search/lyric':
                                toolResult = await searchSongsByLyric(parsed.params.query);
                                break;
                            case '/api/stats/summary':
                                toolResult = await getSummary();
                                break;
                            default:
                                toolResult = "I'm not sure how to use that tool.";
                        }
    
                        const actualData = toolResult.data || toolResult;
                        const toolResponseString = JSON.stringify(actualData);
                        
                        const toolRequestMessage = { sender: 'ai', text: geminiText };
                        const toolResponseMessage = { sender: 'user', text: `Tool response: ${toolResponseString}` };
                        const messagesForNextCall = [...updatedMessages, toolRequestMessage, toolResponseMessage];
                        
                        const { text: finalGeminiText, groundingChunks: finalGeminiGroundingChunks } = await sendMessageToGemini(messagesForNextCall, `Tool response: ${toolResponseString}`);
                        
                        finalResponse = finalGeminiText;
                        finalGroundingChunks = finalGeminiGroundingChunks;
                    } else if (parsed.tool === 'play_song') {
                        const song = await getSongDetails(parsed.params.songTitle);
                        if (song) {
                            play(song);
                            finalResponse = `Now playing ${song.title} by ${song.artists}.`;
                        } else {
                            finalResponse = `Sorry, I couldn't find the song ${parsed.params.songTitle}.`;
                        }
                    }
                } catch (e) {
                    // Not a JSON response, so treat as plain text
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
            <Draggable 
                nodeRef={nodeRef} 
                handle=".chatbot-header" 
                defaultPosition={initialPos ? { x: initialPos.x - 340, y: initialPos.y - 520 } : undefined}
            >
                <div 
                    ref={nodeRef}
                    className="chatbot-container"
                >
                    <div 
                        className="chatbot-header"
                    >
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
            </Draggable>
        );
    };
    
    export default Chatbot;
    
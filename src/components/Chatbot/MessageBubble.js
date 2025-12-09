import React from 'react';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const className = isUser ? 'user-message' : 'ai-message';

    const hasGrounding = message.groundingChunks && message.groundingChunks.length > 0;

    return (
        <div className={`message-bubble-wrapper`}>
            <div className={`message-bubble ${className}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
            {hasGrounding && (
                <div className="grounding-sources">
                    <strong>Sources:</strong>
                    <ul>
                        {message.groundingChunks.map((chunk, index) => (
                            chunk.web && (
                                <li key={index}>
                                    <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer">
                                        {chunk.web.title || chunk.web.uri}
                                    </a>
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;

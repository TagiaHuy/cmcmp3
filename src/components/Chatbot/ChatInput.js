import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const ChatInput = ({ onSendMessage, loading }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [text]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !loading) {
            onSendMessage(text);
            setText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <form className="chat-input-form" onSubmit={handleSubmit}>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MelodyMind anything..."
                rows="1"
                disabled={loading}
            />
            <button type="submit" disabled={loading}>
                Send
            </button>
        </form>
    );
};

export default ChatInput;

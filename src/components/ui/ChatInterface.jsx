import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
const ChatInterface = ({ messages, onSendMessage, isTyping }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };
    const handleQuickAction = (message) => {
        onSendMessage(message);
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);
    const quickActions = [
        "État de l'irrigation",
        'Météo actuelle',
        'Humidité du sol',
        'Recommandations',
    ];
    return (_jsxs("div", { className: "bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 flex flex-col h-[600px]", children: [_jsxs("div", { className: "p-4 border-b border-slate-700/50 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center", children: _jsx(Bot, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-semibold", children: "Assistant Smart Farm" }), _jsx("p", { className: "text-xs text-slate-400", children: "Intelligence artificielle pour votre exploitation" })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] ${message.role === 'user'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                                : 'bg-slate-700/50'} rounded-2xl p-4 ${message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [message.role === 'bot' ? (_jsx(Bot, { className: "w-4 h-4 text-emerald-400" })) : (_jsx(User, { className: "w-4 h-4 text-white" })), _jsx("span", { className: "text-xs text-slate-400", children: new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }) })] }), _jsx("p", { className: "text-white leading-relaxed whitespace-pre-wrap", children: message.content }), message.role === 'bot' && message.actions && message.actions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-4", children: message.actions.map((action, index) => (_jsxs("button", { onClick: () => handleQuickAction(action.label), className: "px-3 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-3 h-3" }), action.label] }, index))) }))] }) }, message.id))), isTyping && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-slate-700/50 rounded-2xl rounded-bl-md p-4", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("div", { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("div", { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce", style: { animationDelay: '300ms' } })] }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "px-4 pb-2", children: _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 scrollbar-hide", children: quickActions.map((action) => (_jsx("button", { onClick: () => handleQuickAction(action), className: "whitespace-nowrap px-4 py-2 bg-slate-700/50 hover:bg-emerald-600 rounded-full text-sm text-slate-300 hover:text-white transition-all", children: action }, action))) }) }), _jsx("form", { onSubmit: handleSubmit, className: "p-4 border-t border-slate-700/50", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { ref: inputRef, type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), placeholder: "Posez une question...", className: "flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors" }), _jsx("button", { type: "submit", disabled: !inputValue.trim(), className: "w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: isTyping ? (_jsx(Loader2, { className: "w-5 h-5 text-white animate-spin" })) : (_jsx(Send, { className: "w-5 h-5 text-white" })) })] }) })] }));
};
export default ChatInterface;

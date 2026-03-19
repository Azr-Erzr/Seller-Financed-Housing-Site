// src/components/ChatAgent.jsx
// AI-powered chat agent for property Q&A, comparisons, and recommendations.
// Communicates with a Supabase Edge Function that proxies to Anthropic API.
// Mode-reactive (blue/emerald). Can be scoped to a specific listing or general.

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSite } from "../context/SiteContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  MessageCircle, X, Send, Bot, User, Sparkles, Loader2,
  Home, Building2, ChevronDown, Trash2, Minimize2,
} from "lucide-react";

// ── Suggested prompts (shown when chat is empty) ────────────────────
const HOME_PROMPTS = [
  "What seller-financed homes are available under $500K?",
  "Explain the difference between rent-to-own and seller finance.",
  "What are the risks for a buyer in a VTB deal?",
  "How does Power of Sale work in Ontario?",
];

const BUSINESS_PROMPTS = [
  "What commercial properties are available for seller financing?",
  "How does capital gains deferral work with a VTB?",
  "Compare the vacant land listings in Durham Region.",
  "What due diligence should I do on a commercial VTB?",
];

// ── System prompt builder ───────────────────────────────────────────
function buildSystemPrompt(mode, listings, currentListing) {
  const isBusinessMode = mode === "business";
  const modeLabel = isBusinessMode ? "Sel-Fi Business (commercial)" : "Sel-Fi Homes (residential)";
  const sellerTerm = isBusinessMode ? "vendor" : "seller";

  let listingContext = "";
  if (currentListing) {
    listingContext = `\n\nThe user is currently viewing this listing:\n${JSON.stringify(currentListing, null, 2)}`;
  }
  if (listings?.length > 0) {
    const summary = listings.slice(0, 20).map((l) => ({
      id: l.id, title: l.title, city: l.city, price: l.price,
      dealTypes: l.dealTypes, propertyType: l.propertyType || l.propertyCategory,
      bedrooms: l.bedrooms, downPayment: l.downPayment,
    }));
    listingContext += `\n\nAvailable listings (${mode} mode):\n${JSON.stringify(summary, null, 2)}`;
  }

  return `You are Sel-Fi's AI assistant, helping users navigate ${modeLabel} — a seller-financed real estate marketplace in Ontario, Canada.

ROLE:
- Answer questions about listings, seller financing, rent-to-own, and VTB mortgages
- Help compare properties and recommend matches based on budget, location, and deal preferences
- Explain Ontario-specific legal concepts (Power of Sale, title registration, capital gains reserve)
- Be warm, clear, and concise — most users are new to seller financing

RULES:
- Always use "${sellerTerm}" (not "seller") when in business mode
- Always remind users to consult a licensed Ontario real estate lawyer before entering any agreement
- When discussing financial figures, note they are estimates only
- Sel-Fi is a marketplace that facilitates introductions — not a mortgage broker, real estate agent, or legal advisor
- Keep responses focused and under 300 words unless the user asks for detail
- Reference specific listings by title/city/price when relevant
- If you don't know something, say so — don't guess at legal details

FINANCIAL CONTEXT:
- Typical residential commission: 5% (2.5% per side) + 13% HST
- Savings on $600K home: ~$33,900
- VTB interest range: 5-12%
- Commercial commission: 2-3%
- Power of Sale: 35-day minimum notice in Ontario
${listingContext}`;
}

// ── Edge function caller ────────────────────────────────────────────
async function callChatAPI(messages, systemPrompt) {
  if (!supabase) {
    // Fallback: direct Anthropic API call (requires CORS proxy or edge function)
    throw new Error("Supabase not configured. Chat requires a backend proxy.");
  }

  const { data, error } = await supabase.functions.invoke("chat-agent", {
    body: {
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      system: systemPrompt,
    },
  });

  if (error) throw new Error(error.message || "Chat request failed");
  return data?.reply || "Sorry, I couldn't generate a response. Please try again.";
}

// ── Main component ──────────────────────────────────────────────────
export default function ChatAgent({ listings = [], currentListing = null, floating = true }) {
  const { mode, MODES } = useSite();
  const { user } = useAuth();
  const isBusiness = mode === MODES.business;

  const [isOpen, setIsOpen] = useState(!floating); // non-floating starts open
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);

  const systemPrompt = buildSystemPrompt(mode, listings, currentListing);
  const suggestedPrompts = isBusiness ? BUSINESS_PROMPTS : HOME_PROMPTS;

  // ── Colors ────────────────────────────────────────────────────────
  const headerBg = isBusiness ? "bg-gradient-to-r from-emerald-600 to-emerald-700" : "bg-gradient-to-r from-blue-600 to-blue-700";
  const fabBg    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const sendBg   = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const userBubble = isBusiness ? "bg-emerald-600 text-white" : "bg-blue-600 text-white";
  const promptBorder = isBusiness ? "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50" : "border-blue-200 hover:border-blue-400 hover:bg-blue-50";
  const promptText = isBusiness ? "text-emerald-700" : "text-blue-700";
  const accentDot = isBusiness ? "bg-emerald-400" : "bg-blue-400";

  // ── Send message ──────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg = { role: "user", content, id: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const reply = await callChatAPI(newMessages, systemPrompt);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, id: Date.now() + 1 }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  // ── Floating button (when collapsed) ──────────────────────────────
  if (floating && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 ${fabBg}`}
        title="Ask Sel-Fi AI"
      >
        <Sparkles className="w-6 h-6" />
        {/* Notification dot */}
        <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${accentDot}`} />
      </button>
    );
  }

  // ── Chat panel ────────────────────────────────────────────────────
  const panelClasses = floating
    ? "fixed bottom-6 right-6 z-50 w-[400px] max-h-[600px] rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col overflow-hidden"
    : "w-full h-full rounded-2xl shadow-sm border border-gray-200 bg-white flex flex-col overflow-hidden";

  return (
    <div className={panelClasses}>
      {/* Header */}
      <div className={`px-5 py-4 flex items-center justify-between shrink-0 ${headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Sel-Fi AI</h3>
            <p className="text-[11px] text-white/70">
              {currentListing ? `Viewing: ${currentListing.title}` : (isBusiness ? "Commercial Assistant" : "Homes Assistant")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button onClick={clearChat} title="Clear chat"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {floating && (
            <button onClick={() => setIsOpen(false)} title="Close"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0" style={{ maxHeight: floating ? "400px" : "500px" }}>
        {messages.length === 0 ? (
          /* ── Empty state with suggested prompts ── */
          <div className="py-4">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className={`w-6 h-6 ${isBusiness ? "text-emerald-500" : "text-blue-500"}`} />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {currentListing ? "Ask about this property" : "How can I help?"}
              </p>
              <p className="text-xs text-gray-400">
                {currentListing
                  ? "I have full details on this listing. Ask me anything."
                  : `I can help you navigate ${isBusiness ? "commercial" : "residential"} seller-financed deals.`
                }
              </p>
            </div>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt) => (
                <button key={prompt} onClick={() => sendMessage(prompt)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl border transition-colors ${promptBorder} ${promptText}`}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message bubbles ── */
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user" ? userBubble : "bg-gray-100 text-gray-800"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isBusiness ? "bg-emerald-100" : "bg-blue-100"
                }`}>
                  <User className={`w-4 h-4 ${isBusiness ? "text-emerald-600" : "text-blue-600"}`} />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-gray-500" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-auto max-w-[90%] bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentListing ? "Ask about this property..." : "Ask about seller financing..."}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder-gray-400"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40 ${sendBg}`}>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-gray-300 text-center mt-2">
          AI responses are for informational purposes only. Always consult a licensed Ontario real estate lawyer.
        </p>
      </div>
    </div>
  );
}

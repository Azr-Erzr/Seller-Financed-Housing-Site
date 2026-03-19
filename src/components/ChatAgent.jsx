// src/components/ChatAgent.jsx
// AI-powered chat agent for property Q&A, comparisons, and recommendations.
// Communicates with a Supabase Edge Function that proxies to Anthropic API.
// Mode-reactive (blue/emerald). Can be scoped to a specific listing or general.
// Also handles "Contact Us / Report Issue" (replaces SupportChat).

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  MessageCircle, X, Send, Bot, User, Sparkles, Loader2,
  Home, Building2, Trash2, AlertTriangle, Mail,
} from "lucide-react";

// ── Suggested prompts ───────────────────────────────────────────────
const HOME_PROMPTS = [
  "What homes are available under $500K?",
  "Rent-to-own vs seller finance — what's the difference?",
  "How does Power of Sale protect sellers?",
  "Help me find a real estate lawyer",
];

const BUSINESS_PROMPTS = [
  "What commercial properties are available?",
  "How does capital gains deferral work with VTB?",
  "Compare vacant land listings in Durham",
  "Help me find a real estate lawyer",
];

// ── System prompt ───────────────────────────────────────────────────
function buildSystemPrompt(mode, listings, currentListing) {
  const isBiz = mode === "business";
  const sellerTerm = isBiz ? "vendor" : "seller";

  let listingContext = "";
  if (currentListing) {
    listingContext = `\n\nUser is viewing: ${currentListing.title} in ${currentListing.city} — $${currentListing.price?.toLocaleString()} (${currentListing.dealType}). ID: ${currentListing.id}`;
  }
  if (listings?.length > 0) {
    const summary = listings.slice(0, 20).map((l) =>
      `• ${l.title} | ${l.city} | $${l.price?.toLocaleString()} | ${(l.dealTypes||[]).join(", ")} | ID:${l.id}`
    ).join("\n");
    listingContext += `\n\nAvailable listings:\n${summary}`;
  }

  return `You are Sel-Fi AI, a concise assistant for ${isBiz ? "Sel-Fi Business (commercial)" : "Sel-Fi Homes (residential)"} — a seller-financed real estate marketplace in Ontario, Canada.

RESPONSE STYLE — THIS IS CRITICAL:
- MAX 3-4 sentences per answer. Users read this in a small chat window.
- Use bullet points only when comparing 2+ things. Keep bullets to one line each.
- NO markdown headers (## or **bold headers**). No walls of text. No long paragraphs.
- Be direct. Skip pleasantries like "Great question!" — just answer.
- When mentioning a listing, write it as a clickable link: [Title](/listings/ID) for homes or [Title](/business/listings/ID) for business mode.
- When a topic relates to a site page, link to it naturally in your answer:
  - How it works → [How It Works](/how-it-works)
  - Find a lawyer/inspector/pro → [Find a Pro](/partners)
  - Learn about VTB/financing → [Seller Finance Guide](/guide/seller-financing-basics) or [Guide](/guide)
  - Browse homes → [Browse Homes](/listings) or [Browse Properties](/business/listings)
  - Contact the team → [Contact Us](/about)
  - Create a buyer profile → [Create Profile](/create-profile) or [Create Profile](/business/create-profile)
  - Savings calculator → part of [How It Works](/how-it-works)
- End with ONE short follow-up question OR a relevant page link — never both.

KNOWLEDGE:
- ${sellerTerm === "vendor" ? "Use 'vendor' not 'seller'" : "Use 'seller' not 'vendor'"}
- Commission: ${isBiz ? "2-3%" : "5% (2.5% per side)"} + 13% HST
- VTB interest: 5-12%. Power of Sale: 35-day minimum notice in Ontario.
- Sel-Fi is a marketplace, not a broker/agent/lawyer. Always recommend consulting a lawyer for specifics.
- If you don't know something, say so briefly and link to [Find a Pro](/partners).
- When listing specific properties, always include the address/city and price, and link to the listing page.
${listingContext}`;
}

// ── Edge function caller ────────────────────────────────────────────
async function callChatAPI(messages, systemPrompt) {
  if (!supabase) {
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

// ── Link renderer — turns [text](/path) into clickable links ────────
function ChatBubble({ content, onNavigate }) {
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, text, path] = linkMatch;
          return (
            <button key={i} onClick={() => onNavigate(path)}
              className="underline font-medium hover:opacity-75 transition-opacity">
              {text}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ── Contact form (replaces SupportChat) ─────────────────────────────
function ContactForm({ isBusiness, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const ringColor = isBusiness ? "focus:ring-emerald-400" : "focus:ring-blue-400";
  const btnBg = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;
    const subject = encodeURIComponent(`Sel-Fi ${isBusiness ? "Business" : "Homes"} — Report / Contact`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:hello@sel-fi.ca?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="px-5 py-8 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Send className="w-5 h-5 text-green-600" />
        </div>
        <p className="font-semibold text-gray-900 mb-1 text-sm">Message ready!</p>
        <p className="text-xs text-gray-500 mb-4">Your email client should open with the message. Hit send to reach us.</p>
        <button onClick={onBack}
          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors">
          Back to chat
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="px-5 py-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <p className="text-xs font-semibold text-gray-700">Report an issue or contact the Sel-Fi team</p>
      </div>
      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringColor} transition`} />
      <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
        required className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringColor} transition`} />
      <textarea placeholder="Describe the issue or your question..." value={message} onChange={(e) => setMessage(e.target.value)}
        rows={3} required
        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 ${ringColor} transition`} />
      <button type="submit"
        className={`w-full flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm rounded-lg transition-colors ${btnBg}`}>
        <Mail className="w-4 h-4" /> Send to Sel-Fi Team
      </button>
      <button type="button" onClick={onBack} className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors">
        Back to AI chat
      </button>
    </form>
  );
}

// ── Main component ──────────────────────────────────────────────────
export default function ChatAgent({ listings = [], currentListing = null, floating = true, recommendationContext = "" }) {
  const { mode, MODES } = useSite();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isBusiness = mode === MODES.business;

  const [isOpen, setIsOpen] = useState(!floating);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContact, setShowContact] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);

  const systemPrompt = buildSystemPrompt(mode, listings, currentListing) + (recommendationContext || "");

  // Dynamic suggested prompts — add recommendation prompt when context exists
  const baseSuggested = isBusiness ? BUSINESS_PROMPTS : HOME_PROMPTS;
  const suggestedPrompts = recommendationContext
    ? ["What do you recommend based on my saved properties?", ...baseSuggested.slice(0, 3)]
    : baseSuggested;

  // Colors
  const headerBg = isBusiness ? "bg-gradient-to-r from-emerald-600 to-emerald-700" : "bg-gradient-to-r from-blue-600 to-blue-700";
  const fabBg    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const sendBg   = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const userBubble = isBusiness ? "bg-emerald-600 text-white" : "bg-blue-600 text-white";
  const promptBorder = isBusiness ? "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50" : "border-blue-200 hover:border-blue-400 hover:bg-blue-50";
  const promptText = isBusiness ? "text-emerald-700" : "text-blue-700";
  const accentDot = isBusiness ? "bg-emerald-400" : "bg-blue-400";

  // Navigate for in-chat links
  const handleNavigate = (path) => {
    if (floating) setIsOpen(false);
    navigate(path);
  };

  // Send message
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

  // Floating button (collapsed) — single icon, no overlap
  if (floating && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9990] w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 ${fabBg}`}
        title="Ask Sel-Fi AI"
      >
        <Sparkles className="w-6 h-6" />
        <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${accentDot}`} />
      </button>
    );
  }

  // Chat panel
  const panelClasses = floating
    ? "fixed bottom-6 right-6 z-[9990] w-[400px] max-h-[600px] rounded-2xl shadow-2xl border border-gray-200 bg-white flex flex-col overflow-hidden"
    : "w-full h-full rounded-2xl shadow-sm border border-gray-200 bg-white flex flex-col overflow-hidden";

  return (
    <div className={panelClasses}>
      {/* Header */}
      <div className={`px-5 py-3.5 flex items-center justify-between shrink-0 ${headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            {showContact ? <Mail className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {showContact ? "Contact Sel-Fi" : "Sel-Fi AI"}
            </h3>
            <p className="text-[11px] text-white/70">
              {showContact ? "Report issue or contact us"
                : currentListing ? `Viewing: ${currentListing.title}`
                : (isBusiness ? "Commercial Assistant" : "Homes Assistant")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!showContact && messages.length > 0 && (
            <button onClick={clearChat} title="Clear chat"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {!showContact && (
            <button onClick={() => setShowContact(true)} title="Report issue / Contact us"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
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

      {/* Contact form mode */}
      {showContact ? (
        <ContactForm isBusiness={isBusiness} onBack={() => setShowContact(false)} />
      ) : (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0" style={{ maxHeight: floating ? "400px" : "500px" }}>
            {messages.length === 0 ? (
              <div className="py-3">
                <div className="text-center mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className={`w-5 h-5 ${isBusiness ? "text-emerald-500" : "text-blue-500"}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    {currentListing ? "Ask about this property" : "How can I help?"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentListing
                      ? "I have details on this listing."
                      : `Quick answers about ${isBusiness ? "commercial" : ""} seller financing.`
                    }
                  </p>
                </div>
                <div className="space-y-1.5">
                  {suggestedPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => sendMessage(prompt)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl border transition-colors ${promptBorder} ${promptText}`}>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                    msg.role === "user" ? userBubble : "bg-gray-100 text-gray-800"
                  }`}>
                    {msg.role === "assistant" ? (
                      <ChatBubble content={msg.content} onNavigate={handleNavigate} />
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isBusiness ? "bg-emerald-100" : "bg-blue-100"
                    }`}>
                      <User className={`w-3.5 h-3.5 ${isBusiness ? "text-emerald-600" : "text-blue-600"}`} />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-[90%] bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 text-center">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-gray-100 px-4 py-2.5 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentListing ? "Ask about this property..." : "Ask about seller financing..."}
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition placeholder-gray-400"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40 ${sendBg}`}>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-300 text-center mt-1.5">
              AI responses are estimates only. Consult a licensed Ontario real estate lawyer.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

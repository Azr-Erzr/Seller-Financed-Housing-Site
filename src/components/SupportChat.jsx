// src/components/SupportChat.jsx
// Floating bottom-right support button.
// Opens a simple contact modal — no live chat required at MVP.
import React, { useState } from "react";
import { MessageCircle, X, Send, Mail } from "lucide-react";

export default function SupportChat() {
  const [open, setOpen]       = useState(false);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;
    // Opens user's email client with prefilled message
    const subject = encodeURIComponent("LandMatch Support Request");
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:hello@landmatch.ca?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9990] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          aria-label="Contact support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9990] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white text-sm">Chat with LandMatch</p>
              <p className="text-blue-200 text-xs mt-0.5">We typically respond within a few hours</p>
            </div>
            <button onClick={() => { setOpen(false); setSent(false); }}
              className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {sent ? (
            <div className="px-5 py-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">Message opened!</p>
              <p className="text-xs text-gray-500">Your email client should have opened with your message. Send it to reach us.</p>
              <button onClick={() => { setSent(false); setMessage(""); setName(""); setEmail(""); setOpen(false); }}
                className="mt-4 text-xs text-blue-600 hover:underline">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="px-5 py-4 space-y-3">
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 leading-relaxed">
                Have a question about seller financing, how LandMatch works, or need help with your listing?
                We're here to help.
              </div>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
                required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              <textarea placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)}
                rows={3} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors">
                <Mail className="w-4 h-4" /> Send Message
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                We'll reply to your email within a few hours on business days.
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}

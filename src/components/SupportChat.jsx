// src/components/SupportChat.jsx
// Reads mode from localStorage so it works outside the React provider tree.
// Emerald in Business mode, Blue in Homes mode.
import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send, Mail } from "lucide-react";

function getMode() {
  try { return localStorage.getItem("hm_site_mode") || "homes"; } catch { return "homes"; }
}

export default function SupportChat() {
  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [mode,    setModeVal] = useState(getMode);

  // Re-read mode when the chat opens (covers mode switches during session)
  useEffect(() => { if (open) setModeVal(getMode()); }, [open]);

  const isBusiness = mode === "business";
  const bg         = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const headerBg   = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const inputRing  = isBusiness ? "focus:ring-emerald-400" : "focus:ring-blue-400";
  const subText    = isBusiness ? "text-emerald-100" : "text-blue-100";
  const infoBox    = isBusiness ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;
    const subject = encodeURIComponent(`Sel-Fi ${isBusiness ? "Business" : "Homes"} Support`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:hello@landmatch.ca?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed bottom-6 right-6 z-[9990] w-14 h-14 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 ${bg}`}
          aria-label="Contact support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[9990] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className={`${headerBg} px-5 py-4 flex items-center justify-between`}>
            <div>
              <p className="font-semibold text-white text-sm">
                Chat with Sel-Fi {isBusiness ? "Business" : "Homes"}
              </p>
              <p className={`text-xs mt-0.5 ${subText}`}>We typically respond within a few hours</p>
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
              <p className="text-xs text-gray-500">Your email client opened with the message pre-filled. Send it to reach us.</p>
              <button onClick={() => { setSent(false); setMessage(""); setName(""); setEmail(""); setOpen(false); }}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="px-5 py-4 space-y-3">
              <div className={`rounded-xl p-3 text-xs leading-relaxed ${infoBox}`}>
                {isBusiness
                  ? "Questions about commercial VTB deals, listing a property, or finding a buyer? We're here."
                  : "Questions about seller financing, how Sel-Fi works, or need help with your listing? We're here."
                }
              </div>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${inputRing} transition`} />
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
                required className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${inputRing} transition`} />
              <textarea placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)}
                rows={3} required
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 ${inputRing} transition`} />
              <button type="submit"
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm rounded-lg transition-colors ${bg}`}>
                <Mail className="w-4 h-4" /> Send Message
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                We'll reply within a few hours on business days.
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}

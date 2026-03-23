// src/components/ContactModal.jsx
// Mega-Batch A — Mobile bottom sheet with sticky send button, collapsed templates on mobile.
// Desktop: centered modal (same as before). Mobile: true bottom sheet with drag-to-dismiss.

import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "./Toast";
import { useSite } from "../context/SiteContext";
import { useAuth } from "../context/AuthContext";
import BottomSheet from "./BottomSheet";

const BUYER_TEMPLATES = [
  "Hi, I'm interested in your listing. Could we schedule a call to discuss terms?",
  "I've reviewed the listing details and I'd like to learn more about the financing terms available.",
  "I'm pre-qualified and ready to move quickly. Would you be open to a showing?",
  "Your listing matches my profile well. I'd love to discuss a potential offer.",
];

const SELLER_TEMPLATES = [
  "Hi, your buyer profile looks like a great match for my listing. I'd love to connect.",
  "I noticed your profile and believe my property could work within your budget. Interested in chatting?",
  "Your deal preferences align well with what I'm offering. Would you like to review the details?",
  "I'm reaching out because your financial profile is a strong match for my listing terms.",
];

export default function ContactModal({
  open,
  onClose,
  recipientName,
  recipientType,
  refType,
  refId,
  refTitle,
  isAliased = false,
}) {
  const { toast } = useToast();
  const { mode, MODES } = useSite();
  const { user } = useAuth();
  const isBusiness = mode === MODES.business;

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false); // collapsed by default on mobile
  const [agreedToConfidentiality, setAgreedToConfidentiality] = useState(false);

  useEffect(() => {
    if (user?.email && !senderEmail) setSenderEmail(user.email);
  }, [user]);

  const templates = recipientType === "buyer" ? SELLER_TEMPLATES : BUYER_TEMPLATES;
  const primaryBtn = isBusiness ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300" : "bg-blue-50 border-blue-200 hover:border-blue-300";
  const charCount = message.length;
  const charLimit = 1000;

  const handleSend = async () => {
    if (!senderName.trim() || !senderEmail.trim()) { toast.error("Please enter your name and email."); return; }
    if (!message.trim()) { toast.error("Please write your inquiry."); return; }
    if (!senderEmail.includes("@")) { toast.error("Please enter a valid email."); return; }
    setSending(true);
    try {
      const payload = {
        sender_name: senderName.trim(), sender_email: senderEmail.trim(),
        recipient_name: recipientName,
        subject: `Sel-Fi ${recipientType === "buyer" ? "Invite to Deal" : "Enquiry"}: ${refTitle || ""}`,
        body: message.trim(), ref_type: refType, ref_id: String(refId), ref_title: refTitle,
        mode: isBusiness ? "business" : "homes",
      };
      if (supabase) { const { error } = await supabase.from("messages").insert(payload); if (error) throw error; }
      setSent(true);
      toast.success("Inquiry submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setSent(false); setSenderName(""); setSenderEmail(""); setMessage("");
    setShowTemplates(false); setAgreedToConfidentiality(false); onClose();
  };

  const canSend = message.trim() && senderName.trim() && senderEmail.trim() && (!isAliased || agreedToConfidentiality);

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title={recipientType === "buyer" ? "Invite to Deal" : "Send Inquiry"}
    >
      {sent ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Inquiry Submitted</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Your inquiry has been submitted to <strong>{recipientName}</strong>.
            If they're interested, they'll reach out to you at <strong>{senderEmail}</strong>.
          </p>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Note: this is an inquiry form, not real-time messaging. Both parties are
            encouraged to engage a lawyer before discussing specific deal terms.
          </p>
          <button onClick={handleClose} className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${primaryBtn}`}>
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Ref card */}
          {refTitle && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isBusiness ? "bg-emerald-100" : "bg-blue-100"}`}>
                <MessageSquare className={`w-4 h-4 ${accentText}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Re:</p>
                <p className="text-sm font-medium text-gray-800 truncate">{refTitle}</p>
              </div>
            </div>
          )}

          {/* Inputs — stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Name <span className="text-red-400">*</span></label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Email <span className="text-red-400">*</span></label>
              <input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            </div>
          </div>

          {/* Templates — collapsed by default */}
          <div>
            <button type="button" onClick={() => setShowTemplates(!showTemplates)}
              className={`flex items-center gap-1.5 text-xs font-medium mb-2 transition-colors ${accentText}`}>
              Quick messages {showTemplates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showTemplates && (
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {templates.map((t, i) => (
                  <button key={i} type="button" onClick={() => { setMessage(t); setShowTemplates(false); }}
                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-all leading-relaxed ${
                      message === t ? `${accentBg} border-2` : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}>{t}</button>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message <span className="text-red-400">*</span></label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, charLimit))}
              placeholder="Write a personal message..." rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
            <p className={`text-xs mt-1 text-right ${charCount > charLimit * 0.9 ? "text-orange-500" : "text-gray-400"}`}>
              {charCount}/{charLimit}
            </p>
          </div>

          {/* Privacy */}
          <p className="text-xs text-gray-400 leading-relaxed flex items-start gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            Your email is only used so the recipient can reply. Sel-Fi does not share contact details publicly.
          </p>

          {/* Confidentiality for aliased profiles */}
          {isAliased && (
            <label className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 cursor-pointer">
              <input type="checkbox" checked={agreedToConfidentiality}
                onChange={(e) => setAgreedToConfidentiality(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0" />
              <span className="text-xs text-amber-800 leading-relaxed">
                <strong>Confidentiality agreement:</strong> I agree not to share this buyer's personal or financial
                information outside of this platform.
              </span>
            </label>
          )}

          {/* Send — sticky at bottom on mobile */}
          <div className="flex gap-2 pt-1 sticky bottom-0 bg-white pb-1">
            <button onClick={handleSend} disabled={sending || !canSend}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${primaryBtn}`}>
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send Inquiry"}
            </button>
            <button onClick={handleClose}
              className="px-4 py-3 border border-gray-200 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors hidden sm:block">
              Cancel
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

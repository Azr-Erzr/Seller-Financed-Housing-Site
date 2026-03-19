// src/components/Toast.jsx
// Info variant now uses the site's primary color (blue for Homes, emerald for Business)
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => add(msg, "success"),
    error:   (msg) => add(msg, "error"),
    info:    (msg) => add(msg, "info"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// Read mode directly from localStorage so Toast doesn't need SiteContext
// (avoids circular provider dependency)
function getStoredMode() {
  try { return localStorage.getItem("selfi_site_mode") || "homes"; } catch { return "homes"; }
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const isBusiness = getStoredMode() === "business";

  const styles = {
    success: {
      bg:     "bg-green-50 border-green-200",
      text:   "text-green-800",
      icon:   <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />,
      close:  "text-green-400 hover:text-green-600",
    },
    error: {
      bg:     "bg-red-50 border-red-200",
      text:   "text-red-800",
      icon:   <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
      close:  "text-red-400 hover:text-red-600",
    },
    info: {
      bg:     isBusiness ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200",
      text:   isBusiness ? "text-emerald-800" : "text-blue-800",
      icon:   <Info className={`w-4 h-4 shrink-0 ${isBusiness ? "text-emerald-600" : "text-blue-500"}`} />,
      close:  isBusiness ? "text-emerald-400 hover:text-emerald-600" : "text-blue-400 hover:text-blue-600",
    },
  };

  const s = styles[toast.type] || styles.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm ${s.bg} ${s.text} animate-in`}
      style={{ animation: "slideUp 0.2s ease-out" }}
    >
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      {s.icon}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className={`shrink-0 transition-colors ${s.close}`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

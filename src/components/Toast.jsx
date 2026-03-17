// src/components/Toast.jsx
// Self-contained toast system — context + hook + renderer in one file.
// Usage:
//   1. Wrap your app in <ToastProvider> (done in App.jsx)
//   2. In any component: const { toast } = useToast()
//   3. Call: toast.success("Saved!") / toast.error("Something went wrong") / toast.info("Note")

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = "success") => {
    const id = ++_id;
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

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast: t, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const config = {
    success: { icon: <CheckCircle className="w-5 h-5 text-green-500" />, border: "border-green-200", bg: "bg-white" },
    error:   { icon: <XCircle    className="w-5 h-5 text-red-500"   />, border: "border-red-200",   bg: "bg-white" },
    info:    { icon: <Info       className="w-5 h-5 text-blue-500"  />, border: "border-blue-200",  bg: "bg-white" },
  }[t.type] || {};

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border
        ${config.bg} ${config.border}
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
      style={{ minWidth: 260, maxWidth: 380 }}
    >
      {config.icon}
      <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
      <button
        onClick={() => onRemove(t.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

import React from "react";

export default function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`bg-white rounded-2xl ring-1 ring-black/10 shadow-soft ${wide ? "max-w-4xl" : "max-w-xl"} w-full`}>
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="px-3 py-1 rounded-full border text-sm" onClick={onClose}>Close</button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
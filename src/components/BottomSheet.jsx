// src/components/BottomSheet.jsx
// Batch 13 — Reusable bottom sheet for mobile (<640px).
// On desktop, renders as a centered modal (same as existing Modal behavior).
// On mobile, slides up from bottom with drag-to-dismiss, safe-area insets.

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

const DRAG_CLOSE_THRESHOLD = 100; // px drag down to dismiss

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  className = "",
  // If true, always render as bottom sheet even on desktop (e.g., map card tray)
  forceSheet = false,
}) {
  const sheetRef = useRef(null);
  const dragStartY = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [closing, setClosing] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setClosing(false);
      setDragOffset(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setDragOffset(0);
      onClose?.();
    }, 200);
  }, [onClose]);

  // Drag to dismiss handlers
  const onTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (dragStartY.current == null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) {
      setDragOffset(delta);
    }
  };

  const onTouchEnd = () => {
    if (dragOffset > DRAG_CLOSE_THRESHOLD) {
      handleClose();
    } else {
      setDragOffset(0);
    }
    dragStartY.current = null;
  };

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  if (!open && !closing) return null;

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Desktop: centered modal / Mobile: bottom sheet */}
      {/* Desktop variant */}
      <div
        className={`hidden ${forceSheet ? "" : "sm:flex"} items-center justify-center absolute inset-0 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto transition-all duration-200 ${
            closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } ${className}`}
        >
          {title && (
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>

      {/* Mobile: bottom sheet variant */}
      <div
        ref={sheetRef}
        className={`${forceSheet ? "flex" : "sm:hidden flex"} flex-col absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] transition-transform duration-200 ${
          closing ? "translate-y-full" : "translate-y-0"
        } ${className}`}
        style={{
          transform: closing
            ? "translateY(100%)"
            : dragOffset > 0
            ? `translateY(${dragOffset}px)`
            : "translateY(0)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-5 pb-3 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}

// src/components/NDA.jsx
// On-platform confidentiality commitment — NOT a legally binding NDA.
// G7: Strengthened disclaimer language, clearer scope statement,
//     marketplace compliance note, explicit "not legal advice" framing.

import React, { useState } from "react";
import Modal from "./Modal";
import { Btn } from "../ui/UIComponents.jsx";
import { AlertTriangle, Lock, Info } from "lucide-react";

export default function NDA({ open, onClose, alias = "the seller", onApprove }) {
  const [agree, setAgree] = useState(false);

  const handleClose = () => {
    setAgree(false);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Confidentiality Commitment">
      <div className="space-y-4 text-sm">

        {/* Scope notice */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>This is an on-platform confidentiality commitment, not a legally binding NDA.</strong>{" "}
            It creates a good-faith expectation of privacy between you and{" "}
            <strong>{alias}</strong>. For a legally enforceable non-disclosure agreement,
            engage a licensed Ontario real estate lawyer.
          </p>
        </div>

        {/* Commitment text */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
          <p className="text-gray-700 leading-relaxed">
            By proceeding, you commit that any non-public information shared by{" "}
            <strong>{alias}</strong> — including property details, financial figures, photos,
            and any documents unlocked through this platform — will be:
          </p>
          <ul className="space-y-1.5 pl-2">
            {[
              "Used only to evaluate a potential transaction with this seller",
              "Not shared with any third party without the seller's written consent",
              "Handled with the same care you would expect for your own private information",
              "Deleted or returned if the transaction does not proceed",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <Lock className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Marketplace disclaimer */}
        <div className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
          <p>
            Sel-Fi facilitates introductions between buyers and sellers. Sel-Fi is not a party to
            this commitment and does not act as a broker, agent, lawyer, or intermediary in any
            transaction. This commitment is between you and the listing party only.
          </p>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5 cursor-pointer hover:bg-blue-100 transition-colors">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
          />
          <span className="text-xs text-blue-800 leading-relaxed">
            I understand this is a good-faith confidentiality commitment and agree to handle
            any information shared by <strong>{alias}</strong> with care and discretion.
          </span>
        </label>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <Btn tone="accent" disabled={!agree} onClick={() => { onApprove?.(); handleClose(); }}>
            Accept &amp; Unlock Documents
          </Btn>
          <Btn className="border" onClick={handleClose}>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
}

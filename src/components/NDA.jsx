import React, { useState } from "react";
import Modal from "./Modal";
import { Btn } from "../ui/UIComponents.jsx";

export default function NDA({ open, onClose, alias = "the seller", onApprove }) {
  const [agree, setAgree] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Non-Disclosure Agreement">
      <div className="space-y-3 text-sm">
        <p>
          By continuing you agree to keep all non-public information shared by <b>{alias}</b> confidential and to use it only
          for evaluating a potential transaction. You shall not share documents or data with third parties without written consent.
        </p>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
          <span>I agree to the above terms.</span>
        </label>
        <div className="pt-2 flex gap-2">
          <Btn tone="accent" disabled={!agree} onClick={() => { onApprove?.(); onClose?.(); }}>Accept & Unlock</Btn>
          <Btn className="border" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
}
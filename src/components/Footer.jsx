import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-semibold mb-2">Marketplace</div>
          <ul className="space-y-1 text-neutral-600">
            <li><a className="hover:underline" href="#">Homes</a></li>
            <li><a className="hover:underline" href="#">Buyers</a></li>
            <li><a className="hover:underline" href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Support</div>
          <ul className="space-y-1 text-neutral-600">
            <li><a className="hover:underline" href="#">Safety & NDAs</a></li>
            <li><a className="hover:underline" href="#">Verification</a></li>
            <li><a className="hover:underline" href="#">Contact</a></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="font-semibold mb-2">About</div>
          <p className="text-neutral-600">
            HomeMatch connects property owners with buyers through transparent seller-finance and rent-to-own options.
            We help both sides align on goals, risk tolerance, and terms—then facilitate a safe, simple negotiation.
          </p>
        </div>
      </div>
      <div className="border-t text-center text-xs text-neutral-500 py-3">
        © {new Date().getFullYear()} HomeMatch
      </div>
    </footer>
  );
}
// src/components/business/CommListingCard.jsx
// Enhanced commercial card — days on market, color-coded category, richer details
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Ruler, Building, Truck, Check } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%23f0fdf4'/%3E%3Cpath d='M120 380h560v-28H120v28Zm60-68h440l-110-120-124 138-46-52-160 162z' fill='%2386efac'/%3E%3C/svg%3E";

// Color-coded category badges (used in filters too — keep in sync)
const categoryBadgeStyles = {
  "Vacant Land":              { bg: "bg-lime-600", text: "text-white" },
  "Agricultural / Farm":      { bg: "bg-green-600", text: "text-white" },
  "Development Land":         { bg: "bg-amber-600", text: "text-white" },
  "Commercial Building":      { bg: "bg-blue-600", text: "text-white" },
  "Industrial / Warehouse":   { bg: "bg-slate-600", text: "text-white" },
  "Multi-Unit / Apartment":   { bg: "bg-purple-600", text: "text-white" },
  "Waterfront / Recreational":{ bg: "bg-cyan-600", text: "text-white" },
  "Special Purpose":          { bg: "bg-orange-600", text: "text-white" },
};

const categoryTagStyles = {
  "Vacant Land":              "bg-lime-50 text-lime-700",
  "Agricultural / Farm":      "bg-green-50 text-green-700",
  "Development Land":         "bg-amber-50 text-amber-700",
  "Commercial Building":      "bg-blue-50 text-blue-700",
  "Industrial / Warehouse":   "bg-slate-50 text-slate-700",
  "Multi-Unit / Apartment":   "bg-purple-50 text-purple-700",
  "Waterfront / Recreational":"bg-cyan-50 text-cyan-700",
  "Special Purpose":          "bg-orange-50 text-orange-700",
};

const getDealBadgeStyle = (dt) => {
  if (!dt) return "bg-emerald-600";
  const d = dt.toLowerCase();
  if (d.includes("rent"))    return "bg-purple-600";
  if (d.includes("lease"))   return "bg-amber-600";
  if (d.includes("private")) return "bg-gray-600";
  return "bg-emerald-600";
};

export default function CommListingCard({ listing }) {
  const [imgOk, setImgOk] = useState(true);
  const catBadge = categoryBadgeStyles[listing.propertyCategory] || { bg: "bg-emerald-600", text: "text-white" };
  const catTag   = categoryTagStyles[listing.propertyCategory] || "bg-gray-100 text-gray-600";
  const priceStr = listing.price >= 1000000 ? `$${(listing.price/1000000).toFixed(1)}M` : `$${listing.price?.toLocaleString()}`;
  const pricePerAcre = listing.acreage > 0 ? Math.round(listing.price / listing.acreage) : null;

  return (
    <Link to={`/business/listings/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">

        {/* Image */}
        <div className="relative h-52 bg-emerald-50">
          <img
            src={imgOk && listing.image ? listing.image : PLACEHOLDER}
            alt={listing.title}
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover"
          />
          {/* Deal type — top right — color coded */}
          {listing.dealType && (
            <div className={`absolute top-3 right-3 ${getDealBadgeStyle(listing.dealType)} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow`}>
              {listing.dealType}
            </div>
          )}
          {/* Category — top left — color coded */}
          {listing.propertyCategory && (
            <div className={`absolute top-3 left-3 ${catBadge.bg} ${catBadge.text} text-xs font-semibold px-2.5 py-1 rounded-full shadow`}>
              {listing.propertyCategory}
            </div>
          )}
          {/* Days on market — bottom left */}
          {listing.daysOnMarket != null && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm">
              {listing.daysOnMarket === 0 ? "Just listed" : listing.daysOnMarket === 1 ? "1 day on market" : `${listing.daysOnMarket} days on market`}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-2xl font-bold text-emerald-700">{priceStr}</p>
            {pricePerAcre && listing.acreage >= 1 && (
              <span className="text-[10px] text-gray-400 shrink-0 mt-1.5">
                ${pricePerAcre.toLocaleString()}/acre
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-800 mb-0.5 truncate">{listing.title}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3" />{listing.address}, {listing.city}
          </p>

          {/* Key stats */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            {listing.acreage && (
              <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5 text-gray-400" />{listing.acreage} acres</span>
            )}
            {listing.buildingSqft && (
              <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-gray-400" />{listing.buildingSqft.toLocaleString()} sqft</span>
            )}
            {listing.loadingDocks && (
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-gray-400" />{listing.loadingDocks} docks</span>
            )}
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5">
            {listing.zoning && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{listing.zoning}</span>
            )}
            {listing.environmentalStatus && listing.environmentalStatus.includes("Clean") && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex items-center gap-0.5"><Check className="w-3 h-3"/> Env Clean</span>
            )}
            {listing.frontage && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{listing.frontage}</span>
            )}
            {listing.propertyTax && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">${listing.propertyTax.toLocaleString()}/yr tax</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

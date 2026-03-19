// src/components/ListingCard.jsx
// Enhanced card with richer property info, days on market, color-coded deal badge
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Square, Car, Home } from "lucide-react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Cpath d='M120 380h560v-28H120v28Zm60-68h440l-110-120-124 138-46-52-160 162z' fill='%239ca3af'/%3E%3C/svg%3E";

const getDealBadgeStyle = (dealType) => {
  if (!dealType) return { bg: "bg-gray-500", text: "text-white" };
  const d = dealType.toLowerCase();
  if (d.includes("rent"))    return { bg: "bg-purple-600", text: "text-white" };
  if (d.includes("lease"))   return { bg: "bg-amber-600", text: "text-white" };
  if (d.includes("private")) return { bg: "bg-emerald-600", text: "text-white" };
  return { bg: "bg-blue-600", text: "text-white" };
};

const getPropTypeStyle = (type) => {
  if (!type) return "bg-gray-100 text-gray-600";
  if (type.includes("Single"))      return "bg-blue-50 text-blue-700";
  if (type.includes("Town"))        return "bg-indigo-50 text-indigo-700";
  if (type.includes("Semi"))        return "bg-teal-50 text-teal-700";
  if (type.includes("Condo"))       return "bg-violet-50 text-violet-700";
  if (type.includes("Multi"))       return "bg-rose-50 text-rose-700";
  return "bg-gray-100 text-gray-600";
};

const getMatchColor = (score) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-green-400";
  if (score >= 55) return "bg-yellow-400";
  return "bg-orange-400";
};

const StarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ListingCard({ listing, matchScore }) {
  const [imgOk, setImgOk] = useState(true);
  const score = matchScore ?? listing.matchScore ?? null;
  const dealStyle = getDealBadgeStyle(listing.dealType);

  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">

        {/* Image */}
        <div className="relative h-52 bg-gray-100">
          <img
            src={imgOk && listing.image ? listing.image : PLACEHOLDER}
            alt={listing.title}
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover"
          />

          {/* Match score — top left */}
          {score !== null && (
            <div className={`absolute top-3 left-3 ${getMatchColor(score)} text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow`}>
              <StarIcon />
              <span>{score}%</span>
            </div>
          )}

          {/* Deal type — top right — color coded */}
          {listing.dealType && (
            <div className={`absolute top-3 right-3 ${dealStyle.bg} ${dealStyle.text} px-2.5 py-1 rounded-full text-xs font-semibold shadow`}>
              {listing.dealType}
            </div>
          )}

          {/* Days on market — bottom left */}
          {listing.daysOnMarket != null && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm">
              {listing.daysOnMarket === 0 ? "Just listed" : listing.daysOnMarket === 1 ? "1 day on market" : `${listing.daysOnMarket} days on market`}
            </div>
          )}

          {/* Demo badge — bottom right */}
          {listing.isDemo && (
            <div className="absolute bottom-3 right-3 bg-amber-500/90 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm">
              Sample Listing
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-2xl font-bold text-blue-600">
              ${listing.price?.toLocaleString()}
            </p>
            {listing.propertyTax && (
              <span className="text-[10px] text-gray-400 shrink-0 mt-1.5">
                ${listing.propertyTax.toLocaleString()}/yr tax
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {listing.address}, {listing.city}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{listing.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4 text-gray-400" />
              <span>{listing.sqft?.toLocaleString()} sqft</span>
            </div>
            {listing.parkingSpaces > 0 && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4 text-gray-400" />
                <span>{listing.parkingSpaces}</span>
              </div>
            )}
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5">
            {listing.propertyType && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getPropTypeStyle(listing.propertyType)}`}>
                {listing.propertyType}
              </span>
            )}
            {listing.basement && listing.basement !== "None" && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {listing.basement === "Finished" ? "Finished Bsmt" : listing.basement === "Partially Finished" ? "Partial Bsmt" : "Bsmt"}
              </span>
            )}
            {listing.yearBuilt && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                Built {listing.yearBuilt}
              </span>
            )}
            {listing.lot && listing.lot !== "—" && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {listing.lot}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

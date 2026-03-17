// src/components/ListingCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Square } from "lucide-react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Cpath d='M120 380h560v-28H120v28Zm60-68h440l-110-120-124 138-46-52-160 162z' fill='%239ca3af'/%3E%3C/svg%3E";

const getDealBadgeStyle = (dealType) => {
  if (!dealType) return "bg-gray-100 text-gray-600";
  if (dealType.toLowerCase().includes("rent")) return "bg-purple-100 text-purple-700";
  if (dealType.toLowerCase().includes("lease")) return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
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

  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">

        {/* Image */}
        <div className="relative h-48 bg-gray-100">
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

          {/* Deal type — top right */}
          {listing.dealType && (
            <div className={`absolute top-3 right-3 ${getDealBadgeStyle(listing.dealType)} px-2.5 py-1 rounded-full text-xs font-medium`}>
              {listing.dealType}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-2xl font-bold text-blue-600 mb-1">
            ${listing.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            {listing.address}, {listing.city}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <span>{listing.bedrooms} bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{listing.bathrooms} bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              <span>{listing.sqft?.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

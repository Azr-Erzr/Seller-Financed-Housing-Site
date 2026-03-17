// src/components/business/CommListingCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Ruler } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%23f0fdf4'/%3E%3Cpath d='M120 380h560v-28H120v28Zm60-68h440l-110-120-124 138-46-52-160 162z' fill='%2386efac'/%3E%3C/svg%3E";

const categoryColors = {
  "Vacant Land":            "bg-lime-100 text-lime-700",
  "Agricultural / Farm":    "bg-green-100 text-green-700",
  "Development Land":       "bg-emerald-100 text-emerald-700",
  "Commercial Building":    "bg-blue-100 text-blue-700",
  "Industrial / Warehouse": "bg-slate-100 text-slate-700",
  "Multi-Unit / Apartment": "bg-purple-100 text-purple-700",
  "Waterfront / Recreational": "bg-cyan-100 text-cyan-700",
  "Special Purpose":        "bg-orange-100 text-orange-700",
};

export default function CommListingCard({ listing }) {
  const [imgOk, setImgOk] = useState(true);
  const catColor = categoryColors[listing.propertyCategory] || "bg-gray-100 text-gray-600";

  return (
    <Link to={`/business/listings/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">

        {/* Image */}
        <div className="relative h-48 bg-emerald-50">
          <img
            src={imgOk && listing.image ? listing.image : PLACEHOLDER}
            alt={listing.title}
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover"
          />
          {/* Deal type badge */}
          {listing.dealType && (
            <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {listing.dealType}
            </div>
          )}
          {/* Category badge */}
          {listing.propertyCategory && (
            <div className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${catColor}`}>
              {listing.propertyCategory}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-2xl font-bold text-emerald-700 mb-1">
            ${listing.price?.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-800 mb-0.5 truncate">{listing.title}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3" />{listing.address}, {listing.city}
          </p>

          {/* Key details */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
            {listing.acreage && (
              <span className="flex items-center gap-1">
                <Ruler className="w-3 h-3" />{listing.acreage} acres
              </span>
            )}
            {listing.zoning && (
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{listing.zoning}</span>
            )}
          </div>

          {/* Utilities preview */}
          {listing.utilities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {listing.utilities.slice(0, 3).map((u) => (
                <span key={u} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  {u}
                </span>
              ))}
              {listing.utilities.length > 3 && (
                <span className="text-[10px] text-gray-400">+{listing.utilities.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

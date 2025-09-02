// src/components/ListingCard.jsx
import React from "react";
import { Link } from "react-router-dom";

// Utility to display money nicely
const money = (val) =>
  val ? `$${val.toLocaleString("en-US")}` : "Contact for price";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative">
      {/* Match % Badge */}
      {listing.match && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Match {listing.match}%
        </div>
      )}

      {/* Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-blue-700 font-bold">{money(listing.price)}</p>
        <p className="text-gray-500 text-sm">
          {listing.city}, {listing.state}
        </p>
        <p className="text-gray-500 text-sm">
          {listing.beds} bd • {listing.baths} ba • {listing.sqft} sqft
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {listing.dealType && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              {listing.dealType}
            </span>
          )}
          {listing.badges?.map((badge, i) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <Link
            to={`/listings/${listing.id}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            View
          </Link>
          <button className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
            Chat / Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
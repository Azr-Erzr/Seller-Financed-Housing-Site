// src/pages/ListingDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { LISTINGS } from "../data/seed";
import { scoreMatch } from "../lib/match";

const ListingDetail = () => {
  const { id } = useParams();
  const listing = LISTINGS.find((l) => l.id.toString() === id);

  if (!listing) {
    return <div className="p-8 text-gray-500">Listing not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-80 bg-gray-100 flex items-center justify-center">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No image available</span>
          )}
        </div>
        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="text-lg text-blue-600 font-semibold">
            ${listing.price.toLocaleString()}
          </p>
          <p className="text-gray-600">{listing.city}</p>

          {/* Badges */}
          <div className="flex gap-2 mt-2">
            {listing.badges?.map((b, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded-full"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Property Details</h2>
        <ul className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <li>
            <span className="font-semibold">Bedrooms:</span> {listing.bedrooms}
          </li>
          <li>
            <span className="font-semibold">Bathrooms:</span> {listing.bathrooms}
          </li>
          <li>
            <span className="font-semibold">Square Feet:</span>{" "}
            {listing.sqft.toLocaleString()}
          </li>
          <li>
            <span className="font-semibold">Deal Type:</span>{" "}
            {listing.dealType}
          </li>
        </ul>
      </div>

      {/* Financing Terms */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-3">Financing Terms</h2>
        <p className="text-gray-600">
          Down payment requirement:{" "}
          <span className="font-semibold">
            ${listing.downPayment.toLocaleString()}
          </span>
        </p>
        <p className="text-gray-600">
          Interest Rate: <span className="font-semibold">{listing.interest}%</span>
        </p>
        <p className="text-gray-600">
          Term: <span className="font-semibold">{listing.term} years</span>
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <Link
          to={`/chat/${listing.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Chat with Seller
        </Link>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Save Listing
        </button>
      </div>
    </div>
  );
};

export default ListingDetail;
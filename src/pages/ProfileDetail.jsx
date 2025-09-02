// src/pages/ProfileDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { PROFILES } from "../data/seed";
import { scoreMatch } from "../lib/match";

const ProfileDetail = () => {
  const { id } = useParams();
  const profile = PROFILES.find((p) => p.id.toString() === id);

  if (!profile) {
    return <div className="p-8 text-gray-500">Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 text-3xl font-bold mx-auto mb-4">
            {profile.name?.charAt(0) || "?"}
          </div>
        )}
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-gray-500">{profile.city}</p>

        {/* Badges */}
        <div className="flex justify-center flex-wrap gap-2 mt-2">
          {profile.badges?.map((b, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Buyer Details */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
        <h2 className="text-xl font-semibold">Financial Goals</h2>
        <p>
          <span className="font-semibold">Budget:</span>{" "}
          {profile.budget
            ? `$${profile.budget.toLocaleString()}`
            : "Not specified"}
        </p>
        <p>
          <span className="font-semibold">Down Payment Capacity:</span>{" "}
          {profile.downPayment
            ? `$${profile.downPayment.toLocaleString()}`
            : "N/A"}
        </p>
        <p>
          <span className="font-semibold">Interest Range:</span>{" "}
          {profile.interestRange || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Deal Preference:</span>{" "}
          {profile.dealPreference || "Any"}
        </p>
      </div>

      {/* Description */}
      {profile.bio && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <Link
          to={`/invite/${profile.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Invite to Deal
        </Link>
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileDetail;
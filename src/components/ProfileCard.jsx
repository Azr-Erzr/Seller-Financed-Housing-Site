// src/components/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative">
      {/* Match % Badge */}
      {profile.match && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Match {profile.match}%
        </div>
      )}

      {/* Avatar */}
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 text-lg font-bold">
            {profile.name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{profile.name}</h3>
        <p className="text-gray-500 text-sm">{profile.city}</p>

        {/* Financial Preferences */}
        <div className="text-sm text-gray-600 mt-2">
          <p>
            <span className="font-semibold">Down Payment Capacity:</span>{" "}
            {profile.downPayment ? `$${profile.downPayment.toLocaleString()}` : "N/A"}
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

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.badges?.map((badge, i) => (
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
            to={`/profiles/${profile.id}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            View Profile
          </Link>
          <button className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

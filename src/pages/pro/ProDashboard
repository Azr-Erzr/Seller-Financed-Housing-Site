// src/pages/pro/ProDashboard.jsx
// Pro Dashboard — visible only to users with role = 'professional' and status = 'approved'.
// Shows: assigned listings, inquiry count, pro profile summary, edit listing capability.
// Rule 14: listings entered here display as "Agent-entered", never "MLS data".

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSite } from "../../context/SiteContext";
import { supabase } from "../../lib/supabase";
import {
  Briefcase, Home, Building2, Eye, MessageSquare, Edit3,
  AlertTriangle, CheckCircle, Clock, User, MapPin, Phone,
  Globe, ChevronRight, BarChart3, TrendingUp, RefreshCw,
} from "lucide-react";

function fmtPrice(n) {
  if (!n) return "—";
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function StatusBadge({ status }) {
  if (status === "approved") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
      <CheckCircle className="w-3 h-3" /> Approved
    </span>
  );
  if (status === "pending") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> Pending Review
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      <AlertTriangle className="w-3 h-3" /> Suspended
    </span>
  );
}

export default function ProDashboard() {
  const { user, isPro } = useAuth();
  const { mode, MODES } = useSite();
  const navigate = useNavigate();
  const isBusiness = mode === MODES.business;

  const primary   = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accent    = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg  = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const accentBorder = isBusiness ? "border-emerald-200" : "border-blue-200";

  const [pro, setPro]               = useState(null);
  const [listings, setListings]     = useState([]);
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState("listings");

  // Auth + role guard
  useEffect(() => {
    if (!user) { navigate("/account"); return; }
    if (!isPro) { navigate("/pro/register"); return; }
    loadDashboard();
  }, [user, isPro]); // eslint-disable-line

  const loadDashboard = async () => {
    if (!supabase || !user) return;
    setLoading(true);
    try {
      // Load pro profile
      const { data: proData } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setPro(proData);

      if (!proData || proData.status !== "approved") {
        setLoading(false);
        return;
      }

      // Load assigned residential listings
      const { data: homesData } = await supabase
        .from("listings")
        .select("id, title, city, price, deal_type, is_active, created_at, brokerage_name, agent_entered")
        .eq("listing_agent_id", proData.id)
        .order("created_at", { ascending: false });

      // Load assigned commercial listings
      const { data: commData } = await supabase
        .from("commercial_listings")
        .select("id, title, city, price, deal_type, is_active, created_at, brokerage_name, agent_entered")
        .eq("listing_agent_id", proData.id)
        .order("created_at", { ascending: false });

      setListings([
        ...(homesData || []).map((l) => ({ ...l, mode: "homes" })),
        ...(commData  || []).map((l) => ({ ...l, mode: "business" })),
      ]);

      // Load inquiries for assigned listings
      const listingIds = [
        ...(homesData || []).map((l) => l.id),
        ...(commData  || []).map((l) => l.id),
      ];
      if (listingIds.length > 0) {
        const { data: msgData } = await supabase
          .from("messages")
          .select("id, sender_name, sender_email, subject, body, created_at, ref_id, ref_title, mode")
          .in("ref_id", listingIds)
          .order("created_at", { ascending: false })
          .limit(50);
        setInquiries(msgData || []);
      }
    } catch (err) {
      console.error("ProDashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${isBusiness ? "border-emerald-600" : "border-blue-600"}`} />
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // Pending / no application state
  if (!pro) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">No Pro application found</h1>
          <p className="text-gray-500 mb-6">You haven't submitted a professional application yet.</p>
          <Link to="/pro/register" className={`inline-flex px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors ${primary}`}>
            Apply for Pro Account
          </Link>
        </div>
      </div>
    );
  }

  // Pending approval state
  if (pro.status === "pending") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Application under review</h1>
          <p className="text-gray-500 mb-2">
            Your application for <strong>{pro.brokerage_name}</strong> is being reviewed.
            We'll email you at <strong>{user?.email}</strong> once approved.
          </p>
          <p className="text-sm text-gray-400 mb-6">Typically 1–2 business days.</p>
          <Link to="/" className="inline-flex px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const activeListing  = listings.filter((l) => l.is_active).length;
  const totalInquiries = inquiries.length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header bar */}
      <div className={`${isBusiness ? "bg-gradient-to-r from-emerald-700 to-emerald-900" : "bg-gradient-to-r from-blue-600 to-blue-800"} py-8 px-5`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Pro Dashboard</span>
              <StatusBadge status={pro.status} />
            </div>
            <h1 className="text-2xl font-bold text-white">{pro.display_name}</h1>
            <p className="text-white/70 text-sm mt-0.5">{pro.brokerage_name}</p>
          </div>
          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Assigned Listings", value: listings.length, icon: Home, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Listings",   value: activeListing,    icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Inquiries",   value: totalInquiries,   icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Service Areas",     value: (pro.service_area || []).length, icon: MapPin, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main panel */}
          <div className="flex-1 min-w-0">

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
              {[
                { id: "listings",  label: `Listings (${listings.length})` },
                { id: "inquiries", label: `Inquiries (${totalInquiries})` },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === id
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Listings tab */}
            {activeTab === "listings" && (
              <div className="space-y-3">
                {listings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <Home className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500 mb-1">No assigned listings yet</p>
                    <p className="text-xs text-gray-400">Listings assigned to your agent ID will appear here.</p>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-lg font-bold ${accent}`}>{fmtPrice(listing.price)}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${listing.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {listing.is_active ? "Active" : "Inactive"}
                          </span>
                          {listing.agent_entered && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              Agent-entered
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 truncate">{listing.title}</p>
                        <p className="text-xs text-gray-400">{listing.city} · {listing.deal_type}</p>
                      </div>
                      <Link
                        to={listing.mode === "business" ? `/business/listings/${listing.id}` : `/listings/${listing.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Inquiries tab */}
            {activeTab === "inquiries" && (
              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500 mb-1">No inquiries yet</p>
                    <p className="text-xs text-gray-400">Inquiries on your assigned listings will appear here.</p>
                  </div>
                ) : (
                  inquiries.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{msg.sender_name || "Anonymous"}</p>
                          <p className="text-xs text-gray-400">{msg.sender_email}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 shrink-0">
                          {new Date(msg.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-1">{msg.ref_title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{msg.body}</p>
                      {msg.sender_email && (
                        <a
                          href={`mailto:${msg.sender_email}?subject=Re: ${encodeURIComponent(msg.subject || msg.ref_title || "Your inquiry")}`}
                          className={`inline-flex items-center gap-1.5 mt-3 text-xs font-semibold ${accent} hover:underline`}
                        >
                          Reply by email <ChevronRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar — pro profile summary */}
          <div className="lg:w-72 shrink-0 space-y-4">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${accentBg} ${accent} flex items-center justify-center`}>
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{pro.display_name}</p>
                  <p className="text-xs text-gray-400 truncate">{pro.brokerage_name}</p>
                </div>
              </div>

              {pro.bio && <p className="text-xs text-gray-500 leading-relaxed mb-4">{pro.bio}</p>}

              <div className="space-y-2.5 text-xs text-gray-500">
                {pro.license_number && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>License: {pro.license_number}</span>
                  </div>
                )}
                {pro.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{pro.phone}</span>
                  </div>
                )}
                {pro.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a href={pro.website} target="_blank" rel="noopener noreferrer" className={`${accent} hover:underline truncate`}>
                      {pro.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {(pro.specialties || []).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pro.specialties.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {(pro.service_area || []).length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pro.service_area.map((a) => (
                      <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compliance note */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                <strong className="text-gray-500">Agent-entered data.</strong> Listings you manage through this dashboard are displayed as agent-entered content — not MLS data. Sel-Fi does not act as a broker, agent, or MLS operator. Ensure all listing data complies with RECO requirements and your brokerage policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

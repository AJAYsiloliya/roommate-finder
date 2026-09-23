"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { usePresence } from "@/hooks/usePresence";
import Link from "next/link";

export default function FindRoommate() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Filters
  const [city, setCity] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [food, setFood] = useState("");
  const [occupation, setOccupation] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "users"));

        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((profile) => profile.id !== currentUser.uid);

        setProfiles(data);
      } catch {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Apply filters + search
  const filteredProfiles = profiles.filter((profile) => {
    const searchText = search.toLowerCase().trim();

    const searchableText = `
      ${profile.name || ""}
      ${profile.city || ""}
      ${profile.area || ""}
    `.toLowerCase();

    if (searchText && !searchableText.includes(searchText)) {
      return false;
    }

    const profileCity = profile.city?.toLowerCase() || "";
    const profileFood = profile.food?.toLowerCase() || "";
    const profileOccupation = profile.occupation?.toLowerCase() || "";

    if (city && profileCity !== city.toLowerCase()) {
      return false;
    }

    if (maxBudget && Number(profile.budget || 0) > Number(maxBudget)) {
      return false;
    }

    if (food && profileFood !== food.toLowerCase()) {
      return false;
    }

    if (occupation && profileOccupation !== occupation.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Sort profiles
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (sortBy === "budget-low") {
      return Number(a.budget || 0) - Number(b.budget || 0);
    }

    if (sortBy === "budget-high") {
      return Number(b.budget || 0) - Number(a.budget || 0);
    }

    if (sortBy === "newest") {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;

      return bTime - aTime;
    }

    return 0;
  });

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setMaxBudget("");
    setFood("");
    setOccupation("");
    setSortBy("");
  };

  // Get unique cities
  const cities = [
    ...new Set(profiles.map((profile) => profile.city).filter(Boolean)),
  ];

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto max-w-7xl py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Finding roommates...
          </p>
        </div>
      </main>
    );
  }

  // Login required
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pb-16 pt-24">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            🔒
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Please Login First
          </h1>

          <p className="mt-2 leading-6 text-slate-500">
            Please login to see roommate profiles and find a suitable roommate.
          </p>

          <Link
            href="/login"
            className="mt-6 block w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Login
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            🏠 Roommate Finder
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find a Roommate
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Discover people looking for a roommate based on location, budget and
            lifestyle.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city or area..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {/* City */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">City</option>

              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Budget */}
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Budget</option>
              <option value="5000">₹5,000</option>
              <option value="7500">₹7,500</option>
              <option value="10000">₹10,000</option>
              <option value="15000">₹15,000</option>
              <option value="20000">₹20,000</option>
            </select>

            {/* Food */}
            <select
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Food</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="both">Both</option>
            </select>

            {/* Occupation */}
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Work</option>
              <option value="student">Student</option>
              <option value="working">Working</option>
              <option value="business">Business</option>
              <option value="freelancer">Freelancer</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Sort</option>
              <option value="budget-low">Budget: Low</option>
              <option value="budget-high">Budget: High</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Clear */}
          {(search || city || maxBudget || food || occupation || sortBy) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Result Count */}
        {profiles.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredProfiles.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {profiles.length}
              </span>{" "}
              roommates
            </p>
          </div>
        )}

        {/* No profiles */}
        {profiles.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              🏠
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No roommates found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Be the first person to create a roommate profile.
            </p>
          </div>
        )}

        {/* No matching profiles */}
        {profiles.length > 0 && filteredProfiles.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              🔎
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No matching roommates
            </h2>

            <p className="mt-2 text-slate-500">
              Try changing your filters or search.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Profile Cards */}
        {sortedProfiles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ProfileCard({ profile }) {
  const presence = usePresence(profile.id);

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Card Top */}
      <div className="relative border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5">
        {/* View Profile - Top */}
        <Link
          href={`/profile/${profile.id}`}
          className="absolute right-5 top-5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-600 hover:text-white hover:ring-blue-600"
        >
          View Profile →
        </Link>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 pr-32">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.name || "Profile"}
              className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-2 ring-white"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-sm ring-2 ring-white">
              👤
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900">
              {profile.name || "Unknown"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {profile.age ? `${profile.age} years old` : "Age not provided"}
            </p>

            {/* Online / Last Seen */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  presence?.online ? "bg-green-500" : "bg-slate-300"
                }`}
              />

              <span
                className={`text-xs ${
                  presence?.online
                    ? "font-medium text-green-600"
                    : "text-slate-400"
                }`}
              >
                {presence?.online
                  ? "Online"
                  : presence?.lastSeen
                    ? `Last seen ${formatLastSeen(presence.lastSeen)}`
                    : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">📍 Location</span>

            <span className="truncate text-right text-sm font-semibold text-slate-800">
              {profile.city || "Not provided"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">💰 Budget</span>

            <span className="text-right text-sm font-semibold text-slate-800">
              {profile.budget ? `₹${profile.budget}/month` : "Not provided"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">💼 Occupation</span>

            <span className="truncate text-right text-sm font-semibold capitalize text-slate-800">
              {profile.occupation || "Not provided"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">🥗 Food</span>

            <span className="text-right text-sm font-semibold capitalize text-slate-800">
              {profile.food || "Not provided"}
            </span>
          </div>
        </div>

        {/* About */}
        {profile.about && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {profile.about}
            </p>
          </div>
        )}

        {/* Small Bottom Link */}
        <Link
          href={`/profile/${profile.id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          View Full Profile
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

function formatLastSeen(timestamp) {
  if (!timestamp) return "recently";

  let lastSeen;

  if (typeof timestamp.toDate === "function") {
    lastSeen = timestamp.toDate();
  } else if (typeof timestamp === "number") {
    lastSeen = new Date(timestamp);
  } else if (timestamp.seconds) {
    lastSeen = new Date(timestamp.seconds * 1000);
  } else {
    lastSeen = new Date(timestamp);
  }

  if (isNaN(lastSeen.getTime())) {
    return "recently";
  }

  const diff = Math.max(0, Date.now() - lastSeen.getTime());

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return lastSeen.toLocaleDateString();
}

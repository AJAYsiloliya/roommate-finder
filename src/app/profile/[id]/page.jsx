"use client";

import { usePresence } from "@/hooks/usePresence";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function UserProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Presence
  const presence = usePresence(id);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");

  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingBlock, setCheckingBlock] = useState(true);
  const [blockLoading, setBlockLoading] = useState(false);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockError, setBlockError] = useState("");

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load profile
  useEffect(() => {
    if (!id) {
      setError("Profile ID is missing.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const profileRef = doc(db, "users", id);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          setError("Profile not found.");
        }
      } catch {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  // Check block status
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || !id || currentUser.uid === id) {
      setIsBlocked(false);
      setCheckingBlock(false);
      return;
    }

    const checkBlockStatus = async () => {
      try {
        setCheckingBlock(true);

        const blockId = `${currentUser.uid}_${id}`;
        const blockRef = doc(db, "blocks", blockId);
        const blockSnap = await getDoc(blockRef);

        setIsBlocked(blockSnap.exists());
      } catch {
        setIsBlocked(false);
      } finally {
        setCheckingBlock(false);
      }
    };

    checkBlockStatus();
  }, [currentUser, id, authLoading]);

  const handleReport = async () => {
  if (!currentUser) {
    router.push("/login");
    return;
  }

  if (currentUser.uid === id) {
    return;
  }

  if (!reportReason) {
    setReportError("Please select a reason.");
    return;
  }

  try {
    setReporting(true);
    setReportError("");

    const idToken = await currentUser.getIdToken();

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        reportedUserId: id,
        reason: reportReason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to submit report."
      );
    }

    setReportSuccess(true);
    setReportReason("");
  } catch (error) {
    setReportError(
      error.message ||
        "Failed to submit report. Please try again."
    );
  } finally {
    setReporting(false);
  }
};

  const closeReportModal = () => {
    if (reporting) return;

    setShowReportModal(false);
    setReportReason("");
    setReportError("");
    setReportSuccess(false);
  };

  const handleBlock = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (currentUser.uid === id) {
      return;
    }

    try {
      setBlockLoading(true);
      setBlockError("");

      const blockId = `${currentUser.uid}_${id}`;
      const blockRef = doc(db, "blocks", blockId);

      await setDoc(blockRef, {
        blockedBy: currentUser.uid,
        blockedUserId: id,
        createdAt: serverTimestamp(),
      });

      setIsBlocked(true);
      setShowBlockModal(false);
    } catch {
      setBlockError("Failed to block this user. Please try again.");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblock = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (currentUser.uid === id) {
      return;
    }

    try {
      setBlockLoading(true);
      setBlockError("");

      const blockId = `${currentUser.uid}_${id}`;
      const blockRef = doc(db, "blocks", blockId);

      await deleteDoc(blockRef);

      setIsBlocked(false);
    } catch {
      setBlockError("Failed to unblock this user. Please try again.");
    } finally {
      setBlockLoading(false);
    }
  };

  const closeBlockModal = () => {
    if (blockLoading) return;

    setShowBlockModal(false);
    setBlockError("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24">
        <div className="mx-auto max-w-2xl py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Profile not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "This profile could not be loaded."}
          </p>

          <Link
            href="/find-roommate"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Find Roommate
          </Link>
        </div>
      </main>
    );
  }

  const isOwnProfile = currentUser?.uid === id;

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-6 pb-10 pt-10 text-center">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />

            <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10" />

            <div className="relative">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.name || "Profile"}
                  className="mx-auto h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-white/30"
                />
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl shadow-lg">
                  👤
                </div>
              )}
            </div>

            <h1 className="relative mt-5 text-2xl font-bold text-white sm:text-3xl">
              {profile.name || "Unknown"}
            </h1>

            {/* Online / Last Seen */}
            <div className="relative mt-2 flex items-center justify-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  presence?.online
                    ? "bg-green-400"
                    : "bg-slate-300"
                }`}
              />

              <span className="text-sm text-blue-100">
                {presence?.online
                  ? "Online"
                  : presence?.lastSeen
                    ? `Last seen ${formatLastSeen(
                        presence.lastSeen,
                      )}`
                    : "Offline"}
              </span>
            </div>

            <p className="relative mt-1 text-sm text-blue-100">
              {profile.age
                ? `${profile.age} years old`
                : "Age not provided"}

              {profile.gender ? ` • ${profile.gender}` : ""}
            </p>
          </div>

          {/* Main Content */}
          <div className="p-5 sm:p-8">
            {/* Message / Edit Button */}
            {!isOwnProfile && (
              <>
                {authLoading ? (
                  <div className="mb-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white opacity-70">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Loading...
                  </div>
                ) : currentUser ? (
                  <Link
                    href={`/chat/${[currentUser.uid, id]
                      .sort()
                      .join("_")}?user=${id}`}
                    className="mb-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                  >
                    <span className="text-lg">💬</span>
                    Message
                  </Link>
                ) : null}
              </>
            )}

            {isOwnProfile && (
              <button
                onClick={() => router.push("/profile")}
                className="mb-7 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <span>✏️</span>
                Edit Profile
              </button>
            )}

            {/* About Section */}
            {profile.about && (
              <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm">
                    👋
                  </span>

                  <h2 className="font-semibold text-slate-900">
                    About Me
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Details Heading */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Profile Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic information about this roommate
              </p>
            </div>

            {/* Details */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Info
                label="📍 Location"
                value={`${profile.city || "Not provided"}${
                  profile.area ? `, ${profile.area}` : ""
                }`}
              />

              <Info
                label="💰 Budget"
                value={
                  profile.budget
                    ? `₹${profile.budget}/month`
                    : "Not provided"
                }
              />

              <Info
                label="💼 Occupation"
                value={profile.occupation}
              />

              <Info
                label="🥗 Food"
                value={profile.food}
              />

              <Info
                label="🚭 Smoking"
                value={profile.smoking}
              />

              <Info
                label="🥤 Drinking"
                value={profile.drinking}
              />
            </div>

            {/* Report + Block */}
            {!isOwnProfile && !authLoading && currentUser && (
              <>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="mt-6 w-full rounded-xl border border-red-200 py-3.5 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  🚩 Report User
                </button>

                {checkingBlock ? (
                  <div className="mt-3 w-full rounded-xl border border-slate-200 py-3.5 text-center text-sm font-semibold text-slate-400">
                    Checking block status...
                  </div>
                ) : isBlocked ? (
                  <button
                    onClick={handleUnblock}
                    disabled={blockLoading}
                    className="mt-3 w-full rounded-xl border border-green-200 py-3.5 font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {blockLoading
                      ? "Unblocking..."
                      : "✓ Unblock User"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBlockModal(true)}
                    className="mt-3 w-full rounded-xl border border-slate-300 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    🚫 Block User
                  </button>
                )}
              </>
            )}

            {/* Back */}
            <Link
              href="/find-roommate"
              className="mt-3 block w-full rounded-xl border border-slate-200 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Back to Find Roommate
            </Link>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            {reportSuccess ? (
              <div className="py-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                  ✓
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Report Submitted
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Thanks for helping us keep RoommateFinder safe.
                </p>

                <button
                  onClick={closeReportModal}
                  className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Report User
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Why are you reporting this profile?
                    </p>
                  </div>

                  <button
                    onClick={closeReportModal}
                    disabled={reporting}
                    className="text-2xl leading-none text-slate-400 transition hover:text-slate-700"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    "Spam",
                    "Fake Profile",
                    "Harassment",
                    "Inappropriate Content",
                    "Other",
                  ].map((reason) => (
                    <label
                      key={reason}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                        reportReason === reason
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => {
                          setReportReason(e.target.value);
                          setReportError("");
                        }}
                        className="h-4 w-4 accent-blue-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>

                {reportError && (
                  <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {reportError}
                  </p>
                )}

                <button
                  onClick={handleReport}
                  disabled={reporting}
                  className="mt-5 w-full rounded-xl bg-red-600 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reporting ? "Submitting..." : "Submit Report"}
                </button>

                <button
                  onClick={closeReportModal}
                  disabled={reporting}
                  className="mt-2 w-full rounded-xl py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                🚫
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Block User?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to block{" "}
                <span className="font-semibold text-slate-700">
                  {profile.name || "this user"}
                </span>
                ?
              </p>
            </div>

            {blockError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {blockError}
              </p>
            )}

            <button
              onClick={handleBlock}
              disabled={blockLoading}
              className="mt-5 w-full rounded-xl bg-red-600 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {blockLoading ? "Blocking..." : "Yes, Block User"}
            </button>

            <button
              onClick={closeBlockModal}
              disabled={blockLoading}
              className="mt-2 w-full rounded-xl py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "Not provided"}
      </p>
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

  const diff = Math.max(
    0,
    Date.now() - lastSeen.getTime()
  );

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";

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
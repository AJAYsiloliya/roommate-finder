"use client";

import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CLOUD_NAME = "f6b3sgvy";
const UPLOAD_PRESET = "roommate_profile";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function Profile() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);

  const [authLoading, setAuthLoading] = useState(true);

  const [profileExists, setProfileExists] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
    area: "",
    budget: "",
    occupation: "",
    food: "",
    smoking: "",
    drinking: "",
    about: "",
    photoURL: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthLoading(false);
        setLoading(false);

        router.replace("/login");
        return;
      }

      setUserEmail(user.email || "");

      try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setForm((prev) => ({
            ...prev,
            ...profileSnap.data(),
          }));

          setProfileExists(true);
        }
      } catch {
        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo size must be less than 5MB.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setUploadingPhoto(true);

      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Photo upload failed."
        );
      }

      setForm((prev) => ({
        ...prev,
        photoURL: data.secure_url,
      }));

      setSuccess("Photo uploaded successfully!");
    } catch {
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    const user = auth.currentUser;

    if (!user) {
      setSaving(false);
      router.replace("/login");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...form,
      });

      setProfileExists(true);
      setEditing(false);
      setSuccess("Profile saved successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");

    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!deletePassword.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (!user.email) {
      setError("Unable to verify your account email.");
      return;
    }

    setDeletingAccount(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        deletePassword
      );

      await reauthenticateWithCredential(user, credential);

      await deleteDoc(doc(db, "users", user.uid));

      await deleteUser(user);

      setDeleteSuccess(true);

      setDeletePassword("");
      setShowDelete(false);

      setTimeout(() => {
        router.replace("/signup");
      }, 2200);
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("Wrong password. Account was not deleted.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (error.code === "auth/requires-recent-login") {
        setError(
          "Please login again and then try deleting your account."
        );
      } else if (error.code === "permission-denied") {
        setError(
          "Unable to delete your profile. Please try again."
        );
      } else {
        setError(
          "Account deletion failed. Please try again."
        );
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setError("");
      await signOut(auth);
      router.replace("/login");
    } catch {
      setError("Failed to logout. Please try again.");
    }
  };

  // Auth state is still being checked
  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto max-w-3xl py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Checking account...
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto max-w-3xl py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (profileExists && !editing) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-7">
            <p className="text-sm font-semibold text-blue-600">
              ROOMMATE PROFILE
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              My Profile
            </h1>

            <p className="mt-2 text-slate-600">
              Manage the information other roommates can see.
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              ⚠️ {error}
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Profile Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-6 py-9 text-white sm:px-8">
              <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />

              <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10" />

              <div className="relative flex items-center gap-5">
                {form.photoURL ? (
                  <img
                    src={form.photoURL}
                    alt={form.name || "Profile"}
                    className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white/30"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-5xl shadow-lg">
                    👤
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold">
                    {form.name || "Your Name"}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    {form.age
                      ? `${form.age} years old`
                      : "Age not provided"}

                    {form.gender && (
                      <>
                        {" • "}
                        <span className="capitalize">
                          {form.gender}
                        </span>
                      </>
                    )}
                  </p>

                  <p className="mt-1 truncate text-sm text-blue-100">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-5 sm:p-8">

              <button
                onClick={() => {
                  setSuccess("");
                  setError("");
                  setEditing(true);
                }}
                className="mb-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                ✏️ Edit Profile
              </button>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your basic roommate information
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info
                  label="📍 Location"
                  value={`${form.city || "Not provided"}${
                    form.area ? `, ${form.area}` : ""
                  }`}
                />

                <Info
                  label="💰 Monthly Budget"
                  value={
                    form.budget
                      ? `₹${form.budget}/month`
                      : "Not provided"
                  }
                />

                <Info
                  label="💼 Occupation"
                  value={form.occupation}
                />

                <Info
                  label="🥗 Food Preference"
                  value={form.food}
                />

                <Info
                  label="🚭 Smoking"
                  value={form.smoking}
                />

                <Info
                  label="🥤 Drinking"
                  value={form.drinking}
                />
              </div>

              {form.about && (
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm">
                      👋
                    </span>

                    <h3 className="font-semibold text-slate-900">
                      About Me
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {form.about}
                  </p>
                </div>
              )}

              {/* Account */}
              <div className="mt-8 border-t border-slate-200 pt-7">
                <h3 className="text-base font-bold text-slate-900">
                  Account
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deleting your account will permanently remove your
                  profile and Firebase account.
                </p>

                {!showDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDelete(true);
                      setError("");
                      setSuccess("");
                    }}
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm font-semibold text-red-700">
                      Delete your account?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      This action cannot be undone.
                    </p>

                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    />

                    {error && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600">
                        ⚠️ {error}
                      </div>
                    )}

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDelete(false);
                          setDeletePassword("");
                          setError("");
                        }}
                        disabled={deletingAccount}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                        className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingAccount
                          ? "Deleting..."
                          : "Permanently Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <div className="mt-8 border-t border-slate-200 pt-7">
                <h3 className="text-base font-bold text-slate-900">
                  Logout
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Sign out of your RoommateFinder account on this device.
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>

          {/* Delete Success */}
          {deleteSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <span className="text-4xl">✓</span>
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Account Deleted
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your account has been deleted successfully.
                </p>

                <div className="mt-5 inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                  ✓ Delete Account Successfully
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="text-sm font-semibold text-blue-600">
            ROOMMATE PROFILE
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {profileExists
              ? "Edit Your Profile"
              : "Create Your Profile"}
          </h1>

          <p className="mt-2 text-slate-600">
            Add your details to help you find a suitable roommate.
          </p>
        </div>

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Profile Photo */}
          <div className="mb-8 rounded-2xl bg-slate-50 p-6 text-center">
            {form.photoURL ? (
              <img
                src={form.photoURL}
                alt="Profile preview"
                className="mx-auto h-28 w-28 rounded-full object-cover shadow-sm ring-4 ring-blue-100"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-5xl">
                👤
              </div>
            )}

            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              {uploadingPhoto
                ? "Uploading..."
                : "📷 Add Profile Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or other image • Max 5MB
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Age">
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter your age"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Gender">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Occupation">
              <select
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select occupation</option>
                <option value="student">Student</option>
                <option value="working">Working Professional</option>
                <option value="business">Business</option>
                <option value="freelancer">Freelancer</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="City">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Area">
              <input
                type="text"
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Enter area"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Monthly Budget">
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. 10000"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Food Preference">
              <select
                name="food"
                value={form.food}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select food preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">
                  Non-Vegetarian
                </option>
                <option value="eggetarian">Eggetarian</option>
                <option value="vegan">Vegan</option>
                <option value="anything">Anything</option>
              </select>
            </Field>

            <Field label="Smoking">
              <select
                name="smoking"
                value={form.smoking}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select option</option>
                <option value="no">No</option>
                <option value="occasionally">
                  Occasionally
                </option>
                <option value="yes">Yes</option>
              </select>
            </Field>

            <Field label="Drinking">
              <select
                name="drinking"
                value={form.drinking}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select option</option>
                <option value="no">No</option>
                <option value="occasionally">
                  Occasionally
                </option>
                <option value="yes">Yes</option>
              </select>
            </Field>
          </div>

          <Field label="About Me">
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="Tell potential roommates a little about yourself..."
              rows={5}
              className={inputClass}
            />
          </Field>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {profileExists && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError("");
                  setSuccess("");
                }}
                disabled={saving}
                className="w-full rounded-xl border border-slate-200 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving || uploadingPhoto}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : profileExists
                  ? "Save Changes"
                  : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div className="sm:col-span-1">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
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
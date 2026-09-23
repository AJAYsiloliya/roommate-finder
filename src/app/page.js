"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStartedLink = user ? "/find-roommate" : "/login";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              Find roommates & flatmates
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find a roommate who
              <span className="text-blue-600">
                {" "}fits your lifestyle.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Find roommates and flatmates based on your location, budget,
              food preferences, occupation, and lifestyle.
            </p>

            {!loading && (
              <div className="mt-8">
                <Link
                  href={getStartedLink}
                  className="inline-flex rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Find a Roommate →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-slate-200 bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-blue-600">
              HOW IT WORKS
            </span>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Find a roommate in a few simple steps
            </h2>

            <p className="mt-3 text-slate-600">
              Create your roommate profile, discover matching people,
              and connect based on your living preferences.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                01
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Create your profile
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Add your city, area, budget, occupation, food preference,
                and lifestyle details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                02
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Find suitable roommates
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Search roommate and flatmate profiles using location,
                budget, food, and occupation filters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                03
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Connect with people
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                View profiles, compare living preferences, and message
                people you want to connect with.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* What You Can Filter */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <span className="text-sm font-semibold text-blue-600">
              ROOMMATE SEARCH
            </span>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Find roommates based on what matters to you
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Use practical filters to find people with similar
              location, budget, food, and lifestyle preferences.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Location */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl">📍</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Location
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find roommates in your preferred city or local area.
              </p>
            </div>

            {/* Budget */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl">💰</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Budget
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Search for roommates within your preferred rent budget.
              </p>
            </div>

            {/* Lifestyle */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl">🥗</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Food & Lifestyle
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Compare food, smoking, drinking, and other lifestyle
                preferences.
              </p>
            </div>

            {/* Occupation */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl">💼</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Occupation
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find students, working professionals, freelancers,
                and others.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-blue-600 px-6 py-12 text-center shadow-lg sm:px-10">

            <h2 className="text-3xl font-bold text-white">
              Ready to find your roommate?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Create your profile and start exploring roommate and
              flatmate profiles that match your preferences.
            </p>

            {!loading && (
              <Link
                href={getStartedLink}
                className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
              >
                Find a Roommate →
              </Link>
            )}

          </div>
        </div>
      </section>

    </main>
  );
}
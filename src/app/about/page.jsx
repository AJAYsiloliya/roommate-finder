import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
              About RoommateFinder
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Finding the right
              <span className="text-blue-600"> roommate </span>
              should be simple.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              RoommateFinder helps people discover potential roommates and
              flatmates based on location, budget, lifestyle, and everyday
              living preferences.
            </p>

          </div>
        </div>
      </section>

      {/* What is RoommateFinder */}
      <section className="border-y border-slate-200 bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div>
            <span className="text-sm font-semibold text-blue-600">
              OUR PLATFORM
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A simpler way to find compatible roommates
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Finding a roommate is not only about finding an available room.
              Living preferences, budget, location, food choices, and daily
              habits can also matter.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              RoommateFinder gives users a place to create a profile,
              discover other profiles, compare preferences, and connect
              through messaging.
            </p>
          </div>

          {/* Highlight Card */}
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 shadow-lg shadow-blue-600/10 sm:p-10">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                🏠
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Find people who fit your lifestyle
              </h3>

              <p className="mt-3 leading-7 text-blue-100">
                Search profiles using practical details instead of browsing
                through people randomly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* What You Can Do */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-blue-600">
              WHAT YOU CAN DO
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to start your search
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Create your profile and use the platform to discover and
              connect with potential roommates.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Profile */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                👤
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Create a profile
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add your location, budget, occupation, food preferences,
                and lifestyle details.
              </p>
            </div>

            {/* Search */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                🔎
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Search roommates
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find people using filters such as city, budget, food,
                and occupation.
              </p>
            </div>

            {/* Compare */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                ⚡
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Compare preferences
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Check profile details and see whether someone's preferences
                fit your requirements.
              </p>
            </div>

            {/* Connect */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                💬
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Connect
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Message potential roommates and start a conversation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="border-y border-slate-200 bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-blue-600">
              WHY ROOMMATEFINDER
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              More than just finding a room
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              A good shared living experience starts with finding people
              whose expectations and preferences are compatible with yours.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">

            <div className="grid gap-6 sm:grid-cols-3">

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  📍
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Right location
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Search around the city or area you prefer.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  💰
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Right budget
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Find people with similar budget expectations.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  🤝
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Better connection
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Connect through profiles and direct messaging.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center shadow-lg sm:px-10">

            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to find your roommate?
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-blue-100">
              Create your profile and start exploring people who may be
              looking for a roommate too.
            </p>

            <Link
              href="/find-roommate"
              className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              Find a Roommate →
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}
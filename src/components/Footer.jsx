import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-6 lg:px-8">

        {/* Main */}
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div className="md:pr-10">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5L12 3l9 7.5" />
                  <path d="M5.5 9.5V21h13V9.5" />
                  <path d="M9.5 21v-6h5v6" />
                </svg>

                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-400" />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                Roommate<span className="text-blue-600">Finder</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              Find roommates and flatmates based on location, budget,
              lifestyle, and living preferences.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-900">
              Platform
            </h3>

            <div className="mt-5 space-y-3">
              <FooterLink href="/" icon={<HomeIcon />}>
                Home
              </FooterLink>

              <FooterLink
                href="/find-roommate"
                icon={<SearchIcon />}
              >
                Find Roommate
              </FooterLink>

              <FooterLink
                href="/about"
                icon={<InfoIcon />}
              >
                About
              </FooterLink>

              <FooterLink
                href="/contact"
                icon={<MailIcon />}
              >
                Contact
              </FooterLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-900">
              Legal & Safety
            </h3>

            <div className="mt-5 space-y-3">
              <FooterLink
                href="/privacy-policy"
                icon={<ShieldIcon />}
              >
                Privacy Policy
              </FooterLink>

              <FooterLink
                href="/terms"
                icon={<DocumentIcon />}
              >
                Terms & Conditions
              </FooterLink>

              <FooterLink
                href="/community-guidelines"
                icon={<UsersIcon />}
              >
                Community Guidelines
              </FooterLink>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-9 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700">
              RoommateFinder
            </span>
            . All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="text-xs font-medium text-slate-500 transition hover:text-blue-600"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs font-medium text-slate-500 transition hover:text-blue-600"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================
   Footer Link
========================= */

function FooterLink({ href, icon, children }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 text-sm text-slate-500 transition-all duration-200 hover:translate-x-0.5 hover:text-blue-600"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600">
        {icon}
      </span>

      <span>{children}</span>
    </Link>
  );
}

/* =========================
   Icons
========================= */

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M18 14.5c1.8.8 3 2.6 3 4.5" />
    </svg>
  );
}
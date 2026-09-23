import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5L12 3l9 7.5" />
                  <path d="M5.5 9.5V21h13V9.5" />
                  <path d="M9.5 21v-6h5v6" />
                </svg>
              </div>

              <span className="text-base font-bold text-slate-900">
                Roommate<span className="text-blue-600">Finder</span>
              </span>
            </Link>

            <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
              Find roommates and flatmates based on location, budget,
              lifestyle, and living preferences.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-900">
              Platform
            </h3>

            <div className="mt-2 space-y-1.5">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/find-roommate">
                Find Roommate
              </FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-900">
              Legal & Safety
            </h3>

            <div className="mt-2 space-y-1.5">
              <FooterLink href="/privacy-policy">
                Privacy Policy
              </FooterLink>

              <FooterLink href="/terms">
                Terms & Conditions
              </FooterLink>

              <FooterLink href="/community-guidelines">
                Community Guidelines
              </FooterLink>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} RoommateFinder. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs">
            <Link
              href="/privacy-policy"
              className="text-slate-500 transition hover:text-blue-600"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-slate-500 transition hover:text-blue-600"
            >
              Terms
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block text-xs text-slate-500 transition-colors hover:text-blue-600"
    >
      {children}
    </Link>
  );
}
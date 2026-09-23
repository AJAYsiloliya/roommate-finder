"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Unread messages check
  useEffect(() => {
    if (!user) {
      setHasUnread(false);
      return;
    }

    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const unread = snapshot.docs.some((chatDoc) => {
          const data = chatDoc.data();

          return data.unreadFor?.includes(user.uid);
        });

        setHasUnread(unread);
      },
      () => {
        setHasUnread(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-[0_4px_25px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =========================
            Logo
        ========================= */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-600/25">
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

          <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Roommate<span className="text-blue-600">Finder</span>
          </span>
        </Link>

        {/* =========================
            Desktop Menu
        ========================= */}
        <div className="hidden items-center gap-1.5 md:flex">

          <NavLink
            href="/"
            active={pathname === "/"}
            icon={<HomeIcon />}
          >
            Home
          </NavLink>

          <NavLink
            href="/find-roommate"
            active={pathname.startsWith("/find-roommate")}
            icon={<SearchIcon />}
          >
            Find Roommate
          </NavLink>

          <NavLink
            href="/about"
            active={pathname.startsWith("/about")}
            icon={<InfoIcon />}
          >
            About
          </NavLink>

          {user ? (
            <>
              <NavLink
                href="/profile"
                active={pathname.startsWith("/profile")}
                icon={<UserIcon />}
              >
                Profile
              </NavLink>

              {/* Messages */}
              <Link
                href="/messages"
                className={`relative mx-0.5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  pathname.startsWith("/messages")
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <MessageIcon />

                <span>Messages</span>

                {hasUnread && (
                  <span className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </Link>
            </>
          ) : (
            <>
              <NavLink
                href="/login"
                active={pathname.startsWith("/login")}
                icon={<LoginIcon />}
              >
                Login
              </NavLink>

              <Link
                href="/signup"
                className={`ml-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 ${
                  pathname.startsWith("/signup")
                    ? "bg-blue-700 text-white shadow-blue-600/25"
                    : "bg-blue-600 text-white shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
                }`}
              >
                <UserPlusIcon />

                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* =========================
            Mobile Button
        ========================= */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 md:hidden ${
            menuOpen
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`absolute text-2xl transition-all duration-300 ${
              menuOpen
                ? "rotate-90 scale-50 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          >
            ☰
          </span>

          <span
            className={`absolute text-3xl leading-none transition-all duration-300 ${
              menuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-50 opacity-0"
            }`}
          >
            ×
          </span>
        </button>
      </div>

      {/* =========================
          Mobile Menu
      ========================= */}
      <div
        className={`absolute left-0 right-0 top-[68px] origin-top border-b border-slate-200 bg-white shadow-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "visible translate-y-0 scale-y-100 opacity-100"
            : "invisible -translate-y-3 scale-y-95 opacity-0"
        }`}
      >
        <div className="px-4 pb-5 pt-3">
          <div
            className={`space-y-1 transition-transform duration-300 ${
              menuOpen ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            <MobileLink
              href="/"
              onClick={closeMenu}
              active={pathname === "/"}
              icon={<HomeIcon />}
            >
              Home
            </MobileLink>

            <MobileLink
              href="/find-roommate"
              onClick={closeMenu}
              active={pathname.startsWith("/find-roommate")}
              icon={<SearchIcon />}
            >
              Find Roommate
            </MobileLink>

            <MobileLink
              href="/about"
              onClick={closeMenu}
              active={pathname.startsWith("/about")}
              icon={<InfoIcon />}
            >
              About
            </MobileLink>

            {user ? (
              <>
                <MobileLink
                  href="/profile"
                  onClick={closeMenu}
                  active={pathname.startsWith("/profile")}
                  icon={<UserIcon />}
                >
                  Profile
                </MobileLink>

                <Link
                  href="/messages"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    pathname.startsWith("/messages")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <MessageIcon />

                    <span>Messages</span>
                  </span>

                  {hasUnread && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                  )}
                </Link>
              </>
            ) : (
              <>
                <MobileLink
                  href="/login"
                  onClick={closeMenu}
                  active={pathname.startsWith("/login")}
                  icon={<LoginIcon />}
                >
                  Login
                </MobileLink>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className={`mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-all ${
                    pathname.startsWith("/signup")
                      ? "bg-blue-700"
                      : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
                  }`}
                >
                  <UserPlusIcon />

                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* =========================
   Desktop Navigation Link
========================= */

function NavLink({
  href,
  children,
  icon,
  active,
}) {
  return (
    <Link
      href={href}
      className={`mx-0.5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-blue-50 text-blue-600 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      {icon}

      <span>{children}</span>
    </Link>
  );
}

/* =========================
   Mobile Navigation Link
========================= */

function MobileLink({
  href,
  onClick,
  children,
  icon,
  active,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      {icon}

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
      className="h-[18px] w-[18px]"
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
      className="h-[18px] w-[18px]"
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
      className="h-[18px] w-[18px]"
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

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 21c.6-4 3.1-6 7.5-6s6.9 2 7.5 6" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.2-.65L4 20l1.7-4.1A7.4 7.4 0 0 1 5 11.5 7.5 7.5 0 0 1 12.5 4 7.5 7.5 0 0 1 20 11.5Z" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M14 4h5v16h-5" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6 2.1 0 4 1.1 5.1 2.8" />
      <path d="M18 14v6" />
      <path d="M15 17h6" />
    </svg>
  );
}
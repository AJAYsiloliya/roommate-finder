"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
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

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    window.location.href = "/login";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-600/25">
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

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Roommate<span className="text-blue-600">Finder</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 md:flex">

          <NavLink href="/">Home</NavLink>

          <NavLink href="/find-roommate">
            Find Roommate
          </NavLink>

          {/* About */}
          <NavLink href="/about">
            About
          </NavLink>

          {user ? (
            <>
              <NavLink href="/profile">
                Profile
              </NavLink>

              {/* Messages */}
              <Link
                href="/messages"
                className="relative mx-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-blue-600"
              >
                Messages

                {hasUnread && (
                  <span className="absolute right-1.5 top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="ml-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">
                Login
              </NavLink>

              <Link
                href="/signup"
                className="ml-3 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 md:hidden"
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

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 right-0 top-16 origin-top border-b border-slate-200 bg-white shadow-xl transition-all duration-300 md:hidden ${
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
            <MobileLink href="/" onClick={closeMenu}>
              Home
            </MobileLink>

            <MobileLink
              href="/find-roommate"
              onClick={closeMenu}
            >
              Find Roommate
            </MobileLink>

            {/* About */}
            <MobileLink
              href="/about"
              onClick={closeMenu}
            >
              About
            </MobileLink>

            {user ? (
              <>
                <MobileLink
                  href="/profile"
                  onClick={closeMenu}
                >
                  Profile
                </MobileLink>

                {/* Mobile Messages */}
                <Link
                  href="/messages"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>Messages</span>

                  {hasUnread && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileLink
                  href="/login"
                  onClick={closeMenu}
                >
                  Login
                </MobileLink>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="mt-2 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* Desktop Navigation Link */
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="mx-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-blue-600"
    >
      {children}
    </Link>
  );
}

/* Mobile Navigation Link */
function MobileLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-blue-600"
    >
      {children}
    </Link>
  );
}
"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setupPresence } from "@/lib/presence";

export default function Presence() {
  useEffect(() => {
    let stopPresence = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      stopPresence();

      if (user) {
        stopPresence = setupPresence(user.uid);
      }
    });

    return () => {
      stopPresence();
      unsubscribeAuth();
    };
  }, []);

  return null;
}
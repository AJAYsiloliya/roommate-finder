"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase";

export function usePresence(userId) {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    if (!userId) {
      setPresence(null);
      return;
    }

    const presenceRef = ref(
      rtdb,
      `presence/${userId}`
    );

    const unsubscribe = onValue(
      presenceRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPresence(null);
          return;
        }

        const data = snapshot.val();

        const connections = data.connections || {};

        const online =
          Object.keys(connections).length > 0;

        setPresence({
          online,
          lastSeen: data.lastSeen || null,
        });
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return presence;
}
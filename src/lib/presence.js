import {
  ref,
  push,
  onDisconnect,
  set,
  remove,
  onValue,
  serverTimestamp,
} from "firebase/database";

import { rtdb } from "./firebase";

export function setupPresence(userId) {
  if (!userId) return () => {};

  const connectedRef = ref(rtdb, ".info/connected");

  const connectionsRef = ref(
    rtdb,
    `presence/${userId}/connections`
  );

  const lastSeenRef = ref(
    rtdb,
    `presence/${userId}/lastSeen`
  );

  let connectionRef = null;
  let active = true;

  const unsubscribe = onValue(
    connectedRef,
    async (snapshot) => {
      if (!active) return;

      if (snapshot.val() !== true) return;

      try {
        if (!connectionRef) {
          connectionRef = push(connectionsRef);

          await onDisconnect(connectionRef).remove();

          await onDisconnect(lastSeenRef).set(
            serverTimestamp()
          );
        }

        if (!active) return;

        await set(connectionRef, true);
      } catch {
        // Ignore presence errors
      }
    }
  );

  return () => {
    active = false;

    unsubscribe();

    if (connectionRef) {
      const currentConnection = connectionRef;

      connectionRef = null;

      remove(currentConnection).catch(() => {});
    }
  };
}
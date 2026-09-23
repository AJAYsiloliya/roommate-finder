"use client";

import { usePresence } from "@/hooks/usePresence";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const chatId = params.id;
  const receiverId = searchParams.get("user");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadMessageIds, setUnreadMessageIds] = useState([]);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [chatReady, setChatReady] = useState(false);

  const messagesEndRef = useRef(null);

  const presence = usePresence(receiverId);

  // Current logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Receiver profile
  useEffect(() => {
    if (!receiverId) {
      setError("Receiver ID not found.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const profileRef = doc(db, "users", receiverId);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          setError("User profile not found.");
          return;
        }

        setProfile(profileSnap.data());
      } catch {
        setError("Unable to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [receiverId]);

  // Prepare chat
  useEffect(() => {
    if (!chatId || !currentUser || !receiverId) {
      return;
    }

    const prepareChat = async () => {
      try {
        const participants = [
          currentUser.uid,
          receiverId,
        ].sort();

        const chatRef = doc(db, "chats", chatId);

        /*
         * Create the chat if it does not exist.
         *
         * merge: true also keeps existing chat fields such as
         * lastMessage, updatedAt, unreadFor and hiddenFor.
         */
        await setDoc(
          chatRef,
          {
            participants,
          },
          {
            merge: true,
          },
        );

        setChatReady(true);
        setBlocked(false);
        setError("");
      } catch (error) {
        setChatReady(false);

        if (
          error?.code === "permission-denied" ||
          error?.code === "PERMISSION_DENIED"
        ) {
          setError(
            "You cannot open this chat. The conversation may be blocked.",
          );
        } else {
          setError(
            error?.message || "Unable to open chat.",
          );
        }
      }
    };

    prepareChat();
  }, [chatId, currentUser, receiverId]);

  // Chat open hone par unread remove
  useEffect(() => {
    if (
      !chatId ||
      !currentUser ||
      !chatReady ||
      blocked
    ) {
      return;
    }

    const markChatAsSeen = async () => {
      try {
        await updateDoc(
          doc(db, "chats", chatId),
          {
            unreadFor: arrayRemove(
              currentUser.uid,
            ),
          },
        );
      } catch {
        // Ignore unread update errors
      }
    };

    markChatAsSeen();
  }, [
    chatId,
    currentUser,
    chatReady,
    blocked,
  ]);

  // Messages real-time load
  useEffect(() => {
    if (
      !chatId ||
      !currentUser ||
      !chatReady ||
      blocked
    ) {
      return;
    }

    const messagesRef = collection(
      db,
      "chats",
      chatId,
      "messages",
    );

    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messageList =
          snapshot.docs.map((messageDoc) => ({
            id: messageDoc.id,
            ...messageDoc.data(),
          }));

        setMessages(messageList);

        const unreadIds = messageList
          .filter((msg) => {
            const isFromOtherUser =
              msg.senderId !== currentUser.uid;

            const isUnread =
              !msg.readBy?.includes(
                currentUser.uid,
              );

            return (
              isFromOtherUser &&
              isUnread
            );
          })
          .map((msg) => msg.id);

        setUnreadMessageIds(unreadIds);

        if (unreadIds.length > 0) {
          const markMessagesAsRead =
            async () => {
              try {
                const unreadMessages =
                  snapshot.docs.filter(
                    (messageDoc) => {
                      const data =
                        messageDoc.data();

                      const isFromOtherUser =
                        data.senderId !==
                        currentUser.uid;

                      const isUnread =
                        !data.readBy?.includes(
                          currentUser.uid,
                        );

                      return (
                        isFromOtherUser &&
                        isUnread
                      );
                    },
                  );

                await Promise.all(
                  unreadMessages.map(
                    (messageDoc) =>
                      updateDoc(
                        messageDoc.ref,
                        {
                          readBy:
                            arrayUnion(
                              currentUser.uid,
                            ),
                        },
                      ),
                  ),
                );
              } catch {
                // Ignore read-status errors
              }
            };

          markMessagesAsRead();
        }
      },
      (snapshotError) => {
        setChatReady(false);

        if (
          snapshotError?.code ===
          "permission-denied"
        ) {
          setError(
            "You do not have permission to access these messages.",
          );
        } else {
          setError(
            snapshotError?.message ||
              "Unable to load messages.",
          );
        }
      },
    );

    return () => unsubscribe();
  }, [
    chatId,
    currentUser,
    chatReady,
    blocked,
  ]);

  // Automatically scroll to latest message
  useEffect(() => {
    if (
      !chatReady ||
      blocked ||
      messages.length === 0
    ) {
      return;
    }

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [
    messages,
    chatReady,
    blocked,
  ]);

  // Send message
  const handleSend = async () => {
    if (
      !message.trim() ||
      !currentUser ||
      !receiverId ||
      !chatId ||
      blocked ||
      !chatReady
    ) {
      return;
    }

    const text = message.trim();

    try {
      await addDoc(
        collection(
          db,
          "chats",
          chatId,
          "messages",
        ),
        {
          senderId: currentUser.uid,
          text,
          createdAt: serverTimestamp(),
          readBy: [currentUser.uid],
        },
      );

      await updateDoc(
        doc(db, "chats", chatId),
        {
          lastMessage: text,
          updatedAt: serverTimestamp(),
          unreadFor:
            arrayUnion(receiverId),
          hiddenFor: [],
        },
      );

      setMessage("");
      setError("");
    } catch (error) {
      setError(
        error?.code === "permission-denied"
          ? "Message could not be sent because you do not have permission."
          : error?.message ||
              "Message could not be sent.",
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="fixed inset-0 z-40 h-dvh bg-slate-50 px-4 pt-20">
        <div className="flex h-full items-center justify-center text-slate-500">
          Loading chat...
        </div>
      </main>
    );
  }

  // Error before profile
  if (error && !profile) {
    return (
      <main className="fixed inset-0 z-40 h-dvh bg-slate-50 px-4 pt-20">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              Chat unavailable
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <Link
              href="/find-roommate"
              className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Back to Find Roommate
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-40 h-dvh overflow-hidden bg-slate-50 px-3 pb-3 pt-20 sm:px-5 sm:pb-6 sm:pt-20">
      <div className="mx-auto h-full w-full max-w-2xl">
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="shrink-0 border-b border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">

              <Link
                href="/messages"
                className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Back
              </Link>

              {/* Profile Photo */}
              <div className="relative shrink-0">
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={
                      profile.name ||
                      "Profile"
                    }
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-xl">
                    👤
                  </div>
                )}

                {presence?.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>

              {/* Name + Status */}
              <div className="min-w-0">
                <h1 className="truncate font-bold text-slate-900">
                  {profile?.name ||
                    "Unknown"}
                </h1>

                {blocked ? (
                  <p className="text-sm text-red-500">
                    Messaging unavailable
                  </p>
                ) : presence?.online ? (
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                    <p className="text-xs font-medium text-green-600">
                      Online
                    </p>
                  </div>
                ) : presence?.lastSeen ? (
                  <p className="text-xs text-slate-400">
                    Last seen{" "}
                    {formatLastSeen(
                      presence.lastSeen,
                    )}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Offline
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {blocked ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="text-3xl">
                    🚫
                  </div>

                  <h2 className="mt-3 font-bold text-slate-900">
                    Messaging unavailable
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    You cannot send or receive
                    messages with this user.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex min-h-full items-center justify-center">
                    <p className="text-center text-slate-400">
                      No messages yet.
                      <br />
                      Start the conversation.
                    </p>
                  </div>
                ) : (
                  messages.map(
                    (msg, index) => {
                      const isMine =
                        msg.senderId ===
                        currentUser?.uid;

                      const isUnread =
                        unreadMessageIds.includes(
                          msg.id,
                        );

                      const isLastMessage =
                        index ===
                        messages.length - 1;

                      const isSeen =
                        isLastMessage &&
                        isMine &&
                        msg.readBy?.includes(
                          receiverId,
                        );

                      return (
                        <div
                          key={msg.id}
                        >
                          {isUnread && (
                            <div className="my-4 flex items-center gap-3">
                              <div className="h-px flex-1 bg-blue-100" />

                              <span className="text-xs font-semibold text-blue-600">
                                Unread
                              </span>

                              <div className="h-px flex-1 bg-blue-100" />
                            </div>
                          )}

                          <div
                            className={`flex flex-col ${
                              isMine
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <p className="mb-1 text-xs font-semibold text-slate-500">
                              {isMine
                                ? "You"
                                : profile?.name ||
                                  "User"}
                            </p>

                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                isMine
                                  ? "rounded-tr-sm bg-blue-600 text-white"
                                  : "rounded-tl-sm bg-slate-100 text-slate-800"
                              }`}
                            >
                              {msg.text}
                            </div>

                            {isSeen && (
                              <p className="mt-1 text-[11px] font-medium text-slate-400">
                                Seen
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error */}
          {error && !blocked && (
            <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-2">
              <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          {/* Input */}
          {!blocked && (
            <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  disabled={!chatReady}
                  onChange={(e) =>
                    setMessage(
                      e.target.value,
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleSend();
                    }
                  }}
                  placeholder={
                    chatReady
                      ? "Type a message..."
                      : "Opening chat..."
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 disabled:bg-slate-100"
                />

                <button
                  onClick={handleSend}
                  disabled={!chatReady}
                  className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Send
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

function formatLastSeen(timestamp) {
  if (!timestamp) return "recently";

  let lastSeen;

  if (
    typeof timestamp.toDate ===
    "function"
  ) {
    lastSeen = timestamp.toDate();
  } else if (
    typeof timestamp === "number"
  ) {
    lastSeen = new Date(timestamp);
  } else if (timestamp.seconds) {
    lastSeen = new Date(
      timestamp.seconds * 1000,
    );
  } else {
    lastSeen = new Date(timestamp);
  }

  if (isNaN(lastSeen.getTime())) {
    return "recently";
  }

  const diff = Math.max(
    0,
    Date.now() -
      lastSeen.getTime(),
  );

  const minutes = Math.floor(
    diff / 60000,
  );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 7) {
    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  }

  return lastSeen.toLocaleDateString();
}
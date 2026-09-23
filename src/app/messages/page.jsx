"use client";

import { usePresence } from "@/hooks/usePresence";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

export default function MessagesPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteChat, setDeleteChat] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Auth
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);

        if (!user) {
          router.push("/login");
        }
      },
    );

    return () => unsubscribeAuth();
  }, [router]);

  // Normal chats
  useEffect(() => {
    if (!currentUser) return;

    const chatsQuery = query(
      collection(db, "chats"),
      where(
        "participants",
        "array-contains",
        currentUser.uid,
      ),
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      async (snapshot) => {
        try {
          const chatList = await Promise.all(
            snapshot.docs.map(async (chatDoc) => {
              const chatData = chatDoc.data();

              if (
                chatData.hiddenFor?.includes(
                  currentUser.uid,
                )
              ) {
                return null;
              }

              const otherUserId =
                chatData.participants?.find(
                  (uid) => uid !== currentUser.uid,
                );

              if (!otherUserId) return null;

              const profileSnap = await getDoc(
                doc(db, "users", otherUserId),
              );

              return {
                id: chatDoc.id,
                ...chatData,
                otherUserId,
                profile: profileSnap.exists()
                  ? profileSnap.data()
                  : null,
              };
            }),
          );

          const validChats =
            chatList.filter(Boolean);

          validChats.sort((a, b) => {
            const timeA =
              a.updatedAt?.toMillis?.() || 0;

            const timeB =
              b.updatedAt?.toMillis?.() || 0;

            return timeB - timeA;
          });

          setChats(validChats);
          setError("");
          setLoading(false);
        } catch {
          setError(
            "Unable to load conversations.",
          );
          setLoading(false);
        }
      },
      () => {
        setError(
          "Unable to load conversations.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  // RoommateFinder system messages
  useEffect(() => {
    if (!currentUser) return;

    const systemMessagesQuery = query(
      collection(db, "systemMessages"),
      where(
        "recipientId",
        "==",
        currentUser.uid,
      ),
    );

    const unsubscribe = onSnapshot(
      systemMessagesQuery,
      (snapshot) => {
        const messageList =
          snapshot.docs.map((messageDoc) => ({
            id: messageDoc.id,
            ...messageDoc.data(),
          }));

        messageList.sort((a, b) => {
          const timeA =
            a.createdAt?.toMillis?.() || 0;

          const timeB =
            b.createdAt?.toMillis?.() || 0;

          return timeB - timeA;
        });

        setSystemMessages(messageList);
      },
      () => {
        // Do not break normal chats
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleDeleteChat = async () => {
    if (
      !currentUser ||
      !deleteChat ||
      deleting
    ) {
      return;
    }

    try {
      setDeleting(true);

      await updateDoc(
        doc(db, "chats", deleteChat.id),
        {
          hiddenFor: arrayUnion(
            currentUser.uid,
          ),
        },
      );

      setDeleteChat(null);
    } catch {
      setError(
        "Unable to delete conversation.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenSystemMessage = async (
    systemMessage,
  ) => {
    if (
      !currentUser ||
      systemMessage.read
    ) {
      return;
    }

    try {
      await updateDoc(
        doc(
          db,
          "systemMessages",
          systemMessage.id,
        ),
        {
          read: true,
        },
      );
    } catch {
      // Ignore
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto max-w-3xl py-16 text-center text-slate-500">
          Loading messages...
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">
              Messages
            </h1>

            <p className="mt-1 text-slate-500">
              Your conversations
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* RoommateFinder System Messages */}
          {systemMessages.length > 0 && (
            <div className="mb-5 space-y-3">
              {systemMessages.map(
                (systemMessage) => (
                  <SystemMessageItem
                    key={systemMessage.id}
                    message={systemMessage}
                    onOpen={() =>
                      handleOpenSystemMessage(
                        systemMessage,
                      )
                    }
                  />
                ),
              )}
            </div>
          )}

          {/* Normal Chats */}
          {chats.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="text-4xl">
                💬
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No conversations yet
              </h2>

              <p className="mt-2 text-slate-500">
                Find a roommate and start a
                conversation.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {chats.map((chat) => {
                const isUnread =
                  chat.unreadFor?.includes(
                    currentUser.uid,
                  );

                return (
                  <MessageItem
                    key={chat.id}
                    chat={chat}
                    currentUser={currentUser}
                    isUnread={isUnread}
                    onOpen={() =>
                      router.push(
                        `/chat/${chat.id}?user=${chat.otherUserId}`,
                      )
                    }
                    onDelete={() =>
                      setDeleteChat(chat)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl">
              🗑️
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Delete conversation?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This conversation will be removed
              from your Messages list. The other
              user will still have their
              conversation.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setDeleteChat(null)
                }
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteChat}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SystemMessageItem({
  message,
  onOpen,
}) {
  const isUnread = !message.read;

  return (
    <button
      onClick={onOpen}
      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md ${
        isUnread
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">

        {/* RoommateFinder Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          R
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">
            <h2
              className={`text-base text-blue-900 ${
                isUnread
                  ? "font-bold"
                  : "font-semibold"
              }`}
            >
              RoommateFinder
            </h2>

            {isUnread && (
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            )}
          </div>

          <p className="mt-0.5 text-xs font-medium text-blue-600">
            System message
          </p>

          <p
            className={`mt-2 text-sm leading-6 ${
              isUnread
                ? "font-semibold text-slate-700"
                : "text-slate-500"
            }`}
          >
            {message.preview ||
              "You have received a message from RoommateFinder."}
          </p>
        </div>

        <span className="shrink-0 text-slate-400">
          →
        </span>
      </div>
    </button>
  );
}

function MessageItem({
  chat,
  currentUser,
  isUnread,
  onOpen,
  onDelete,
}) {
  const presence = usePresence(
    chat.otherUserId,
  );

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 p-4 last:border-b-0">

      <button
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-4 text-left transition hover:opacity-80"
      >

        {/* Profile Photo + Online Dot */}
        <div className="relative shrink-0">
          {chat.profile?.photoURL ? (
            <img
              src={chat.profile.photoURL}
              alt={
                chat.profile.name ||
                "Profile"
              }
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
              👤
            </div>
          )}

          {presence?.online && (
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">

          {/* Name + Unread */}
          <div className="flex items-center gap-2">
            <h2
              className={`truncate text-slate-900 ${
                isUnread
                  ? "font-bold"
                  : "font-semibold"
              }`}
            >
              {chat.profile?.name ||
                "Unknown User"}
            </h2>

            {isUnread && (
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            )}
          </div>

          {/* Online / Last Seen */}
          <p className="mt-0.5 text-xs">
            {presence?.online ? (
              <span className="font-medium text-green-600">
                Online
              </span>
            ) : presence?.lastSeen ? (
              <span className="text-slate-400">
                Last seen{" "}
                {formatLastSeen(
                  presence.lastSeen,
                )}
              </span>
            ) : (
              <span className="text-slate-400">
                Offline
              </span>
            )}
          </p>

          {/* Last Message */}
          <p
            className={`mt-1 truncate text-sm ${
              isUnread
                ? "font-semibold text-slate-700"
                : "text-slate-500"
            }`}
          >
            {chat.lastMessage ||
              "No messages yet"}
          </p>
        </div>

        <span className="shrink-0 text-slate-400">
          →
        </span>
      </button>

      <button
        onClick={onDelete}
        aria-label="Delete conversation"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
      >
        🗑️
      </button>
    </div>
  );
}

function formatLastSeen(timestamp) {
  if (!timestamp) return "recently";

  let lastSeen;

  if (timestamp?.toDate) {
    lastSeen = timestamp.toDate();
  } else if (typeof timestamp === "number") {
    lastSeen = new Date(timestamp);
  } else if (timestamp?.seconds) {
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
    Date.now() - lastSeen.getTime(),
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
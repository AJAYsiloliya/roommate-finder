import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const idToken = authorization.substring(7);

    const decodedToken =
      await adminAuth.verifyIdToken(idToken);

    const reportedBy = decodedToken.uid;

    const body = await request.json();

    const {
      reportedUserId,
      reason,
    } = body;

    if (!reportedUserId || !reason) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        { status: 400 },
      );
    }

    if (reportedBy === reportedUserId) {
      return NextResponse.json(
        {
          error: "You cannot report yourself.",
        },
        { status: 400 },
      );
    }

    // Save report
    const reportRef = adminDb
      .collection("reports")
      .doc();

    await reportRef.set({
      reportedBy,
      reportedUserId,
      reason,
      createdAt:
        FieldValue.serverTimestamp(),
    });

    // RoommateFinder system message
    // This message belongs ONLY to the reported user.
    await adminDb
      .collection("systemMessages")
      .add({
        recipientId: reportedUserId,

        type: "report_warning",

        title: "RoommateFinder",

        message:
          "Your account has received a report. Please make sure you follow RoommateFinder's community guidelines. A report does not by itself mean that a violation has been confirmed.",

        reason,

        preview:
          `Your account has received a report. Reason: ${reason}`,

        read: false,

        reportId: reportRef.id,

        createdAt:
          FieldValue.serverTimestamp(),
      });

    // Existing notification
    await adminDb
      .collection("notifications")
      .add({
        userId: reportedUserId,

        type: "report_warning",

        title: "Account Warning",

        message:
          "Your account has received a report. Please make sure you follow RoommateFinder's community guidelines.",

        read: false,

        reportId: reportRef.id,

        createdAt:
          FieldValue.serverTimestamp(),
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Report submitted successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error?.code === "auth/id-token-expired" ||
      error?.code === "auth/argument-error" ||
      error?.code === "auth/invalid-id-token"
    ) {
      return NextResponse.json(
        {
          error:
            "Authentication expired. Please login again.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to submit report.",
      },
      { status: 500 },
    );
  }
}
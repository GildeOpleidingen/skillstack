"use server";

import { signOut, auth } from "@/auth";
import { completeLearning, completeExercise, completeQuest } from "./api";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" });
}

export async function handleCompleteLearning(exerciseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const result = await completeLearning(exerciseId, session.user.id);
    return result;
  } catch (error) {
    throw new Error("Failed to complete learning");
  }
}

export async function handleCompleteExercise(exerciseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const result = await completeExercise(exerciseId, session.user.id);
    return result;
  } catch (error) {
    throw new Error("Failed to complete exercise");
  }
}

export async function handleCompleteQuest(questId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const result = await completeQuest(questId, session.user.id);
    return result;
  } catch (error) {
    throw new Error("Failed to complete quest");
  }
}
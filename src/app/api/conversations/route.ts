import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getParticipant, listConversations } from "@/lib/messages";

export const dynamic = "force-dynamic";

/** The signed-in user's conversations, most recent activity first. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const me = await getParticipant(user);
  if (!me) return NextResponse.json({ error: "Finish your profile first." }, { status: 400 });

  return NextResponse.json({ conversations: await listConversations(me) });
}

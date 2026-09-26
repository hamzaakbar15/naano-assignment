import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { authorizeConversation, markRead } from "@/lib/messages";

/** Mark everything in the thread as read for the signed-in side. */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const access = await authorizeConversation(user, params.id);
  if (!access) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

  await markRead(access.me, params.id);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { MAX_MESSAGE_LENGTH, authorizeConversation, listMessages, sendMessage } from "@/lib/messages";

export const dynamic = "force-dynamic";

async function authorize(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Sign in first." }, { status: 401 }) };
  const access = await authorizeConversation(user, id);
  // Same 404 whether the thread doesn't exist or isn't yours - don't leak ids.
  if (!access) return { error: NextResponse.json({ error: "Conversation not found." }, { status: 404 }) };
  return { me: access.me };
}

/** Messages in the thread, oldest first. `?after=<ISO date>` returns only newer ones. */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authorize(params.id);
  if ("error" in auth) return auth.error;

  const afterParam = new URL(req.url).searchParams.get("after");
  const after = afterParam ? new Date(afterParam) : undefined;
  if (after && Number.isNaN(after.getTime())) {
    return NextResponse.json({ error: "Invalid 'after' date." }, { status: 400 });
  }

  return NextResponse.json({ messages: await listMessages(auth.me, params.id, after) });
}

/** Send a message: { body }. */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await authorize(params.id);
  if ("error" in auth) return auth.error;

  const { body } = (await req.json().catch(() => null)) ?? {};
  const text = typeof body === "string" ? body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (text.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Messages can be at most ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: await sendMessage(auth.me, params.id, text) }, { status: 201 });
}

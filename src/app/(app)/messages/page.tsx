import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getParticipant, listConversations, listMessages, markRead } from "@/lib/messages";
import { MessagesView } from "@/components/messages/messages-view";

export default async function MessagesPage({ searchParams }: { searchParams: { c?: string } }) {
  const user = await getCurrentUser();
  if (!user) return null; // (app) layout already guarantees a session + profile
  const me = await getParticipant(user);
  if (!me) redirect("/onboarding");

  const conversations = await listConversations(me);
  // ?c=<id> deep-links a thread; ignore ids that aren't one of this user's.
  const activeId = conversations.some((c) => c.id === searchParams.c) ? searchParams.c! : null;
  const messages = activeId ? await listMessages(me, activeId) : [];
  if (activeId) await markRead(me, activeId);

  return (
    <MessagesView
      role={me.role}
      initialConversations={conversations.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))}
      initialActiveId={activeId}
      initialMessages={messages}
    />
  );
}

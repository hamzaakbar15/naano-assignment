import { Prisma } from "@prisma/client";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const MAX_MESSAGE_LENGTH = 2000;

type SessionUser = { id: string; role: Role };

/** Which side of a conversation the signed-in user is on. */
export type Participant = { userId: string; role: Role; profileId: string };

export type ConversationSummary = {
  id: string;
  counterpart: { name: string; subtitle: string | null; profileHref: string | null };
  lastMessage: { body: string; createdAt: string; fromMe: boolean } | null;
  unread: number;
  /** Last activity: newest message, or when the thread was opened. */
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  fromMe: boolean;
};

export async function getParticipant(user: SessionUser): Promise<Participant | null> {
  const profile =
    user.role === "CREATOR"
      ? await prisma.creatorProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      : await prisma.companyProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
  return profile ? { userId: user.id, role: user.role, profileId: profile.id } : null;
}

function ownerFilter(me: Participant): Prisma.ConversationWhereInput {
  return me.role === "COMPANY" ? { companyId: me.profileId } : { creatorId: me.profileId };
}

/**
 * One query: the conversation if the signed-in user is one of its two sides,
 * plus which side - so per-thread API calls don't need a separate profile lookup.
 */
export async function authorizeConversation(user: SessionUser, id: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      ...(user.role === "COMPANY" ? { company: { userId: user.id } } : { creator: { userId: user.id } }),
    },
    select: { id: true, companyId: true, creatorId: true },
  });
  if (!conversation) return null;
  const me: Participant = {
    userId: user.id,
    role: user.role,
    profileId: user.role === "COMPANY" ? conversation.companyId : conversation.creatorId,
  };
  return { me, conversation };
}

/** Opens (or reuses) the thread for a company-creator pair - called on booking. */
export function ensureConversation(companyId: string, creatorId: string) {
  return prisma.conversation.upsert({
    where: { companyId_creatorId: { companyId, creatorId } },
    create: { companyId, creatorId },
    update: {},
  });
}

export async function listConversations(me: Participant): Promise<ConversationSummary[]> {
  const conversations = await prisma.conversation.findMany({
    where: ownerFilter(me),
    include: {
      company: { select: { companyName: true, website: true } },
      creator: { select: { id: true, headline: true, user: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: [{ lastMessageAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  // Unread = messages from the other side newer than my last-read mark, in one
  // grouped query rather than one count per thread.
  const readColumn = Prisma.raw(me.role === "COMPANY" ? `"companyLastReadAt"` : `"creatorLastReadAt"`);
  const ownerColumn = Prisma.raw(me.role === "COMPANY" ? `"companyId"` : `"creatorId"`);
  const unreadRows = await prisma.$queryRaw<{ conversationId: string; unread: number }[]>`
    SELECT m."conversationId", COUNT(*)::int AS unread
    FROM "Message" m
    JOIN "Conversation" c ON c."id" = m."conversationId"
    WHERE c.${ownerColumn} = ${me.profileId}
      AND m."senderId" <> ${me.userId}
      AND m."createdAt" > COALESCE(c.${readColumn}, 'epoch'::timestamp)
    GROUP BY m."conversationId"`;
  const unreadById = new Map(unreadRows.map((r) => [r.conversationId, r.unread]));

  return conversations.map((c) => {
    const last = c.messages[0];
    const counterpart =
      me.role === "COMPANY"
        ? {
            name: c.creator.user.name || "Unnamed creator",
            subtitle: c.creator.headline,
            profileHref: `/marketplace/${c.creator.id}`,
          }
        : { name: c.company.companyName, subtitle: c.company.website, profileHref: null };
    return {
      id: c.id,
      counterpart,
      lastMessage: last
        ? { body: last.body, createdAt: last.createdAt.toISOString(), fromMe: last.senderId === me.userId }
        : null,
      unread: unreadById.get(c.id) ?? 0,
      updatedAt: (c.lastMessageAt ?? c.createdAt).toISOString(),
    };
  });
}

/** Messages in a thread, oldest first. `after` returns only newer ones (for polling). */
export async function listMessages(me: Participant, conversationId: string, after?: Date): Promise<ChatMessage[]> {
  const rows = await prisma.message.findMany({
    where: { conversationId, ...(after ? { createdAt: { gt: after } } : {}) },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.reverse().map((m) => ({
    id: m.id,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
    fromMe: m.senderId === me.userId,
  }));
}

export async function sendMessage(me: Participant, conversationId: string, body: string): Promise<ChatMessage> {
  const now = new Date();
  const readField = me.role === "COMPANY" ? "companyLastReadAt" : "creatorLastReadAt";
  const [message] = await prisma.$transaction([
    prisma.message.create({ data: { conversationId, senderId: me.userId, body, createdAt: now } }),
    // Bump the thread to the top of both lists; my own message counts as read.
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: now, [readField]: now },
    }),
  ]);
  return { id: message.id, body: message.body, createdAt: message.createdAt.toISOString(), fromMe: true };
}

export function markRead(me: Participant, conversationId: string) {
  const readField = me.role === "COMPANY" ? "companyLastReadAt" : "creatorLastReadAt";
  return prisma.conversation.update({ where: { id: conversationId }, data: { [readField]: new Date() } });
}

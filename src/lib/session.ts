import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Server Component / Route Handler helper — null when signed out. */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

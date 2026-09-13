import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

// Module augmentation: surface `id` and `role` on the session/JWT everywhere
// next-auth's types are used, instead of casting `any` at every call site.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

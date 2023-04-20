import { createCookieSessionStorage, redirect } from "@remix-run/node";

import { compare } from "bcryptjs";

import { db } from "./db.server";

type loginForm = {
  username: string;
  password: string;
};

export const login = async ({ password, username }: loginForm) => {
  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    return null;
  }

  const passwordMatch = await compare(password, user.passwordHash);

  if (!passwordMatch) {
    return null;
  }

  return { id: user.id, username };
};

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
};

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null;

  return userId;
};

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  console.log({ redirectTo });
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(`/login?${searchParams}`);
  }

  return userId;
};

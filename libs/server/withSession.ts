import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
const cookieOptions = {
  cookieName: process.env.COOKIE_NAME,
  password: process.env.COOKIE_PASSW!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions as IronSessionOptions);
}
export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions as IronSessionOptions);
}

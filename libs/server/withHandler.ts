import { NextApiRequest, NextApiResponse } from "next";
export type ResponseType = {
  ok: boolean;
  [key: string]: any;
};
type method = "GET" | "POST" | "DELETE";
interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}
export default function withHandler({
  methods,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as method)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: "Please login" });
    }
    try {
      await handler(req, res);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  };
}

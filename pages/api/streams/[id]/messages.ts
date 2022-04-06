import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { id },
    body: { message },
  } = req;
  try {
    const createdMessage = await client.message.create({
      data: {
        message,
        user: {
          connect: {
            id: user?.id,
          },
        },
        stream: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
    res.json({
      ok: true,
      createdMessage,
    });
  } catch (e) {
    console.error(e);
    res.json({ ok: false, message: "failed message" });
  }
}

export default withApiSession(
  withHandler({
    handler,
    methods: ["POST"],
  })
);

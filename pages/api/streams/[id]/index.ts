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
  } = req;
  try {
    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        messages: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                avatar: true,
                id: true,
              },
            },
          },
        },
      },
    });
    res.json({
      ok: true,
      stream,
    });
  } catch (e) {
    console.error(e);
    res.json({ ok: false, message: "not found the stream" });
  }
}

export default withApiSession(
  withHandler({
    handler,
    methods: ["GET"],
  })
);

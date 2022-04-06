import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question, latitude, longitude },
    session: { user },
  } = req;

  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const latitudeFloat = parseFloat(latitude.toString());
    const longitudeFloat = parseFloat(longitude.toString());
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            answers: true,
            wonderings: true,
          },
        },
      },
      where: {
        latitude: {
          gte: latitudeFloat - 0.01,
          lte: latitudeFloat + 0.01,
        },
        longitude: {
          gte: longitudeFloat - 0.01,
          lte: longitudeFloat + 0.01,
        },
      },
    });
    res.json({
      ok: true,
      posts,
    });
  }
  if (req.method === "POST") {
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    // await res.unstable_revalidate("/community");
    res.json({
      ok: true,
      post,
    });
  }
}

export default withApiSession(
  withHandler({
    handler,
    methods: ["GET", "POST"],
  })
);

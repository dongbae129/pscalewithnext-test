import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";
import axios from "axios";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const urlResponse = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CF_TOKEN}`,
        },
      }
    )
  ).json();
  console.log(urlResponse, "RE");
  res.json({
    ok: true,
    ...urlResponse.result,
  });
}

export default withApiSession(
  withHandler({
    handler,
    methods: ["GET"],
  })
);

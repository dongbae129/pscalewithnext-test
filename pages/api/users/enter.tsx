import mail from "@sendgrid/mail";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

mail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;

  if (!user)
    return res.status(400).json({
      ok: false,
    });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
            // ...(phone && { phone: +phone }),
            // ...(email && { email }),
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}`,
    // });
    // console.log(message, "^&^%^%^");
  } else if (email) {
    // const email = await mail.send({
    //   from: "dongbae129@naver.com",
    //   to: "dongbae129@naver.com",
    //   subject: " Verification Email test",
    //   text: `Your token is ${payload}`,
    // });
    // console.log(email, "%%%%");
  }

  // const user = await client.user.upsert({
  //   where: {
  //     ...payload,
  //     // ...(phone && { phone: +phone }),
  //     // ...(email && { email }),
  //   },
  //   create: {
  //     name: "Anonymous",
  //     ...payload,
  //   },
  //   update: {},
  // });
  // if (email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (!user) {
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user, "@@@");
  // }
  // if (phone) {
  //   user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     },
  //   });
  //   if (!user) {
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //   }
  // }

  res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});

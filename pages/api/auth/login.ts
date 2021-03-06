import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import CryptoJS from "crypto-js";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method != "POST") {
      return res.status(300).json({
        error: "Method not valid!",
      });
    }

    const password = req.body.password;

    if (!password || password != (process.env.PASSWORD as string)) {
      return res.status(300).json({
        error: "Invalid password provided!",
      });
    }

    const encrypted = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET as string
    );

    const cookies = new Cookies(req, res);
    cookies.set("token", encrypted.toString(), {
      maxAge: 60 * 60 * 24 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login correct!",
    });
  })();
}

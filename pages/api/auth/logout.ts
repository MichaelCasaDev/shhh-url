import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method != "POST") {
      return res.status(300).json({
        error: "Method not valid!",
      });
    }

    const cookies = new Cookies(req, res);
    cookies.set("token", "", {
      overwrite: true,
      maxAge: 0,
    });

    return res.status(200).json({
      message: "Logout correct!",
    });
  })();
}

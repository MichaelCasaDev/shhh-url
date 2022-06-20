import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method != "GET") {
      return res.status(300).json({
        error: "Method not valid!",
      });
    }

    const client = await MongoClient.connect(
      process.env.DATABASE_URI as string
    );
    const db = client.db("shhh-url");

    const urls: any[] = [];

    const pointer = db.collection("urls").find({});
    await pointer.forEach((doc) => {
      urls.push(doc);
    });

    urls.reverse();

    return res.status(200).json({
      urls,
    });
  })();
}

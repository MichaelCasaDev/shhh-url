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
      "mongodb://127.0.0.1:27017/?readPreference=primary&serverSelectionTimeoutMS=2000&directConnection=true&ssl=false"
    );
    const db = client.db("sh-url");

    const urls: any[] = [];

    const pointer = db.collection("urls").find({});
    await pointer.forEach((doc) => {
      urls.push(doc);
    });

    return res.status(200).json({
      urls,
    });
  })();
}

import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method != "POST") {
      return res.status(300).json({
        error: "Method not valid!",
      });
    }
    const _id = req.body._id;
    console.log(_id);

    const client = await MongoClient.connect(
      process.env.DATABASE_URI as string
    );
    const db = client.db("shhh-url");
    const doc = await db.collection("urls").deleteOne({
      _id: new ObjectId(_id),
    });

    return res.status(200).json({
      doc,
    });
  })();
}

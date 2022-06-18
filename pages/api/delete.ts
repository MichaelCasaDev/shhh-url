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
      "mongodb://127.0.0.1:27017/?readPreference=primary&serverSelectionTimeoutMS=2000&directConnection=true&ssl=false"
    );
    const db = client.db("sh-url");

    const doc = await db.collection("urls").deleteOne({
      _id: new ObjectId(_id),
    });

    return res.status(200).json({
      doc,
    });
  })();
}

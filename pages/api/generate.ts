import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method != "POST") {
      return res.status(300).json({
        error: "Method not valid!",
      });
    }

    const client = await MongoClient.connect(
      "mongodb://127.0.0.1:27017/?readPreference=primary&serverSelectionTimeoutMS=2000&directConnection=true&ssl=false"
    );
    const db = client.db("sh-url");

    const generatedUrl = "http://localhost:3000/url/" + makeid(10);

    await db.collection("urls").insertOne({
      url: req.body.url,
      generatedUrl,
      openTimes: 0,
    });

    return res.status(200).json({
      url: req.body.url,
      generatedUrl,
    });
  })();
}

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

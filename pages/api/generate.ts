import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  (async () => {
    if (req.method != "POST") {
      return res.status(300).json({
        error: "Method not valid!",
      });
    }
    const url = req.body.url;
    const length = req.body.length;
    const generatedUrl = "http://localhost:3000/" + makeid(length);

    if (!validURL(url)) {
      return res.status(300).json({
        error: "URL not valid!",
      });
    }

    const client = await MongoClient.connect(
      process.env.DATABASE_URI as string
    );
    const db = client.db("shhh-url");
    await db.collection("urls").insertOne({
      url,
      generatedUrl,
      openTimes: 0,
    });

    return res.status(200).json({
      url,
      generatedUrl,
      length,
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

function validURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

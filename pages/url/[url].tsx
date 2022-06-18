import { MongoClient } from "mongodb";
import type { GetServerSidePropsContext, NextPage } from "next";

const Page: NextPage = () => {
  return <></>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = await MongoClient.connect(
    "mongodb://127.0.0.1:27017/?readPreference=primary&serverSelectionTimeoutMS=2000&directConnection=true&ssl=false"
  );
  const db = client.db("sh-url");

  const generatedUrl = "http://localhost:3000/url/" + context.query.url;

  const doc = await db.collection("urls").findOne({
    generatedUrl,
  });

  if (doc) {
    await db.collection("urls").updateOne(doc, {
      $inc: {
        openTimes: 1,
      },
    });

    return {
      redirect: {
        destination: doc.url,
        permanent: false,
      },
    };
  }

  return {
    notFound: true,
  };
}
export default Page;

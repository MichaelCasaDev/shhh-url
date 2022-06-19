import { MongoClient } from "mongodb";
import type { GetServerSidePropsContext, NextPage } from "next";

const Page: NextPage = () => {
  return <></>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const generatedUrl = "http://localhost:3000/" + context.query.url;

  const client = await MongoClient.connect(
    "mongodb://127.0.0.1:27017/?readPreference=primary&serverSelectionTimeoutMS=2000&directConnection=true&ssl=false"
  );
  const db = client.db("sh-url");
  const doc: any = await db.collection("urls").findOneAndUpdate(
    {
      generatedUrl,
    },
    {
      $inc: {
        openTimes: 1,
      },
    }
  );

  if (doc) {
    return {
      redirect: {
        destination: doc.value.url,
        permanent: false,
      },
    };
  }

  return {
    notFound: true,
  };
}
export default Page;

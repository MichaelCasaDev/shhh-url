import { MongoClient } from "mongodb";
import type { GetServerSidePropsContext, NextPage } from "next";

export default function Page() {
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const generatedUrl = (process.env.BASE_URI as string) + context.query.url;

  const client = await MongoClient.connect(process.env.DATABASE_URI as string);
  const db = client.db("shhh-url");
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

  if (doc.value) {
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

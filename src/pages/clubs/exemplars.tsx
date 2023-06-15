import type { GetServerSideProps } from "next";

import toast from "react-hot-toast";

import Header from "~/components/Header";
import Message from "~/components/Message";
import ExemplarItem from "~/components/exemplars/exemplar.details";
import { getServerAuthSession } from "~/server/lib/getServerAuthSession";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return { redirect: { permanent: false, destination: "/auth/signin" } };
  }

  return {
    props: {},
  };
};

const ExemplarList = () => {
  const { data: exemplars } = api.exemplar.getExemplars.useQuery(
    { limit: 10, page: 1 },
    {
      select: (data) => data?.exemplars,
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  return (
    <>
      <Header />
      <section className="bg-ct-blue-600 min-h-screen py-12">
        <div>
          {exemplars?.length === 0 ? (
            <Message>There are no exemplars at the moment</Message>
          ) : (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 md:grid-cols-3">
              {exemplars?.map((exemplar: any) => (
                <ExemplarItem key={exemplar.id} exemplar={exemplar} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ExemplarList;

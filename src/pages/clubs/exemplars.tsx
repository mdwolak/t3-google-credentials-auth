import type { GetServerSideProps } from "next";
import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { SlideOver } from "~/components/dialogs/SlideOver";
import CreateExemplarDialog from "~/components/exemplars/create.exemplar.dialog";
import ExemplarItem from "~/components/exemplars/exemplar.details";
import { getLayout } from "~/components/layouts/Layout";
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
  const [openDialog, setOpenDialog] = useState(false);

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
      <a className="cursor-pointer" onClick={() => setOpenDialog(true)}>
        Create Exemplar
      </a>
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
      <SlideOver open={openDialog} setOpen={setOpenDialog}>
        <CreateExemplarDialog setOpen={setOpenDialog} />
      </SlideOver>
    </>
  );
};
ExemplarList.getLayout = getLayout;
export default ExemplarList;

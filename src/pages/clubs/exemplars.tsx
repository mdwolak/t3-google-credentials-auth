import { useState } from "react";

import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { SlideOver } from "~/components/dialogs/SlideOver";
import CreateExemplarDialog from "~/components/exemplars/create.exemplar.dialog";
import { getLayout } from "~/components/layouts/Layout";
import { api } from "~/utils/api";

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
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Plans"
        buttonText="Add Exemplar"
        onButtonClick={() => setOpenDialog(true)}>
        Your team is on the <strong className="font-semibold text-gray-900">Startup</strong> plan.
        The next payment of $80 will be due on August 4, 2022.
      </TableCaption>
      <div>
        {exemplars?.length === 0 ? (
          <Message>There are no exemplars at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Exemplar</THeader>
                  <THeader screen="sm">Category</THeader>
                  <THeader screen="lg">Content</THeader>
                  <THeader screen="lg">Created</THeader>
                  {/* <THeader>Price</THeader> */}
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exemplars?.map((exemplar, rownum) => (
                  <tr key={exemplar.id}>
                    <TCell first>
                      {exemplar.title}
                      {exemplar.published && (
                        <span className="ml-1 text-indigo-600">(published)</span>
                      )}
                    </TCell>
                    <TCell screen="sm">{exemplar.category}</TCell>
                    <TCell screen="lg">{exemplar.content}</TCell>
                    <TCell screen="lg">
                      {format(parseISO(exemplar.createdAt.toISOString()), "PPP")}
                    </TCell>
                    {/* <TCell>
                  <div className="sm:hidden">{exemplar.price}/mo</div>
                  <div className="hidden sm:block">{exemplar.price}/month</div>
                </TCell> */}
                    <TCell last>
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {exemplar.title}</span>
                      </a>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <SlideOver open={openDialog} setOpen={setOpenDialog}>
        <CreateExemplarDialog setOpen={setOpenDialog} />
      </SlideOver>
    </div>
  );
};
ExemplarList.getLayout = getLayout;
export default ExemplarList;

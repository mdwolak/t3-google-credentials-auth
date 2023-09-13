import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { getLayout } from "~/components/layouts/Layout";
import CreateOrganisationDialog from "~/components/organisations/create.organisation.dialog";
import UpdateOrganisationDialog from "~/components/organisations/update.organisation.dialog";
import { type OrganisationInfo } from "~/server/api/routers/organisation.router";
import { api } from "~/utils/api";

const OrganisationList = () => {
  const apiContext = api.useContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateOrganisation, setUpdateOrganisation] = useState<OrganisationInfo | null>(null);
  const [deleteOrganisationId, setDeleteOrganisationId] = useState<number>(0);

  const { data: organisations } = api.organisation.getFiltered.useQuery(
    { limit: 10, page: 1 },
    {
      select: (data) => data?.organisations,
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  const { mutate: deleteOrganisation } = api.organisation.delete.useMutation({
    onSuccess() {
      apiContext.organisation.invalidate();
      toast.success("Organisation deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Organisations"
        buttonText="Add Organisation"
        onButtonClick={() => setOpenCreate(true)}>
        Manage organisations for your account.
      </TableCaption>
      <div>
        {organisations?.length === 0 ? (
          <Message>There are no organisations at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Organisation</THeader>
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
                {organisations?.map((organisation) => (
                  <tr key={organisation.id}>
                    <TCell first>
                      {organisation.name}
                      {organisation.visible && (
                        <span className="ml-1 text-indigo-600">(visible)</span>
                      )}
                    </TCell>
                    <TCell screen="sm">{organisation.type}</TCell>
                    <TCell screen="lg">{organisation.description}</TCell>
                    <TCell screen="lg">
                      <FormattedDate date={organisation.createdAt} />
                    </TCell>
                    {/* <TCell>
                  <div className="sm:hidden">{organisation.price}/mo</div>
                  <div className="hidden sm:block">{organisation.price}/month</div>
                </TCell> */}
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateOrganisation(organisation)}>
                        Edit<span className="sr-only">, {organisation.name}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteOrganisationId(organisation.id)}>
                        Delete<span className="sr-only">, {organisation.name}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateOrganisation} onClose={() => setUpdateOrganisation(null)}>
        <UpdateOrganisationDialog
          organisation={updateOrganisation as OrganisationInfo}
          handleClose={() => setUpdateOrganisation(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateOrganisationDialog handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete organisation"
        description="Are you sure you want to delete this organisation? This action cannot be undone."
        open={!!deleteOrganisationId}
        handleClose={(confirm) => {
          if (confirm) deleteOrganisation(deleteOrganisationId);
          setDeleteOrganisationId(0);
        }}
      />
    </div>
  );
};
OrganisationList.getLayout = getLayout;
export default OrganisationList;

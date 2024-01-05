"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { Menu } from "~/components/menus/Menu";
import { type OrganisationInfo } from "~/server/api/routers/organisation.router";
import { api } from "~/trpc/client";

import CreateOrganisationDialog from "./_components/create.organisation.dialog";
import UpdateOrganisationDialog from "./_components/update.organisation.dialog";

export default function OrganisationList() {
  const apiUtils = api.useUtils();

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
    },
  );

  const { mutate: deleteOrganisation } = api.organisation.delete.useMutation({
    onSuccess() {
      apiUtils.organisation.invalidate();
      toast.success("Organisation deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  function getMenuItems(organisation: OrganisationInfo) {
    return [
      {
        label: "Edit",
        onClick: () => setUpdateOrganisation(organisation),
      },
      {
        label: "Delete",
        onClick: () => setDeleteOrganisationId(organisation.id),
      },
    ];
  }

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Organisations"
        buttonText="Add Organisation"
        onButtonClick={() => setOpenCreate(true)}>
        Manage organizations, their settings and members
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
                  <THeader screen="lg">Description</THeader>
                  <THeader screen="lg">Created</THeader>
                  {/* <THeader>Price</THeader> */}
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organisations?.map((organisation, index) => (
                  <tr key={organisation.id}>
                    <TCell first>
                      <Link href={`/admin/org/${organisation.id}/profile`}>
                        {organisation.name}
                        {organisation.visible && (
                          <span className="ml-1 text-indigo-600">(visible)</span>
                        )}
                      </Link>
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
                    <TCell className="w-12">
                      <Menu items={getMenuItems(organisation)} srName="Organisation" key={index} />
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
}

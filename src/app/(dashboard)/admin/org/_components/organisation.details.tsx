import { useState } from "react";

import toast from "react-hot-toast";

import { FormattedDate } from "~/components/core";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { type OrganisationInfo } from "~/server/api/routers/organisation.router";
import { api } from "~/trpc/client";

import UpdateOrganisationDialog from "./update.organisation.dialog";

type OrganisationItemProps = {
  organisation: OrganisationInfo;
};

const OrganisationItem = ({ organisation }: OrganisationItemProps) => {
  const apiUtils = api.useUtils();
  const [selectedOrganisation, setSelectedOrganisation] = useState<OrganisationInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteOrganisation } = api.organisation.delete.useMutation({
    onSuccess() {
      apiUtils.organisation.invalidate();
      toast.success("Organisation deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const onDeleteHandler = (id: number) => {
    toggleMenu();
    if (window.confirm("Are you sure")) {
      deleteOrganisation(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">
            {organisation.name.length > 25
              ? organisation.name.substring(0, 25) + "..."
              : organisation.name}
          </h5>
          <div className="mt-4 flex items-center">
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">{organisation.type}</p>
            <p className="text-[#ffa238]">
              <FormattedDate date={organisation.createdAt} />
            </p>
          </div>
          <div className="mt-4">{organisation.description}</div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setSelectedOrganisation(organisation);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(organisation.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      {selectedOrganisation && (
        <SlideOver open={true} onClose={() => setSelectedOrganisation(null)}>
          <UpdateOrganisationDialog
            organisation={selectedOrganisation}
            handleClose={() => setSelectedOrganisation(null)}
          />
        </SlideOver>
      )}
    </>
  );
};

export default OrganisationItem;

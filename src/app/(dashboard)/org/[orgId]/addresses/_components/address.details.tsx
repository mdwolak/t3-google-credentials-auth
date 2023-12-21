import { useState } from "react";

import toast from "react-hot-toast";

import { FormattedDate } from "~/components/core";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { truncate } from "~/lib/common";
import { type AddressInfo } from "~/server/api/routers/address.router";
import { api } from "~/trpc/client";

import UpdateAddressDialog from "./update.address.dialog";

type AddressItemProps = {
  address: AddressInfo;
};

const AddressItem = ({ address }: AddressItemProps) => {
  const apiUtils = api.useUtils();
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(null);

  const [openMenu, setOpenMenu] = useState(false);

  const { mutate: deleteAddress } = api.address.delete.useMutation({
    onSuccess() {
      apiUtils.address.invalidate();
      toast.success("Address deleted successfully");
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
      deleteAddress(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">
            {truncate(address.line1, 25)}
          </h5>
          <div className="mt-4 flex items-center">
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">{address.line2}</p>
            <p className="text-[#ffa238]">
              <FormattedDate date={address.createdAt} />
            </p>
          </div>
          <div className="mt-4">{address.postcode + " " + address.city}</div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setSelectedAddress(address);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(address.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      {selectedAddress && (
        <SlideOver open={true} onClose={() => setSelectedAddress(null)}>
          <UpdateAddressDialog
            address={selectedAddress}
            handleClose={() => setSelectedAddress(null)}
          />
        </SlideOver>
      )}
    </>
  );
};

export default AddressItem;

"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { type AddressInfo } from "~/server/api/routers/address.router";
import { api } from "~/trpc/client";

import CreateAddressDialog from "./_components/create.address.dialog";
import UpdateAddressDialog from "./_components/update.address.dialog";

export function AddressList({ orgId }: { orgId: number }) {
  const apiUtils = api.useUtils();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateAddress, setUpdateAddress] = useState<AddressInfo | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<number>(0);

  const { data: addresses } = api.address.getFiltered.useQuery(
    { orgId, limit: 10, page: 1 },
    {
      enabled: !!orgId,
      select: (data) => data?.addresses,
      onError(error) {
        toast.error(error.message);
      },
    },
  );

  const { mutate: deleteAddress } = api.address.delete.useMutation({
    onSuccess() {
      apiUtils.address.invalidate();
      toast.success("Address deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Addresses"
        buttonText="Add Address"
        onButtonClick={() => setOpenCreate(true)}>
        Manage addresses for your account.
      </TableCaption>
      <div>
        {addresses?.length === 0 ? (
          <Message>There are no addresses at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Line1</THeader>
                  <THeader>Line2</THeader>
                  <THeader screen="lg">City</THeader>
                  <THeader screen="lg">County</THeader>
                  <THeader>Postcode</THeader>
                  <THeader screen="lg">Created</THeader>
                  {/* <THeader>Price</THeader> */}
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {addresses?.map((address) => (
                  <tr key={address.id}>
                    <TCell first>{address.line1}</TCell>
                    <TCell>{address.line2}</TCell>
                    <TCell screen="lg">{address.city}</TCell>
                    <TCell screen="lg">{address.county}</TCell>
                    <TCell>{address.postcode}</TCell>
                    <TCell screen="lg">
                      <FormattedDate date={address.createdAt} />
                    </TCell>
                    {/* <TCell>
                  <div className="sm:hidden">{address.price}/mo</div>
                  <div className="hidden sm:block">{address.price}/month</div>
                </TCell> */}
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateAddress(address)}>
                        Edit<span className="sr-only">, {address.postcode}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteAddressId(address.id)}>
                        Delete<span className="sr-only">, {address.postcode}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlideOver open={!!updateAddress} onClose={() => setUpdateAddress(null)}>
        <UpdateAddressDialog
          address={updateAddress as AddressInfo}
          handleClose={() => setUpdateAddress(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateAddressDialog handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        open={!!deleteAddressId}
        handleClose={(confirm) => {
          if (confirm) deleteAddress(deleteAddressId);
          setDeleteAddressId(0);
        }}
      />
    </div>
  );
}

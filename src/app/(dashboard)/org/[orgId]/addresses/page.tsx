import { AddressList } from "./address-list";

export default async function AddressListPage({ params }: { params: { orgId: string } }) {
  return <AddressList orgId={Number(params.orgId)} />;
}

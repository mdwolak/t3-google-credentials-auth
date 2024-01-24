import { type RouterOutputs } from "~/trpc/client";

export default function OrganisationProfile({
  organisation,
}: {
  organisation: RouterOutputs["organisation"]["getById"];
}) {
  return (
    <>
      {organisation.id}
      {"<OrganisationItem />"}
    </>
  );
}

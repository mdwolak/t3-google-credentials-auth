import { type RouterOutputs, api } from "~/trpc/client";

import OrganisationItem from "../_components/organisation.details";

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

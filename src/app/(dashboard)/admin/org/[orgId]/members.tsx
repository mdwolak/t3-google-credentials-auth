import { type RouterOutputs } from "~/trpc/client";

export default function OrganisationMembers({
  organisation,
}: {
  organisation: RouterOutputs["organisation"]["getById"];
}) {
  return <>{organisation.id} Organisation Members</>;
}

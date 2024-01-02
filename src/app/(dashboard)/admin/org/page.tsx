import { TabList } from "~/components/navbars/TabList";

import { OrganisationList } from "./organisation-list";

const tabs = [
  { name: "Applied", href: "#", count: "52", current: false },
  { name: "Phone Screening", href: "#", count: "6", current: false },
  { name: "Interview", href: "#", count: "4", current: true },
  { name: "Offer", href: "#", current: false },
];

export default async function OrganisationListPage() {
  return (
    <>
      <TabList tabs={tabs} />
      <OrganisationList />
    </>
  );
}

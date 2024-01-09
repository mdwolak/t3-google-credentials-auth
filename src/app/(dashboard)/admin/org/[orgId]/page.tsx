"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";

import { toast } from "~/components/core";
import { type TabItem, TabList } from "~/components/navbars/TabList";
import PageHeader from "~/components/sections/PageHeader";
import { getTabIndexFromSearchParam } from "~/lib/tabUtils";
import { api } from "~/trpc/client";

const ProfilePage = dynamic(() => import("./profile"), {
  loading: () => <p>Loading profile</p>,
});

const MembersPage = dynamic(() => import("./members"), {
  loading: () => <p>Loading members</p>,
});

export default function OrganisationPage() {
  const params = useParams();
  const orgId = Number(params?.orgId);

  const selectedTab = useSearchParams().get("tab");

  const { data: organisation } = api.organisation.getById.useQuery(orgId, {
    onError(error) {
      toast.error(error.message);
    },
  });

  if (!organisation) return <p>Loading organisation</p>;

  const tabs: TabItem[] = [
    { label: "Profile", name: "profile", content: <ProfilePage organisation={organisation} /> }, //consider loading without dynamic
    { label: "Members", name: "members", content: <MembersPage organisation={organisation} /> },
  ];

  return (
    <>
      <PageHeader
        title={organisation.name}
        breadcrumbs={[{ label: "Organisations", url: "/admin/org" }]}
      />
      <TabList tabs={tabs} defaultIndex={getTabIndexFromSearchParam(tabs, selectedTab)} />
    </>
  );
}

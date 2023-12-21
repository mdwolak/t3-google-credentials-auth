import { ActivityList } from "./activity-list";

export default async function ActivityListPage({ params }: { params: { orgId: string } }) {
  return <ActivityList orgId={Number(params.orgId)} />;
}

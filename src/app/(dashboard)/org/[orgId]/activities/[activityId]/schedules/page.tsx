import { ScheduleList } from "./schedule-list";

export default async function ScheduleListPage({ params }: { params: { activityId: string } }) {
  return <ScheduleList activityId={Number(params.activityId)} />;
}

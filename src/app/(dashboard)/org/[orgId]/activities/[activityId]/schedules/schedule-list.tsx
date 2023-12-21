"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import CreateScheduleDayDialog from "~/app/(dashboard)/org/[orgId]/activities/[activityId]/schedules/_components/scheduleDays/create.scheduleDay.dialog";
import UpdateScheduleDayDialog from "~/app/(dashboard)/org/[orgId]/activities/[activityId]/schedules/_components/scheduleDays/update.scheduleDay.dialog";
import Message from "~/components/Message";
import { TCell, THeader, TableCaption } from "~/components/Table";
import { Button, FormattedDate, Link } from "~/components/core";
import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";
import { SlideOver } from "~/components/dialogs/SlideOver";
import { formatTime, weekDays } from "~/lib/common";
import { type ScheduleInfo } from "~/server/api/routers/schedule.router";
import { type ScheduleDayInfo } from "~/server/api/routers/scheduleDay.router";
import { api } from "~/utils/api";

import CreateScheduleDialog from "./_components/create.schedule.dialog";
import UpdateScheduleDialog from "./_components/update.schedule.dialog";

export function ScheduleList({ activityId }: { activityId: number }) {
  const apiUtils = api.useUtils();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateSchedule, setUpdateSchedule] = useState<ScheduleInfo | null>(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState(0);

  const [openCreateScheduleDay, setOpenCreateScheduleDay] = useState<ScheduleInfo | null>(null);
  const [updateScheduleDay, setUpdateScheduleDay] = useState<{
    schedule: ScheduleInfo;
    scheduleDay: ScheduleDayInfo;
  } | null>(null);

  const { data: schedules } = api.schedule.getByActivityId.useQuery(activityId, {
    enabled: !!activityId,
    select: (data) => data.schedules,
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutate: deleteSchedule } = api.schedule.delete.useMutation({
    onSuccess() {
      apiUtils.schedule.invalidate();
      toast.success("Schedule deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div className="sm:px-2 lg:px-4">
      <TableCaption
        title="Schedule"
        buttonText="Add Schedule"
        onButtonClick={() => setOpenCreate(true)}>
        Manage schedules for your account.
      </TableCaption>
      <div>
        {schedules?.length === 0 ? (
          <Message>There are no schedules at the moment</Message>
        ) : (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <THeader first>Schedule</THeader>
                  <THeader>ScheduleDays</THeader>
                  <THeader screen="sm">Start Date</THeader>
                  <THeader screen="lg">End Date</THeader>
                  <THeader screen="lg">Created</THeader>
                  <THeader last>
                    <span className="sr-only">Select</span>
                  </THeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules?.map((schedule) => (
                  <tr key={schedule.id}>
                    <TCell first>{schedule.name}</TCell>
                    <TCell>
                      <div>
                        {schedule.scheduleDays?.map((scheduleDay) => (
                          <div
                            key={scheduleDay.dayOfWeek}
                            className="flex flex-wrap gap-x-6 gap-y-4">
                            <span>{weekDays[scheduleDay.dayOfWeek - 1]}</span>
                            <Button
                              key={scheduleDay.id}
                              size="xs"
                              onClick={() =>
                                setUpdateScheduleDay({
                                  schedule,
                                  scheduleDay: { ...scheduleDay, scheduleId: schedule.id },
                                })
                              }
                              // className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                            >
                              {formatTime(scheduleDay.startTime)}
                            </Button>
                          </div>
                        ))}
                        {!schedule.scheduleDays && (
                          <div>There are no scheduleDays at the moment</div>
                        )}
                        <Button
                          size="xs"
                          onClick={() => setOpenCreateScheduleDay(schedule)}
                          // className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                        >
                          + Add schedule day
                        </Button>
                      </div>
                    </TCell>
                    <TCell screen="sm">
                      <FormattedDate date={schedule.startDate} />
                    </TCell>
                    <TCell screen="lg">
                      {schedule.endDate && <FormattedDate date={schedule.endDate} />}
                    </TCell>
                    <TCell screen="lg">
                      <FormattedDate date={schedule.createdAt} />
                    </TCell>
                    <TCell last className="space-x-2">
                      <Link href="#" onClick={() => setUpdateSchedule(schedule)}>
                        Edit<span className="sr-only">, {schedule.name}</span>
                      </Link>
                      <span>|</span>

                      <Link
                        href="#"
                        variant="secondary"
                        onClick={() => setDeleteScheduleId(schedule.id)}>
                        Delete<span className="sr-only">, {schedule.name}</span>
                      </Link>
                    </TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals for Schedules */}
      <SlideOver open={!!updateSchedule} onClose={() => setUpdateSchedule(null)}>
        <UpdateScheduleDialog
          schedule={updateSchedule as ScheduleInfo}
          handleClose={() => setUpdateSchedule(null)}
        />
      </SlideOver>

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateScheduleDialog activityId={activityId} handleClose={() => setOpenCreate(false)} />
      </SlideOver>

      <ConfirmDelete
        title="Delete schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone."
        open={!!deleteScheduleId}
        handleClose={(confirm) => {
          if (confirm) deleteSchedule(deleteScheduleId);
          setDeleteScheduleId(0);
        }}
      />

      {/* Modals for ScheduleDays */}
      <SlideOver open={!!updateScheduleDay} onClose={() => setUpdateScheduleDay(null)}>
        <UpdateScheduleDayDialog
          schedule={updateScheduleDay?.schedule as ScheduleInfo}
          scheduleDay={updateScheduleDay?.scheduleDay as ScheduleDayInfo}
          handleClose={() => setUpdateScheduleDay(null)}
        />
      </SlideOver>

      <SlideOver open={!!openCreateScheduleDay} onClose={() => setOpenCreateScheduleDay(null)}>
        <CreateScheduleDayDialog
          schedule={openCreateScheduleDay as ScheduleInfo}
          handleClose={() => setOpenCreateScheduleDay(null)}
        />
      </SlideOver>
    </div>
  );
}

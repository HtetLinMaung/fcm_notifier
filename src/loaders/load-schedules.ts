import ScheduledJob from "../models/scheduled-job";
import { globalEmitter, schedules, timezones } from "../share";

export default async function loadSchedules() {
  //   await ScheduledJob.deleteMany({});
  const scheduledJobs = await ScheduledJob.find();

  for (const scheduledJob of scheduledJobs) {
    if (schedules[scheduledJob.key]) {
      schedules[scheduledJob.key].push(scheduledJob);
    } else {
      schedules[scheduledJob.key] = [scheduledJob];
    }
    if (!timezones.includes(scheduledJob.timezone)) {
      timezones.push(scheduledJob.timezone);
      globalEmitter.emit("new-timezone", scheduledJob.timezone);
    }
  }
}

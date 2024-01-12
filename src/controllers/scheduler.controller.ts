import { Request, Response } from "express";
import AddFcmScheduleDto from "../dto/add-fcm-schedule.dto";
import { globalEmitter, schedules, timezones } from "../share";
import { log } from "starless-logger";
import generateSchedulesKey from "../utils/generate-schedules-key";
import ScheduledJob from "../models/scheduled-job";
import moment from "moment";

export const addFcmSchedule = async (req: Request, res: Response) => {
  try {
    const body: AddFcmScheduleDto = req.body;
    log(
      `Received schedule creation request with body: ${JSON.stringify(body)}`
    );

    if (moment(body.time).isBefore(moment())) {
      log(`Schedule creation failed: Provided time is in the past.`, "warn");
      return res.status(400).json({
        code: 400,
        message: "Schedule creation failed: Provided time is in the past!",
      });
    }
    const schedulesKey = generateSchedulesKey(
      body.time,
      body.timezone || "Asia/Yangon"
    );
    log(`Generated schedule key: ${schedulesKey}`);

    //     const year: number = timeInTimeZone.year();
    // const month: number = timeInTimeZone.month() + 1; // Month is 0-indexed
    // const day: number = timeInTimeZone.date();
    // const hour: number = timeInTimeZone.hour();
    // const minute: number = timeInTimeZone.minute();
    // const second: number = timeInTimeZone.second();

    const scheduledJob = new ScheduledJob({
      key: schedulesKey,
      body: body.body,
      time: body.time,
      timezone: body.timezone,
    });
    await scheduledJob.save();
    log(`Scheduled job saved: ${JSON.stringify(scheduledJob)}`);

    if (schedules[schedulesKey]) {
      schedules[schedulesKey].push(scheduledJob);
    } else {
      schedules[schedulesKey] = [scheduledJob];
    }

    if (!timezones.includes(body.timezone)) {
      timezones.push(body.timezone);
      globalEmitter.emit("new-timezone", body.timezone);
      log(`New timezone added and emitted: ${body.timezone}`);
    }

    res.json({
      code: 200,
      message: "Schedule added successfully.",
      data: scheduledJob,
    });
  } catch (err) {
    log(`Error in addFcmSchedule: ${(err as Error).message}`, "error");
    // log((err as Error).message, "error");
    res.status(500).json({
      code: 500,
      message: "Something went wrong!",
    });
  }
};

export const cancelFcmSchedule = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    log(`Received cancel schedule request for key: ${key}`);
    const scheduledJob = await ScheduledJob.findOne({ key });
    if (!scheduledJob) {
      log(`Scheduled job not found for key: ${key}`, "warn");
      return res.status(404).json({
        code: 404,
        message: "Scheduled job not found!",
      });
    }
    const timezone = scheduledJob.timezone;
    await ScheduledJob.deleteOne({ key });
    delete schedules[key];

    const count = await ScheduledJob.countDocuments({ timezone });
    if (count == 0) {
      globalEmitter.emit("remove-timezone", timezone);
      log(`Timezone ${timezone} removed due to no scheduled jobs.`);
    }
    log(`Scheduled job with key ${key} cancelled successfully.`);
    res.json({
      code: 200,
      message: "Cancel scheduled job successfully.",
    });
  } catch (err) {
    log(`Error in cancelFcmSchedule: ${(err as Error).message}`, "error");
    res.status(500).json({
      code: 500,
      message: "Something went wrong!",
    });
  }
};

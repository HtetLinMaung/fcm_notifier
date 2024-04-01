import express from "express";
import cors from "cors";
import router from "./routes";
import generateSchedulesKey from "./utils/generate-schedules-key";
import { globalEmitter, schedules, timers, timezones } from "./share";
import sendNotifiation from "./utils/send-notification";
import { log } from "starless-logger";
import connectMongoDb from "./loaders/connect-mongodb";
import loadSchedules from "./loaders/load-schedules";
import { clearInterval } from "timers";
import ScheduledJob from "./models/scheduled-job";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

function onNotificationSent(key: string, timezone: string, id: string) {
  ScheduledJob.deleteOne({ _id: id })
    .catch(console.error)
    .finally(() => {
      schedules[key] = schedules[key].filter(
        (scheduleJob) => scheduleJob._id != id
      );
      log("Removing finished scheduled job successfully.");
      ScheduledJob.countDocuments({ timezone })
        .then((count) => {
          if (count == 0) {
            globalEmitter.emit("remove-timezone", timezone);
          }
        })
        .catch(console.error);
    });
}

async function main() {
  await connectMongoDb();
  log("Mongo DB connection established.");

  globalEmitter.on("new-timezone", (timezone) => {
    log(`Set timer for timezone: ${timezone}`);
    timers[timezone] = setInterval(() => {
      const key = generateSchedulesKey(new Date().toISOString(), timezone);
      console.log(key);
      if (key in schedules) {
        for (const scheduleJob of schedules[key]) {
          sendNotifiation(scheduleJob.body)
            .then(() => {})
            .catch((err) => log(err.message, "error"));
          onNotificationSent(key, timezone, scheduleJob._id);
        }
      } else {
        const keys = Object.keys(schedules).filter((k) => k < key);
        for (const key of keys) {
          for (const scheduleJob of schedules[key]) {
            log("send notification for late schedule");
            sendNotifiation(scheduleJob.body)
              .then(() => {})
              .catch((err) => log(err.message, "error"));
            onNotificationSent(key, timezone, scheduleJob._id);
          }
        }
      }
    }, 1000);
  });

  globalEmitter.on("remove-timezone", (timezone) => {
    if (timers[timezone]) {
      log(`Remove timer for timezone: ${timezone}`);
      clearInterval(timers[timezone]);
      delete timers[timezone];
    }
    const index = timezones.findIndex((tz) => tz == timezone);
    if (index != -1) {
      timezones.splice(index, 1);
    }
  });

  await loadSchedules();
}

main();

export default app;
// 2024-1-5 10:16:36 Asia/Yangon
// 2024-1-5 10:16:4 Asia/Yangon

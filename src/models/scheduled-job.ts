import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledJob extends Document {
  key: string;
  body: object;
  time: string;
  timezone: string;
}

const scheduledJobSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  body: {
    type: Schema.Types.Mixed,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    default: "Asia/Yangon",
  },
});

export default mongoose.model<IScheduledJob>("ScheduleJob", scheduledJobSchema);

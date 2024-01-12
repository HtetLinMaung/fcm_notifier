import EventEmitter from "events";
import { IScheduledJob } from "./models/scheduled-job";

export const globalEmitter = new EventEmitter();

export const schedules: Record<string, IScheduledJob[]> = {};

export const timezones: string[] = [];

export const timers: any = {};

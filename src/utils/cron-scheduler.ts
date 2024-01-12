import { exec } from "child_process";

export const scheduleCronJob = (
  time: string,
  command: string,
  jobId: string
): void => {
  // Create the cron job string with a unique identifier
  const cronJob = `${time} ${command} # Job ID: ${jobId}\n`;

  exec(
    `(crontab -l 2>/dev/null; echo "${cronJob}") | crontab -`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        throw new Error("Failed to schedule cron job");
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        throw new Error("Failed to schedule cron job");
      }
      console.log("Cron job scheduled successfully");
    }
  );
};

export const cancelCronJob = (jobId: string): void => {
  exec(
    `crontab -l | grep -v 'Job ID: ${jobId}' | crontab -`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        throw new Error("Failed to cancel cron job");
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        throw new Error("Failed to cancel cron job");
      }
      console.log("Cron job cancelled successfully");
    }
  );
};

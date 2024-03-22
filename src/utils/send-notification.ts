import axios from "axios";
import { log } from "starless-logger";

const { FIREBASE_FCM_URL, FIREBASE_FCM_AUTH, IBANKING_URL } = process.env;

export default async function sendNotifiation(body: any) {
  log("Sending notificaion...");
  log(`url: ${FIREBASE_FCM_URL}`);
  log(`body: ${JSON.stringify(body)}`);
  const headers = {
    Authorization: FIREBASE_FCM_AUTH || "key=",
  };
  log(`headers: ${JSON.stringify(headers)}`);
  const response = await axios.post(
    FIREBASE_FCM_URL || "https://fcm.googleapis.com/fcm/send",
    body,
    {
      headers,
    }
  );
  if (response.data) {
    log(response.data);
  }
  const outsideResponse = await axios.post(
    `${IBANKING_URL}/api/addoutsidenotification`,
    {
      title: body.notification.title,
      description: body.notification.body,
      arrivaltime: new Date().toISOString().split("T")[0],
    }
  );
  if (outsideResponse.data) {
    log(outsideResponse.data);
  }

  return response;
}

import axios from "axios";
import { log } from "starless-logger";

const { FIREBASE_FCM_URL, FIREBASE_FCM_AUTH } = process.env;

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

  return response;
}

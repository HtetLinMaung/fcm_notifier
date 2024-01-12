import dotenv from "dotenv";
dotenv.config();

import { log } from "starless-logger";
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});



import * as logger from "firebase-functions/logger";
import {onSchedule} from "firebase-functions/v2/scheduler";


export const everyMinute = onSchedule("* * * * *", async (event) => {
  logger.log("everyMinute function started at", new Date().toISOString());
});


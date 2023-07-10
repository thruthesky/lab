# Firebase Cloud Functions - Cron 스케쥴링


참고 문서: https://firebase.google.com/docs/functions/schedule-functions?gen=2nd


참고
- function deploy 할 때, 자동으로 pub/sub topic 이 생성되고 schduling 필요한 작업이 수행된다고 함.

## 설치

- 참고로 본인은 TypeScript 를 선택해서 설치

```sh
% mkdir cron
% cd cron 
% firebase init functions
```

## 코드

```ts
import * as logger from "firebase-functions/logger";
import {onSchedule} from "firebase-functions/v2/scheduler";

export const everyMinute = onSchedule("* * * * *", async (event) => {
  logger.log("everyMinute function started at", new Date().toISOString());
});
```

## 배포

% cd functions
% npm run deploy

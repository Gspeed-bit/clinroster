import "dotenv/config";
import { createApp } from "./app.js";
import { DB } from "./config/db.js";
import { getKeys } from "./config/keys.js";

(async () => {
  await DB.connect();
  const app = createApp();
  const { port, host } = getKeys();
  app.listen(Number(port), host, () => {
    console.log(`Server:  http://${host}:${port}`);
    console.log(`Swagger: http://${host}:${port}/docs`);
  });
})();

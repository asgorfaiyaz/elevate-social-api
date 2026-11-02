import { app } from "./app.js";
import { env } from "./config/env.js";
import connectToDatabase from "./db/mongodb.js";

app.listen(env.PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${env.PORT}`);
});

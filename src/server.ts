import { app } from "./app.js";
import { env } from "./config/env.js";
import connectToDatabase from "./db/mongodb.js";

await connectToDatabase();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

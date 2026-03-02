import "./src/config/env.config.js";

import app from "./src/app.js";
import connectDB from "./src/config/db.config.js";
import { PORT, NODE_ENV } from "./src/config/env.config.js";
import runMigrations from "./src/migrations/index.js";

async function startServer() {
  try {
    await connectDB();
   
    const port = PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
}

startServer();
import "./src/config/env.config.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.config.js";
import { PORT } from "./src/config/env.config.js";
import { migration_system_commands_names } from "./src/migrations/utils.js";
import { migration_system } from "./src/migrations/index.js";

async function main() {
  if (migration_system_commands_names.includes(process.argv[2])) {
    // running migration command use ` node index.js migration --help ` for more information
    await migration_system();
  } else {
    // config and run server
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
}

main();

import app from "./src/app.js";
import "./src/config/env.config.js"
import './src/config/db.config.js';

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
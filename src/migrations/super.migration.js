import "../config/db.config.js";
import User from "../modules/users/schemas/user.schema.js";
import bcrypt from "bcrypt";
async function migrateSuperAdmin() {
  const existingSuperAdmin = await User.findOne({ role: "super" });
  if (existingSuperAdmin) {
    console.log("Super admin user already exists. Migration skipped.");
    return;
  }

  const superAdmin = new User({
    firstName: "yazidi",
    lastName: "abdelwaheb",
    email: "yazidiabdelwaheb@gmail.com",
    password: "123456",
    role: "super",
    accountActive: true,
  });
  
  superAdmin.password = await bcrypt.hash(superAdmin.password, 10);
  await superAdmin.save();
  console.log("Super admin user created successfully.");
}
migrateSuperAdmin()
  .then(() => {
    console.log("Migration completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

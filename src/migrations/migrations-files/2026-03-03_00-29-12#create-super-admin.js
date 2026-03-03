import { askQuestion } from "../utils.js";
import User from "../../modules/users/schemas/user.schema.js";
import connectDB from "../../config/db.config.js";
import { userRoleEnums } from "../../shared/index.js";
import bcrypt from "bcrypt"

const validateInput = async(field, value) => {
  switch (field) {
    case "first_name":
      if (!value || value.length < 3 || !/[a-zA-Z]/.test(value)) return "First name must be at least 3 characters.";
      break;
    case "last_name":
      if (!value || value.length < 3 || !/[a-zA-Z]/.test(value)) return "Last name must be at least 3 characters.";
      break;
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format.";
      if(await User.findOne({ email: value})) return "Email already used.";
      break;
    case "password":
      if (value.length < 6 || !/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
        return "Password must be at least 6 characters, contain a letter and a number.";
      }
      break;
    default:
      return null;
  }
  return null;
};


const getValidatedInput = async (field, message) => {
  let value;
  while (true) {
    value = await askQuestion(message);
    const error = await validateInput(field, value);
    if (!error) break;
    console.log(`${error}`);
  }
  return value;
};


const createSuperAdminMigration = async() => {
  try {
    // Your migration logic here

    await connectDB();

    const existingAdmin = await User.findOne({ role: userRoleEnums.super });
    
    if (existingAdmin) {
      //console.log("Super admin already exists. Do you like create author super admin ? [y/n] : ");
      let value = await askQuestion("Super admin already exists. Do you like create other super admin ? [y/n] :");
      if(value === "n" || value === "N")
      return;
    }

    console.log("Creating new super admin...");

    
    const lastName =await getValidatedInput("last_name", "Enter your Last name: ");
    const firstName = await getValidatedInput("first_name", "Enter your First name: ");
    const email = await getValidatedInput("email", "Enter your Email: ");
    const password = await getValidatedInput("password", "Enter your Password: ");
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new User({
      email,
      lastName,
      firstName,
      password : hashedPassword,
      role: userRoleEnums.super,
      accountActive: true,
    });
    
    
    

    await superAdmin.save();
    console.log(`\nSuper admin ${lastName} ${lastName} created successfully!`);
    
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
    process.exit(0)
  }finally {
    process.exit(0)
  }
}

// Run the migration
createSuperAdminMigration();


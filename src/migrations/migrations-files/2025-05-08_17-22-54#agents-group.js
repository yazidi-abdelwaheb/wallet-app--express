//import { askQuestion } from "../utils.js";

import { Types } from "mongoose";
import { COMPANY_ID, GROUP_ID_AGENTS } from "../../shared/shared.exports.js";
import Groups from "../../modules/groups/groups.schema.js";
import { setupMongoServer } from "../../config/db.config.js";

const agentsGroupMigration = async () => {
  try {
    // Your migration logic here
    await setupMongoServer()
    const exists = await Groups.exists({ _id: GROUP_ID_AGENTS });
    if(exists){
      console.log("Group Agents alredy exists!");
    }else{
      await new Groups({
      _id : new Types.ObjectId(GROUP_ID_AGENTS),
      companyId : new Types.ObjectId(COMPANY_ID),
      label :"Agents",
      code : "agents",
    }).save()

    console.log("Group Agents created successfully.");
    }
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    
      process.exit(0);
    
  }
};

// Run the migration
agentsGroupMigration();

import { loadData } from "../utils.js";

//import { askQuestion } from "../utils.js";
const initFeaturesMigration = async () => {
  try {
    // Your migration logic here
    const data = await loadData('features')

    console.log(data)

  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
    process.exit(1)
  }finally {
    process.exit(0)
  }
};

// Run the migration
initFeaturesMigration();

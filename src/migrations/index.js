import migrateSuperAdmin from "./super.migration.js";

export default async function runMigrations() {
  await migrateSuperAdmin();
}

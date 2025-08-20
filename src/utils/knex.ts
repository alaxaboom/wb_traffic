import knex from "../postgres/knex.js";

export async function runMigrations() {
  try {
    console.log("🔄 Running database migrations...");
    
    const [batchNo, migrations] = await knex.migrate.latest();
    
    if (migrations.length === 0) {
      console.log("✅ All migrations are already up to date");
    } else {
      console.log(`✅ Migrations completed. Batch: ${batchNo}`);
      console.log("Ran migrations:", migrations);
    }
    
    return true;
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    return false;
  }
}

export async function runSeeds() {
  try {
    console.log("🌱 Running database seeds...");
    
    const [seeds] = await knex.seed.run();
    
    if (seeds.length === 0) {
      console.log("✅ No seeds to run");
    } else {
      console.log(`✅ Seeds completed. Ran ${seeds.length} seed files`);
    }
    
    return true;
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    return false;
  }
}

export async function closeConnection() {
  await knex.destroy();
}
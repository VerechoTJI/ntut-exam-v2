const { initDatabase } = require('./src/config/database.config.ts');
const { ViolationLog } = require('./src/models/violation-log.model.ts');

require('ts-node/register');

async function run() {
  await require('./src/config/database.config').initDatabase();
  const logs = await require('./src/models/violation-log.model').ViolationLog.findAll({ limit: 1 });
  console.log(JSON.stringify(logs, null, 2));
  process.exit(0);
}
run().catch(console.error);

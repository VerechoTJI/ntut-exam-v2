import { SystemSettingsService } from "./src/services/system-settings.service";
import { sequelize } from "./src/config/database.config";

async function run() {
  await sequelize.authenticate();
  const config = await SystemSettingsService.getExamConfig();
  console.log(JSON.stringify(config?.judgerSettings, null, 2));
  console.log(config?.sections[0]?.puzzles[0]?.memoryLimit);
  process.exit(0);
}
run();

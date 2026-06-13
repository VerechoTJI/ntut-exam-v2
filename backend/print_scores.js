const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
});
const ScoreBoard = sequelize.define('ScoreBoard', {
  puzzleResults: { field: 'puzzle_results', type: DataTypes.JSON }
}, { tableName: 'score_boards', timestamps: false });

async function run() {
  await sequelize.authenticate();
  const res = await ScoreBoard.findAll();
  console.log(JSON.stringify(res, null, 2));
}
run();

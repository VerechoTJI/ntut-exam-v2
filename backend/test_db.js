const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
});

const ScoreBoard = sequelize.define('ScoreBoard', {
  puzzleResults: {
    field: 'puzzle_results',
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, { tableName: 'score_boards', timestamps: false });

async function run() {
  await sequelize.authenticate();
  const res = await ScoreBoard.findOne();
  if (res) {
    console.log("Type of puzzleResults:", typeof res.puzzleResults);
    console.log("Value:", res.puzzleResults);
  } else {
    console.log("No score boards found.");
  }
}
run();

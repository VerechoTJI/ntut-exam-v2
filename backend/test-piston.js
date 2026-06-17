const { pistonJudger } = require('piston-judger');

async function run() {
  const judger = pistonJudger({ server: "http://localhost:2000" });
  console.log("Running...");
  const res = await judger.execute("javascript", "console.log('hello');", {
    run_timeout: 10000,
    run_memory_limit: 268435456
  });
  console.log(JSON.stringify(res, null, 2));
}
run();

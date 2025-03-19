const { checkWeather } = require("./weatherService.js");
const cron = require("node-cron");

cron.schedule("*/3 * * * *", async () => {
  console.log("Checking weather...");
  await checkWeather();
});

console.log("Weather checker is running");

const axios = require("axios");
const redis = require("./redis.js");
const dotenv = require("dotenv");
const { sendTelegramMessage } = require("./telegramService.js");

dotenv.config();

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const LOCATION = "Klojen,id";

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    return { condition: response.data.weather[0].main, detail: response.data };
  } catch (error) {
    console.error("Error fetching weather data", error);
    return null;
  }
}

async function checkWeather() {
  const { condition: newWeather, detail } = await getWeather();
  if (!newWeather) return;

  const lastWeather = await redis.get("weather_klojen");

  if (lastWeather !== newWeather) {
    console.log(`Weather change ${lastWeather} -> ${newWeather}`);
    await redis.set("weather_klojen", newWeather);
    console.log(`Weather changed to ${newWeather}`);
    await sendTelegramMessage(detail);
  } else {
    console.log("Weather is still the same");
  }
}

module.exports = { checkWeather };

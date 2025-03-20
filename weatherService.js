const axios = require("axios");
const redis = require("./redis.js");
const dotenv = require("dotenv");
const { sendTelegramMessage } = require("./telegramService.js");

dotenv.config();

const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const LOCATION = "Klojen,id";

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${API_KEY}&units=metric`;
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=-7.9612&lon=112.6176&appid=304d596c538a1e63ee2ef75645aa95e8&units=metric`;
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
  const weatherDesc = detail.weather[0].description;
  const lastWeatherDesc = await redis.get("weather_klojen_desc");

  if (lastWeatherDesc !== weatherDesc) {
    console.log(`Weather change ${lastWeatherDesc} -> ${weatherDesc}`);
    await redis.set("weather_klojen_desc", weatherDesc);
    console.log(`Weather changed to ${weatherDesc}`);
    await sendTelegramMessage(detail);
  } else {
    console.log("Weather is still the same");
  }
}

module.exports = { checkWeather };

const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");
const { getWeatherIcon } = require("./weatherIcon.js");

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const botToken = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramMessage(data) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    // await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
    const text = `🌤️ *Weather Update for ${data.name}:* 🌍

  🌡️ *Temperature:* ${data.main.temp}°C
  🌈 *Condition:* ${data.weather[0].main} (${data.weather[0].description})
  💧 *Humidity:* ${data.main.humidity}%
  🌬️ *Wind Speed:* ${data.wind.speed} km/h

  Stay safe and enjoy your day! 😊
    `;

    const response = await axios.post(
      url,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Telegram message sent");
  } catch (error) {
    console.error("Error sending telegram message", error);
  }
}

module.exports = { sendTelegramMessage };

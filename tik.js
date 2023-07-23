const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const botToken = '6174249361:AAEfFbXDeACp93XVCIuAZ9iMlADRckVuAkY';
const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Send me a TikTok video URL, and I will extract the sound for you!');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText.startsWith('https://www.tiktok.com/') || messageText.startsWith('https://m.tiktok.com/')) {
    try {
      const soundURL = await extractSoundFromTikTok(messageText);
      bot.sendMessage(chatId, `Here's the sound from the TikTok video: ${soundURL}`);
    } catch (error) {
      console.error('Error extracting sound:', error);
      bot.sendMessage(chatId, 'An error occurred while processing the TikTok video.');
    }
  } else {
    bot.sendMessage(chatId, 'Please provide a valid TikTok video URL.');
  }
});

async function extractSoundFromTikTok(videoURL) {
  try {
    const response = await axios.get(videoURL);
    const htmlContent = response.data;
    const soundURLMatch = htmlContent.match(/"playUrl":"(.*?)"/);

    if (!soundURLMatch || !soundURLMatch[1]) {
      throw new Error('Sound URL not found in TikTok video page.');
    }

    const soundURL = soundURLMatch[1].replace(/\\u0026/g, '&');
    return soundURL;
  } catch (error) {
    throw new Error('Failed to extract sound from the TikTok video.');
  }
}

// Handle Telegram bot errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
});

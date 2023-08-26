const TelegramBot = require('node-telegram-bot-api');
const TikTokScraper = require('tiktok-scraper');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const botToken = 'API TOKEN';
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
      bot.sendMessage(chatId, 'An error occurred while processing the TikTok video.');
    }
  } else {
    bot.sendMessage(chatId, 'Please provide a valid TikTok video URL.');
  }
});

async function extractSoundFromTikTok(videoURL) {
  try {
    const videoMeta = await TikTokScraper.getVideoMeta(videoURL);
    const soundURL = videoMeta.collector[0].music.playUrl;
    return soundURL;
  } catch (error) {
    throw new Error('Failed to extract sound from the TikTok video.');
  }
}

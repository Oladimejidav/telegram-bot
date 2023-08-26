const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Replace 'YOUR_API_TOKEN' with your Telegram Bot API token
const bot = new TelegramBot('API Token', { polling: true });

bot.onText(/\/getaudio (.+)/, async (msg, match) => {
  const videoUrl = match[1];
  const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
  const audioFilePath = 'audio.mp3';
  const outputStream = fs.createWriteStream(audioFilePath);

  audioStream.pipe(outputStream);
  outputStream.on('finish', () => {
    bot.sendAudio(msg.chat.id, audioFilePath);
  });
});

bot.on('polling_error', (error) => {
  console.error(error);
});

console.log('Bot is running...');

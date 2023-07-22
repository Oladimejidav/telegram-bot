const TelegramBot = require('node-telegram-bot-api');
const TikTokScraper = require('tiktok-scraper');
const axios = require('axios');
const fs = require('fs');

// Replace 'YOUR_API_TOKEN' with your Telegram Bot API token
const bot = new TelegramBot('6174249361:AAEfFbXDeACp93XVCIuAZ9iMlADRckVuAkY', { polling: true });

bot.onText(/\/getaudio (.+)/, async (msg, match) => {
  const tiktokUrl = match[1];
  console.log('TikTok URL:', tiktokUrl);

  try {
    // Scrape TikTok video metadata
    console.log('Scraping TikTok metadata...');
    const videoData = await TikTokScraper.getVideoMeta(tiktokUrl);
    console.log('Video data:', videoData);

    // Get the audio URL from the video metadata
    const audioUrl = videoData.collector[0].videoUrlNoWaterMark;
    console.log('Audio URL:', audioUrl);

    // Download the audio file
    console.log('Downloading audio file...');
    const response = await axios.get(audioUrl, { responseType: 'stream' });
    const audioFilePath = 'audio.mp3';
    const outputStream = fs.createWriteStream(audioFilePath);

    response.data.pipe(outputStream);

    outputStream.on('finish', () => {
      // Send the audio file to the Telegram chat
      console.log('Audio file downloaded. Sending to Telegram chat...');
      bot.sendAudio(msg.chat.id, audioFilePath);
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');

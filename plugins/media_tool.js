const { Module, isPublic } = require('../lib/');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { jslbuffer } = require('abu-bot');
const { trim, trimVideo } = require('abu-bot');
const config = require('../config');
const acrcloud = require('acrcloud');

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: config.ACR_A,
  access_secret: config.ACR_S,
});

const handler =
  config.HANDLERS !== 'false' ? config.HANDLERS.split('')[0] : '';

async function findMusic(file) {
  return new Promise((resolve, reject) => {
    acr.identify(file)
      .then((result) => {
        const data = result.metadata?.music[0];
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

Module(
  {
    pattern: 'find ?(.*)',
    fromMe: isPublic,
    desc: 'Finds music name using AI',
    usage: '.find reply to a music',
    use: 'search',
  },
  async (message, match) => {
    if (!message.reply_message?.audio)
      return await message.reply('_Reply to a music_');

    if (message.reply_message.duration > 60)
      return await message.send(
        '_Audio too large! Use .trim command and cut the audio to < 60 secs_'
      );

    try {
      const audio = await message.reply_message.download('buffer');
      const data = await findMusic(audio);

      if (!data) return await message.reply('_No matching results found!_');

      function getDuration(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      }

      const Message = {
        text: `*Title:* ${data.title}\nArtists: ${data.artists
          ?.map((e) => e.name + ' ')
          .join('')}\nReleased on: ${data.release_date}\nDuration: ${getDuration(
          data.duration_ms
        )}\nAlbum: ${data.album?.name}\nGenres: ${data.genres
          ?.map((e) => e.name + ' ')
          .join('')}\nLabel: ${data.label}\n`,
      };

      await message.client.sendMessage(message.jid, Message, {
        quoted: message,
      });
    } catch (error) {
      console.error('An error occurred:', error);
      await message.reply('_An error occurred while processing the audio._');
    }
  }
);

const request = require('request');

const TelegramBot = require('node-telegram-bot-api');
const token = require('../config.js').TELEGRAM_TOKEN;
const chat_id = require('../config.js').CHAT_ID;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  let chatId = msg.chat.id;
  let text = msg.text;
  if(chatId == chat_id){
    switch(text){
      default:
        bot.sendMessage(chatId, msg.text);
    }
  }
});

module.exports = bot;

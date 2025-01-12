/*******************************************************
* БОТ v1.1x (20 задач, колесо фортуны с анимацией,
* прогресс-бар и авторы в разделе "Помощь")
*******************************************************/

import TelegramBot from 'node-telegram-bot-api';
import { getFileData } from './utils/fileData.js';
import { showHelp, startMessage, showMainMenu, showTasks } from './command/commands.js';
import { callbackHandlers } from './command/callbackHandlers.js'
import { messageHandlers } from './command/messageHandlers.js';
import dotenv from 'dotenv';

dotenv.config();

// Настройка и запуск бота
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

 
// Работа с файлами 
const userData = getFileData('user_data.json')
const tasks = getFileData('tasks_data.json')

// команды
bot.onText(/\/start/, (msg) => startMessage(bot, tasks, userData, msg.chat.id, msg.from.id))
bot.onText(/\/menu/, (msg) => showMainMenu(bot, tasks, userData, msg.chat.id, msg.from.id));
bot.onText(/\/help/, (msg) => showHelp(bot, msg.chat.id));
bot.onText(/\/task/, (msg) => showTasks(bot, userData, tasks, msg.chat.id, msg.from.id));
bot.on('callback_query', (query) => callbackHandlers(bot, tasks, userData, query))
bot.on('message',  (msg) => messageHandlers(bot, userData, tasks, msg))

bot.on('polling_error', (error) => {
  console.error('polling_error:', error);
});
 
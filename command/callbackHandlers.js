import { ensureUserData } from '../utils/fileData.js' 
import { spinWheelAnimation } from './spinWheelAnimation.js'
import { showTasks, showHelp, showStats, showMainMenu } from './commands.js'

export const callbackHandlers = (bot, tasks, userData, query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    
    bot.answerCallbackQuery(query.id);

    switch (data) { 
      case 'show_tasks':
        return showTasks(bot, userData, tasks, chatId, userId);
      case 'show_help':
        return showHelp(bot, chatId);
      case 'show_stats':
        return showStats(bot, userData, tasks, chatId, userId );
      case 'go_main_menu':
        return showMainMenu(bot, tasks, userData, chatId, userId);
      case 'spin_wheel':
        ensureUserData(userId, userData);

        const solved = userData[userId].completed_tasks;
        const unsolvedTasks = tasks.filter(t => !solved.includes(t.description));

        if (unsolvedTasks.length === 0) {
          const text = `Все задачи уже решены!\n\nТвой баланс: ${userData[userId].balance}`;
          const kb = { 
            reply_markup: { 
              inline_keyboard: [[{ text: '← Назад в меню', callback_data: 'go_main_menu' }]] 
            } 
          };
          return bot.sendMessage(chatId, text, kb);
        }

        const chosenTask = spinWheelAnimation(bot, chatId, unsolvedTasks);
        userData[userId].currentTask = chosenTask;
        return;
      default:
        if (data.startsWith('task_')) {
          const taskIndex = parseInt(data.split('_')[1], 10);
          const task = tasks[taskIndex];
          ensureUserData(userId, userData);

          userData[userId].currentTask = task;

          const text = `<b>Задача:</b> ${task.description}\n<b>Имя функции:</b> ${task.function_name}\n\nОтправьте в чат JavaScript-код этой функции.`;
          const kb = {
            reply_markup: {
              inline_keyboard: [
                [{ text: '← Назад в меню', callback_data: 'go_main_menu' }],
                [{ text: 'Помощь', callback_data: 'show_help' }]
              ]
            },
            parse_mode: 'HTML'
          };

        bot.sendMessage(chatId, text, kb);
        }
    }
  };
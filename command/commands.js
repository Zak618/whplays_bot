import { ensureUserData } from '../utils/fileData.js';

// Начальное сообщение
export const startMessage = (bot, tasks, userData, chatId, userId) => {
    ensureUserData(userId, userData);

    const solvedCount = userData[userId].completed_tasks.length;
    const totalCount = tasks.length;
    const balance = userData[userId].balance;
      
    const text = 
        `<b>Главное меню</b>\n\n` +
        `Баланс: ${balance} очков\n` +
        `Решено задач: ${solvedCount} / ${totalCount}\n\n` +
        `Выбери действие:`;

    const menuKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Все задачи', callback_data: 'show_tasks' },
                    { text: 'Колесо фортуны', callback_data: 'spin_wheel' }
                ],
                [
                    { text: 'Помощь', callback_data: 'show_help' },
                    { text: 'Мой прогресс', callback_data: 'show_stats' }
                ]
            ]
        },
        parse_mode: 'HTML'
    };
      
    bot.sendMessage(chatId, text, menuKeyboard);
    
}

// Показать справку
export const showHelp = (bot, chatId) => {
   const helpText = `
<b>Справка по боту</b>
 
 1. Нажмите «Все задачи» или «Колесо фортуны» (случайный нерешённый вариант).
 2. Получите описание задачи и имя функции, которую нужно объявить.
 3. Напишите JS-код и отправьте в чат (без доп. команд).
 4. Если все тесты пройдены — +1 к балансу (при первом решении).
 5. «Мой прогресс» показывает, сколько задач решено и ваш баланс.
 
 <b>Авторы:</b>
 <a href="tg://resolve?domain=rolanzakirov">@rolanzakirov</a> и <a href="tg://resolve?domain=Lojip_0">@Lojip_0</a>
 `.trim();
 
   const menuKeyboard = {
     reply_markup: {
       inline_keyboard: [
         [{ text: '← Назад в меню', callback_data: 'go_main_menu' }]
       ]
     },
     parse_mode: 'HTML'
   };
 
   return bot.sendMessage(chatId, helpText, menuKeyboard);
}


// Главное меню (4 кнопки)
export const showMainMenu = (bot, tasks, userData, chatId, userId) => {
  ensureUserData(userId, userData);

  const solvedCount = userData[userId].completed_tasks.length;
  const totalCount = tasks.length;
  const balance = userData[userId].balance;
 
  const text = 
    `<b>Главное меню</b>\n\n` +
    `Баланс: ${balance} очков\n` +
    `Решено задач: ${solvedCount} / ${totalCount}\n\n` +
    `Выбери действие:`;
 
  const menuKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Все задачи', callback_data: 'show_tasks' },
          { text: 'Колесо фортуны', callback_data: 'spin_wheel' }
        ],
        [
          { text: 'Помощь', callback_data: 'show_help' },
          { text: 'Мой прогресс', callback_data: 'show_stats' }
        ]
      ]
    },
    parse_mode: 'HTML'
   };

  bot.sendMessage(chatId, text, menuKeyboard);
}


// Показать задачи
export const showTasks = (bot, userData, tasks, chatId, userId) => {
    ensureUserData(userId, userData);
    const kb = buildTaskKeyboard(userId, userData, tasks);

    bot.sendMessage(chatId, 'Выберите задачу:', {
        reply_markup: { inline_keyboard: kb }
    });
}


export const showStats = (bot, userData, tasks, chatId, userId) => {
  ensureUserData(userId, userData);
  const solvedCount = userData[userId].completed_tasks.length;
  const totalCount = tasks.length;
  const balance = userData[userId].balance;
 
  const progressBar = buildProgressBar(solvedCount, totalCount);
 
  const text = 
    `<b>Мой прогресс</b>\n\n` +
    `Решено задач: ${solvedCount} / ${totalCount}\n` +
    `Баланс очков: ${balance}\n\n` +
    `${progressBar}\n\n` +
    `Что дальше?`;
 
  const kb = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '← Назад в меню', callback_data: 'go_main_menu' }],
        [{ text: 'Все задачи', callback_data: 'show_tasks' }],
        [{ text: 'Помощь', callback_data: 'show_help' }]
      ]
    },
    parse_mode: 'HTML'
  };
 
  bot.sendMessage(chatId, text, kb);
}

function buildTaskKeyboard(userId, userData, tasks) {
  const keyboard = [];
  const tasksPerRow = 2;

  for (let i = 0; i < tasks.length; i += tasksPerRow) {
    const row = [];

    for (let j = 0; j < tasksPerRow; j++) {
      const index = i + j;
      if (tasks[index]) {
        const completed = userData[userId].completed_tasks.includes(tasks[index].description);
        const status = completed ? '✅' : '❌';
        row.push({
          text: `Задача ${index + 1} ${status}`,
          callback_data: `task_${index}`
        });
      }
    }

    keyboard.push(row);
  }

  keyboard.push([{ text: '← Назад в меню', callback_data: 'go_main_menu' }]);
  return keyboard;
}

// Прогресс задач
const buildProgressBar = (solved, total) => {
  const barLength = 10;
  const ratio = solved / total;
  const filledCount = Math.floor(ratio * barLength);
  const emptyCount = barLength - filledCount;
   
  const filledPart = '🟩'.repeat(filledCount);
  const emptyPart = '⬜'.repeat(emptyCount);
   
  const percent = (ratio * 100).toFixed(0);
  return `[${filledPart}${emptyPart}] ${percent}%`;
}


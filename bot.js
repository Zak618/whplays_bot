/*******************************************************
 * БОТ v1.1x (20 задач, колесо фортуны с анимацией,
 * прогресс-бар и авторы в разделе "Помощь")
 *******************************************************/
 const TelegramBot = require('node-telegram-bot-api');
 const fs = require('fs');
 const { VM } = require('vm2');
 
 const tasks = [
   {
     description: "Напишите функцию, возвращающую сумму двух чисел.",
     function_name: "sum",
     tests: [
       { input: [1, 2], expected: 3 },
       { input: [5, 5], expected: 10 },
       { input: [-1, 1], expected: 0 }
     ]
   },
   {
     description: "Напишите функцию, возвращающую разность двух чисел.",
     function_name: "subtract",
     tests: [
       { input: [3, 2], expected: 1 },
       { input: [10, 5], expected: 5 },
       { input: [1, -1], expected: 2 }
     ]
   },
   {
     description: "Напишите функцию, возвращающую произведение двух чисел.",
     function_name: "multiply",
     tests: [
       { input: [3, 2], expected: 6 },
       { input: [10, 5], expected: 50 },
       { input: [-1, 1], expected: -1 }
     ]
   },
   {
     description: "Напишите функцию, возвращающую частное двух чисел.",
     function_name: "divide",
     tests: [
       { input: [6, 2], expected: 3 },
       { input: [10, 5], expected: 2 },
       { input: [1, -1], expected: -1 }
     ]
   },
   {
     description: "Напишите функцию, которая возвращает квадрат числа.",
     function_name: "square",
     tests: [
       { input: [2], expected: 4 },
       { input: [5], expected: 25 },
       { input: [-1], expected: 1 }
     ]
   },
   {
     description: "Напишите функцию, которая возвращает факториал числа.",
     function_name: "factorial",
     tests: [
       { input: [3], expected: 6 },
       { input: [5], expected: 120 },
       { input: [0], expected: 1 }
     ]
   },
   {
     description: "Возвращает true, если число чётное, иначе false.",
     function_name: "isEven",
     tests: [
       { input: [2], expected: true },
       { input: [5], expected: false },
       { input: [0], expected: true }
     ]
   },
   {
     description: "Возвращает длину строки.",
     function_name: "stringLength",
     tests: [
       { input: ["hello"], expected: 5 },
       { input: ["world"], expected: 5 },
       { input: ["!"], expected: 1 }
     ]
   },
   {
     description: "Возвращает строку в верхнем регистре.",
     function_name: "toUpperCase",
     tests: [
       { input: ["hello"], expected: "HELLO" },
       { input: ["world"], expected: "WORLD" },
       { input: ["!"], expected: "!" }
     ]
   },
   {
     description: "Возвращает строку в нижнем регистре.",
     function_name: "toLowerCase",
     tests: [
       { input: ["HELLO"], expected: "hello" },
       { input: ["WORLD"], expected: "world" },
       { input: ["!"], expected: "!" }
     ]
   },
   {
     description: "Разворачивает строку задом наперёд.",
     function_name: "reverseString",
     tests: [
       { input: ["abc"], expected: "cba" },
       { input: ["Hello"], expected: "olleH" },
       { input: [""], expected: "" }
     ]
   },
   {
     description: "Проверяет, является ли строка палиндромом.",
     function_name: "isPalindrome",
     tests: [
       { input: ["racecar"], expected: true },
       { input: ["abba"], expected: true },
       { input: ["hello"], expected: false }
     ]
   },
   {
     description: "Возвращает n-е число Фибоначчи (0,1,1,2,3,5...).",
     function_name: "fibonacci",
     tests: [
       { input: [0], expected: 0 },
       { input: [1], expected: 1 },
       { input: [6], expected: 8 }
     ]
   },
   {
     description: "Возвращает максимальное из трёх чисел.",
     function_name: "maxOfThree",
     tests: [
       { input: [1, 2, 3], expected: 3 },
       { input: [10, 5, 7], expected: 10 },
       { input: [-1, -5, -3], expected: -1 }
     ]
   },
   {
     description: "Возвращает минимальное из трёх чисел.",
     function_name: "minOfThree",
     tests: [
       { input: [1, 2, 3], expected: 1 },
       { input: [10, 5, 7], expected: 5 },
       { input: [-1, -5, -3], expected: -5 }
     ]
   },
   {
     description: "Возвращает среднее из трёх чисел.",
     function_name: "averageOfThree",
     tests: [
       { input: [1, 2, 3], expected: 2 },
       { input: [10, 10, 10], expected: 10 },
       { input: [2, 3, 7], expected: 4 }
     ]
   },
   {
     description: "Возводит число x в степень y.",
     function_name: "power",
     tests: [
       { input: [2, 3], expected: 8 },
       { input: [5, 2], expected: 25 },
       { input: [10, 0], expected: 1 }
     ]
   },
   {
     description: "Проверяет, является ли число простым (prime).",
     function_name: "isPrime",
     tests: [
       { input: [2], expected: true },
       { input: [15], expected: false },
       { input: [17], expected: true }
     ]
   },
   {
     description: "Генерирует случайное целое между min и max (включительно).",
     function_name: "randomBetween",
     tests: [
       { input: [1, 3], expected: "DIAPASON_1_3" },
       { input: [5, 5], expected: 5 }, 
       { input: [-2, 2], expected: "DIAPASON_-2_2" }
     ]
   },
   {
     description: "Преобразует строку в camelCase.",
     function_name: "toCamelCase",
     tests: [
       { input: ["hello world"], expected: "helloWorld" },
       { input: ["make javascript great again"], expected: "makeJavascriptGreatAgain" },
       { input: [""], expected: "" }
     ]
   }
 ];
 
 // === Работа с user_data.json ===
 const USER_DATA_FILE = 'user_data.json';
 let userData = {};
 try {
   if (fs.existsSync(USER_DATA_FILE)) {
     const fileData = fs.readFileSync(USER_DATA_FILE, 'utf-8');
     userData = JSON.parse(fileData);
   }
 } catch (err) {
   console.error('Ошибка чтения user_data.json:', err);
   userData = {};
 }
 
 // Сохранение в файл
 function saveUserData() {
   fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2), 'utf-8');
 }

 function ensureUserData(userId) {
   if (!userData[userId]) {
     userData[userId] = {
       balance: 0,
       completed_tasks: []
     };
   }
   if (!Array.isArray(userData[userId].completed_tasks)) {
     userData[userId].completed_tasks = [];
   }
 }
 
 const token = '7313879135:AAFjjP1BHQy4F9euarapRopFTuj5AM1jQJU'; // Вставьте свой токен
 const bot = new TelegramBot(token, { polling: true });
 
 /**
  * "Анимация" кручения колеса фортуны.
  * Несколько раз случайным образом показываем задачу,
  * а в конце возвращаем окончательно выбранную.
  * Возвращает Promise<задача>.
  */
 function spinWheelAnimation(chatId, unsolvedTasks) {
   return new Promise(async (resolve) => {
     let spinMsg = await bot.sendMessage(chatId, "🎡 Колесо фортуны крутится...", {
       parse_mode: 'HTML'
     });
 
     let steps = 3;
 
     const interval = setInterval(async () => {
       steps--;
       if (steps <= 0) {
         clearInterval(interval);
         const finalIndex = Math.floor(Math.random() * unsolvedTasks.length);
         const chosenTask = unsolvedTasks[finalIndex];

         await bot.editMessageText(
           `🎉 Колесо остановилось!\n<b>Задача:</b> ${chosenTask.description}\n` +
           `<b>Имя функции:</b> ${chosenTask.function_name}\n\n` +
           `Отправьте код на JavaScript и получите баллы!`,
           {
             chat_id: chatId,
             message_id: spinMsg.message_id,
             parse_mode: 'HTML'
           }
         );
         resolve(chosenTask);
       } else {
         const randomIndex = Math.floor(Math.random() * unsolvedTasks.length);
         const randomTask = unsolvedTasks[randomIndex];
         await bot.editMessageText(
           `🎡 Колесо фортуны крутится...\n<b>Случайная задача:</b> ${randomTask.description}`,
           {
             chat_id: chatId,
             message_id: spinMsg.message_id,
             parse_mode: 'HTML'
           }
         );
       }
     }, 1200);
   });
 }
 
 // Главное меню (4 кнопки)
 async function showMainMenu(chatId, userId) {
   ensureUserData(userId);

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
 
   await bot.sendMessage(chatId, text, menuKeyboard);
 }
 
 function buildTaskKeyboard(userId) {
   const keyboard = [];
   for (let i = 0; i < tasks.length; i += 2) {
     const row = [];
 
     if (tasks[i]) {
       const completed = userData[userId].completed_tasks.includes(tasks[i].description);
       const status = completed ? '✅' : '❌';
       row.push({
         text: `Задача ${i + 1} ${status}`,
         callback_data: `task_${i}`
       });
     }
     if (tasks[i + 1]) {
       const completed = userData[userId].completed_tasks.includes(tasks[i + 1].description);
       const status = completed ? '✅' : '❌';
       row.push({
         text: `Задача ${i + 2} ${status}`,
         callback_data: `task_${i+1}`
       });
     }
     keyboard.push(row);
   }
   keyboard.push([{ text: '← Назад в меню', callback_data: 'go_main_menu' }]);
   return keyboard;
 }
 
 // Показать задачи
 async function showTasks(chatId, userId) {
   ensureUserData(userId);
   const kb = buildTaskKeyboard(userId);
   await bot.sendMessage(chatId, 'Выберите задачу:', {
     reply_markup: { inline_keyboard: kb }
   });
 }
 
 // Показать справку
 async function showHelp(chatId) {
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
 
   await bot.sendMessage(chatId, helpText, menuKeyboard);
 }

 function buildProgressBar(solved, total) {
   const barLength = 10;
   const ratio = solved / total;
   const filledCount = Math.floor(ratio * barLength);
   const emptyCount = barLength - filledCount;
   
   const filledPart = '🟩'.repeat(filledCount);
   const emptyPart = '⬜'.repeat(emptyCount);
   
   const percent = (ratio * 100).toFixed(0);
   return `[${filledPart}${emptyPart}] ${percent}%`;
 }

 async function showStats(chatId, userId) {
   ensureUserData(userId);
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
 
   await bot.sendMessage(chatId, text, kb);
 }

 function runUserCode(userCode, functionName, testInput) {
   const vm = new VM({ timeout: 1000, sandbox: {} });
   vm.run(userCode);
   return vm.run(`${functionName}(...${JSON.stringify(testInput)})`);
 }

 bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const userId = msg.from.id;
   await showMainMenu(chatId, userId);
 });
 
 bot.onText(/\/menu/, async (msg) => {
   const chatId = msg.chat.id;
   const userId = msg.from.id;
   await showMainMenu(chatId, userId);
 });
 
 bot.onText(/\/help/, async (msg) => {
   const chatId = msg.chat.id;
   await showHelp(chatId);
 });
 
 bot.onText(/\/task/, async (msg) => {
   const chatId = msg.chat.id;
   const userId = msg.from.id;
   await showTasks(chatId, userId);
 });

 bot.on('callback_query', async (query) => {
   const chatId = query.message.chat.id;
   const userId = query.from.id;
   const data = query.data;
 
   await bot.answerCallbackQuery(query.id);
 
   if (data === 'show_tasks') {
     return showTasks(chatId, userId);
   }
   if (data === 'show_help') {
     return showHelp(chatId);
   }
   if (data === 'show_stats') {
     return showStats(chatId, userId);
   }
   if (data === 'go_main_menu') {
     return showMainMenu(chatId, userId);
   }

   if (data === 'spin_wheel') {
     ensureUserData(userId);

     const solved = userData[userId].completed_tasks;
     const unsolvedTasks = tasks.filter(t => !solved.includes(t.description));
 
     if (unsolvedTasks.length === 0) {
       const text = `Все задачи уже решены!\n\nТвой баланс: ${userData[userId].balance}`;
       const kb = {
         reply_markup: {
           inline_keyboard: [
             [{ text: '← Назад в меню', callback_data: 'go_main_menu' }]
           ]
         }
       };
       return bot.sendMessage(chatId, text, kb);
     }

     const chosenTask = await spinWheelAnimation(chatId, unsolvedTasks);
     userData[userId].currentTask = chosenTask;
     return;
   }

   if (data.startsWith('task_')) {
     const taskIndex = parseInt(data.split('_')[1], 10);
     const task = tasks[taskIndex];
     ensureUserData(userId);
 
     userData[userId].currentTask = task;
 
     const text = 
       `<b>Задача:</b> ${task.description}\n` + 
       `<b>Имя функции:</b> ${task.function_name}\n\n` + 
       `Отправьте в чат JavaScript-код этой функции.`;
 
     const kb = {
       reply_markup: {
         inline_keyboard: [
           [{ text: '← Назад в меню', callback_data: 'go_main_menu' }],
           [{ text: 'Помощь', callback_data: 'show_help' }]
         ]
       },
       parse_mode: 'HTML'
     };
 
     await bot.sendMessage(chatId, text, kb);
   }
 });

 bot.on('message', async (msg) => {
   if (msg.text.startsWith('/')) return;
 
   const chatId = msg.chat.id;
   const userId = msg.from.id;
   ensureUserData(userId);

   const currentTask = userData[userId].currentTask;
   if (!currentTask) {
     await bot.sendMessage(chatId, 'Сначала выберите задачу (/menu).');
     return;
   }
 
   const userCode = msg.text;
   const functionName = currentTask.function_name;
 
   let feedback = '<b>Результаты тестов:</b>\n';
   let passedAllTests = true;
 
   try {
     const vm = new VM({ timeout: 1000, sandbox: {} });
     vm.run(userCode);
     const fnType = vm.run(`typeof ${functionName}`);
     if (fnType !== 'function') {
       feedback += `\nОшибка: функция <code>${functionName}</code> не найдена.\n`;
       passedAllTests = false;
     } else {
       for (const test of currentTask.tests) {
         const input = test.input;
         const expected = test.expected;
         try {
           let result = runUserCode(userCode, functionName, input);

           if (functionName === 'randomBetween' && typeof expected === 'string' && expected.startsWith('DIAPASON')) {
             const parts = expected.split('_');
             const min = parseInt(parts[1], 10);
             const max = parseInt(parts[2], 10);
             if (typeof result !== 'number' || result < min || result > max) {
               passedAllTests = false;
               feedback += `❌ <code>${JSON.stringify(input)}</code>: число вне диапазона [${min},${max}] (получено ${result})\n`;
             } else {
               feedback += `✅ <code>${JSON.stringify(input)}</code>: в диапазоне [${min},${max}], получено ${result}\n`;
             }
           } else {
             if (result !== expected) {
               passedAllTests = false;
               feedback += `❌ <code>${JSON.stringify(input)}</code>: ожидалось ${expected}, получено ${result}\n`;
             } else {
               feedback += `✅ <code>${JSON.stringify(input)}</code>: получено ${result}\n`;
             }
           }
         } catch (errTest) {
           passedAllTests = false;
           const errMsg = errTest.message.split(':')[0];
           feedback += `❌ Ошибка при тесте <code>${JSON.stringify(input)}</code>: <i>${errMsg}</i>\n`;
         }
       }
     }
   } catch (err) {
     passedAllTests = false;
     const errorMsg = err.message.split('\n')[0];
     feedback += `\nОшибка в коде: ${errorMsg}\n`;
   }
 
   if (passedAllTests) {
     if (!userData[userId].completed_tasks.includes(currentTask.description)) {
       userData[userId].completed_tasks.push(currentTask.description);
       userData[userId].balance += 1;
       feedback += `\n<b>Все тесты пройдены!</b> +1 к балансу.\n`;
     } else {
       feedback += `\n<b>Все тесты пройдены</b>, но вы уже решали эту задачу.\n`;
     }
     saveUserData();
   } else {
     feedback += `\nНекоторые тесты не пройдены. Попробуйте снова.\n`;
   }
 
   await bot.sendMessage(chatId, feedback, { parse_mode: 'HTML' });

   const solvedCount = userData[userId].completed_tasks.length;
   const totalCount = tasks.length;
   const balance = userData[userId].balance;
   const finalText = 
     `Текущий баланс: ${balance} очков\n` +
     `Решено задач: ${solvedCount} / ${totalCount}\n\n` +
     `Что дальше?`;
 
   const kb = {
     reply_markup: {
       inline_keyboard: [
         [{ text: '← В главное меню', callback_data: 'go_main_menu' }],
         [{ text: 'Помощь', callback_data: 'show_help' }]
       ]
     }
   };
 
   await bot.sendMessage(chatId, finalText, kb);
 });

 bot.on('polling_error', (error) => {
   console.error('polling_error:', error);
 });
 
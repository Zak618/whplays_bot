import { VM } from 'vm2';
import { ensureUserData, saveUserData } from '../utils/fileData.js';

export const messageHandlers = async (bot, userData, tasks, msg) => {
  // Логируем входящее сообщение
  console.log('Incoming message:', msg);

  // Фильтрация сообщений от ботов
  if (msg.from.is_bot) {
    console.log('Ignored message from bot.');
    return;
  }

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  ensureUserData(userId, userData);

  // Ограничение частоты сообщений
  if (!userData[userId].lastMessageTimestamp) {
    userData[userId].lastMessageTimestamp = 0;
  }

  const now = Date.now();
  if (now - userData[userId].lastMessageTimestamp < 1000) {
    console.log('Duplicate message detected. Ignoring...');
    return;
  }

  userData[userId].lastMessageTimestamp = now;

  const currentTask = userData[userId].currentTask;

  // Проверка состояния задачи
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
          const result = runUserCode(userCode, functionName, input);
          if (result !== expected) {
            passedAllTests = false;
            feedback += `❌ <code>${JSON.stringify(input)}</code>: ожидалось ${expected}, получено ${result}\n`;
          } else {
            feedback += `✅ <code>${JSON.stringify(input)}</code>: получено ${result}\n`;
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
    saveUserData(userData, 'user_data.json');
  } else {
    feedback += `\nНекоторые тесты не пройдены. Попробуйте снова.\n`;
  }

  // Объединяем результат и финальный текст в одно сообщение
  const solvedCount = userData[userId].completed_tasks.length;
  const totalCount = tasks.length;
  const balance = userData[userId].balance;
  
  feedback += `\n\n<b>Текущий баланс:</b> ${balance} очков\n`;
  feedback += `<b>Решено задач:</b> ${solvedCount} / ${totalCount}\n`;
  
  const kb = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '← В главное меню', callback_data: 'go_main_menu' }],
        [{ text: 'Помощь', callback_data: 'show_help' }]
      ]
    },
    parse_mode: 'HTML'
  };
  
  return bot.sendMessage(chatId, feedback, kb);
};



function runUserCode(userCode, functionName, testInput) {
  const vm = new VM({ timeout: 1000, sandbox: {} });
  vm.run(userCode);
  return vm.run(`${functionName}(...${JSON.stringify(testInput)})`);
}
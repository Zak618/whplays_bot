 /**
  * "Анимация" кручения колеса фортуны.
  * Несколько раз случайным образом показываем задачу,
  * а в конце возвращаем окончательно выбранную.
  * Возвращает Promise<задача>.
  */
 

export const spinWheelAnimation = (bot, chatId, unsolvedTasks) => {
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
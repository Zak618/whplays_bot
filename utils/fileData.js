import fs from 'fs';

// Получение данных
export const getFileData = (fileName) => {
    let data = {};
    try {
    if (fs.existsSync(fileName)) {
        const fileData = fs.readFileSync(fileName, 'utf-8');
        return data = JSON.parse(fileData);
    }
    } catch (err) {
        console.error('Ошибка чтения user_data.json:', err);
        return data = {};
    }
}


 // Сохранение в файл
export const ensureUserData = (userId, userData) => {
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


export const saveUserData = (userData, fileName) =>  {
  try {
    // Преобразуем данные в JSON-строку с отступами для читаемости
    const jsonData = JSON.stringify(userData, null, 2);
    fs.writeFileSync(fileName, jsonData, 'utf-8');
  
    console.log(`Данные успешно сохранены в файл: ${fileName}`);
  } catch (error) {
    console.error(`Ошибка при сохранении данных в файл: ${error.message}`);
  }
}

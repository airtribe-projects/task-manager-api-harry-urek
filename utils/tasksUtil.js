const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../task.json');

// load tasks
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data).tasks;
};

// save tasks
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify({ tasks }, null, 2));
};

module.exports = { readTasks, writeTasks };
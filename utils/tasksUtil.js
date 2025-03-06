const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

const generateId = () => {
    return Math.floor(Math.random() * 1000000); // between 0 and 999999
};

module.exports = { readTasks, writeTasks, generateId };
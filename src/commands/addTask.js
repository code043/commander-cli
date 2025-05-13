import { getJsn, saveJsn } from '../utils/fileUtils.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { findTask } from './findTask.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tdsPath = join(__dirname, '../../db/todo.json');

export const addTask = async (todo, options) => {
  let answers;
  if (!todo) {
    answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'todo',
        message: 'What\'s your wish?',
        validate: value => value ? true : 'It can\'t be empty',
      }
    ]);
  }

  const data = getJsn(tdsPath);
  data.push({
    title: todo || answers.todo,
    done: (options.status === 'true') || false,
  });

  saveJsn(tdsPath, data);
  console.log(`${chalk.green('Task has been added successfully!')}`);
  findTask(data.length - 1);
};

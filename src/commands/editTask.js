import inquirer from 'inquirer'
import chalk from 'chalk'
import { getJsn } from '../utils/fileUtils.js';
import { findTask } from './findTask.js';
import { saveJsn } from '../utils/fileUtils.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tdsPath = join(__dirname, '../../db/todo.json');

export const editTask = async (id) => {
  const data = getJsn(tdsPath)
  const todoId = parseInt(id)

  if (isNaN(todoId) || todoId < 0 || todoId >= data.length) {
    console.log(chalk.red('Task ID not found.'))
    return
  }
  const task = data[todoId]
  if (!task) {
    console.log(chalk.red('Task not found!'))
    return
  }
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'newText',
      message: 'Enter new text:',
      default: task.title
    }
  ])
  task.title = answer.newText
  saveJsn(tdsPath, data)
  console.log(chalk.green('Task updated!'))
  findTask(todoId);
}
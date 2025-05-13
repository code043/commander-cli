import { getJsn } from '../utils/fileUtils.js';
import chalk from 'chalk'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Table from 'cli-table';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tdsPath = join(__dirname, '../../db/todo.json');

export const findTask = (id) => {
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

  const table = new Table({
    head: [chalk.blue('id'), chalk.yellowBright('task'), chalk.whiteBright('status')],
  })
  table.push([todoId, task.title, task.done ? chalk.green('done') : 'pending'])
  console.log(table.toString())
}

  


      
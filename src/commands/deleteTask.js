import { getJsn, saveJsn } from "../utils/fileUtils.js"
import chalk from 'chalk'
import inquirer from 'inquirer';
import Table from 'cli-table';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tdsPath = join(__dirname, '../../db/todo.json');

export const deleteTask = async (id) => {
  const data = getJsn(tdsPath)
  const dataCp = [...data]
  const idCp = id 
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
  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'sure',
      message: `Are you sure you want to delete "${task.title}"?`,
      default: false
    }
  ])
  if (confirm.sure) {
    
    data.splice(todoId, 1)
    saveJsn(tdsPath, data)
    console.log(chalk.green('Task deleted!'))
    deletedTask(idCp, dataCp);
  } else {
    console.log(chalk.yellow('Operation cancelled.'))
  }
  
}
const deletedTask = (idDeleted, data) => {
  const task = data[idDeleted]
  const table = new Table({
    head: [chalk.white('id'), 'deleted task', chalk.white('status')]
  })
  table.push([idDeleted, task.title, task.done ? chalk.green('done') : 'pending'])
  console.log(table.toString())
}
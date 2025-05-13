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

export const markTaskAsUndone = async (id) => {

  let anwers;
  if(!id){
    anwers = await inquirer.prompt([
      {
        type: 'input',
        name: 'todo',
        message: 'What\s task id',
        validate: value => value ? true : 'Definy task id'

      }
    ])
  }
  const data = getJsn(tdsPath)
  data[id].done = false;
  saveJsn(tdsPath, data)
  console.log(`${chalk.green('Task has been marked as undone!')}`)
  findTask(id);
}
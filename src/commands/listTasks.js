import chalk from 'chalk';
import figlet from 'figlet';
import { getJsn } from '../utils/fileUtils.js';
import { showTaskTable } from '../utils/tableUtils.js';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tdsPath = join(__dirname, '../../db/todo.json');

export const listTasks = () => {
  console.log(chalk.cyan(figlet.textSync('Code043 CLI')));
  const data = getJsn(tdsPath)
  if(data.length === 0){
    console.log(chalk.red('Sorry! no tasks found!'))
    console.log(chalk.blue('Use: "todo add <task>" to add a task.'))
    console.log(chalk.green('Use: "todo --help" for more information.'))
    return
  }
  console.log(chalk.green(`You have ${data.length} tasks`))
  showTaskTable(data)
  
}

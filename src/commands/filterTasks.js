import { getJsn } from "../utils/fileUtils.js"
import { showTaskTable } from "../utils/tableUtils.js"
import chalk from 'chalk'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tdsPath = join(__dirname, '../../db/todo.json');

export const filterTasks = (options) => {
  const status = options.status

  if (!status || !['done', 'pending'].includes(status.toLowerCase())) {
    console.log(chalk.red('Please provide a valid status: "done" or "pending".'))
    return
  }

  const data = getJsn(tdsPath)
  const isDone = status.toLowerCase() === 'done'

  const filtered = data.filter(task => task.done === isDone)

  if (filtered.length === 0) {
    console.log(chalk.yellow(`No tasks found with status "${status}".`))
    return
  }
  console.log(chalk.green(`You have ${filtered.length} tasks with status "${status}".`))
  showTaskTable(filtered)
}
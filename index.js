#!/usr/bin/env node
import { Command } from 'commander'
import { join, dirname } from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import Table from 'cli-table'
import shell from 'shelljs'
import figlet from 'figlet'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const tdsPath = join(__dirname, 'todo.json')

const program = new Command()

const getJsn = (path) => {
  const data = fs.existsSync(path) ? fs.readFileSync(path) : []
  try {
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

const saveJsn = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2))

const showTaskTable = (data) => {
  const table = new Table({
    head: ['id', 'to-do', 'status'],
    colWidths: [10, 20, 10]
  })
  data.map((item, index) => {
    table.push([index, item.title, item.done ? chalk.green('done') : 'pending'])
  })
  console.log(table.toString())
}

program.version(pkg.version)
console.log(chalk.cyan(figlet.textSync('Code043 CLI')))
program
  .command('add [todo]')
  .description('Add a task')
  .option('-s, --status [status]', 'Initial status of task')
  .action(async (todo, options) => {
    let anwers;
    if(!todo){
      anwers = await inquirer.prompt([
        {
          type: 'input',
          name: 'todo',
          message: 'What\'s your wish?',
          validate: value => value ? true : 'It doesn\'t be empty'
        }
      ])
    }
    const data = getJsn(tdsPath)
    data.push({
      title: todo || anwers.todo,
      done: (options.status === 'true') || false
    })    
    saveJsn(tdsPath, data)
    console.log(`${chalk.green('Task has been added successfully!')}`)
  })
program
  .command('find <id>')
  .alias('fd')
  .description('Find a task by ID')
  .action((id) => {
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
      head: ['id', 'to-do', 'status'],
      colWidths: [10, 20, 10]
    })
    table.push([todoId, task.title, task.done ? chalk.green('done') : 'pending'])
    console.log(table.toString())
  })
program
  .command('edit <id>')
  .alias('e')
  .description('Edit the text of a task')
  .action(async (id) => {
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
    showTaskTable(data)
  })
program
  .command('delete <id>')
  .alias('del')
  .description('Delete a task')
  .action(async (id) => {
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
      showTaskTable(data)
    } else {
      console.log(chalk.yellow('Operation cancelled.'))
    }
  })

program
  .command('do <todo>')
  .alias('d')
  .description('Mark a task as done')
  .action(async (todo) => {
    let anwers;
    if(!todo){
      anwers = await inquirer.prompt([
        {
          type: 'input',
          name: 'todo',
          message: 'What\'s id of task?',
          validate: value => value !== undefined ? true : 'Definy task id'
        }
      ])
          
    }
    const data = getJsn(tdsPath)
    data[todo].done = true;
    saveJsn(tdsPath, data)
    console.log(`${chalk.green('Task has been marked as done!')}`)
    showTaskTable(data)
  })
program
  .command('undo <todo>')
  .alias('u')
  .description('Mark a task as undone')
  .action(async (todo) => {
    let anwers;
    if(!todo){
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
    data[todo].done = false;
    saveJsn(tdsPath, data)
    console.log(`${chalk.green('Task has been marked as undone!')}`)
    showTaskTable(data)

  })
program
  .command('filter')
  .alias('ft')
  .description('Filter tasks by status')
  .option('-s, --status <status>', 'Status of task: "done" or "pending"')
  .action((options) => {
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

    showTaskTable(filtered)
  })

program
  .command('list') 
  .alias('l')
  .description('List all tasks')
  .action(() => {
    const data = getJsn(tdsPath)
    showTaskTable(data)
    
  })
program 
  .command('backup')
  .description('Backup all tasks')
  .action(() =>{
    shell.mkdir('-p', 'backup')
    const command = shell.exec('mv ./todos.json ./backup/todos.json', { silent: true })
    if(!command.code){
      console.log(chalk.green('Backup has been successfully!'))
    }else{
      console.log(command.stderr)
      console.log(chalk.red('Backup failed!'))
    }
  })
program.parse(process.argv)
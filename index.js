#!/usr/bin/env node
const program = require('commander')
const { join } = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Table = require('cli-table')

const pkg = require('./package.json')
const { type } = require('os')
const tdsPath = join(__dirname, 'todo.json')

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
  .command('do <todo>')
  .description('Mark a task as done')
  .action(async (todo) => {
    let anwers;
    if(!todo){
      anwers = await inquirer.prompt([
        {
          type: 'input',
          name: 'todo',
          message: 'What\'s id of task?',
          validate: value => value !== undefined ? true : 'Difiny task id'
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
  .description('Mark a task as undone')
  .action(async (todo) => {
    let anwers;
    if(!todo){
      anwers = await inquirer.prompt([
        {
          type: 'input',
          name: 'todo',
          message: 'What\s task id',
          validate: value => value ? true : 'Difiny task id'

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
  .command('list') 
  .description('List all tasks')
  .action(() => {
    const data = getJsn(tdsPath)
    showTaskTable(data)
    
  })
program.parse(process.argv)
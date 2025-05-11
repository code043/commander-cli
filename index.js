#!/usr/bin/env node
const program = require('commander')
const { join } = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')

const pkg = require('./package.json')
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
program.parse(process.argv)
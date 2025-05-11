#!/usr/bin/env node
const program = require('commander')
const pkg = require('./package.json')

program.version(pkg.version)
program
  .command('add [todo]')
  .description('Add a task')
  .action((todo) => {
    console.log(todo);
  })
program.parse(process.argv)
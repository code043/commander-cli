#!/usr/bin/env node
import { Command } from 'commander';
import { addTask } from './src/commands/addTask.js';
import { findTask } from './src/commands/findTask.js';
import { editTask } from './src/commands/editTask.js';
import { deleteTask } from './src/commands/deleteTask.js';
import { listTasks } from './src/commands/listTasks.js';
import { markTaskAsDone } from './src/commands/markTaskAsDone.js';
import { markTaskAsUndone } from './src/commands/markTaskAsUndone.js';
import { filterTasks } from './src/commands/filterTasks.js';
import { backupTasks } from './src/commands/backupTasks.js';
import chalk from 'chalk';

const program = new Command();
program.version('1.0.0');

program.configureHelp({
  formatHelp: (cmd, helper) => {
    const termWidth = helper.padWidth(cmd, helper);
    const itemIndent = '  ';

    const usage = `${chalk.blue('Usage:')} ${helper.commandUsage(cmd)}\n`;

    const options = helper.visibleOptions(cmd)
      .map(opt => `${itemIndent}${chalk.yellow(helper.optionTerm(opt).padEnd(termWidth))} ${opt.description}`)
      .join('\n');
    const optionsSection = `${chalk.blue('Options:')}\n${options}\n`;

    const commands = helper.visibleCommands(cmd)
      .map(sub => {
        const term = chalk.yellow(helper.subcommandTerm(sub).padEnd(termWidth));
        const desc = sub.description();
        return `${itemIndent}${term} ${desc}`;
      })
      .join('\n');
    const commandsSection = `${chalk.blue('Commands:')}\n${commands}\n`;

    return [usage, optionsSection, commandsSection].join('\n');
  }
});

program
  .command('add [todo]')
  .description('Add a task')
  .option('-s, --status [status]', 'Initial status of task')
  .action(addTask);
program
  .command('list')
  .alias('l')
  .description('List all tasks')
  .action(listTasks);
program
  .command('find <id>')
  .alias('fd')
  .description('Find a task by ID')
  .action(findTask);

program
  .command('edit <id>')
  .alias('e')
  .description('Edit the text of a task')
  .action(editTask);

program
  .command('delete <id>')
  .alias('del')
  .description('Delete a task')
  .action(deleteTask);
program
  .command('do <todo>')
  .alias('d')
  .description('Mark a task as done')
  .action(markTaskAsDone);

program
  .command('undo <todo>')
  .alias('u')
  .description('Mark a task as undone')
  .action(markTaskAsUndone);

program
  .command('filter')
  .alias('ft')
  .description('Filter tasks by status')
  .option('-s, --status <status>', 'Status of task: "done" or "pending"')
  .action(filterTasks);

program
  .command('backup')
  .description('Backup all tasks')
  .action(backupTasks);

program.parse(process.argv);

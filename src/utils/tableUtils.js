import Table from 'cli-table';
import chalk from 'chalk';

export const showTaskTable = (data) => {
  const table = new Table({
    head: [chalk.blue('id'), chalk.yellowBright('task'), chalk.whiteBright('status')],

  });

  data.map((item, index) => {
    table.push([index, item.title, item.done ? chalk.green('done') : 'pending']);
  });
  console.log(table.toString());
};

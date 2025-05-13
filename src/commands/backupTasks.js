import shell from 'shelljs'
import chalk from 'chalk'

export const backupTasks = () => {
  shell.mkdir('-p', '../../backup');
  const command = shell.exec('mv ../../db/todo.json ../../backup/todo.json', { silent: true })
  if(!command.code){
    console.log(chalk.green('Backup has been successfully!'))
  }else{
    console.log(command.stderr)
    console.log(chalk.red('Backup failed!'))
  }
      
}
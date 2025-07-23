
import figlet from 'figlet';
import chalk from 'chalk';



// ASCII Art Title
figlet('Moshfiqur Rahman', (err, data) => {
     if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
     }

     // Print the title with color
     console.log(chalk.red.redBright(data));

     // Print version info and system details with color
     console.log(chalk.cyan('VERSION INFO:'));
     console.log(chalk.magenta('Node.js: v22.17.0'));
     console.log(chalk.blue('OS: Windows'));
});
const setupTimeManagement = () => {
     console.log('🚀 Setting up trial management cron jobs...');
};
export default setupTimeManagement;

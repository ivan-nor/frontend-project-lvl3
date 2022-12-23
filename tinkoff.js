// const { stdin, stdout } = process;

// stdout.write('Как тебя зовут?\n')
// stdin.on('data', data => {
//   const name = data.toString();
//   const reverseName = name.split('').reverse().join('');
//   stdout.write(`\nТвоё имя наоборот ${reverseName}\n`);
//   process.exit();
// });

// const { stdin, stdout } = process;

// let sum;
// stdin.on('data', (data) => {
//   const numbers = data.toString().split(' ').map((n) => Number(n));
//   sum = numbers.reduce((partialSum, a) => partialSum + a, 0);
// });
// stdin.on('end', () => {
//   console.log('!!!!');
//   process.exit();
// });

// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// const numbers = [];
// rl.on('line', (input) => {
//   numbers.push(Number(input));
// });
// rl.on('close', () => console.log(numbers.reduce((partialSum, a) => partialSum + a, 0)));

// var readline = require('readline');
// var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// let total = 0;
// rl.on('close', () => { console.log(total); process.exit(0); });
// rl.on('line', function (data) {
//   data = data.split(' ');
//   total += parseInt(data[0]) || 0;
//   total += parseInt(data[1]) || 0;
// });

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (data) => {
  console.log('input -> ', data);
});

rl.on('close', () => {
  console.log('LOGIC');
  process.exit(0);
});

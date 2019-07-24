fs = require('fs');

data = fs.readdirSync('C:/');
console.log('data: ', data);

console.log('This comes after!');
var fs = require('fs');

// read a file directly using a module import technique
var data = require('./data.json');

console.log(data.name)

// read a file using file system module & its readFile function
fs.readFile('./data.json', 'utf-8', (err, data) => {
    var data = JSON.parse(data)
    console.log(data)
})

// read a directory

fs.readdir('C:/', (err, data) => {
    console.log(data)
});
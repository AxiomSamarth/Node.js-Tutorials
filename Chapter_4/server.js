var express = require('express');
var bodyParser = require('body-parser');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = 'mongodb://localhost:27017/learning-node'
var Message = mongoose.model('messages', {
    name: String,
    message: String
})

var messages = []

app.get('/messages', (req, res) => {
    res.send(messages)
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err){
            sendStatus(500)
        }
        messages.push(req.body)    
        io.emit('message', req.body)
        res.status(200).send([req.body])
    })    
})

io.on('connection', (socket) => {
    console.log('A User connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log("MongoDB Connection", err)
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})

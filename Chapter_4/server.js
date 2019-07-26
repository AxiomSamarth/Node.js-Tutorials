var express = require('express');
var bodyParser = require('body-parser');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise
var dbUrl = 'mongodb://localhost:27017/learning-node'
var Message = mongoose.model('messages', {
    name: String,
    message: String
})

var messages = []

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name:user}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {

    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()        
        var censored = await Message.findOne({message: 'badword'})
        
        if(censored){
            await Message.deleteOne({_id: censored.id})
        }else{   
            io.emit('message', req.body)
        }
        messages.push(req.body) 
        res.status(200).send([req.body])         
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally{
        console.log('Message post called')
    }
           
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

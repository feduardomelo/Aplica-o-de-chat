const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)//definindo protocolo http
const io = require('socket.io')(server)  //protocolo hss pro websocket

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => {
        
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })
    //estamos RECEBENDO do front pro back
})

//socket emit -manda msg
//socket on - ouve msg
//socket broadcast.emit - ele envia para todos os sockets conectados na aplicação
server.listen(process.env.PORT || 3000)
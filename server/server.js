var express = require('express')
    ,app = express()
    ,path =  require('path')
    ,bodyParser = require('body-parser')
    ,http = require('http')
    ,socketio = require('socket.io');

const fireControler = require("./controlers/fireControler")

app.set('clientPath', path.join(__dirname, '../client'));
app.use(express.static(app.get('clientPath')));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const routes = function(app){
    app.get('/',function(req,resp){
        resp.sendFile(path.join(app.get('clientPath') , "/index.html"))
    })
}

routes(app);

const server = http.createServer(app);
const sockets = socketio(server);

sockets.on('connection', (socket) => {
    const connectionId = socket.id;
    console.log(`> Connected with id: ${connectionId}`);

    const sendTableInterval = setInterval(()=>{
        socket.emit('renderFire',fireControler.createFireTable())
    },50)
    
    socket.on('disconnect', ()=>{
        clearInterval(sendTableInterval);
    })

    socket.on('changefireStrength',value => fireControler.changefireStrength(value))
})

server.listen(3000, function(){
    console.log(`Servidor rodando na porta 3000!!`);
});
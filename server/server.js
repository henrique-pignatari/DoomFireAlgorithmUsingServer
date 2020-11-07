var express = require('express')
    ,app = express()
    ,path =  require('path')
    ,bodyParser = require('body-parser')
    ,http = require('http');

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

app.listen(3000, function(){
    console.log(`Servidor rodando na porta 3000!!`);
});
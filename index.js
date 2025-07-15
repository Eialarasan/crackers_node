import app from './main'
import http from 'http'

const HttpServer = http.createServer(app);
require('dotenv').config()
const port=process.env.PORT
app.set('port', port)

HttpServer.listen(port);
HttpServer.on('listening', onListening);

function onListening() {
    var addr = HttpServer.address();
    var bind =  addr.port;
    console.info('Listening on ' + bind);
}
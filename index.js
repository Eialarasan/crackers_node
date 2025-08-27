import app from './main'
import http from 'http'
require('dotenv').config()

const port = process.env.PORT || 3000;
app.set('port', port);

const HttpServer = http.createServer(app);

HttpServer.listen(port, '0.0.0.0');  // Listen on all interfaces
HttpServer.on('listening', onListening);

function onListening() {
    const addr = HttpServer.address();
    const bind = addr.port;
    console.info('Listening on ' + bind);
}
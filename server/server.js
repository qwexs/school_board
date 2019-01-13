require('dotenv').config();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    process.env.PORT = 4200;
    process.env.STATIC_DIR = "./public";
}
const http = require('http');
const app = require('./app');
const debug = require('debug')('iboo_admin_panel:server');
const port = process.env.PORT;
console.log('\x1b[33m%s\x1b[0m', 'Порт сервера: ' + port)
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    if (err) {
        console.error(err.message);
    }
    // res.render('error');
});

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

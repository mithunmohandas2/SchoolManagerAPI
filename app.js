#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const DBconnect =require('./bin/config');  // Assuming this file exists and connects to MongoDB

const adminRouter = require('./routes/adminRoutes');
const usersRouter = require('./routes/userRoutes');

// CORS Policy
const allowedOrigins = ['http://localhost:5173', 'https://YourExampleDomain.com']; // Add more origins if needed

// Create Express app
const app = express();

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// MongoDB connection
// DBconnect.then(() => {
//   console.log('MongoDB connection is established.');
// }).catch((err) => {
//   console.error('Error connecting to MongoDB:', err);
// });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Port configuration and HTTPS setup
const port = normalizePort(process.env.PORT || '3000');  // HTTP port
const httpsPort = normalizePort(process.env.HTTPS_PORT || '3443');  // HTTPS port
app.set('port', port);

// Read certificates for HTTPS
const options = {
  cert: fs.readFileSync('./public/certificates/certificate.crt'),
  key: fs.readFileSync('./public/certificates/private.key'),
};

// Create HTTP server
const http = require('http');
const httpServer = http.createServer(app);

// Create HTTPS server
const https = require('https');
const httpsServer = https.createServer(options, app);

// Start HTTP server
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`HTTP Server running on http://localhost:${port}`);
});

// Start HTTPS server
httpsServer.listen(httpsPort, '0.0.0.0', () => {
  console.log(`HTTPS Server running on https://localhost:${httpsPort}`);
});

// Error and listening event listeners for the HTTP server
httpServer.on('error', onError);
httpServer.on('listening', () => onListening(httpServer));

// Error and listening event listeners for the HTTPS server
httpsServer.on('error', onError);
httpsServer.on('listening', () => onListening(httpsServer));

// Normalize port function
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
}

// Error event listener for the server
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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

// Listening event listener for the server
function onListening(server) {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

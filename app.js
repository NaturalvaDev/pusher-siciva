var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const { fetch_Url } = require('./controllers/sicivaController');
const origin = { cors: { origin: "*" } };
const io = new Server(server, origin);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/socket.io'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

io.on('connection', (socket) => {
  socket.on('PostData', async (client, payload) => {
    try {
      switch (client) {
        case 'siciva':
          console.log('Received client:', client);
          console.log('Received post:', payload.data);

          // Lakukan sesuatu dengan data post
          // Contoh: Melakukan fetch ke URL yang diberikan jika tipe adalah 'post'
          if (payload.type === 'post' && payload.url !== '') {
            // Lakukan sesuatu dengan data post
            const response = await fetch_Url(payload);
            console.log(response);
          }

          break;
        case 'wpp':
          console.log('Received connect:', payload);
          // Lakukan sesuatu dengan data connect
          break;
        case 'get':
          console.log('Received get:', payload);
          // Lakukan sesuatu dengan data get
          break;
        default:
          console.log('Unknown type:', client);
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 5500;

server.listen(port, function () {
  console.log("App running on *: " + port);
});
var express     = require('express'),
    http        = require('http'),
    routes      = require('./routes'),
    c           = require('./lib/common.js'),
    libSocket   = require('./lib/socket.js'),

    app         = express(),
    server      = http.createServer(app),
    socket      = c.sockjs.createServer();


app.configure(function(){
  app.set('port', process.env.PORT || "3000");
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('./lib/middleware.js')),
  app.use(app.router);
  app.use(express.static(c.path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

socket.on('connection', libSocket);
socket.installHandlers(server, {cookie:true, jsessionid: true, prefix:'/ws'});
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

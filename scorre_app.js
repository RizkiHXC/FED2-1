var express  = require('express'),
    routes   = require('./routes'),
    http     = require('http'),
    c        = require('./lib/common.js');
    
var app = express();

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
app.get('/next', routes.next);
app.get('/prev', routes.prev);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

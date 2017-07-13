/**
 * 
 */
console.log('Starting '+JSON.stringify(process.versions));
const url = require('url')
	, path = require('path')
	,favicon = require('serve-favicon');
var express = require('express')
//  , routes = require('./routes')
  , http = require('http')
  , app = express();
// all environments
app.set('port', (process.env.PORT || process.env.VCAP_APP_PORT || 3000));
//app.use(function(req, res, next) {
//		res.header("X-Frame-Options","ALLOW-FROM *");
//		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//		next();
//	});
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));


function errorHandler(err, req, res, next) {
		console.error('errorHandler '+err+(err.stack?err.stack:""));
		 if (res.headersSent)
			    return next(err);
		res.status(500);
		res.render('error', { error: "Internal error" });
	}
app.use(errorHandler);

require("./lib/browserSetup")(app,[{id:'vis',offset:'dist',include:['vis.js','vis.css']}
	,{id:'requirejs'}
	,{id:'font-awesome',base:'font-awesome',include:['css/font-awesome.min.css']}
	,{id:'bootstrap',offset:'dist',include:['js/bootstrap.min.js','css/bootstrap.min.css']}
	])

// development only
if ('development' === app.get('env')) {
	console.log('development mode');
	global.bypassSignon=true;
//	app.use(express.errorHandler());
}
//app.get('/xslt',require('./routes/xslt.js').xslt );
//app.get('/', routes.index);
app.all('*', function (req, res, next) {
		console.log('check');
		if (global.bypassSignon || req.session && req.session.authorized)
			return next();
		res.status(401);
		res.render('error',{error:"Signon Required"}); 
	});
http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
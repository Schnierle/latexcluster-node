/**##############################################################################################################
### LatexCluster
### @author Marc Schnierle, M.Sc.
###############################################################################################################*/

/**##############################################################################################################
### @alias Definitions
###
###############################################################################################################*/
global.version                      = "1.2";

const express                       = require('express');
const app                           = express();
const https                         = require('https');
const bodyParser                    = require('body-parser');
const fs                            = require("fs-extra");
const path                          = require('path');

const src_path                      = './src';
global.mainFolder                   = path.dirname(require.main.filename);
global.clientFolder                 = mainFolder+'/Client';
global.srcFolder                    = mainFolder+'/src';
global.config                       = require(src_path+'/config.js');
global.OutConsole                   = require(path.join(global.srcFolder,"OutConsole.js"));

const misc                          = require(path.join(global.srcFolder,"misc.js"));


var timeout = require('express-timeout-handler');

/**##############################################################################################################
### @alias Render Engine
###
###############################################################################################################*/
app.set("views",path.join(__dirname,"src","views"));
app.set("view engine","hbs");

/**##############################################################################################################
### @alias timeout
###
###############################################################################################################*/
var options = {

  // Optional. This will be the default timeout for all endpoints.
  // If omitted there is no default timeout on endpoints
  timeout: 10000,

  // Optional. This function will be called on a timeout and it MUST
  // terminate the request.
  // If omitted the module will end the request with a default 503 error.
  onTimeout: function(req, res) {
    res.status(503).send('Timeout. Service unavailable. Please retry.');
  },

  // Optional. Define a function to be called if an attempt to send a response
  // happens after the timeout where:
  // - method: is the method that was called on the response object
  // - args: are the arguments passed to the method
  // - requestTime: is the duration of the request
  // timeout happened
  onDelayedResponse: function(req, method, args, requestTime) {
    console.log(`Attempted to call ${method} after timeout`);
  },

  // Optional. Provide a list of which methods should be disabled on the
  // response object when a timeout happens and an error has been sent. If
  // omitted, a default list of all methods that tries to send a response
  // will be disable on the response object
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
};
app.use(timeout.handler(options));

/**##############################################################################################################
### @alias Login
###
###############################################################################################################*/
OutConsole.log("warning",["LaTeX4technics","Docker LaTeX Slave","Version 0.1 - 03.01.2020"]);

const privateKey      = fs.readFileSync(path.join(__dirname, global.config.paths.cert.pem), 'utf8');	//Daten für die TLS-Verschlüsselung laden
const certificate     = fs.readFileSync(path.join(__dirname, global.config.paths.cert.crt), 'utf8');
const credentials     = { key: privateKey, cert: certificate };

//https://stackoverflow.com/questions/52861946/imagemagick-not-authorized-to-convert-pdf-to-an-image
/*fs.exists("/etc/ImageMagick-6/policy.xml", function (exist) {
    if(exist)
    {
      misc.execCMD("mv /etc/ImageMagick-6/policy.xml /etc/ImageMagick-6/policy.xml.off 2> /dev/null",function(response){

      });
    }
});*/



/**##############################################################################################################
### @alias HTTPS-Server
###############################################################################################################*/
var HttpsServer = https.Server(credentials, app);
HttpsServer.listen(config.http_port);

HttpsServer.on('listening', function(){
  OutConsole.log("success",['HTTPS-Server hört auf Port:'+config.http_port]);
});
HttpsServer.on('error', function (error) {
  OutConsole.log("error",['Fehler des HTTPS-Servers:'+error]);
});


app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true }));

/**##############################################################################################################
### @alias GET-Routes
###############################################################################################################*/
var getRoutes = require(src_path+'/getRoutes')(app);

/**##############################################################################################################
### @alias POST-Routes
###############################################################################################################*/
var postRoutes = require(src_path+'/postRoutes')(app);

/*
app.use(function(req, res, next) {
   res.status(404).sendFile(clientFolder + '/templates/404.tpl.html');
});
*/

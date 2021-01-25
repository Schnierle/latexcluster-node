/**##############################################################################################################
### @author Marc Schnierle, M.Sc.
###############################################################################################################*/

var config                        = {};

config.debugmode                  = true;

/**###############################################################################################################
### @alias Ports
###############################################################################################################*/
config.http_port                  = 3001;                   //https-Port des WebStudio-Servers

config.timezone                   = 'Europe/Berlin';

config.resolution                 = {};
config.resolution.min             = 50;
config.resolution.max             = 800;
/**#############################################################################################################
### @alias Zugangsdaten
#############################################################################################################*/
config.thumbnail                  = {};
config.thumbnail.resolution       = 100;
config.thumbnail.quality          = 100;

/**#############################################################################################################
### Pfade und Dateiendungen
#############################################################################################################*/
config.paths                      = {};
config.paths.user_data_relative   = "./";
config.paths.user_data            = "udata";

//###Zertfikate
config.paths.cert                 =  {};
config.paths.cert.pem             =  "./sslcert/standard.pem";
config.paths.cert.crt             =  "./sslcert/standard.crt";




module.exports = config;

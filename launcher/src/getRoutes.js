/**##############################################################################################################
### @author Marc Schnierle
###############################################################################################################*/
const fs              = require("fs-extra");
const path            = require("path");
var _                 = require('lodash');


module.exports = function(app){


  app.get('/', function (req, res){

    var year = new Date().getFullYear();
    var dockername = "hallo";
    res.render('index',{year:year,dockername:dockername});

  });



  exports.routingHandler = function (filePath,req,res) {

      fs.exists(filePath, function (exists) {
          if(exists)
            res.sendFile(filePath);
          else{
            res.sendStatus(404);
            console.log(filePath);
          }

      });
  }


}

/**##############################################################################################################
### @author Marc Schnierle, M.Sc.
###############################################################################################################*/

const fs            = require("fs-extra");
const path          = require("path");
var _               = require('lodash');

const uuidv4        = require('uuid/v4');

var template        = require('es6-template-strings');
var compile         = require('es6-template-strings/compile')
var resolveToString = require('es6-template-strings/resolve-to-string')

const misc          = require("./misc.js");

var equation_template       =   fs.readFileSync(path.join("src","templates","equation.tpl.txt"),"utf8");
var minimal_template        =   fs.readFileSync(path.join("src","templates","minimal.tpl.txt"),"utf8");
var fulllatex_template      =   fs.readFileSync(path.join("src","templates","full.tpl.txt"),"utf8");

var compiled_templates = [];

compiled_templates["equation"]    =   compile(equation_template);
compiled_templates["minimal"]     =   compile(minimal_template);
compiled_templates["full"]        =   compile(fulllatex_template);

module.exports = function(app){


  /**##############################################################################################################
  ### @alias compileLatex
  ###
  ###############################################################################################################*/

  app.post('/compileLatex',function(req,res){
      OutConsole.log("info",['POST an /compileLatex']);

      var act_uuid        = uuidv4();

      var editorvalue     = req.body.content;
      var crop            = req.body.crop;
      var resolution      = req.body.resolution;
      var format          = req.body.format;

      //###Check, if Resolution is valid
      var isnum = /^\d+$/.test(resolution);
      if(!isnum)
      {
        return res.json({"error": true,"content":"resolution is no number"});
      }

      //###Check, if format is valid

      var formats = ["png", "jpg", "gif", "svg","pdf"];
      var valid_format = formats.includes(format);
      if(!valid_format)
      {
          return res.json({"error": true,"content":"format is not valid"});
      }



      resolution          = Math.min(config.resolution.max, Math.max(config.resolution.min, resolution));



      var content         =   resolveToString(compiled_templates[req.body.compile_mode], {editorvalue:editorvalue});


      fs.writeFile(path.join("src","temp",act_uuid+".tex"), content, function(err) {
          if(err) {
              return console.log(err);
          }

          misc.pdflatex(act_uuid,function(success){
            if(success){

              misc.pdfcrop(act_uuid,crop,function(success){
                if(success){

                  misc.pdfconvert(act_uuid,format,resolution,crop,function(success){
                    if(success){
                      misc.base64_encode(path.join("src","temp",act_uuid+"."+format),function(response){
                              res.json(response);
                        });

                    }
                    else {
                        res.json({"error": true,"content":"Error in Convert"});
                    }
                  })
                }
                else {
                  res.json({"error": true,"content":"Error in Cropping"});
                }
              })
            }
            else {

              fs.readFile(path.join("src","temp",act_uuid+".log"), 'utf8' , function read(err, data) {
                if (err) {
                  res.json({"error": true,"content":"Can't access Log-File"});
                }
                else {
                  res.json({"error": true,"content":data});
                }

            });

            }
          })

      });

  });



}

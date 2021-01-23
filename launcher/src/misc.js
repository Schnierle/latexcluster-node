/**##############################################################################################################
### @alias Misc-Funktionen
### @author Marc Schnierle, M.Sc.
###############################################################################################################*/

/**##############################################################################################################
### @alias Requires
###
###############################################################################################################*/

const { exec }                      = require('child_process');
var execFile                        = require("child_process").execFile;

const fs                            = require("fs-extra");
const path                            = require("path");

/**##############################################################################################################
### @alias validateFileEnding
### validiert Variablenname für die Verwendung in JavaScript
###############################################################################################################*/
function execCMD(cmd,callback){

  exec(cmd, (err, stdout, stderr) => {

    //console.error(err);
    //console.log(stdout);
    //console.log(stderr);

              if (err) {
                //some err occurred
                callback(false);
              } else {
               // the *entire* stdout and stderr (buffered)
                callback(true);
              // console.log(`stdout: ${stdout}`);
              // console.log(`stderr: ${stderr}`);
              }
  });
};


/**##############################################################################################################
### @alias validateFileEnding
### validiert Variablenname für die Verwendung in JavaScript
###############################################################################################################*/
function execFileCMD(cmd,args,callback){

/* Funktioniert nicht, findet PDFLatex nicht
  execFile(cmd, args,{cwd: '/src/temp/', env: process.env} , function(err, stdout, stderr) {
    console.log( process.env.PATH );

        if (err) {
          //some err occurred
          callback(false);
                    console.error(stdout)
          console.error(err)
          console.error(stderr)
        } else {
         // the *entire* stdout and stderr (buffered)
          callback(true);
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);
        }
  });
*/
};


/**##############################################################################################################
### @alias validateFileEnding
### validiert Variablenname für die Verwendung in JavaScript
###############################################################################################################*/
function pdflatex(act_uuid,callback){
    console.log("pdflatex "+act_uuid+".tex ");

    /*
    execFileCMD(path.join('/usr/bin/',"pdflatex"),[],function(success){

            callback(success);
    });*/

    execCMD("pdflatex -interaction=nonstopmode -output-directory='src/temp/' 'src/temp/"+act_uuid+".tex' ",function(success){
          console.log(success);
            callback(success);
    });
};


/**##############################################################################################################
### @alias validateFileEnding
### validiert Variablenname für die Verwendung in JavaScript
###############################################################################################################*/
function pdfcrop(act_uuid,crop,callback){

      if(crop){
        execCMD("pdfcrop src/temp/"+act_uuid+".pdf src/temp/"+act_uuid+"-crop.pdf",function(success){

                callback(success);
        });
      }
      else {
                callback(true);
      }
};

/**##############################################################################################################
### @alias validateFileEnding
### validiert Variablenname für die Verwendung in JavaScript
###############################################################################################################*/
function pdfconvert(act_uuid,format,resolution,crop,callback){
    console.log("pdfconvert");

      if(format!="pdf" && format!="svg"){
        if(crop){

          execCMD("convert -density "+resolution+" src/temp/"+act_uuid+"-crop.pdf src/temp/"+act_uuid+"."+format,function(success){

                          callback(success);
          });
        }
        else {
          execCMD("convert -density "+resolution+" src/temp/"+act_uuid+".pdf src/temp/"+act_uuid+"."+format,function(success){
                          callback(success);
          });
        }
      }
      else if(format=="svg"){
        console.error("###############PDF2SVG#############");
        if(crop){

          execCMD("pdf2svg src/temp/"+act_uuid+"-crop.pdf src/temp/"+act_uuid+"."+format,function(success){

                          callback(success);
          });
        }
        else {
          execCMD("pdf2svg src/temp/"+act_uuid+".pdf src/temp/"+act_uuid+"."+format,function(success){
                          callback(success);
          });
        }
      }
      else {
        callback(true);
      }



};

/**##############################################################################################################
### @alias base64_encode
### validiert Variablenname für die Verwendung in JavaScript
###############################################################################################################*/
function base64_encode(filepath,callback){
    console.log("base64_encode"+filepath);

    try{
      // read binary data
      var bitmap = fs.readFileSync(filepath);
      // convert binary data to base64 encoded string
      callback({"error":false,"content":new Buffer(bitmap).toString('base64')});
    }
    catch(e){
      callback({"error":true,"content":"Can't encode File"});
    }


};


module.exports = {
  pdflatex:          pdflatex,
  pdfcrop:           pdfcrop,
  pdfconvert:        pdfconvert,
  execCMD:           execCMD,
  base64_encode:     base64_encode
};

/**###############################################################################################################
### @alias OutConsole
### @author Marc Schnierle
###############################################################################################################*/

//var ActualLineNumber = 0;



 (function(exports){

   exports.ActualLineNumber = 0;

   if(typeof window === 'undefined')
   {
     exports.colors = require('colors');
     // set theme
     exports.colors.setTheme({
       h1: 'bgCyan',
       info: 'grey',
       success: 'bgGreen',
       help: 'cyan',
       highlight: 'bgBlue',
       highlight2: 'bgMagenta',
       warning: 'yellow',
       error: 'bgRed'
     });

     exports.OutputToConsole = function(styleMethode,string)
     {
       if(config.debugmode)
       {
         console.log(exports.colors[styleMethode](string));
       }
     };
   }
   else
   {
   //'background: #222; color: #bada55'
     exports.colors = {};
     exports.colors["h1"] = 'background: #42f4e8';
     exports.colors["info"] = 'color: #4c4c4c';
     exports.colors["success"] = 'background: #336600; color: #ffffff';
     exports.colors["help"] = 'color: #00ffff';
     exports.colors["highlight"] = 'background: #8c95ff';
     exports.colors["highlight2"] = 'background: #ff00ff';
     exports.colors["warning"] = 'color: #ffb600';
     exports.colors["error"] = 'background: #ff1919';

     exports.OutputToConsole = function(styleMethode,string)
     {
       if(config.debugmode)
       {
         console.log("%c"+string, exports.colors[styleMethode]);
       }
     };
   }


  //################################################################################################################
  //###Schreibt formatierten String in die Console
  //################################################################################################################
  exports.log = function(styleMethode,stringArray)
  {
    //Längsten String longest in stringArray finden
    var tempArray = stringArray.slice(0);
    var longest = tempArray.sort(function (a, b) { return b.length - a.length; })[0];
    var line_segment= Array(longest.length+4).join("#");
    var padding, timestamp, linenumber;

    //Start für Überschriften
    if(styleMethode=="h1")
    {
      exports.OutputToConsole(styleMethode,line_segment);
      linenumber='';
      timestamp='';
    }

    //Ausgabe für jeden String in stringArray
    stringArray.forEach(function(entry) {

      if(styleMethode!=="h1")
      {
        exports.ActualLineNumber= exports.ActualLineNumber +1;
        linenumber = exports.ActualLineNumber;
        timestamp = new Date().toISOString().slice(0,19).replace('T',' ');
      }

      //Strings auffüllen
      if(entry.length<longest.length && stringArray.length > 1)
      {
        padding = Array(longest.length+1-entry.length).join(" ");
      }
      else {
        padding = '';
      }

      //Ausgabe der Zeile
      exports.OutputToConsole(styleMethode,linenumber+"#"+timestamp+"# "+entry+padding);

    });

    //Ende für Überschriften
    if(styleMethode=="h1")
    {
      exports.OutputToConsole(styleMethode,line_segment);
    }
  };

}(typeof exports === 'undefined' ? this.OutConsole = {} : exports));

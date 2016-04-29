var gulp = require('gulp');
var through = require('through2');
var gutil = require('gulp-util');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var pathExists = require('path-exists');
var getFileSize = require('filesize');

var name;
var obj = {};
var perfObj = {};
var currentFile;


// Consts
const PLUGIN_NAME = 'performance-budget';
const jsonFile = './test.json';
const rootPath = __dirname;

function performanceBudget (perfBudgetJson) {

  perfObj = {};
  perfBudgetJson = perfBudgetJson || jsonFile;

  function writeToFile () {
    fs.writeJson(perfBudgetJson, perfObj, function (err, data) {
      if (err) throw (err);
    });
  };

  function getCurrentFileSize(file){
    return file.stat ? getFileSize(file.stat.size) : getFileSize(Buffer.byteLength(String(file.contents)));
  }

  function getFileExtension(file){
    return path.extname(file.path).replace('.','');
  }

  function buildPerfObjects(extname, file){
    extname = setExtensionRef(extname);
    var fileSize = parseInt(getCurrentFileSize(file));
    if(!perfObj.hasOwnProperty(extname)){
      perfObj[extname] = fileSize;
    }else{
      updatePropValue(extname, fileSize);
    }
  }

  function updatePropValue(extname, fileSize){
    var oldVal = perfObj[extname];
    var newVal = oldVal + fileSize;
    //console.log(extname +': ' + oldVal + ' + ' + fileSize + ' = ' + newVal);
    if(perfObj.hasOwnProperty(extname)){
      perfObj[extname] = newVal;
    }
  }

  function whichSvg(extname, type){
    //read svg file and see if property contains font reference
    
    //font-face
    var fileContents = currentFile.contents.toString();
    var typeMatch = 'images';

    if(fileContents.indexOf('font-face') > 0){
      typeMatch = 'fonts';
    };

    return type === typeMatch;
  }

  function setExtensionRef(extname){
    var extRef = extname;

    // images
    if((/(gif|jpg|jpeg|tiff|png)$/i).test(extRef)){
       extRef = 'image';
    }
    if(extRef === 'svg' && whichSvg(extRef, 'images')){
      extRef = 'image';  
    }
      
    //fonts
    if((/(woff|woff2|eot|ttf)$/i).test(extRef)){
      extRef = 'fonts'; 
    }

    if(extRef === 'svg' && whichSvg(extRef, 'fonts')){
      extRef = 'fonts';
    }

    return extRef;
  }

  function generate (file, enc, cb) {
    
    if (file.isNull()) {
      cb();
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    };

    currentFile = file;
    
    // TODO these need promises to avoid race conditions;
    buildPerfObjects(getFileExtension(file), file);

    writeToFile();

    cb();
  };

  return through.obj(generate);
};

module.exports = performanceBudget;

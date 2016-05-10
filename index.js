var through = require('through2');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var PluginError = require('plugin-error');
var pathExists = require('path-exists');
var getFileSize = require('filesize');
var extend = require('node.extend');
var mkpath = require('mkpath');

var gulp = require('gulp');

var obj = {};
var perfObj = {};
var currentFile;
var images = 'images';
var fonts = 'fonts';
var svg = 'svg';

var totalFileSize;
var fontSize;

var defaultBudget = 60000;
var defaultFilePath = './performanceBudget.json';

// Consts
const PLUGIN_NAME = 'performance-budget';
const rootPath = __dirname;

function performanceBudget (options) {

  perfObj = {};
  perfObj['fileTypes'] = {};
  totalFileSize = 0;
  fontSize = 0;
  var options = extend({}, options);

  function checkIfDestIsDefined () {
    if(options.dest === undefined) {
      options.dest = defaultFilePath;
      return;
    }
  }

  function getPath (fullPath) {
    return fullPath.substring(0, fullPath.lastIndexOf("/")+1);
  }

  function writeToFile () {
    var pathStr = getPath(options.dest);
    mkpath.sync(pathStr);
    fs.writeJson(options.dest, perfObj, function (err, data) {
      if (err) throw (err);
    });
  };

  function getCurrentFileSize (file) {
    return file.stat ? getFileSize(file.stat.size) : getFileSize(Buffer.byteLength(String(file.contents)));
  }

  function getFileExtension (file) {
    return path.extname(file.path).replace('.','');
  }

  function buildPerfObjects (extname, file) {
    extname = setExtensionRef(extname);
    var fileSize = parseInt(getCurrentFileSize(file));
    totalFileSize += fileSize;
    if (!perfObj.fileTypes.hasOwnProperty (extname)) {

      // console.log(extname);

      perfObj.fileTypes[extname] = { total: fileSize };
    } else {
      updateTotal(extname, fileSize);
    }

    updatePropValue(extname, fileSize);
  }

  function updateTotal (extname, fileSize) {
    // do total
    var oldVal = perfObj.fileTypes[extname].total;
    var newVal = oldVal + fileSize;
    perfObj.fileTypes[extname].total = newVal;
  }

  function updatePropValue (extname, fileSize) {

    //add files
    if (!perfObj.fileTypes[extname].hasOwnProperty ('files')) {
      perfObj.fileTypes[extname].files = [];
    }
    perfObj.fileTypes[extname].files.push({file: currentFile.path, size: fileSize});

  }

  function whichSvg (extname, type) {
    // read svg file and see if property contains font reference

    // font-face
    var fileContents = currentFile.contents.toString();
    var typeMatch = images;

    if (fileContents.indexOf('font-face') > 0){
      typeMatch = fonts;
    };

    return type === typeMatch;
  }

  function setExtensionRef (extname) {
    var extRef = extname;

    // images
    if ((/(gif|jpg|jpeg|tiff|png)$/i).test(extRef)){
       extRef = images;
    }

    if (extRef === svg && whichSvg(extRef, images)){
      extRef = images;
    }

    //fonts
    if ((/(woff|woff2|eot|ttf|otf)$/i).test(extRef)){
      extRef = fonts;
    }

    if (extRef === svg && whichSvg(extRef, fonts)){
      extRef = fonts;
    }

    return extRef;
  }

  function pushTotalFileSizeToJson () {
    perfObj['totalSize'] = totalFileSize;
  }

  function calculatePercentageForEachFileType () {
    for (var item in perfObj.fileTypes) {
      var percentage = Math.round((perfObj.fileTypes[item].total / perfObj.budget) * 100);

      if(perfObj.fileTypes[item].percentage === undefined) {
        perfObj.fileTypes[item]['percentage'] = percentage;
      }

      perfObj.fileTypes[item].percentage = percentage;
    }
  }

  function addBudgetToJsonFile () {
    if (options.budget === undefined) {
      options.budget = defaultBudget;
      return;
    }

    if (perfObj.budget !== undefined) return;
    perfObj['budget'] = options.budget;
  }

  function addRemainingBudgetToJsonFile () {
    perfObj['remainingBudget'] = perfObj.budget - perfObj.totalSize;
  }

  function generate (file, enc, cb) {

    if (file.isNull()) {
      cb();
      return;
    }

    if (file.isStream()) {
      cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    };

    currentFile = file;

    checkIfDestIsDefined();

    // TODO these need promises to avoid race conditions;
    addBudgetToJsonFile();
    buildPerfObjects(getFileExtension(file), file);
    pushTotalFileSizeToJson();
    calculatePercentageForEachFileType();
    addRemainingBudgetToJsonFile();

    writeToFile();

    cb();

  };

  return through.obj(generate);
};

module.exports = performanceBudget;

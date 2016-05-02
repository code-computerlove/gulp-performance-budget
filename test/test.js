'use strict'
var gulp = require('gulp');
var assert = require('stream-assert');
var should = require('should');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var performanceBudget = require('../index');  
var through = require('through2');
var getFileSize = require('filesize');

var testSrc = '_src/**/*';
var testCSSSrc = '_src/styles/**/*.css';
var testJSSrc = '_src/scripts/**/*.js';
var testImageSrc = '_src/images/**/*';
var jsonFileCSS = './test/cssFiles.json';
var jsonFileJS = './test/JSFiles.json';
var jsonFileImage = './test/imageFiles.json';
var jsonFileAll = './test/allFiles.json';


var filePath = '/_src/';

function getCurrentFileSize(file){
  return file.stat ? getFileSize(file.stat.size) : getFileSize(Buffer.byteLength(String(file.contents)));
}

function getFile(filename) {
  return fs.readFileAsync(filename);
};


describe('when running gulp-performance-budget', function () {
  it('should emit error on streamed file', function (done) {
    gulp.src(testSrc, { buffer: false })
      .pipe(performanceBudget())
      .on('error', function (err) {
        err.message.should.eql('Streaming not supported');
        done();
      });
  });

	it('should write a json config to file', function (done) {
		gulp.src(testSrc)
			.pipe(performanceBudget({dest: jsonFileAll}))
			.pipe(gulp.dest('dest'))
			.on('end', function (err, data) {
       var _self = this;
        fs.readFile(jsonFileAll, 'utf8', function (err, data) {
          if (err) throw (err);
          data.length.should.be.above(0);
          done();
        });
		});
	});

  it('should create an object containing a property css', function (done) {
    gulp.src(testCSSSrc)
      .pipe(performanceBudget({dest: jsonFileCSS}))
      .pipe(gulp.dest('dest'))
      .on('end', function (err, data) {
        fs.readFile(jsonFileCSS, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          dataObj.should.have.property('css');
          done();
        });
      });
  });

  it('should create an object containing a property images', function (done) {
    gulp.src(testImageSrc)
      .pipe(performanceBudget({dest: jsonFileImage}))
      .pipe(gulp.dest('dest'))
      .on('end', function (err, data) {
        fs.readFile(jsonFileImage, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          dataObj.should.have.property('images');
          done();
        });
      });
  });

  it('should return a css value greater than zero', function(done){
    var ext = 'css';
     gulp.src(testCSSSrc)
      .pipe(performanceBudget({dest: jsonFileCSS}))
      .pipe(gulp.dest('dest'))
      .on('end', function (err, data) {
        fs.readFile(jsonFileCSS, 'utf8', function (err, data) {
          if (err) throw (err);
          var dataObj = JSON.parse(data);
          var cssVal = 0;
          if(dataObj.hasOwnProperty(ext)){
            cssVal = parseInt(dataObj[ext].total);
          }
          cssVal.should.be.greaterThan(0);
          done();
        });
      });
  });

  it('should create a value for fonts if svg is a font', function(done){
    var fontFile = './_src/fonts/gt-pressura-mono-regular-webfont.svg';
    var outputFile = './test/svgFontJson.json';

    gulp.src(fontFile)
    .pipe(performanceBudget({dest: outputFile}))
    .pipe(gulp.dest('dest'))
    .on('end', function(err, data){
      fs.readFile(outputFile, 'utf-8', function(err, data){
        if(err) throw (err);
        var dataObj = JSON.parse(data);
        dataObj.should.have.property('fonts');
        done();
      })
    });
  });

  // it('should calculate the sum of 2 file sizes', function (done) {
  //   var file1 = './_src/images/images.jpg';
  //   var file2 = './_src/images/imgres.png';
  //   var fileSize1, fileSize2;
  //   var imagesx2 = './imagesx2.json';

  //   getFile(file1)
  //   .then(function(data){
  //     fileSize1 = parseInt(getCurrentFileSize(data));
  //     console.log('filesize1', fileSize1);
  //     return getFile(file2);
  //   })
  //   .then(function(data){
  //     fileSize2 = parseInt(getCurrentFileSize(data));
  //     console.log('filesize2', fileSize2);
  //     var expectedResult = fileSize1 + fileSize2;
  //     return expectedResult;
  //   })
  //   .then(function(expectedResult){
  //     console.log('1: ' + fileSize1 + ' 2: ' + fileSize2);
  //     var expectedResult = expectedResult;
  //     console.log('expected', expectedResult);
  //     gulp.src([file1, file2])
  //     .pipe(performanceBudget(imagesx2))
  //     .pipe(gulp.dest('dest'))
  //     .on('end', function (err, data) {
  //       fs.readFile(imagesx2, 'utf8', function (err, data) {
  //         if (err) throw (err);
  //         var dataObj = JSON.parse(data);
  //         dataObj.should.have.property('image', expectedResult);
  //         done();
  //       });
  //     });

  //   });
  // });

});

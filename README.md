# performance-budget

A task to produce a json output of the client side assets (file size) used on your website

The task will create an object based on the file extension. 

* All images types will be grouped under the key "image"
* All font types will be grouped under the key "fonts"

SVG's are determined based on the "font-face" attribute being present. If not present it will be grouped under the images key


###Usage

install dependencies

```
npm install performance-budget
```

###Basic setup using (gulp)
```javascript
var performanceBudget = require('performance-budget');

gulpTask('default', function(){
	gulp.src('your-files/**/*')
    .pipe(performanceBudget())
    .pipe(gulp.dest('dest'));
});

```
The dest is just a placeholder and has no influence on where your output is saved.

the default location for your json file will be at the root of the current working directory.

###Specific location (using gulp)

```javascript
var performanceBudget = require('performance-budget');

gulpTask('default', function(){
	gulp.src('your-files/**/*')
    .pipe(performanceBudget('/new-folder/performance-budget.json'))
    .pipe(gulp.dest('dest'));
});

```

###Options

For a differnt file location; pass the location as a parameter into performanceBudget

```javascript
performanceBudget('/new-folder/performance-budget.json')
```

###Example of output

```json
{
  "fonts": {
    "total": 241,
    "files": [
      {
        "file": "/Sites/gulp-performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.svg",
        "size": 98
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.ttf",
        "size": 61
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.woff",
        "size": 30
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.woff2",
        "size": 23
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/fonts/gt-pressura-regular-webfont.eot",
        "size": 29
      }
    ]
  },
  "images": {
    "total": 1922,
    "files": [
      {
        "file": "/Sites/gulp-performance-budget/_src/images/cl-logo.svg",
        "size": 906
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/images/images.jpg",
        "size": 12
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/images/imgres-1.png",
        "size": 1002
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/images/imgres.png",
        "size": 2
      }
    ]
  },
  "js": {
    "total": 207,
    "files": [
      {
        "file": "/Sites/gulp-performance-budget/_src/scripts/test.js",
        "size": 207
      }
    ]
  },
  "css": {
    "total": 85,
    "files": [
      {
        "file": "/Sites/gulp-performance-budget/_src/styles/info.css",
        "size": 57
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/styles/other.css",
        "size": 0
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/styles/other2.css",
        "size": 0
      },
      {
        "file": "/Sites/gulp-performance-budget/_src/styles/test.css",
        "size": 28
      }
    ]
  }
}

```



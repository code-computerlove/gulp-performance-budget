# performance-budget

A task to produce a json output of the client side assets (file size) used on your website.

The task will create an object based on the file extension.

* All images types will be grouped under the key "image"
* All font types will be grouped under the key "fonts"
* Maps and ico files will be ignored

SVG's are determined based on the "font-face" attribute being present. If not present it will be grouped under the images key.

###Usage

install dependencies

```
npm install performance-budget
```

###Basic setup using (gulp)

```javascript
var performanceBudget = require('performance-budget');

gulp.task('default', function(){
	return gulp.src('your-files/**/*')
    .pipe(performanceBudget())
    .pipe(gulp.dest('dest'));
});
```

The dest is just a placeholder and has no influence on where your output is saved, the location can be defined in the options which is described below. If this is not defined the default location for your JSON file will be at the root of the current working directory.

###Specific location (using gulp)

```javascript
var performanceBudget = require('performance-budget');

gulp.task('default', function(){
	return gulp.src('your-files/**/*')
    .pipe(performanceBudget({dest: 'pathToJson', budget: 3000}))
    .pipe(gulp.dest('dest'));
});
```

###Options

For a different file location pass the location as a parameter into performanceBudget.

```javascript
performanceBudget({dest: '/new-folder/performance-budget.json'})
```

To define a personal budget you can pass the max file size as a parameter into performanceBudget.
The file size input has to be a number and in bytes. If no file size is passed through it will
default to 60000 (60KB).

```javascript
performanceBudget({budget: 100000})
```

###Example of output

```json
{
  "fileTypes": {
    "fonts": {
      "total": 241,
      "files": [
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.svg",
          "size": 98
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.ttf",
          "size": 61
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.woff",
          "size": 30
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/fonts/gt-pressura-mono-regular-webfont.woff2",
          "size": 23
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/fonts/gt-pressura-regular-webfont.eot",
          "size": 29
        }
      ],
      "percentage": 6
    },
    "images": {
      "total": 2924,
      "files": [
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/images/cl-logo.svg",
          "size": 906
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/images/images.jpg",
          "size": 12
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/images/imgres-1.png",
          "size": 1002
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/images/imgres.png",
          "size": 2
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/totalFileSize/imgres-1.png",
          "size": 1002
        }
      ],
      "percentage": 79
    },
    "js": {
      "total": 414,
      "files": [
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/scripts/test.js",
          "size": 207
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/totalFileSize/test.js",
          "size": 207
        }
      ],
      "percentage": 11
    },
    "css": {
      "total": 142,
      "files": [
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/styles/info.css",
          "size": 57
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/styles/other.css",
          "size": 0
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/styles/other2.css",
          "size": 0
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/styles/test.css",
          "size": 28
        },
        {
          "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/totalFileSize/info.css",
          "size": 57
        }
      ],
      "percentage": 4
    }
  },
  "budget": 3000,
  "totalSize": 3721,
  "remainingBudget": -721
}
```

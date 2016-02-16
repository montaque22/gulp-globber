# Gulp-Globber

gulp-globber gives you the power to do globbing imports for gulp-sass. 
On its own gulp-sass does not allow you to import scss partials using globbing but with gulp-globber 
you can import an entire directories!

Some things to note:
  - We cannot guarantee the order of the imports at a file level.

### Version
1.1.1

## Installation

Use the following command:

```sh
$ npm install --save-dev gulp-globber
```

### Basic Usage
Create a single scss file that you will use as the main scss to hold all of your imports. It can be empty or it can
hold already predefined imports

main.scss file Before:

```sh
// test_app/css/sass/main.scss
@import "partials/partial/model.scss";
```

When used by itself gulp-globber will generate a new scss file which will have all the imports dictated by the source.

```sh
var globber = require('gulp-globber');
var gulp    = require('gulp');

var ROOT = 'test_app/';

gulp.task('glob', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        .pipe(globber({
            // This is a required field that points 
            // to folder containing all the scss partials
            source  : ROOT + 'css/sass/other_partials'
        }))
        .pipe(gulp.dest(ROOT + '/css/sass'))
});
```


```sh
// test_app/css/sass/_main.scss
@import "partials/partial/model.scss";

/* ---- Auto-Generated Content Below ---- */
@import "test_app/css/sass/other_partials/test.scss";
@import "test_app/css/sass/other_partials/temp.scss";
@import "test_app/css/sass/other_partials/sub_partials/mixins.scss";
```

We can control the order of the imports from a folder level but we cannot guarantee the order of the 
individual scss files within each folder. 
To give yourself more control over the imports of the folders you can pass an array of directories and they will 
import in the order they appear in the array.

```sh
var globber = require('gulp-globber');
var gulp    = require('gulp');
var ROOT    = 'test_app/';

gulp.task('glob1', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        //  All the files under this directory will 
        // show up first in the import list
        .pipe(globber([ ROOT + 'css/scss/other_partials', ROOT + 'views/scss/some_other_partials']))
        
        .pipe(gulp.dest(ROOT + '/css/sass')) // final output will be a file named _main.scss
});

// This is the same as the task glob1
gulp.task('glob2', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        //  All the files under this directory will 
        // show up first in the import list
        .pipe(globber({
            source: [ ROOT + 'css/scss/other_partials', ROOT + 'views/scss/some_other_partials']
        }))
        
        .pipe(gulp.dest(ROOT + '/css/sass')) // final output will be a file named main.scss
});

// This is also the same as task glob1 & glob2 except the name of the output file will be a little longer
gulp.task('glob', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        //  All the files under this directory will 
        // show up first in the import list
        .pipe(globber(ROOT + 'css/scss/other_partials')) 
        .pipe(globber(ROOT + 'views/scss/some_other_partials')) 

        .pipe(gulp.dest(ROOT + '/css/sass')) // final output will be a file named main.scss
});
```


You can optionally rename given file and you uses gulp-sass to compile your scss file
```sh
var globber = require('gulp-globber');
var gulp    = require('gulp');
var sass    = require('gulp-sass');
var ROOT    = 'test_app/';

gulp.task('glob1', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        //  All the files under this directory will 
        // show up first in the import list
        .pipe(globber({ 
            source: [ ROOT + 'css/scss/other_partials', ROOT + 'views/scss/some_other_partials'],
            rename: 'combined.scss'
        }))
        .pipe(sass()) // Compile the passed in file combined.scss
        .pipe(gulp.dest(ROOT + '/css/')) // final output will be a file named combined.css
});
```
### Options
#### options.source (Required)
- Type    : String | Array
- Default : none

Specify the directories from which you want to import your scss files.

#### options.exclude 
- Type    : Array
- Default : ['!*.scss']

For each of the specified sources the plugin will exclude the files dictated by this option. By default, this plugin
will exclude all files except .scss

#### options.rename 
- Type    : String
- Default : none

Renames the output file to a name of your choosing


### Todos

 - Write Tests


License
----

Copyright (c) 2016 Michael Montaque

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

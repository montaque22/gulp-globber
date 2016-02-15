# Gulp-Globber

gulp-globber gives you the power to do globbing imports for gulp-sass. On its own gulp-sass does not allow you to import scss partials using globbing but with gulp-globber you can import an entire directories!

Some things to note:
  - We cannot garrauntee the order of the imports

### Version
1.0.0

## Installation

You need Gulp installed globally:

```sh
$ npm install --save-dev gulp-globber
```

### Basic Usage
Use this in conjuction with gulp-sass to compile all the partials together.

main.scss file Before:

```sh
// test_app/css/sass/main.scss
@import "partials/partial/model.scss";
```

Use gulp-globber...

```sh
var globber = require('gulp-globber');
var gulp    = require('gulp');

var ROOT = 'test_app/';

gulp.task('glob', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        .pipe(globber({
            // This is a required field that points 
            // to folder containing all the scss partials
            source  : ROOT + 'css/scss/other_partials'
        }))
        .pipe(gulp.dest(ROOT + '/css/sass'))
});
```
A new file will be created with the same name as the original with an underscore prefixed to the name. So in this case a new file named _main.scss was created.

```sh
// test_app/css/sass/_main.scss
@import "partials/partial/model.scss";

/* ---- Auto-Generated Content Below ---- */
@import "test_app/css/sass/other_partials/test.scss";
@import "test_app/css/sass/other_partials/temp.scss";
@import "test_app/css/sass/other_partials/sub_partials/mixins.scss";
```
Remember, we cannot gauruntee the order the imports will be placed in the folder. To give yourself more control over the imports you can use gulp-globber multiple times on different folders.

```sh
var globber = require('gulp-globber');
var gulp    = require('gulp');
var sass    = require('gulp-sass');
var ROOT    = 'test_app/';

gulp.task('glob', function(){
    return gulp.src(ROOT + 'css/sass/main.scss')
        //  All the files under this directory will 
        // show up first in the import list
        .pipe(globber({
            source  : ROOT + 'css/scss/other_partials'
        }))
        // all the files under this directory will show up next 
        .pipe(globber({
            source  : ROOT + 'views/scss/some_other_partials'
            // Will create a file named styles.scss 
            // instead of _main.scss
            rename  : 'styles.scss'
        }))
        
        // compile the styles.scss file to css
        .pipe(sass())
        .pipe(gulp.dest(ROOT + '/css/sass'))
});
```


### Todos

 - Write Tests


License
----

MIT

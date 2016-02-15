/**
 * Created by mmontaque on 2/14/16.
 */
// through2 is a thin wrapper around node transform streams
var through     = require('through2');
var gutil       = require('gulp-util');
var recursive   = require('recursive-readdir');
var fs          = require('fs');
var Q           = require('q');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-globber';

// Plugin level function(dealing with files)
function gulpGlobber(file, options) {

    var mainFile        = options.main;
    var sourceFiles     = options.source;
    var targetSassName  = options.targetName;
    var destination     = options.destination;
    var deferred        = Q.defer();
    var mainFile        = 'regenerated.scss';

    var cwd = process.cwd();
    // Look for all the scss files in the views directory
    //recursive('./client/views/', ['*.js', '*.html'], function (err, files) {
    //
    //
    //    console.log(cwd)
    //    // read the content of the main scss file
    //    var scss = fs.readFileSync( + mainFile, 'utf8');
    //
    //    // add in a comment
    //    scss += '\n/* ---- Auto-Generated Content Below ---- */';
    //
    //    if(!err){
    //        // cycle through all the names and add in the new imports
    //        files.forEach(function(file){
    //            scss += '\n@import "';
    //            scss +=  file + '";';
    //        })
    //    }
    //
    //    // create a new scss file
    //    fs.writeFileSync(paths.STYLES + mainFile, scss);
    //
    //    // read the file
    //    gulp.src(paths.STYLES + mainFile)
    //        // Compile it
    //        .pipe($.sass(sassOptions).on('error', $.sass.logError))
    //
    //        // rename it
    //        .pipe($.rename(function (path) {
    //            path.basename = "main";
    //        }))
    //
    //        // save it
    //        .pipe(gulp.dest(paths.STYLES+'../'))
    //
    //        // resolve promise
    //        .on('end',deferred.resolve);
    //
    //
    //});

    return through.obj(function(file, enc, cb) {
        console.log(file)
        console.log(enc)
        console.log(cb)

        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }
        //if (file.isBuffer()) {
        //    file.contents = Buffer.concat([prefixText, file.contents]);
        //}
        //if (file.isStream()) {
        //    file.contents = file.contents.pipe(prefixStream(prefixText));
        //}

        cb(null, file);

    });
    //return deferred.promise;

    //
    //
    //if (!prefixText) {
    //    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
    //}
    //prefixText = new Buffer(prefixText); // allocate ahead of time
    //
    //// Creating a stream through which each file will pass
    //return through.obj(function(file, enc, cb) {
    //    if (file.isNull()) {
    //        // return empty file
    //        return cb(null, file);
    //    }
    //    if (file.isBuffer()) {
    //        file.contents = Buffer.concat([prefixText, file.contents]);
    //    }
    //    if (file.isStream()) {
    //        file.contents = file.contents.pipe(prefixStream(prefixText));
    //    }
    //
    //    cb(null, file);
    //
    //});

}

// Exporting the plugin main function
module.exports = gulpGlobber;
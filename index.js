/**
 * Created by mmontaque on 2/14/16.
 */
// through2 is a thin wrapper around node transform streams
var through     = require('through2');
var recursive   = require('recursive-readdir');
var File        = require('vinyl');
var path        = require('path');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-globber';

// Plugin level function(dealing with files)
function gulpGlobber(options) {

    if(!options || !options.source){
        throw new PluginError(PLUGIN_NAME, 'Missing required option "source"');
    }



    // new name for the css file
    var renamedFile     = options.rename;

    // directory containing the scss files you want to include
    var sourceFiles     = options.source;

    // by default, it will exclude all files except scss files however it can be overridden
    var excludedFiles   = options.exclude || ['!*.scss'];


    function prefixStream(prefixText) {
        var stream = through();
        stream.write(prefixText);
        return stream;
    }

    return through.obj(function(sourceFile, enc, cb) {

        recursive(sourceFiles, excludedFiles, function (err, files) {
            var postFixText = '';
            var file = new File(sourceFile);
            var base = file.base;
            var basename = path.basename(file.path);

            // stop if there is an error
            if(err)
                return cb(err);
            else  if (file.isNull())
            // return an empty file
                return cb(null, file);

            // add in a comment for separation
            postFixText += '\n\n\n/* ---- Auto-Generated Content Below ---- */';

            // cycle through all the names and add in the new imports
            files.forEach(function(file){
                postFixText += '\n@import "';
                postFixText +=  file + '";';
            });

            // create text buffer
            var postFixTextBuffer = new Buffer(postFixText);


            // handle file as a buffer
            if (file.isBuffer()) {
                file.contents = Buffer.concat([file.contents, postFixTextBuffer]);
            }

            // handle file as a stream
            else  if (file.isStream()) {
                file.contents = file.contents.pipe(prefixStream(postFixTextBuffer));
            }

            // Rename the file
            if(renamedFile){
                file.path = path.join(base, renamedFile);
            }else{
                file.path = path.join(base, '_'+basename);
            }

            // return the file
            cb(null, file);

        });

    });

}

// Exporting the plugin main function
module.exports = gulpGlobber;
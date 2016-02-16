/**
 * Created by mmontaque on 2/14/16.
 */
// through2 is a thin wrapper around node transform streams
var through     = require('through2');
var recursive   = require('recursive-readdir');
var File        = require('vinyl');
var path        = require('path');
var gutil       = require('gulp-util');
var Q           = require('q');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-globber';

/**
 * Transforms the source to an object that has the appropriate source type
 */
function normalizeSources(sources){
    if(typeof sources === 'string'){
        return {source: [path.normalize(sources)]}
    }

    else if(Array.isArray(sources)){
        sources.forEach(function(source){
            source = path.normalize(source)
        });
        return {source: sources}
    }

    else if(typeof sources === 'object'){
        var data = normalizeSources(sources.source);
        sources.source = data.source;
        return sources;
    }
    else {
        throw new PluginError(PLUGIN_NAME, 'Missing source');
    }
}

function gatherAllIndividualSourceFiles(sources, excluded){
    var allPromises = [];

    sources.forEach(function(source){
        var defer = Q.defer();
        allPromises.push(defer.promise);

        recursive(source, excluded, function (err, files) {
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(files);
            }
        });
    });


    return Q.all(allPromises)
        .then(function(data){
            var allFiles = [];
            data.forEach(function(files){
                allFiles = allFiles.concat(files);
            });
            return allFiles;
        })
}

function prefixStream(prefixText) {
    var stream = through();
    stream.write(prefixText);
    return stream;
}

// Plugin level function(dealing with files)
function gulpGlobber(data) {
    var options = normalizeSources(data);

    // new name for the css file
    var renamedFile     = options.rename;

    // directory containing the scss files you want to include
    var sources = options.source;

    // by default, it will exclude all files except scss files however it can be overridden
    var excludedFiles   = options.exclude || ['!*.scss'];


    return through.obj(function(sourceFile, enc, cb) {

        gatherAllIndividualSourceFiles(sources, excludedFiles)
            .then(function(files){
                var postFixText = '';
                var file = new File(sourceFile);
                var base = file.base;
                var basename = path.basename(file.path);

                // stop if there is an error

                if (file.isNull())
                // return an empty file
                    return cb(null, file);

                // add in a comment for separation
                postFixText += '\n\n\n/* ---- Auto-Generated Content Below ---- */';

                // cycle through all the names and add in the new imports
                files.forEach(function(file){
                    if(process.platform === 'win32'){
                        file = file.replace(/\\/g,'/');
                    }
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
                }

                // return the file
                cb(null, file);
            })
            .catch(function(err){
                cb(err);
            })

    });

}

// Exporting the plugin main function
module.exports = gulpGlobber;
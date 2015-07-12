var jstransformer = require('jstransformer')
var toTransformer = require('inputformat-to-jstransformer')
var async = require('async')
var extend = require('extend')
var clone = require('clone')
var transformers = {}

/**
 * Get the transformer from the given name.
 *
 * @return The JSTransformer; null if it doesn't exist.
 */
function getTransformer (name) {
  if (name in transformers) {
    return transformers[name]
  }
  var transformer = toTransformer(name)
  transformers[name] = transformer ? jstransformer(transformer) : false
  return transformers[name]
}

module.exports = function (opts) {
  return function (files, metalsmith, done) {
    // Load the default partials.
    var metadata = metalsmith.metadata()
    metadata.partials = extend({}, metadata.partials || {}, opts || {})

    /**
     * Filter out all partials
     */
    function filterFile (file, done) {
      done(files[file].partial)
    }

    /**
     * Add the given file in as a partial.
     */
    function addPartial (filename, done) {
      // Create a copy of the file and delete it from the database.
      var file = clone(files[filename])
      delete files[filename]
      // Retrieve the extension chain.
      var extensions = filename.split('.')

      /**
       * Define the partial as a function.
       */
      function executePartial () {
        var content = file.contents.toString()
        // Loop through all the extensions in reverse order.
        for (var i = extensions.length - 1; i > 0; i--) {
          // Retrieve the transformer.
          var transformer = getTransformer(extensions[i])
          if (transformer) {
            // Construct the options.
            var options = extend({}, metalsmith.metadata(), file)
            // Merge in all the arguments from calling the partial.
            for (var n in arguments) {
              extend(options, arguments[n])
            }
            var result = transformer.render(content, options, options)
            if (result.body) {
              content = result.body
            } else {
              // There was an error rendering the transformer.
              break
            }
          } else {
            // The given extension is not supported. Skip it.
            break
          }
        }
        return content
      }

      // Add the partial to the metadata partials.
      metadata.partials[extensions[0]] = executePartial
      done()
    }

    // Filter out all partials.
    async.filter(Object.keys(files), filterFile, function (partials) {
      // Add all of the partials to the metadata.
      async.map(partials, addPartial, done)
    })
  }
}

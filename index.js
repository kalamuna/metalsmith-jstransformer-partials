'use strict'

const path = require('path')
const jstransformer = require('jstransformer')
const toTransformer = require('inputformat-to-jstransformer')
const async = require('async')
const extend = require('extend-shallow')
const clone = require('clone')
const minimatch = require('minimatch')

/**
 * Metalsmith JSTransformer Partials.
 *
 * @param [opts] - An array with the provided options:
 *   - pattern - A pattern of files which will automatically be interpretted as a partial. Defaults to ``
 *   - partials - An existing array of partials
 */
module.exports = function (opts) {
  opts = extend({
    pattern: 'partials/**'
  }, opts)
  const transformers = {}

  /**
   * Get the transformer from the given name.
   *
   * @return The JSTransformer; null if it doesn't exist.
   */
  function getTransformer(name) {
    if (name in transformers) {
      return transformers[name]
    }
    const transformer = toTransformer(name)
    transformers[name] = transformer ? jstransformer(transformer) : false
    return transformers[name]
  }

  return function (files, metalsmith, done) {
    // Load the default partials.
    const metadata = metalsmith.metadata()
    metadata.partials = extend({}, metadata.partials || {}, opts.partials || {})

    /**
     * Renders a partial from the given name.
     */
    function renderPartial(name) {
      // The name is a required input.
      if (!name) {
        throw new Error('When calling .partial(), name is required.')
      }

      // Ensure the partial is available in the metadata.
      if (!(name in metalsmith.metadata().partials)) {
        throw new Error('The partial "' + name + '" was not found.')
      }

      // Construct the partial function arguments.
      const fnarray = []
      for (let i = 1; i < arguments.length; i++) {
        fnarray.push(arguments[i])
      }

      // Call the partial function with the given array arguments.
      return metalsmith.metadata().partials[name].apply(metalsmith.metadata(), fnarray)
    }

    /**
     * Create the partial function.
     */
    if (!metadata.partial) {
      metadata.partial = renderPartial
    }

    /**
     * Filter out all partials
     */
    function filterFile(file, done) {
      if (files[file].partial) {
        // Discover whether it is explicitly declared as a partial.
        return done(null, files[file].partial)
      } else if (opts.pattern) {
        // Check if it matches the partial pattern.
        return done(null, minimatch(file, opts.pattern))
      }
      // The file is not a partial.
      done(null, false)
    }

    /**
     * Add the given file in as a partial.
     */
    function addPartial(filename, done) {
      // Create a copy of the file and delete it from the database.
      const file = clone(files[filename])
      delete files[filename]

      // Compile the partial.
      const info = path.parse(filename)
      const transform = info.ext ? info.ext.substring(1) : null
      const transformer = getTransformer(transform)
      if (transformer) {
        // Construct the options.
        const options = extend({}, metalsmith.metadata(), file, {
          filename: path.join(metalsmith.source(), filename)
        })

        // Compile the partial.
        transformer.compileAsync(file.contents.toString(), options).then(template => {
          /**
           * Define the partial as a function.
           */
          metalsmith.metadata().partials[info.name] = locals => {
            const opt = extend({}, options, locals)
            return template.fn.apply(file, [opt])
          }
          metalsmith.metadata().partials[info.name].file = file
          done()
        }, done)
      } else {
        // Do not error out when the Transformer is not found.
        done()
      }
    }

    // Filter out all partials.
    async.filter(Object.keys(files), filterFile, (err, partials) => {
      // Error handling.
      if (err) {
        return done(err)
      }

      // Add all of the partials to the metadata.
      async.map(partials, addPartial, done)
    })
  }
}

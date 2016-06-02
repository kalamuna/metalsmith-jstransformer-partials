var assertDir = require('assert-dir-equal')
var partials = require('..')
var jstransformer = require('metalsmith-jstransformer')
var Metalsmith = require('metalsmith')
var rmdir = require('rimraf')

/* globals it describe */

function test(name, opts) {
  opts = opts || {}
  it(name, function (done) {
    // Clean the build directory.
    var testPath = 'test/fixtures/' + name
    rmdir.sync(testPath + '/build')

    // Build and run Metalsmith
    new Metalsmith(testPath)
      .use(partials(opts))
      .use(jstransformer())
      .build(function (err) {
        if (err) {
          return done(err)
        }
        assertDir(testPath + '/build', testPath + '/expected')
        done()
      })
  })
}

describe('metalsmith-jstransformer-partials', function () {
  test('basic')
  test('basic-default')
  test('call-partial')
  test('pattern', {
    pattern: 'new-partials/*'
  })
})

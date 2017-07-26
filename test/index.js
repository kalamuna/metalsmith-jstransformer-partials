const assertDir = require('assert-dir-equal')
const partials = require('..')
const jstransformer = require('metalsmith-jstransformer')
const Metalsmith = require('metalsmith')
const rmdir = require('rimraf')

/* globals it describe */

function test(name, opts) {
  opts = opts || {}
  it(name, done => {
    // Clean the build directory.
    const testPath = 'test/fixtures/' + name
    rmdir.sync(testPath + '/build')

    // Build and run Metalsmith
    new Metalsmith(testPath)
      .use(partials(opts))
      .use(jstransformer())
      .build(err => {
        if (err) {
          return done(err)
        }
        assertDir(testPath + '/build', testPath + '/expected')
        done()
      })
  })
}

describe('metalsmith-jstransformer-partials', () => {
  test('basic')
  test('basic-default')
  test('subfolder')
  test('call-partial')
  test('pattern', {
    pattern: 'new-partials/*'
  })
})

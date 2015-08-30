var assertDir = require('assert-dir-equal')
var partials = require('../')
var jstransformer = require('metalsmith-jstransformer')
var Metalsmith = require('metalsmith')

/* globals it describe */

function test (name, opts) {
  opts = opts || {}
  it(name, function (done) {
    Metalsmith('test/fixtures/' + name)
      .use(partials(opts))
      .use(jstransformer())
      .build(function (err) {
        if (err) {
          return done(err)
        }
        assertDir('test/fixtures/' + name + '/expected', 'test/fixtures/' + name + '/build')
        return done()
      })
  })
}

describe('metalsmith-jstransformer-partials', function (done) {
  test('basic')
  test('call-partial')
  test('pattern', {
    pattern: 'partials/*'
  })
})

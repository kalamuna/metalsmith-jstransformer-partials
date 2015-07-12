var assertDir = require('assert-dir-equal')
var partials = require('../')
var jstransformer = require('metalsmith-jstransformer')
var Metalsmith = require('metalsmith')

function test (name, options) {
  /* globals it describe */
  it(name, function (done) {
    Metalsmith('test/fixtures/' + name)
      .use(partials())
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
  test('basic', done)
})

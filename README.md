# Metalsmith JSTransformer Partials [![NPM version](https://img.shields.io/npm/v/metalsmith-jstransformer-partials.svg)](https://www.npmjs.org/package/metalsmith-jstransformer-partials)

[![Build Status](https://img.shields.io/travis/RobLoach/metalsmith-jstransformer-partials/master.svg)](https://travis-ci.org/RobLoach/metalsmith-jstransformer-partials)
[![Dependency Status](https://david-dm.org/RobLoach/metalsmith-jstransformer-partials.png)](https://david-dm.org/RobLoach/metalsmith-jstransformer-partials)

[Metalsmith](http://metalsmith.io) plugin to add partial support through any [JSTransformer](http://github.com/jstransformers).

## Installation

    npm install --save metalsmith-jstransformer-partials

### CLI

If you are using the command-line version of Metalsmith, you can install via npm, and then add the `metalsmith-jstransformer-partials` key above `metalsmith-jstransformer` in your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-jstransformer-partials": {},
    "metalsmith-jstransformer": {}
  }
}
```

### JavaScript API

If you are using the JavaScript API for Metalsmith, then you can require the module and add it to your `.use()` directives above `metalsmith-jstransformer`:

```js
var partials = require('metalsmith-jstransformer-partials');
var jstransformer = require('metalsmith-jstraxnsformer');

metalsmith.use(partials());
metalsmith.use(jstransformer())
```

## Usage

Define partials by adding `partials: true` to your file metadata. The following example using [Swig](https://paularmstrong.github.io/swig/), so ensure you also install [`jstransformer-swig`](https://github.com/jstransformers/jstransformer-swig). To call a partial, invoke `partial(<partialname>, locals)` or `partials[<partialname>](locals):

### src/partials/name.swig
``` html
---
partial: true
name: Default Name
---
<div class="name">
  <h2>Name: {{ name }}</h2>
</div>
```

### src/index.html.swig
``` html
<div class="name-wrapper">
{{ partial('name', { name: 'TJ Holowaychuk' })|safe }}
</div>
```

### Result
``` html
<div class="name-wrapper">
<div class="name">
  <h2>Name: TJ Holowaychuk</h2>
</div>
</div>
```

## Options

### `.pattern`

The pattern in which to automatically detect partials, without having to set `partial: true`. By default, this is disabled.

### `.partials`

An array of already existing partials to add to the array.

## License

MIT

# Metalsmith JSTransformer Partials [![NPM version](https://img.shields.io/npm/v/metalsmith-jstransformer-partials.svg)](https://www.npmjs.org/package/metalsmith-jstransformer-partials)

[![Build Status](https://img.shields.io/travis/RobLoach/metalsmith-jstransformer-partials/master.svg)](https://travis-ci.org/RobLoach/metalsmith-jstransformer-partials)
[![Dependency Status](https://david-dm.org/RobLoach/metalsmith-jstransformer-partials.png)](https://david-dm.org/RobLoach/metalsmith-jstransformer-partials)

[Metalsmith](http://metalsmith.io) plugin to process partials with any [JSTransformer](http://github.com/jstransformers).

## Installation

    npm install --save metalsmith-jstransformer-partials

## Usage

Define partials by adding `partials: true` to your file metadata. Use them through calling `partial(<partialname>)`:

### src/partials/name.swig
``` swig
---
partial: true
name: Default Name
---
<div class="name">
  <h2>Name: {{ name }}</h2>
</div>
```

### src/index.html.swig
``` swig
<div class="name-wrapper">
  {{ partial('name', {name:'Real Name'})|safe }}
</div>
```

### CLI

If you are using the command-line version of Metalsmith, you can install via npm, and then add the `metalsmith-jstransformer` key to your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-jstransformer-partials": {}
  }
}
```

### JavaScript

If you are using the JS Api for Metalsmith, then you can require the module and add it to your `.use()` directives:

```js
var partials = require('metalsmith-jstransformer-partials');

metalsmith.use(partials());
```

## License

MIT

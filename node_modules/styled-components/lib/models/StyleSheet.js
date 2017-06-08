'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sheet = require('../vendor/glamor/sheet');

exports.default = new _sheet.StyleSheet({ speedy: false, maxLength: 40 });

/* Wraps glamor's stylesheet and exports a singleton for the rest
*  of the app to use. */

module.exports = exports['default'];
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n      html {\n        ', '\n      }\n    '], ['\n      html {\n        ', '\n      }\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['\n      a {\n        ', '\n      }\n    '], ['\n      a {\n        ', '\n      }\n    ']),
    _templateObject3 = _taggedTemplateLiteral(['\n      ', '\n    '], ['\n      ', '\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _enzyme = require('enzyme');

var _injectGlobal = require('../injectGlobal');

var _injectGlobal2 = _interopRequireDefault(_injectGlobal);

var _StyleSheet = require('../../models/StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _utils = require('../../test/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var styled = (0, _utils.resetStyled)();
var rule1 = 'width: 100%;';
var rule2 = 'text-decoration: none;';
var rule3 = 'color: blue;';

describe('injectGlobal', function () {
  beforeEach(function () {
    (0, _utils.resetStyled)();
  });

  it('should inject rules into the head', function () {
    (0, _injectGlobal2.default)(_templateObject, rule1);
    (0, _expect2.default)(_StyleSheet2.default.injected).toBe(true);
  });

  it('should non-destructively inject styles when called repeatedly', function () {
    (0, _injectGlobal2.default)(_templateObject, rule1);

    (0, _injectGlobal2.default)(_templateObject2, rule2);
    (0, _utils.expectCSSMatches)('\n      html {\n        ' + rule1 + '\n      }\n      a {\n        ' + rule2 + '\n      }\n    ');
  });

  it('should non-destructively inject styles when called after a component', function () {
    var Comp = styled.div(_templateObject3, rule3);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));

    (0, _injectGlobal2.default)(_templateObject, rule1);

    (0, _utils.expectCSSMatches)('\n      .a {\n        ' + rule3 + '\n      }\n      html {\n        ' + rule1 + '\n      }\n    ');
  });
});
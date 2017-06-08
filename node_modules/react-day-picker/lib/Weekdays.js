'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Weekdays;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PropTypes = require('./PropTypes');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Weekdays(_ref) {
  var firstDayOfWeek = _ref.firstDayOfWeek;
  var weekdaysLong = _ref.weekdaysLong;
  var weekdaysShort = _ref.weekdaysShort;
  var locale = _ref.locale;
  var localeUtils = _ref.localeUtils;
  var weekdayElement = _ref.weekdayElement;

  var days = [];
  for (var i = 0; i < 7; i += 1) {
    var weekday = (i + firstDayOfWeek) % 7;
    var elementProps = {
      key: i,
      className: 'DayPicker-Weekday',
      weekday: weekday,
      weekdaysLong: weekdaysLong,
      weekdaysShort: weekdaysShort,
      localeUtils: localeUtils,
      locale: locale
    };
    var element = _react2.default.cloneElement(weekdayElement, elementProps);
    days.push(element);
  }

  return _react2.default.createElement(
    'div',
    { className: 'DayPicker-Weekdays', role: 'rowgroup' },
    _react2.default.createElement(
      'div',
      { className: 'DayPicker-WeekdaysRow', role: 'columnheader' },
      days
    )
  );
}

Weekdays.propTypes = {
  firstDayOfWeek: _react.PropTypes.number.isRequired,
  weekdaysLong: _react.PropTypes.arrayOf(_react.PropTypes.string),
  weekdaysShort: _react.PropTypes.arrayOf(_react.PropTypes.string),
  locale: _react.PropTypes.string.isRequired,
  localeUtils: _PropTypes2.default.localeUtils.isRequired,
  weekdayElement: _react.PropTypes.element
};
//# sourceMappingURL=Weekdays.js.map
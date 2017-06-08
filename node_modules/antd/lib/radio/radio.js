'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _rcRadio = require('rc-radio');

var _rcRadio2 = _interopRequireDefault(_rcRadio);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var Radio = function (_React$Component) {
    (0, _inherits3["default"])(Radio, _React$Component);

    function Radio() {
        (0, _classCallCheck3["default"])(this, Radio);
        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
    }

    Radio.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(0, _shallowequal2["default"])(this.props, nextProps) || !(0, _shallowequal2["default"])(this.state, nextState) || !(0, _shallowequal2["default"])(this.context.radioGroup, nextContext.radioGroup);
    };

    Radio.prototype.render = function render() {
        var _classNames;

        var _a = this.props,
            prefixCls = _a.prefixCls,
            className = _a.className,
            children = _a.children,
            style = _a.style,
            restProps = __rest(_a, ["prefixCls", "className", "children", "style"]);
        var radioProps = (0, _extends3["default"])({}, restProps);
        if (this.context.radioGroup) {
            radioProps.onChange = this.context.radioGroup.onChange;
            radioProps.checked = this.props.value === this.context.radioGroup.value;
            radioProps.disabled = this.props.disabled || this.context.radioGroup.disabled;
        }
        var wrapperClassString = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrapper', true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrapper-checked', radioProps.checked), (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrapper-disabled', radioProps.disabled), _classNames), className);
        return _react2["default"].createElement(
            'label',
            { className: wrapperClassString, style: style, onMouseEnter: this.props.onMouseEnter, onMouseLeave: this.props.onMouseLeave },
            _react2["default"].createElement(_rcRadio2["default"], (0, _extends3["default"])({}, radioProps, { prefixCls: prefixCls })),
            children !== undefined ? _react2["default"].createElement(
                'span',
                null,
                children
            ) : null
        );
    };

    return Radio;
}(_react2["default"].Component);

exports["default"] = Radio;

Radio.defaultProps = {
    prefixCls: 'ant-radio'
};
Radio.contextTypes = {
    radioGroup: _react.PropTypes.any
};
module.exports = exports['default'];
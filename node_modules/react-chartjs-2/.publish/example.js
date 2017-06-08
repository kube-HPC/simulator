require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)',
    data: [65, 59, 80, 81, 56, 55, 40]
  }]
};

exports.default = _react2.default.createClass({
  displayName: 'BarExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Bar Example (custom size)'
      ),
      _react2.default.createElement(_reactChartjs.Bar, {
        data: data,
        width: 100,
        height: 50,
        options: {
          maintainAspectRatio: false
        }
      })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  labels: ['January'],
  datasets: [{
    label: 'My First dataset',
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(75,192,192,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: [{ x: 10, y: 20, r: 5 }]
  }]
};

exports.default = _react2.default.createClass({
  displayName: 'BubbleExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Bubble Example'
      ),
      _react2.default.createElement(_reactChartjs.Bubble, { data: data })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
		labels: ['Red', 'Green', 'Yellow'],
		datasets: [{
				data: [300, 50, 100],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
		}]
};

exports.default = _react2.default.createClass({
		displayName: 'DoughnutExample',

		render: function render() {
				return _react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
								'h2',
								null,
								'Doughnut Example'
						),
						_react2.default.createElement(_reactChartjs.Doughnut, { data: data })
				);
		}
});

},{"react":undefined,"react-chartjs-2":undefined}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getState = function getState() {
  return {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [{
      data: [getRandomInt(50, 200), getRandomInt(100, 150), getRandomInt(150, 250)],
      backgroundColor: ['#CCC', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };
};

exports.default = _react2.default.createClass({
  displayName: 'DynamicDoughnutExample',

  getInitialState: function getInitialState() {
    return getState();
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    setInterval(function () {
      _this.setState(getState());
    }, 5000);
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Dynamicly refreshed Doughnut Example'
      ),
      _react2.default.createElement(_reactChartjs.Doughnut, { data: this.state })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)',
    data: [65, 59, 80, 81, 56, 55, 40]
  }]
};

exports.default = _react2.default.createClass({
  displayName: 'BarExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Horizontal Bar Example'
      ),
      _react2.default.createElement(_reactChartjs.HorizontalBar, { data: data })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'My First dataset',
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(75,192,192,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: [65, 59, 80, 81, 56, 55, 40]
  }]
};

exports.default = _react2.default.createClass({
  displayName: 'LineExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Line Example'
      ),
      _react2.default.createElement(_reactChartjs.Line, { data: data })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Sales',
    type: 'line',
    data: [51, 65, 40, 49, 60, 37, 40],
    fill: false,
    borderColor: '#EC932F',
    backgroundColor: '#EC932F',
    pointBorderColor: '#EC932F',
    pointBackgroundColor: '#EC932F',
    pointHoverBackgroundColor: '#EC932F',
    pointHoverBorderColor: '#EC932F',
    yAxisID: 'y-axis-2'
  }, {
    type: 'bar',
    label: 'Visitor',
    data: [200, 185, 590, 621, 250, 400, 95],
    fill: false,
    backgroundColor: '#71B37C',
    borderColor: '#71B37C',
    hoverBackgroundColor: '#71B37C',
    hoverBorderColor: '#71B37C',
    yAxisID: 'y-axis-1'
  }]
};

var options = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [{
      display: true,
      gridLines: {
        display: false
      },
      labels: {
        show: true
      }
    }],
    yAxes: [{
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',
      gridLines: {
        display: false
      },
      labels: {
        show: true
      }
    }, {
      type: 'linear',
      display: true,
      position: 'right',
      id: 'y-axis-2',
      gridLines: {
        display: false
      },
      labels: {
        show: true
      }
    }]
  }
};

exports.default = _react2.default.createClass({
  displayName: 'MixExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Mixed data Example'
      ),
      _react2.default.createElement(_reactChartjs.Bar, {
        data: data,
        options: options
      })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
		labels: ['Red', 'Green', 'Yellow'],
		datasets: [{
				data: [300, 50, 100],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
		}]
};

exports.default = _react2.default.createClass({
		displayName: 'PieExample',

		render: function render() {
				return _react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
								'h2',
								null,
								'Pie Example'
						),
						_react2.default.createElement(_reactChartjs.Pie, { data: data })
				);
		}
});

},{"react":undefined,"react-chartjs-2":undefined}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  datasets: [{
    data: [11, 16, 7, 3, 14],
    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
    label: 'My dataset' // for legend
  }],
  labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue']
};

exports.default = _react2.default.createClass({
  displayName: 'PolarExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Polar Example'
      ),
      _react2.default.createElement(_reactChartjs.Polar, { data: data })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = {
  labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgba(179,181,198,0.2)',
    borderColor: 'rgba(179,181,198,1)',
    pointBackgroundColor: 'rgba(179,181,198,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(179,181,198,1)',
    data: [65, 59, 90, 81, 56, 55, 40]
  }, {
    label: 'My Second dataset',
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    pointBackgroundColor: 'rgba(255,99,132,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(255,99,132,1)',
    data: [28, 48, 40, 19, 96, 27, 100]
  }]
};

exports.default = _react2.default.createClass({
  displayName: 'RadarExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Radar Example'
      ),
      _react2.default.createElement(_reactChartjs.Radar, { data: data })
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require('react-chartjs-2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'My First dataset',
    fill: false,
    lineTension: 0.1,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: 'rgba(75,192,192,1)',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: [65, 59, 80, 81, 56, 55, 40]
  }]
};

var Graph = _react2.default.createClass({
  displayName: 'Graph',
  componentWillMount: function componentWillMount() {
    this.setState(initialState);
  },
  componentDidMount: function componentDidMount() {

    var _this = this;

    setInterval(function () {
      var oldDataSet = _this.state;
      var newData = [];

      for (var x = 0; x < _this.state.labels.length; x++) {
        newData.push(Math.floor(Math.random() * 100));
      }

      var newDataSet = Object.assign({}, oldDataSet);
      newDataSet.data = newData;

      _this.setState({ datasets: [newDataSet] });
    }, 5000);
  },
  render: function render() {
    return _react2.default.createElement(_reactChartjs.Line, { data: this.state });
  }
});

exports.default = _react2.default.createClass({
  displayName: 'RandomizedDataLineExample',

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'h2',
        null,
        'Random Animated Line Example'
      ),
      _react2.default.createElement(Graph, null)
    );
  }
});

},{"react":undefined,"react-chartjs-2":undefined}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _doughnut = require('./components/doughnut');

var _doughnut2 = _interopRequireDefault(_doughnut);

var _dynamicDoughnut = require('./components/dynamic-doughnut');

var _dynamicDoughnut2 = _interopRequireDefault(_dynamicDoughnut);

var _pie = require('./components/pie');

var _pie2 = _interopRequireDefault(_pie);

var _line = require('./components/line');

var _line2 = _interopRequireDefault(_line);

var _bar = require('./components/bar');

var _bar2 = _interopRequireDefault(_bar);

var _horizontalBar = require('./components/horizontalBar');

var _horizontalBar2 = _interopRequireDefault(_horizontalBar);

var _radar = require('./components/radar');

var _radar2 = _interopRequireDefault(_radar);

var _polar = require('./components/polar');

var _polar2 = _interopRequireDefault(_polar);

var _bubble = require('./components/bubble');

var _bubble2 = _interopRequireDefault(_bubble);

var _mix = require('./components/mix');

var _mix2 = _interopRequireDefault(_mix);

var _randomizedLine = require('./components/randomizedLine');

var _randomizedLine2 = _interopRequireDefault(_randomizedLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
	}

	_createClass(App, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_doughnut2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_dynamicDoughnut2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_pie2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_line2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_bar2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_horizontalBar2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_radar2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_polar2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_bubble2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_mix2.default, null),
				_react2.default.createElement('hr', null),
				_react2.default.createElement(_randomizedLine2.default, null)
			);
		}
	}]);

	return App;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app'));

},{"./components/bar":1,"./components/bubble":2,"./components/doughnut":3,"./components/dynamic-doughnut":4,"./components/horizontalBar":5,"./components/line":6,"./components/mix":7,"./components/pie":8,"./components/polar":9,"./components/radar":10,"./components/randomizedLine":11,"react":undefined,"react-dom":undefined}]},{},[12]);

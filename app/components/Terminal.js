import React, { PropTypes, Component } from 'react';
import { lib, hterm } from 'hterm-umdjs';
import { Row, Col } from 'antd';
import {
  emit,
  init,
  terminalConnect,
  terminalDisconnect,
  clearClientTerminal,
  closeTerminalClient
} from '../actions/terminal.action';
import { connect } from 'react-redux';
import TOPICS from '../constants/topics';
const defaultStyle = {
  marginLeft: 20
};
const terminalDefaultStyle = {
  display: 'block',
  position: 'relative',
  width: '88vw',
  height: '90vh'
};
// const terminalStyle = {
//   width: '80%',
//   height: '90%',
//   position: 'absolute',
//   left: '20%'
// };

// /////////////////////////////////////

// ////////////////////////////////////////////////////
class Terminal extends Component {
  constructor(props, context) {
    super(props, context);
    this.term = null;
     this.prevCloseState= this.props.terminal.isClose;
    if (!this.prevCloseState) {
      this.runHterm();
      this.props.terminalConnect(this.props.initTermnialConnection);
    }
  
    this.props.init();
    this.terminalStyle = props.customStyle?props.customStyle:terminalDefaultStyle
  }

  componentDidMount() { }

  shouldComponentUpdate({ terminal, isClose,initTermnialConnection }, nextState) {
    if (terminal.data) {
      if(this.term){
          // console.log(`new data arrived from server: ${terminal}`);
      this.term.io.print(terminal.data);
      }
    
    }
    if (this.prevCloseState !== terminal.isClose) {
      if (!this.prevCloseState) {
        this.term = null;
        this.props.terminalDisconnect();
 //       this.props.clearClientTerminal();
      } else {
        this.runHterm();
        this.props.terminalConnect(initTermnialConnection);
      }
       this.prevCloseState = terminal.isClose;
       console.log(`is component close = ${this.prevCloseState}`);
    }
   
    
    

    // if (nextProps.commands.incommingCommand != {}) {
    //   console.log(`!!!!${nextState} - ${nextProps} is incoming`);
    // } else {
    //   console.log(`!!!!${nextState} - ${nextProps} is someting else`);
    // }

    return false;
  }

  _onTerminalResize(col, row) {
    // this._sendString( { col: col, row: row });
    this.props.commandsActions.resize({ col, row });
    //  socket.emit('resize', { col: col, row: row });
  }

  runHterm() {
    // var self = this;
    lib.init(() => {
      console.log('Hi');
      hterm.defaultStorage = new lib.Storage.Local();
      this.term = new hterm.Terminal();
      window.term = this.term;
      this.term.decorate(document.getElementById('terminal'));

      // self.term.setCursorPosition(0, 0);
      // self.term.setCursorVisible(true);
      // self.term.prefs_.set('ctrl-c-copy', true);
      // self.term.prefs_.set('ctrl-v-paste', true);
      // self.term.prefs_.set('use-default-window-copy', true);
      //  this.term.prefs_.set('cursor-blink', true);
      this.term.prefs_.set('background-color', 'black');
      this.term.prefs_.set('foreground-color', 'white');
      this.term.prefs_.set('cursor-color', 'white');
      this.term.prefs_.set('cursor-blink', true);
      this.term.onTerminalReady = () => {
        this.props.emit({ data: 'Mmhy6hy6' + '\u000D' });
        //this.props.emit({ data: `${this.props.modal.command}\u000D` });
        this.props.emit({ data: `${this.props.inlineCommand}\u000D` });

        var io = this.term.io.push();
        this.term.installKeyboard();
        //  this.term.io.println('Print a string without a newline');
        //  this.term.io.println('Print a string and add CRLF');
        let tempStr = '';
        io.onVTKeystroke = (str) => {
          if (str == '\u000D') {
            //     this.term.io.println('');
          } else {
            //     this.term.io.print(str);
            //     tempStr += str;
          }

          console.log(`onVTKeystroke - ${JSON.stringify(str)} `);
          this.props.emit({ data: str });
        };

        io.sendString = (str) => {
          console.log(`sendString - ${str} `);
        };

        io.onTerminalResize = (columns, rows) => {
          console.log(`onTerminalResize - ${columns} x ${rows} `);
        };
      };
    });
  }

  getChildContext() {
    //    return {  muiTheme: Styles.ThemeManager.getMuiTheme(MyRawTheme)};
  }

  render() {
    return <div id="terminal" style={this.terminalStyle} />;
  }
  componentWillUnmount() {
    this.props.terminalDisconnect();
    this.props.closeTerminalClient();
    this.term = null;
    console.log('terminal component is unmount')
  }
}

Terminal.propTypes = {};

const mapStateToProps = (state, ownedProps) => ({
  terminal: state.terminal,
  modal: state.modal,
  isClose: ownedProps.isClose,
  inlineCommand:ownedProps.inlineCommand,
  customStyle:ownedProps.customStyle,
  forceRestart:ownedProps.forceRestart,
  initTermnialConnection:ownedProps.initTermnialConnection,
});

export default connect(mapStateToProps, {
  emit,
  init,
  terminalDisconnect,
  terminalConnect,
  clearClientTerminal,
  closeTerminalClient
})(Terminal);

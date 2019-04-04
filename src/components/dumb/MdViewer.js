import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { sideBarOpen, sideBarClose } from '../../actions/sideBar.action';
import { Card, Button } from 'antd';
import { connect } from 'react-redux';
import sideBarTypes from '../../constants/sideBarTypes';
import 'react-mde/lib/styles/css/react-mde-all.css';
import ReadmeViewerCodeHighlight from './ReadmeViewerCodeHighlight';

const MdViewer = props => (
  // eslint-disable-next-line react/prop-types
  <Card
    style={{ maxWidth: '80vw' }}
    title={props.name}
    extra={
      <Button onClick={() => props.sideBarOpen({ data: props.readme, contentType: sideBarTypes.ALGORITHM, type: sideBarTypes.ALGORITHM, name: props.name, readmeType: props.readmeType })}>Edit</Button>
    }
  >
    <div>
      <ReactMarkdown
        source={props.readme}
        renderers={{
          code: ReadmeViewerCodeHighlight,
          inlineCode: ReadmeViewerCodeHighlight
        }}
      />
    </div>
  </Card>
);

MdViewer.propTypes = {
  readme: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  readmeType: PropTypes.string
  // sideBarOpen:PropTypes.func.isRequired
};

export default connect(
  null,
  { sideBarOpen, sideBarClose }
)(MdViewer);

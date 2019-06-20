import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Card, Button } from 'antd';
import DrawerContainer from 'components/containers/drawer/DrawerContainer.react';
import MDContentSwitcherReact from 'components/containers/md/MDContentSwitcher.react';

const MDViewer = props => (
  <Card
    size="small"
    title={props.name}
    extra={
      <DrawerContainer
        opener={onVisible => (
          <Button onClick={() => onVisible(prev => !prev)}>Edit</Button>
        )}
      >
        <MDContentSwitcherReact
          readme={props.readme}
          name={props.name}
          readmeType={props.readmeType}
        />
      </DrawerContainer>
    }
  >
    <ReactMarkdown source={props.readme} />
  </Card>
);

MDViewer.propTypes = {
  readme: PropTypes.string.isRequired,
  name: PropTypes.string,
  readmeType: PropTypes.string
};

export default MDViewer;

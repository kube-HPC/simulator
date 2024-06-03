import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from 'antd';
import MdEditor from 'components/common/Markdown/MdEditor';
import addPipelineTemplate from 'config/template/addPipeline.template';
import { stringify } from 'utils/stringHelper';
import { SB_SECTIONS } from 'const';
import Drawer from 'components/Drawer';
import DrawerEditorMD from './../../../Drawer/DrawerEditor.react';

export default {
  title: `${SB_SECTIONS.MARKDOWN}Markdown Editor`,
};

const source = `An **example** of writing a _markdown_`;

const config = { message: 'Update Algorithm' };

export const Default = () => <MdEditor value={source} />;
export const Empty = () => <MdEditor value={undefined} config={config} />;

export const InDrawer = () => (
  <Drawer open>
    <MdEditor value={source} />
  </Drawer>
);

const Opener = ({ setVisible }) => (
  <Button onClick={setVisible}>Open Drawer</Button>
);

export const DrawerEditorComponent = () => (
  <DrawerEditorMD
    title="Update Pipeline"
    description={
      <>
        Edit pipeline properties and{' '}
        <Typography.Text code>Update</Typography.Text>
      </>
    }
    valueString={stringify(addPipelineTemplate)}
    submitText="Update"
    opener={Opener}
  />
);
Opener.propTypes = {
  setVisible: PropTypes.oneOfType(PropTypes.func).isRequired,
};

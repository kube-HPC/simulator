import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/no-fill/add-algorithm.svg';
import { ReactComponent as IconDataSource } from 'images/datasource.svg';
import { RIGHT_SIDEBAR_NAMES } from 'const';

const iconSize = { width: '10px', fontSize: '10px' };

export const topActions = [
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_PIPELINE,
    component: IconAddPipeline,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM,
    component: IconAddAlgorithm,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE,
    component: IconDataSource,
  },
];

const NewButtonSelect = () => {
  const location = useLocation();
  const { pageName } = useParams();

  const items = [
    {
      key: RIGHT_SIDEBAR_NAMES.ADD_PIPELINE,
      label: (
        <Link
          to={{
            pathname: `${pageName}/${RIGHT_SIDEBAR_NAMES.ADD_PIPELINE}`,
            search: location.search,
          }}>
          Pipeline
        </Link>
      ),
      icon: <IconAddPipeline style={iconSize} />,
    },
    {
      key: RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM,
      label: (
        <Link
          to={{
            pathname: `${pageName}/${RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM}`,
            search: location.search,
          }}>
          Algorethem
        </Link>
      ),
      icon: <IconAddAlgorithm style={iconSize} />,
    },

    {
      key: RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE,
      label: (
        <Link
          to={{
            pathname: `${pageName}/${RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE}`,
            search: location.search,
          }}>
          Data Source
        </Link>
      ),
      icon: <IconDataSource style={iconSize} />,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button>+ New </Button>
    </Dropdown>
  );
};

NewButtonSelect.propTypes = {
  // sectionName: PropTypes.string.isRequired,
};

export default NewButtonSelect;

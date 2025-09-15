import React, { useCallback } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Dropdown } from 'antd';
import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { ReactComponent as IconAddAlgorithm } from 'images/algorithm-icon.svg';
import { ReactComponent as IconAddMarketplace } from 'images/marketplace.svg';
import { ReactComponent as IconDataSource } from 'images/datasource.svg';
import {
  LEFT_SIDEBAR_NAMES,
  RIGHT_SIDEBAR_NAMES,
  NEW_ITEM,
  NEW_ITEM_PAGE,
} from 'const';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';

const WapperDropDown = styled.div`
  display: flex;
`;

const iconSize = { width: '10px', fontSize: '10px' };
const removeLeftRaduse = {
  borderTopLeftRadius: '0px',
  borderBottomLeftRadius: '0px',
  marginLeft: '1px',
  width: '30px',
};
const removeRightRaduse = {
  borderTopRightRadius: '0px',
  borderBottomRightRadius: '0px',
};
const centerDownOutlined = { marginLeft: '-5px' };

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
    name: RIGHT_SIDEBAR_NAMES.ADD_MARKETPLACE,
    component: IconAddMarketplace,
  },
  {
    name: RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE,
    component: IconDataSource,
  },
];

const NewButtonSelect = () => {
  const location = useLocation();
  const { pageName } = useParams();
  const navigate = useNavigate();

  const gotoNewAction = useCallback(() => {
    let page = RIGHT_SIDEBAR_NAMES.ADD_PIPELINE;
    if (pageName === NEW_ITEM_PAGE.ALGORITHM) {
      page = RIGHT_SIDEBAR_NAMES.ADD_ALGORITHM;
    } else if (pageName === NEW_ITEM_PAGE.MARKETPLACE) {
      page = RIGHT_SIDEBAR_NAMES.ADD_MARKETPLACE;
    } else if (pageName === NEW_ITEM_PAGE.DATASOURCE) {
      page = RIGHT_SIDEBAR_NAMES.ADD_DATASOURCE;
    }

    navigate(`${pageName}/${page}`);
  }, [navigate, pageName]);

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
          Algorithm
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

  const isButtonNew =
    pageName !== LEFT_SIDEBAR_NAMES.JOBS &&
    pageName !== LEFT_SIDEBAR_NAMES.QUEUE;
  return (
    <WapperDropDown>
      {isButtonNew && (
        <Button
          type="primary"
          onClick={gotoNewAction}
          style={removeRightRaduse}>
          New {NEW_ITEM[pageName]}
        </Button>
      )}
      <Dropdown
        menu={{ items }}
        placement={isButtonNew ? 'bottomRight' : 'bottomLeft'}>
        <Button type="primary" style={isButtonNew ? removeLeftRaduse : null}>
          {isButtonNew ? (
            <DownOutlined style={centerDownOutlined} />
          ) : (
            <PlusOutlined />
          )}
          {!isButtonNew && 'New'}
        </Button>
      </Dropdown>
    </WapperDropDown>
  );
};

NewButtonSelect.propTypes = {
  // sectionName: PropTypes.string.isRequired,
};

export default NewButtonSelect;

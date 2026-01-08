// DebouncedRoute.js
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Drawer as SiderBarRightDrawer } from './SidebarRight';

const DebouncedRoute = ({ exact, path }) => {
  const navigate = useNavigate();

  // Debounce the history push function to prevent rapid route changes
  const debouncedPush = debounce(navigate, 1000, { leading: true });

  const handleRouteChange = gPath => {
    debouncedPush(gPath);
  };

  return (
    <Route
      exact={exact}
      path={path}
      render={props => (
        <SiderBarRightDrawer {...props} onRouteChange={handleRouteChange} />
      )}
    />
  );
};

export default DebouncedRoute;
DebouncedRoute.propTypes = {
  exact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
};

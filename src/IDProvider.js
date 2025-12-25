import React, { isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';

const IDProvider = ({ dataTestId, testIdSuffix, children }) => {
  const childArray = React.Children.toArray(children);
  if (childArray.length !== 1) {
    throw new Error('IDProvider should have exactly one child component');
  }

  const child = childArray[0];
  if (!isValidElement(child)) {
    throw new Error('IDProvider child must be a valid React element');
  }

  let combinedId = dataTestId;
  if (testIdSuffix) {
    combinedId = `${dataTestId}-${testIdSuffix}`;
  }

  const childWithTestId = cloneElement(child, { 'data-testid': combinedId });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{childWithTestId}</>;
};

IDProvider.propTypes = {
  dataTestId: PropTypes.string,
  testIdSuffix: PropTypes.string,
  children: PropTypes.object.isRequired,
};

export default IDProvider;

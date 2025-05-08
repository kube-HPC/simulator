import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';

const AuditTrailAvatar = ({ auditTrail }) => {
  const safeAuditTrail = Array.isArray(auditTrail) ? auditTrail : [];

  const lastEntry = safeAuditTrail[safeAuditTrail.length - 1];
  const username = lastEntry?.user || null;

  return (
    <UserAvatar
      username={username}
      size={20}
      titleToolTip={`create by ${username}`}
    />
  );
};

AuditTrailAvatar.propTypes = {
  auditTrail: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string,
    })
  ),
};

AuditTrailAvatar.defaultProps = {
  auditTrail: [],
};

export default AuditTrailAvatar;

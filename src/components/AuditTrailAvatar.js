import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';

const AuditTrailAvatar = ({ auditTrail = [] }) => {
  const safeAuditTrail = Array.isArray(auditTrail) ? auditTrail : [];

  const lastEntry = safeAuditTrail[safeAuditTrail.length - 1];
  const username = lastEntry?.user || null;

  return (
    <UserAvatar
      username={username}
      size={20}
      titleToolTip={username ? `create by ${username}` : undefined}
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
// Ensure we don't have defaultProps on a function component — React will warn
// in future releases. We already use a default parameter in the signature.
if (AuditTrailAvatar.defaultProps) delete AuditTrailAvatar.defaultProps;

export default AuditTrailAvatar;

import React from 'react';

export default ({title, handleClick, cls}) => <button className={cls} onClick={handleClick}>{title}</button>

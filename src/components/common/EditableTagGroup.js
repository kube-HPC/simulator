import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { isArray } from 'lodash';
import styled from 'styled-components';

const convertToValueArray = val => {
  if (!isArray(val)) {
    return JSON.parse(val);
  }

  return val;
};
const TagPlus = styled(Tag)`
  border-radius: 1em;
  background: #1890ff;
  color: #ffffff;
  font-size: 15px;

  border: 1px solid #1890ff;
`;
const InputStyle = styled(Input)`
  width: 70px;
`;

const ItemBox = styled.div`
  min-height: 32px;
  padding: 3px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
`;
const EditableTagGroup = ({ value, onChange, duplicateValue }) => {
  const saveInputRef = useRef(null);
  const saveEditInputRef = useRef(null);

  const [tags, setTags] = useState(convertToValueArray(value) || []);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  useEffect(() => {
    if (inputVisible) saveInputRef.current.focus();
  }, [inputVisible]);

  useEffect(() => {
    onChange?.(tags);
  }, [tags]);

  const handleClose = removedTag => {
    const arrayTags = tags.filter(tag => tag !== removedTag);
    setTags(arrayTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = e => {
    const itemValue = e.target.value;
    setInputValue(parseInt(itemValue, 10) || itemValue);
  };

  const handleInputConfirm = () => {
    if (duplicateValue) {
      setTags([...tags, parseInt(inputValue, 10) || inputValue]);
    } else if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, parseInt(inputValue, 10) || inputValue]);
    }

    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = e => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;

    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  return (
    <ItemBox>
      {tags?.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <InputStyle
              ref={saveEditInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag}
            closable
            onClose={() => handleClose(tag)}>
            <span
              onDoubleClick={e => {
                setEditInputIndex(index);
                setEditInputValue(tag);

                saveEditInputRef.current.focus();
                e.preventDefault();
              }}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <InputStyle
          ref={saveInputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <TagPlus className="site-tag-plus" onClick={showInput}>
          <PlusOutlined />
        </TagPlus>
      )}
    </ItemBox>
  );
};

EditableTagGroup.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  duplicateValue: PropTypes.bool,
};

EditableTagGroup.defaultProps = {
  value: [],
  duplicateValue: false,
  onChange: () => {},
};

export default EditableTagGroup;

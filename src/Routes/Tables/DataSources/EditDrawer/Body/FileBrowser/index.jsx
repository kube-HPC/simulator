import React, {
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useReducer,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'react-arborist';
import { Button, Empty } from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  FolderAddOutlined,
  FolderFilled,
  FolderOpenFilled,
  RightOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { COLOR, COLOR_LAYOUT } from 'styles';
import useFileMap from './useFileMap';

const ROOT_ID = '/';

const BrowserShell = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 320px;
  margin-bottom: 1em;
  border: 1px solid ${COLOR_LAYOUT.border};
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

const Toolbar = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75em;
  padding: 0.75em 1em;
  border-bottom: 1px solid ${COLOR_LAYOUT.border};
  background: #fafafa;
`;

const ToolbarGroup = styled.section`
  display: flex;
  align-items: center;
  gap: 0.5em;
  min-width: 0;
`;

const Crumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35em;
  min-width: 0;
  flex-wrap: wrap;
`;

const CrumbButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  color: ${COLOR.blue2};
  cursor: pointer;
  font: inherit;

  &:disabled {
    color: ${COLOR_LAYOUT.text};
    cursor: default;
  }
`;

const TreeContainer = styled.section`
  flex: 1;
  min-height: 240px;
`;

const NodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  height: 100%;
  padding: 0 0.75em;
  background: ${props => (props.$selected ? '#e6f4ff' : 'transparent')};
  border-left: 3px solid
    ${props => (props.$selected ? COLOR.blue2 : 'transparent')};
  color: ${props => (props.$dimmed ? '#8c8c8c' : 'inherit')};
`;

const ToggleButton = styled.button`
  border: 0;
  background: transparent;
  width: 16px;
  padding: 0;
  color: #8c8c8c;
  cursor: pointer;
`;

const NameButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
  color: inherit;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  font-size: 12px;
  color: #8c8c8c;
  flex-shrink: 0;
`;

const EmptyState = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const useElementSize = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
};

const formatBytes = bytes => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let nextValue = bytes;
  let unitIndex = 0;
  while (nextValue >= 1024 && unitIndex < units.length - 1) {
    nextValue /= 1024;
    unitIndex += 1;
  }
  const precision = nextValue >= 10 || unitIndex === 0 ? 0 : 1;
  return `${nextValue.toFixed(precision)} ${units[unitIndex]}`;
};

const resolveSubDir = (dir, mapping) =>
  dir.childrenIds
    .map(child => {
      const entry = mapping[child];
      return entry?.isDir ? resolveSubDir(entry, mapping) : entry;
    })
    .filter(Boolean)
    .flat();

const collectFiles = (entries, mapping) =>
  entries
    .filter(entry => entry.uploadedAt || entry.isDir)
    .map(entry => (entry.isDir ? resolveSubDir(entry, mapping) : entry))
    .flat();

const isInsideTree = (targetFolderId, draggedId, mapping) => {
  let cursor = mapping[targetFolderId];
  while (cursor) {
    if (cursor.id === draggedId) return true;
    cursor = cursor.parentId ? mapping[cursor.parentId] : null;
  }
  return false;
};

const TreeNode = ({ node, style, dragHandle, onActivate }) => {
  const entry = node.data;
  const isDir = Boolean(entry.isDir);
  const handleActivate = () => onActivate(node);

  return (
    <NodeRow
      style={style}
      ref={dragHandle}
      $selected={node.isSelected}
      $dimmed={!entry.uploadedAt && !isDir}
      onClick={node.handleClick}>
      {isDir ? (
        <ToggleButton
          type="button"
          onClick={event => {
            event.stopPropagation();
            node.toggle();
          }}>
          <RightOutlined rotate={node.isOpen ? 90 : 0} />
        </ToggleButton>
      ) : (
        <span style={{ width: 16 }} />
      )}
      {isDir ? (
        node.isOpen ? (
          <FolderOpenFilled />
        ) : (
          <FolderFilled />
        )
      ) : (
        <FileOutlined />
      )}
      <NameButton type="button" onDoubleClick={handleActivate}>
        {entry.name}
      </NameButton>
      {!isDir && <Meta>{formatBytes(entry.size)}</Meta>}
    </NodeRow>
  );
};

TreeNode.propTypes = {
  dragHandle: PropTypes.func,
  node: PropTypes.shape({
    data: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
};

/**
 * @typedef {import('antd/lib/upload/interface').UploadFile}
 *
 * @typedef {import('./stratifier').FlatFile} FlatFile
 *
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 *
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 *
 * @typedef {import('./stratifier').StratifiedMap} StratifiedMap
 *
 * @typedef {FlatFile & {
 *   id: string;
 *   isDir?: boolean;
 *   parentId?: string;
 *   childrenIds?: string[];
 * }} CustomFileData
 *
 * @typedef {{
 *   [fileId: string]: CustomFileData;
 * }} CustomFileMap
 *
 * @typedef {{
 *   ls: () => FlatFile[];
 *   getDeleteFiles: () => string[];
 *   getCWD: () => string;
 *   addFile: (file: UploadFile, folderId?: string) => void;
 *   dropFile: (id: string) => void;
 *   resetFileMap: () => void;
 *   toggleFlat: () => void;
 *   getCurrentDirContent: (StratifiedDirectory | StratifiedFile)[];
 * }} RefContent
 */

const FileBrowser = React.forwardRef((props, forwardedRef) => {
  const {
    files: srcFiles = [],
    isReadOnly = false,
    onDownload,
    onDelete = null,
  } = props;
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
    addFile,
    retrieveFiles,
    deletedFiles,
  } = useFileMap(srcFiles);
  const treeRef = useRef();
  const [containerRef, containerSize] = useElementSize();
  const [selectedIds, setSelectedIds] = useState([]);

  const handleDelete = useCallback(
    files => {
      deleteFiles(files);
      onDelete && onDelete(files);
    },
    [deleteFiles, onDelete]
  );

  useEffect(() => {
    if (Array.isArray(srcFiles)) resetFileMap(srcFiles);
  }, [resetFileMap, srcFiles]);

  const [isFlat, toggleFlat] = useReducer(state => !state, false);

  useEffect(() => {
    setSelectedIds([]);
  }, [currentFolderId, isFlat]);

  const currentDirContent = useMemo(() => {
    /** @type {StratifiedDirectory} */
    const currentFolder = fileMap[currentFolderId];
    if (!currentFolder || !currentFolder.childrenIds) return [];
    return currentFolder.childrenIds
      .map(fileId => fileMap[fileId] ?? null)
      .filter(file => file && !file.isHidden);
  }, [currentFolderId, fileMap]);

  const files = useMemo(() => {
    if (isFlat) {
      return Object.values(fileMap).filter(
        file => !file.isDir && !file.isHidden
      );
    }
    return currentDirContent;
  }, [currentDirContent, fileMap, isFlat]);

  const buildTreeData = useCallback(
    folderId => {
      const folder = fileMap[folderId];
      if (!folder?.isDir || !folder.childrenIds) return [];
      return folder.childrenIds
        .map(childId => fileMap[childId] ?? null)
        .filter(entry => entry && !entry.isHidden)
        .map(entry =>
          entry.isDir
            ? {
                ...entry,
                children: buildTreeData(entry.id),
              }
            : { ...entry }
        );
    },
    [fileMap]
  );

  const treeData = useMemo(() => {
    if (isFlat) {
      return files.map(file => ({ ...file }));
    }
    return buildTreeData(currentFolderId);
  }, [buildTreeData, currentFolderId, files, isFlat]);

  const folderChain = useMemo(() => {
    const getParent = folder =>
      !folder?.parentId
        ? [folder]
        : [...getParent(fileMap[folder.parentId]), folder];

    return getParent(fileMap[currentFolderId]);
  }, [currentFolderId, fileMap]);

  const getCWD = () =>
    folderChain.length === 1
      ? '/'
      : folderChain
          .map(item => item.name)
          .join('/')
          .slice(1);

  const selectedEntries = useCallback(
    () => selectedIds.map(id => fileMap[id] ?? null).filter(Boolean),
    [fileMap, selectedIds]
  );

  const handleDownloadSelected = useCallback(() => {
    const downloadableIds = collectFiles(selectedEntries(), fileMap).map(
      file => file.id
    );
    if (downloadableIds.length) onDownload(downloadableIds);
  }, [fileMap, onDownload, selectedEntries]);

  const handleDeleteSelected = useCallback(() => {
    const selectedFiles = selectedEntries();
    if (selectedFiles.length) handleDelete(selectedFiles);
  }, [handleDelete, selectedEntries]);

  const handleCreateFolder = useCallback(() => {
    // eslint-disable-next-line no-alert
    const folderName = window.prompt('Enter a name for your new folder:');
    if (folderName) createFolder(folderName);
  }, [createFolder]);

  const handleActivate = useCallback(
    node => {
      const entry = fileMap[node.id];
      if (!entry) return;
      if (entry.isDir) {
        setCurrentFolderId(entry.id);
        return;
      }
      if (entry.uploadedAt) onDownload([entry.id]);
    },
    [fileMap, onDownload, setCurrentFolderId]
  );

  const handleMove = useCallback(
    ({ dragNodes, parentId }) => {
      const destinationId = parentId ?? currentFolderId;
      /** @type {StratifiedDirectory} */
      const destination = fileMap[destinationId];
      if (!destination || !destination.isDir) return;

      const bySource = dragNodes.reduce((acc, treeNode) => {
        const item = fileMap[treeNode.id];
        if (!item) return acc;
        const sourceId = item.parentId ?? currentFolderId;
        return {
          ...acc,
          [sourceId]: (acc[sourceId] ?? []).concat(item),
        };
      }, {});

      Object.entries(bySource).forEach(([sourceId, movedItems]) => {
        /** @type {StratifiedDirectory} */
        const source = fileMap[sourceId];
        if (sourceId === destinationId) return;
        if (source && source.isDir) moveFiles(movedItems, source, destination);
      });
    },
    [currentFolderId, fileMap, moveFiles]
  );

  const disableDrop = useCallback(
    ({ parentNode, dragNodes }) => {
      const destinationId = parentNode?.id ?? currentFolderId;
      return dragNodes.some(node =>
        isInsideTree(destinationId, node.id, fileMap)
      );
    },
    [currentFolderId, fileMap]
  );

  useImperativeHandle(
    forwardedRef,
    /** @type {() => RefContent} */
    () => ({
      ls: retrieveFiles,
      getDeleteFiles: () => deletedFiles,
      getCWD,
      addFile: (file, folderId = currentFolderId, path = getCWD()) => {
        addFile({ file, folderId, path });
      },
      dropFile: id => {
        deleteFiles([fileMap[id]]);
      },
      resetFileMap,
      toggleFlat,
      getCurrentDirContent: () => currentDirContent,
    })
  );

  const selectionCount = selectedIds.length;
  const showBackButton = currentFolderId !== ROOT_ID;

  return (
    <BrowserShell>
      <Toolbar>
        <ToolbarGroup>
          <Button
            icon={<ArrowLeftOutlined />}
            disabled={!showBackButton}
            onClick={() => {
              const parentId = fileMap[currentFolderId]?.parentId ?? ROOT_ID;
              setCurrentFolderId(parentId);
            }}
          />
          <Crumbs>
            {folderChain.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <RightOutlined style={{ fontSize: 10 }} />}
                <CrumbButton
                  type="button"
                  disabled={index === folderChain.length - 1}
                  onClick={() => setCurrentFolderId(item.id)}>
                  {item.name}
                </CrumbButton>
              </React.Fragment>
            ))}
          </Crumbs>
        </ToolbarGroup>
        <ToolbarGroup>
          <Button
            icon={<DownloadOutlined />}
            disabled={selectionCount === 0}
            onClick={handleDownloadSelected}>
            Download
          </Button>
          {!isReadOnly && (
            <>
              <Button icon={<FolderAddOutlined />} onClick={handleCreateFolder}>
                New Folder
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectionCount === 0}
                onClick={handleDeleteSelected}>
                Delete
              </Button>
            </>
          )}
        </ToolbarGroup>
      </Toolbar>
      <TreeContainer ref={containerRef}>
        {containerSize.height > 0 && treeData.length > 0 ? (
          <Tree
            ref={treeRef}
            data={treeData}
            width={containerSize.width || '100%'}
            height={Math.max(containerSize.height, 240)}
            indent={20}
            rowHeight={32}
            openByDefault
            selectionFollowsFocus
            disableDrag={isReadOnly}
            disableDrop={isReadOnly ? true : disableDrop}
            disableMultiSelection={false}
            onActivate={handleActivate}
            onSelect={nodes => setSelectedIds(nodes.map(node => node.id))}
            onMove={handleMove}>
            {nodeProps => (
              <TreeNode {...nodeProps} onActivate={handleActivate} />
            )}
          </Tree>
        ) : (
          <EmptyState>
            <Empty
              description="No files"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </EmptyState>
        )}
      </TreeContainer>
    </BrowserShell>
  );
});

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      isDir: PropTypes.bool,
    })
  ),
  onDownload: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  onDelete: PropTypes.func,
};

FileBrowser.displayName = 'FileBrowser';

export default FileBrowser;

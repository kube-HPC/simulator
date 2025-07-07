import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Typography } from 'antd';

const flattenObject = (obj, prefix = '') =>
  Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, fullKey));
    } else {
      acc[fullKey] = value;
    }
    return acc;
  }, {});

const formatValue = (val, color) => {
  if (typeof val === 'object') {
    return (
      <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color }}>
        {JSON.stringify(val, null, 2)}
      </pre>
    );
  }
  return (
    <Typography.Text style={{ whiteSpace: 'pre-wrap', margin: 0, color }}>
      {String(val)}
    </Typography.Text>
  );
};

const compareNodes = (nodes1 = [], nodes2 = []) => {
  const map2 = new Map(nodes2.map(node => [node.nodeName, node]));
  const results = [];

  nodes1.forEach(node1 => {
    const name = node1.nodeName;
    const node2 = map2.get(name);

    if (!node2) {
      // Node not found in second JSON
      results.push({
        key: `missing-${name}`,
        prop: `pipeline.nodes["${name}"]`,
        val1: name,
        val2: '----------',
      });
    } else {
      // Compare properties in matching nodes
      const flat1 = flattenObject(node1, `pipeline.nodes["${name}"]`);
      const flat2 = flattenObject(node2, `pipeline.nodes["${name}"]`);

      const allKeys = new Set([...Object.keys(flat1), ...Object.keys(flat2)]);
      [...allKeys].forEach(key => {
        const v1 = flat1[key];
        const v2 = flat2[key];
        if (JSON.stringify(v1) !== JSON.stringify(v2)) {
          results.push({
            key: `${name}-${key}`,
            prop: key,
            val1: v1,
            val2: v2,
          });
        }
      });
    }
  });

  // Check for nodes in json2 that are not in json1
  const map1 = new Set(nodes1.map(node => node.nodeName));
  nodes2.forEach(node2 => {
    if (!map1.has(node2.nodeName)) {
      results.push({
        key: `extra-${node2.nodeName}`,
        prop: `pipeline.nodes["${node2.nodeName}"]`,
        val1: '----------',
        val2: node2.nodeName,
      });
    }
  });

  return results;
};

const JsonDiffTable = ({ json1, json2, currentCompareProp }) => {
  const dataSource = useMemo(() => {
    const flat1 = flattenObject(json1);
    const flat2 = flattenObject(json2);

    /*
      remove props from table (version,semver,created,modified)
    */
    delete flat1.version;
    delete flat1.semver;
    delete flat1.created;
    delete flat1[`${currentCompareProp}.modified`];
    delete flat1[`${currentCompareProp}.version`];

    delete flat2.version;
    delete flat2.semver;
    delete flat2.created;
    delete flat2[`${currentCompareProp}.modified`];
    delete flat2[`${currentCompareProp}.version`];

    // set keys in SET
    const allKeys = new Set([...Object.keys(flat1), ...Object.keys(flat2)]);

    const differences = [...allKeys].filter(key => {
      if (key.startsWith('pipeline.nodes')) {
        return false;
      }
      return JSON.stringify(flat1[key]) !== JSON.stringify(flat2[key]);
    });

    const diffRows = differences.map((key, index) => ({
      key: `diff-${index}`,
      prop: key,
      val1: flat1[key],
      val2: flat2[key],
    }));

    // compare pipeline.nodes arrays
    const nodeDiffs = compareNodes(
      json1?.pipeline?.nodes,
      json2?.pipeline?.nodes
    );

    return [...diffRows, ...nodeDiffs];
  }, [currentCompareProp, json1, json2]);

  const columns = useMemo(() => {
    const currentComparePropJson1 = json1[currentCompareProp];
    const currentComparePropJson2 = json2[currentCompareProp];

    // eslint-disable-next-line react/no-unknown-property
    const version1 =
      (
        <HeaderTable
          modified={currentComparePropJson1.modified}
          createdBy={json1.createdBy}
          versionName={json1.versionName || ''}
          idKey={json1.version}
        />
      ) || '';

    // eslint-disable-next-line react/no-unknown-property
    const version2 =
      (
        <HeaderTable
          modified={currentComparePropJson2.modified}
          createdBy={json2.createdBy}
          versionName={json2.versionName || ''}
          idKey={json2.version}
        />
      ) || '';

    return [
      {
        title: '',
        dataIndex: 'prop',
        key: 'prop',
        width: '20%',
      },
      {
        title: version1,
        dataIndex: 'val1',
        key: 'val1',
        render: val => formatValue(val, 'red'),
      },
      {
        title: version2,
        dataIndex: 'val2',
        key: 'val2',
        render: val => formatValue(val, 'green'),
      },
    ];
  }, [json1, currentCompareProp, json2]);

  return <Table columns={columns} dataSource={dataSource} pagination={false} />;
};

JsonDiffTable.propTypes = {
  json1: PropTypes.object.isRequired,
  json2: PropTypes.object.isRequired,
  currentCompareProp: PropTypes.string.isRequired,
};

export default JsonDiffTable;

const HeaderTable = ({ modified, createdBy, versionName, idKey }) => {
  const formattedDate = new Date(Number(modified)).toLocaleString();

  return (
    <div>
      {formattedDate}
      <br />
      CreatedBy : {createdBy}
      <br />
      VersionName: {versionName}
      <br />
      Version : {idKey}
      <br />
    </div>
  );
};

HeaderTable.propTypes = {
  modified: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  versionName: PropTypes.string.isRequired,
  idKey: PropTypes.string.isRequired,
};

import React from 'react';
import { Switch, Table, Select, Input, Col } from 'antd';
import { POSITION } from 'appbir-layout';
import Overflow from './overflow.jsx';
import ShowConfig from './showConfig.jsx';

const Option = Select.Option;

const Content = ({ onChange, config, overflow, onOverflow, onShowconfig, showConfig, model, onModel,
  onModelValuesChange, modelWidth, modelHeight }) => {

  const changeEle = (key, value) => {
    onChange(key, value);
  }

  const changeNumber = (key, value) => {
    onChange(key, value.target.value + 'px');
  }

  const changePosition = (key, value) => {
    value = (value != 'DIY') ? (value === 'AUTO') ? '' : value : '0px'
    onChange(key, value);
  }

  let showTableData = [];
  for (let key in config) {
    let data = config[key];
    data.name = key;
    if (key != 'content') {
      showTableData.push(data);
    }
  }
  const isContainFull = (name, isHeight) => ['left', 'right'].indexOf(name) != -1 ? isHeight : !isHeight
  const createPosition = (value, item, index, tag) => {
    let selectValue = POSITION[value];
    let v = value ? (selectValue || 'DIY') : 'AUTO';
    let isFull = isContainFull(item.name, tag === 'height')
    let select = [(<span key={index + '0'} style={{ float: 'left' }}>
      <Select style={{ width: 81 }} disabled={!item.visiabled} onChange={changePosition.bind(this, [item.name, tag])} value={v} >
        {isFull && (<Option value="FULL">FULL</Option>)}
        <Option value="AUTO">AUTO</Option>
        {!isFull && (<Option value="DIY">DIY</Option>)}
      </Select></span>)]
    if (!selectValue && value) {
      select.push(<span style={{ maxWidth: '112px', float: 'left' }} key={index + '1'}><Input disabled={!item.visiabled} type="number" value={parseInt(value.split('px')[0] || '0')} addonAfter="px" onChange={changeNumber.bind(this, [item.name, tag])} /></span>)
    }
    return <div key={index}>{select}</div>;
  }

  // 表头
  const columns = [{ title: 'part', dataIndex: 'name', key: 'name' },
  {
    title: 'enable', dataIndex: 'visiabled', key: 'visiabled',
    render: (text, item) => {
      return <Switch checkedChildren="show" unCheckedChildren="hide" checked={text}
        onChange={changeEle.bind(this, [item.name, 'visiabled'])} />
    },
  },
  {
    title: 'width', dataIndex: 'width', key: 'width',
    render: (text, item, index) => {
      return createPosition(text, item, index, 'width')
    },
  },
  {
    title: 'height', dataIndex: 'height', key: 'height',
    render: (text, item, index) => {
      return createPosition(text, item, index, 'height')
    }
  },
  {
    title: 'fixed', key: 'fixed', dataIndex: 'fixed',
    render: (text, item) => {
      return <Switch disabled={!item.visiabled} checkedChildren="fixed" unCheckedChildren="auto" checked={text}
        onChange={changeEle.bind(this, [item.name, 'fixed'])} />
    }
  },
  {
    title: 'zIndex', key: 'zIndex', dataIndex: 'zIndex',
    render: (text, item) => {
      return <Input disabled={!item.visiabled || !item.fixed} type="number" style={{ maxWidth: "80px" }} value={text} onChange={e => onChange([item.name, 'zIndex'], e.target.value)} />
    }
  }];


  const toNumber = (val) => {
    let s = val.replace('px', '');
    return parseInt(s);
  }

  return (<div>
    <div className="show-main-header">

      {/* <Switch checkedChildren="DIY" unCheckedChildren="FULL" checked={model} onChange={onModel} /> */}

      <Select style={{ width: '81px' }} onChange={onModel} value={model} >
        <Option value="FULL">FULL</Option>
        <Option value="AUTO">AUTO</Option>
        <Option value="DIY">DIY</Option>
      </Select>
      {
        model !== "FULL" ? <Input.Group>
          <Input type="number" addonBefore="width" addonAfter="px" style={{ width: '180px' }} value={toNumber(modelWidth)} onChange={onModelValuesChange.bind(this, 'width')} />
          <Input type="number" addonBefore="height" addonAfter="px" style={{ width: '180px' }} value={toNumber(modelHeight)} onChange={onModelValuesChange.bind(this, 'height')} />
        </Input.Group> : null

      }

      <Switch checkedChildren="overflow" unCheckedChildren="overflow" checked={overflow} onChange={onOverflow} />
      <Switch checkedChildren="json" unCheckedChildren="json" checked={showConfig} onChange={onShowconfig} />

    </div>
    <Table rowKey="name" columns={columns} pagination={false} dataSource={showTableData} />
    {showConfig && <ShowConfig config={config} />}
    {overflow && <Overflow />}
  </div>)
}

export default Content;

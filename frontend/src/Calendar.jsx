import React from 'react';
import { useState } from 'react'
import { Badge, Calendar, Tag, Popover, App } from 'antd';
import { ChromeFilled } from '@ant-design/icons';
import './Calendar.css'

const mp = new Map([
  ["alpha", "#6d32a8"],
  ["beta", "#2db7f5"],
  ["stable", "green"],
])

const content = <div><ChromeFilled /> v122.0.6261.139</div>

const showReleaseDetails = () => {
  console.log('showReleaseDetails')
}

const getListData = (value) => {
  let listData;
  switch (value.date()) {
    case 7:
      listData = [
        {
          type: "alpha"
        }
      ]
      break;
    case 13:
      listData = [
        {
          type: "beta"
        }
      ]
      break;
    case 20:
      listData = [
        {
          type: "stable"
        }
      ]
      break;
    default:
  }
  return listData || [];
};
const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};
const CalendarApp = () => {
  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <Popover title={`v30.0.0.${item.type}`} content={content} arrow={false}>
            <Tag color={mp.get(item.type)} onClick={showReleaseDetails}>{item.type}</Tag>
          </Popover>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  return <Calendar cellRender={cellRender} />;
};

export default CalendarApp;
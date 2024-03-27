import React from 'react';
import { useState, useEffect } from 'react'
import { Badge, Calendar, Tag, Popover, App } from 'antd';
import { ChromeFilled } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs'
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

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const CalendarApp = () => {
  const [mstones, setMstones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDates() {
        try {
            const response = await
                axios.get("https://chromiumdash.appspot.com/fetch_milestone_schedule?offset=0&n=5", {});
            setMstones(formatData(response.data.mstones))
            setLoading(false);
            return "success";
        } catch (e) {
            console.log(e);
            return "error";
        }
    }

    fetchDates();
}, []);

const formatData = (data) => data.map(item => {
  return {
    mstone: item.mstone,
    alpha: dayjs(item.feature_freeze),
    beta: dayjs(item.earliest_beta),
    stable: dayjs(item.stable_date),
  }
})

const getDayData = (date) => {
  const data = []

  mstones.forEach(item => {
    if (date.isSame(item.alpha, 'day')) {
      data.push({type: "alpha", version: item.mstone})
    }
    if (date.isSame(item.beta, 'day')) {
      data.push({type: "beta", version: item.mstone})
    }
    if (date.isSame(item.stable, 'day')) {
      data.push({type: "stable", version: item.mstone})
    }
  })

  return data
}


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
    const dayData = getDayData(value);

    if (dayData.length !== 0) return (
      <ul className="events">
        {dayData.map((item) => {

          const content = <div><ChromeFilled /> {item.version}<br /> <span>(Electron version number is hard-coded)</span></div>
          
          return (
          <Popover title={`v30.0.0.${item.type}`} content={content} arrow={false}>
            <Tag color={mp.get(item.type)} onClick={showReleaseDetails}>{item.type}</Tag>
          </Popover>
        )})}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    // if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  if (loading) {
    return <div><h1>Loading....</h1></div>
  } 
  else {
    return <Calendar cellRender={cellRender} />
  }
};

export default CalendarApp;
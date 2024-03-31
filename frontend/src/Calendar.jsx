import { useState, useEffect } from 'react'
import { Calendar, Tag, Popover } from 'antd';
import { ChromeFilled } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs'
import './Calendar.css'

const mp = new Map([
  ["alpha", "#6d32a8"],
  ["beta", "#2db7f5"],
  ["stable", "green"],
])

const showReleaseDetails = () => {
  console.log('showReleaseDetails')
}

// const getMonthData = (value) => {
//   if (value.month() === 8) {
//     return 1394;
//   }
// };

const CalendarApp = () => {
  let ver = 30;
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
    const mstone = item.mstone;
    if (mstone % 2 === 0) {
      const stable_kickoff = dayjs(item.stable_date).subtract(1, 'day');
      const stable = dayjs(item.stable_date);
      const alpha_kickoff = stable_kickoff.add(2, 'day');
      const alpha = stable.add(2, 'day');
      const eVer = ver;
      ver = ver + 1;
      
      return {
        mstone: mstone,
        alpha: alpha,
        alpha_kickoff: alpha_kickoff,
        stable_kickoff: stable_kickoff,
        stable: stable,
        eVer: eVer,
      }
    }

    else {
      const beta = dayjs(item.stable_date);
      const beta_kickoff = beta.subtract(1, 'day');
      const eVer = ver;

      return {
        beta_kickoff: beta_kickoff,
        beta: beta,
        eVer: eVer,
        mstone: mstone,
      }
    }
  })

  const getDayData = (date) => {
    const data = []

    mstones.forEach(item => {
      if (item.alpha && date.isSame(item.alpha, 'day')) {
        data.push({ type: "alpha", title: `${item.eVer + 1}.0.0-alpha.1`, mstone: item.mstone, content: `Alpha\n${item.eVer + 1}.0.0-alpha.1` })
      }
      if (item.alpha_kickoff && date.isSame(item.alpha_kickoff, 'day')) {
        data.push({ type: "alpha", title: `Kick-Off\n${item.eVer + 1}.0.0-alpha.1`, mstone: item.mstone, content: `Action: Kick-Off\n${item.eVer + 1}.0.0-alpha.1` })
      }
      if (item.beta && date.isSame(item.beta, 'day')) {
        data.push({ type: "beta", title: `${item.eVer}.0.0-beta.1`, mstone: item.mstone, content: `Beta\n${item.eVer}.0.0-beta.1` })
      }
      if (item.beta_kickoff && date.isSame(item.beta_kickoff, 'day')) {
        data.push({ type: "beta", title: `Kick-Off\n${item.eVer}.0.0-beta.1`, mstone: item.mstone, content: `Action: Kick-Off\n${item.eVer}.0.0-beta.1` })
      }
      if (item.stable && date.isSame(item.stable, 'day')) {
        data.push({ type: "stable", title: `✨${item.eVer}.0.0 Stable✨`, mstone: item.mstone, content: `Stable\n${item.eVer}.0.0 Stable` })
      }
      if (item.stable_kickoff && date.isSame(item.stable_kickoff, 'day')) {
        data.push({ type: "stable", title: `Kick-Off\n${item.eVer}.0.0 Stable`, mstone: item.mstone, content: `Action: Kick-Off\n${item.eVer}.0.0 Stable` })
      }
    })

    return data
  }

  // const monthCellRender = (value) => {
  //     const num = getMonthData(value);
  //     return num ? (
  //       <div className="notes-month">
  //         <section>{num}</section>
  //         <span>Backlog number</span>
  //       </div>
  //     ) : null;
  //   };

  const dateCellRender = (value) => {
    const dayData = getDayData(value);

    if (dayData.length !== 0) return (
      <ul className="events">
        {dayData.map((item) => {

          const content = <div><ChromeFilled /> M{item.mstone} <br/>{item.content}</div>

          return (
            // eslint-disable-next-line react/jsx-key
            <Popover title={item.title} content={content} arrow={false}>
              <Tag color={mp.get(item.type)} onClick={showReleaseDetails}>{item.title}</Tag>
            </Popover>
          )
        })}
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
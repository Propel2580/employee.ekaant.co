
// import { useState, useEffect } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// // Video tracking implementation
// export const startVideoTimeTracking = (category, videoElement, programType = null) => {
//   if (!videoElement) return () => {};

//   let watchedTime = 0;
//   let lastTimestamp = Date.now();
//   let trackingInterval = null;

//   const updateStats = async () => {
//     if (watchedTime >= 60) {
//       if (category === 'program' && programType) {
//         // Update program progress in MongoDB
//         const token = localStorage.getItem('token');
//         await fetch('/api/programtracker/update', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             programType,
//             duration: 1
//           })
//         });
//       }
//       await updateWatchTimeStatisticsSimple(category);
//       watchedTime = 0;
//       window.dispatchEvent(new Event('viewDataUpdated'));
//     }
//   };

//   const startTracking = () => {
//     lastTimestamp = Date.now();
//     trackingInterval = setInterval(async () => {
//       if (!videoElement.paused && !videoElement.ended) {
//         const now = Date.now();
//         watchedTime += (now - lastTimestamp) / 1000;
//         lastTimestamp = now;
//         await updateStats();
//       }
//     }, 1000);
//   };

//   startTracking();

//   return () => {
//     if (trackingInterval) {
//       clearInterval(trackingInterval);
//       updateStats();
//     }
//   };
// };

// // For program and challenges - increments by 1
// export const updateWatchTimeStatisticsSimple = async (category) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
//   const token = localStorage.getItem('token');

//   try {
//     // Use MongoDB for challenges category
//     if (category === 'challenges') {
//       await fetch('/api/linechart/update/challenges', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           month: currentMonth,
//           duration: 1
//         })
//       });
//     } else {
//       await fetch('/api/linechart/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           month: currentMonth,
//           category,
//           duration: 1,
//           operation: 'increase'
//         })
//       });
//     }
//     window.dispatchEvent(new Event('viewDataUpdated'));
//   } catch (error) {
//     console.error("Error updating watch time statistics:", error);
//   }
// };

// // For live sessions and expert appointments - uses duration
// export const updateWatchTimeStatisticsDuration = async (category, startTime, endTime, isCancel = false) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
//   const token = localStorage.getItem('token');

//   try {
//     const [startHour, startMinute] = startTime.split(':').map(part => parseInt(part));
//     const [endHour, endMinute] = endTime.split(':').map(part => parseInt(part));

//     let durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
//     if (durationMinutes < 0) durationMinutes += 24 * 60;

//     await fetch('/api/linechart/update', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         month: currentMonth,
//         category,
//         duration: durationMinutes,
//         operation: isCancel ? 'decrease' : 'increase'
//       })
//     });
//     window.dispatchEvent(new Event('viewDataUpdated'));
//   } catch (error) {
//     console.error("Error updating watch time statistics:", error);
//   }
// };

// // Wrapper function to maintain backward compatibility
// export const updateWatchTimeStatistics = (category, param1, param2, isCancel = false) => {
//   if (category === 'program' || category === 'challenges') {
//     updateWatchTimeStatisticsSimple(category);
//   } else if (category === 'livesessions' || category === 'expert') {
//     updateWatchTimeStatisticsDuration(category, param1, param2, isCancel);
//   }
// };

// export const startTimerTracking = (category, durationMinutes) => {
//   let intervalId = null;
//   let startTime = Date.now();
//   let accumulatedTime = 0;

//   const updateTimer = () => {
//     const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
//     if (elapsedMinutes > accumulatedTime) {
//       const newMinutes = elapsedMinutes - accumulatedTime;
//       updateWatchTimeStatistics(category, newMinutes);
//       accumulatedTime = elapsedMinutes;

//       if (accumulatedTime >= durationMinutes) {
//         clearInterval(intervalId);
//       }
//     }
//   };

//   intervalId = setInterval(updateTimer, 1000);

//   return () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       updateTimer();
//     }
//   };
// };

// const CustomLineChart = () => {
//   const [viewData, setViewData] = useState([]);

//   useEffect(() => {
//     const loadViewData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         setViewData([]); // Clear existing data before fetch
//         const response = await fetch('/api/linechart', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!response.ok) throw new Error('Failed to fetch data');

//         const { data: chartData } = await response.json();
//         setViewData(chartData);
//       } catch (error) {
//         console.error("Error loading view data:", error);
//         setViewData([]);
//       }
//     };

//     loadViewData();
//     window.addEventListener('viewDataUpdated', loadViewData);
//     window.addEventListener('chartDataUpdated', loadViewData);

//     return () => {
//       window.removeEventListener('viewDataUpdated', loadViewData);
//       window.removeEventListener('chartDataUpdated', loadViewData);
//     };
//   }, []);

//   const lineColors = {
//     program: "#8884d8",
//     livesessions: "#82ca9d",
//     expert: "#ffc658",
//     challenges: "#ff8042",
//     groupcoaching: "#0088fe"
//   };

//   return (
//     <ResponsiveContainer width="100%" height={200}>
//       <LineChart data={viewData}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line 
//           type="monotone" 
//           dataKey="program" 
//           name="Program" 
//           stroke={lineColors.program} 
//           strokeWidth={2} 
//         />
//         <Line 
//           type="monotone" 
//           dataKey="livesessions" 
//           name="Live Sessions" 
//           stroke={lineColors.livesessions} 
//           strokeWidth={2} 
//         />
//         <Line 
//           type="monotone" 
//           dataKey="expert" 
//           name="Expert" 
//           stroke={lineColors.expert} 
//           strokeWidth={2} 
//         />
//         <Line 
//           type="monotone" 
//           dataKey="challenges" 
//           name="Challenges" 
//           stroke={lineColors.challenges} 
//           strokeWidth={2} 
//         />
//         <Line 
//           type="monotone" 
//           dataKey="groupcoaching" 
//           name="Group Coaching" 
//           stroke={lineColors.groupcoaching} 
//           strokeWidth={2} 
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default CustomLineChart;
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Video tracking implementation
export const startVideoTimeTracking = (category, videoElement, programType = null) => {
  if (!videoElement) return () => {};

  let watchedTime = 0;
  let lastTimestamp = Date.now();
  let trackingInterval = null;

  const updateStats = async () => {
    if (watchedTime >= 60) {
      if (category === 'program' && programType) {
        // Update program progress in MongoDB
        const token = localStorage.getItem('token');
        await fetch('https://employee.ekaant.co/api/programtracker/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            programType,
            duration: 1
          })
        });
      }
      await updateWatchTimeStatisticsSimple(category);
      watchedTime = 0;
      window.dispatchEvent(new Event('viewDataUpdated'));
    }
  };

  const startTracking = () => {
    lastTimestamp = Date.now();
    trackingInterval = setInterval(async () => {
      if (!videoElement.paused && !videoElement.ended) {
        const now = Date.now();
        watchedTime += (now - lastTimestamp) / 1000;
        lastTimestamp = now;
        await updateStats();
      }
    }, 1000);
  };

  startTracking();

  return () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      updateStats();
    }
  };
};

// For program and challenges - increments by 1
export const updateWatchTimeStatisticsSimple = async (category) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const token = localStorage.getItem('token');

  try {
    // Use MongoDB for challenges category
    if (category === 'challenges') {
      await fetch('https://employee.ekaant.co/api/linechart/update/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          month: currentMonth,
          duration: 1
        })
      });
    } else {
      await fetch('https://employee.ekaant.co/api/linechart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          month: currentMonth,
          category,
          duration: 1,
          operation: 'increase'
        })
      });
    }
    window.dispatchEvent(new Event('viewDataUpdated'));
  } catch (error) {
    console.error("Error updating watch time statistics:", error);
  }
};

// For live sessions and expert appointments - uses duration
export const updateWatchTimeStatisticsDuration = async (category, startTime, endTime, isCancel = false) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const token = localStorage.getItem('token');

  try {
    const [startHour, startMinute] = startTime.split(':').map(part => parseInt(part));
    const [endHour, endMinute] = endTime.split(':').map(part => parseInt(part));

    let durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    if (durationMinutes < 0) durationMinutes += 24 * 60;

    await fetch('https://employee.ekaant.co/api/linechart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        month: currentMonth,
        category,
        duration: durationMinutes,
        operation: isCancel ? 'decrease' : 'increase'
      })
    });
    window.dispatchEvent(new Event('viewDataUpdated'));
  } catch (error) {
    console.error("Error updating watch time statistics:", error);
  }
};

// Wrapper function to maintain backward compatibility
export const updateWatchTimeStatistics = (category, param1, param2, isCancel = false) => {
  if (category === 'program' || category === 'challenges') {
    updateWatchTimeStatisticsSimple(category);
  } else if (category === 'livesessions' || category === 'expert') {
    updateWatchTimeStatisticsDuration(category, param1, param2, isCancel);
  }
};

export const startTimerTracking = (category, durationMinutes) => {
  let intervalId = null;
  let startTime = Date.now();
  let accumulatedTime = 0;

  const updateTimer = () => {
    const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
    if (elapsedMinutes > accumulatedTime) {
      const newMinutes = elapsedMinutes - accumulatedTime;
      updateWatchTimeStatistics(category, newMinutes);
      accumulatedTime = elapsedMinutes;

      if (accumulatedTime >= durationMinutes) {
        clearInterval(intervalId);
      }
    }
  };

  intervalId = setInterval(updateTimer, 1000);

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      updateTimer();
    }
  };
};

const CustomLineChart = () => {
  const [viewData, setViewData] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);

  useEffect(() => {
    const loadViewData = async () => {
      try {
        const token = localStorage.getItem('token');
        setViewData([]); // Clear existing data before fetch
        const response = await fetch('/api/linechart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const { data: chartData } = await response.json();
        setViewData(chartData);
      } catch (error) {
        console.error("Error loading view data:", error);
        setViewData([]);
      }
    };

    loadViewData();
    window.addEventListener('viewDataUpdated', loadViewData);
    window.addEventListener('chartDataUpdated', loadViewData);

    return () => {
      window.removeEventListener('viewDataUpdated', loadViewData);
      window.removeEventListener('chartDataUpdated', loadViewData);
    };
  }, []);

  const lineColors = {
    program: "#8884d8",
    livesessions: "#82ca9d",
    expert: "#ffc658",
    challenges: "#ff8042",
    groupcoaching: "#0088fe"
  };

  return (
    <div className="p-4 ">

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={viewData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {Object.entries(lineColors).map(([key, color]) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            axisLine={{ stroke: '#475569' }}
          />
          <Tooltip
            contentStyle={{

              border: '1px solidrgb(166, 193, 237)',
              borderRadius: '4px',
              
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              color: '#fff'
            }}
          />
          {Object.entries(lineColors).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              stroke={color}
              strokeWidth={hoveredLine === key ? 3 : 2}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6 }}
              onMouseEnter={() => setHoveredLine(key)}
              onMouseLeave={() => setHoveredLine(null)}
              fillOpacity={0.2}
              fill={`url(#gradient-${key})`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Legend, CartesianGrid, Cell
} from "recharts";
import PropTypes from "prop-types";

const initialData = [
  { name: "Jan", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Feb", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Mar", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Apr", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "May", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Jun", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Jul", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Aug", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Sep", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Oct", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Nov", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
  { name: "Dec", Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 },
];

const colors = {
  Program: "#6366F1",      
  LiveSessions: "#F59E0B", 
  Experts: "#10B981",     
  Challenge: "#EC4899"     
};

const getCurrentMonth = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[new Date().getMonth()];
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "1px",
        border: "1px solid #ccc",
        borderRadius: "1px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
      }}>
        <p className="label" style={{ 
          fontWeight: "bold", 
          marginBottom: "8px",
          borderBottom: "1px solid #eee",
          paddingBottom: "4px"
        }}>{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ 
            color: entry.color,
            margin: "2px 0",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span style={{ marginRight: "5px" }}>{entry.name}:</span>
            <span style={{ fontWeight: "bolder" }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomBarChart = () => {
  const [data, setData] = useState(initialData);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [highlightCurrentMonth, setHighlightCurrentMonth] = useState(true);
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Clear existing data before fetching new
        setData([...initialData]);

        // Fetch bar chart data directly (no need to filter, backend handles it)
        const chartResponse = await fetch(`https://employee.ekaant.co/api/barchart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!chartResponse.ok) throw new Error('Failed to fetch chart data');

        const { data: chartData } = await chartResponse.json();

        // Update the initialData with the fetched data
        const updatedData = [...initialData];
        chartData.forEach(entry => {
          const monthEntry = updatedData.find(d => d.name === entry.month);
          if (monthEntry) {
            monthEntry.Program = entry.Program || 0;
            monthEntry.LiveSessions = entry.LiveSessions || 0;
            monthEntry.Experts = entry.Experts || 0;
            monthEntry.Challenge = entry.Challenge || 0;
          }
        });

        setData(updatedData);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();

    const updateHandler = () => fetchBarChartData();
    window.addEventListener("chartDataUpdated", updateHandler);
    window.addEventListener("expertBookingUpdated", updateHandler);

    return () => {
      window.removeEventListener("chartDataUpdated", updateHandler);
      window.removeEventListener("expertBookingUpdated", updateHandler);
    };
  }, []);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const totals = data.reduce((acc, item) => {
    acc.Program += item.Program;
    acc.LiveSessions += item.LiveSessions;
    acc.Experts += item.Experts;
    acc.Challenge += item.Challenge;
    return acc;
  }, { Program: 0, LiveSessions: 0, Experts: 0, Challenge: 0 });

  return (
    <div className="chart-container" style={{ 
      backgroundColor: "#f8fafc", 
      borderRadius: "8px", 
      padding: "20px", 
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
    }}>
      <div className="chart-header" style={{ marginBottom: "20px" }}>
        <h2 style={{ 
          fontSize: "1.5rem", 
          color: "#334155", 
          marginBottom: "10px",
          fontWeight: "600"
        }}>Monthly Activity Overview</h2>

        <div className="chart-summary" style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "15px", 
          marginBottom: "15px" 
        }}>
          {Object.entries(totals).map(([key, value]) => (
            <div key={key} style={{ 
              backgroundColor: "white", 
              padding: "10px 15px", 
              borderRadius: "6px",
              border: `1px solid ${colors[key]}`,
              minWidth: "120px"
            }}>
              <div style={{ color: colors[key], fontWeight: "bold" }}>{key}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 3, left: 1, bottom: 30 }}
          onMouseMove={(e) => e && handleMouseEnter(e, e.activeTooltipIndex)}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b' }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#64748b' }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconType="circle"
            wrapperStyle={{ paddingTop: "20px" }}
          />
          {['Program', 'LiveSessions', 'Experts', 'Challenge'].map((category, i) => (
            <Bar 
              key={category}
              dataKey={category} 
              fill={colors[category]} 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
              animationBegin={i * 300}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={highlightCurrentMonth && entry.name === currentMonth 
                    ? colors[category] 
                    : activeIndex === index ? '#818cf8' : colors[category]} 
                  stroke={highlightCurrentMonth && entry.name === currentMonth ? colors[category] : 'none'}
                  strokeWidth={highlightCurrentMonth && entry.name === currentMonth ? 1 : 0}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
};

export default CustomBarChart;
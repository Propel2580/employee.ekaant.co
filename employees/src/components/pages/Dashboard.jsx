import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PieChart from "../charts/PieChart";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import ProfileCard from "../cards/ProfileCard";
import axios from "axios";
import SessionsChart from "../charts/SessionsChart";
import InsightsCard from "../cards/InsightsCard";
import WellbeingCard from "../cards/WellbeingCard";
// Mock function to simulate fetching dashboard data
const fetchDashboardData = async () => {
  return {
    
  };
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [employeeName, setEmployeeName] = useState("Guest");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }

        const res = await axios.get("https://employee.ekaant.co/api/employee/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmployeeName(res.data.employee.username);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchProfile();

    // Add event listener for profile updates
    const handleProfileUpdate = (event) => {
      console.log("Profile update detected in Dashboard");
      // Check if event has data
      if (event.detail && event.detail.username) {
        setEmployeeName(event.detail.username);
      } else {
        // Fallback to localStorage
        const userData = JSON.parse(localStorage.getItem("userProfileData") || "{}");
        if (userData && userData.username) {
          setEmployeeName(userData.username);
        }
      }
    };

    // Listen for profile update events
    window.addEventListener("profileDataChanged", handleProfileUpdate);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("profileDataChanged", handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const data = await fetchDashboardData();
        if (!data) throw new Error("No data received from API");
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard Load Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading data...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!dashboardData) return <p className="text-center text-lg font-semibold">Loading data...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Section */}
      <motion.h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome {employeeName},</motion.h2>

      {/* Insights Card */}
     
           <InsightsCard />
     
      {/* Grid Layout for Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Profile Card - Full Width */}
        <div className="lg:col-span-2 md:p-6">  
          <ProfileCard />
        </div>

        {/* My Time Track (Pie Chart) */}
        <div className="lg:col-span-1">
          <Card className="p-6 shadow-lg rounded-lg">
            <Typography variant="h6">My Time Track</Typography>
            <PieChart data={dashboardData.timeTrack} />
          </Card>
        </div>

        
{/* Wellbeing Profile */}
<WellbeingCard />
        {/* No. of Sessions Attended */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg rounded-lg">
            <BarChart data={dashboardData.sessions} />
          </Card>
        </div>

        {/* Average Time Spent in Sessions */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-lg rounded-lg">
            <Typography variant="h6">Average time spent in sessions</Typography>
            <LineChart data={dashboardData.averageTime} />
          </Card>
        </div>

        {/* Check-in Report Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="lg:col-span-1">
          <Card className="p-6 shadow-lg rounded-lg lg:col-span-4">
            <Typography variant="h6">Check in Report</Typography>
            <SessionsChart data={dashboardData.checkIn} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
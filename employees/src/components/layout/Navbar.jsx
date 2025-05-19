import { useState, useEffect } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography, Divider, Avatar } from "@mui/material";
import { Notifications, AccountCircle } from "@mui/icons-material";
import { useCredits } from "../context/CreditsContext";
import axios from "axios";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { credits, loading } = useCredits();

  // Function to fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "https://employee.ekaant.co/api/notifications",
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && Array.isArray(response.data.notifications)) {
        const sortedNotifications = response.data.notifications
          .filter(notification => notification !== null)
          .sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
        setNotifications(sortedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  // Fetch notifications immediately and listen for updates
  useEffect(() => {
    fetchNotifications();

    const handleNotificationUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('notificationCreated', handleNotificationUpdate);
    const interval = setInterval(fetchNotifications, 50000);

    return () => {
      window.removeEventListener('notificationCreated', handleNotificationUpdate);
      clearInterval(interval);
    };
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found!");
        return;
      }
  
      const response = await axios.get("https://employee.ekaant.co/api/employee/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(response.data.employee);
    } catch (error) {
      console.error("Error fetching employee profile data:", error.response?.data || error.message);
    }
  };

  // Fetch profile data on component mount and when profile changes
  useEffect(() => {
    fetchProfileData();

    // Listen for profile data changes
    window.addEventListener('profileDataChanged', fetchProfileData);
    
    return () => {
      window.removeEventListener('profileDataChanged', fetchProfileData);
    };
  }, []);

  // Refresh profile data when modal opens
  useEffect(() => {
    if (openProfileModal) {
      fetchProfileData();
    }
  }, [openProfileModal]);

  const open = Boolean(anchorEl);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://employee.ekaant.co/api/notifications/read/${notificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="flex justify-end items-end p-4 bg-white">
      <div className="flex items-center space-x-4">
        <span className="bg-gray-800 text-white px-3 py-1 rounded-full">
          {credits} credits
        </span>

        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="secondary">
            <Notifications />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleNotificationClose}
          PaperProps={{
            style: {
              maxHeight: "400px",
              width: "350px",
            },
          }}
        >
          <MenuItem>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Notifications
            </Typography>
          </MenuItem>
          <Divider />
          
          {notifications.length === 0 ? (
            <MenuItem>
              <Typography variant="body2" color="text.secondary">
                No new notifications.
              </Typography>
            </MenuItem>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification._id}>
                <MenuItem 
                  onClick={() => markAsRead(notification._id)}
                  className={`w-full ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className={`w-full ${!notification.read ? "border-l-4 border-indigo-500 pl-2" : ""}`}>
                    <Typography variant="subtitle1" fontWeight={!notification.read ? "bold" : "normal"}>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📅 {new Date(notification.sessionDate).toLocaleDateString()} at {notification.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ⏱️ Duration: {notification.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      💰 Price: {notification.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      👨‍⚕️ Doctor: {notification.doctorName} 
                      {notification.doctorSpecialty && ` (${notification.doctorSpecialty})`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🕒 Booked on: {new Date(notification.bookingTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {notification.type === 'expert' ? '👥 Expert Session' : '🎥 Live Session'}
                    </Typography>
                  </div>
                </MenuItem>
                {index < notifications.length - 1 && <Divider />}
              </div>
            ))
          )}
        </Menu>

        <IconButton onClick={() => setOpenProfileModal(true)}>
          {profileData?.avatar ? (
            <Avatar 
              src={profileData.avatar}
              alt={profileData.username || "User"}
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <AccountCircle />
          )}
        </IconButton>
      </div>

      <ProfileModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        profileData={profileData}
        setProfileData={setProfileData}
      />
    </div>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Dialog, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Challenge = () => {
  const [filter, setFilter] = useState('Active');
  const [credits, setCredits] = useState(0);
  const [joinedChallenges, setJoinedChallenges] = useState({});
  const [confirmJoin, setConfirmJoin] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [isChecked, setIsChecked] = useState({});
  const navigate = useNavigate();

  const challenges = [
    {
      id: 1,
      title: '45 Days of Stress Release',
      dateRange: '10 May - 24 May, 2024',
      credits: 50,
      image: 'https://www.shutterstock.com/image-vector/multitasking-time-management-concept-business-260nw-2177152775.jpg',
      status: 'Active',
    },
    {
      id: 10,
      title: 'Dopamine Triggers and Avoidance',
      dateRange: '15 May - 29 May, 2024',
      credits: 50,
      image: 'https://t4.ftcdn.net/jpg/04/91/77/87/360_F_491778733_Qt8W4SiDrYGY80dHggmWKVPkeAcBELgu.jpg',
      status: 'Active',
    },
    {
      id: 12,
      title: 'Inclusive Workplaces',
      dateRange: '10 May - 24 May, 2024',
      credits: 50,
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      status: 'Active',
    },
   
    // Add other challenges here...
  ];

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch employee profile for credits
        const profileResponse = await fetch('https://employee.ekaant.co/api/employee/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setCredits(profileData.employee.credits);
        }

        // Fetch joined challenges
        const challengesResponse = await fetch('https://employee.ekaant.co/api/challenges', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (challengesResponse.ok) {
          const data = await challengesResponse.json();
          const joinedMap = {};
          data.challenges.forEach(challenge => {
            joinedMap[challenge.challengeId] = true;
          });
          setJoinedChallenges(joinedMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleJoinChallenge = async (challengeId) => {
    if (!isChecked[challengeId]) return;

    try {
      const token = localStorage.getItem('token');
      const challenge = challenges.find(c => c.id === challengeId);

      const response = await fetch('https://employee.ekaant.co/api/challenges/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          challengeId,
          challengeName: challenge.title,
          creditsToSpend: 10
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update credits immediately
        setCredits(data.updatedCredits);
        
        // Trigger credits context refresh
        window.dispatchEvent(new Event('creditsUpdated'));

        // Update joined challenges state
        setJoinedChallenges(prev => ({
          ...prev,
          [challengeId]: true
        }));

        // Update bar chart data in MongoDB
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await fetch('https://employee.ekaant.co/api/barchart/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              month: currentMonth,
              category: 'Challenge'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update bar chart data');
          }

          // Refresh chart data
          window.dispatchEvent(new Event('chartDataUpdated'));
        } catch (error) {
          console.error('❌ Failed to update bar chart:', error.message);
        }
        
        // Close dialog after updates
        setConfirmJoin(false);
      } else {
        alert(data.message || "Failed to join challenge");
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert("Error joining challenge");
    }
  };

  const handleCheckboxChange = (challengeId) => (event) => {
    setIsChecked(prev => ({ ...prev, [challengeId]: event.target.checked }));
  };

  const handleViewChallenge = (challengeId, challengeTitle) => {
    if (joinedChallenges[challengeId]) {
      const urlFriendlyTitle = challengeTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      navigate(`/challenges/${urlFriendlyTitle}`);
    } else {
      alert("You need to join the challenge first!");
    }
  };

  const getActionButton = (challenge) => {
    switch (filter) {
      case 'Active':
        return (
          <button
            onClick={() => {
              setSelectedChallengeId(challenge.id);
              setConfirmJoin(true);
            }}
            className={`bg-indigo-800 hover:bg-indigo-900 text-white rounded-full py-1.5 px-5 text-sm font-medium transition-colors ${
              joinedChallenges[challenge.id] ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            disabled={joinedChallenges[challenge.id]}
          >
            {joinedChallenges[challenge.id] ? "Joined ✓" : "Join Challenge"}
          </button>
        );

      case 'Completed':
        return (
          <button
            onClick={() => handleViewChallenge(challenge.id, challenge.title)}
            className="bg-green-700 hover:bg-green-800 text-white rounded-full py-1.5 px-5 text-sm font-medium transition-colors"
          >
            View Results
          </button>
        );
      default:
        return null;
    }
  };

  const filteredChallenges = challenges.filter(challenge => challenge.status === filter);

  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" component="h1" sx={{
        fontSize: '2rem',
        fontWeight: 'bold',
        mb: 4,
        color: '#333'
      }}>
        CHALLANGES
      </Typography>

      {/* Filter Tabs */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {[ 'Active', 'Completed'].map((tab) => (
          <Button
            key={tab}
            onClick={() => setFilter(tab)}
            sx={{
              borderRadius: '24px',
              border: '1px solid #e0e0e0',
              backgroundColor: filter === tab ? '#2C295B' : 'white',
              color: filter === tab ? 'white' : '#333',
              px: 3,
              py: 0.8,
              '&:hover': {
                backgroundColor: filter === tab ? '#201F40' : '#f5f5f5',
              },
              fontWeight: 'medium',
              minWidth: '120px',
              boxShadow: filter === tab ? '0px 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={challenge.image}
                alt={challenge.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {challenge.title}
                </h2>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {challenge.credits} creds
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {challenge.dateRange}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewChallenge(challenge.id, challenge.title)}
                  className="text-indigo-700 hover:text-indigo-900 font-medium text-sm transition-colors"
                >
                  View
                </button>
                {getActionButton(challenge)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm Join Popup */}
      <Dialog
        open={confirmJoin}
        onClose={() => setConfirmJoin(false)}
      >
        <div className="p-6 max-w-md">
          <Typography variant="h6" className="mb-4">
            Confirm Join Challenge
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked[selectedChallengeId] || false}
                onChange={handleCheckboxChange(selectedChallengeId)}
              />
            }
            label={`Are you sure you want to join this challenge? 10 credits will be deducted.`}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-6"
            onClick={() => handleJoinChallenge(selectedChallengeId)}
            disabled={!isChecked[selectedChallengeId]}
          >
            Yes, Join
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Challenge;
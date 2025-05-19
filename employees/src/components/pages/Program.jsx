import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Box,
} from "@mui/material";
import { useCredits } from "../context/CreditsContext";
import LiveSession from "../pages/LiveSession";
import CloseIcon from '@mui/icons-material/Close';

const defaultLevels = [
  { name: "Introduction", icon: "🔥" },
  { name: "Stress Management", icon: "💆‍♂️" },
  { name: " Balance", icon: "⚖️" },
  { name: "Mindfulness", icon: "🧘" },
  { name: "Healthy Habits", icon: "🍏" },
  { name: "Emotional Intelligence", icon: "🧠" },
  { name: "Resilience ", icon: "🏋️" },
  { name: "Final Assessment", icon: "🎓" },
];

const programs = [
  {
    id: 1,
    name: "Prevent Burnout",
    credits: 100,
    image: "https://recruitment.growmo.re/wp-content/uploads/2022/09/7-how-to-prevent-burnout.jpg",
    expert: {
      name: "Dr. Kuldeep Singh",
      photo: "https://tse4.mm.bing.net/th?id=OIP.VFVFnOHFUcnYKkiE58CIIQHaHa&pid=Api&P=0&h=180",
      description: "Expert in stress and Anxiety",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 21,
    name: "Manage Your Stress",
    credits: 100,
    image: "https://tse3.mm.bing.net/th?id=OIP.7iFU_lcul3qC31HHEHbEdgHaHa&pid=Api&P=0&h=180",
    expert: {
      name: "Mahira Khan",
      photo: "https://i2.wp.com/www.americanbazaaronline.com/wp-content/uploads/2014/12/Mahira-Khan.jpg",
      description: "Expert in Sleep Quality",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 4,
    name: "Cultivate Quality Sleep",
    credits: 100,
    image: "https://tse3.mm.bing.net/th?id=OIP._X1yyAGD4lrrXsd_We1eswHaE8&pid=Api&P=0&h=180",
    expert: {
      name: "joane Pier",
      photo: "https://tse2.mm.bing.net/th?id=OIP.NJB6dPEjNfo276psJ59uAQHaG0&pid=Api&P=0&h=180",
      description: "Expert in Break work stress.",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 412,
    name: "Build Resilience",
    credits: 100,
    image: "https://i.pinimg.com/originals/c9/e3/db/c9e3dbe09b5f95ddb9eab6b2bbb5d913.jpg",
    expert: {
      name: "Ruhi Kaur",
      photo: "https://a.eka.care/doctor-avatar/166443902037485?v=1664439891",
      description: "Fostering resilience and self-discovery through leadership growth.",
      sessionTime: "Live at ",
    },
    levels: defaultLevels,
  },
  {
    id: 661,
    name: "Stressed to Balanced",
    credits: 100,
    image: "https://www.hellofitnessmagazine.com/image/catalog/blog/blogs-image/guide_to_finding_inner_balance_stress_management_techniques_hfm.jpeg",
    expert: {
      name: "Viraj Singh",
      photo: "https://tse4.mm.bing.net/th?id=OIP.Rq6gZO-BJQQsJqRK_QYMUwAAAA&pid=Api&P=0&h=180",
      description: "Expert in stress management and mental health.",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 389,
    name: "Mindful Leader's",
    credits: 100,
    image: "https://unbridlingyourbrilliance.com/wp-content/uploads/2017/06/mindfulness-meditation.jpeg",
    expert: {
      name: "Vaibhav Sankar",
      photo: "https://visionhospitalgoa.com/wp-content/uploads/2015/05/Dr.Vaibhav-Dukle.jpg",
      description: "Expert in Dopamine Detox",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 71,
    name: "Meditation: The Basics",
    credits: 100,
    image: "https://res.cloudinary.com/roundglass/image/upload/w_1400,f_auto/v1637610981/rg/collective/media/gettyimages-1255071300-1920x1080-47d8afa-1637610980382.jpg",
    expert: {
      name: "Dr. John Deo",
      photo: "https://tse4.mm.bing.net/th?id=OIP.7o6ZXyp5MItVqTrJRJzo8QAAAA&pid=Api&P=0&h=180",
      description: "Expert in stress management",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 81,
    name: "Yoga: The Basics",
    credits: 100,
    image: "https://tse1.mm.bing.net/th?id=OIP.vhtw9JQjAfEz66TCrjpErwHaE8&pid=Api&P=0&h=180",
    expert: {
      name: "Dr. Ajay",
      photo: "https://ssbhealthcare.com/wp-content/uploads/2023/12/Dr.-Ajay-Beliya.png",
      description: "Expert in stress management and mental health.",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
  {
    id: 41,
    name: "Healthy Habits",
    credits: 100,
    image: "https://tse1.mm.bing.net/th?id=OIP.LmNRPj_-ERgu6HVh7-013wHaE7&pid=Api&P=0&h=180",
    expert: {
      name: "Dr. Mansi ",
      photo: "https://labuwiki.com/wp-content/uploads/2020/12/25.jpg",
      description: "Expert in stress management and mental health.",
      sessionTime: "Fostering resilience and self-discovery through leadership growth.",
    },
    levels: defaultLevels,
  },
];

const Program = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [expertPopup, setExpertPopup] = useState(false);
  const [isChecked, setIsChecked] = useState({});
  const [selectedExpertProgram, setSelectedExpertProgram] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [confirmJoin, setConfirmJoin] = useState(false);
  const { credits, updateCredits } = useCredits();
  const [attendEnabled, setAttendEnabled] = useState({});
  const [employeePrograms, setEmployeePrograms] = useState([]);

  const fetchEmployeePrograms = async () => {
    try {
      const response = await fetch('https://employee.ekaant.co/api/program-progress', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.progress) {
          setEmployeePrograms(data.progress);
        }
      }
    } catch (error) {
      console.error('Failed to fetch employee programs:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        // First fetch employee profile
        const profileResponse = await fetch('https://employee.ekaant.co/api/employee/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch employee profile');
        }

        const profileData = await profileResponse.json();
        const employeeEmail = profileData.employee.email;

        // Then fetch programs specific to this employee
        const programResponse = await fetch(`https://employee.ekaant.co/api/program-progress?email=${employeeEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (programResponse.ok) {
          const data = await programResponse.json();
          if (data.success && data.progress) {
            setEmployeePrograms(data.progress);

            const joinedPrograms = data.progress.reduce((acc, prog) => {
              acc[prog.programId] = true;
              return acc;
            }, {});
            setAttendEnabled(joinedPrograms);
          }
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('❌ No authentication token found');
          return;
        }

        // First fetch employee profile
        const profileResponse = await fetch('https://employee.ekaant.co/api/employee/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch employee profile');
        }

        const profileData = await profileResponse.json();
        const employeeEmail = profileData.employee.email;
        console.log("✅ Fetched Employee Data:", profileData);

        // Then fetch program progress using email
        const progressResponse = await fetch(`https://employee.ekaant.co/api/program-progress?email=${employeeEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (progressResponse.ok) {
          const data = await progressResponse.json();
          if (data.success && data.progress) {
            setEmployeePrograms(data.progress);

            const joinedPrograms = data.progress.reduce((acc, prog) => {
              acc[prog.programId] = true;
              return acc;
            }, {});
            setAttendEnabled(joinedPrograms);
            console.log("✅ Program progress loaded successfully for:", employeeEmail);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleJoin = async (programId) => {
    if (isChecked[programId]) {
      if (credits >= 100) {
        try {
          const selectedProgram = programs.find(p => p.id === programId);
          const newCredits = credits - 100;
          await updateCredits(newCredits, 'set');

          // Fetch employee data from MongoDB
          const profileResponse = await fetch('https://employee.ekaant.co/api/employee/profile', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch employee data');
          }

          const data = await profileResponse.json();
          const employeeEmail = data.employee.email;

          if (!employeeEmail) {
            throw new Error('Employee email not found');
          }

          // Initialize/Update program progress
          const response = await fetch('https://employee.ekaant.co/api/program-progress/update', {
            method: 'POST',
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              programId: selectedProgram.id,
              programName: selectedProgram.name,
              expertName: selectedProgram.expert.name,
              currentLevel: 0,
              completedLevel: 0,
              levelName: selectedProgram.name,
              employeeEmail: employeeEmail
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update progress');
          }

          // Update attendEnabled state without localStorage
          setAttendEnabled(prev => ({
            ...prev,
            [programId]: true
          }));

          // Fetch updated program progress after joining
          await fetchEmployeePrograms();

          const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });


          try {
            await fetch('https://employee.ekaant.co/api/barchart/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                month: currentMonth,
                category: 'Program',
                value: 1
              })
            });
          } catch (error) {
            console.error('Failed to update bar chart data ', error);
          }

          window.dispatchEvent(new Event('chartDataUpdated'));

          // Create notification
          try {
            const token = localStorage.getItem("token");
            const notificationData = {
              title: "Program Joined",
              date: new Date().toISOString().split('T')[0],
              time: selectedProgram.expert.sessionTime,
              duration: "Program Access",
              price: `${selectedProgram.credits} credits`,
              doctorName: selectedProgram.expert.name,
              doctorSpecialty: selectedProgram.expert.description,
              sessionDate: new Date(),
              type: 'expert',
              bookingTime: new Date()
            };

            const notificationResponse = await axios.post(
              "https://employee.ekaant.co/api/notifications",
              notificationData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (notificationResponse.data.success) {
              // Create and dispatch custom notification event with notification data
              const notificationEvent = new CustomEvent('notificationCreated', {
                detail: notificationResponse.data.notification
              });
              window.dispatchEvent(notificationEvent);
              window.dispatchEvent(new Event('chartDataUpdated'));
            }
          } catch (error) {
            console.error("Error creating notification:", error);
          }

          setConfirmJoin(false);
          setExpertPopup(false);
        } catch (error) {
          console.error('Failed to update credits or progress:', error);
          alert('Failed to join program. Please try again.');
        }
      } else {
        alert("Not enough credits!");
      }
    }
  };

  const handleExpertClick = (program) => {
    if (!attendEnabled[program.id]) {
      setSelectedExpertProgram(program);
      setExpertPopup(true);
    } else {
      window.location.href = `/${program.name.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  const handleCheckboxChange = (programId) => (event) => {
    setIsChecked((prev) => ({ ...prev, [programId]: event.target.checked }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentProgram = programs.find((p) => p.id === selectedProgram);

  const renderPrograms = (isLive = false) => {
    const filteredPrograms = isLive
      ? programs.filter((program) => program.expert.sessionTime.includes("Live"))
      : programs.filter((program) => !program.expert.sessionTime.includes("Live"));

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredPrograms.map((program) => (
          <motion.div
            key={program.id}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            className="bg-white rounded-xl overflow-hidden transform transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div className="relative">
              <img
                src={program.image}
                alt={`Cover image for ${program.name}`}
                className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-xl font-bold text-white mb-1">
                  {program.name}
                </h2>
                <p className="text-white/90">{program.credits} credits</p>
              </div>
            </div>
            <div className="p-6">
              <div
                className="flex items-center space-x-3 mb-6 cursor-pointer transform hover:scale-102 transition-all duration-300"
                onClick={() => handleExpertClick(program)}
              >
                <img
                  src={program.expert.photo}
                  alt={program.expert.name}
                  className="w-12 h-12 rounded-full border-2 border-indigo-100"
                />
                <div>
                  <span className="text-gray-800 font-medium block">
                    {program.expert.name}
                  </span>
                  <span className="text-indigo-600 text-sm">
                    {program.expert.sessionTime}
                  </span>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: '10px',
                  py: 1.5,
                  background: attendEnabled[program.id] ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: attendEnabled[program.id] ? '0 3px 5px 2px rgba(33, 203, 243, .3)' : '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                  },
                }}
                disabled={false}
                onClick={() => {
                  if (!attendEnabled[program.id]) {
                    handleExpertClick(program);
                  } else {
                    window.location.href = `/${program.name.toLowerCase().replace(/\s+/g, '-')}`;
                  }
                }}
              >
                {attendEnabled[program.id] ? "Attend" : "Join First"}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Typography 
        variant="h4" 
        className="mb-12 font-bold text-center"
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Programs
      </Typography>

      {currentProgram ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {currentProgram.name}
          </h1>
          <div className="grid gap-4">
            {currentProgram.levels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="mr-4 text-2xl">{level.icon}</span>
                <span className="font-medium text-gray-700">{level.name}</span>
              </motion.div>
            ))}
          </div>
          <Button
            variant="contained"
            color="primary"
            className="mt-8"
            onClick={() => setSelectedProgram(null)}
          >
            Back to Programs
          </Button>
        </div>
      ) : (
        <div>
          <Paper elevation={0} sx={{ borderRadius: '16px', mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  minWidth: 200,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  color: '#666',
                  '&.Mui-selected': {
                    color: '#2196F3',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '1.5px',
                },
              }}
            >
               <Tab label="Live Sessions" />
              <Tab label="Recorded Sessions" />
              {/* <Tab label="Live Sessions" /> */}
            </Tabs>
          </Paper>
          {activeTab === 0 ? <LiveSession /> : null}
          {activeTab === 1 ? renderPrograms(false) : null}
          {/* //{activeTab === 1 ? <LiveSession /> : renderPrograms(false)} */}
        </div>
      )}

      {/* Expert Dialog */}
      <Dialog 
        open={expertPopup} 
        onClose={() => setExpertPopup(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box sx={{ position: 'relative', p: 3 }}>
          <IconButton
            onClick={() => setExpertPopup(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedExpertProgram && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={selectedExpertProgram.expert.photo}
                  alt={selectedExpertProgram.expert.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '60px',
                    margin: '0 auto 20px',
                    border: '4px solid #2196F3',
                    padding: '4px',
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                  {selectedExpertProgram.expert.name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                  {selectedExpertProgram.expert.description}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2196F3',
                    display: 'inline-block',
                    background: 'rgba(33, 150, 243, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                  }}
                >
                  {selectedExpertProgram.expert.sessionTime}
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked[selectedExpertProgram?.id] || false}
                      onChange={handleCheckboxChange(selectedExpertProgram?.id)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#2196F3',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      I confirm I want to join this session 
                      <span style={{ color: '#2196F3', fontWeight: 600 }}>
                        {` (${selectedExpertProgram?.credits} credits will be deducted)`}
                      </span>
                    </Typography>
                  }
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: '10px',
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1EA7D2 90%)',
                    },
                    '&.Mui-disabled': {
                      background: '#e0e0e0',
                    },
                  }}
                  disabled={!isChecked[selectedExpertProgram?.id]}
                  onClick={() => {
                    if (attendEnabled[selectedExpertProgram?.id]) {
                      setExpertPopup(false);
                    } else {
                      handleJoin(selectedExpertProgram?.id);
                    }
                  }}
                >
                  {attendEnabled[selectedExpertProgram?.id] ? "Already Joined" : "Yes, Attend"}
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>
      </Dialog>
    </div>
  );
};

export default Program;
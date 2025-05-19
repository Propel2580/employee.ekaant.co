import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Dialog, DialogContent, Tooltip, LinearProgress, Box, Avatar, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {  startVideoTimeTracking } from "../charts/LineChart";
// Custom hook for progress tracking using MongoDB
const useProgress = (programType) => {
  const [progress, setProgress] = useState({ activities: [], unlockedLevels: [0] });
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://employee.ekaant.co/api/programtracker?programType=${programType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.progress) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (dayIndex, activityIndex, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://employee.ekaant.co/api/programtracker/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          programType,
          dayIndex,
          activityIndex,
          completed
        })
      });
      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const unlockLevel = async (level) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://employee.ekaant.co/api/programtracker/unlocklevel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          programType,
          unlockedLevel: level
        })
      });
      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error unlocking level:', error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [programType]);

  return { progress, loading, updateProgress, unlockLevel };
};

// Custom hook for video handling
const useVideoPlayer = (onComplete) => {
  const videoRef = useRef(null);

  const handlePlay = () => {
    if (videoRef.current) {
      const stopTracking = startVideoTimeTracking('program', videoRef.current, 'buildResilience');
      videoRef.current.stopTracking = stopTracking;
    }
  };

  const handlePause = () => {
    if (videoRef.current?.stopTracking) {
      videoRef.current.stopTracking();
    }
  };

  const handleEnded = () => {
    if (videoRef.current?.stopTracking) {
      videoRef.current.stopTracking();
    }
    onComplete();
  };

  const handleError = () => {
    console.error("Video failed to load");
    if (videoRef.current?.stopTracking) {
      videoRef.current.stopTracking();
    }
  };

  return {
    videoRef,
    videoEvents: {
      onPlay: handlePlay,
      onPause: handlePause,
      onEnded: handleEnded,
      onError: handleError,
    }
  };
};


const BuildResilience = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  const handleVideoComplete = () => {
    if (!completedLevels.includes(program.journey[currentLevel].level)) {
      const updatedLevels = [...completedLevels, program.journey[currentLevel].level];
      setCompletedLevels(updatedLevels);
    }
  };

  const { videoRef, videoEvents } = useVideoPlayer(handleVideoComplete);
  const [completedLevels, setCompletedLevels] = useState([]); // Added state for completed levels
    const [isLoading, setIsLoading] = useState(true);
  const { progress, loading: isLoading2, updateProgress, unlockLevel } = useProgress('buildResilience');
  //const completedLevels = progress.activities.map(a => a.dayIndex); // Removed - now managed by state

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showLevels && currentLevel >= 0) {
      const element = document.getElementById(`level-${currentLevel}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showLevels, currentLevel]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://employee.ekaant.co/api/programtracker?programType=buildResilience', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.progress) {
            const completedActivities = data.progress.activities.filter(a => a.completed).map(a => a.dayIndex);
            setCompletedLevels(completedActivities);
            const maxLevel = Math.max(...data.progress.unlockedLevels, 0);
            setCurrentLevel(maxLevel);
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  useEffect(() => {
    const updateProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch('https://employee.ekaant.co/api/programtracker/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            programType: 'buildResilience',
            dayIndex: currentLevel,
            activityIndex: 0,
            completed: true
          })
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };

    if (completedLevels.includes(currentLevel)) {
      updateProgress();
    }
  }, [completedLevels, currentLevel]);

  const program = {
    name: "Build Resilience",
    rating: 4.8,
    reviews: 12,
    overview: {
      levels: 8,
      length: "40min",
    },
    description:
      "Do you hope to establish healthier personal routines but not sure where to start? You're not alone!\n\nThis program will encompass training the body and mind, with a holistic approach to help you become your best self. Our well-rounded approach will focus on a variety of exercises to improve mental performance, workouts to strengthen the physical body and sleep tips to support your overall health.\n\nYou will walk away from this program with an enhanced sense of self, and knowing with confidence.",
    experts: [
      {
        name: "Ruhi Kaur",
        photo: "https://a.eka.care/doctor-avatar/166443902037485?v=1664439891",
        rating: 4.9,
        reviews: 657,
        description: "Fostering resilience and self-discovery through leadership growth.",
      },
    ],
    journey: [
      {
        level: 1,
        name: "Mindfulness",
        video: "/assets/videos/7 Minute Guided Meditation for Focus [Hindi]. Hum Jeetenge Meditation(480P).mp4",
      },
      {
        level: 2,
        name: "Calm",
        video: "/assets/videos/5 Min Morning Yoga to FEEL AMAZING_(720P_HD).mp4",
      },
      {
        level: 3,
        name: "Confidence",
        video: "/assets/videos/10 min Yoga for Beginners - Gentle _ Simple Yoga Stretch(720P_HD).mp4",
      },
      {
        level: 4,
        name: "Focus",
        video: "/assets/videos/Guided Morning Meditation _ 10 Minutes To Start Every Day Perfectly ☮(720P_HD).mp4",
      },
      {
        level: 5,
        name: "Trust",
        video: "/assets/videos/Impact of 5 minutes meditation on your Daily Life _calm(480P).mp4",
      },
      {
        level: 6,
        name: "Optimism",
        video: "/assets/videos/Relaxed Awareness _ 5 Min Guided Meditation(720P_HD)_1.mp4",
      },
      {
        level: 7,
        name: "Control",
        video: "/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4",
      },
    ],
  };

  const handleStartProgram = () => {
    setOpenDialog(true);
  };

  const handleBeginSession = () => {
    setOpenDialog(false);
    setShowLevels(true);
  };

  const handleLevelClick = (index) => {
    const clickedLevel = program.journey[index].level;

    // Level 1 is always accessible
    if (clickedLevel === 1) {
      setCurrentLevel(index);
      return;
    }

    // Check if previous level has been completed
    const previousLevel = clickedLevel - 1;
    if (completedLevels.includes(previousLevel)) {
      setCurrentLevel(index);
    } else {
      alert(`Please complete Level ${previousLevel} first to unlock this level.`);
    }
  };

  const calculateProgress = () => {
    if (program.journey.length === 0) return 0;
    return (completedLevels.length / program.journey.length) * 100;
  };

  // Component for individual level items to optimize rendering
  const LevelItem = ({ level, index, isCurrent, isCompleted, onClick }) => {
    LevelItem.propTypes = {
      level: PropTypes.shape({
        level: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        video: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
      }).isRequired,
      index: PropTypes.number.isRequired,
      isCurrent: PropTypes.bool.isRequired,
      isCompleted: PropTypes.bool.isRequired,
      onClick: PropTypes.func.isRequired,
    };
    const videoRef = useRef(null);
    const handleVideoEnd = async () => {
      if (!completedLevels.includes(level.level)) {
        const updatedLevels = [...completedLevels, level.level];
        setCompletedLevels(updatedLevels);

        await updateProgress(level.level, 0, true);
        const nextLevel = level.level + 1;
        if (nextLevel <= program.journey.length) {
          await unlockLevel(nextLevel);
        }
      }
    };

    const videoEvents = {
      onPlay: () => {
        if (videoRef.current) {
          const stopTracking = startVideoTimeTracking('program', videoRef.current, 'buildResilience');
          videoRef.current.stopTracking = stopTracking;
        }
      },
      onPause: () => {
        if (videoRef.current?.stopTracking) {
          videoRef.current.stopTracking();
        }
      },
      onEnded: () => {
        if (videoRef.current?.stopTracking) {
          videoRef.current.stopTracking();
        }
        handleVideoEnd();
      },
      onError: () => {
        console.error("Video failed to load");
        if (videoRef.current?.stopTracking) {
          videoRef.current.stopTracking();
        }
      }
    };
    return (
      <motion.div
        id={`level-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        aria-label={`Level ${level.level}: ${level.name}`}
        onClick={() => onClick(index)}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
        }}
        className={`bg-gradient-to-r ${
          isCurrent 
            ? 'from-[#3F4169] to-[#2C2F47]' 
            : 'from-[#373951] to-[#2C2F47]'
        } p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
          isCurrent ? "border-2 border-indigo-500" : ""
        }`}
        role="button"
        tabIndex={0}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`rounded-full w-10 h-10 flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-600' 
                    : isCurrent 
                      ? 'bg-indigo-600' 
                      : 'bg-gray-700'
                }`}
              >
                <span className="text-white font-bold">{level.level}</span>
              </motion.div>
              <h3 className="text-xl font-bold text-white">
                {level.name}
              </h3>
            </div>
            <div className="flex items-center mt-1 text-gray-300">
              <span>⏱️ {level.duration} minutes</span>
            </div>
          </div>

          {index === 0 || completedLevels.includes(program.journey[index-1].level) ? (
            <Tooltip 
              title={isCompleted ? "Level Completed" : "Start this level"}
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#1E1B4B',
                    color: 'white',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    '& .MuiTooltip-arrow': {
                      color: '#1E1B4B',
                    }
                  }
                }
              }}
            >
              <Button 
                variant="contained" 
                className={`transition-all duration-300 transform hover:scale-105 ${
                  isCompleted 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                sx={{
                  borderRadius: '10px',
                  padding: '8px 16px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
                aria-label={isCompleted ? "Completed" : "Start Now"}
              >
                {isCompleted ? "Completed ✓" : "Start Now"}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip 
              title="Complete previous levels first"
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#1E1B4B',
                    color: 'white',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    '& .MuiTooltip-arrow': {
                      color: '#1E1B4B',
                    }
                  }
                }
              }}
            >
              <Button 
                variant="contained" 
                className="bg-gray-700 hover:bg-gray-600 transition-all"
                disabled
                sx={{
                  borderRadius: '10px',
                  padding: '8px 16px',
                  textTransform: 'none',
                }}
                aria-label="Locked Level"
              >
                Locked 🔒
              </Button>
            </Tooltip>
          )}
        </div>

        {index <= currentLevel && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="bg-black aspect-video rounded-lg overflow-hidden shadow-lg group">
              <video
                ref={videoRef}
                src={level.video}
                controls
                width="100%"
                height="100%"
                className="rounded-lg"
                preload={isCurrent ? "auto" : "metadata"}
                poster="https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                muted={false}
                autoPlay={false}
                {...videoEvents}
                aria-label={`Video for Level ${level.level}: ${level.name}`}
              >
                <track kind="captions" srcLang="en" label="English captions" />
                Your browser does not support the video tag or the video could not be loaded.
              </video>
            </div>

            {!isCompleted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-gray-300 bg-indigo-900 bg-opacity-50 p-2 rounded-lg text-sm"
              >
                💡 Watch the full video to mark this level as completed and unlock the next level.
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#2A2D4F] to-[#1F2937]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#2A2D4F] to-[#1F2937]">
      {/* Animated background elements */}
      <motion.div 
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-20 left-20 w-64 h-64 bg-indigo-900 rounded-full opacity-10 blur-xl"
      />
      <motion.div 
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute bottom-20 right-20 w-72 h-72 bg-purple-900 rounded-full opacity-10 blur-xl"
      />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-start mb-8 bg-gradient-to-r from-[#373951] to-[#2A2D4F] p-5 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                src="https://recruitment.growmo.re/wp-content/uploads/2022/09/7-how-to-prevent-burnout.jpg"
                alt="Program"
                className="w-20 h-20 rounded-lg shadow-md object-cover"
                aria-label="Program Image"
                whileHover={{ scale: 1.05 }}
              />
              <div>
                <div className="mb-2">
                  <Typography variant="h4" component="h1" className="font-bold text-white" sx={{ 
                    fontSize: '2rem',
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {program.name}
                  </Typography>
                  <div className="h-1 w-12 bg-indigo-400 rounded-full mt-2"></div>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <span aria-hidden="true">★★★★★</span>
                  <span className="text-white">{program.rating}</span>
                  <span className="text-gray-300">({program.reviews} reviews)</span>
                </div>

                {completedLevels.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ position: 'relative', width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={calculateProgress()} 
                        sx={{ 
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            background: 'linear-gradient(90deg, #6366F1 0%, #A855F7 100%)',
                          }
                        }}
                        aria-label="Program progress"
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography 
                          variant="caption" 
                          component="div" 
                          color="white"
                          sx={{ fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                        >
                          {`${Math.round(calculateProgress())}% COMPLETE`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </div>
            </div>
            {!showLevels && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  className="shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-2.5 text-lg font-medium"
                  onClick={handleStartProgram}
                  aria-label="Start Program"
                  sx={{
                    backgroundColor: '#6366F1',
                    '&:hover': {
                      backgroundColor: '#4F46E5',
                    },
                    borderRadius: '12px',
                    textTransform: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                    '&:active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  Start Program
                </Button>
              </motion.div>
            )}
          </motion.div>

          {showLevels ? (
            <div className="space-y-4">
             

              <Box className="flex gap-4 mb-8 overflow-x-auto pb-4">
                {program.journey.map((level, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex-shrink-0 ${
                      completedLevels.includes(level.level)
                        ? 'bg-gradient-to-r from-green-900 to-green-800'
                        : currentLevel === index
                        ? 'bg-gradient-to-r from-indigo-900 to-indigo-800'
                        : 'bg-[#1a1b26]'
                    } rounded-xl p-4 cursor-pointer border-2 ${
                      currentLevel === index ? 'border-indigo-500' : 'border-transparent'
                    }`}
                    onClick={() => handleLevelClick(index)}
                    style={{ minWidth: '220px' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="h6" className="font-semibold text-white">
                        Level {level.level}
                      </Typography>
                      {completedLevels.includes(level.level) && (
                        <span className="text-green-400">✓</span>
                      )}
                    </div>
                    <Typography variant="body2" className="text-gray-300 font-medium">
                      {level.name}
                    </Typography>
                    <div className="mt-2 flex items-center text-xs text-gray-400">
                      <span className="mr-2">⏱️ {level.duration}min</span>
                      {index === 0 || completedLevels.includes(program.journey[index-1].level) ? (
                        <span className="text-indigo-400">Unlocked</span>
                      ) : (
                        <span className="text-gray-500">Locked</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </Box>

              {currentLevel >= 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1a1b26] rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Typography variant="h5" className="text-white font-bold">
                        {program.journey[currentLevel].name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        ⏱️ {program.journey[currentLevel].duration} minutes
                      </Typography>
                    </div>
                    {completedLevels.includes(program.journey[currentLevel].level) && (
                      <Chip 
                        label="Completed" 
                        color="success" 
                        variant="outlined" 
                        size="small"
                      />
                    )}
                  </div>

                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <video
                      ref={videoRef}
                      src={program.journey[currentLevel].video}
                      controls
                      width="100%"
                      height="100%"
                      className="rounded-lg"
                      preload="auto"
                      poster="https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      {...videoEvents}
                    >
                      <track kind="captions" srcLang="en" label="English captions" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {!completedLevels.includes(program.journey[currentLevel].level) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-center text-gray-300 bg-indigo-900 bg-opacity-20 p-3 rounded-lg"
                    >
                      💡 Complete this video to unlock the next level
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
              <div className="col-span-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-[#373951] to-[#2C2F47] rounded-xl p-6 mb-6 shadow-lg"
                >
                  <div className="flex gap-4 mb-4">
                    <Chip 
                      label={`${program.overview.levels} Levels`} 
                      className="bg-indigo-700 text-white"
                      sx={{ 
                        backgroundColor: 'rgba(99, 102, 241, 0.8)', 
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '20px 5px'
                      }}
                      aria-label="Number of levels"
                    />
                    <Chip 
                      label={program.overview.length} 
                      className="bg-violet-700 text-white"
                      icon={<span className="mr-1">⏱️</span>}
                      sx={{ 
                        backgroundColor: 'rgba(124, 58, 237, 0.8)', 
                        color: 'white',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                      aria-label="Program length"
                    />
                  </div>
                  <Typography variant="body1" className="whitespace-pre-line text-gray-200 text-lg leading-relaxed">
                    {program.description}
                  </Typography>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-8"
                >
                  <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
                    <span className="mr-2">Your Journey</span>
                    <div className="h-1 bg-indigo-500 flex-grow rounded-full"></div>
                  </h2>
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-indigo-600 z-0"></div>

                    <div className="space-y-3">
                      {program.journey.map((level, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-[#30294e] p-4 rounded-xl shadow-md relative z-10 pl-12"
                          whileHover={{ x: 5 }}
                          aria-label={`Level ${level.level}: ${level.name}`}
                        >
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {level.level}
                          </div>
                          <Typography variant="h6" className="text-white">
                            {level.name}
                            <span className="ml-2 text-sm text-gray-400">({level.duration} min)</span>
                          </Typography>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                {program.experts.map((expert, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-gradient-to-r from-[#373951] to-[#2C2F47] p-6 rounded-xl shadow-lg"
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Your Expert Guide</h3>
                    <div className="flex flex-col items-center gap-4 mb-4">
                      <Avatar
                        src={expert.photo}
                        alt={expert.name}
                        sx={{ width: 100, height: 100, border: '3px solid #6366F1' }}
                        aria-label={`Expert ${expert.name}`}
                      />
                      <div className="text-center">
                        <Typography variant="h5" className="font-bold text-white">
                          {expert.name}
                        </Typography>
                        <div className="flex items-center justify-center gap-2 text-amber-300 mt-1">
                          <span aria-hidden="true">★★★★★</span>
                          <span className="text-white">{expert.rating}</span>
                          <span className="text-gray-400">({expert.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#2A2B3D] p-4 rounded-lg mt-4">
                      <Typography variant="body1" className="text-gray-200 italic">
                        &quot;{expert.description}&quot;
                      </Typography>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Chip 
                        label="Certified Coach" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                          color: '#A5B4FC',
                          border: '1px solid #6366F1'
                        }}
                        aria-label="Certified Coach"
                      />
                      <Chip 
                        label="10+ Years Experience" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                          color: '#A5B4FC',
                          border: '1px solid #6366F1'
                        }}
                        aria-label="10+ Years Experience"
                      />
                      <Chip 
                        label="Wellness Specialist" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                          color: '#A5B4FC',
                          border: '1px solid #6366F1'
                        }}
                        aria-label="Wellness Specialist"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8"
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/program")}
              className="text-white border-indigo-500 hover:bg-indigo-900 hover:bg-opacity-30 transition-all duration-300"
              startIcon={<span>←</span>}
              aria-label="Back to Programs"
              sx={{
                borderColor: '#6366F1',
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                padding: '8px 16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: '#818CF8',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              Back to Programs
            </Button>
          </motion.div>

          <Dialog 
            open={openDialog} 
            onClose={() => setOpenDialog(false)}
            PaperProps={{
              style: {
                backgroundColor: '#2C2F47',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '500px',
                width: '100%',
              }
            }}
            aria-labelledby="welcome-dialog-title"
          >
            <DialogContent className="text-white p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 id="welcome-dialog-title" className="text-2xl font-bold mb-2 text-center text-indigo-300">
                  Welcome to {program.name}!
                </h2>
                <div className="w-full flex justify-center my-4">
                  <div className="w-16 h-1 bg-indigo-500 rounded-full"></div>
                </div>
                <p className="mb-6 text-center text-gray-300 text-lg">
                  Are you ready to start your journey towards better mental
                  well-being and prevent burnout?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      onClick={() => setOpenDialog(false)}
                      className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-30 transition-all"
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',                        fontWeight: 'medium',
                        padding: '10px 16px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      aria-label="Cancel and close dialog"
                    >
                      Not right now
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="contained"
                      className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                      onClick={handleBeginSession}
                      aria-label="Begin Program"
                      sx={{
                        backgroundColor: '#6366F1',
                        '&:hover': {
                          backgroundColor: '#4F46E5',
                        },
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        padding: '10px 16px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      Begin My Journey
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <style>{`
        video::-webkit-media-controls-panel {
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
        }
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-mute-button,
        video::-webkit-media-controls-current-time-display,
        video::-webkit-media-controls-time-remaining-display {
          color: white;
        }
        video::-webkit-media-controls-timeline {
          background-color: rgba(255,255,255,0.2);
          border-radius: 4px;
          height: 4px;
        }
        video::-webkit-media-controls-volume-slider {
          background-color: rgba(255,255,255,0.2);
          border-radius: 4px;
          height: 4px;
        }
      `}</style>
    </div>
  );
};

BuildResilience.propTypes = {
  program: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    overview: PropTypes.shape({
      levels: PropTypes.number.isRequired,
      length: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
    experts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        reviews: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
    journey: PropTypes.arrayOf(
      PropTypes.shape({
        level: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        video: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
export default BuildResilience;
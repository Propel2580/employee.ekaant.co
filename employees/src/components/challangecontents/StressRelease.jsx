import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Card, CardContent, Chip, IconButton, Tooltip, LinearProgress, Badge } from '@mui/material';
import { updateWatchTimeStatistics, startVideoTimeTracking } from "../charts/LineChart";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MeditationIcon from '@mui/icons-material/SelfImprovement';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

const weeklyPlan = [
  {
    day: 'Day 1',
    title: 'Morning Energy & Focus',
    timeOfDay: '6:00 AM - 7:00 AM',
    activities: [
      {
        name: 'Sun Salutations',
        duration: '15 minutes',
        level: 'Beginner',
        equipment: ['Yoga mat'],
        description: 'Start with 5 rounds of Sun Salutation A, followed by 3 rounds of Sun Salutation B',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      },
      {
        name: 'Breathing Exercise',
        duration: '20 minutes',
        technique: 'Square Breathing',
        description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4'
      },
      {
        name: 'speed running',
        duration: '10 minutes',
        technique: 'Squ',
        description: ' take long steps'
      },
      {
        name: 'Guided Meditation',
        duration: '10 minutes',
        focus: 'Morning Clarity',
        description: 'Focus on breath awareness and setting intentions for the day',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      }
    ]
  },
  {
    day: 'Day 2',
    title: 'Evening Wind Down',
    timeOfDay: '7:00 AM - 8:00 PM',
    activities: [
      {
        name: 'Yin Yoga Sequence',
        duration: '25 minutes',
        level: 'All Levels',
        equipment: ['Yoga mat', 'Bolster', 'Blocks'],
        description: 'Gentle hip openers and forward folds',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      },
      {
        name: 'Progressive Relaxation',
        duration: '15 minutes',
        technique: 'Body Scan',
        description: 'Systematic relaxation from toes to head'
      }
    ]
  },
  {
    day: 'Day 3',
    title: ' Focus',
    timeOfDay: '6:00 AM - 7:00 AM',
    activities: [
      {
        name: 'Sun Salutations',
        duration: '15 minutes',
        level: 'Beginner',
        equipment: ['Yoga mat'],
        description: 'Start with 5 rounds of Sun Salutation A, followed by 3 rounds of Sun Salutation B',
        video: '/assets/videos/10 min Yoga for Beginners - Gentle _ Simple Yoga Stretch(720P_HD).mp4'
      },
      {
        name: 'Breathing long',
        duration: '25 minutes',
        technique: 'Square Breathing',
        description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4'
      },
      {
        name: 'running',
        duration: '15 minutes',
        technique: 'Squ',
        description: ' take long steps'
      },
      {
        name: 'Guided Meditation',
        duration: '10 minutes',
        focus: 'Morning Clarity',
        description: 'Focus on breath awareness and setting intentions for the day',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      }
    ]
  },
  {
    day: 'Day 4',
    title: 'Evening Wind Down',
    timeOfDay: '7:00 AM - 8:00 PM',
    activities: [
      {
        name: 'Yoga Sequence',
        duration: '15 minutes',
        level: 'All Levels',
        equipment: ['Yoga mat', 'Bolster', 'Blocks'],
        description: 'Gentle hip openers and forward folds',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      },
      {
        name: 'Pro Relaxation',
        duration: '5 minutes',
        technique: 'Body Scan',
        description: 'Systematic relaxation from toes to head'
      }
    ]
  },
  {
    day: 'Day 5',
    title: 'Streatching ',
    timeOfDay: '6:00 AM - 7:00 AM',
    activities: [
      {
        name: 'Sun Salutations',
        duration: '15 minutes',
        level: 'Beginner',
        equipment: ['Yoga mat'],
        description: 'Start with 5 rounds of Sun Salutation A, followed by 3 rounds of Sun Salutation B',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      },
      {
        name: 'core exercise',
        duration: '20 minutes',
        technique: 'Square Breathing',
        description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4'
      },
      {
        name: 'jogging',
        duration: '10 minutes',
        technique: 'Sqare',
        description: ' long steps , slow slow'
      },
      {
        name: 'Meditation',
        duration: '10 minutes',
        focus: 'Morning Clarity',
        description: 'Focus on breath awareness and setting intentions for the day',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      }
    ]
  },
  {
    day: 'Day 6',
    title: 'Water',
    timeOfDay: '7:00 AM - 8:00 PM',
    activities: [
      {
        name: 'Yoga ',
        duration: '25 minutes',
        level: 'All Levels',
        equipment: ['Yoga mat', 'Bolster', 'Blocks'],
        description: 'Gentle hip openers and forward folds',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      },
      {
        name: 'Progressive Relaxation',
        duration: '15 minutes',
        technique: 'Body Scan',
        description: 'Systematic relaxation from toes to head'
      }
    ]
  },
  {
    day: 'Day 7',
    title: 'Energy & Focus',
    timeOfDay: '6:00 AM - 7:00 AM',
    activities: [
      {
        name: 'Sun Salutations',
        duration: '15 minutes',
        level: 'Beginner',
        equipment: ['Yoga mat'],
        description: 'Start with 5 rounds of Sun Salutation A, followed by 3 rounds of Sun Salutation B',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      },
      {
        name: 'Breathing ',
        duration: '20 minutes',
        technique: 'Square Breathing',
        description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4'
      },
      {
        name: 'speed run',
        duration: '10 minutes',
        technique: 'Squ',
        description: ' take long steps'
      },
      {
        name: 'Guided Meditation',
        duration: '10 minutes',
        focus: 'Morning Clarity',
        description: 'Focus on breath awareness and setting intentions for the day',
        video: '/assets/videos/Yoga For Neck_ Shoulders_ Upper Back  _  10-Minute Yoga Quickie(720P_HD).mp4'
      }
    ]
  },

];

export default function StressRelease() {
 const [selectedDay, setSelectedDay] = useState(0);
    const [progress, setProgress] = useState({});
  
    const [unlockedDays, setUnlockedDays] = useState([0]);
  
    useEffect(() => {
      const fetchProgress = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('https://employee.ekaant.co/api/challengeprogresstracking?challengeType=stressRelease', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success && data.progress) {
            const progressMap = {};
            data.progress.activities.forEach(activity => {
              progressMap[`${activity.dayIndex}-${activity.activityIndex}`] = activity.completed;
            });
            setProgress(progressMap);
            if (data.progress.unlockedDays) {
              setUnlockedDays(data.progress.unlockedDays);
            }
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      };
      fetchProgress();
    }, []);
  
    const checkDayCompletion = (dayIndex) => {
      const dayActivities = weeklyPlan[dayIndex].activities;
      return dayActivities.every((_, actIndex) => progress[`${dayIndex}-${actIndex}`]);
    };
  
    const handleDayClick = (index) => {
      if (!unlockedDays.includes(index)) {
        alert('Please complete all activities of the previous day to unlock this day.');
        return;
      }
      setSelectedDay(index);
    };
    const [playingVideo, setPlayingVideo] = useState(null);
    const [activityTimers, setActivityTimers] = useState({});
    const [timerIntervals, setTimerIntervals] = useState({});
  
    const startActivityTimer = (dayIndex, activityIndex, duration) => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.pause();
        const videoIndex = video.getAttribute('data-index');
        if (videoIndex === playingVideo?.toString() && window.currentVideoTracker) {
          window.currentVideoTracker();
          window.currentVideoTracker = null;
        }
      });
      setPlayingVideo(null);
  
      Object.keys(timerIntervals).forEach(key => {
        clearInterval(timerIntervals[key]);
      });
      setTimerIntervals({});
  
      const minutes = parseInt(duration.split(' ')[0]);
      const totalSeconds = minutes * 60;
      let lastMinute = Math.ceil(totalSeconds / 60);
  
      setActivityTimers(prev => ({
        ...prev,
        [`${dayIndex}-${activityIndex}`]: totalSeconds
      }));
  
      // Initialize last update time
      let lastUpdateTime = Date.now();
  
      const intervalId = setInterval(() => {
        setActivityTimers(prev => {
          const currentTime = prev[`${dayIndex}-${activityIndex}`];
          if (currentTime <= 1) {
            clearInterval(timerIntervals[`${dayIndex}-${activityIndex}`]);
            return { ...prev, [`${dayIndex}-${activityIndex}`]: 0 };
          }
          const newTime = currentTime - 1;
  
          // Check if a minute has passed
          const currentRealTime = Date.now();
          const minutesPassed = Math.floor((currentRealTime - lastUpdateTime) / 60000);
  
          if (minutesPassed > 0) {
            updateWatchTimeStatistics('challenges', 1);
            lastUpdateTime = currentRealTime;
          }
  
          return { ...prev, [`${dayIndex}-${activityIndex}`]: newTime };
        });
      }, 1000);
  
      setTimerIntervals(prev => ({
        ...prev,
        [`${dayIndex}-${activityIndex}`]: intervalId
      }));
    };
  
    const pauseActivityTimer = (dayIndex, activityIndex) => {
      clearInterval(timerIntervals[`${dayIndex}-${activityIndex}`]);
      setTimerIntervals(prev => ({
        ...prev,
        [`${dayIndex}-${activityIndex}`]: null
      }));
    };
  
    const resumeActivityTimer = (dayIndex, activityIndex) => {
      const remainingTime = activityTimers[`${dayIndex}-${activityIndex}`];
      if (remainingTime > 0) {
        const intervalId = setInterval(() => {
          setActivityTimers(prev => {
            const currentTime = prev[`${dayIndex}-${activityIndex}`];
            if (currentTime <= 1) {
              clearInterval(timerIntervals[`${dayIndex}-${activityIndex}`]);
              return { ...prev, [`${dayIndex}-${activityIndex}`]: 0 };
            }
            return { ...prev, [`${dayIndex}-${activityIndex}`]: currentTime - 1 };
          });
        }, 1000);
  
        setTimerIntervals(prev => ({
          ...prev,
          [`${dayIndex}-${activityIndex}`]: intervalId
        }));
      }
    };
  
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(1, '0')}`;
    };
  
    useEffect(() => {
      return () => {
        Object.values(timerIntervals).forEach(interval => clearInterval(interval));
      };
    }, [timerIntervals]);
  
  
    const markActivityComplete = async (dayIndex, activityIndex) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://employee.ekaant.co/api/challengeprogresstracking/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            challengeType: 'stressRelease',
            dayIndex,
            activityIndex,
            completed: true
          })
        });
  
        if (response.ok) {
          setProgress(prev => ({ ...prev, [`${dayIndex}-${activityIndex}`]: true }));
          // Check if all activities for the day are completed
          const updatedProgress = { 
            ...progress, 
            [`${dayIndex}-${activityIndex}`]: true 
          };
          const allCompleted = weeklyPlan[dayIndex].activities.every(
            (_, idx) => updatedProgress[`${dayIndex}-${idx}`]
          );
  
          if (allCompleted && dayIndex + 1 < weeklyPlan.length) {
            // Unlock next day
            const nextDayIndex = dayIndex + 1;
            if (!unlockedDays.includes(nextDayIndex)) {
              const unlockResponse = await fetch('https://employee.ekaant.co/api/challengeprogresstracking/unlockday', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  challengeType: 'stressRelease',
                  unlockedDay: nextDayIndex
                })
              });
              
              if (unlockResponse.ok) {
                setUnlockedDays(prev => [...prev, nextDayIndex]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };
  
    const handleVideoPlay = (index) => {
      Object.keys(timerIntervals).forEach(key => {
        clearInterval(timerIntervals[key]);
      });
      setTimerIntervals({});
      setActivityTimers(prev => {
        const newTimers = {...prev};
        Object.keys(newTimers).forEach(key => {
          if (newTimers[key] > 0) {
            newTimers[key] = undefined;
          }
        });
        return newTimers;
      });
  
      const video = document.querySelector(`video[data-index="${index}"]`);
      if (video) {
        if (playingVideo !== null && playingVideo !== index) {
          const currentVideo = document.querySelector(`video[data-index="${playingVideo}"]`);
          if (currentVideo) {
            currentVideo.pause();
            if (window.currentVideoTracker) {
              window.currentVideoTracker();
              window.currentVideoTracker = null;
            }
          }
        }
  
        if (playingVideo === index) {
          video.pause();
          setPlayingVideo(null);
          if (window.currentVideoTracker) {
            window.currentVideoTracker();
            window.currentVideoTracker = null;
          }
        } else {
          video.play();
          setPlayingVideo(index);
          let lastMinuteUpdate = Date.now();
          let watchedSeconds = 0;
  
          const trackingInterval = setInterval(() => {
            if (!video.paused && !video.ended) {
              watchedSeconds++;
              if (watchedSeconds >= 60) {
                updateWatchTimeStatistics('challenges', 1);
                watchedSeconds = 0;
                // Update database with progress
                fetch('https://employee.ekaant.co/api/linechart/update', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({
                    month: new Date().toLocaleString('default', { month: 'short' }),
                    category: 'challenges',
                    duration: 1,
                    operation: 'increase'
                  })
                });
              }
            }
          }, 1000);
  
          window.currentVideoTracker = () => {
            clearInterval(trackingInterval);
            if (watchedSeconds >= 60) {
              updateWatchTimeStatistics('challenges', 1);
            }
          };
        }
      }
    };
  
    const calculateDayProgress = (dayIndex) => {
      const totalActivities = weeklyPlan[dayIndex].activities.length;
      const completedActivities = weeklyPlan[dayIndex].activities.reduce((acc, _, actIndex) => {
        return acc + (progress[`${dayIndex}-${actIndex}`] ? 1 : 0);
      }, 0);
      return (completedActivities / totalActivities) * 100;
    };
  
    const checkAndUnlockNextDay = (currentDayIndex) => {
      // Check if all activities for the current day are complete
      const currentDay = weeklyPlan[currentDayIndex];
      const allActivitiesComplete = currentDay.activities.every((_, index) => progress[`${currentDayIndex}-${index}`]);
  
      if (allActivitiesComplete && currentDayIndex < weeklyPlan.length -1) {
        // Unlock the next day (you might need to update UI here to reflect the unlock)
        console.log(`Day ${currentDayIndex + 2} unlocked!`);
        //Persist this unlock state to your backend/database as needed.
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1c3b] to-[#2d2f45] p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Typography 
              variant="h3" 
              className="text-white font-bold tracking-tight mb-2 text-center"
              sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Stress Release Program
            </Typography>
            <Typography 
              variant="subtitle1" 
              className="text-gray-100 text-center mb-4"
            >
              Transform your well-being one day at a time
            </Typography>
          </motion.div>
  
          <Box className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
            {weeklyPlan.map((day, index) => (
              <motion.div
                key={day.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex-shrink-0"
              >
                <Card 
                  className={`w-48 ${
                    selectedDay === index 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-800' 
                      : 'bg-gray-800 hover:bg-gray-750'
                  } rounded-xl shadow-lg transition-all duration-300`}
                  onClick={() => handleDayClick(index)}
                >
                  <CardContent className="relative p-4">
                    <Typography variant="h6" className="font-semibold mb-1">
                      {day.day}
                    </Typography>
                    <Typography variant="body2" className="text-blue-500 mb-3 truncate">
                      {day.title}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateDayProgress(index)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(245, 11, 11, 0.12)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: calculateDayProgress(index) === 100 ? '#22c55e' : '#818cf7'
                        }
                      }}
                    />
                    {calculateDayProgress(index) === 100 && (
                      <CheckCircleIcon 
                        className="absolute top-2 right-2 text-green-400"
                        fontSize="small"
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 5 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h4" className=" font-bold mb-2">
                      {weeklyPlan[selectedDay].title}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <AccessTimeIcon className="text-indigo-400" fontSize="small" />
                      <Typography variant="subtitle2" className="text-gray-900">
                        {weeklyPlan[selectedDay].timeOfDay}
                      </Typography>
                    </div>
                  </div>
                  <Chip 
                    icon={<LocalFireDepartmentIcon />}
                    label={`${Math.round(calculateDayProgress(selectedDay))}% Complete`}
                    className="bg-indigo-900"
                  />
                </div>
  
                <div className="space-y-6">
                  {weeklyPlan[selectedDay].activities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`bg-gray-750 border-l-4 ${
                          progress[`${selectedDay}-${index}`] 
                            ? 'border-green-500' 
                            : 'border-indigo-500'
                        } rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <Typography variant="h6" className=" flex items-center gap-2">
                              {activity.name === 'Guided Meditation' ? (
                                <MeditationIcon className="text-purple-400" />
                              ) : activity.name.toLowerCase().includes('yoga') ? (
                                <FitnessCenterIcon className="text-blue-500" />
                              ) : (
                                <DirectionsRunIcon className="text-green-600" />
                              )}
                              {activity.name}
                            </Typography>
                            <div className="flex gap-2">
                              <Chip 
                                label={activity.duration}
                                size="small"
                                className="bg-indigo-900 text-indigo-800"
                              />
                              {activity.level && (
                                <Chip 
                                  label={activity.level}
                                  size="small"
                                  className="bg-purple-900 text-purple-200"
                                />
                              )}
                            </div>
                          </div>
  
                          <Typography variant="body2" className="text-gray-800 mb-4">
                            {activity.description}
                          </Typography>
  
                          {activity.equipment && (
                            <div className="mb-4 p-3 bg-gray-850 rounded-lg">
                              <Typography variant="subtitle2" className="text-gray-700 mb-2">
                                Equipment Needed:
                              </Typography>
                              <div className="flex flex-wrap gap-2">
                                {activity.equipment.map((item, i) => (
                                  <Chip 
                                    key={i}
                                    label={item}
                                    size="small"
                                    className="bg-gray-700 text-gray-500"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
  
                          {activity.video && (
                            <div className="relative rounded-lg overflow-hidden mb-4 group">
                              <video
                                src={activity.video}
                                data-index={index}
                                className="w-full aspect-video rounded-lg"
                                preload="metadata"
                                controls
                                controlsList="nodownload"
                                playsInline
                                onEnded={(e) => {
                                  markActivityComplete(selectedDay, index);
                                  if (e.target.stopTracking) {
                                    e.target.stopTracking();
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bottom-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => handleVideoPlay(index)}>
                                <IconButton
                                  className="bg-white/40 hover:bg-white/30 z-10"
                                >
                                  {playingVideo === index ? <PauseIcon /> : <PlayArrowIcon />}
                                </IconButton>
                              </div>
                            </div>
                          )}
  
                          {!activity.video && (
                            <div className="mb-4">
                              {activityTimers[`${selectedDay}-${index}`] !== undefined ? (
                                <div className="flex items-center justify-between p-4 bg-gray-850 rounded-lg">
                                  <Typography variant="h4" className=" font-mono">
                                    {formatTime(activityTimers[`${selectedDay}-${index}`])}
                                  </Typography>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`px-4 py-2 rounded-lg ${
                                        timerIntervals[`${selectedDay}-${index}`]
                                          ? 'bg-yellow-600 hover:bg-yellow-700'
                                          : 'bg-green-600 hover:bg-green-700'
                                      } text-white font-medium transition-colors`}
                                      onClick={() => {
                                        timerIntervals[`${selectedDay}-${index}`]
                                          ? pauseActivityTimer(selectedDay, index)
                                          : resumeActivityTimer(selectedDay, index);
                                      }}
                                    >
                                      {timerIntervals[`${selectedDay}-${index}`] ? 'Pause' : 'Resume'}
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                      onClick={() => {
                                        pauseActivityTimer(selectedDay, index);
                                        setActivityTimers(prev => ({
                                          ...prev,
                                          [`${selectedDay}-${index}`]: undefined
                                        }));
                                      }}
                                    >
                                      Reset
                                    </motion.button>
                                  </div>
                                </div>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                                  onClick={() => startActivityTimer(selectedDay, index, activity.duration)}
                                >
                                  <PlayArrowIcon />
                                  Start Timer
                                </motion.button>
                              )}
                            </div>
                          )}
  
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full px-4 py-3 rounded-lg ${
                              progress[`${selectedDay}-${index}`]
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white font-medium transition-colors flex items-center justify-center gap-2`}
                            onClick={() => {
                              if (activityTimers[`${selectedDay}-${index}`] === 0 || 
                                  (activity.video && playingVideo === index)) {
                                markActivityComplete(selectedDay, index);
                              }
                            }}
                            disabled={!(activityTimers[`${selectedDay}-${index}`] === 0 || 
                                      (activity.video && playingVideo === index))}
                          >
                            <CheckCircleIcon />
                            {progress[`${selectedDay}-${index}`] ? 'Completed' : 'Mark as Complete'}
                          </motion.button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }
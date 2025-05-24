
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useCredits } from "../context/CreditsContext";

const experts = [
  { 
    image: "/doc1.png", 
    name: "Ms.Saumya Sharan", 
    specialization: "Anxiety", 
    rating: 4.5,
    levels: 10,
    overview: "Saumya is a Clinical Psychologist with over 8+ years of experience. Her areas of expertise include depression, anxiety, self-esteem issues, emotional exhaustion, stress, adjustment issues, interpersonal relationship concerns, social anxiety, self-confidence concerns, and panic attacks.",
    email: "ekaant.co@gmail.com",
    availability: [
      {
        date: "2025-05-22",
        slots: [
         
          { start: "13:00", end: "13:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-04-23",
        slots: [
          
          { start: "15:00", end: "15:45" },
          { start: "16:00", end: "16:45" }
        ]
      },
      {
        date: "2025-05-26",
        slots: [
          
          { start: "13:00", end: "13:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-05-27",
        slots: [
          
          { start: "11:00", end: "11:45" },
          { start: "14:00", end: "14:45" }
        ]
      }
    ]

  },
  { 
    image: "/doc2.png", 
    name: "Ms.Swati sharma", 
    specialization: "Mindfulness at Work", 
    rating: 4.3,
    levels: 8,
    overview: "Swati Sharma is a seasoned professional in social work and psychological wellness with more than 6+ years of experience. She has worked extensively in foster care, drug education, and individual, family, and couples counseling.  Her expertise includes crisis counseling for adolescents, psychological first aid, and addressing relationship challenges. Swati specializes in managing social anxiety, trauma, stress, anger, and emotional well-being. ",
    email: "ekaant.co@gmail.com",
    availability: [
          {
        date: "2025-05-22",
        slots: [
         
          { start: "13:00", end: "13:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-04-23",
        slots: [
          
          { start: "15:00", end: "15:45" },
          { start: "16:00", end: "16:45" }
        ]
      },
      {
        date: "2025-05-26",
        slots: [
          
          { start: "13:00", end: "13:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-05-27",
        slots: [
          
          { start: "11:00", end: "11:45" },
          { start: "14:00", end: "14:45" }
        ]
      }
      ]
  },
  { 
    image: "/doc3.png", 
    name: "Vishwa Puranik", 
    specialization: "Overcoming Sleep Struggles", 
    rating: 4.7,
    levels: 12,
    overview: "With over a decade of experience in counseling psychologists, Ms. Vishwa Puranik specializes in evidence-based practices to enhance mental health and well-being. Her areas of expertise include family counseling, parenting support, adolescent therapy, women’s issues, mindfulness practices and many more. As a certified Yoga Teacher, her holistic approach fosters balance and resilience. With a compassionate and tailored style, she empowers clients to thrive in all aspects of life.",
    email: "ekaant.co@gmail.com",
    availability: [
          {
        date: "2025-05-22",
        slots: [
         
          { start: "13:00", end: "13:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-04-23",
        slots: [
          
          { start: "15:00", end: "15:45" },
          { start: "16:00", end: "16:45" }
        ]
      },
      {
        date: "2025-05-26",
        slots: [
          
          { start: "17:00", end: "17:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-05-27",
        slots: [
          
          { start: "17:00", end: "17:45" },
          { start: "14:00", end: "14:45" }
        ]
      }
      ]
  },
  { 
    image: "/doc4.png", 
    name: "Dr.Shweta Sharma", 
    specialization: "Yoga Practitioner", 
    rating: 4.6,
    levels: 9,
    overview: "Dr. Shweta Sharma is a licensed Clinical Psychologist with the Rehabilitation Council of India [A-24504] and has experience of more than 12 years in this field of mental health. Her expertise lies in Cognitive Behavior Therapy, Psychoanalysis, Marital therapy, Neuropsychological Problems and assessment, and Personality Assessment.",
    email: "ekaant.co@gmail.com",
    availability: [
         {
        date: "2025-05-22",
        slots: [
         
          { start: "13:00", end: "13:45" },
          { start: "14:00", end: "14:45" }
        ]
      },
      {
        date: "2025-04-23",
        slots: [
          
          { start: "15:00", end: "15:45" },
          { start: "16:00", end: "16:45" }
        ]
      },
      {
        date: "2025-05-27",
        slots: [
          
          { start: "13:00", end: "13:45" },
          { start: "15:00", end: "15:45" }
        ]
      },
      {
        date: "2025-05-28",
        slots: [
          
          { start: "12:00", end: "12:45" },
          { start: "18:00", end: "18:45" }
        ]
      }
      ]
  }
];

const Expert = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [cancellingSession, setCancellingSession] = useState(null);
const [showAllSessions, setShowAllSessions] = useState(false);

  const { credits, updateCredits } = useCredits(); 

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No authentication token found. Please log in.");
          showNotification("You are not logged in. Please log in first.", "error");
          return;
        }

        setIsLoading(true);
        const response = await axios.get("https://employee.ekaant.co/api/employee/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,  
        });

        console.log("✅ Fetched Employee Data:", response.data);
        setEmployeeEmail(response.data.employee.email);
        setEmployeeId(response.data.employee._id);
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error fetching employee data:", error);
        showNotification("Failed to fetch employee profile. Please log in again.", "error");
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const [bookedSessions, setBookedSessions] = useState([]);

  useEffect(() => {
    const fetchBookedSessions = async () => {
      if (!employeeEmail) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://employee.ekaant.co/api/expert-session/employee/${employeeEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          const activeSessions = response.data.sessions.filter(session => 
            !session.cancelledAt && session.status !== 'cancelled'
          );
          const sessionIds = activeSessions.map(session => 
            `${session.expertEmail}_${new Date(session.sessionDate).toISOString().split('T')[0]}_${new Date(session.startDateTime).toTimeString().substring(0, 5)}_${session.employeeEmail}`
          );
          setBookedSessions(sessionIds);
        }
      } catch (error) {
        console.error("Error fetching booked sessions:", error);
      }
    };

    fetchBookedSessions();
  }, [employeeEmail]);

  // Cost for one expert consultation session
const SESSION_COST = 100; 

  const handleBooking = async () => {
    try {
        if (!selectedDate || !selectedStartTime || !selectedEndTime) {
            showNotification("Please select both date and time slot.", "error");
            return;
        }

        // Check if slot is already booked
        const checkResponse = await axios.get(
            `https://employee.ekaant.co/api/expert-session/check-availability/${selectedExpert.email}/${selectedDate}/${selectedStartTime}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        if (checkResponse.data.isBooked) {
            showNotification("This time slot is already booked. Please select another slot.", "error");
            return;
        }

        // Validate booking time
        const now = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${selectedStartTime}`);
        const bufferTime = new Date(now.getTime() + 2 * 60000); 

        if (selectedDateTime < now) {
            showNotification("Cannot book sessions in the past.", "error");
            return;
        }

        if (selectedDateTime < bufferTime) {
            showNotification("Please book sessions at least 2 minutes in advance.", "error");
            return;
        }

        // Create unique session ID for tracking
        const sessionId = `${selectedExpert.email}_${selectedDate}_${selectedStartTime}_${employeeEmail}`;

        if (!employeeId || !employeeEmail) {
            showNotification("Please log in to book a session.", "error");
            return;
        }

        if (!selectedExpert?.email) {
            showNotification("Expert details are missing!", "error");
            return;
        }

        // Check if session is already booked
        const isAlreadyBooked = bookedSessions.includes(sessionId);
        if (isAlreadyBooked) {
            showNotification("You've already booked this session.", "error");
            return;
        }

        // Verify sufficient credits using context
        if (credits < SESSION_COST) {
            showNotification(`Insufficient credits. Need ${SESSION_COST} credits.`, "error");
            return;
        }

        setIsLoading(true);

        // Deduct credits using context
        try {
            await updateCredits(SESSION_COST, 'subtract');
        } catch (error) {
            console.error("Failed to update credits:", error);
            showNotification("Failed to deduct credits. Please try again.", "error");
            setIsLoading(false);
            return;
        }

        const requestBody = {
            employeeEmail,
            employeeId,
            expertEmail: selectedExpert.email,
            expertName: selectedExpert.name,
            specialization: selectedExpert.specialization,
            sessionDate: selectedDate,
            startDateTime: new Date(`${selectedDate}T${selectedStartTime}`).toISOString(),
            endDateTime: new Date(`${selectedDate}T${selectedEndTime}`).toISOString()
        };

        console.log("Sending request with body:", requestBody);

        console.log("📤 Sending Booking Request...", requestBody); 

        const token = localStorage.getItem("token");
        const response = await axios.post(
            "https://employee.ekaant.co/api/expert-session/book",
            requestBody,
            { 
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            }
        );

        const selectedSession = response.data.session; 


        console.log("✅ Credits deducted successfully");

        // Update booked sessions
        const updatedSessions = [...bookedSessions, sessionId];
        setBookedSessions(updatedSessions);
        localStorage.setItem(`bookedSessions_${employeeEmail}`, JSON.stringify(updatedSessions));


        // Create notification in backend
        const notificationData = {
            title: "Mental Health Session Booked",
            date: selectedDate,
            time: selectedStartTime,
            duration: "60 minutes",
            price: `${SESSION_COST} credits`,
            doctorName: selectedExpert.name,
            doctorSpecialty: selectedExpert.specialization,
            sessionDate: new Date(selectedDate),
            type: 'expert'
        };

        try {
            await axios.post(
                "https://employee.ekaant.co/api/notifications",
                notificationData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error("Error creating notification:", error);
        }

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
              category: 'Experts',
              operation: 'increase' 
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

        // Update LineChart with session duration
        const startMinutes = parseInt(selectedStartTime.split(':')[0]) * 60 + parseInt(selectedStartTime.split(':')[1]);
        const endMinutes = parseInt(selectedEndTime.split(':')[0]) * 60 + parseInt(selectedEndTime.split(':')[1]);
        const durationMinutes = endMinutes - startMinutes;

        // Update MongoDB LineChart
        try {
          const token = localStorage.getItem("token");
          await fetch('https://employee.ekaant.co/api/linechart/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              month: currentMonth,
              category: 'expert',
              duration: durationMinutes,
              operation: 'increase'
            })
          });
        } catch (error) {
          console.error('Failed to update line chart:', error);
        }

        // Dispatch events to update UI
        window.dispatchEvent(new CustomEvent("expertBookingUpdated"));
        window.dispatchEvent(new Event("viewDataUpdated"));

        console.log("✅ Booking Successful!");
        showNotification(`Session booked with ${selectedExpert.name} on ${selectedDate}!`);
        setIsLoading(false);
    } catch (error) {
        console.error("❌ Error booking session:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Failed to book session. Please try again.";
        showNotification(errorMessage, "error");
        setIsLoading(false);
    }
};

  const handleCancelBooking = async (sessionId) => {
    try {
      setCancellingSession(sessionId);
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication required. Please log in again.", "error");
        setCancellingSession(null);
        return;
      }

      const [expertEmail, sessionDate, startTime, employeeEmail] = sessionId.split('_');

      // Validate cancellation timing
      const sessionDateTime = new Date(`${sessionDate}T${startTime}`);
      const now = new Date();
      if (sessionDateTime < now) {
        showNotification("Cannot cancel past sessions", "error");
        setCancellingSession(null);
        return;
      }

      const response = await axios.post(
        `https://employee.ekaant.co/api/expert-session/cancel/${employeeEmail}`,
        { 
          expertEmail,
          sessionDate,
          startTime,
          reason: 'Cancelled by employee' 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        try {
          // Refund credits using context
          await updateCredits(SESSION_COST, 'add');
          console.log("✅ Credits refunded successfully");

          // Update sessions list
          const updatedSessions = bookedSessions.filter(id => id !== sessionId);
          setBookedSessions(updatedSessions);
          localStorage.setItem(`bookedSessions_${employeeEmail}`, JSON.stringify(updatedSessions));

          // Update bar chart data in MongoDB for cancellation
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
                category: 'Experts',
                operation: 'decrease',
                value: -1
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

          // Update LineChart data
          const [, date, startTime] = sessionId.split('_');
          const session = experts.find(e => e.email === expertEmail)?.availability
            .find(a => a.date === date)?.slots
            .find(s => s.start === startTime);

          if (session) {
            const startMinutes = parseInt(session.start.split(':')[0]) * 60 + parseInt(session.start.split(':')[1]);
            const endMinutes = parseInt(session.end.split(':')[0]) * 60 + parseInt(session.end.split(':')[1]);
            const durationMinutes = endMinutes - startMinutes;

            // Update MongoDB LineChart
            try {
              const token = localStorage.getItem("token");
              await fetch('https://employee.ekaant.co/api/linechart/update', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  month: currentMonth,
                  category: 'expert',
                  duration: durationMinutes,
                  operation: 'decrease'
                })
              });
            } catch (error) {
              console.error('Failed to update line chart:', error);
            }
          }

          // Create cancellation notification
          try {
            const notificationData = {
              title: "Mental Health Session Cancelled",
              date: sessionDate,
              time: startTime,
              duration: "60 minutes",
              price: `${SESSION_COST} credits refunded`,
              doctorName: selectedExpert.name,
              doctorSpecialty: selectedExpert.specialization,
              sessionDate: new Date(sessionDate),
              type: 'expert'
            };

            await axios.post(
              "https://employee.ekaant.co/api/notifications",
              notificationData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          } catch (error) {
            console.error("Error creating cancellation notification:", error);
          }

          showNotification("Booking cancelled and credits refunded successfully!");
        } catch (error) {
          console.error("Failed to refund credits:", error);
          showNotification("Failed to refund credits. Please contact support.", "error");
        } finally {
          setCancellingSession(null);
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const errorMessage = error.response?.data?.message || "Failed to cancel booking";
      showNotification(errorMessage, "error");
      setCancellingSession(null);
    }
  };


  const isSessionBooked = (expertEmail, date, startTime) => {
    if (!expertEmail || !date || !startTime || !employeeEmail) return false;
    const sessionId = `${expertEmail}_${date}_${startTime}_${employeeEmail}`;
    const userSessions = bookedSessions.filter(session => session.includes(employeeEmail));
    const isBooked = userSessions.includes(sessionId);
    return isBooked;
  };

  const filteredExperts = experts
    .filter(expert => 
      selectedCategory === "All" || expert.specialization === selectedCategory
    )
    .filter(expert => 
      searchQuery === "" || 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-900 mb-3">Mental Health Experts</h1>
        <p className="text-indigo-700 max-w-2xl mx-auto">
          Connect with certified professionals specialized in various mental health areas
        </p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 animate-fade-in-down ${
          notification.type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === "error" ? "❌" : "✅"}
            </span>
            {notification.message}
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="max-w-full mx-auto mb-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            {/* Booked Sessions Counter */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const sessionsCount = bookedSessions.filter(session => {
                    const [, date, startTime] = session.split('_');
                    const sessionDateTime = new Date(`${date}T${startTime}`);
                    return sessionDateTime > new Date();
                  }).length;
                  if (sessionsCount > 0) {
                    setShowAllSessions(true);
                  }
                }}
                className="group bg-indigo-100 hover:bg-indigo-200 rounded-xl p-4 flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <div className="bg-indigo-600 rounded-lg p-2 group-hover:bg-indigo-700 transition-colors">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-900">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {bookedSessions.filter(session => {
                      const [, date, startTime] = session.split('_');
                      const sessionDateTime = new Date(`${date}T${startTime}`);
                      return sessionDateTime > new Date();
                    }).length}
                  </p>
                </div>
              </button>
            </div>

            {/* All Sessions Modal */}
            {showAllSessions && (
              <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl animate-scale-up">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-gray-900">Your Upcoming Sessions</h3>
                      <button 
                        onClick={() => setShowAllSessions(false)}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {bookedSessions
                      .filter(session => {
                        const [, date, startTime] = session.split('_');
                        const sessionDateTime = new Date(`${date}T${startTime}`);
                        return sessionDateTime > new Date();
                      })
                      .sort((a, b) => {
                        const [, dateA, timeA] = a.split('_');
                        const [, dateB, timeB] = b.split('_');
                        return new Date(`${dateA}T${timeA}`) - new Date(`${dateB}T${timeB}`);
                      })
                      .map((session, index) => {
                        const [expertEmail, date, startTime] = session.split('_');
                        const expert = experts.find(e => e.email === expertEmail);
                        return (
                          <div key={index} className="bg-white rounded-xl shadow-sm mb-4 p-4 border border-gray-100 hover:border-indigo-200 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={expert?.image} 
                                  alt={expert?.name} 
                                  className="w-12 h-12 rounded-full objectcover border-2 border-indigo-100"
                                />
                                <div>                                  <h4 className="font-semibold text-gray-900">{expert?.name}</h4>
                                  <p className="text-sm text-gray-600">{expert?.specialization}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCancelBooking(session)}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(date)}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {startTime}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {["All", "Anxiety", "Bipolar Disorder", "Depression"].map((category) => (
                <button
                  key={category}
                  className={`px-5 py-2.5 rounded-full transition-all ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experts Grid */}
      <div className="max-w-full mx-auto">
        {filteredExperts.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex rounded-full bg-indigo-100 p-4 mb-4">
              <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No experts found</h3>
            <p className="mt-1 text-gray-500">Try changing your search criteria or filter selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperts.map((expert, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-5px] duration-300 cursor-pointer"
                onClick={() => setSelectedExpert(expert)}
              >
                <div className="relative h-64 overflow-hidden bg-gray-50">
                  <img 
                    src={expert.image} 
                    alt={expert.name} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-indigo-600 px-2 py-1 rounded-lg flex items-center shadow-sm">
                    <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-medium">{expert.rating}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900 to-transparent p-4">
                    <span className="inline-block bg-indigo-600 bg-opacity-90 text-white text-xs px-2.5 py-1 rounded-full mb-2">
                      {expert.specialization}
                    </span>
                    <h3 className="text-xl font-bold text-white">{expert.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-700">
                        <svg className="h-5 w-5 text-indigo-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{expert.levels} years experience</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="h-5 w-5 text-indigo-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{expert.availability.length} dates</span>
                      </div>
                    </div>
                    {expert.availability.length > 0 && (
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <p className="text-xs text-indigo-700">
                          Next available slot:
                          {(() => {
                            const now = new Date();
                            const nextSlot = expert.availability
                              .sort((a, b) => new Date(a.date) - new Date(b.date))
                              .find(slot => new Date(slot.date) >= now);
                            return nextSlot ? (
                              <span className="font-medium block">
                                {new Date(nextSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, {nextSlot.slots[0].start}
                              </span>
                            ) : <span className="font-medium block">No upcoming slots available</span>
                          })()}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className=" text-sm line-clamp-2">{expert.overview}</p>
                  <button className="w-full mt-4 bg-indigo-500 text-indigo-100 font-medium py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-indigo-600 rounded-full mb-4"></div>
            <p className="text-gray-700 font-semibold text-lg">Processing your request...</p>
          </div>
        </div>
      )}

      {/* Expert Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-40 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-150 relative overflow-y-auto animate-slide-up my-8">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-50 hover:bg-gray-100 transition-colors" 
              onClick={() => setSelectedExpert(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left side - Expert photo and basic info */}
              <div className="md:w-2/5 bg-indigo-700 text-white p-6 flex flex-col items-center justify-center relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4 shadow-lg">
                  <img 
                    src={selectedExpert.image} 
                    alt={selectedExpert.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-2xl font-bold mb-1 text-center">{selectedExpert.name}</h2>
                <span className="inline-block bg-white text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {selectedExpert.specialization}
                </span>

                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(selectedExpert.rating) ? "text-yellow-300" : "text-gray-400"}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-white">{selectedExpert.rating}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-indigo-600 rounded-lg p-3 text-center">
                    <span className="block text-xs text-indigo-200">Experience</span>
                    <span className="font-bold text-lg">{selectedExpert.levels} Years</span>
                  </div>
                  <div className="bg-indigo-600 rounded-lg p-3 text-center">
                    <span className="block text-xs text-indigo-200">Sessions</span>
                    <span className="font-bold text-lg">100+</span>
                  </div>
                </div>
              </div>

              {/* Right side - Expert details, bookings and current sessions */}
              <div className="md:w-3/5 p-6 overflow-y-auto">
                {/* Show Booked Sessions */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Your Sessions with {selectedExpert.name}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {bookedSessions
                      .filter(session => {
                        const [, date, startTime] = session.split('_');
                        const sessionDateTime = new Date(`${date}T${startTime}`);
                        return session.includes(selectedExpert.email) && sessionDateTime > new Date();
                      })
                      .map((sessionId, index) => {
                        const [, date, startTime] = sessionId.split('_');
                        return (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <div>
                              <p className="font-medium text-gray-800">{formatDate(date)}</p>
                              <p className="text-sm text-gray-600">Start Time: {startTime}</p>
                            </div>
                            <button
                              onClick={() => handleCancelBooking(sessionId)}
                              disabled={cancellingSession === sessionId}
                              className={`px-3 py-1 bg-red-50 text-red-600 rounded-lg transition-colors text-sm font-medium ${
                                cancellingSession === sessionId 
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-red-100 cursor-pointer hover:scale-105'
                              }`}
                            >
                              {cancellingSession === sessionId ? 'Cancelling...' : 'Cancel Session'}
                            </button>
                          </div>
                        );
                      })}
                    {bookedSessions.filter(session => session.includes(selectedExpert.email)).length === 0 && (
                      <p className="text-gray-500 text-center py-2">No sessions booked with this expert yet.</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    About
                  </h3>
                  <p className="text-gray-600 mt-2">{selectedExpert.overview}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3">
                    <svg className="h-5 w-5 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Book an Appointment
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select a date:
                    </label>
                    <DatePicker 
                      selected={selectedDate ? new Date(selectedDate) : null} 
                      onChange={(date) => {
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        setSelectedDate(localDate.toISOString().split('T')[0]);
                      }}
                      includeDates={selectedExpert.availability
                        .filter(date => new Date(date.date) >= new Date().setHours(0,0,0,0))
                        .map(date => new Date(date.date))
                      } 
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy" 
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none hover:border-indigo-400 transition-colors" 
                      placeholderText="Click to select a date"
                      calendarClassName="shadow-lg border-none"
                    />
                    <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot:</label>
  {selectedDate && selectedExpert && (
    <div className="grid grid-cols-2 gap-2">
      {selectedExpert.availability
        .find(date => date.date === selectedDate)
        ?.slots.map((slot, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
              selectedStartTime === slot.start && selectedEndTime === slot.end
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-200'
            }`}
            onClick={() => {
              setSelectedStartTime(slot.start);
              setSelectedEndTime(slot.end);
            }}
          >
            {slot.start} - {slot.end}
          </button>
        )) || (
          <p className="text-gray-500 col-span-2">No slots available for this date</p>
        )}
    </div>
  )}
</div>
                  </div>
                </div>

                <div className="flex flex-col">
                  {selectedDate && selectedStartTime && isSessionBooked(selectedExpert.email, selectedDate, selectedStartTime) ? (
                    <button 
                      onClick={() => handleCancelBooking(`${selectedExpert.email}_${selectedDate}_${selectedStartTime}_${employeeEmail}`)}
                      className="py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                      disabled={isLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.707l-3 3a1 1 0 001.414 1.414l3-3a1 1 0 00-1.414-1.414zM9 17a1 1 0 100-2 1 1 0 000 2zm2-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Cancel Booking
                    </button>
                  ) : (
                    <button 
                      onClick={handleBooking}
                      disabled={isLoading || !selectedDate || !selectedStartTime || !selectedEndTime}
                      className={`py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                        !selectedDate || !selectedStartTime || !selectedEndTime
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {selectedDate && selectedStartTime && selectedEndTime ? `Book Appointment for ${formatDate(selectedDate)}` : "Select Date & Time First"}
                    </button>
                  )}

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    By booking, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add some custom styles for animations */}
      <style>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Expert;
import { useState, useEffect } from "react";
import GroupCoachingCard from "../cards/GroupCoachingCard";

// Simulate fetching user-specific sessions.  In a real application, this would involve a fetch call to a backend API.
const fetchUserSessions = async (userId) => {
  // Replace this with your actual API call
  if (userId === 'user1') {
    return [
      {
        id: 19,
        title: "Prevent Burnout",
        instructor: "Ipshita Kaur",
        duration: "60 min",
        credits: 200,
        levels: "8 levels - 1.15 hrs",
        image: "https://dropinblog.net/34238038/files/featured/Blog_Covers__7_.png",
        details: "Expert in mindfulness and stress management.",
        ratings: "4.8/5",
        startTime: "2025-02-24T15:00:00",
      },
      {
        id: 63, // Added a session unique to user1
        title: "Time Management",
        instructor: "Jane Doe",
        duration: "45 min",
        credits: 150,
        levels: "5 levels - 0.75 hrs",
        image: "https://leapmax.ai/wp-content/uploads/2024/02/time-management-skills-.webp", // Placeholder image
        details: "Learn effective time management techniques.",
        ratings: "4.5/5",
        startTime: "2025-02-25T10:00:00",
      }
    ];
  } else if (userId === 'user2') {
    return [
      {
        id: 2,
        title: "Stress & Anxiety Release",
        instructor: "Payoja Dey",
        duration: "60 min",
        credits: 200,
        levels: "8 levels - 1.15 hrs",
        image: "https://tse2.mm.bing.net/th?id=OIP.INzqs1WqB8_6VkR-Ku6m3wHaEO&pid=Api&P=0&h=180",
        details: "Specialist in cognitive behavioral therapy.",
        ratings: "4.7/5",
        startTime: "2025-02-24T16:00:00",
      }
    ];
  } else {
    return [];
  }
};


export default function GroupCoaching() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const userId = localStorage.getItem("userId") || 'user1'; // Default to user1 if no userId is found

  useEffect(() => {
    const fetchSessions = async () => {
      const userSessions = await fetchUserSessions(userId);
      //Persist sessions to localStorage
      localStorage.setItem(`groupSessions_${userId}`, JSON.stringify(userSessions));
      setSessions(userSessions);
    };
    fetchSessions();
  }, [userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (selectedSession) {
        const timeDiff = new Date(selectedSession.startTime) - new Date();
        if (timeDiff > 0) {
          setTimeLeft(`${Math.floor(timeDiff / 60000)} min left`);
        } else {
          setTimeLeft("Session started");
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSession]);

  return (
    <div className="flex">

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Group Coaching</h1>
          {selectedSession && <span className="text-lg font-semibold text-purple-600">{timeLeft}</span>}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {sessions.map((session) => (
            <GroupCoachingCard key={session.id} session={session} onJoin={setSelectedSession} />
          ))}
        </div>
      </main>

      {/* Custom Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold">{selectedSession.title}</h2>
            <p><strong>Instructor:</strong> {selectedSession.instructor}</p>
            <p><strong>Details:</strong> {selectedSession.details}</p>
            <p><strong>Ratings:</strong> {selectedSession.ratings}</p>
            <p><strong>Time Left:</strong> {timeLeft}</p>
            <button
              onClick={() => setSelectedSession(null)}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
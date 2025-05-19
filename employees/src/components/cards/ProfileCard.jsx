import { useState, useRef, useEffect } from "react";
import axios from 'axios';

const ProfileCard = () => {
  const [profileData, setProfileData] = useState({});
  const [currentQuote, setCurrentQuote] = useState(0);
  const fileInputRef = useRef(null);

  const quotes = [
    "The best time to plant a tree was 10 years ago\nthe second best time is ... now",
    "Success is not final, failure is not fatal:\nit is the courage to continue that counts",
    "Your time is limited, don't waste it\nliving someone else's life",
    "The future belongs to those who\nbelieve in the beauty of their dreams",
    "It does not matter how slowly you go\nas long as you do not stop",
    "Everything you've ever wanted is on\nthe other side of fear",
    "Success usually comes to those who are\ntoo busy to be looking for it",
    "The only way to do great work is\nto love what you do",
    "If you want to lift yourself up,\nlift up someone else",
    "The journey of a thousand miles\nbegins with one step",
    "Don't watch the clock; do what it does.\nKeep going",
    "The only limit to our realization of tomorrow\nwill be our doubts of today",
    "Life is what happens when you're\nbusy making other plans",
    "The harder you work for something,\nthe greater you'll feel when you achieve it",
    "Do what you can, with what you have,\nwhere you are",
    "Mental health is not a destination\nbut a process",
    "Your peace is more important than\ndriving yourself crazy trying to understand why something happened",
    "Self-care is not selfish\nit's essential",
    "You don't have to control your thoughts\njust stop letting them control you",
    "Recovery is not one and done\nit happens in layers",
    "Healing doesn't mean the damage never existed\nit means it no longer controls our lives",
    "Sometimes the strongest thing you can do\nis ask for help",
    "Your mental health is a priority\nyour personal growth is an investment",
    "Take care of your mind\nit's the only place you have to live",
    "Small steps every day\nlead to big changes"
  ];

  // Function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "https://employee.ekaant.co/api/employee/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data?.employee) {
        setProfileData(response.data.employee);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Image too large! Maximum size is 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://employee.ekaant.co/api/employee/upload-avatar",
          formData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            } 
          }
        );

        if (response.status === 200) {
          await fetchProfileData();
          window.dispatchEvent(new Event('profileDataChanged'));
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Failed to upload avatar!");
      }
    }
  };

  useEffect(() => {
    fetchProfileData();

    const handleProfileChange = () => {
      fetchProfileData();
    };

    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 10000);

    window.addEventListener('profileDataChanged', handleProfileChange);

    return () => {
      window.removeEventListener('profileDataChanged', handleProfileChange);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-900 from-10% to-blue-800 to-90% rounded-lg shadow-lg p-6 w-full">
      <div className="flex space-x-11">
        <div className="relative">
          <img
            src={profileData.avatar || "https://www.profilebakery.com/wp-content/uploads/2023/04/AI-Profile-Picture.jpg"}
            alt="Profile"
            className="w-40 h-40 rounded-full border-5 border-white shadow-lg object-cover"
          />
          <div 
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md"
            onClick={() => fileInputRef.current.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="text-left">
          <h3 className="text-white text-3xl font-bold m-3">{profileData.username || "User"}</h3>
          <p className="text-gray-200 text-lg m-3">
            {profileData.role || "Role"} {profileData.employeeId ? `#${profileData.employeeId}` : ''}, {profileData.department || "Department"}
          </p>

          <p className="text-white text-xl italic font-semibold">
            "{quotes[currentQuote].split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
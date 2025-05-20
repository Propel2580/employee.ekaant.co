import  { useState, useEffect } from "react";
import { Typography, Modal } from "@mui/material";
import { motion } from "framer-motion";

const InsightsCard = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill({ selectedOption: "", customAnswer: "" }));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const checkLastSubmission = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://employee.ekaant.co/api/insights/last-submission", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.lastSubmission) {
            const lastDate = new Date(data.lastSubmission);
            const today = new Date();
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 7) {
              setShowReminder(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking last submission:", error);
      }
    };

    checkLastSubmission();
    const interval = setInterval(checkLastSubmission, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, []);

  const questions = [
    {
      question: "🌱 On most days, how do you feel when you start work?",
      options: [
        "Ready to conquer the world 💪",
        "Could use a second coffee ☕",
        "Asking myself why I left the bed 🛏️",
        "Wait... it's not Saturday? 😅"
      ],
    },
    {
      question: "How often do you feel mentally drained by the end of the day?",
      options: [
        "Rarely, I'm a mental ninja 🧘",
        "Sometimes, depending on meetings 📅",
        "Almost always — send help 🆘",
        "What's 'mentally drained'? I've transcended that 🚀"
      ],
    },
    {
      question: "How well do you sleep at night?",
      options: [
        "Like a baby 👶",
        "I wake up once or twice 🌙",
        "I sleep, but my brain doesn't 🧠",
        "What is sleep? ⏰"
      ],
    },
    {
      question: "How comfortable are you talking to someone about your stress or challenges?",
      options: [
        "Very comfortable — I believe in therapy 🗣️",
        "Sometimes, depending on who 🤔",
        "Not really, I bottle it up like vintage wine 🍷",
        "My stress and I have a long-term relationship 💍"
      ],
    },
    {
      question: "When was the last time you did something just for yourself?",
      options: [
        "Today! Self-love for the win 💖",
        "Sometime this week 📅",
        "Can't remember 🤷",
        "I liked a meme. That counts, right? 😅"
      ],
    },
    {
      question: "🎉 If your current mental health were a meme, which one would it be?",
      options: [
        "🐶 'This is fine' (fire in the background)",
        "🐱 Cat sleeping on laptop (Work-life balance pro)",
        "🧠 Brain: 'Let's overthink everything!'",
        "💃 Dancing baby — thriving, no context needed"
      ],
    }
  ];

  const handleOpenSurvey = () => {
    setIsSurveyOpen(true);
    setCurrentQuestion(0);
    setAnswers(Array(10).fill({ selectedOption: "", customAnswer: "" }));
    setIsSubmitted(false);
  };

  const handleCloseSurvey = () => {
    setIsSurveyOpen(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleOptionChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion].selectedOption = event.target.value;
    setAnswers(newAnswers);
  };

  const handleCustomAnswerChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion].customAnswer = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("https://employee.ekaant.co/api/insights/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error("Failed to submit insights");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting insights:", error);
      alert("Failed to submit insights. Please try again.");
    }
  };

  // Check if the current question has been answered
  const isCurrentQuestionAnswered = () => {
    const currentAnswer = answers[currentQuestion];
    return currentAnswer.selectedOption !== "" || currentAnswer.customAnswer !== "";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between"
      >
        <div className="max-w-[70%]">
          <Typography variant="h6" className="font-semibold text-lg text-white">
            🌱 How's Your Well-Being Today?
          </Typography>
          <Typography variant="body2" className="text-gray-200 mt-1 leading-relaxed">
            Take 2 minutes to check in with yourself — we promise it won't feel like homework 😄
          </Typography>
        </div>
        <button
          onClick={handleOpenSurvey}
          className="bg-white text-blue-800 px-6 py-3 rounded-full shadow-lg hover:shadow-2xl font-semibold transition-transform transform hover:scale-105"
        >
          Start Now
        </button>
      </motion.div>

      {/* Survey Modal */}
      <Modal open={isSurveyOpen} onClose={handleCloseSurvey}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-lg">
            {/* Close Button */}
            <button
              onClick={handleCloseSurvey}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                <Typography variant="h6" className="font-semibold text-lg mb-4">
                  {questions[currentQuestion].question}
                </Typography>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="option"
                        value={option}
                        checked={answers[currentQuestion].selectedOption === option}
                        onChange={handleOptionChange}
                        className="mr-2"
                      />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
                <textarea
                  value={answers[currentQuestion].customAnswer}
                  onChange={handleCustomAnswerChange}
                  className="w-full p-2 border rounded-lg mt-4"
                  rows={4}
                  placeholder="Additional comments (optional)..."
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      disabled={!isCurrentQuestionAnswered()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isCurrentQuestionAnswered()}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <Typography variant="h6" className="font-semibold text-lg mb-4">
                  Thank you for your valuable feedback!
                </Typography>
                <button
                  onClick={handleCloseSurvey}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </Modal>

      {/* Reminder Modal */}
      <Modal open={showReminder} onClose={() => setShowReminder(false)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg relative shadow-lg text-center">
            <Typography variant="h6" className="font-semibold text-lg mb-4">
              Time for Your Weekly Insights!
            </Typography>
            <Typography variant="body1" className="mb-4">
              It's been 7 days since your last submission. Please take a moment to share your insights.
            </Typography>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowReminder(false);
                  handleOpenSurvey();
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Start Now
              </button>
              <button
                onClick={() => setShowReminder(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
              >
                Remind Me Later
              </button>
            </div>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default InsightsCard;
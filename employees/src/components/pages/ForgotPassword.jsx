import { useState ,useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const waveAnimationStyles = {
  gradient: { animation: 'gradient 20s ease infinite' }
};

const keyframesStyle = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes scale {
    0% { transform: scale(1) rotate(var(--rotation, 0deg)); }
    50% { transform: scale(1.1) rotate(var(--rotation, 180deg)); }
    100% { transform: scale(1) rotate(var(--rotation, 360deg)); }
  }
  @keyframes float {
    0% { transform: translateY(5px) rotate(var(--rotation, 10deg)); }
    50% { transform: translateY(-10px) rotate(var(--rotation, 20deg)); }
    100% { transform: translateY(10px) rotate(var(--rotation, 30deg)); }
  }
`;

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      icon: (
        <div className="bg-[#7C4DFF]/20 p-4 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B388FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      ),
      title: "Secure Reset",
      description: "Reset your password securely with our multi-step process"
    },
    {
      icon: (
        <div className="bg-[#536DFE]/20 p-4 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82B1FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      title: "Email Verification",
      description: "Verification code sent directly to your email"
    },
    {
      icon: (
        <div className="bg-[#4CAF50]/20 p-4 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#81C784]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      title: "Quick Process",
      description: "Fast and easy password recovery process"
    }
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = keyframesStyle;
    document.head.appendChild(style);
    
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      setMounted(false);
      style.remove();
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required!");
      return;
    }

    try {
      const res = await axios.post("https://employee.ekaant.co/api/send-otp-reset", { email }, { withCredentials: true });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!otp) {
      setError("OTP is required!");
      return;
    }

    try {
      const res = await axios.post("https://employee.ekaant.co/api/verify-otp-reset", { email, otp }, { withCredentials: true });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("https://employee.ekaant.co/api/reset-password", { email, newPassword }, { withCredentials: true });
      setMessage(res.data.message);
      navigate("/sign-in");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div 
        className="w-2/5 flex flex-col relative overflow-hidden m-4 rounded-2xl"
        style={{
          background: 'linear-gradient(-45deg, #4171f5, #3451b2, #2196f3, #2979ff)',
          backgroundSize: '300% 300%',
          ...waveAnimationStyles.gradient
        }}
      >
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-16 gap-3 p-6 opacity-40">
          {[...Array(192)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg backdrop-blur-sm"
              style={{
                background: `rgba(255, 255, 255, ${0.1 + (i % 3) * 0.05})`,
                animation: `${i % 2 === 0 ? 'float' : 'scale'} ${3 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${(i % 8) * 45}deg)`,
                height: i % 3 === 0 ? '100%' : i % 2 === 0 ? '75%' : '50%',
                width: i % 4 === 0 ? '100%' : i % 2 === 0 ? '80%' : '60%',
                '--rotation': `${(i % 4) * 90}deg`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex-grow flex flex-col items-center justify-start pt-20">
            <div className="flex items-center mb-12">
              <img src="/logo-03.png" alt="Ekaant" className="h-16" />
              <span className="text-white text-4xl font-bold ml-4">Ekaant</span>
            </div>
            <div className="text-white text-center mb-6">
              <h1 className="text-5xl font-bold mb-4">Password Recovery</h1>
              <p className="text-2xl">Secure Password Reset Process</p>
            </div>

            <div className="text-white text-center mt-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                {slides[currentSlide].icon}
                <h2 className="text-4xl font-bold">{slides[currentSlide].title}</h2>
              </div>
              <p className="text-xl opacity-90">{slides[currentSlide].description}</p>
            </div>

            <div className="flex justify-center space-x-2 mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? "bg-white w-8" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-4 mb-12">
            <img src="/masterlogo.png" alt="Master Logo" className="h-30" />
            <img src="/tatrlogo.png" alt="Tatr Logo" className="h-18" />
          </div>

          <div className="bg-white/40 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-lg">
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full  bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                  Send OTP
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter OTP sent to your email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full  bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                  Verify OTP
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full  bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                  Reset Password
                </button>
              </form>
            )}

            <div className="text-center mt-6">
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
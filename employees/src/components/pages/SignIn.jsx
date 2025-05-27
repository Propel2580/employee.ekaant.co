import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCredits } from "../context/CreditsContext";

const waveAnimationStyles = {
  gradient: { animation: 'gradient 20s ease infinite' }
};

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "", showPassword: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { refreshCredits } = useCredits();

  const slides = [
    {
      title: "100% Confidential",
      description: "We'll never share your personal information with your employer"
    },
    {
      title: "Anonymised Data",
      description: "Employers only see overall company wellbeing metrics"
    },
    {
      title: "Secured Data",
      description: "Employers only see overall Growth and Progress"
    }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      setMounted(false);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("https://employee.ekaant.co/api/sign-in", {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (res.data.success) {
        const { employee, token } = res.data;
        localStorage.setItem("user", JSON.stringify(employee));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await refreshCredits();
        window.dispatchEvent(new Event('chartDataUpdated'));
        navigate("/analytics");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sign-in failed! Please try again.");
    } finally {
      setLoading(false);
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
              <span className="text-white text-4xl font-bold ml-2">EKAANT</span>
            </div>
            <div className="text-white text-center mb-6">
              <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
              <p className="text-2xl">Sign in to continue your journey.</p>
            </div>
            <div className="text-white text-center mt-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-[#7C4DFF]/20 p-4 rounded-xl">
                  {/* Icon */}
                </div>
                <h2 className="text-4xl font-bold">{slides[currentSlide].title}</h2>
              </div>
              <p className="text-xl opacity-90">{slides[currentSlide].description}</p>
            </div>
            <div className="flex justify-center space-x-2 mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? "bg-white w-8" : "bg-white/50"}`}
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

          <div className="flex mb-8">
            <Link to="/sign-in" className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-all text-center">Sign In</Link>
            <Link to="/sign-up" className="flex-1 py-2 px-4 text-gray-600 rounded-l hover:bg-gray-100 transition-all text-center">Sign Up</Link>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
              </div>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={handleTogglePassword}
                  tabIndex={-1}
                  aria-label={formData.showPassword ? "Hide password" : "Show password"}
                >
                  {formData.showPassword ? (
                    // Eye-off SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 5-4 9-10 9S2 17 2 12s4-9 10-9 10 4 10 9z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/sign-up" className="text-blue-600 hover:underline">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

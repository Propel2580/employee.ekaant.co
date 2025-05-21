import { useEffect, useState } from "react";
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

const Home = () => {
  useEffect(() => {
    // Add keyframes to document
    const style = document.createElement('style');
    style.textContent = keyframesStyle;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
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
      title: "100% Confidential",
      description: "We'll never share your personal information with your employer"
    },
    {
      icon: (
        <div className="bg-[#536DFE]/20 p-4 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#82B1FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      ),
      title: "Anonymised Data",
      description: "Employers only see overall company wellbeing metrics"
    },
    {
      icon: (
        <div className="bg-[#4CAF50]/20 p-4 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#81C784]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex ">
      {/* Left Section */}
      <div 
        className="w-2/5 flex flex-col relative overflow-hidden m-2 rounded-2xl"
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
              <h1 className="text-5xl font-bold mb-4">Welcome to Ekaant</h1>
              <p className="text-2xl">Empowering Mental Health in the Workplace</p>
            </div>

            <div className="text-white text-center mt-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-[#7C4DFF]/20 p-4 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B388FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
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

      {/* Right Section - Sign In Form */}
      <div className="w-1/2 p-12 flex flex-col justify-center items-center mt-2">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <img src="/masterlogo.png" alt="Master Logo" className="h-30" />
            <img src="/tatrlogo.png" alt="Tatr Logo" className="h-18" />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Start Your Transformational Journey Today
            </h2>
            <p className="text-gray-600 text-sm italic">
              "Your path to mental well-being begins with a single step. Let us guide you through this journey of self-discovery and growth."
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={() => navigate('/sign-in')}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Begin Your Journey
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
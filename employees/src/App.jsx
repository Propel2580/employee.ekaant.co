// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Sidebar from "./components/layout/Sidebar";
// import Navbar from "./components/layout/Navbar";
// import SignIn from "./components/pages/Signin";
// import SignUp from "./components/pages/SignUp";
// import Home from "./components/pages/Home";
// import Analytics from "./components/pages/Analytics";
// import Profile from "./components/pages/Profile";
// import Program from "./components/pages/Program";
// import GroupCoaching from "./components/pages/GroupCoaching";
// import SereneAi from "./components/pages/SereneAI";
// import Challenges from "./components/pages/Challenges";
// import Expert from "./components/pages/Expert";
// import { CreditsProvider } from "./components/context/CreditsContext";
// import PropTypes from 'prop-types';
// import PreventBurnout from "./components/sessions/preventBurnout";
// import ManageStress from "./components/sessions/manageStress"; 
// import CultivateSleep from "./components/sessions/cultivateSleep";

// import BuildResilience from "./components/sessions/buildResilience";
// import StressedToBalanced from "./components/sessions/stressedToBalanced";
// import MindfulLeaders from "./components/sessions/mindfulLeaders";
// import MeditationBasics from "./components/sessions/meditationBasics";
// import YogaBasics from "./components/sessions/yogaBasics";
// import HealthyHabits from "./components/sessions/healthyHabits";
// import LiveSession from "./components/pages/LiveSession";
// import ForgotPassword from "./components/pages/ForgotPassword"; 
// import ChallengeDetail from "./components/challangecontents/ChallengeDetail";
// import StressRelease from "./components/challangecontents/StressRelease";
// import InclusiveWorkplaces from "./components/challangecontents/InclusiveWorkplaces";
// import DopamineTriggers from "./components/challangecontents/DopamineTriggers";

// const Layout = ({ children }) => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 flex flex-col min-h-screen">
//         <Navbar />
//         {children}
//       </div>
//     </div>
//   );
// };

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// };



// export default function App() {

//   const [authenticated, setAuthenticated] = useState(
//     localStorage.getItem("token") ? true : false
//   );

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setAuthenticated(!!token); // ✅ Keeps the user logged in even after refresh
//   }, []);

//   return (
//     <CreditsProvider>
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/sign-in" element={<SignIn setAuthenticated={setAuthenticated} />} />
//         <Route path="/sign-up" element={<SignUp />} />

//         <Route path="/forgot-password" element={<ForgotPassword />} />

//         {/* Protected Routes (Require Authentication) */}
//         {authenticated ? (
//           <>
//             <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
//             <Route path="/profile" element={<Layout><Profile /></Layout>} />
//             <Route path="/program" element={<Layout><Program /></Layout>} />
//             <Route path="/group-coaching" element={<Layout><GroupCoaching /></Layout>} />
//             <Route path="/serene-ai" element={<Layout><SereneAi /></Layout>} />
//             <Route path="/challenges" element={<Layout><Challenges /></Layout>} />
//             <Route path="/expert" element={<Layout><Expert /></Layout>} />
//             <Route path="/live-session" element={<Layout><LiveSession /></Layout>} /> 
//             {/* Added session routes */}
//             <Route path="/prevent-burnout" element={<Layout><PreventBurnout /></Layout>} />
//             <Route path="/manage-your-stress" element={<Layout><ManageStress /></Layout>} />
//             <Route path="/cultivate-Quality-sleep" element={<Layout><CultivateSleep /></Layout>} />
//             <Route path="/build-resilience" element={<Layout><BuildResilience /></Layout>} />
//             <Route path="/stressed-to-balanced" element={<Layout><StressedToBalanced /></Layout>} />
//             <Route path="/mindful-leaders" element={<Layout><MindfulLeaders /></Layout>} />
//             <Route path="/meditation:-the-basics" element={<Layout><MeditationBasics /></Layout>} />
//             <Route path="/yoga:-the-basics" element={<Layout><YogaBasics /></Layout>} />
//             <Route path="/healthy-habits" element={<Layout><HealthyHabits /></Layout>} />
  
//             <Route path="/challenges/45-days-stress-release" element={<Layout><ChallengeDetail /></Layout>} />
//             <Route path="/challenges/45-days-of-stress-release" element={<Layout><StressRelease /></Layout>} />
// <Route path="/challenges/dopamine-triggers-and-avoidance" element={<Layout><DopamineTriggers /></Layout>} />
// <Route path="/challenges/women-for-inclusive-workplaces" element={<Layout><InclusiveWorkplaces /></Layout>} />
//           </>
//         ) : (
//           <Route path="/*" element={<Navigate to="/sign-in" />} />
//         )}
//       </Routes>
//     </BrowserRouter>
//     </CreditsProvider>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Home from "./components/pages/Home";
import Analytics from "./components/pages/Analytics";
import Profile from "./components/pages/Profile";
import Program from "./components/pages/Program";
import GroupCoaching from "./components/pages/GroupCoaching";
import SereneAi from "./components/pages/SereneAI";
import Challenges from "./components/pages/Challenges";
import Expert from "./components/pages/Expert";
import { CreditsProvider } from "./components/context/CreditsContext";
import PropTypes from 'prop-types';
import PreventBurnout from "./components/sessions/PreventBurnout";

import ManageStress from "./components/sessions/ManageStress"; 
import CultivateSleep from "./components/sessions/CultivateSleep";

import BuildResilience from "./components/sessions/BuildResilience";
import StressedToBalanced from "./components/sessions/StressedToBalanced";
import MindfulLeaders from "./components/sessions/MindfulLeaders";
import MeditationBasics from "./components/sessions/MeditationBasics";
import YogaBasics from "./components/sessions/YogaBasics";
import HealthyHabits from "./components/sessions/HealthyHabits";
import LiveSession from "./components/pages/LiveSession";
import ForgotPassword from "./components/pages/ForgotPassword"; 
import ChallengeDetail from "./components/challangecontents/ChallengeDetail";
import StressRelease from "./components/challangecontents/StressRelease";
import InclusiveWorkplaces from "./components/challangecontents/InclusiveWorkplaces";
import DopamineTriggers from "./components/challangecontents/DopamineTriggers";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};



export default function App() {

  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (token) {
      setAuthenticated(true);
      // Initialize credits from user data if available
      if (user.credits !== undefined) {
        window.dispatchEvent(new CustomEvent('creditsUpdated', { 
          detail: { credits: user.credits } 
        }));
      }
    } else {
      setAuthenticated(false);
    }
  }, []);

  return (
    <CreditsProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="" element={<Home />} />
        <Route path="/sign-in" element={<SignIn setAuthenticated={setAuthenticated} />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes (Require Authentication) */}
        {authenticated ? (
          <>
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/program" element={<Layout><Program /></Layout>} />
            <Route path="/group-coaching" element={<Layout><GroupCoaching /></Layout>} />
            <Route path="/serene-ai" element={<Layout><SereneAi /></Layout>} />
            <Route path="/challenges" element={<Layout><Challenges /></Layout>} />
            <Route path="/expert" element={<Layout><Expert /></Layout>} />
            <Route path="/live-session" element={<Layout><LiveSession /></Layout>} /> 
            {/* Added session routes */}
            <Route path="/prevent-burnout" element={<Layout><PreventBurnout /></Layout>} />
            <Route path="/manage-your-stress" element={<Layout><ManageStress /></Layout>} />
            <Route path="/cultivate-Quality-sleep" element={<Layout><CultivateSleep /></Layout>} />
            <Route path="/build-resilience" element={<Layout><BuildResilience /></Layout>} />
            <Route path="/stressed-to-balanced" element={<Layout><StressedToBalanced /></Layout>} />
            <Route path="/mindful-leaders" element={<Layout><MindfulLeaders /></Layout>} />
            <Route path="/meditation:-the-basics" element={<Layout><MeditationBasics /></Layout>} />
            <Route path="/yoga:-the-basics" element={<Layout><YogaBasics /></Layout>} />
            <Route path="/healthy-habits" element={<Layout><HealthyHabits /></Layout>} />
  
            <Route path="/challenges/45-days-stress-release" element={<Layout><ChallengeDetail /></Layout>} />
            <Route path="/challenges/45-days-of-stress-release" element={<Layout><StressRelease /></Layout>} />
<Route path="/challenges/dopamine-triggers-and-avoidance" element={<Layout><DopamineTriggers /></Layout>} />
<Route path="/challenges/women-for-inclusive-workplaces" element={<Layout><InclusiveWorkplaces /></Layout>} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/sign-in" />} />
        )}
      </Routes>
    </BrowserRouter>
    </CreditsProvider>
  );
}
import { useState, useEffect } from 'react';
import styles from './style';
import { About, Doctors, Services, Clients, CTA, Footer, Navbar, Hero, Chatbot, MentalHealthGames } from "./components";
import { Login } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { authAPI } from './services/api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = authAPI.getCurrentUser();
    const isAuth = authAPI.isAuthenticated();
    if (savedUser && isAuth) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setShowDashboard(false);
  };

  const handleGoToDashboard = () => {
    if (isAuthenticated) {
      setShowDashboard(true);
    } else {
      setShowDashboard(true); // Will show login
    }
  };

  const handleBackToHome = () => {
    setShowDashboard(false);
  };

  // Show Login page if trying to access dashboard without auth
  if (showDashboard && !isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show Dashboard if authenticated and showDashboard is true
  if (showDashboard && isAuthenticated) {
    return <Dashboard user={user} onLogout={handleLogout} onBackToHome={handleBackToHome} />;
  }

  // Show main landing page
  return (
    <div className="bg-purple-700 w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <nav className="w-full flex py-6 justify-between items-center navbar">
            <Navbar />
            {/* Dashboard/Login Button */}
            <button
              onClick={handleGoToDashboard}
              className="ml-4 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium hover:opacity-90 transition"
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </button>
          </nav>
        </div>
      </div>

      <div className={`bg-purple-700 ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero onGetStarted={handleGoToDashboard} />
        </div>
      </div>

      <div className={`bg-purple-600 ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <div id="About">
            <About />
          </div>
          <div id="MentalHealth">
            <MentalHealthGames />
          </div>
          <div id="Doctors">
            <Doctors />
          </div>
          <div id="Services">
            <Services />
          </div>
          <div id="Clients">
            <Clients />
          </div>
          <CTA onGetStarted={handleGoToDashboard} />
          <Footer />
        </div>
      </div>

      {/* floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default App;
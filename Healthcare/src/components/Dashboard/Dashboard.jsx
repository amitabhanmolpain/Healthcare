import { useState } from "react";
import { Toaster } from 'react-hot-toast';
import styles from "../../style";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHome from "./DashboardHome";
import AppointmentBooking from "./AppointmentBooking";
import MedicationSection from "./MedicationSection";
import MentalHealthSection from "./MentalHealthSection";
import MyAppointments from "./MyAppointments";
import ProfileSection from "./ProfileSection";

const Dashboard = ({ user, onLogout, onBackToHome }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [showGame, setShowGame] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome user={user} setActiveSection={setActiveSection} />;
      case "appointments":
        return <AppointmentBooking />;
      case "my-appointments":
        return <MyAppointments />;
      case "medications":
        return <MedicationSection />;
      case "mental-health":
        return <MentalHealthSection showGame={showGame} setShowGame={setShowGame} />;
      case "leaderboard":
        return <MentalHealthSection showGame={showGame} setShowGame={setShowGame} defaultTab="leaderboard" />;
      case "profile":
        return <ProfileSection user={user} />;
      default:
        return <DashboardHome user={user} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#581c87',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }} />
      <div className="flex">
        {/* Sidebar - Hide when game is active */}
        {!showGame && (
          <DashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={onLogout}
            onBackToHome={onBackToHome}
            user={user}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 ${showGame ? '' : 'ml-0 md:ml-64'} min-h-screen`}>
          <div className={showGame ? '' : `${styles.paddingX} py-8`}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import { logow } from "../../assets";
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  Pill, 
  Heart, 
  User, 
  LogOut,
  Menu,
  X,
  Trophy
} from "lucide-react";

const DashboardSidebar = ({ activeSection, setActiveSection, onLogout, onBackToHome, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "appointments", label: "Book Appointment", icon: Calendar },
    { id: "my-appointments", label: "My Appointments", icon: ClipboardList },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "mental-health", label: "Mental Health", icon: Heart },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div 
        onClick={onBackToHome}
        className="flex items-center p-6 border-b border-purple-500/30 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <img src={logow} alt="VitalEase" className="w-[60px] h-[24px]" />
        <span className="font-poppins font-semibold text-[20px] bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text -ml-3">
          VitalEase
        </span>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-white font-semibold">{user?.name || "User"}</p>
            <p className="text-dimWhite text-sm">Patient</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg scale-105"
                      : "text-dimWhite hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-poppins font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-poppins font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-purple-800/90 backdrop-blur-sm text-white shadow-lg hover:bg-purple-700 transition"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-purple-900/95 backdrop-blur-md flex flex-col z-40 transition-transform duration-300 shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;

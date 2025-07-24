import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';

const Header = ({ title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount] = useState(3); // Example notification count

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    setIsProfileOpen(false);
  };

  return (
    <header className="header-gradient shadow-lg border-b border-gray-200/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="logo-container">
              {/* Replace the src with your actual logo path */}
              <img 
                src="logo.webp" 
                alt="Logo" 
                className="h-10 w-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Navigation or Title (Optional) */}
          <div className="hidden md:flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>

          {/* Right Section - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Button */}
            <div className="relative">
              <button className="notification-btn">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="profile-btn"
              >
                <div className="flex items-center space-x-2">
                  <div className="profile-avatar">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    John Doe
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </button>

              {/* Profile Dropdown Card */}
              {isProfileOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  
                  {/* Dropdown Content */}
                  <div className="profile-dropdown">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-500">john.doe@example.com</p>
                    </div>
                    <div className="py-1">
                      <button className="dropdown-item">
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="dropdown-item text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
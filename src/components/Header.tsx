import React from 'react';
import { Brain, Bell, Settings, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  alertCount?: number;
  criticalAlertCount?: number;
  onAlertsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  alertCount = 0, 
  criticalAlertCount = 0, 
  onAlertsClick 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">AI-CFO</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Intelligent Financial Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button 
              onClick={onAlertsClick}
              className="relative p-2 lg:p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`View alerts (${alertCount} total, ${criticalAlertCount} critical)`}
            >
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <>
                  <div className={`absolute -top-1 -right-1 flex items-center justify-center transition-all duration-300 ${
                    criticalAlertCount > 0 ? 'animate-pulse' : ''
                  }`}>
                    <div className={`w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-lg ${
                      criticalAlertCount > 0 ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {alertCount > 9 ? '9+' : alertCount}
                    </div>
                  </div>
                  {criticalAlertCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </>
              )}
            </button>
            
            <button 
              className="p-2 lg:p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                <p className="text-xs text-gray-600">Chief Financial Officer</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={onAlertsClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`View alerts (${alertCount} total)`}
            >
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center ${
                  criticalAlertCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                }`}>
                  {alertCount > 9 ? '9' : alertCount}
                </div>
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                <p className="text-xs text-gray-600">Chief Financial Officer</p>
              </div>
            </div>
            <button className="w-full flex items-center space-x-3 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
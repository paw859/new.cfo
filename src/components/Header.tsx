import React from 'react';
import { Brain, Bell, Settings, User } from 'lucide-react';

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
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI-CFO</h1>
              <p className="text-sm text-gray-600">Intelligent Financial Management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onAlertsClick}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <div className={`w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center ${
                  criticalAlertCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                }`}>
                  {alertCount > 9 ? '9+' : alertCount}
                </div>
              </div>
            )}
            {criticalAlertCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            )}
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
              <p className="text-xs text-gray-600">Chief Financial Officer</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
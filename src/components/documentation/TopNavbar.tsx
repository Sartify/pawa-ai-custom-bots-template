import React from 'react';
import { Menu } from 'lucide-react';
import { NavItem } from './types';

interface TopNavbarProps {
  activeTab: string;
  navItems: NavItem[];
  onMenuClick: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  navItems,
  onMenuClick
}) => {
  const currentItem = navItems.find(item => item.id === activeTab);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-[#022e79] p-2 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Current Tab Info */}
        <div className="flex items-center space-x-3">
          <div className="text-[#022e79]">
            {currentItem?.icon}
          </div>
          <div>
            <h2 className="text-[#022e79] font-semibold font-avenir">
              {currentItem?.title}
            </h2>
            <p className="text-gray-600 text-sm hidden sm:block">
              {currentItem?.description}
            </p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-500 text-sm">Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar; 
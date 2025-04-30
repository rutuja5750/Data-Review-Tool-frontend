import React, { useState } from 'react'
import { Menu, X, Bell, Search, ChevronDown, User } from 'lucide-react'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Navbar Component with improved design
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="text-xl font-bold text-blue-600 ml-2 md:ml-0">Analytical<span className="text-gray-800"> Platform</span></div>
        </div>
        
        <div className="hidden md:flex items-center relative mx-4 flex-1 max-w-md">
          <Search size={18} className="absolute left-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center cursor-pointer space-x-2 border-l pl-3 ml-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">User Name</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
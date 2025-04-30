import { Home, BarChart2, Layers, FileText, Settings, PlusCircle, MessageSquare } from 'lucide-react'

function Sidebar() {
  const menuItems = [
    { icon: <MessageSquare size={16} />, label: 'Recent Chats', active: true },
    { icon: <Home size={16} />, label: 'Dashboard' },
    { icon: <BarChart2 size={16} />, label: 'Analytics' },
    { icon: <Layers size={16} />, label: 'Projects' },
    { icon: <FileText size={16} />, label: 'Tasks' }
  ];
  
  return (
    <div className="h-[calc(100vh-4rem)] w-64 flex flex-col border-r border-gray-200 bg-white">
      {/* Fixed top section (New Chat button) */}
      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 rounded-md p-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
          <PlusCircle size={16} />
          New Chat
        </button>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Recent Chats Section */}
        <div className="mt-4 px-3">
          <div className="text-xs font-medium mb-2 px-2 text-gray-500">RECENT CHATS</div>
          <ul className="space-y-1">
            {['Project Planning', 'Task Management', 'Design Review'].map((chat, index) => (
              <li key={index}>
                <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md group text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
                  <MessageSquare size={15} className="mr-2 text-gray-400 group-hover:text-gray-600" />
                  <span className="truncate">{chat}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Main Menu Section */}
        <div className="mt-6 px-3">
          <div className="text-xs text-gray-500 font-medium mb-2 px-2">MAIN MENU</div>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors duration-200 ${
                    item.active 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.active && <div className="w-1 h-1 rounded-full bg-blue-600 ml-auto"></div>}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Settings Section */}
        <div className="mt-4 px-3">
          <div className="text-xs text-gray-500 font-medium mb-2 px-2">SETTINGS</div>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
                <Settings size={16} className="mr-2" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
import { Home, BarChart2, Layers, FileText, Settings, PlusCircle, MessageSquare } from 'lucide-react'
import { useLocation, Link } from 'react-router'

function Sidebar() {
  // Get current location to determine active menu item
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      icon: <MessageSquare size={16} />,
      label: 'Recent Chats',
      path: '/chat'
    },
    {
      icon: <Home size={16} />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <BarChart2 size={16} />,
      label: 'Analytics',
      path: '/analytic'
    },
    {
      icon: <Layers size={16} />,
      label: 'Projects',
      path: '/project'
    },
    {
      icon: <FileText size={16} />,
      label: 'Tasks',
      path: '/task'
    }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] w-64 flex flex-col border-r border-gray-200 bg-white">
      {/* Fixed top section (New Chat button) */}
      <div className="p-3">
        <Link
          to="/chat"
          className="w-full flex items-center justify-center gap-2 rounded-md p-3 text-sm hover:bg-gray-200 border-2 border-gray-200"
        >
          <PlusCircle size={16} />
          New Chat
        </Link>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Recent Chats Section */}
        <div className="mt-4 px-3">
          <div className="text-xs font-medium mb-2 px-2 text-gray-500">RECENT CHATS</div>
          <ul className="space-y-1">
            {/* This is just a placeholder for recent chats, in a real app these would come from an API */}
            {[
              { name: 'Project Planning', path: '/chat/project-planning' },
              { name: 'Task Management', path: '/chat/task-management' },
              { name: 'Design Review', path: '/chat/design-review' }
            ].map((chat, index) => {
              // Check if this chat is active based on current path
              const isActive = currentPath === chat.path;

              return (
                <li key={index}>
                  <Link
                    to={chat.path}
                    className={`flex items-center px-2 py-2 text-sm rounded-md group transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <MessageSquare size={15} className={`mr-2 ${isActive ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`} />
                    <span className="truncate">{chat.name}</span>
                    {isActive && <div className="w-1 h-1 rounded-full bg-blue-600 ml-auto"></div>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Main Menu Section */}
        <div className="mt-6 px-3">
          <div className="text-xs text-gray-500 font-medium mb-2 px-2">MAIN MENU</div>
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              // Check if this menu item is active based on current path
              const isActive = currentPath === item.path;

              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-gray-300 text-blue-600'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && <div className="w-1 h-1 rounded-full bg-blue-600 ml-auto"></div>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Settings Section */}
        <div className="mt-4 px-3">
          <div className="text-xs text-gray-500 font-medium mb-2 px-2">SETTINGS</div>
          <ul className="space-y-1">
            <li>
              {(() => {
                const settingsPath = '/settings';
                const isActive = currentPath === settingsPath;

                return (
                  <Link
                    to={settingsPath}
                    className={`flex items-center px-2 py-2 text-sm rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Settings size={16} className={`mr-2 ${isActive ? 'text-blue-500' : ''}`} />
                    <span>Settings</span>
                    {isActive && <div className="w-1 h-1 rounded-full bg-blue-600 ml-auto"></div>}
                  </Link>
                );
              })()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
import { Home, BarChart2, Layers, Settings, PlusCircle, MessageSquare, Database, List, ChevronDown, ChevronRight } from 'lucide-react'
import { useLocation, Link, useNavigate } from 'react-router'
import { StandardQuery } from '../constants/StandardQuery'
import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import { chatService, ChatHistory } from '../services/chat.service'
import { authService } from '../services/user.service'

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Add state for toggling Standard Queries directory
  const [showStandardQueries, setShowStandardQueries] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  // Load chat histories
  useEffect(() => {
    const loadChatHistories = async () => {
      const user = authService.getCurrentUser();
      if (user && user._id) {
        try {
          const histories = await chatService.getUserChatHistories(user._id);
          setChatHistories(histories);
        } catch (error) {
          console.error('Error loading chat histories:', error);
        }
      }
    };
    loadChatHistories();
  }, []);

  // Function to handle query click
  const handleQueryClick = (query: string) => {
    // Navigate to chat with the new query
    navigate('/chat', { 
      state: { 
        query: query
      }
    });
  };

  const menuItems = [
    {
      icon: <Home size={16} />,
      label: 'Dashboard',
      path: '#'
    },
    {
      icon: <BarChart2 size={16} />,
      label: 'Analytics',
      path: '#'
    },
    {
      icon: <Layers size={16} />,
      label: 'Projects',
      path: '/#'
    },
    {
      icon: <List size={16} />,
      label: 'Tasks',
      path: '/#'
    }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] w-72 flex flex-col border-r border-gray-200 bg-white">
      {/* Fixed top section (New Chat button) */}
      <div className="p-3">
        <button
          onClick={() => navigate('/chat', { replace: true })}
          className="w-full flex items-center justify-center gap-2 rounded-md p-3 text-sm hover:bg-gray-200 border-2 border-gray-500"
        >
          <PlusCircle size={16} />
          New Chat
        </button>
      </div>

      {/* Scrollable content area */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex-1">
          {/* Recent Chats Section */}
          <div className="mt-4 px-3">
            <div className="text-xs font-medium mb-2 px-2 text-gray-500">RECENT CHATS</div>
            <ul className="space-y-1">
              {chatHistories.map((chat) => {
                const isActive = currentPath === `/chat/${chat._id}`;

                return (
                  <li key={chat._id}>
                    <Link
                      to={`/chat/${chat._id}`}
                      className={`flex items-center px-2 py-2 text-sm rounded-md group transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <MessageSquare size={15} className={`mr-2 ${isActive ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-800'}`} />
                      <span className="truncate">{chat.title}</span>
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

            {/* Standard Queries Directory - Enhanced Styling */}
            <div className="mt-2 text-blue-500">
              <Collapsible 
                open={showStandardQueries} 
                onOpenChange={setShowStandardQueries}
                className="rounded-md border-none "
              >
                <CollapsibleTrigger className={`flex items-center w-full px-2 py-2 text-sm transition-colors duration-200 ${
                  showStandardQueries ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}>
                  <Database size={16} className={`mr-2 ${showStandardQueries ? 'text-blue-500' : 'text-gray-600'}`} />
                  <span className="font-medium">Standard Queries</span>
                  <div className="ml-auto">
                    {showStandardQueries ? 
                      <ChevronDown size={16} className={showStandardQueries ? 'text-blue-500' : 'text-gray-600'} /> : 
                      <ChevronRight size={16} />
                    }
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="bg-gray-50 pt-1 pb-2">
                  {Object.entries(StandardQuery).map(([category, queries]) => (
                    <div key={category} className="mx-2 my-1">
                      <button
                        className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 py-1 px-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      >
                        {expandedCategory === category ? 
                          <ChevronDown size={14} className="mr-1" /> : 
                          <ChevronRight size={14} className="mr-1" />
                        }
                        <span className="text-sm font-medium">{category}</span>
                      </button>
                      
                      {expandedCategory === category && (
                        <div className="ml-6 mt-1 bg-white border border-gray-100 rounded-md p-2">
                          {queries.length === 0 ? (
                            <p className="italic text-xs text-gray-400 p-1">No queries</p>
                          ) : (
                            <ul className="space-y-1">
                              {queries.map((query, idx) => (
                                <li 
                                  key={idx}
                                  className="text-xs cursor-pointer hover:text-blue-600 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                                  onClick={() => handleQueryClick(query)}
                                >
                                  {query}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mt-4 mb-2 px-3">
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
      </ScrollArea>
    </div>
  )
}

export default Sidebar
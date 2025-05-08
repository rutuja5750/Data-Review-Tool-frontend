import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { Outlet } from "react-router";

function MainPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed sidebar */}
        <div className="w-64 shrink-0 border-r">
          <Sidebar />
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainPage
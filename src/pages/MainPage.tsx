import MainContent from "./MainContent";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

function MainPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed sidebar */}
        <div className="fixed w-64">
          <Sidebar />
        </div>
        {/* Main content with proper spacing */}
        <main className="flex-1 ml-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <MainContent />
        </main>
      </div>
    </div>
  )
}

export default MainPage
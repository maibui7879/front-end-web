import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

const AppLayout = ({ children, sidebarOpen, toggleSidebar }) => {
  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ml-20 md:ml-64 px-4 py-2`}>
        <div className="rounded-2xl shadow p-4 min-h-screen" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
          <Topbar />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AppLayout

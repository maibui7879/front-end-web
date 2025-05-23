import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({ children, sidebarOpen, toggleSidebar, setSidebarOpen }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      <div className="min-h-screen flex w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          className="hidden sm:block"
        />

        <div
          className="flex-1 transition-all duration-300 px-4 py-2 overflow-auto"
          style={{
            marginLeft: sidebarOpen ? "16rem" : "5rem",
            backdropFilter: "blur(10px)",
          }}
        >
          <Topbar />
          <div
            className="rounded-2xl shadow p-4 min-h-screen mt-4 overflow-visible"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;

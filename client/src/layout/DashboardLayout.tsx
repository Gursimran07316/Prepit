import { Outlet, NavLink } from "react-router"
import Logout from "../components/Logout"

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <aside className="w-60 flex-none bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-xl font-bold text-white tracking-tight">
            Prep<span className="text-blue-500">It</span>
          </span>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <Logout />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout

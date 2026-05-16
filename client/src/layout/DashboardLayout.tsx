import { useState } from "react"
import { Outlet, NavLink } from "react-router"
import Logout from "../components/Logout"

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Mobile overlay backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar — always visible on md+, drawer on mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-60 flex-none bg-gray-900 border-r border-gray-800 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <span className="text-xl font-bold text-white tracking-tight">
            Prep<span className="text-blue-500">It</span>
          </span>
          {/* Close button — mobile only */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-1"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <NavLink
            to="/dashboard"
            onClick={closeMenu}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
          <button
            className="text-gray-400 hover:text-white p-1 mr-3"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-bold text-white tracking-tight">
            Prep<span className="text-blue-500">It</span>
          </span>
        </header>

        <main className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

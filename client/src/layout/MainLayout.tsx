import { Outlet, Link } from "react-router"

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          Prep<span className="text-blue-500">It</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white text-sm transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Register
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export default MainLayout

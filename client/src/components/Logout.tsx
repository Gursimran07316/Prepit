
import { useAuth } from '../context/AuthContext'

const Logout = () => {
    const { logout } = useAuth()
  return (
    <button
      onClick={() => { logout(); }}
      className="w-full text-left text-gray-400 hover:text-white text-sm transition-colors px-4 py-2 rounded-md hover:bg-gray-800"
    >
      Sign out
    </button>
  )
}

export default Logout

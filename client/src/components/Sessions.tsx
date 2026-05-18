import { useNavigate, useLocation } from 'react-router'

type SessionType = {
  _id: string
  companyName: string
  jobTitle: string
}

type Props = {
  session: SessionType
  closeMenu: () => void
}

const Sessions = ({ session, closeMenu }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === `/session/${session._id}`

  return (
    <button
      onClick={() => {
        navigate(`/session/${session._id}`)
        closeMenu()
      }}
      className={`w-full text-left px-4 py-2 rounded-md transition-colors group ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <p className="text-sm truncate">{session.jobTitle}</p>
      <p className="text-xs text-gray-600 truncate group-hover:text-gray-400">
        {session.companyName}
      </p>
    </button>
  )
}

export default Sessions
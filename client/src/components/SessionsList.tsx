import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sessions from './Sessions'

type SessionType = {
  _id: string
  companyName: string
  jobTitle: string
}

type Props = {
  closeMenu: () => void
}

const SessionsList = ({ closeMenu }: Props) => {
  const { token } = useAuth()

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await api.get('/sessions/get')
      return response.data
    },
    enabled: !!token
  })

  if (isLoading) return (
    <p className="text-xs text-gray-600 px-4 py-2">Loading...</p>
  )

  if (sessions.length === 0) return (
    <p className="text-xs text-gray-600 px-4 py-2">No sessions yet</p>
  )

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-600 uppercase tracking-wider px-4 mb-2">
        Recent
      </p>
      <div className="space-y-0.5">
        {sessions.map((session: SessionType) => (
          <Sessions
            key={session._id}
            session={session}
            closeMenu={closeMenu}
          />
        ))}
      </div>
    </div>
  )
}

export default SessionsList
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sessions from './Sessions'

type SessionType = {
  _id: string
  companyName: string
  jobTitle: string
  requiredSkills: string[]
  preferredSkills: string[]
}

const SessionsList = () => {
  const { token } = useAuth()

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await api.get('/sessions/get')
      return response.data
    },
    enabled: !!token  // only fetch if token exists
  })

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-sm">Loading sessions...</p>
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm">You have no sessions yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session: SessionType) => (
            <Sessions key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SessionsList

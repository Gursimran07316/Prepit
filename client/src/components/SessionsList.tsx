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

  if (isLoading) return <div>Loading sessions...</div>

  return (
    <div>
      <h2>Your Sessions</h2>
      {sessions.length === 0 ? (
        <p>You have no sessions yet.</p>
      ) : (
        sessions.map((session: SessionType) => (
          <Sessions key={session._id} session={session} />
        ))
      )}
    </div>
  )
}

export default SessionsList
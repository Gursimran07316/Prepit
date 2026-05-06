// Interview.tsx
import { Navigate, useParams } from 'react-router'
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useInterview } from '../hooks/useInterview'
import MessageBubble from '../components/MessageBubble'
import ChatInput from '../components/ChatInput'
import api from '../api/axios'

const Interview = () => {
  const { sessionId } = useParams()
  const { token } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)

  if (!sessionId) return <Navigate to="/dashboard" replace />

  const { messages, input, setInput, sendMessage, isStreaming } = useInterview(sessionId)

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const response = await api.get(`/sessions/${sessionId}`)
      return response.data
    },
    enabled: !!sessionId && !!token
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) return <div>Loading session...</div>

  return (
    <div>
      {session && (
        <div>
          <h2>{session.jobTitle}</h2>
          <p>{session.companyName}</p>
        </div>
      )}

      <div>
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isStreaming && <p>Claude is typing...</p>}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        isStreaming={isStreaming}
      />
    </div>
  )
}

export default Interview
// Interview.tsx
import { Navigate, useParams } from 'react-router'
import {  useEffect, useRef } from 'react'
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

  const { messages, input, setInput, sendMessage, isStreaming,setMessages } = useInterview(sessionId)

  const { data: history } = useQuery({
    queryKey: ['sessionHistory', sessionId],
    queryFn: async () => {
      const response = await api.get(`/sessions/${sessionId}/conversations`)
      return response.data
    },
    enabled: !!sessionId && !!token
  })

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const response = await api.get(`/sessions/${sessionId}`)
      return response.data
    },
    enabled: !!sessionId && !!token
  })

  useEffect(() => {
    if (history && history.length > 0) {
      setMessages(history.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })))
    }
  }, [history])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) return (
    <div className="flex items-center justify-center flex-1">
      <p className="text-gray-400 text-sm">Loading session...</p>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {session && (
        <div className="flex-none border-b border-gray-800 bg-gray-900 px-6 py-4">
          <h2 className="text-white font-semibold text-base">{session.jobTitle}</h2>
          <p className="text-gray-400 text-sm">{session.companyName}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isStreaming && (
          <p className="text-gray-500 text-sm italic px-2 py-1">Claude is typing...</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex-none border-t border-gray-800 bg-gray-900 px-4 py-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}

export default Interview

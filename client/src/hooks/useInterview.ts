import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

type Message = {
  role: 'user' | 'assistant'
  content: string
  score?: number | null
  feedback?: string | null
}

export const useInterview = (sessionId: string) => {
  const { token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  // load conversation history on mount
  const { data: history ,isFetching} = useQuery({
    queryKey: ['conversations', sessionId],
    queryFn: async () => {
      const response = await api.get(`/sessions/${sessionId}/conversations`)
      return response.data
    },
    enabled: !!sessionId && !!token
  })

  useEffect(() => {
      
    if (isFetching) return
      if(history && history.length === 0 && !isStreaming) {
      sendMessage('Start the interview')
      return
    }

    if (history && history.length > 0) {
      setMessages(history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        score: msg.score,
        feedback: msg.feedback,
      })))
      
    }
    

  }, [history,isFetching])



  const sendMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return

    const currentMessage = message;

    setMessages(prev => [...prev, { role: 'user', content: currentMessage }])
    setIsStreaming(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('http://localhost:5003/api/interview/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, userMessage: currentMessage })
      })

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Readable stream not available')

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.startsWith('data:'))

        for (const line of lines) {
          const data = line.replace('data: ', '').trim()
          if (data === '[DONE]') break

          try {
            const { text } = JSON.parse(data)
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + text
              }
              return updated
            })
          } catch {
            // skip malformed chunks
          }
        }
      }

      // parse full response after stream completes
      setMessages(prev => {
        const updated = [...prev]
        const lastContent = updated[updated.length - 1].content

        const cleaned = lastContent
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()

        try {
          const parsed = JSON.parse(cleaned)
          updated[updated.length - 1] = {
            role: 'assistant',
            content: parsed.nextQuestion || cleaned,
            score: parsed.score,
            feedback: parsed.feedback,
          }
        } catch {
          // keep raw content if parse fails
        }

        return updated
      })

    } catch (error) {
      console.error('Stream error:', error)
    } finally {
      setIsStreaming(false)
    }
  }

  return { messages,   sendMessage, isStreaming }
}
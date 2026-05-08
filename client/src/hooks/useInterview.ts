import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export const useInterview = (sessionId: string) => {
  const { token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const currentMessage = input  // save before clearing

    setMessages(prev => [...prev, { role: 'user', content: currentMessage }])
    setInput('')
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

    } catch (error) {
      console.error('Stream error:', error)
    } finally {
      setIsStreaming(false)
    }
  }

  return { messages, input, setInput, sendMessage, isStreaming,setMessages }
}
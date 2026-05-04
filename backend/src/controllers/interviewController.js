import Anthropic from '@anthropic-ai/sdk'
import Session from '../models/Session.js'
import Conversation from '../models/Conversation.js'

export const respondToInterview = async (req, res) => {
  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const { sessionId, userMessage } = req.body

    // find session
    const session = await Session.findById(sessionId)
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // save user message
    await Conversation.create({
      sessionId,
      role: 'user',
      content: userMessage,
    })

    // get full history
    const conversationHistory = await Conversation.find({ sessionId })
      .sort({ createdAt: 1 })

    const historyContent = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // system prompt
    const systemPrompt = `You are an expert technical interviewer at ${session.companyName}.
You are interviewing a candidate for the role of ${session.jobTitle}.
Required skills to assess: ${session.requiredSkills.join(', ')}

Your behavior:
- Ask one focused technical question at a time
- After the candidate answers, provide structured feedback
- Score their answer from 1-10
- Then ask the next question

Return your response in this JSON format:
{
  "feedback": "detailed feedback on their answer",
  "score": 7,
  "nextQuestion": "your next interview question"
}
  
Return ONLY valid JSON. No markdown, no code blocks, no backticks. Raw JSON only.`

    // stream response
    let fullResponse = ''

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: historyContent
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        const text = chunk.delta.text
        fullResponse += text
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    // save assistant response after stream completes
    await Conversation.create({
      sessionId,
      role: 'assistant',
      content: fullResponse,
    })

    res.write(`data: [DONE]\n\n`)
    res.end()

  } catch (error) {
    console.error('Interview error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
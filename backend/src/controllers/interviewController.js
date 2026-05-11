import Session from '../models/Session.js'
import Conversation from '../models/Conversation.js'
import { createClaudeStream, logUsage, DIFFICULTY_CONFIG } from '../services/aiService.js'

export const respondToInterview = async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body

    const session = await Session.findById(sessionId)
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    await Conversation.create({
      sessionId,
      role: 'user',
      content: userMessage,
    })

    const conversationHistory = await Conversation.find({ sessionId })
      .sort({ createdAt: 1 })

    const historyContent = conversationHistory
      .slice(-10)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    const questionsAsked=conversationHistory.filter(msg=>msg.role=='assistant').map(msg=>msg.content);

    const config = DIFFICULTY_CONFIG[session.difficulty || 'standard']

    const systemPrompt = `You are an expert technical interviewer at ${session.companyName}.
You are interviewing a candidate for the role of ${session.jobTitle}.
Required skills to assess: ${session.requiredSkills.join(', ')}

Tone: ${config.tone}

Your behavior:
${config.behavior}

${questionsAsked.length > 0
  ? `Questions already asked — do NOT repeat any of these:\n${questionsAsked.map(q => `- ${q}`).join('\n')}`
  : ''
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no backticks.
{
  "feedback": "detailed feedback on their answer",
  "score": 7,
  "nextQuestion": "your next interview question"
}`

    let fullResponse = ''
    const startTime = Date.now()

    const stream = createClaudeStream({
      params: {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: historyContent
      }
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        const text = chunk.delta.text
        fullResponse += text
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }
console.log('difficulty:', session.difficulty)
console.log('fullResponse:', fullResponse)

    await logUsage({
      stream,
      userId: req.user._id,
      sessionId,
      startTime,
      model: 'claude-haiku-4-5-20251001'
    })

    const cleaned = fullResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    try {
      const parsed = JSON.parse(cleaned)
      await Conversation.create({
        sessionId,
        role: 'assistant',
        content: parsed.nextQuestion || cleaned,
        score: parsed.score,
        feedback: parsed.feedback,
      })
    } catch {
      await Conversation.create({
        sessionId,
        role: 'assistant',
        content: cleaned,
      })
    }

    res.write(`data: [DONE]\n\n`)
    res.end()

  } catch (error) {
    console.error('Interview error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
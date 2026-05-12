// tests/promptComparison.js
import dotenv from 'dotenv'
dotenv.config()

import Anthropic from '@anthropic-ai/sdk'
import { DIFFICULTY_CONFIG } from '../services/aiService.js'
import v1 from '../prompts/v1.js'
import v2 from '../prompts/v2.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// fake session data
const mockSession = {
  companyName: 'Google',
  jobTitle: 'Senior React Developer',
  requiredSkills: ['React', 'TypeScript', 'Node.js'],
  difficulty: 'standard'
}

// test answers to send
const testAnswers = [
  'I would use useState for local state and useContext for global state',
  'useCallback memoizes functions and useMemo memoizes values',
  'The event loop handles async operations in a single thread',
  'I would use JWT tokens stored in httpOnly cookies for auth',
  'React.memo prevents unnecessary re-renders of child components'
]

const INPUT_COST  = 1.00 / 1_000_000
const OUTPUT_COST = 5.00 / 1_000_000

const runTest = async (promptFn, versionName) => {
  console.log(`\n🧪 Testing ${versionName}...`)
  console.log('─'.repeat(50))

  const results = []
  const config = DIFFICULTY_CONFIG['standard']
  const questionsAsked = []

  for (let i = 0; i < testAnswers.length; i++) {
    const systemPrompt = promptFn({
      session: mockSession,
      questionsAsked,
      config
    })

    const startTime = Date.now()
  

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: testAnswers[i] }]
    })

    const latency = Date.now() - startTime
    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens
    const cost = (inputTokens * INPUT_COST) + (outputTokens * OUTPUT_COST)

    // check if JSON is valid
    let isValidJSON = false
    try {
  const rawText = response.content[0].text
  const cleaned = rawText          // 👈 add cleaning
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()
  const parsed = JSON.parse(cleaned)
  isValidJSON = !!(parsed.feedback && parsed.nextQuestion)
  questionsAsked.push(parsed.nextQuestion || '')
} catch {
  isValidJSON = false
  console.log('Failed JSON:', response.content[0].text.substring(0, 100))
}

    results.push({ inputTokens, outputTokens, cost, latency, isValidJSON })

    console.log(`Test ${i + 1}: input=${inputTokens} output=${outputTokens} cost=$${cost.toFixed(6)} json=${isValidJSON ? '✅' : '❌'} latency=${latency}ms`)
  }

  // calculate averages
  const avg = {
    inputTokens: Math.round(results.reduce((s, r) => s + r.inputTokens, 0) / results.length),
    outputTokens: Math.round(results.reduce((s, r) => s + r.outputTokens, 0) / results.length),
    cost: results.reduce((s, r) => s + r.cost, 0) / results.length,
    latency: Math.round(results.reduce((s, r) => s + r.latency, 0) / results.length),
    jsonCompliance: Math.round((results.filter(r => r.isValidJSON).length / results.length) * 100)
  }

  console.log(`\n📊 ${versionName} Averages:`)
  console.log(`   Input tokens:    ${avg.inputTokens}`)
  console.log(`   Output tokens:   ${avg.outputTokens}`)
  console.log(`   Cost per call:   $${avg.cost.toFixed(6)}`)
  console.log(`   Latency:         ${avg.latency}ms`)
  console.log(`   JSON compliance: ${avg.jsonCompliance}%`)

  return avg
}

const compare = async () => {
  console.log('🚀 PrepIt Prompt Comparison Test')
  console.log('Testing 5 answers against each prompt version\n')

  const v1Results = await runTest(v1, 'v1')
  const v2Results = await runTest(v2, 'v2')

  console.log('\n' + '═'.repeat(50))
  console.log('📈 COMPARISON RESULTS')
  console.log('═'.repeat(50))

  const tokenDiff = v1Results.inputTokens - v2Results.inputTokens
  const costDiff = ((v1Results.cost - v2Results.cost) / v1Results.cost * 100).toFixed(1)
  const latencyDiff = v1Results.latency - v2Results.latency

  console.log(`Input tokens:    v1=${v1Results.inputTokens} → v2=${v2Results.inputTokens} (${tokenDiff > 0 ? '-' : '+'}${Math.abs(tokenDiff)} tokens)`)
  console.log(`Cost per call:   v1=$${v1Results.cost.toFixed(6)} → v2=$${v2Results.cost.toFixed(6)} (${costDiff}% ${costDiff > 0 ? 'cheaper' : 'more expensive'})`)
  console.log(`Latency:         v1=${v1Results.latency}ms → v2=${v2Results.latency}ms`)
  console.log(`JSON compliance: v1=${v1Results.jsonCompliance}% → v2=${v2Results.jsonCompliance}%`)
  console.log('═'.repeat(50))
}

compare().catch(console.error)
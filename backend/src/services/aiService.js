// src/services/aiService.js
import Anthropic from '@anthropic-ai/sdk'

import UsageLog from '../models/UsageLog.js'



// cost per million tokens for Haiku 4.5
const INPUT_COST  = 1.00 / 1_000_000
const OUTPUT_COST = 5.00 / 1_000_000

export const createClaudeStream = ({ params }) => {
  const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})
  return client.messages.stream(params)  
}

// aiService.js — separate function just for logging
export const logUsage = async ({ stream, userId, sessionId, startTime, model }) => {
  const finalMessage = await stream.finalMessage()
  const { input_tokens, output_tokens } = finalMessage.usage
  const latency = Date.now() - startTime
  const cost = (input_tokens * INPUT_COST) + (output_tokens * OUTPUT_COST)

  await UsageLog.create({
    userId,
    sessionId,
    model,
    inputTokens: input_tokens,
    outputTokens: output_tokens,
    cost,
    latency
  })

  console.log(`input: ${input_tokens}, output: ${output_tokens}, cost: $${cost.toFixed(6)}, latency: ${latency}ms`)
}




export const parseJobPosting = async (jobPostingText) => {
    const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

  try {
    

    const prompt = `Below is a job posting. Extract the following information and return it as valid JSON in the following format:
jobTitle: String,
companyName: String,
requiredSkills: [String],
preferredSkills: [String]

   If any field is not found, use empty string or empty array.

Job posting:
${jobPostingText}
    `



    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
       messages: [
        {
            role: 'user',
            content: prompt
            }
        ]
        })



    const text = response.content[0].text;



    try {
        const cleaned = text
  .replace(/```json/g, '')  // remove opening ```json
  .replace(/```/g, '')      // remove closing ```
  .trim()             
      const data = JSON.parse(cleaned);
      return data;
    } catch (error) {
      console.error('Failed to parse JSON from Claude response:', error);
      throw new Error('Invalid JSON response from AI service');
    }
    

  } catch (error) {
    console.error('AI Service error:', error)
    throw error
  }
}
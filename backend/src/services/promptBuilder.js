// services/promptBuilder.js
import v1 from '../prompts/v1.js'
import v2 from '../prompts/v2.js'
import { DIFFICULTY_CONFIG } from './aiService.js'

const prompts = { v1,v2 }

export const buildInterviewPrompt = ({ session, questionsAsked }) => {
  const PROMPT_VERSION = process.env.PROMPT_VERSION || 'v1'
  const config = DIFFICULTY_CONFIG[session.difficulty || 'standard']
  const promptFn = prompts[PROMPT_VERSION]
  return promptFn({ session, questionsAsked, config })
}
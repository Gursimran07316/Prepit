import {PDFParse} from 'pdf-parse';
import Conversation from "../models/Conversation.js";
import Session from "../models/Session.js";
import { parseJobPosting } from "../services/aiService.js";

export const createSession = async (req, res) => {
    try {
      
        
        const { jobPostingText, difficulty } = req.body;
          if (!jobPostingText) {
        return res.status(400).json({ message: 'Job posting text is required' })
        }
        const result = await parseJobPosting(jobPostingText);
        
        
    let resumeText = null
   if (req.file) {
  try {
    
    const parser = new PDFParse({data: req.file.buffer});
    const data = await parser.getText();
    const text = data.text.trim();
  
    resumeText = text
    console.log('Resume parsed, length:', resumeText.length)
  } catch (err) {
    console.error('PDF parse error:', err.message)
    resumeText = null
  }
}
    
      

        const session= await Session.create({
            userId: req.user._id,
            jobTitle: result.jobTitle,
            companyName: result.companyName,
            requiredSkills: result.requiredSkills,
            preferredSkills: result.preferredSkills,
            difficulty: difficulty,
            jobPostingText: jobPostingText,
            resumeText: resumeText
        })

        res.status(201).json({ message: 'Session created successfully' ,session})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }   
}

export const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(sessions)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        if (!session) {
            return res.status(404).json({ message: 'Session not found' })
        }
        if (session.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' })
        }
        res.status(200).json(session)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getConvesationsBySessionId = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId)
        if (!session) {
            return res.status(404).json({ message: 'Session not found' })
        }
        if (session.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' })
        }
        const conversations = await Conversation.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 })
        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}   
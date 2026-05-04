import Session from "../models/Session.js";
import { parseJobPosting } from "../services/aiService.js";

export const createSession = async (req, res) => {
    try {
        
        const {jobPostingText} = req.body;
        const result = await parseJobPosting(jobPostingText);
        console.log(result);
        const session= await Session.create({
            userId: req.user._id,
            jobTitle: result.jobTitle,
            companyName: result.companyName,
            requiredSkills: result.requiredSkills,
            preferredSkills: result.preferredSkills,
            jobPostingText: jobPostingText,
            status: 'active'
        })

        res.status(200).json({ message: 'Session created successfully' ,session})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }   
}
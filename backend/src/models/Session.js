import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobPostingText: {
  type: String,
  required: true,
},
status: {
  type: String,
  enum: ['created', 'active', 'completed'],
  default: 'created',
},
  requiredSkills: {
    type: [String],
    required: true,
  },
    companyName: {  
    type: String,
    required: true,
  },
  preferredSkills: {
    type: [String],
      default: [],
  },
}, { timestamps: true   
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
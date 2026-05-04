import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  score:{
    type: Number,
    default: null,
  },
  feedback: {
  type: String,
  default: null,
}


}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
import mongoose from "mongoose";


const usagelogSchema = new mongoose.Schema({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      sessionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
      },
      inputTokens:{
        type: Number,
        default: 0,
      },
      model:{
        type: String,
        required: true,
      },
      outputTokens:{  
        type: Number,
        default: 0,
      },
      cost:{
        type: Number,
        default: 0,
      },
      latency: {
      type: Number,
      default: 0,
    }
    },
      {timestamps: true},

)

const UsageLog = mongoose.model('UsageLog', usagelogSchema);

export default UsageLog;
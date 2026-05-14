type MessageBubbleProps = {
  role: 'user' | 'assistant'
  content: string ,
   score?: number | null
  feedback?: string | null
  isStreaming?: boolean
}


const MessageBubble = ({ role, content, score, feedback, isStreaming }: MessageBubbleProps) => {
  const isUser = role === 'user'


  if (!isUser ) {
    
      if (isStreaming) {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-slate-800 rounded-lg p-4 max-w-2xl">
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )
    }
  
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-slate-800 rounded-lg p-4 max-w-2xl space-y-3">

          {/* feedback section */}
          {feedback && (
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Feedback
              </p>
              <p className="text-slate-200 text-sm">{feedback}</p>
            </div>
          )}

          {/* score section */}
          {score !== null && score !== undefined && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Score
              </p>
              <span className={`text-sm font-bold px-2 py-1 rounded ${
                score >= 7 ? 'bg-green-500/20 text-green-400' :
                score >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {score}/10
              </span>
            </div>
          )}

          {/* next question section */}
          {content && (
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Next Question
              </p>
              <p className="text-white font-medium">{content}</p>
            </div>
          )}

        </div>
      </div>
    )
  }

  // regular message (user or non-JSON assistant)
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`px-4 py-2 rounded-lg max-w-xl text-sm ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-slate-800 text-slate-200'
      }`}>
        {content}
      </div>
    </div>
  )
}

export default MessageBubble
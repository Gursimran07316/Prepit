type MessageBubbleProps = {
  role: 'user' | 'assistant'
  content: string
}

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  const isUser = role === 'user'


  if (!isUser && isValidJSON(content)) {
    const parsed = JSON.parse(content)
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-slate-800 rounded-lg p-4 max-w-2xl space-y-3">

          {/* feedback section */}
          {parsed.feedback && (
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Feedback
              </p>
              <p className="text-slate-200 text-sm">{parsed.feedback}</p>
            </div>
          )}

          {/* score section */}
          {parsed.score !== null && parsed.score !== undefined && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Score
              </p>
              <span className={`text-sm font-bold px-2 py-1 rounded ${
                parsed.score >= 7 ? 'bg-green-500/20 text-green-400' :
                parsed.score >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {parsed.score}/10
              </span>
            </div>
          )}

          {/* next question section */}
          {parsed.nextQuestion && (
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Next Question
              </p>
              <p className="text-white font-medium">{parsed.nextQuestion}</p>
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
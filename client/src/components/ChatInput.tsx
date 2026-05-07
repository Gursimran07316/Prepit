// ChatInput.tsx
type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isStreaming: boolean
}

const ChatInput = ({ value, onChange, onSend, isStreaming }: ChatInputProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSend()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your answer..."
        disabled={isStreaming}
        rows={2}
        className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-colors"
      />
      <button
        type="submit"
        disabled={isStreaming || !value.trim()}
        className="flex-none bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 text-sm transition-colors"
      >
        Send
      </button>
    </form>
  )
}

export default ChatInput

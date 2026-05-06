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
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your answer..."
        disabled={isStreaming}
        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isStreaming || !value.trim()}
        className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        Send
      </button>
    </form>
  )
}

export default ChatInput
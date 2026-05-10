import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'

type CreateSessionProps = {
  onClose: () => void
}



const CreateSession = ({ onClose }: CreateSessionProps) => {
  const [jobDes, setJobDes] = useState('')
  const [def, setDef] = useState('standard');
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: (jobPostingText: string) =>
      api.post('/sessions/create', { jobPostingText,difficulty: def }),
    onSuccess: (response) => {
    onClose()
      navigate(`/session/${response.data.session._id}`)
    },
    onError: () => {
      setError('Failed to create session. Please try again.')
    }
  })

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!jobDes.trim()) return
    setError('')
    mutate(jobDes)
  }

  return (
    <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-8">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Create Session
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Paste job description
          </label>
          <textarea
            placeholder="Paste your job description here..."
            value={jobDes}
            onChange={e => setJobDes(e.target.value)}
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 text-white
                       placeholder-gray-500 rounded-md px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       resize-none"
          />
          <label className="block text-sm text-gray-400 mt-4 mb-1">
            Select difficulty level
          </label>
          <select
            value={def}
            onChange={e => setDef(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white
                       rounded-md px-4 py-2.5 text-sm focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          >
            <option value={'friendly'}>Friendly</option>
            <option value={'standard'}>Standard</option>
            <option value={'tough'}>Tough</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isPending || !jobDes.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                     disabled:cursor-not-allowed text-white font-semibold
                     rounded-md px-4 py-2.5 text-sm transition-colors"
        >
          {isPending ? 'Creating session...' : 'Create Session'}
        </button>
      </form>
    </div>
  )
}

export default CreateSession
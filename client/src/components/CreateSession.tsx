import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import api from '../api/axios'

const CreateSession = () => {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDes, setJobDes] = useState('')
  const [difficulty, setDifficulty] = useState('standard')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient() 

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      api.post('/sessions/create', formData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] }) 
      navigate(`/session/${response.data.session._id}`)
    },
    onError: () => {
      setError('Failed to create session. Please try again.')
    }
  })
  const animationMap: Record<string, string> = {
  friendly: 'https://lottie.host/08c517b2-3451-464d-86fa-b22cc629bef0/XzvS2FDEcm.lottie',
  standard: 'https://lottie.host/34003d73-ec14-4e79-82d8-8ef37d197f36/WbKVHatcPA.lottie',
  tough:    'https://lottie.host/39ddac98-4d8f-4f52-975e-fd3e85d897fe/zO16IhLUYA.lottie',
}

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!jobDes.trim()) return
    setError('')
    const formData = new FormData()
    formData.append('jobPostingText', jobDes)
    formData.append('difficulty', difficulty)
    if (resume) formData.append('resume', resume)
    mutate(formData)
  }

  return (
    <div className="flex flex-col items-center justify-center
                    min-h-full w-full px-6 py-8">

      <div className="w-full max-w-md">

        {/* animation */}
        <div className="flex justify-center mb-2">
       <div className="w-24 h-24 sm:w-40 sm:h-40">
            <DotLottieReact
              key={difficulty}          
              src={animationMap[difficulty]}
              loop
              autoplay
            />
</div>
        </div>

        {/* heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            New Interview Session
          </h1>
          <p className="text-gray-500 text-sm">
            Paste a job posting and start practicing
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Job description
            </label>
            <textarea
              placeholder="Paste the full job posting here..."
              value={jobDes}
              onChange={e => setJobDes(e.target.value)}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 text-white
                         placeholder-gray-600 rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {(['friendly', 'standard', 'tough'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium
                              capitalize transition-colors ${
                    difficulty === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Resume <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setResume(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-400
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:text-sm file:font-medium
                         file:bg-gray-800 file:text-gray-300
                         hover:file:bg-gray-700 cursor-pointer"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isPending || !jobDes.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                       disabled:cursor-not-allowed text-white font-semibold
                       rounded-lg px-4 py-3 text-sm transition-colors"
          >
            {isPending ? 'Analyzing...' : 'Start Interview →'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateSession
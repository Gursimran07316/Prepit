import { useState } from 'react'
import CreateSession from '../components/CreateSession'
import SessionsList from '../components/SessionsList'

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Your Sessions</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pick up where you left off or start a new interview
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black text-sm font-medium px-4 py-2 
                       rounded-md hover:bg-gray-100 transition-colors"
          >
            + New Session
          </button>
        </div>

        {/* Sessions List */}
        <SessionsList />

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm 
                     flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}  // close on backdrop click
        >
          <div
            onClick={e => e.stopPropagation()}  // prevent closing on form click
          >
            <CreateSession onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
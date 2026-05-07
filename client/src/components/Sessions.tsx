import { useNavigate } from "react-router"


type SessionType = {
    _id: string
    companyName: string,
    jobTitle: string,
    requiredSkills: string[],
    preferredSkills: string[]
}



const Sessions = ({ session }: { session: SessionType }) => {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors">
      <div>
        <h3 className="text-white font-semibold text-lg leading-tight">{session.companyName}</h3>
        <p className="text-gray-400 text-sm mt-1">{session.jobTitle}</p>
      </div>
      {session.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {session.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={() => { navigate(`/session/${session._id}`) }}
        className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md px-4 py-2.5 transition-colors"
      >
        Start Interview
      </button>
    </div>
  )
}

export default Sessions

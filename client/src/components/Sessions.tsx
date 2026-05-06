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
    <div>
      <h3>{session.companyName}</h3>
      <p><strong>Job Title:</strong> {session.jobTitle}</p> 
      <button onClick={()=>{navigate(`/session/${session._id}`)}}>Start Interview</button>
    </div>
  )
}

export default Sessions
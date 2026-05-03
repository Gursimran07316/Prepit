import { useQuery } from '@tanstack/react-query'
const UserList = () => {
    const fetchUser = async () => {
        const res=await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!res.ok) throw new Error('Failed to fetch')

        return res.json();
        
    }

    const {data, error, isLoading,refetch} = useQuery({queryKey: ['users'], queryFn: fetchUser});
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div> 
    if (data) {
        console.log(data)
        return  (<> {data.map((user: any) => (<div key={user.id}>
        <h2>{user.name}</h2>
        <h2>{user.email}</h2>
        <h2>{user.address?.city}</h2>
        

        </div>
    ))}
    <button onClick={() => refetch()}>Refetch</button>

</>)
    }
        
  
  
}

export default UserList
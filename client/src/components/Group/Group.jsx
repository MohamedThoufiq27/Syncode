import { useSharedData } from '../../hooks/useSharedData'


const Group = () => {
    const {members} = useSharedData();  
    
  return (
    <div className='flex'>
        {/* <div className='p-2 m-2 rounded-lg bg-amber-200'>
            {username}
        </div> */}

        {Array.isArray(members) && members.length > 0 ? (
        <div className='p-2 m-2 rounded-lg bg-fuchsia-400'>
          <h2 className='text-white font-bold mb-2'>Room Members:</h2>
          <ul>
            {members.map((member, index) => (
              <li key={index} className='text-white'>
                👤 {member.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='text-white m-4'>Please Login to Show users</p>
      )}
    </div>
  )
}

export default Group
import { useState, useEffect} from "react"
import { getAllTeams, createTeam } from "../api/teams"
export function Teams(){

    const [ teams, setTeams ] = useState([])
    useEffect(()=> {
        const fetchData = async() => {
            const teamsSet = await getAllTeams()
            setTeams(teamsSet)
        } 
        fetchData()  
    }, [])

    async function handleCreate(){
        try{
            const newTeamData = {
                name: "New Team",
                description: "New Team description",
            }

            const newTeam = await createTeam (newTeamData)
            setTeams([...teams, newTeam])

        } catch(error){
           console.error("create failed", error)
        }
        
    }
    return (
        <>
           <button onClick={handleCreate}> Create Team </button>
           {teams.map((team)=> (
             <div key={team.id}>
               <p>{team.name}</p>
               <p>{team.description}</p>
             </div>        

           ))}
            
        </>
    )
}
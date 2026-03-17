import { useEffect } from "react"
import { getAllProjects } from "../api/projects"
import { getMyTasks } from "../api/tasks"
import { getAllTeams } from "../api/teams"
import { useState } from "react"

export function Dashboard() {

    const [ project, setProject ] = useState([])
    const [ task, setTask] = useState([])
    const [ team, setTeam ] = useState([])

    useEffect(()=> {
        async function fetchData(){
            const projects = await getAllProjects()
            setProject(projects)

            const tasks = await getMyTasks()
            setTask(tasks)

            const teams = await getAllTeams()
            setTeam(teams)         
        }   
        fetchData() 
    }, [])


   
    return (
        <>
         <p> Project: {project.length}</p>
         <p> Task assigned to you: {task.length} </p>
         <p> Teams: {team.length}</p>
            
        </>
    )
}
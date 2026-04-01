import { useEffect, useState } from "react";
import { getMyTasks, updateTask } from "../api/tasks";


export function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(()=>{
     const fetchData = async() => {
        const tasksSet = await getMyTasks()
        setTasks(tasksSet)
    }
    fetchData()
  }, [])

  async function handleUpdate(id){

    try {
        const updates = {
            status: "IN_PROGRESS",
        };

        const updatedTask = await updateTask(id, updates)
        
        const updatedTasks = tasks.map((task) => (
            task.id === id ? updatedTask : task
        ))

        setTasks(updatedTasks)

    } catch (error) {
        console.error("update failed", error);
    }

  }
  return (

   <>
    {tasks.map((task) => (
      <div className="card" key={task.id}>
        <p><strong>{task.title}</strong></p>
        <p>Status: {task.status}</p>

        <button
          className="btn"
          onClick={() => handleUpdate(task.id)}
        >
          Update
        </button>
      </div>
    ))}
  </>
  )

  ;
}


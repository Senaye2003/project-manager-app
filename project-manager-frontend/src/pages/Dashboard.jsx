import { useEffect } from "react";
import { getAllProjects } from "../api/projects";
import { getMyTasks } from "../api/tasks";
import { getAllTeams } from "../api/teams";
import { useState } from "react";

export function Dashboard() {
  const [project, setProject] = useState([]);
  const [task, setTask] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const projects = await getAllProjects();
      setProject(projects);

      const tasks = await getMyTasks();
      setTask(tasks);

      const teams = await getAllTeams();
      setTeam(teams);
    }
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <div className="card">
        <p>
          <strong>Projects</strong>
        </p>
        <p>{project.length}</p>
      </div>

      <div className="card">
        <p>
          <strong>Tasks Assigned</strong>
        </p>
        <p>{task.length}</p>
      </div>

      <div className="card">
        <p>
          <strong>Teams</strong>
        </p>
        <p>{team.length}</p>
      </div>
    </div>
  );
}

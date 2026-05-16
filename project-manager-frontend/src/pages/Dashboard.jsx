import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../api/projects";
import { getMyTasks } from "../api/tasks";
import { getAllTeams } from "../api/teams";

export function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, tasksData, teamsData] = await Promise.all([
          getAllProjects(),
          getMyTasks(),
          getAllTeams(),
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
        setTeams(teamsData);
      } catch (err) {
        console.error("dashboard load failed", err);
      }
    }
    fetchData();
  }, []);

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      hint: "View all projects",
      to: "/projects",
    },
    {
      label: "My tasks",
      value: tasks.length,
      hint: "Tasks assigned to you",
      to: "/tasks",
    },
    {
      label: "Teams",
      value: teams.length,
      hint: "View all teams",
      to: "/teams",
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="page-header__subtitle">Overview of your workspace</span>
      </div>

      <div className="dashboard-grid">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(s.to)}
            onKeyDown={(e) => (e.key === "Enter" ? navigate(s.to) : null)}
          >
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__hint">{s.hint}</div>
          </div>
        ))}
      </div>
    </>
  );
}

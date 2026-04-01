import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import { useState, useEffect } from "react";

export function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const projectSets = await getAllProjects();
      setProjects(projectSets);
    };
    fetchData();
  }, []);

  async function handleCreate() {
    try {
      const newProjectData = {
        name: "New Project",
        description: "New project description",
        status: "TO_DO",
      };

      const newProject = await createProject(newProjectData);

      setProjects([...projects, newProject]);
    } catch (error) {
      console.error("create failed", error);
    }
  }

  async function handleDelete(id) {
    await deleteProject(id);
    const updatedProjects = projects.filter((project) => project.id != id);
    setProjects(updatedProjects);
  }

  async function handleUpdate(id) {
    try {
      const updates = {
        status: "IN_PROGRESS",
      };

      const updatedProject = await updateProject(id, updates);

      const updatedProjects = projects.map((project) =>
        project.id === id ? updatedProject : project,
      );

      setProjects(updatedProjects);
    } catch (error) {
      console.error("update failed", error);
    }
  }

  return (
    <>
      <button className="btn" onClick={handleCreate}>
        Create Project
      </button>

      {projects.map((project) => (
        <div className="card" key={project.id}>
          <p>
            <strong>{project.name}</strong>
          </p>
          <p>Status: {project.status}</p>
          <p>{project.description}</p>

          <button
            className="btn btn--danger"
            onClick={() => handleDelete(project.id)}
          >
            Delete
          </button>

          <button className="btn" onClick={() => handleUpdate(project.id)}>
            Update
          </button>
        </div>
      ))}
    </>
  );
}

import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import { useState, useEffect } from "react";

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "TO_DO",
    startDate: "",
    teamId: "",
    projectManagerId: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("failed to fetch projects", error);
      setMessage("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate || undefined,
        teamId: formData.teamId || undefined,
        projectManagerId: formData.projectManagerId || undefined,
      };

      if (editingId) {
        await updateProject(editingId, payload);
        setMessage("Project updated successfully.");
        setEditingId(null);
      } else {
        const created = await createProject(payload);
        console.log("created project:", created);
        setMessage("Project created successfully.");
      }

      setFormData({
        name: "",
        description: "",
        status: "TO_DO",
        startDate: "",
        teamId: "",
        projectManagerId: "",
      });

      await fetchProjects();
    } catch (error) {
      console.error("submit failed", error);
      console.log("backend error:", error.response?.data);
      setMessage(error.response?.data?.message || "Project action failed.");
    }
  }

  function handleEdit(project) {
    setEditingId(project.id);
    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "TO_DO",
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      teamId: project.teamId ? String(project.teamId) : "",
      projectManagerId: project.projectManagerId
        ? String(project.projectManagerId)
        : "",
    });
    setMessage("");
  }

  async function handleDelete(id) {
    try {
      await deleteProject(id);
      setMessage("Project deleted successfully.");
      await fetchProjects();

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("delete failed", error);
      console.log("backend error:", error.response?.data);
      setMessage(error.response?.data?.message || "Delete failed.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      status: "TO_DO",
      startDate: "",
      teamId: "",
      projectManagerId: "",
    });
    setMessage("");
  }

  if (loading) {
    return <h2>Loading projects...</h2>;
  }

  return (
    <>
      <div className="page-header">
        <h1>Projects</h1>
        <span className="page-header__subtitle">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {message && <div className="banner">{message}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "20px" }}>
        <h3>{editingId ? "Update project" : "Create project"}</h3>

        <input
          className="login-input"
          type="text"
          name="name"
          placeholder="Project name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          type="text"
          name="description"
          placeholder="Project description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          className="login-input"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="TO_DO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="UNDER_REVIEW">Under review</option>
          <option value="COMPLETE">Complete</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          className="login-input"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <input
          className="login-input"
          type="number"
          name="teamId"
          placeholder="Team ID"
          value={formData.teamId}
          onChange={handleChange}
        />

        <input
          className="login-input"
          type="number"
          name="projectManagerId"
          placeholder="Project Manager ID"
          value={formData.projectManagerId}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button className="btn" type="submit">
            {editingId ? "Save changes" : "Create project"}
          </button>

          {editingId && (
            <button
              className="btn btn--secondary"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects yet</h3>
          <p>Create your first project using the form above.</p>
        </div>
      ) : (
        <div className="list">
          {projects.map((project) => (
            <div className="item-card" key={project.id}>
              <div className="item-card__head">
                <div className="item-card__title">{project.name}</div>
                <span className={`badge badge--${project.status}`}>
                  {project.status.replace("_", " ")}
                </span>
              </div>

              {project.description && (
                <div className="item-card__desc">{project.description}</div>
              )}

              <div className="item-card__meta">
                <span>
                  <strong>Start</strong>{" "}
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "—"}
                </span>
                <span>
                  <strong>Team</strong> {project.teamId ?? "—"}
                </span>
                <span>
                  <strong>Manager</strong> {project.projectManagerId ?? "—"}
                </span>
              </div>

              <div className="item-card__actions">
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
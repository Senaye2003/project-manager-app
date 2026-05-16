import { useEffect, useState } from "react";
import { getAllTasks, createTask, updateTask, deleteTask } from "../api/tasks";

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    status: "TO_DO",
    projectId: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("fetch failed", error);
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

    try {
      const payload = {
        title: formData.title,
        status: formData.status,
        projectId: parseInt(formData.projectId),
      };

      if (editingId) {
        await updateTask(editingId, payload);
        setEditingId(null);
      } else {
        await createTask(payload);
      }

      setFormData({
        title: "",
        status: "TO_DO",
        projectId: "",
      });

      await fetchTasks();
    } catch (error) {
      console.error("submit failed", error);
      console.log(error.response?.data);
    }
  }

  function handleEdit(task) {
    setEditingId(task.id);
    setFormData({
      title: task.title || "",
      status: task.status || "TO_DO",
      projectId: task.projectId ? String(task.projectId) : "",
    });
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error("delete failed", error);
    }
  }

  if (!tasks) return <h2>Loading...</h2>;

  return (
    <>
      <div className="page-header">
        <h1>Tasks</h1>
        <span className="page-header__subtitle">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* FORM */}
      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h3>{editingId ? "Update task" : "Create task"}</h3>

        <input
          className="login-input"
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
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
          type="number"
          name="projectId"
          placeholder="Project ID"
          value={formData.projectId}
          onChange={handleChange}
          required
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button className="btn" type="submit">
            {editingId ? "Save changes" : "Create task"}
          </button>
          {editingId && (
            <button
              className="btn btn--secondary"
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: "", status: "TO_DO", projectId: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks yet</h3>
          <p>Create your first task using the form above.</p>
        </div>
      ) : (
        <div className="list">
          {tasks.map((task) => (
            <div className="item-card" key={task.id}>
              <div className="item-card__head">
                <div className="item-card__title">{task.title}</div>
                <span className={`badge badge--${task.status}`}>
                  {task.status.replace("_", " ")}
                </span>
              </div>

              <div className="item-card__meta">
                <span>
                  <strong>Project</strong> {task.projectId}
                </span>
                {task.assignedTo && (
                  <span>
                    <strong>Assignee</strong> {task.assignedTo}
                  </span>
                )}
              </div>

              <div className="item-card__actions">
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => handleDelete(task.id)}
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
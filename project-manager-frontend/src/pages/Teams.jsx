import { useState, useEffect } from "react";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../api/teams";

export function Teams() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      const teamsSet = await getAllTeams();
      setTeams(teamsSet);
    } catch (error) {
      console.error("failed to fetch teams", error);
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
      if (editingId) {
        await updateTeam(editingId, formData);
        setEditingId(null);
      } else {
        await createTeam(formData);
      }

      setFormData({
        name: "",
        description: "",
      });

      await fetchTeams();
    } catch (error) {
      console.error("submit failed", error);
      console.log(error.response?.data);
    }
  }

  function handleEdit(team) {
    setEditingId(team.id);
    setFormData({
      name: team.name || "",
      description: team.description || "",
    });
  }

  async function handleDelete(id) {
    try {
      await deleteTeam(id);
      await fetchTeams();

      if (editingId === id) {
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("delete failed", error);
      console.log(error.response?.data);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
    });
  }

  return (
    <>
      <div className="page-header">
        <h1>Teams</h1>
        <span className="page-header__subtitle">
          {teams.length} {teams.length === 1 ? "team" : "teams"}
        </span>
      </div>

      <form
        className="card"
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px" }}
      >
        <h3>{editingId ? "Update team" : "Create team"}</h3>

        <input
          className="login-input"
          type="text"
          name="name"
          placeholder="Team name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          type="text"
          name="description"
          placeholder="Team description (note: not yet persisted)"
          value={formData.description}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button className="btn" type="submit">
            {editingId ? "Save changes" : "Create team"}
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

      {teams.length === 0 ? (
        <div className="empty-state">
          <h3>No teams yet</h3>
          <p>Create your first team using the form above.</p>
        </div>
      ) : (
        <div className="list">
          {teams.map((team) => {
            const memberCount = team.members?.length ?? 0;
            const projectCount = team.projects?.length ?? 0;
            return (
              <div className="item-card" key={team.id}>
                <div className="item-card__head">
                  <div className="item-card__title">{team.name}</div>
                </div>

                <div className="item-card__meta">
                  <span>
                    <strong>Members</strong> {memberCount}
                  </span>
                  <span>
                    <strong>Projects</strong> {projectCount}
                  </span>
                </div>

                <div className="item-card__actions">
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => handleEdit(team)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(team.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:1000";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= LOAD NOTES ================= */
  const loadNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.log("Error loading notes", err);
      if (err.response?.status === 403) logout();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
      return;
    }
    loadNotes();
  }, [loadNotes, token]);

  /* ================= ADD NOTE ================= */
  const addNote = async () => {
    if (!title || !content) {
      alert("Title & Content required");
      return;
    }

    await axios.post(
      `${API}/notes`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setTitle("");
    setContent("");
    loadNotes();
  };

  /* ================= UPDATE NOTE ================= */
  const updateNote = async () => {
    await axios.put(
      `${API}/notes/${editId}`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setEditId(null);
    setTitle("");
    setContent("");
    loadNotes();
  };

  /* ================= DELETE NOTE ================= */
  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadNotes();
  };

  /* ================= SHARE NOTE ================= */
  const shareNote = async (id) => {
    try {
      const res = await axios.get(`${API}/notes/${id}/share`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const shareLink = `${API}/notes/public/${res.data.token}`;
      navigator.clipboard.writeText(shareLink);
      alert("Share link copied!\n" + shareLink);
    } catch (err) {
      console.log(err);
      alert("Failed to generate share link");
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  /* ================= SEARCH ================= */
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={{ color: "#fff" }}>My Notes</h2>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <input
        style={styles.search}
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          style={styles.textarea}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {editId ? (
          <button style={styles.saveBtn} onClick={updateNote}>
            Save
          </button>
        ) : (
          <button style={styles.addBtn} onClick={addNote}>
            Add Note
          </button>
        )}
      </div>

      {/* NOTES LIST */}
      <div style={styles.notesGrid}>
        {filteredNotes.map((n) => (
          <div key={n.id} style={styles.noteCard}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>

            <div style={styles.cardBtns}>
              <button
                style={styles.editBtn}
                onClick={() => {
                  setEditId(n.id);
                  setTitle(n.title);
                  setContent(n.content);
                }}
              >
                Edit
              </button>

              <button style={styles.deleteBtn} onClick={() => deleteNote(n.id)}>
                Delete
              </button>

              <button style={styles.shareBtn} onClick={() => shareNote(n.id)}>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  logoutBtn: {
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  search: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginBottom: "15px",
  },
  form: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    marginBottom: "10px",
  },
  addBtn: {
    background: "#667eea",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },
  saveBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },
  noteCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
  },
  cardBtns: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  editBtn: {
    background: "#ffc107",
    border: "none",
    padding: "6px",
    borderRadius: "5px",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px",
    borderRadius: "5px",
  },
  shareBtn: {
    background: "#17a2b8",
    color: "#fff",
    border: "none",
    padding: "6px",
    borderRadius: "5px",
  },
};

import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:1000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f6f8",
      fontFamily: "Arial",
    },
    form: {
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      width: "300px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },
    registerButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },
    title: {
      marginBottom: "15px",
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/notes";
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register"; // Redirects to register page
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} type="submit">
          Login
        </button>

        <button
          type="button"
          style={styles.registerButton}
          onClick={handleRegisterRedirect}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;

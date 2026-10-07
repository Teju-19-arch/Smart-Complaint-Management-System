import React, { useState } from "react";
import { registerUser, errorMessage } from "../api";

function Register({ onRegistered, goToLogin }) {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (e) => {

e.preventDefault();

const cleanName = name.trim();
const cleanEmail = email.trim().toLowerCase();

/* Client-side checks (the server validates again) */

if (!cleanName || !cleanEmail || !password || !confirmPassword) {
setError("Please fill in all fields.");
return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
setError("Please enter a valid email address.");
return;
}

if (password.length < 8) {
setError("Password must be at least 8 characters.");
return;
}

if (password !== confirmPassword) {
setError("Passwords do not match.");
return;
}

setLoading(true);
setError("");

try {

await registerUser({
name: cleanName,
email: cleanEmail,
password,
confirmPassword
});

onRegistered(cleanEmail);

} catch (err) {

setError(errorMessage(err));

} finally {

setLoading(false);

}

};

return (

<div style={styles.page}>

<div style={styles.card}>

<h2 style={styles.title}>
🎓 Create Account
</h2>

<form onSubmit={handleRegister} style={styles.form}>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e) => setName(e.target.value)}
style={styles.input}
required
/>

<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={styles.input}
required
/>

<input
type="password"
placeholder="Password (min 8 characters)"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={styles.input}
required
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
style={styles.input}
required
/>

<button
type="submit"
style={styles.button}
disabled={loading}
>
{loading ? "Registering..." : "Register"}
</button>

</form>

{error && (
<p style={styles.error}>
{error}
</p>
)}

<p style={styles.switchText}>
Already have an account?{" "}
<span style={styles.link} onClick={goToLogin}>
Back to Login
</span>
</p>

</div>

</div>

);

}

const styles = {

page: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "linear-gradient(135deg,#4facfe,#00f2fe)"
},

card: {
background: "white",
padding: "40px",
borderRadius: "12px",
width: "320px",
textAlign: "center",
boxShadow: "0px 10px 30px rgba(0,0,0,0.2)"
},

title: {
marginBottom: "20px",
color: "#333"
},

form: {
display: "flex",
flexDirection: "column"
},

input: {
padding: "10px",
marginBottom: "15px",
borderRadius: "6px",
border: "1px solid #ccc",
fontSize: "14px"
},

button: {
padding: "10px",
borderRadius: "6px",
border: "none",
background: "linear-gradient(135deg,#667eea,#764ba2)",
color: "white",
fontWeight: "bold",
cursor: "pointer"
},

error: {
marginTop: "10px",
color: "red"
},

switchText: {
marginTop: "15px",
fontSize: "14px",
color: "#555"
},

link: {
color: "#667eea",
fontWeight: "bold",
cursor: "pointer"
}

};

export default Register;

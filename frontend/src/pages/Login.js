import React, { useState } from "react";

function Login({ setUser }) {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const [attempts, setAttempts] = useState(0);
const [blocked, setBlocked] = useState(false);

/* Student accounts */

const students = [
{ email: "student1@gmail.com", password: "12345" },
{ email: "student2@gmail.com", password: "12345" },
{ email: "student3@gmail.com", password: "12345" }
];

/* Admin account */

const admin = {
email: "admin@campus.com",
password: "admin123"
};

const handleLogin = (e) => {

e.preventDefault();

const cleanEmail = email.trim().toLowerCase();

/* Check rate limit */

if (blocked) {
setError("Too many login attempts. Try again in 30 seconds.");
return;
}

/* Admin login */

if (
cleanEmail === admin.email.toLowerCase() &&
password === admin.password
) {

setAttempts(0);
setError("");
setUser("admin");
return;

}

/* Student login */

const student = students.find(
s =>
s.email.toLowerCase() === cleanEmail &&
s.password === password
);

if (student) {

setAttempts(0);
setError("");
setUser("student");
return;

}

/* Incorrect login */

const newAttempts = attempts + 1;
setAttempts(newAttempts);

setError("Incorrect email or password. Try again.");

/* Block after 5 failed attempts */

if (newAttempts >= 5) {

setBlocked(true);

setError("Too many attempts. Login blocked for 30 seconds.");

setTimeout(() => {
setAttempts(0);
setBlocked(false);
setError("");
}, 30000);

}

};

return (

<div style={styles.page}>

<div style={styles.card}>

<h2 style={styles.title}>
🎓 Smart Campus Complaint System
</h2>

<form onSubmit={handleLogin} style={styles.form}>

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
placeholder="Enter Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={styles.input}
required
/>

<button
type="submit"
style={styles.button}
disabled={blocked}
>
Login
</button>

</form>

{error && (
<p style={styles.error}>
{error}
</p>
)}

</div>

</div>

);

}

const styles = {

page: {
height: "100vh",
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
}

};

export default Login;
import React, { useState, useEffect } from "react";

function StudentDashboard() {

const [description,setDescription] = useState("");
const [category,setCategory] = useState("Electricity");
const [location,setLocation] = useState("Library");
const [image,setImage] = useState(null);

const [complaints,setComplaints] = useState([]);
const [filter,setFilter] = useState("All");

const [chatMessages,setChatMessages] = useState([]);
const [chatInput,setChatInput] = useState("");
const [openChat,setOpenChat] = useState(false);


/* Load complaints */

useEffect(()=>{

const stored = JSON.parse(localStorage.getItem("complaints")) || [];

setComplaints(stored);

},[]);


/* AI Priority Prediction */

const predictPriority = (text)=>{

text = text.toLowerCase();

if(text.includes("fire") ||
text.includes("spark") ||
text.includes("electric") ||
text.includes("gas") ||
text.includes("danger")){
return "High";
}

if(text.includes("wifi") ||
text.includes("internet") ||
text.includes("water") ||
text.includes("broken")){
return "Medium";
}

return "Low";

};


/* Submit Complaint */

const submitComplaint = (e)=>{

e.preventDefault();

const aiPriority = predictPriority(description);

const newComplaint = {

id:"CMP"+Date.now(),

description,

priority:aiPriority,

category,

location,

status:"Pending",

date:new Date().toLocaleString(),

image:image ? URL.createObjectURL(image) : null

};

const updated=[...complaints,newComplaint];

localStorage.setItem("complaints",JSON.stringify(updated));

setComplaints(updated);

setDescription("");
setImage(null);

};


/* Filter complaints */

const filteredComplaints =
filter==="All"
? complaints
: complaints.filter(c=>c.status===filter);


/* Chatbot */

const sendChat=()=>{

if(chatInput==="") return;

const user={sender:"Student",text:chatInput};

const bot={
sender:"Assistant",
text:"Management will respond shortly."
};

setChatMessages([...chatMessages,user,bot]);

setChatInput("");

};


return(

<div className="student-dashboard">

<h1>🎓 Student Dashboard</h1>

<div className="welcome-banner">

<h2>Welcome back 👋</h2>

<p>Submit complaints and track campus issues easily.</p>

</div>


<div className="complaint-box">

<h3>Raise Complaint</h3>

<form onSubmit={submitComplaint}>

<textarea
placeholder="Write complaint..."
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>


<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option>Electricity</option>
<option>Water</option>
<option>Cleaning</option>
<option>Internet</option>
<option>Maintenance</option>

</select>


<select
value={location}
onChange={(e)=>setLocation(e.target.value)}
>

<option>Library</option>
<option>Hostel</option>
<option>Canteen</option>
<option>Parking</option>
<option>Classroom</option>

</select>


<input
type="file"
onChange={(e)=>setImage(e.target.files[0])}
/>


{image && (

<img
src={URL.createObjectURL(image)}
width="120"
alt="preview"
/>

)}


<button type="submit">
Submit Complaint
</button>

</form>

</div>


<h2>My Complaints</h2>

<div className="filters">

<button onClick={()=>setFilter("All")}>All</button>

<button onClick={()=>setFilter("Pending")}>Pending</button>

<button onClick={()=>setFilter("Resolved")}>Resolved</button>

</div>


{filteredComplaints.map((c)=>(

<div key={c.id} className="complaint-card">

<p>🎟 <b>Ticket:</b> {c.id}</p>

<p>📝 <b>Description:</b> {c.description}</p>

<p>⚡ <b>Category:</b> {c.category}</p>

<p>📍 <b>Location:</b> {c.location}</p>

<p>🔥 <b>AI Priority:</b> {c.priority}</p>

<p>📊 <b>Status:</b> {c.status}</p>

<p>📅 <b>Date:</b> {c.date}</p>

{c.image && (

<img
src={c.image}
width="200"
alt="complaint"
/>

)}

{c.solution && (

<p>✅ <b>Solution:</b> {c.solution}</p>

)}

</div>

))}


<div
className="chatbot"
onClick={()=>setOpenChat(!openChat)}
>
💬
</div>


{openChat && (

<div className="chat-window">

<h4>Campus Assistant</h4>

<div className="chat-messages">

{chatMessages.map((msg,i)=>(

<div key={i}>
<b>{msg.sender}:</b> {msg.text}
</div>

))}

</div>


<input
value={chatInput}
onChange={(e)=>setChatInput(e.target.value)}
/>

<button onClick={sendChat}>Send</button>

</div>

)}

</div>

);

}

export default StudentDashboard;
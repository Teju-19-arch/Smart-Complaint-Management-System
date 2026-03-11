import React, { useState, useEffect } from "react";

/* Chart Imports */
import { Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
ArcElement,
Tooltip,
Legend
);

function AdminDashboard() {

const [complaints, setComplaints] = useState([]);
const [solutionText, setSolutionText] = useState("");
const [search, setSearch] = useState("");

/* Load complaints */
useEffect(() => {

const stored =
JSON.parse(localStorage.getItem("complaints")) || [];

setComplaints(stored);

}, []);


/* Resolve complaint */
const resolveComplaint = (id) => {

if (solutionText.trim() === "") {

alert("Please write solution first");

return;

}

const updated = complaints.map((c) => {

if (c.id === id) {

return {
...c,
status: "Resolved",
solution: solutionText
};

}

return c;

});

localStorage.setItem(
"complaints",
JSON.stringify(updated)
);

setComplaints(updated);

setSolutionText("");

};


/* Search filter */

const filtered = complaints.filter((c) =>
c.description.toLowerCase().includes(
search.toLowerCase()
)
);


/* Stats */

const total = complaints.length;

const resolved =
complaints.filter(
(c) => c.status === "Resolved"
).length;

const pending = total - resolved;


/* Chart Data */

const chartData = {

labels: ["Resolved", "Pending"],

datasets: [

{

data: [resolved, pending],

backgroundColor: [

"#2ecc71",
"#f39c12"

],

borderWidth: 1

}

]

};


return (

<div className="admin-dashboard">

<h1>🏢 Management Dashboard</h1>


{/* Statistics */}

<div className="stats">

<div className="box">
📊 <br />
Total <br />
{total}
</div>

<div className="box">
⏳ <br />
Pending <br />
{pending}
</div>

<div className="box">
✅ <br />
Resolved <br />
{resolved}
</div>

</div>


{/* Chart */}

<div className="analytics-chart">

<h2>📊 Complaint Analytics</h2>

<Pie data={chartData} />

</div>


{/* Search */}

<input
placeholder="Search complaints..."
value={search}
onChange={(e) => setSearch(e.target.value)}
/>


{/* Complaint Cards */}

{filtered.map((c) => (

<div key={c.id} className="complaint-card">

<p>
🎟 <b>Ticket:</b> {c.id}
</p>

<p>
📝 <b>Description:</b> {c.description}
</p>

<p>
⚡ <b>Category:</b> {c.category}
</p>

<p>
📍 <b>Location:</b> {c.location}
</p>

<p>
📊 <b>Status:</b>

<span
className={
c.status === "Resolved"
? "resolved"
: "pending"
}
>
{c.status}
</span>

</p>


{/* Progress bar */}

<div className="progress-bar">

<div
className="progress"
style={{
width:
c.status === "Resolved"
? "100%"
: "40%"
}}
></div>

</div>


<p>
📅 <b>Date:</b> {c.date}
</p>


{/* Complaint image */}

{c.image && (

<img
src={c.image}
width="200"
alt="complaint"
/>

)}


{/* Solution input */}

{c.status !== "Resolved" && (

<div>

<textarea
placeholder="Write solution..."
value={solutionText}
onChange={(e) =>
setSolutionText(e.target.value)
}
/>

<button
onClick={() =>
resolveComplaint(c.id)
}
>
Resolve
</button>

</div>

)}


{/* Show solution */}

{c.solution && (

<p>
✅ <b>Solution:</b> {c.solution}
</p>

)}

</div>

))}

</div>

);

}

export default AdminDashboard;
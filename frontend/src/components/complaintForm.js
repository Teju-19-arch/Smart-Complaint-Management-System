import React, { useState } from "react";
import { submitComplaint } from "../api";

function ComplaintForm() {

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {

      await submitComplaint(formData);

      alert("Complaint submitted successfully");

      setDescription("");
      setImage(null);

    } catch (error) {

      console.log(error);

      alert("Error submitting complaint");

    }

  };

  return (

    <form onSubmit={handleSubmit}>

      <textarea
        placeholder="Enter complaint"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      <button type="submit">
        Submit Complaint
      </button>

    </form>
  );
}

export default ComplaintForm;
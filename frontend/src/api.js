import axios from "axios";

const API = "http://localhost:5001";

export const submitComplaint = async (formData) => {

  return axios.post(`${API}/complaint`, formData, {

    headers: {
      "Content-Type": "multipart/form-data"
    }

  });

};

export const getComplaints = async () => {

  return axios.get(`${API}/complaints`);

};

export const updateStatus = async (id, formData) => {

  return axios.put(`${API}/complaint/${id}`, formData, {

    headers: {
      "Content-Type": "multipart/form-data"
    }

  });

};
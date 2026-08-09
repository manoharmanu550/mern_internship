import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-internship-backend-p9ri.onrender.com/api",
});

export default API;

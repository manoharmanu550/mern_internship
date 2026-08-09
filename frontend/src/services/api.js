import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-internship-q7o3.onrender.com/api",
});

export default API;

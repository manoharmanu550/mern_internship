import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-internship-1-n8k5.onrender.com/api",
});

export default API;

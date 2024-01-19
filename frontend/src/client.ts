import axios from "axios";

const client = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:5000/api'
})

export default client
import axios from 'axios';


const axiosPlain = axios.create({baseURL: 'http://localhost:8090'});

export {axiosPlain};
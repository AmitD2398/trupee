import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://62.72.58.41:5000/admin',
});

export default instance;

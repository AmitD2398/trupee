import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://crm.tradlogy.com/admin',
});

export default instance;

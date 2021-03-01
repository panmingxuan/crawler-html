import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
});

instance.interceptors.response.use((responce) => {
  return responce.data;
});

export default instance;

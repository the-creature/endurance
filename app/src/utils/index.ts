import axios from 'axios';

export const storageGet = (key: string) => {
  const localData = localStorage.getItem(key);
  return !!localData ? JSON.parse(localData) : null;
};

export const storageSet = (key: string = '', objectToSet: { [key: string]: any }) => localStorage.setItem(key, JSON.stringify(objectToSet));

export const storageRemove = (key: string = '') => localStorage.removeItem(key);


const api = axios.create({
  baseURL: 'http://localhost:3004',
  headers: {
    'Content-Type': 'application/json'
  },
})

api.interceptors.request.use(
  config => {
    const user = storageGet('user');
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`
    }
    return config
  },
  error => Promise.reject(error)
)
export {api};
import axios from 'axios';
import {AuthProvider} from './context/auth';

const instance = axios.create({
  baseURL: 'http://192.168.1.88:8000',
});

export const setAuthToken = token => {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common.Authorization;
  }
};

export default instance;

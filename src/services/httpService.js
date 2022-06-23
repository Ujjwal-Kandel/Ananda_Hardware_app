import axios from 'axios';
import {AuthProvider} from './context/auth';

const instance = axios.create({
  baseURL: 'https://logisparktech.com/anand-hardware',
  timeout: 10000,
});

export const setAuthToken = token => {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common.Authorization;
  }
};

export default instance;

import axios from './httpService';

const signIn = async ({email, password}) => {
  const {data: response} = await axios.post('/api/login', {
    email,
    password,
  });
  return response;
};

export const authService = {
  signIn,
};

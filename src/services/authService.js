import axios from './httpService';

const signIn = async ({email, password}) => {
  try {
    const {data: response} = await axios.post('/api/login', {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error, 'consolingerror');
    if (error.response) {
      const res = error.response;
      console.debug('Status:', res.status);
      console.debug('Data:', res.data);
      console.debug('Headers:', res.headers);
      throw new Error(res.data.message.reason.reason);
    } else {
      console.debug('Message:', error.message);
      throw new Error(error.message);
    }
  }
};

export const authService = {
  signIn,
};

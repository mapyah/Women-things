import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://20.50.11.109:3000', 

  },
  prod: {
    apiUrl: 'https://your-production-api.com',
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();
import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://172.20.10.3:8080', 
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
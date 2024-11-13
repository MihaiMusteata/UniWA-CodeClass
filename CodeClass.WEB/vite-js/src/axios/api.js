import axios from 'axios';

const API_URL = 'https://localhost:7208/api';

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error GET request:', error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error('Error POST request:', error);
    throw error;
  }
};

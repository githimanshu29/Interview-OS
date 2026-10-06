import axios from "axios";
import api from "../utils/axios";

// ---------------------------------------
// Start Interview
// ---------------------------------------

export const startInterview = async (data) => {
  try {
    const response = await api.post(`/api/interview/start`, data);

    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

// ---------------------------------------
// Submit Answer
// ---------------------------------------

export const submitAnswer = async (data) => {
  try {
    const response = await api.post(`/api/interview/answer`, data);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ---------------------------------------
// Get Single Interview
// ---------------------------------------

export const getInterview = async (id) => {
  try {
    const response = await api.get(`/api/interview/${id}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ---------------------------------------
// Get All Interviews
// ---------------------------------------

export const getAllInterviews = async () => {
  try {
    const response = await api.get(`/api/interview/all`);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

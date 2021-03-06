import axios from "axios";
import axiosInstance from "./instance";

const apiService = {
  getItems: (item) => axiosInstance.get(item),
  getItem: (item, id) => axiosInstance.get(`${item}/${id}`),
  createItem: (item, data, token) =>
    axiosInstance.post(`${item}`, JSON.stringify(data), {
      headers: { Authorization: token },
    }),
  updateItem: (item, id, data, token) =>
    axiosInstance.put(`${item}/${id}`, JSON.stringify(data), {
      headers: { Authorization: token },
    }),
  deleteItem: (item, id, token) =>
    axiosInstance.delete(`${item}/${id}`, {
      headers: { Authorization: token },
    }),
  fetchProfile: (token) =>
    axiosInstance.post(`/users/profile`, {
      headers: { Authorization: token },
    }),
  fetchCreatedEvents: (token, events) =>
    axiosInstance.post(`/users/profile?data=eventsCreation`, JSON.stringify(events), {
      headers: { Authorization: token },
    }),
  fetchLikes: (token, likes) =>
    axiosInstance.post(`/users/profile?data=likes`, JSON.stringify(likes), {
      headers: { Authorization: token },
    }),
  fetchEvents: (token, events) =>
    axiosInstance.post(`/users/profile?data=events`, JSON.stringify(events), {
      headers: { Authorization: token },
    }),
};

export default apiService;
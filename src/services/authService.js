import axios from "axios"
import API_BASE_URL from "./api"

export const fetchProfile = async (token) => {
  return axios.get(`${API_BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateProfile = async (token, profileData) => {
  return axios.put(`${API_BASE_URL}/user/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const searchUsers = async (token, searchTerm) => {
  return axios.get(`${API_BASE_URL}/user/search?searchTerm=${searchTerm}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

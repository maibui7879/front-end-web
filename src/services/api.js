import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

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

export const createTeam = async (token, name, description) => {
  return axios.post(
    `${API_BASE_URL}/teams`,
    { name, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export const updateTeamAvatar = async (token, teamId, avatarUrl) => {
  return axios.put(
    `${API_BASE_URL}/teams/${teamId}`,
    { avatar_url: avatarUrl },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export const deleteTeam = async (token, teamId) => {
  return axios.delete(`${API_BASE_URL}/teams/${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// User API calls
export const searchUsers = async (token, searchTerm) => {
  return axios.get(`${API_BASE_URL}/user/search?searchTerm=${searchTerm}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const inviteUserToTeam = async (token, teamId, userId) => {
  return axios.post(
    `${API_BASE_URL}/teams/member/${teamId}/invite/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}

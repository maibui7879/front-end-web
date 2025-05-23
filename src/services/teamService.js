import axios from "axios"
import API_BASE_URL from "./api"

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

export const inviteUserToTeam = async (token, teamId, userId) => {
  return axios.post(
    `${API_BASE_URL}/teams/member/${teamId}/invite/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}

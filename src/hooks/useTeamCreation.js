"use client"

import { useState } from "react"
import { message } from "antd"
import {
  createTeam,
  updateTeamAvatar,
  deleteTeam,
  searchUsers,
  inviteUserToTeam,
} from "../services/api"
import { uploadImage } from "../services/cloudinary"

const useTeamCreation = (onTeamCreated, onAvatarUploaded, onClose) => {
  const [step, setStep] = useState(1)
  const [teamId, setTeamId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [invitedUsers, setInvitedUsers] = useState([])

  const getToken = () => localStorage.getItem("token")

  // Step 1: Create team
  const handleCreateTeam = async (teamName, teamDescription) => {
    if (!teamName.trim() || !teamDescription.trim()) {
      message.warning("Vui lòng nhập đầy đủ thông tin nhóm")
      return false
    }

    try {
      const token = getToken()
      const response = await createTeam(token, teamName, teamDescription)
      const createdTeamId = response.data.teamId
      setTeamId(createdTeamId)
      message.success("Tạo nhóm thành công")
      setStep(2)
      if (onTeamCreated) onTeamCreated(createdTeamId)
      return true
    } catch (error) {
      message.error("Lỗi khi tạo nhóm")
      return false
    }
  }

  // Step 2: Upload avatar
  const handleUploadAvatar = async (file) => {
    try {
      setUploading(true)
      const url = await uploadImage(file)
      setAvatarUrl(url)

      const token = getToken()
      await updateTeamAvatar(token, teamId, url)
      message.success("Tải ảnh lên thành công")
      return true
    } catch (error) {
      message.error("Lỗi khi tải ảnh")
      return false
    } finally {
      setUploading(false)
    }
  }

  const moveToInviteStep = () => {
    setStep(3)
  }

  // Step 3: Search and invite users
  const handleSearchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) return

    setSearchLoading(true)
    try {
      const token = getToken()
      const response = await searchUsers(token, searchTerm)
      setSearchResults(response.data.users || [])
    } catch (error) {
      message.error("Lỗi khi tìm kiếm người dùng")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleInviteUser = async () => {
    if (!selectedUserId) {
      message.warning("Vui lòng chọn người dùng")
      return false
    }

    try {
      const token = getToken()
      await inviteUserToTeam(token, teamId, selectedUserId)

      const invitedUser = searchResults.find((user) => user.id === selectedUserId)
      if (invitedUser) {
        setInvitedUsers((prev) => [...prev, invitedUser])
      }

      message.success("Đã gửi lời mời")
      setSelectedUserId(null)
      return true
    } catch (error) {
      message.error("Không thể gửi lời mời")
      return false
    }
  }

  // Cancel and cleanup
  const handleCancel = async () => {
    if (teamId) {
      try {
        const token = getToken()
        await deleteTeam(token, teamId)
        message.info("Đã hủy và xóa nhóm")
      } catch (error) {
        message.error("Lỗi khi xóa nhóm")
      }
    }

    resetState()
    if (onClose) onClose()
    return true
  }

  const handleFinish = () => {
    if (onAvatarUploaded) onAvatarUploaded()
    resetState()
    if (onClose) onClose()
  }

  const resetState = () => {
    setStep(1)
    setTeamId(null)
    setAvatarUrl(null)
    setSelectedUserId(null)
    setSearchResults([])
    setInvitedUsers([])
  }

  return {
    step,
    teamId,
    uploading,
    avatarUrl,
    searchResults,
    selectedUserId,
    searchLoading,
    invitedUsers,
    handleCreateTeam,
    handleUploadAvatar,
    moveToInviteStep,
    handleSearchUsers,
    handleInviteUser,
    handleCancel,
    handleFinish,
    setSelectedUserId,
  }
}

export default useTeamCreation

import { Modal } from "antd"
import StepOne from "./StepOne"
import StepTwo from "./StepTwo"
import StepThree from "./StepThree"
import StepProgress from "./StepProgress"
import ModalFooter from "./ModalFooter"
import useTeamCreation from "../../hooks/useTeamCreation"

const CreateTeamModal = ({
  visible,
  onCancel,
  onCreate,
  teamName,
  teamDescription,
  setTeamName,
  setTeamDescription,
  onAvatarUploaded,
}) => {
  const {
    step,
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
  } = useTeamCreation(onCreate, onAvatarUploaded)

  const getModalTitle = () => {
    switch (step) {
      case 1:
        return "Tạo nhóm mới"
      case 2:
        return "Thêm ảnh nhóm"
      case 3:
        return "Mời thành viên (tuỳ chọn)"
      default:
        return "Tạo nhóm mới"
    }
  }

  const onCreateTeamClick = () => {
    handleCreateTeam(teamName, teamDescription)
  }

  const onCancelClick = () => {
    handleCancel()
    onCancel()
  }

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={onCancelClick}
      footer={
        <ModalFooter
          step={step}
          onCancel={onCancelClick}
          onCreateTeam={onCreateTeamClick}
          onFinishUpload={moveToInviteStep}
          onInvite={handleInviteUser}
          onDone={handleFinish}
          isNextDisabled={!teamName.trim() || !teamDescription.trim()}
          isInviteDisabled={!selectedUserId}
          uploading={uploading}
        />
      }
    >
      {step === 1 && (
        <StepOne
          teamName={teamName}
          teamDescription={teamDescription}
          setTeamName={setTeamName}
          setTeamDescription={setTeamDescription}
        />
      )}

      {step === 2 && <StepTwo avatarUrl={avatarUrl} handleUpload={handleUploadAvatar} uploading={uploading} />}

      {step === 3 && (
        <StepThree
          searchUsers={searchResults}
          handleSearchUsers={handleSearchUsers}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          searchLoading={searchLoading}
          invitedUsers={invitedUsers}
          onConfirmFinish={handleFinish}
        />
      )}

      <StepProgress step={step} />
    </Modal>
  )
}

export default CreateTeamModal

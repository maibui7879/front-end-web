import { Upload, Button, Skeleton, Typography, Avatar, Spin } from "antd"
import { EditOutlined, LoadingOutlined } from "@ant-design/icons"
import { getInitials } from "../../utils/getInitialsAvatar"

const { Title, Text } = Typography

const ProfileAvatar = ({ avatarUrl, fullName, email, loading, onUpload, uploading = false }) => {
  const renderAvatar = () => {
    if (loading) {
      return <Skeleton.Avatar active size={128} shape="circle" />
    }

    if (uploading) {
      return (
        <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center rounded-full border-4 border-white shadow-lg bg-white">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        </div>
      )
    }

    return (
      <div className="relative w-28 h-28 mx-auto mb-4">
        {avatarUrl ? (
          <img
            className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
            src={avatarUrl}
            alt="Avatar"
          />
        ) : (
          <Avatar
            size={112}
            shape="circle"
            className="bg-[#888] text-white text-3xl font-bold mx-auto flex items-center justify-center"
          >
            {getInitials(fullName)}
          </Avatar>
        )}

        <Upload
          accept="image/*"
          beforeUpload={onUpload}
          showUploadList={false}
          disabled={uploading}
        >
          <Button
            icon={<EditOutlined />}
            className="!p-1 !rounded-full !bg-white !shadow-md absolute bottom-1 right-1"
            disabled={uploading}
          />
        </Upload>
      </div>
    )
  }

  return (
    <div className="text-center">
      {renderAvatar()}
      <Title level={5}>{fullName || "Tên người dùng"}</Title>
      <Text type="secondary">{email || "Email"}</Text>
    </div>
  )
}

export default ProfileAvatar

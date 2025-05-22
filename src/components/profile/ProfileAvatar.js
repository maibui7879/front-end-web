import { Upload, Button, Skeleton, Typography } from "antd"
import { EditOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const ProfileAvatar = ({ avatarUrl, fullName, email, loading, onUpload }) => {
  return (
    <div className="text-center">
      {loading ? (
        <Skeleton.Avatar active size={128} shape="circle" />
      ) : (
        <div className="relative w-28 h-28 mx-auto mb-4">
          <img
            className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
            src={avatarUrl || "https://i.pravatar.cc/100"}
            alt="Avatar"
          />
          <Upload accept="image/*" beforeUpload={onUpload} showUploadList={false}>
            <Button
              icon={<EditOutlined />}
              className="!p-1 !rounded-full !bg-white !shadow-md absolute bottom-1 right-1"
            />
          </Upload>
        </div>
      )}

      <Title level={5}>{fullName || "Tên người dùng"}</Title>
      <Text type="secondary">{email || "Email"}</Text>
    </div>
  )
}

export default ProfileAvatar

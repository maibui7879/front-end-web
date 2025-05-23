"use client"

import { useEffect, useState, useContext } from "react"
import { Form, message, Typography, Card, Row, Col } from "antd"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import ProfileAvatar from "../components/profile/ProfileAvatar"
import ProfileForm from "../components/profile/ProfileForm"
import { fetchProfile, updateProfile } from "../services/api"
import { uploadImage } from "../services/cloudinary"

const { Title } = Typography

const CreateProfilePage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  useEffect(() => {
    const getProfile = async () => {
      if (!token) return

      try {
        const res = await fetchProfile(token)
        const profile = res.data
        form.setFieldsValue({
          ...profile,
          date_of_birth: profile.date_of_birth ? dayjs(profile.date_of_birth) : null,
        })
        setAvatarUrl(profile.avatar_url || "")
      } catch {
        message.warning("Chưa có thông tin hồ sơ, vui lòng điền mới.")
      } finally {
        setInitialLoading(false)
      }
    }
    getProfile()
  }, [form, token])

  const handleUpload = async (file) => {
    try {
      const url = await uploadImage(file)
      setAvatarUrl(url)
      message.success("Tải ảnh lên thành công!")
    } catch (err) {
      message.error("Lỗi tải ảnh lên Cloudinary!")
    }
    return false
  }

  const handleSubmit = async (values) => {
    setLoading(true)

    if (!avatarUrl) {
      message.warning("Vui lòng tải lên ảnh đại diện.")
      setLoading(false)
      return
    }

    try {
      const data = {
        ...values,
        date_of_birth: values.date_of_birth?.format("YYYY-MM-DD"),
        avatar_url: avatarUrl,
      }

      await updateProfile(token, data)
      message.success("Cập nhật hồ sơ thành công!")

      setTimeout(() => {
        navigate("/home")
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error(err)
      message.error("Lỗi cập nhật hồ sơ!")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="p-6 min-h-screen">
      <Card
        bordered={false}
        className="max-w-5xl mx-auto rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
        bodyStyle={{ padding: 24 }}
      >
        <Title level={3} className="mb-8 border-b border-gray-500 p">
          Cập nhật hồ sơ cá nhân
        </Title>

        <Row gutter={[32, 32]} className="items-center">
          <Col xs={24} md={6}>
            <ProfileAvatar
              avatarUrl={avatarUrl}
              fullName={form.getFieldValue("full_name")}
              email={form.getFieldValue("email")}
              loading={initialLoading}
              onUpload={handleUpload}
            />
          </Col>

          <Col xs={24} md={18}>
            <ProfileForm form={form} loading={loading} onFinish={handleSubmit} />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default CreateProfilePage

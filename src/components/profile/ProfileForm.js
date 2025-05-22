import { Form, Input, DatePicker, Radio, Button, Typography } from "antd"

const { Text } = Typography

const ProfileForm = ({ form, loading, onFinish }) => {
  return (
    <Form layout="vertical" form={form} onFinish={onFinish} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Form.Item name="full_name" label={<Text strong>Họ và tên</Text>} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label={<Text strong>Email</Text>} rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>

      <Form.Item name="phone_number" label={<Text strong>Số điện thoại</Text>}>
        <Input />
      </Form.Item>
      <Form.Item name="gender" label={<Text strong>Giới tính</Text>}>
        <Radio.Group>
          <Radio value="male">Nam</Radio>
          <Radio value="female">Nữ</Radio>
          <Radio value="other">Khác</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="date_of_birth" label={<Text strong>Ngày sinh</Text>}>
        <DatePicker format="YYYY-MM-DD" className="w-full" />
      </Form.Item>
      <Form.Item name="address" label={<Text strong>Địa chỉ</Text>}>
        <Input />
      </Form.Item>

      <Form.Item name="bio" label={<Text strong>Giới thiệu bản thân</Text>} className="md:col-span-2">
        <Input.TextArea rows={3} />
      </Form.Item>

      <div className="md:col-span-2 text-center">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="px-10 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          Lưu hồ sơ
        </Button>
      </div>
    </Form>
  )
}

export default ProfileForm

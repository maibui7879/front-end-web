import axios from "axios"

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkshpgp3n/image/upload"
const UPLOAD_PRESET = "ml_default"

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  const response = await axios.post(CLOUDINARY_URL, formData)
  return response.data.secure_url
}

// StepTwo.js
import React from 'react';
import { Upload } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { EditOutlined } from '@ant-design/icons';

const StepTwo = ({ avatarUrl, setAvatarUrl, handleUpload, uploading }) => {
    return (
        <div className="flex flex-col items-center justify-center py-6">
            <Upload accept="image/*" showUploadList={false} beforeUpload={handleUpload} className="cursor-pointer">
                <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden hover:border-blue-500 transition">
                    {avatarUrl ? (
                        <>
                            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100">
                                <EditOutlined className="text-blue-600 text-sm" />
                            </div>
                        </>
                    ) : (
                        <FaPlus size={28} className="text-gray-500" />
                    )}
                </div>
            </Upload>
        </div>
    );
};

export default StepTwo;

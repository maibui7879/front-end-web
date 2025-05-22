// StepProgress.js
import React from 'react';

const StepProgress = ({ step }) => {
    return (
        <div className="w-full mt-4">
            <div className="flex justify-between text-sm px-1">
                {['1. Nhập thông tin', '2. Tải ảnh', '3. Mời thành viên'].map((label, index) => (
                    <div key={index} className="flex flex-col items-center w-1/3">
                        <span className={`font-medium ${step === index + 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                            {label}
                        </span>
                        <div
                            className={`h-2 w-11/12 rounded-full mt-1 ${
                                step >= index + 1 ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepProgress;

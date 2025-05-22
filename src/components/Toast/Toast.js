import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faInfoCircle, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ title, message, type = 'info', duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => setVisible(false);

    if (!visible) return null;

    const iconMap = {
        success: {
            icon: faCircleCheck,
            color: 'text-green-500',
            border: 'border-green-500',
        },
        info: {
            icon: faInfoCircle,
            color: 'text-blue-500',
            border: 'border-blue-500',
        },
        warning: {
            icon: faExclamationCircle,
            color: 'text-yellow-500',
            border: 'border-yellow-500',
        },
        error: {
            icon: faTimesCircle,
            color: 'text-red-500',
            border: 'border-red-500',
        },
    };

    const { icon, color, border } = iconMap[type] || iconMap.info;

    return (
        <div
            className={`flex items-start bg-white border-l-4 ${border} shadow-lg rounded-md p-4 max-w-sm w-full animate-slide-in`}
            style={{
                animation: `slide-in-left 0.3s ease, fade-out 1s linear ${duration / 1000}s forwards`,
            }}
        >
            <div className={`text-xl mr-3 ${color}`}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
            <button onClick={handleClose} className="ml-4 text-gray-400 hover:text-gray-600 text-lg">
                <FontAwesomeIcon icon={faTimesCircle} />
                "xin chào"
            </button>
        </div>
    );
};

export default Toast;

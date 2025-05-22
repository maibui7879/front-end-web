import Toast from './Toast';

const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="fixed top-32 right-8 z-[9999] space-y-4">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
//=================Cách dùng==================
// import ToastContainer from '~/components/Toast';
// const [toasts, setToasts] = useState([]);
//  const addToast = ({ title, message, type, duration }) => {
//         setToasts((prevToasts) => [...prevToasts, { title, message, type, duration }]);
//     };
//       <ToastContainer toasts={toasts} />
import { message } from 'antd';

const toast = {
  success: (content) => message.open({ type: 'success', content }),
  error: (content) => message.open({ type: 'error', content }),
  info: (content) => message.open({ type: 'info', content }),
  warning: (content) => message.open({ type: 'warning', content }),
  loading: (content, duration = 0) => message.open({ content, type: 'loading', duration, key: 'loading' }),
  destroy: () => message.destroy('loading'),
};

export default toast;

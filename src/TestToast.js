import React from 'react';
import { Button } from 'antd';
import toast from './components/Toast';

export default function TestToast() {
  return (
    <div style={{ padding: 20 }}>
      <Button onClick={() => {
        toast.success("Toast test thành công!");
        console.log("Toast success called");
      }}>
        Test Toast
      </Button>
    </div>
  );
}
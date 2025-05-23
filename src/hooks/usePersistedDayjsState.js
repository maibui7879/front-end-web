import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export function usePersistedDayjsState(key, defaultValue) {
  const getInitial = () => {
    const raw = localStorage.getItem(key);
    const parsed = dayjs(raw);
    return parsed.isValid() ? parsed.startOf('day') : defaultValue.startOf('day');
  };

  const [value, setValue] = useState(getInitial);

  useEffect(() => {
    if (value && dayjs.isDayjs(value) && value.isValid()) {
      localStorage.setItem(key, value.toISOString());
    }
  }, [key, value]);

  const setDayjsValue = (newVal) => {
    if (!newVal) return;
    if (dayjs.isDayjs(newVal) && newVal.isValid()) {
      setValue(newVal.startOf('day'));
    } else {
      const parsed = dayjs(newVal);
      if (parsed.isValid()) setValue(parsed.startOf('day'));
    }
  };

  return [value, setDayjsValue];
}

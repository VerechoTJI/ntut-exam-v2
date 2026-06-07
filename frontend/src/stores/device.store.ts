import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDevices() {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/device`);
      devices.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Failed to load device connections';
    } finally {
      loading.value = false;
    }
  }

  return {
    devices,
    loading,
    error,
    fetchDevices
  };
});

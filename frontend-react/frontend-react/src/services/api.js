import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qm_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authAPI = {
  signup: async (email, password) => {
    const res = await api.post('/api/v1/auth/signup', { email, password });
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password }, {
      transformResponse: [(data) => data] // Keep raw text (userId token)
    });
    const token = res.data;
    localStorage.setItem('qm_token', token);
    return { success: true, token };
  },

  logout: () => {
    localStorage.removeItem('qm_token');
  },

  isLoggedIn: () => !!localStorage.getItem('qm_token'),
  getUserId: () => Number(localStorage.getItem('qm_token')) || 1,
};

// ===== MEASUREMENT API =====
export const measurementAPI = {
  // POST /api/v1/quantities/convert/{targetUnit} — Body: {value, unit} — Returns: {value, unit}
  convert: async (value, fromUnit, targetUnit) => {
    const userId = authAPI.getUserId();
    const res = await api.post(`/api/v1/quantities/convert/${targetUnit}?userId=${userId}`, { value, unit: fromUnit });
    return res.data;
  },

  // POST /api/v1/quantities/compare — Body: {thisQuantityDTO, thatQuantityDTO} — Returns: boolean text
  compare: async (value1, unit1, value2, unit2) => {
    const userId = authAPI.getUserId();
    const res = await api.post(`/api/v1/quantities/compare?userId=${userId}`, {
      thisQuantityDTO: { value: value1, unit: unit1 },
      thatQuantityDTO: { value: value2, unit: unit2 },
    }, { transformResponse: [(data) => data] });
    return res.data === 'true';
  },

  // POST /api/v1/quantities/add — Body: {thisQuantityDTO, thatQuantityDTO} — Returns: {value, unit}
  add: async (value1, unit1, value2, unit2) => {
    const userId = authAPI.getUserId();
    const res = await api.post(`/api/v1/quantities/add?userId=${userId}`, {
      thisQuantityDTO: { value: value1, unit: unit1 },
      thatQuantityDTO: { value: value2, unit: unit2 },
    });
    return res.data;
  },

  // POST /api/v1/quantities/subtract
  subtract: async (value1, unit1, value2, unit2) => {
    const userId = authAPI.getUserId();
    const res = await api.post(`/api/v1/quantities/subtract?userId=${userId}`, {
      thisQuantityDTO: { value: value1, unit: unit1 },
      thatQuantityDTO: { value: value2, unit: unit2 },
    });
    return res.data;
  },

  // POST /api/v1/quantities/divide — Returns: raw double text
  divide: async (value1, unit1, value2, unit2) => {
    const userId = authAPI.getUserId();
    const res = await api.post(`/api/v1/quantities/divide?userId=${userId}`, {
      thisQuantityDTO: { value: value1, unit: unit1 },
      thatQuantityDTO: { value: value2, unit: unit2 },
    }, { transformResponse: [(data) => data] });
    return res.data;
  },
};

// ===== HISTORY API =====
export const historyAPI = {
  // GET /api/users/{userId}/history — Returns: QuantityMeasurementEntity[]
  getAll: async () => {
    const userId = authAPI.getUserId();
    const res = await api.get(`/api/users/${userId}/history`);
    return res;
  },
};

export default api;

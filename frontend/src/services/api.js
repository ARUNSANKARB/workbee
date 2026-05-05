import axios from 'axios';

const backendURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/'
const api = axios.create({
  baseURL:backendURL,
});


api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("token");
  if(token)
  {
    config.headers.Authorization=`Bearer ${token}`;
  }
  return config;
})

api.interceptors.response.use((res)=>{return res},
(error)=>{
  if(error.response?.status==401)
  {
    localStorage.removeItem("token");
    window.location.href="/login"
  }
  return Promise.reject(error);
})

export const authAPI = {
  login:(data)=>api.post('/auth/login',data),
  register:(data)=>api.post('/auth/register',data)
}

export const categoryAPI = {
  getAll: () => api.get("/categories"),
};

export const workerAPI = {
  getAll: () => api.get('/skills'),
  getById: (id) => api.get(`/skills/${id}`),
  getByCategory: (filter) => api.get(`/skills/category/${filter}`)
};

export const skillAPI = {
  create: (data) => api.post("/skills", data),
};

export const bookingAPI = {
  create: (data) => api.post("/booking", data),
  getAll: () => api.get("/booking"),
  getById: (id) => api.get(`/booking/${id}`),
};

export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getBookings: () => api.get("/admin/bookings"),
  getPayments: () => api.get("/admin/payments"),

  banUser: (id) => api.patch(`/admin/users/${id}/ban`),
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),

  updateBooking: (id, data) =>
    api.patch(`/admin/bookings/${id}`, data),
};
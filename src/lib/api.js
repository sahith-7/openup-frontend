// ============================================================
// OpenUp - API Client
// ============================================================
// Centralized Axios instance for all API calls
// To add a new API method: add it to the relevant section
// All functions return the data directly (errors are thrown)
// ============================================================

import axios from "axios";

// ============================================================
// Axios Instance
// ============================================================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// ============================================================
// Request Interceptor — attach JWT token to every request
// ============================================================
api.interceptors.request.use(
  (config) => {
    // Read token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("openup_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Response Interceptor — handle global errors
// ============================================================
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // Auto-logout on 401 (expired token)
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("openup_token");
      localStorage.removeItem("openup_user");
      // Redirect to login only if not already there
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

// ============================================================
// AUTH API
// ============================================================
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),  // OPTIONAL
  resetPassword: (token, password) =>                                         // OPTIONAL
    api.post(`/auth/reset-password/${token}`, { password }),
};

// ============================================================
// POSTS API
// ============================================================
export const postsAPI = {
  // Public feed / explore
  getAll: (params) => api.get("/posts", { params }),

  // Personalized feed (requires auth)
  getFeed: (params) => api.get("/posts/feed", { params }),

  // Trending posts
  getTrending: (limit) => api.get("/posts/trending", { params: { limit } }),

  // My posts (requires auth)
  getMyPosts: (params) => api.get("/posts/my-posts", { params }),

  // Single post
  getById: (id) => api.get(`/posts/${id}`),

  // CRUD
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),

  // Like toggle
  toggleLike: (id) => api.post(`/posts/${id}/like`),
};

// ============================================================
// USERS API
// ============================================================
export const usersAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  toggleFollow: (userId) => api.post(`/users/${userId}/follow`),
  getSuggestions: (limit) => api.get("/users/suggestions", { params: { limit } }),
  search: (q) => api.get("/users/search", { params: { q } }),
  getTrendingWriters: (limit) =>
    api.get("/users/trending-writers", { params: { limit } }),
};

// ============================================================
// COMMENTS API
// ============================================================
export const commentsAPI = {
  getForPost: (postId, params) => api.get(`/comments/${postId}`, { params }),
  create: (postId, data) => api.post(`/comments/${postId}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  toggleLike: (id) => api.post(`/comments/${id}/like`),
};

// ============================================================
// AI ASSISTANT API
// ============================================================
export const aiAPI = {
  // action: 'continue' | 'ideas' | 'grammar' | 'rewrite'
  assist: (action, text, options = {}) =>
    api.post("/ai/assist", { action, text, ...options }),

  // OPTIONAL: Daily writing prompt
  getPrompt: (type) => api.get("/ai/prompt", { params: { type } }),
};

// ============================================================
// NOTIFICATIONS API
// ============================================================
export const notificationsAPI = {
  getAll: (params) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAllRead: () => api.put("/notifications/read-all"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

export default api;

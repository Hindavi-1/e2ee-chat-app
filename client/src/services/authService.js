/**
 * services/authService.js  (CLIENT-SIDE)
 * ----------------------------------------
 * Handles authentication API calls: register and login.
*/


import { apiRequest } from './api';

// Register
export const register = async (data) => {
  return await apiRequest('/auth/register', 'POST', data);
};

// Login
export const login = async (data) => {
  return await apiRequest('/auth/login', 'POST', data);
};
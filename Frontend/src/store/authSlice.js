import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial state from LocalStorage if it exists
const savedAuth = localStorage.getItem('salon_auth');
let initialState = {
  token: null,
  isAuthenticated: false,
  user: {
    id: null,
    name: '',
    email: '',
    role: 'Customer' // Options: Customer | Barber | Receptionist | Admin
  }
};

if (savedAuth) {
  try {
    const parsed = JSON.parse(savedAuth);
    if (parsed && parsed.token) {
      initialState = parsed;
    }
  } catch (e) {
    console.error('Error parsing stored auth', e);
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token || 'mock-jwt-token-12345';
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id || 'usr_' + Math.floor(Math.random() * 100000),
        name: action.payload.name || 'Jane Doe',
        email: action.payload.email || 'jane@example.com',
        role: action.payload.role || 'Customer'
      };
      localStorage.setItem('salon_auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = {
        id: null,
        name: '',
        email: '',
        role: 'Customer'
      };
      localStorage.removeItem('salon_auth');
    },
    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
      localStorage.setItem('salon_auth', JSON.stringify(state));
    },
    changeRole: (state, action) => {
      state.user.role = action.payload;
      localStorage.setItem('salon_auth', JSON.stringify(state));
    }
  }
});

export const { loginSuccess, logout, updateProfile, changeRole } = authSlice.actions;
export default authSlice.reducer;

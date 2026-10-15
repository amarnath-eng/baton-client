import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMeApi, logoutApi } from '../services/authApi.js'

/**
 * Immutable Auth Status Enum
 */
export const AUTH_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
})

export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMeApi()
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi()
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    company: null,
    role: null,
    isAuthenticated: false,
    status: AUTH_STATUS.IDLE,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, company, role } = action.payload
      state.user = user
      state.company = company
      state.role = role
      state.isAuthenticated = true
      state.status = AUTH_STATUS.AUTHENTICATED
      state.error = null
    },
    clearCredentials: (state) => {
      state.user = null
      state.company = null
      state.role = null
      state.isAuthenticated = false
      state.status = AUTH_STATUS.UNAUTHENTICATED
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthSession.pending, (state) => {
        state.status = AUTH_STATUS.LOADING
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        const { user, company, role } = action.payload
        state.user = user
        state.company = company
        state.role = role
        state.isAuthenticated = true
        state.status = AUTH_STATUS.AUTHENTICATED
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.user = null
        state.company = null
        state.role = null
        state.isAuthenticated = false
        state.status = AUTH_STATUS.UNAUTHENTICATED
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.company = null
        state.role = null
        state.isAuthenticated = false
        state.status = AUTH_STATUS.UNAUTHENTICATED
      })
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer

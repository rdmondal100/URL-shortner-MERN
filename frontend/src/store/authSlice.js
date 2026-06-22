import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

import { baseDomain } from "../components/constants/baseDomain"
import { clearAuthSession, getAuthHeaders, getAuthToken, getAuthUser, setAuthSession } from "../lib/auth"

const initialUser = getAuthUser()

const initialState = {
  user: initialUser,
  token: getAuthToken(),
  isAuthenticated: Boolean(getAuthToken()),
  authStatus: "idle",
  authError: "",
  bootstrapStatus: "idle",
}

const persistSession = (payload) => {
  setAuthSession(payload)
  return payload
}

export const registerUser = createAsyncThunk("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseDomain}auth/register`, payload)
    return persistSession(response.data)
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseDomain}auth/login`, payload)
    return persistSession(response.data)
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})

export const loadCurrentUser = createAsyncThunk("auth/loadCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseDomain}auth/me`, {
      headers: getAuthHeaders(),
    })
    return {
      token: getAuthToken(),
      ...response.data,
    }
  } catch (error) {
    clearAuthSession()
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.authError = ""
      state.authStatus = "idle"
      clearAuthSession()
    },
    clearAuthError: (state) => {
      state.authError = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.authStatus = "loading"
        state.authError = ""
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authStatus = "succeeded"
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authStatus = "failed"
        state.authError = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.authStatus = "loading"
        state.authError = ""
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authStatus = "succeeded"
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = "failed"
        state.authError = action.payload
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.bootstrapStatus = "loading"
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.bootstrapStatus = "succeeded"
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.bootstrapStatus = "failed"
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export default authSlice.reducer
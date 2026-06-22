import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { baseDomain } from "../components/constants/baseDomain";
import { getAuthHeaders } from "../lib/auth";




const initialState = {
  urlDetails: [],
  currentShortUrl: null,
  currentTheme: 'dark',
  isLoading: false,
  errorMessage: '',
  isSubmitting: false,
  analyticsData: null,
  analyticsStatus: 'idle',
  analyticsError: '',


}

export const createShortUrl = createAsyncThunk("url/createShortUrl", async (payload, { rejectWithValue }) => {

  try {
    const body = typeof payload === 'string' ? { url: payload } : payload
    const result = await axios.post(`${baseDomain}url`, body, { headers: getAuthHeaders() });

    if (result.status < 200 || result.status >= 300) return rejectWithValue("Failed to create short URL. Please try again!");

    
    return result.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})


export const getAllUrlsHistory = createAsyncThunk("url/getAllUrlsHistory", async (_, { rejectWithValue }) => {
  try {
    const allUrlHistory = await axios.get(`${baseDomain}allUrls`, { headers: getAuthHeaders() })
    if (allUrlHistory.status < 200 || allUrlHistory.status >= 300) return rejectWithValue("Failed to get all url history")
    return allUrlHistory.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})

export const getUrlAnalytics = createAsyncThunk("url/getUrlAnalytics", async (shortId, { rejectWithValue }) => {
  try {
    const analytics = await axios.get(`${baseDomain}analytics/${shortId}`, { headers: getAuthHeaders() })
    if (analytics.status < 200 || analytics.status >= 300) return rejectWithValue("Failed to get analytics")
    return analytics.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})

export const deleteShortUrl = createAsyncThunk("url/deleteShortUrl", async (shortId, { rejectWithValue }) => {
  try {
    const result = await axios.delete(`${baseDomain}url/${shortId}`, { headers: getAuthHeaders() })
    if (result.status < 200 || result.status >= 300) return rejectWithValue("Failed to delete short URL")
    return result.data.shortId
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message)
  }
})



const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.currentTheme = action.payload
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    clearErrorMessage: (state) => {
      state.errorMessage = ""
    },
    setErrorMessage: (state,action) => {
      state.errorMessage =action.payload
    },
    setSubmitting: (state,action) => {
      state.isSubmitting = action.payload
    },
    clearAnalyticsError: (state) => {
      state.analyticsError = ''
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createShortUrl.pending, (state) => {
        state.isLoading = true
        state.isSubmitting = true
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSubmitting = false
        state.urlDetails.unshift(action.payload)
        state.currentShortUrl = action.payload
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.isLoading = false
        state.isSubmitting = false
        state.errorMessage = action.payload
      })





      .addCase(getAllUrlsHistory.pending,(state)=>{
          state.isLoading = true
          state.errorMessage = ""
      })
      .addCase(getAllUrlsHistory.fulfilled,(state,action)=>{
          state.isLoading = false
          state.urlDetails=action.payload
          state.errorMessage = ""
      })
      .addCase(getAllUrlsHistory.rejected,(state,action)=>{
          state.isLoading = false
          state.errorMessage=action.payload
      })

      .addCase(getUrlAnalytics.pending, (state) => {
        state.analyticsStatus = 'loading'
        state.analyticsError = ''
      })
      .addCase(getUrlAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = 'succeeded'
        state.analyticsData = action.payload
      })
      .addCase(getUrlAnalytics.rejected, (state, action) => {
        state.analyticsStatus = 'failed'
        state.analyticsError = action.payload
      })

      .addCase(deleteShortUrl.pending, (state) => {
        state.isSubmitting = true
        state.errorMessage = ""
      })
      .addCase(deleteShortUrl.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.urlDetails = state.urlDetails.filter((item) => item.shortId !== action.payload)
        if (state.currentShortUrl?.shortId === action.payload) {
          state.currentShortUrl = null
        }
        if (state.analyticsData?.shortId === action.payload) {
          state.analyticsData = null
          state.analyticsStatus = "idle"
        }
      })
      .addCase(deleteShortUrl.rejected, (state, action) => {
        state.isSubmitting = false
        state.errorMessage = action.payload
      })

  }
})

export const { changeTheme, setIsLoading, clearErrorMessage, setSubmitting, setErrorMessage, clearAnalyticsError } = urlSlice.actions

export default urlSlice.reducer

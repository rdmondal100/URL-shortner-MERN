import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { baseDomain } from "../components/constants/baseDomain";




const initialState = {
  urlDetails: [],
  currentShortUrl: '',
  currentTheme: 'dark',
  isLoading: false,
  errorMessage: '',
  isSubmitting: false,


}

export const createShortUrl = createAsyncThunk("url/createShortUrl", async (url, { rejectWithValue }) => {

  try {
    console.log(url)
    const result = await axios.post(`${baseDomain}url`,{url});

    console.log(result)
    if (result.status !== 200) return rejectWithValue("Failed to create short URL. Please try again!");

    
    return result.data
  } catch (error) {
    console.log(error)
    return rejectWithValue(error.message)
  }
})


export const getAllUrlsHistory = createAsyncThunk("url/getAllUrlsHistory", async (_, { rejectWithValue }) => {
  try {
    const allUrlHistory = await axios.get(`${baseDomain}allUrls`)
    if (allUrlHistory.status !== 200) return rejectWithValue("Failed to get all url history")
    return allUrlHistory.data
  } catch (error) {
    return rejectWithValue(error.message)
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
      console.log(action.payload)
      state.isSubmitting = action.payload
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

  }
})

export const { changeTheme, setIsLoading, clearErrorMessage, setSubmitting, setErrorMessage } = urlSlice.actions

export default urlSlice.reducer
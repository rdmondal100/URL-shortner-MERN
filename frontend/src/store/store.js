import { configureStore } from "@reduxjs/toolkit";
import urlSlice from "./urlSlice";
import authSlice from "./authSlice";


const store = configureStore({
  reducer:{
    "urlData":urlSlice,
    "authData": authSlice,
  }
})

export default store
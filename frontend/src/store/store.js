import { configureStore } from "@reduxjs/toolkit";
import urlSlice from "./urlSlice";


const store = configureStore({
  reducer:{
    "urlData":urlSlice
  }
})

export default store
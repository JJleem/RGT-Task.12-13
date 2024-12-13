import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./toggleSlice";
import booksReducer from "./booksSlice";
import isbnReducer from "./isbnSlice";

export const store = configureStore({
  reducer: {
    asideToggle: toggleReducer,
    isbn: isbnReducer,
    books: booksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

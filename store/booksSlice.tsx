import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookData {
  id?: string;
  volumeInfo: {
    title: string;
    description?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    imageLinks?: {
      thumbnail: string;
    };
    pageCount?: number;
    printType?: string;
    categories?: string[];
    language?: string;
  };
}

interface BooksState {
  list: BookData[];
}

const initialState: BooksState = {
  list: [],
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<BookData[]>) => {
      state.list = action.payload;
    },
    clearBooks: (state) => {
      state.list = [];
    },
  },
});

export const { setBooks, clearBooks } = booksSlice.actions;
export default booksSlice.reducer;

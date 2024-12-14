import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookData {
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

// 초기 상태: 빈 배열
const initialState: BooksState = {
  list: [],
};

// 로컬 스토리지에서 상태 로드 함수
export const loadBooksFromLocalStorage = (): BookData[] => {
  if (typeof window === "undefined") return []; // 서버 환경에서는 빈 배열 반환
  try {
    const data = localStorage.getItem("books");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load books from local storage", error);
    return [];
  }
};

// 로컬 스토리지에 상태 저장 함수
const saveBooksToLocalStorage = (books: BookData[]) => {
  if (typeof window === "undefined") return; // 서버 환경에서는 저장하지 않음
  try {
    localStorage.setItem("books", JSON.stringify(books));
  } catch (error) {
    console.error("Failed to save books to local storage", error);
  }
};

// Redux slice 정의
const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<BookData[]>) => {
      state.list = action.payload;
      saveBooksToLocalStorage(state.list);
    },
    addBook: (state, action: PayloadAction<BookData>) => {
      state.list.push(action.payload);
      saveBooksToLocalStorage(state.list);
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((book) => book.id !== action.payload);
      saveBooksToLocalStorage(state.list);
    },
    updateBook: (
      state,
      action: PayloadAction<{
        id: string;
        volumeInfo: Partial<BookData["volumeInfo"]>;
      }>
    ) => {
      const { id, volumeInfo } = action.payload;
      const bookIndex = state.list.findIndex((book) => book.id === id);
      if (bookIndex !== -1) {
        state.list[bookIndex].volumeInfo = {
          ...state.list[bookIndex].volumeInfo,
          ...volumeInfo,
        };
        saveBooksToLocalStorage(state.list);
      }
    },
  },
});

// Redux actions & reducer export
export const { setBooks, addBook, removeBook, updateBook } = booksSlice.actions;
export default booksSlice.reducer;

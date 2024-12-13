import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ISBN 상태 인터페이스
interface IsbnState {
  list: string[]; // ISBN 리스트를 저장
}

// 초기 상태: 기본 ISBN 리스트
const initialState: IsbnState = {
  list: [
    "9780140449242",
    "9780060838676",
    "9780140449136",
    "9780141439600",
    "9780679783268",
    "9780140449457",
    "9780142437209",
    "9780679406419",
    "9780143039433",
    "9780307949486",
    "9780140186473",
    "9780679732761",
    "9780141185064",
    "9780307387899",
    "9780141439518",
    "9780140449181",
    "9780451524935",
    "9780679734529",
    "9780061120084",
    "9780486280615",
    "9780451532084",
    "9780140449266",
    "9780141182858",
    "9780553213119",
    "9780385737951",
  ],
};

// Slice 생성
const isbnSlice = createSlice({
  name: "isbnSlice",
  initialState,
  reducers: {
    // ISBN 추가
    addIsbn: (state, action: PayloadAction<string>) => {
      if (!state.list.includes(action.payload)) {
        state.list.push(action.payload);
      }
    },
    // ISBN 삭제
    removeIsbn: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((isbn) => isbn !== action.payload);
    },
    // ISBN 리스트 초기화
    clearIsbns: (state) => {
      state.list = [];
    },
  },
});

// 액션 및 리듀서 내보내기
export const { addIsbn, removeIsbn, clearIsbns } = isbnSlice.actions;
export default isbnSlice.reducer;

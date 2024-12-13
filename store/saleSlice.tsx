import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 로컬 스토리지에서 초기 상태 가져오기
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("sales");
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load from local storage", error);
  }
  return [];
};

interface Sale {
  id: string;
  salesCount: number; // 판매 수량
  stockCount: number; // 남은 수량
}

interface SalesState {
  sales: Sale[];
}

const initialState: SalesState = {
  sales: loadFromLocalStorage(),
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addSale: (state, action: PayloadAction<Sale>) => {
      state.sales.push(action.payload);
      saveToLocalStorage(state.sales);
    },
    updateSale: (
      state,
      action: PayloadAction<{
        id: string;
        salesCount: number;
        stockCount: number;
      }>
    ) => {
      const sale = state.sales.find((sale) => sale.id === action.payload.id);
      if (sale) {
        sale.salesCount = action.payload.salesCount;
        sale.stockCount = action.payload.stockCount;
        saveToLocalStorage(state.sales);
      }
    },
  },
});

// 로컬 스토리지에 상태 저장
const saveToLocalStorage = (sales: Sale[]) => {
  try {
    localStorage.setItem("sales", JSON.stringify(sales));
  } catch (error) {
    console.error("Failed to save to local storage", error);
  }
};

export const { addSale, updateSale } = salesSlice.actions;
export default salesSlice.reducer;

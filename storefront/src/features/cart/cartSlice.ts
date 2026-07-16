import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Basket } from "./../../types/index";

interface CartState {
  basket: Basket | null;
  isLoading: boolean;
}

const initialState: CartState = {
  basket: null,
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setBasket: (state, action: PayloadAction<Basket>) => {
      state.basket = action.payload;
    },
    clearBasket: (state) => {
      state.basket = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setBasket, clearBasket, setLoading } = cartSlice.actions;
export default cartSlice.reducer;

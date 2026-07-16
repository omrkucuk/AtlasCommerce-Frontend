import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Tip güvenli hook'lar — useSelector/useDispatch yerine bunları kullan
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);

import { createContext, useContext, useReducer } from "react";
import { SepetReducer, initialState } from "./SepetReducer";

const SepetContext = createContext();

export function SepetProvider({ children }) {
    const [state, dispatch] = useReducer(SepetReducer, initialState);

    return (
        <SepetContext.Provider value={{ state, dispatch }}>
            {children}
        </SepetContext.Provider>
    )
}

export function useSepet() {
    return useContext(SepetContext);

}
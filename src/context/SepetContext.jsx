import { createContext, useContext, useReducer, useEffect } from "react";
import { SepetReducer, initialState } from "./SepetReducer";

const SepetContext = createContext();

export function SepetProvider({ children }) {
    const [state, dispatch] = useReducer(SepetReducer, initialState);

    useEffect(() => {
        localStorage.setItem("sepet", JSON.stringify(state.SepetNesneleri));
    }, [state.SepetNesneleri]);

    return (
        <SepetContext.Provider value={{ state, dispatch }}>
            {children}
        </SepetContext.Provider>
    )
}

export function useSepet() {
    return useContext(SepetContext);

}
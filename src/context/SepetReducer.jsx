export const initialState = {
    // LocalStorage'dan veri çekerken hata payını sıfırlıyoruz
    SepetNesneleri: Array.isArray(JSON.parse(localStorage.getItem("sepet")))
        ? JSON.parse(localStorage.getItem("sepet"))
        : [],
}

export function SepetReducer(state, action) {
    switch (action.type) {
        // VT'den gelen veriyi güvenli bir şekilde state'e aktarır
        case "SEPET_YUKLE": {
            return {
                ...state,
                SepetNesneleri: Array.isArray(action.payload) ? action.payload : []
            };
        }

        case "SEPETEEKLE": {
            const item = action.payload;
            const mevcutNesne = state.SepetNesneleri.find((urun) => urun.id === item.id);

            if (mevcutNesne) {
                return {
                    ...state,
                    SepetNesneleri: state.SepetNesneleri.map((urun) =>
                        urun.id === item.id ? { ...urun, miktar: (urun.miktar || 0) + 1 } : urun
                    )
                }
            } else {
                return {
                    ...state,
                    SepetNesneleri: [...state.SepetNesneleri, { ...item, miktar: 1 }]
                }
            }
        }

        case "SEPETCIKAR": {
            return {
                ...state,
                SepetNesneleri: state.SepetNesneleri.map((item) =>
                    item.id === action.payload ? { ...item, miktar: item.miktar - 1 } : item)
                    .filter((item) => item.miktar > 0),
            }
        }

        case "SEPETTEMIZLE": {
            return {
                ...state,
                SepetNesneleri: state.SepetNesneleri.filter((item) => item.id !== action.payload),
            }
        }
        default:
            return state;
    }
}
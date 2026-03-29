export const initialState = {
    SepetNesneleri: JSON.parse(localStorage.getItem("sepet")) || [],
}

export function SepetReducer(state, action) {
    switch (action.type) {
        case "SEPETEEKLE": {
            const item = action.payload;

            const mevcutNesne = state.SepetNesneleri.find(
                (urun) => urun.id === item.id
            )

            if (mevcutNesne) {
                return {
                    ...state,
                    SepetNesneleri: state.SepetNesneleri.map((urun) =>
                        urun.id === item.id ? { ...urun, miktar: urun.miktar + 1 } : urun
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
            const id = action.payload;

            return {
                ...state,
                SepetNesneleri: state.SepetNesneleri.map((item) =>
                    item.id === id ? { ...item, miktar: item.miktar - 1 } : item)
                    .filter((item) => item.miktar > 0),
            }
        }

        case "SEPETTEMIZLE": {
            const id = action.payload;
            return {
                ...state,
                SepetNesneleri: state.SepetNesneleri.filter((item) => item.id !== id),
            }
        }
        default:
            return state; //Sistemin bozulmaması için varsayılan olarak mevcut durumu döndürüyoruz
    }
}
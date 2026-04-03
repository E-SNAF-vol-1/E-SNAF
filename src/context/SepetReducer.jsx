export const initialState = {
    SepetNesneleri: Array.isArray(JSON.parse(localStorage.getItem("sepet")))
        ? JSON.parse(localStorage.getItem("sepet"))
        : [],
}

export function SepetReducer(state, action) {
    switch (action.type) {
        case "SEPET_YUKLE": {
            // Veritabanından gelen verilerdeki isimlendirmeyi standartlaştırıyoruz
            const yuklenenSepet = Array.isArray(action.payload)
                ? action.payload.map(item => ({
                    ...item,
                    isim: item.isim || item.urun_adi || item.ad || "İsimsiz Ürün"
                }))
                : [];
            return {
                ...state,
                SepetNesneleri: yuklenenSepet
            };
        }

        case "SEPETEEKLE": {
            const item = action.payload;

            // Ekleme anında ismi garanti altına alıyoruz
            const yeniNesne = {
                ...item,
                isim: item.isim || item.urun_adi || item.ad || "İsimsiz Ürün"
            };

            const mevcutNesneIndex = state.SepetNesneleri.findIndex((urun) => urun.id === yeniNesne.id);

            if (mevcutNesneIndex !== -1) {
                const yeniSepet = [...state.SepetNesneleri];
                yeniSepet[mevcutNesneIndex] = {
                    ...yeniSepet[mevcutNesneIndex],
                    miktar: (yeniSepet[mevcutNesneIndex].miktar || 0) + 1
                };
                return { ...state, SepetNesneleri: yeniSepet };
            } else {
                return {
                    ...state,
                    SepetNesneleri: [...state.SepetNesneleri, { ...yeniNesne, miktar: 1 }]
                };
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
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchTopProducts, type Product } from "../services/fakestore";

export type ProductItem = Product & { source: "api" | "local" };

const LS_KEY = "productsExtra";

function sortLocalFirst<T extends { source: "api" | "local" }>(arr: T[]) {
    return [...arr].sort((a, b) => (a.source === b.source ? 0 : a.source === "local" ? -1 : 1));
}

function loadLocal(): Product[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function persistLocal(items: ProductItem[]) {
    const onlyLocal: Product[] = items
        .filter(i => i.source === "local")
        .map(({ source, ...rest }) => rest);
    localStorage.setItem(LS_KEY, JSON.stringify(onlyLocal));
}

function genLocalId(items: ProductItem[]) {
    const base = 1000;
    const max = items.reduce((acc, it) => (it.id > acc ? it.id : acc), base);
    return Math.max(base, max) + 1;
}

export const initProducts = createAsyncThunk("products/init", async () => {
    const api = await fetchTopProducts(20);
    const apiItems: ProductItem[] = api.map(p => ({ ...p, source: "api" }));
    const local = loadLocal().map(p => ({
        ...p,
        source: "local" as const,
        id: typeof p.id === "number" && p.id >= 1000 ? p.id : 1000,
    }));
    return sortLocalFirst([...local, ...apiItems]);
});

type ProductsState = {
    items: ProductItem[];
    loading: boolean;
    error?: string;
};

const initialState: ProductsState = {
    items: [],
    loading: false,
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addLocalProduct: (state, action: PayloadAction<Product>) => {
            const item: ProductItem = { ...action.payload, id: genLocalId(state.items), source: "local" };
            state.items = sortLocalFirst([item, ...state.items]);
            persistLocal(state.items);
        },
        updateLocalProduct: (state, action: PayloadAction<Product>) => {
            const p = action.payload;
            state.items = state.items.map(it =>
                it.id === p.id && it.source === "local" ? ({ ...it, ...p } as ProductItem) : it
            );
            persistLocal(state.items);
        },
        deleteLocalProduct: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(it => !(it.id === action.payload && it.source === "local"));
            persistLocal(state.items);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(initProducts.pending, state => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(initProducts.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(initProducts.rejected, (state) => {
                state.loading = false;
                state.error = "Falha ao carregar produtos";
            });
    },
});

export const { addLocalProduct, updateLocalProduct, deleteLocalProduct } = productsSlice.actions;
export default productsSlice.reducer;

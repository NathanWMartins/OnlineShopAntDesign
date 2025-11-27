import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export type CartItem = {
    id: number;
    title: string;
    price: number;
    image: string;
    qty: number;
};

type CartState = {
    items: CartItem[];
};

const GUEST_KEY = "cartItems:guest";
const AUTH_KEY = (userId: number) => `cartItems:${userId}`;
const LS_USER_KEY = "authUser";

function getCurrentUserId(): number | null {
    try {
        const raw = localStorage.getItem(LS_USER_KEY);
        if (!raw) return null;
        const u = JSON.parse(raw);
        return typeof u?.id === "number" ? u.id : null;
    } catch {
        return null;
    }
}

function currentCartKey(): string {
    const uid = getCurrentUserId();
    return uid ? AUTH_KEY(uid) : GUEST_KEY;
}

function loadCartByKey(key: string): CartItem[] {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCartByKey(key: string, items: CartItem[]) {
    localStorage.setItem(key, JSON.stringify(items));
}

export function loadCartForCurrentUser(): CartItem[] {
    return loadCartByKey(currentCartKey());
}

const initialState: CartState = {
    items: loadCartForCurrentUser(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        replaceAll: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload ?? [];
            saveCartByKey(currentCartKey(), state.items);
        },

        addItem: (
            state,
            action: PayloadAction<{ id: number; title: string; price: number; image: string }>
        ) => {
            const { id, title, price, image } = action.payload;
            const found = state.items.find((it) => it.id === id);
            if (found) found.qty += 1;
            else state.items.unshift({ id, title, price, image, qty: 1 });
            saveCartByKey(currentCartKey(), state.items);
        },

        decrementItem: (state, action: PayloadAction<{ id: number }>) => {
            const it = state.items.find((i) => i.id === action.payload.id);
            if (!it) return;
            it.qty -= 1;
            if (it.qty <= 0) state.items = state.items.filter((i) => i.id !== action.payload.id);
            saveCartByKey(currentCartKey(), state.items);
        },

        removeItem: (state, action: PayloadAction<{ id: number }>) => {
            state.items = state.items.filter((i) => i.id !== action.payload.id);
            saveCartByKey(currentCartKey(), state.items);
        },

        clearCart: (state) => {
            state.items = [];
            saveCartByKey(currentCartKey(), state.items);
        },

        setQty: (state, action: PayloadAction<{ id: number; qty: number }>) => {
            const { id, qty } = action.payload;
            const it = state.items.find((i) => i.id === id);
            if (!it) return;
            it.qty = Math.max(1, Math.floor(qty || 1));
            saveCartByKey(currentCartKey(), state.items);
        },
    },
});

export const {
    replaceAll,
    addItem,
    decrementItem,
    removeItem,
    clearCart,
    setQty,
} = cartSlice.actions;

export default cartSlice.reducer;

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(selectCartState, (s) => s.items);
export const selectCartCount = createSelector(selectCartItems, (items) =>
    items.reduce((acc, it) => acc + it.qty, 0)
);
export const selectCartTotal = createSelector(selectCartItems, (items) =>
    items.reduce((acc, it) => acc + it.price * it.qty, 0)
);

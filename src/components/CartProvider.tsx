"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export type CartItem = {
  productId: number;
  slug: string;
  sku: string;
  name: string;
  priceTzs: number;
  image: string | null;
  variation?: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: number, variation: string | null | undefined, quantity: number) => void;
  removeItem: (productId: number, variation?: string | null) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pk_cart_v1";

function cartKey(productId: number, variation?: string | null) {
  return `${productId}::${variation ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Reading persisted cart state from localStorage must happen after mount
  // (the server has no localStorage, and the client's first render has to
  // match the server-rendered markup to avoid a hydration mismatch), so this
  // intentionally hydrates state inside an effect rather than during render.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount hydration, see comment above
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode, etc.) - fail silently
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const key = cartKey(item.productId, item.variation);
      const existing = prev.find((p) => cartKey(p.productId, p.variation) === key);
      if (existing) {
        return prev.map((p) =>
          cartKey(p.productId, p.variation) === key
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: number, variation: string | null | undefined, quantity: number) => {
      setItems((prev) => {
        const key = cartKey(productId, variation);
        if (quantity <= 0) {
          return prev.filter((p) => cartKey(p.productId, p.variation) !== key);
        }
        return prev.map((p) =>
          cartKey(p.productId, p.variation) === key ? { ...p, quantity } : p
        );
      });
    },
    []
  );

  const removeItem = useCallback((productId: number, variation?: string | null) => {
    const key = cartKey(productId, variation);
    setItems((prev) => prev.filter((p) => cartKey(p.productId, p.variation) !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.priceTzs * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

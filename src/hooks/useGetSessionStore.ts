import { useEffect, useState } from "react";

export const useSessionStore = () => {
  const [store, setStore] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storeId = sessionStorage.getItem("storeId");
    const storeName = sessionStorage.getItem("storeName");

    if (storeId && storeName) {
      setStore({ id: storeId, name: storeName });
    }
  }, []);

  const updateStore = (value: { id: string; name: string } | null) => {
    if (typeof window === "undefined") return;

    if (value === null) {
      sessionStorage.removeItem("storeId");
      sessionStorage.removeItem("storeName");
    } else {
      sessionStorage.setItem("storeId", value.id);
      sessionStorage.setItem("storeName", value.name);
    }

    setStore(value);
  };

  return {
    store,
    setStore: updateStore,
  };
};

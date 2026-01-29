import { useEffect, useState } from "react";

export const useSessionStoreId = () => {
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const value = sessionStorage.getItem("storeId");
    setStoreId(value);
  }, []);

  const updateStoreId = (value: string | null) => {
    if (typeof window === "undefined") return;

    if (value === null) {
      sessionStorage.removeItem("storeId");
    } else {
      sessionStorage.setItem("storeId", value);
    }

    setStoreId(value);
  };

  return {
    storeId,
    setStoreId: updateStoreId,
  };
};

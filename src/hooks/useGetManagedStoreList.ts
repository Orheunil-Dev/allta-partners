import { useSessionStore } from "./useGetSessionStore";
import { useStoreControllerGetManagedStoreList } from "@/api/store/store";
import { ManagedStoreListItem } from "@/api/models";
import { useEffect } from "react";

export const useGetManagedStoreList = (): ManagedStoreListItem[] => {
  // 선택된 매장
  const { store, setStore } = useSessionStore();

  //  관리자 권한 있는 매장 목록 조회 API
  const { data } = useStoreControllerGetManagedStoreList();

  useEffect(() => {
    if (data?.data.length !== 1) return;

    const storeData = data.data[0];

    // 이미 같은 값이면 set 안 함 (중요)
    if (store?.id === storeData.id) return;

    setStore({ id: storeData.id, name: storeData.name });
  }, [data, store?.id, setStore]);

  return data?.data ?? [];
};

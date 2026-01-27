import { useStoreControllerGetManagedStoreList } from "@/api/store/store";
import { ManagedStoreListItem } from "@/api/models";

export const useGetManagedStoreList = (): ManagedStoreListItem[] => {
  const { data } = useStoreControllerGetManagedStoreList();

  return data?.data ?? [];
};

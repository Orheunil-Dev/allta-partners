"use client";

import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import Image from "next/image";
import Select, {
  SingleValueProps,
  StylesConfig,
  components,
} from "react-select";
import { useStoreControllerGetManagedStoreList } from "@/api/store/store";
import { SelectOption } from "@/types";
import { conditionBarIcon } from "../../../../public/images";

interface Props {
  storeId: string | null;
  setStoreId: Dispatch<SetStateAction<string | null>>;
  setStoreName?: Dispatch<SetStateAction<string | null>>;
  showEntireStore?: boolean;
}

export const SimpleConditionBar = ({
  storeId,
  setStoreId,
  setStoreName,
  showEntireStore = true,
}: Props) => {
  //  관리자 권한 있는 매장 목록 조회 API
  const { data } = useStoreControllerGetManagedStoreList({
    query: {
      staleTime: 1000 * 60 * 30, // 30분 동안 캐시 신선
      gcTime: 1000 * 60 * 60, // 1시간 동안 메모리에 데이터 캐싱
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 막기
      queryKey: ["managedStoreList"],
    },
  });

  const CustomSingleValue = (props: SingleValueProps<SelectOption>) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-x-[4px] whitespace-nowrap">
          <Image src={conditionBarIcon} alt="매장" className="size-[20px]" />
          <span>{props.children}</span>
        </div>
      </components.SingleValue>
    );
  };

  const selectOptions: SelectOption[] = useMemo(() => {
    if (!data) return [];

    const stores = data.data.map((store) => ({
      value: store.id,
      label: store.name,
    }));

    if (data.data.length <= 1 || !showEntireStore) {
      return stores;
    }

    return [{ value: null, label: "전체 매장" }, ...stores];
  }, [data]);

  useEffect(() => {
    if (data && (data?.data.length === 1 || !showEntireStore)) {
      setStoreId(data.data[0].id);

      if (setStoreName) setStoreName(data.data[0].name);
    }
  }, [data]);

  return (
    <Select<SelectOption>
      options={selectOptions}
      value={
        selectOptions.find((opt) => opt.value === storeId) ??
        selectOptions.find((opt) => opt.value === null) ??
        null
      }
      onChange={(opt) => {
        setStoreId((opt?.value as string) ?? null);

        if (setStoreName) setStoreName((opt?.label as string) ?? null);
      }}
      components={{
        IndicatorSeparator: () => null,
        SingleValue: CustomSingleValue,
      }}
      isSearchable={false}
      menuPosition="fixed"
      menuPlacement="auto"
      styles={selectStyles}
    />
  );
};

const selectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "16px",
  }),
  control: (provided) => ({
    ...provided,
    width: "200px",
    minHeight: "34px",
    padding: "8px 10px",
    borderWidth: "1px",
    borderColor: "#ECECEE",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    whiteSpace: "nowrap",
  }),
  menu: (provided) => ({
    ...provided,
    width: "160px",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

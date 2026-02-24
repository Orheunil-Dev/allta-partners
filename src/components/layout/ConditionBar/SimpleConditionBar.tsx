"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Select, {
  SingleValueProps,
  StylesConfig,
  components,
} from "react-select";
import dayjs from "dayjs";
import { useGetManagedStoreList, useResizeHandler } from "@/hooks";
import { SelectOption } from "@/types";
import { Callout } from "@/components/ui/Callout";
import { conditionBarIcon } from "../../../../public/images";

interface Props {
  storeId: string | null;
  setStoreId: Dispatch<SetStateAction<string | null>>;
  showEntireStore?: boolean;
}

export const SimpleConditionBar = ({
  storeId,
  setStoreId,
  showEntireStore = true,
}: Props) => {
  const managedStoreList = useGetManagedStoreList();

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
    const stores = managedStoreList.map((store) => ({
      value: store.id,
      label: store.name,
    }));

    if (managedStoreList.length <= 1 || !showEntireStore) {
      return stores;
    }

    return [{ value: null, label: "전체 매장" }, ...stores];
  }, [managedStoreList]);

  useEffect(() => {
    if (managedStoreList.length === 1) {
      setStoreId(managedStoreList[0].id);
    }
  }, [managedStoreList]);

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

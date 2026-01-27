import { useMemo } from "react";
import Select, { StylesConfig } from "react-select";
import { useGetManagedStoreList } from "@/hooks";
import { SelectOption } from "@/types";

interface Props {
  value?: string;
  setValue: (value: string) => void;
  width?: string;
}

export const StoreSelect = ({ value, setValue, width }: Props) => {
  // 관리자 권한 있는 매장 목록
  const managedStoreList = useGetManagedStoreList();

  const storeOptions = useMemo<SelectOption[]>(
    () =>
      (managedStoreList ?? []).map((store) => ({
        value: store.id,
        label: store.name,
      })),
    [managedStoreList],
  );

  return (
    <Select<SelectOption>
      options={storeOptions}
      value={storeOptions.find((option) => option.value === value)}
      onChange={(option) => {
        if (option && typeof option.value === "string") {
          setValue(option.value);
        }
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
      isSearchable={false}
      placeholder="매장을 선택해주세요."
      styles={selectStyles(width)}
    />
  );
};

const selectStyles = (width?: string): StylesConfig<SelectOption> => ({
  container: (provided) => ({
    ...provided,
    fontSize: "14px",
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  control: (provided) => ({
    ...provided,
    width,
    height: "34px",
    padding: "0 12px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "6px",
    outline: "none",
    cursor: "pointer",
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
    fontSize: "14px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "85px",
    padding: 0,
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    width,
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "14px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontSize: "14px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
});

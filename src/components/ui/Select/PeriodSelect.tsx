import { Dispatch, SetStateAction } from "react";
import Select, { StylesConfig } from "react-select";
import { Period, SelectOption } from "@/types";

const periodOptions = [
  { value: "DAY", label: "일" },
  { value: "WEEK", label: "주" },
  { value: "MONTH", label: "월" },
];

interface Props {
  period: Period;
  setPeriod: Dispatch<SetStateAction<Period>>;
}

export const PeriodSelect = ({ period, setPeriod }: Props) => {
  return (
    <Select<SelectOption>
      options={periodOptions}
      value={periodOptions.find((option) => option.value === period)}
      onChange={(option) => {
        if (option && typeof option.value === "string") {
          setPeriod(option.value as "DAY" | "WEEK" | "MONTH");
        }
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
      isSearchable={false}
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
    fontSize: "13px",
  }),
  control: (provided) => ({
    ...provided,
    width: "60px",
    minHeight: "34px",
    padding: "6px 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "60px",
    padding: 0,
  }),
  menu: (provided) => ({
    ...provided,
    width: "60px",
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
    fontSize: "13px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: "13px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
};
